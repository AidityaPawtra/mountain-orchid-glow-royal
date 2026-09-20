<?php

namespace Database\Seeders;

use App\Models\BumdesType;
use App\Models\Expense;
use App\Models\Income;
use App\Models\InventoryItem;
use App\Models\Loan;
use App\Models\Notification;
use App\Models\SavingsLoan;
use App\Models\SavingsLoanPayment;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BumdesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Akun Admin Default
        User::updateOrCreate(
            ['email' => 'admin@bumdeswengkal.id'],
            [
                'name' => 'Admin',
                'username' => 'admin',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Profil & Pengaturan BUMDes
        Setting::updateOrCreate(
            ['id' => 1],
            [
                'bumdes_name' => 'BUMDes Desa Wengkal',
                'village_name' => 'Desa Wengkal',
                'address' => 'Jl. Raya Wengkal No. 01, Kecamatan Wengkal',
                'phone' => '0812-3456-7890',
                'email' => 'bumdes@desawengkal.id',
                'admin_name' => 'Admin',
                'admin_username' => 'admin',
                'admin_email' => 'admin@bumdeswengkal.id',
            ]
        );

        // 3. Unit / Jenis Usaha BUMDes
        $bumdesTypes = [
            [
                'id' => 'bumdes-perdagangan',
                'name' => 'Unit Perdagangan',
                'category' => 'Perdagangan',
                'description' => 'Unit usaha yang mengelola kegiatan perdagangan dan penjualan produk.',
                'status' => 'active',
                'created_at' => '2026-01-01 08:00:00',
            ],
            [
                'id' => 'bumdes-persewaan',
                'name' => 'Unit Persewaan',
                'category' => 'Persewaan',
                'description' => 'Unit usaha yang mengelola jasa persewaan fasilitas dan barang BUMDes.',
                'status' => 'active',
                'created_at' => '2026-01-01 08:05:00',
            ],
            [
                'id' => 'bumdes-simpan-pinjam',
                'name' => 'Unit Simpan Pinjam',
                'category' => 'Simpan Pinjam',
                'description' => 'Unit usaha yang mengelola kegiatan simpanan dan pinjaman masyarakat.',
                'status' => 'active',
                'created_at' => '2026-01-01 08:10:00',
            ],
        ];

        foreach ($bumdesTypes as $type) {
            BumdesType::updateOrCreate(['id' => $type['id']], $type);
        }

        // 4. Barang Inventaris
        $items = [
            ['id' => 'item-kursi', 'name' => 'Kursi', 'category' => 'Perlengkapan', 'quantity' => 100, 'borrowed' => 50, 'condition' => 'Baik'],
            ['id' => 'item-tenda', 'name' => 'Tenda', 'category' => 'Perlengkapan', 'quantity' => 10, 'borrowed' => 2, 'condition' => 'Baik'],
            ['id' => 'item-sound', 'name' => 'Sound System', 'category' => 'Elektronik', 'quantity' => 3, 'borrowed' => 1, 'condition' => 'Baik'],
            ['id' => 'item-meja', 'name' => 'Meja Lipat', 'category' => 'Perlengkapan', 'quantity' => 40, 'borrowed' => 18, 'condition' => 'Baik'],
            ['id' => 'item-karpet', 'name' => 'Karpet', 'category' => 'Perlengkapan', 'quantity' => 15, 'borrowed' => 5, 'condition' => 'Baik'],
            ['id' => 'item-genset', 'name' => 'Genset', 'category' => 'Elektronik', 'quantity' => 2, 'borrowed' => 1, 'condition' => 'Baik'],
            ['id' => 'item-proyektor', 'name' => 'Proyektor', 'category' => 'Elektronik', 'quantity' => 4, 'borrowed' => 1, 'condition' => 'Baik'],
            ['id' => 'item-panci', 'name' => 'Panci Besar', 'category' => 'Peralatan Dapur', 'quantity' => 20, 'borrowed' => 0, 'condition' => 'Baik'],
            ['id' => 'item-terpal', 'name' => 'Terpal', 'category' => 'Perlengkapan', 'quantity' => 12, 'borrowed' => 4, 'condition' => 'Baik'],
            ['id' => 'item-mic', 'name' => 'Mic Wireless', 'category' => 'Elektronik', 'quantity' => 8, 'borrowed' => 2, 'condition' => 'Baik'],
            ['id' => 'item-panggung', 'name' => 'Panggung Portable', 'category' => 'Perlengkapan', 'quantity' => 2, 'borrowed' => 1, 'condition' => 'Baik'],
            ['id' => 'item-cooler', 'name' => 'Cooler Box', 'category' => 'Peralatan Dapur', 'quantity' => 10, 'borrowed' => 3, 'condition' => 'Baik'],
        ];

        foreach ($items as $item) {
            InventoryItem::updateOrCreate(['id' => $item['id']], $item);
        }

        // 5. Pemasukan
        $incomes = [
            ['id' => 'inc-01', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-09-10', 'source' => 'Unit Usaha', 'category' => 'Penjualan', 'description' => 'Hasil penjualan produk', 'amount' => 500000, 'created_at' => '2026-09-10 09:20:00'],
            ['id' => 'inc-02', 'bumdes_type_id' => 'bumdes-persewaan', 'date' => '2026-09-09', 'source' => 'Sewa Lapangan', 'category' => 'Sewa', 'description' => 'Sewa lapangan desa', 'amount' => 300000, 'created_at' => '2026-09-09 14:10:00'],
            ['id' => 'inc-03', 'bumdes_type_id' => 'bumdes-simpan-pinjam', 'date' => '2026-09-08', 'source' => 'Simpan Pinjam', 'category' => 'Angsuran', 'description' => 'Angsuran anggota', 'amount' => 750000, 'created_at' => '2026-09-08 11:05:00'],
            ['id' => 'inc-04', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-08-28', 'source' => 'Unit Usaha', 'category' => 'Penjualan', 'description' => 'Penjualan hasil bumi', 'amount' => 1200000, 'created_at' => '2026-08-28 08:40:00'],
            ['id' => 'inc-05', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-08-20', 'source' => 'PAD Desa', 'category' => 'Bantuan', 'description' => 'Penyertaan modal desa', 'amount' => 1000000, 'created_at' => '2026-08-20 10:00:00'],
            ['id' => 'inc-06', 'bumdes_type_id' => 'bumdes-persewaan', 'date' => '2026-08-05', 'source' => 'Sewa Kios', 'category' => 'Sewa', 'description' => 'Sewa kios pasar desa', 'amount' => 450000, 'created_at' => '2026-08-05 13:25:00'],
            ['id' => 'inc-07', 'bumdes_type_id' => 'bumdes-simpan-pinjam', 'date' => '2026-07-22', 'source' => 'Simpan Pinjam', 'category' => 'Angsuran', 'description' => 'Angsuran pinjaman produktif', 'amount' => 850000, 'created_at' => '2026-07-22 09:15:00'],
            ['id' => 'inc-08', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-07-10', 'source' => 'Unit Usaha', 'category' => 'Penjualan', 'description' => 'Penjualan pupuk dan benih', 'amount' => 980000, 'created_at' => '2026-07-10 15:45:00'],
            ['id' => 'inc-09', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-06-30', 'source' => 'BUMDes', 'category' => 'Lainnya', 'description' => 'Pendapatan lain-lain', 'amount' => 1500000, 'created_at' => '2026-06-30 16:00:00'],
            ['id' => 'inc-10', 'bumdes_type_id' => 'bumdes-persewaan', 'date' => '2026-06-12', 'source' => 'Sewa Lapangan', 'category' => 'Sewa', 'description' => 'Sewa lapangan untuk turnamen', 'amount' => 400000, 'created_at' => '2026-06-12 12:30:00'],
            ['id' => 'inc-11', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-05-20', 'source' => 'Unit Usaha', 'category' => 'Penjualan', 'description' => 'Penjualan air minum isi ulang', 'amount' => 1100000, 'created_at' => '2026-05-20 08:10:00'],
            ['id' => 'inc-12', 'bumdes_type_id' => 'bumdes-simpan-pinjam', 'date' => '2026-05-05', 'source' => 'Simpan Pinjam', 'category' => 'Angsuran', 'description' => 'Angsuran anggota kelompok tani', 'amount' => 670000, 'created_at' => '2026-05-05 10:50:00'],
            ['id' => 'inc-13', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-04-18', 'source' => 'PAD Desa', 'category' => 'Bantuan', 'description' => 'Insentif unit usaha', 'amount' => 800000, 'created_at' => '2026-04-18 09:00:00'],
            ['id' => 'inc-14', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-03-25', 'source' => 'Unit Usaha', 'category' => 'Penjualan', 'description' => 'Penjualan kerajinan warga', 'amount' => 950000, 'created_at' => '2026-03-25 14:20:00'],
            ['id' => 'inc-15', 'bumdes_type_id' => 'bumdes-persewaan', 'date' => '2026-02-14', 'source' => 'Sewa Kios', 'category' => 'Sewa', 'description' => 'Sewa kios bulan Februari', 'amount' => 350000, 'created_at' => '2026-02-14 11:40:00'],
            ['id' => 'inc-16', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-01-20', 'source' => 'Unit Usaha', 'category' => 'Penjualan', 'description' => 'Penjualan awal tahun', 'amount' => 700000, 'created_at' => '2026-01-20 09:30:00'],
        ];

        foreach ($incomes as $income) {
            Income::updateOrCreate(['id' => $income['id']], $income);
        }

        // 6. Pengeluaran
        $expenses = [
            ['id' => 'exp-01', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-09-10', 'category' => 'Operasional', 'purpose' => 'ATK', 'description' => 'Pembelian ATK', 'amount' => 250000, 'created_at' => '2026-09-10 10:15:00'],
            ['id' => 'exp-02', 'bumdes_type_id' => 'bumdes-persewaan', 'date' => '2026-09-08', 'category' => 'Pemeliharaan', 'purpose' => 'Perbaikan alat', 'description' => 'Perbaikan fasilitas', 'amount' => 500000, 'created_at' => '2026-09-08 13:40:00'],
            ['id' => 'exp-03', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-09-05', 'category' => 'Kegiatan', 'purpose' => 'Acara desa', 'description' => 'Kegiatan masyarakat', 'amount' => 750000, 'created_at' => '2026-09-05 16:20:00'],
            ['id' => 'exp-04', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-08-22', 'category' => 'Gaji', 'purpose' => 'Honor pengurus', 'description' => 'Honorarium pengurus bulan Agustus', 'amount' => 400000, 'created_at' => '2026-08-22 09:00:00'],
            ['id' => 'exp-05', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-08-12', 'category' => 'Operasional', 'purpose' => 'Listrik', 'description' => 'Pembayaran listrik kantor BUMDes', 'amount' => 300000, 'created_at' => '2026-08-12 11:10:00'],
            ['id' => 'exp-06', 'bumdes_type_id' => 'bumdes-persewaan', 'date' => '2026-07-18', 'category' => 'Pemeliharaan', 'purpose' => 'Servis genset', 'description' => 'Servis berkala genset', 'amount' => 350000, 'created_at' => '2026-07-18 14:00:00'],
            ['id' => 'exp-07', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-06-21', 'category' => 'Kegiatan', 'purpose' => 'Pelatihan', 'description' => 'Pelatihan pengelolaan unit usaha', 'amount' => 600000, 'created_at' => '2026-06-21 08:45:00'],
            ['id' => 'exp-08', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-05-14', 'category' => 'ATK', 'purpose' => 'Alat tulis', 'description' => 'Pembelian kertas dan tinta printer', 'amount' => 280000, 'created_at' => '2026-05-14 10:25:00'],
            ['id' => 'exp-09', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-04-09', 'category' => 'Transport', 'purpose' => 'Perjalanan dinas', 'description' => 'Transport rapat kecamatan', 'amount' => 220000, 'created_at' => '2026-04-09 07:50:00'],
            ['id' => 'exp-10', 'bumdes_type_id' => 'bumdes-perdagangan', 'date' => '2026-03-16', 'category' => 'Operasional', 'purpose' => 'Konsumsi rapat', 'description' => 'Rapat evaluasi triwulan I', 'amount' => 400000, 'created_at' => '2026-03-16 12:00:00'],
            ['id' => 'exp-11', 'bumdes_type_id' => 'bumdes-persewaan', 'date' => '2026-02-08', 'category' => 'Pemeliharaan', 'purpose' => 'Pembersihan gudang', 'description' => 'Pembersihan dan penataan gudang barang', 'amount' => 200000, 'created_at' => '2026-02-08 15:30:00'],
        ];

        foreach ($expenses as $expense) {
            Expense::updateOrCreate(['id' => $expense['id']], $expense);
        }

        // 7. Peminjaman Barang Inventaris
        $loans = [
            ['id' => 'loan-01', 'borrower_name' => 'Karang Taruna', 'phone' => '081234567801', 'item_id' => 'item-kursi', 'item_name' => 'Kursi', 'quantity' => 50, 'borrow_date' => '2026-09-10', 'return_date' => '2026-09-12', 'actual_return_date' => null, 'purpose' => 'Acara 17-an susulan', 'notes' => 'Dipakai di balai desa', 'status' => 'borrowed', 'created_at' => '2026-09-10 08:00:00'],
            ['id' => 'loan-02', 'borrower_name' => 'Pak Budi', 'phone' => '081234567802', 'item_id' => 'item-tenda', 'item_name' => 'Tenda', 'quantity' => 2, 'borrow_date' => '2026-09-08', 'return_date' => '2026-09-10', 'actual_return_date' => '2026-09-10', 'purpose' => 'Hajatan keluarga', 'notes' => 'Dikembalikan lengkap', 'status' => 'returned', 'created_at' => '2026-09-08 09:10:00'],
            ['id' => 'loan-03', 'borrower_name' => 'PKK Desa', 'phone' => '081234567803', 'item_id' => 'item-sound', 'item_name' => 'Sound System', 'quantity' => 1, 'borrow_date' => '2026-09-09', 'return_date' => '2026-09-11', 'actual_return_date' => null, 'purpose' => 'Pengajian rutin', 'notes' => 'Termasuk 2 mic', 'status' => 'borrowed', 'created_at' => '2026-09-09 10:00:00'],
            ['id' => 'loan-04', 'borrower_name' => 'Pak Slamet', 'phone' => '081234567804', 'item_id' => 'item-meja', 'item_name' => 'Meja Lipat', 'quantity' => 10, 'borrow_date' => '2026-09-09', 'return_date' => '2026-09-13', 'actual_return_date' => null, 'purpose' => 'Rapat RT', 'notes' => '', 'status' => 'borrowed', 'created_at' => '2026-09-09 11:20:00'],
            ['id' => 'loan-05', 'borrower_name' => 'Bu Ani', 'phone' => '081234567805', 'item_id' => 'item-karpet', 'item_name' => 'Karpet', 'quantity' => 5, 'borrow_date' => '2026-09-08', 'return_date' => '2026-09-15', 'actual_return_date' => null, 'purpose' => 'Pengajian ibu-ibu', 'notes' => 'Warna hijau', 'status' => 'borrowed', 'created_at' => '2026-09-08 13:00:00'],
            ['id' => 'loan-06', 'borrower_name' => 'Karang Taruna', 'phone' => '081234567801', 'item_id' => 'item-mic', 'item_name' => 'Mic Wireless', 'quantity' => 2, 'borrow_date' => '2026-09-10', 'return_date' => '2026-09-12', 'actual_return_date' => null, 'purpose' => 'Hiburan rakyat', 'notes' => '', 'status' => 'borrowed', 'created_at' => '2026-09-10 08:05:00'],
            ['id' => 'loan-07', 'borrower_name' => 'RT 02', 'phone' => '081234567807', 'item_id' => 'item-tenda', 'item_name' => 'Tenda', 'quantity' => 2, 'borrow_date' => '2026-09-07', 'return_date' => '2026-09-14', 'actual_return_date' => null, 'purpose' => 'Kerja bakti', 'notes' => 'Posko di lapangan', 'status' => 'borrowed', 'created_at' => '2026-09-07 07:40:00'],
            ['id' => 'loan-08', 'borrower_name' => 'Masjid Al-Hidayah', 'phone' => '081234567808', 'item_id' => 'item-proyektor', 'item_name' => 'Proyektor', 'quantity' => 1, 'borrow_date' => '2026-09-09', 'return_date' => '2026-09-16', 'actual_return_date' => null, 'purpose' => 'Kajian ramadhan susulan', 'notes' => 'Termasuk kabel HDMI', 'status' => 'borrowed', 'created_at' => '2026-09-09 16:10:00'],
            ['id' => 'loan-09', 'borrower_name' => 'SD Wengkal', 'phone' => '081234567809', 'item_id' => 'item-meja', 'item_name' => 'Meja Lipat', 'quantity' => 8, 'borrow_date' => '2026-09-06', 'return_date' => '2026-09-20', 'actual_return_date' => null, 'purpose' => 'Pentas seni sekolah', 'notes' => '', 'status' => 'borrowed', 'created_at' => '2026-09-06 09:00:00'],
            ['id' => 'loan-10', 'borrower_name' => 'Posyandu', 'phone' => '081234567810', 'item_id' => 'item-cooler', 'item_name' => 'Cooler Box', 'quantity' => 3, 'borrow_date' => '2026-09-10', 'return_date' => '2026-09-11', 'actual_return_date' => null, 'purpose' => 'Imunisasi balita', 'notes' => 'Untuk vaksin', 'status' => 'borrowed', 'created_at' => '2026-09-10 07:15:00'],
            ['id' => 'loan-11', 'borrower_name' => 'Gapoktan', 'phone' => '081234567811', 'item_id' => 'item-terpal', 'item_name' => 'Terpal', 'quantity' => 4, 'borrow_date' => '2026-09-05', 'return_date' => '2026-09-12', 'actual_return_date' => null, 'purpose' => 'Jemur gabah', 'notes' => 'Ukuran 6x8', 'status' => 'borrowed', 'created_at' => '2026-09-05 06:50:00'],
            ['id' => 'loan-12', 'borrower_name' => 'Remaja Masjid', 'phone' => '081234567812', 'item_id' => 'item-panggung', 'item_name' => 'Panggung Portable', 'quantity' => 1, 'borrow_date' => '2026-09-08', 'return_date' => '2026-09-14', 'actual_return_date' => null, 'purpose' => 'Lomba adzan', 'notes' => '', 'status' => 'borrowed', 'created_at' => '2026-09-08 15:00:00'],
            ['id' => 'loan-13', 'borrower_name' => 'Pak Joko', 'phone' => '081234567813', 'item_id' => 'item-genset', 'item_name' => 'Genset', 'quantity' => 1, 'borrow_date' => '2026-09-01', 'return_date' => '2026-09-05', 'actual_return_date' => null, 'purpose' => 'Acara hajatan', 'notes' => 'Belum dikembalikan', 'status' => 'overdue', 'created_at' => '2026-09-01 10:00:00'],
            ['id' => 'loan-14', 'borrower_name' => 'PKK Desa', 'phone' => '081234567803', 'item_id' => 'item-panci', 'item_name' => 'Panci Besar', 'quantity' => 6, 'borrow_date' => '2026-09-01', 'return_date' => '2026-09-03', 'actual_return_date' => '2026-09-03', 'purpose' => 'Masak bersama', 'notes' => '', 'status' => 'returned', 'created_at' => '2026-09-01 08:20:00'],
            ['id' => 'loan-15', 'borrower_name' => 'Karang Taruna', 'phone' => '081234567801', 'item_id' => 'item-sound', 'item_name' => 'Sound System', 'quantity' => 1, 'borrow_date' => '2026-08-20', 'return_date' => '2026-08-22', 'actual_return_date' => '2026-08-22', 'purpose' => 'Turnamen voli', 'notes' => '', 'status' => 'returned', 'created_at' => '2026-08-20 12:00:00'],
            ['id' => 'loan-16', 'borrower_name' => 'Bu Rina', 'phone' => '081234567816', 'item_id' => 'item-kursi', 'item_name' => 'Kursi', 'quantity' => 20, 'borrow_date' => '2026-08-15', 'return_date' => '2026-08-17', 'actual_return_date' => '2026-08-17', 'purpose' => 'Tahlilan', 'notes' => '', 'status' => 'returned', 'created_at' => '2026-08-15 09:40:00'],
            ['id' => 'loan-17', 'borrower_name' => 'RT 05', 'phone' => '081234567817', 'item_id' => 'item-terpal', 'item_name' => 'Terpal', 'quantity' => 2, 'borrow_date' => '2026-08-10', 'return_date' => '2026-08-12', 'actual_return_date' => '2026-08-12', 'purpose' => 'Gotong royong', 'notes' => '', 'status' => 'returned', 'created_at' => '2026-08-10 07:00:00'],
        ];

        foreach ($loans as $loan) {
            Loan::updateOrCreate(['id' => $loan['id']], $loan);
        }

        // 8. Simpan Pinjam Uang
        $savingsLoans = [
            [
                'id' => 'sl-01',
                'borrower_name' => 'Siti Rahmawati',
                'phone' => '081298765401',
                'address' => 'RT 01 / RW 02 Desa Wengkal',
                'loan_date' => '2026-08-01',
                'due_date' => '2026-11-01',
                'loan_amount' => 3000000,
                'installment_amount' => 1000000,
                'total_paid' => 2000000,
                'purpose' => 'Modal usaha warung sembako',
                'notes' => 'Pinjaman reguler bunga ringan',
                'status' => 'active',
                'created_at' => '2026-08-01 09:00:00',
            ],
            [
                'id' => 'sl-02',
                'borrower_name' => 'Bambang Sudarmono',
                'phone' => '081298765402',
                'address' => 'RT 03 / RW 01 Desa Wengkal',
                'loan_date' => '2026-07-15',
                'due_date' => '2026-09-15',
                'loan_amount' => 2000000,
                'installment_amount' => 1000000,
                'total_paid' => 2000000,
                'purpose' => 'Biaya pembelian bibit ternak',
                'notes' => 'Lunas tepat waktu',
                'status' => 'paid',
                'created_at' => '2026-07-15 10:30:00',
            ],
            [
                'id' => 'sl-03',
                'borrower_name' => 'Agus Prasetyo',
                'phone' => '081298765403',
                'address' => 'RT 04 / RW 02 Desa Wengkal',
                'loan_date' => '2026-06-10',
                'due_date' => '2026-08-10',
                'loan_amount' => 1500000,
                'installment_amount' => 500000,
                'total_paid' => 500000,
                'purpose' => 'Perbaikan peralatan bertani',
                'notes' => 'Jatuh tempo terlewati',
                'status' => 'overdue',
                'created_at' => '2026-06-10 13:00:00',
            ],
        ];

        foreach ($savingsLoans as $sl) {
            SavingsLoan::updateOrCreate(['id' => $sl['id']], $sl);
        }

        // 9. Riwayat Angsuran Simpan Pinjam
        $payments = [
            ['id' => 'slp-01', 'savings_loan_id' => 'sl-01', 'payment_date' => '2026-08-15', 'amount' => 1000000, 'notes' => 'Angsuran ke-1', 'created_at' => '2026-08-15 10:00:00'],
            ['id' => 'slp-02', 'savings_loan_id' => 'sl-01', 'payment_date' => '2026-09-15', 'amount' => 1000000, 'notes' => 'Angsuran ke-2', 'created_at' => '2026-09-15 11:00:00'],
            ['id' => 'slp-03', 'savings_loan_id' => 'sl-02', 'payment_date' => '2026-08-15', 'amount' => 1000000, 'notes' => 'Angsuran ke-1', 'created_at' => '2026-08-15 14:00:00'],
            ['id' => 'slp-04', 'savings_loan_id' => 'sl-02', 'payment_date' => '2026-09-14', 'amount' => 1000000, 'notes' => 'Pelunasan angsuran ke-2', 'created_at' => '2026-09-14 09:30:00'],
            ['id' => 'slp-05', 'savings_loan_id' => 'sl-03', 'payment_date' => '2026-07-10', 'amount' => 500000, 'notes' => 'Angsuran ke-1', 'created_at' => '2026-07-10 08:45:00'],
        ];

        foreach ($payments as $payment) {
            SavingsLoanPayment::updateOrCreate(['id' => $payment['id']], $payment);
        }

        // 10. Notifikasi Sistem
        $notifications = [
            ['id' => 'ntf-01', 'title' => 'Peminjaman terlambat', 'body' => 'Pak Joko belum mengembalikan Genset (jatuh tempo 05/09/2026).', 'time' => '2026-09-10 07:00:00', 'read' => false, 'href' => '/peminjaman/loan-13'],
            ['id' => 'ntf-02', 'title' => 'Jatuh tempo minggu ini', 'body' => 'Terdapat beberapa peminjaman yang akan berakhir dalam 3 hari ke depan.', 'time' => '2026-09-10 06:30:00', 'read' => false, 'href' => '/peminjaman'],
            ['id' => 'ntf-03', 'title' => 'Pemasukan tercatat', 'body' => 'Hasil penjualan produk sebesar Rp500.000 telah masuk kas BUMDes.', 'time' => '2026-09-10 09:25:00', 'read' => true, 'href' => '/uang-masuk'],
        ];

        foreach ($notifications as $notification) {
            Notification::updateOrCreate(['id' => $notification['id']], $notification);
        }
    }
}
