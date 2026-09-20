<?php

namespace Tests\Feature;

use App\Models\BumdesType;
use App\Models\InventoryItem;
use Database\Seeders\BumdesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BumdesBackendTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(BumdesSeeder::class);
    }

    public function test_all_web_routes_can_be_rendered(): void
    {
        $routes = [
            '/login',
            '/dashboard',
            '/uang-masuk',
            '/uang-keluar',
            '/barang',
            '/peminjaman',
            '/jenis-bumdes',
            '/simpan-pinjam',
            '/laporan',
            '/profile',
        ];

        foreach ($routes as $route) {
            $response = $this->get($route);
            $response->assertOk();
        }
    }

    public function test_api_bootstrap_returns_database_data(): void
    {
        $response = $this->getJson('/api/bootstrap');

        $response->assertOk()
            ->assertJsonStructure([
                'settings',
                'bumdesTypes',
                'items',
                'income',
                'expenses',
                'loans',
                'savingsLoans',
                'savingsLoanPayments',
                'notifications',
                'users',
            ]);
    }

    public function test_income_can_be_stored_in_database(): void
    {
        $type = BumdesType::first();

        $response = $this->post('/uang-masuk', [
            'bumdesTypeId' => $type->id,
            'date' => '2026-09-20',
            'source' => 'Penjualan Bibit',
            'category' => 'Penjualan',
            'description' => 'Penjualan bibit jagung',
            'amount' => 250000,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('incomes', [
            'source' => 'Penjualan Bibit',
            'amount' => 250000,
        ]);
    }

    public function test_loan_can_be_created_and_returned(): void
    {
        $item = InventoryItem::first();
        $initialBorrowed = $item->borrowed;

        $response = $this->post('/peminjaman', [
            'borrowerName' => 'Warga Test',
            'phone' => '081234567899',
            'itemId' => $item->id,
            'quantity' => 2,
            'borrowDate' => '2026-09-20',
            'returnDate' => '2026-09-22',
            'purpose' => 'Hajatan',
            'notes' => 'Harus kembali utuh',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('loans', [
            'borrower_name' => 'Warga Test',
            'quantity' => 2,
            'status' => 'borrowed',
        ]);

        $item->refresh();
        $this->assertSame($initialBorrowed + 2, $item->borrowed);
    }
}
