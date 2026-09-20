<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BumdesTypeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SavingsLoanController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('dashboard');
});

// Autentikasi
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Keuangan: Pemasukan
Route::get('/uang-masuk', [IncomeController::class, 'index'])->name('uang-masuk');
Route::post('/uang-masuk', [IncomeController::class, 'store'])->name('uang-masuk.store');
Route::put('/uang-masuk/{id}', [IncomeController::class, 'update'])->name('uang-masuk.update');
Route::delete('/uang-masuk/{id}', [IncomeController::class, 'destroy'])->name('uang-masuk.destroy');

// Keuangan: Pengeluaran
Route::get('/uang-keluar', [ExpenseController::class, 'index'])->name('uang-keluar');
Route::post('/uang-keluar', [ExpenseController::class, 'store'])->name('uang-keluar.store');
Route::put('/uang-keluar/{id}', [ExpenseController::class, 'update'])->name('uang-keluar.update');
Route::delete('/uang-keluar/{id}', [ExpenseController::class, 'destroy'])->name('uang-keluar.destroy');

// Barang Inventaris
Route::get('/barang', [InventoryItemController::class, 'index'])->name('barang');
Route::post('/barang', [InventoryItemController::class, 'store'])->name('barang.store');
Route::put('/barang/{id}', [InventoryItemController::class, 'update'])->name('barang.update');
Route::delete('/barang/{id}', [InventoryItemController::class, 'destroy'])->name('barang.destroy');

// Peminjaman Barang
Route::get('/peminjaman', [LoanController::class, 'index'])->name('peminjaman.index');
Route::post('/peminjaman', [LoanController::class, 'store'])->name('peminjaman.store');
Route::get('/peminjaman/{id}', [LoanController::class, 'show'])->name('peminjaman.show');
Route::put('/peminjaman/{id}', [LoanController::class, 'update'])->name('peminjaman.update');
Route::post('/peminjaman/{id}/return', [LoanController::class, 'returnLoan'])->name('peminjaman.return');
Route::delete('/peminjaman/{id}', [LoanController::class, 'destroy'])->name('peminjaman.destroy');

// Unit / Jenis Usaha BUMDes
Route::get('/jenis-bumdes', [BumdesTypeController::class, 'index'])->name('jenis-bumdes.index');
Route::post('/jenis-bumdes', [BumdesTypeController::class, 'store'])->name('jenis-bumdes.store');
Route::get('/jenis-bumdes/{id}', [BumdesTypeController::class, 'show'])->name('jenis-bumdes.show');
Route::put('/jenis-bumdes/{id}', [BumdesTypeController::class, 'update'])->name('jenis-bumdes.update');
Route::delete('/jenis-bumdes/{id}', [BumdesTypeController::class, 'destroy'])->name('jenis-bumdes.destroy');

// Simpan Pinjam Uang
Route::get('/simpan-pinjam', [SavingsLoanController::class, 'index'])->name('simpan-pinjam');
Route::post('/simpan-pinjam', [SavingsLoanController::class, 'store'])->name('simpan-pinjam.store');
Route::put('/simpan-pinjam/{id}', [SavingsLoanController::class, 'update'])->name('simpan-pinjam.update');
Route::post('/simpan-pinjam/{id}/payment', [SavingsLoanController::class, 'addPayment'])->name('simpan-pinjam.payment');
Route::delete('/simpan-pinjam/{id}', [SavingsLoanController::class, 'destroy'])->name('simpan-pinjam.destroy');

// Laporan
Route::get('/laporan', [ReportController::class, 'index'])->name('laporan');

// Profil & Pengaturan
Route::get('/profile', [SettingController::class, 'index'])->name('profile');
Route::post('/profile', [SettingController::class, 'update'])->name('profile.update');
Route::get('/pengaturan', function () {
    return redirect()->route('profile');
})->name('pengaturan');
