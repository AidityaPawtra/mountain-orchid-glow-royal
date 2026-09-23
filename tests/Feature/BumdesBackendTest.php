<?php

namespace Tests\Feature;

use App\Models\BumdesType;
use App\Models\Income;
use App\Models\InventoryItem;
use App\Models\Loan;
use App\Models\Notification;
use App\Models\SavingsLoan;
use App\Models\SavingsLoanPayment;
use App\Models\User;
use Database\Seeders\BumdesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BumdesBackendTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(BumdesSeeder::class);
        $this->admin = User::where('email', 'admin@bumdeswengkal.id')->firstOrFail();
    }

    // ------------------------------------------------------------------
    // Helper
    // ------------------------------------------------------------------

    private function makeItem(int $quantity = 10, int $borrowed = 0): InventoryItem
    {
        return InventoryItem::create([
            'id' => 'item-test',
            'name' => 'Kursi Uji',
            'category' => 'Perlengkapan',
            'quantity' => $quantity,
            'borrowed' => $borrowed,
            'condition' => 'Baik',
        ]);
    }

    private function makeLoan(InventoryItem $item, int $quantity, string $status = 'borrowed'): Loan
    {
        return Loan::create([
            'id' => 'loan-test',
            'borrower_name' => 'Pak Sutrisno',
            'phone' => '081234567890',
            'item_id' => $item->id,
            'item_name' => $item->name,
            'quantity' => $quantity,
            'borrow_date' => '2026-09-20',
            'return_date' => '2026-09-25',
            'actual_return_date' => null,
            'purpose' => 'Hajatan',
            'notes' => '',
            'status' => $status,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function loanPayload(InventoryItem $item, int $quantity): array
    {
        return [
            'borrowerName' => 'Warga Uji',
            'phone' => '081234567899',
            'itemId' => $item->id,
            'quantity' => $quantity,
            'borrowDate' => '2026-09-20',
            'returnDate' => '2026-09-22',
            'purpose' => 'Hajatan',
            'notes' => '',
        ];
    }

    private function makeSavingsLoan(): SavingsLoan
    {
        return SavingsLoan::create([
            'id' => 'sl-test',
            'borrower_name' => 'Bu Ani',
            'phone' => '081200000000',
            'address' => 'Dusun 1',
            'loan_date' => '2026-09-01',
            'due_date' => '2026-12-01',
            'loan_amount' => 1000000,
            'installment_amount' => 100000,
            'total_paid' => 0,
            'purpose' => 'Modal usaha',
            'notes' => '',
            'status' => 'active',
        ]);
    }

    // ------------------------------------------------------------------
    // Akses & halaman
    // ------------------------------------------------------------------

    public function test_guest_is_redirected_to_login_from_every_page(): void
    {
        $pages = [
            '/dashboard', '/uang-masuk', '/uang-keluar', '/barang', '/peminjaman',
            '/jenis-bumdes', '/simpan-pinjam', '/laporan', '/profile',
        ];

        foreach ($pages as $page) {
            $this->get($page)->assertRedirect(route('login'));
        }
    }

    public function test_all_pages_render_for_logged_in_admin_with_database_props(): void
    {
        $item = $this->makeItem();
        $loan = $this->makeLoan($item, 1);
        $type = BumdesType::create([
            'id' => 'bumdes-test', 'name' => 'Unit Uji', 'category' => 'Uji',
            'description' => '', 'status' => 'active',
        ]);

        $this->actingAs($this->admin);

        $this->get('/dashboard')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')->has('income')->has('expenses')->has('loans'));

        $this->get('/uang-masuk')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('UangMasuk')->has('income')->has('bumdesTypes'));

        $this->get('/uang-keluar')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('UangKeluar')->has('expenses')->has('bumdesTypes'));

        $this->get('/barang')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Barang')->has('items'));

        $this->get('/peminjaman')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Peminjaman/Index')->has('loans')->has('items'));

        $this->get('/peminjaman/'.$loan->id)->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Peminjaman/Show')->has('loan')->has('items'));

        $this->get('/jenis-bumdes')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('JenisBumdes/Index')->has('bumdesTypes'));

        $this->get('/jenis-bumdes/'.$type->id)->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('JenisBumdes/Show')->has('bumdesType'));

        $this->get('/simpan-pinjam')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('SimpanPinjam')->has('savingsLoans')->has('savingsLoanPayments'));

        $this->get('/laporan')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Laporan')->has('income')->has('expenses'));

        $this->get('/profile')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Profile')->has('settings')->has('user'));
    }

    public function test_settings_and_notifications_are_shared_to_every_page(): void
    {
        $this->actingAs($this->admin)
            ->get('/barang')
            ->assertInertia(fn (Assert $page) => $page->has('settings')->has('notifications'));
    }

    public function test_old_public_api_endpoints_no_longer_exist(): void
    {
        $this->getJson('/api/bootstrap')->assertNotFound();
        $this->postJson('/api/income', [])->assertNotFound();
    }

    // ------------------------------------------------------------------
    // Login & password (keluhan utama)
    // ------------------------------------------------------------------

    public function test_admin_can_login_with_username_and_with_email(): void
    {
        $this->post('/login', ['username' => 'admin', 'password' => 'admin123'])
            ->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($this->admin);

        $this->post('/logout');
        $this->assertGuest();

        $this->post('/login', ['username' => 'admin@bumdeswengkal.id', 'password' => 'admin123'])
            ->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($this->admin);
    }

    public function test_changed_password_is_used_by_the_next_login_and_old_password_is_rejected(): void
    {
        $this->actingAs($this->admin)
            ->post('/profile/password', [
                'currentPassword' => 'admin123',
                'newPassword' => 'PasswordBaru123',
            ])
            ->assertSessionHasNoErrors();

        // Tersimpan (ter-hash) di tabel users, sumber yang sama dengan halaman login.
        $this->assertTrue(Hash::check('PasswordBaru123', $this->admin->fresh()->password));
        $this->assertFalse(Hash::check('admin123', $this->admin->fresh()->password));

        $this->post('/logout');
        $this->assertGuest();

        // Password lama harus ditolak.
        $this->post('/login', ['username' => 'admin', 'password' => 'admin123'])
            ->assertSessionHasErrors('username');
        $this->assertGuest();

        // Password baru harus diterima.
        $this->post('/login', ['username' => 'admin', 'password' => 'PasswordBaru123'])
            ->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($this->admin);
    }

    public function test_changing_password_again_requires_the_latest_password(): void
    {
        $this->actingAs($this->admin);

        $this->post('/profile/password', ['currentPassword' => 'admin123', 'newPassword' => 'Password2-Baru'])
            ->assertSessionHasNoErrors();

        // Password awal tidak lagi valid sebagai "password saat ini".
        $this->post('/profile/password', ['currentPassword' => 'admin123', 'newPassword' => 'Password3-Baru'])
            ->assertSessionHasErrors('currentPassword');

        $this->post('/profile/password', ['currentPassword' => 'Password2-Baru', 'newPassword' => 'Password3-Baru'])
            ->assertSessionHasNoErrors();

        $this->assertTrue(Hash::check('Password3-Baru', $this->admin->fresh()->password));
    }

    public function test_wrong_current_password_does_not_change_anything(): void
    {
        $this->actingAs($this->admin)
            ->post('/profile/password', ['currentPassword' => 'salah', 'newPassword' => 'PasswordBaru123'])
            ->assertSessionHasErrors('currentPassword');

        $this->assertTrue(Hash::check('admin123', $this->admin->fresh()->password));
    }

    public function test_new_password_must_be_at_least_8_characters_and_different(): void
    {
        $this->actingAs($this->admin);

        $this->post('/profile/password', ['currentPassword' => 'admin123', 'newPassword' => 'pendek'])
            ->assertSessionHasErrors('newPassword');

        $this->post('/profile/password', ['currentPassword' => 'admin123', 'newPassword' => 'admin123'])
            ->assertSessionHasErrors('newPassword');

        $this->assertTrue(Hash::check('admin123', $this->admin->fresh()->password));
    }

    public function test_saving_profile_does_not_touch_the_password_and_username_change_works_for_login(): void
    {
        $this->actingAs($this->admin)
            ->post('/profile', [
                'bumdesName' => 'BUMDes Uji',
                'villageName' => 'Desa Uji',
                'address' => 'Jl. Uji',
                'phone' => '0800',
                'email' => 'bumdes@uji.id',
                'adminName' => 'Admin Baru',
                'adminUsername' => 'adminbaru',
                'adminEmail' => 'adminbaru@uji.id',
            ])
            ->assertSessionHasNoErrors();

        $fresh = $this->admin->fresh();
        $this->assertSame('adminbaru', $fresh->username);
        $this->assertTrue(Hash::check('admin123', $fresh->password));
        $this->assertDatabaseHas('settings', ['bumdes_name' => 'BUMDes Uji', 'admin_username' => 'adminbaru']);

        $this->post('/logout');
        $this->post('/login', ['username' => 'adminbaru', 'password' => 'admin123'])
            ->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($fresh);
    }

    public function test_profile_rejects_username_or_email_used_by_another_account(): void
    {
        User::create([
            'name' => 'Kasir',
            'username' => 'kasir',
            'email' => 'kasir@uji.id',
            'password' => 'rahasia123',
        ]);

        $payload = [
            'bumdesName' => 'BUMDes Uji',
            'villageName' => 'Desa Uji',
            'adminName' => 'Admin',
            'adminUsername' => 'kasir',
            'adminEmail' => 'admin@bumdeswengkal.id',
        ];

        $this->actingAs($this->admin)
            ->post('/profile', $payload)
            ->assertSessionHasErrors('adminUsername');

        $this->post('/profile', array_merge($payload, ['adminUsername' => 'admin', 'adminEmail' => 'kasir@uji.id']))
            ->assertSessionHasErrors('adminEmail');
    }

    public function test_reseeding_does_not_reset_a_changed_password(): void
    {
        $this->actingAs($this->admin)
            ->post('/profile/password', ['currentPassword' => 'admin123', 'newPassword' => 'PasswordBaru123']);

        $this->seed(BumdesSeeder::class);

        $this->assertTrue(Hash::check('PasswordBaru123', $this->admin->fresh()->password));
    }

    // ------------------------------------------------------------------
    // Barang & peminjaman
    // ------------------------------------------------------------------

    public function test_item_can_be_created_updated_and_deleted(): void
    {
        $this->actingAs($this->admin);

        $this->post('/barang', [
            'name' => 'Tenda Uji', 'category' => 'Perlengkapan', 'quantity' => 5, 'condition' => 'Baik',
        ])->assertSessionHasNoErrors();

        $item = InventoryItem::where('name', 'Tenda Uji')->firstOrFail();
        $this->assertSame(0, $item->borrowed);

        $this->put('/barang/'.$item->id, [
            'name' => 'Tenda Uji 2', 'category' => 'Perlengkapan', 'quantity' => 7, 'condition' => 'Rusak Ringan',
        ])->assertSessionHasNoErrors();
        $this->assertDatabaseHas('inventory_items', ['id' => $item->id, 'name' => 'Tenda Uji 2', 'quantity' => 7]);

        $this->delete('/barang/'.$item->id)->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('inventory_items', ['id' => $item->id]);
    }

    public function test_item_that_is_borrowed_cannot_be_deleted_or_reduced_below_borrowed(): void
    {
        $item = $this->makeItem(10, 4);
        $this->actingAs($this->admin);

        $this->delete('/barang/'.$item->id)->assertSessionHasErrors('item');
        $this->assertDatabaseHas('inventory_items', ['id' => $item->id]);

        $this->put('/barang/'.$item->id, [
            'name' => 'Kursi Uji', 'category' => 'Perlengkapan', 'quantity' => 3, 'condition' => 'Baik',
        ])->assertSessionHasErrors('quantity');
        $this->assertSame(10, $item->fresh()->quantity);
    }

    public function test_loan_create_reduces_stock_and_is_rejected_when_stock_is_not_enough(): void
    {
        $item = $this->makeItem(5, 0);
        $this->actingAs($this->admin);

        $this->post('/peminjaman', $this->loanPayload($item, 2))->assertSessionHasNoErrors();
        $this->assertDatabaseHas('loans', ['borrower_name' => 'Warga Uji', 'quantity' => 2, 'status' => 'borrowed']);
        $this->assertSame(2, $item->fresh()->borrowed);

        $this->post('/peminjaman', $this->loanPayload($item, 4))->assertSessionHasErrors('quantity');
        $this->assertSame(2, $item->fresh()->borrowed);
        $this->assertSame(1, Loan::where('borrower_name', 'Warga Uji')->count());
    }

    public function test_loan_update_adjusts_stock_and_checks_availability(): void
    {
        $item = $this->makeItem(5, 2);
        $loan = $this->makeLoan($item, 2);
        $this->actingAs($this->admin);

        $this->put('/peminjaman/'.$loan->id, $this->loanPayload($item, 4))->assertSessionHasNoErrors();
        $this->assertSame(4, $item->fresh()->borrowed);
        $this->assertSame(4, $loan->fresh()->quantity);

        // Sisa stok hanya 1, minta tambah 2 lagi.
        $this->put('/peminjaman/'.$loan->id, $this->loanPayload($item, 6))->assertSessionHasErrors('quantity');
        $this->assertSame(4, $item->fresh()->borrowed);
    }

    public function test_loan_return_restores_stock_and_returned_loan_cannot_be_edited(): void
    {
        $item = $this->makeItem(5, 2);
        $loan = $this->makeLoan($item, 2);
        $this->actingAs($this->admin);

        $this->post('/peminjaman/'.$loan->id.'/return')->assertSessionHasNoErrors();
        $this->assertSame(0, $item->fresh()->borrowed);
        $this->assertSame('returned', $loan->fresh()->status);
        $this->assertNotNull($loan->fresh()->actual_return_date);

        // Klik dua kali tidak boleh mengurangi stok dua kali.
        $this->post('/peminjaman/'.$loan->id.'/return');
        $this->assertSame(0, $item->fresh()->borrowed);

        $this->put('/peminjaman/'.$loan->id, $this->loanPayload($item, 1))->assertSessionHasErrors('loan');
    }

    public function test_deleting_an_active_or_overdue_loan_restores_stock_and_goes_back_to_the_list(): void
    {
        $item = $this->makeItem(5, 2);
        $loan = $this->makeLoan($item, 2, 'overdue');
        $this->actingAs($this->admin);

        $this->delete('/peminjaman/'.$loan->id)->assertRedirect(route('peminjaman.index'));

        $this->assertDatabaseMissing('loans', ['id' => $loan->id]);
        $this->assertSame(0, $item->fresh()->borrowed);
    }

    public function test_deleting_a_returned_loan_does_not_change_stock(): void
    {
        $item = $this->makeItem(5, 1);
        $loan = $this->makeLoan($item, 2, 'returned');
        $this->actingAs($this->admin);

        $this->delete('/peminjaman/'.$loan->id);

        $this->assertSame(1, $item->fresh()->borrowed);
    }

    // ------------------------------------------------------------------
    // Keuangan & unit BUMDes
    // ------------------------------------------------------------------

    public function test_income_and_expense_are_linked_to_a_bumdes_unit_and_shown_on_its_page(): void
    {
        $type = BumdesType::create([
            'id' => 'bumdes-test', 'name' => 'Unit Uji', 'category' => 'Uji',
            'description' => '', 'status' => 'active',
        ]);
        $this->actingAs($this->admin);

        $this->post('/uang-masuk', [
            'bumdesTypeId' => $type->id, 'date' => '2026-09-20', 'source' => 'Penjualan Bibit',
            'category' => 'Penjualan', 'description' => 'Bibit jagung', 'amount' => 250000,
        ])->assertSessionHasNoErrors();

        $this->post('/uang-keluar', [
            'bumdesTypeId' => $type->id, 'date' => '2026-09-21', 'category' => 'Operasional',
            'purpose' => 'Beli pupuk', 'description' => 'Pupuk', 'amount' => 100000,
        ])->assertSessionHasNoErrors();

        $this->get('/jenis-bumdes/'.$type->id)->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('JenisBumdes/Show')
            ->has('bumdesType.incomes', 1)
            ->has('bumdesType.expenses', 1));

        // Hapus unit: transaksi tetap ada, hanya tidak terhubung ke unit lagi.
        $this->delete('/jenis-bumdes/'.$type->id)->assertSessionHasNoErrors();
        $income = Income::where('source', 'Penjualan Bibit')->firstOrFail();
        $this->assertNull($income->bumdes_type_id);
    }

    public function test_income_can_be_updated_and_deleted(): void
    {
        $this->actingAs($this->admin);

        $this->post('/uang-masuk', [
            'date' => '2026-09-20', 'source' => 'Sewa Tenda', 'category' => 'Sewa',
            'description' => 'Sewa', 'amount' => 100000,
        ]);
        $income = Income::where('source', 'Sewa Tenda')->firstOrFail();

        $this->put('/uang-masuk/'.$income->id, [
            'date' => '2026-09-21', 'source' => 'Sewa Tenda', 'category' => 'Sewa',
            'description' => 'Sewa (revisi)', 'amount' => 150000,
        ])->assertSessionHasNoErrors();
        $this->assertSame('Sewa (revisi)', $income->fresh()->description);

        $this->delete('/uang-masuk/'.$income->id)->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('incomes', ['id' => $income->id]);
    }

    // ------------------------------------------------------------------
    // Simpan pinjam uang
    // ------------------------------------------------------------------

    public function test_savings_loan_payment_updates_total_paid_and_marks_paid_when_complete(): void
    {
        $loan = $this->makeSavingsLoan();
        $this->actingAs($this->admin);

        $this->post('/simpan-pinjam/'.$loan->id.'/payment', [
            'paymentDate' => '2026-09-10', 'amount' => 300000, 'notes' => 'Angsuran 1',
        ])->assertSessionHasNoErrors();

        $loan->refresh();
        $this->assertEqualsWithDelta(300000.0, (float) $loan->total_paid, 0.001);
        $this->assertSame('active', $loan->status);

        // Melebihi sisa (700.000) ditolak.
        $this->post('/simpan-pinjam/'.$loan->id.'/payment', [
            'paymentDate' => '2026-09-11', 'amount' => 800000,
        ])->assertSessionHasErrors('amount');
        $this->assertSame(1, SavingsLoanPayment::where('savings_loan_id', $loan->id)->count());

        $this->post('/simpan-pinjam/'.$loan->id.'/payment', [
            'paymentDate' => '2026-09-12', 'amount' => 700000,
        ])->assertSessionHasNoErrors();

        $this->assertSame('paid', $loan->fresh()->status);
    }

    public function test_savings_loan_can_be_updated_and_deleting_it_removes_its_payments(): void
    {
        $loan = $this->makeSavingsLoan();
        $this->actingAs($this->admin);

        $this->post('/simpan-pinjam/'.$loan->id.'/payment', ['paymentDate' => '2026-09-10', 'amount' => 100000]);

        $this->put('/simpan-pinjam/'.$loan->id, [
            'borrowerName' => 'Bu Ani Revisi', 'phone' => '081200000000', 'address' => 'Dusun 2',
            'loanDate' => '2026-09-01', 'dueDate' => '2026-12-31', 'loanAmount' => 2000000,
            'installmentAmount' => 200000, 'purpose' => 'Modal', 'notes' => '',
        ])->assertSessionHasNoErrors();
        $this->assertSame('Bu Ani Revisi', $loan->fresh()->borrower_name);

        $this->delete('/simpan-pinjam/'.$loan->id)->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('savings_loans', ['id' => $loan->id]);
        $this->assertDatabaseMissing('savings_loan_payments', ['savings_loan_id' => $loan->id]);
    }

    // ------------------------------------------------------------------
    // Topbar: notifikasi & pencarian
    // ------------------------------------------------------------------

    public function test_notifications_can_be_marked_as_read(): void
    {
        $this->actingAs($this->admin);

        $this->assertDatabaseHas('notifications', ['id' => 'ntf-01', 'read' => false]);

        $this->post('/notifications/ntf-01/read')->assertSessionHasNoErrors();
        $this->assertDatabaseHas('notifications', ['id' => 'ntf-01', 'read' => true]);

        $this->post('/notifications/read-all')->assertSessionHasNoErrors();
        $this->assertSame(0, Notification::where('read', false)->count());
    }

    public function test_global_search_reads_from_database_and_requires_login(): void
    {
        $item = $this->makeItem();
        $loan = $this->makeLoan($item, 1);

        $this->getJson('/pencarian?q=Sutrisno')->assertUnauthorized();

        $this->actingAs($this->admin);

        $this->getJson('/pencarian?q=Sutrisno')
            ->assertOk()
            ->assertJsonFragment(['to' => '/peminjaman/'.$loan->id]);

        $this->getJson('/pencarian?q=Kursi Uji')
            ->assertOk()
            ->assertJsonFragment(['to' => '/barang']);

        // Kata kunci terlalu pendek: kosong.
        $this->getJson('/pencarian?q=a')->assertOk()->assertExactJson([]);
    }
}
