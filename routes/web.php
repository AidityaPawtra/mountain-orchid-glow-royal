<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/uang-masuk', function () {
    return Inertia::render('UangMasuk');
})->name('uang-masuk');

Route::get('/uang-keluar', function () {
    return Inertia::render('UangKeluar');
})->name('uang-keluar');

Route::get('/barang', function () {
    return Inertia::render('Barang');
})->name('barang');

Route::get('/peminjaman', function () {
    return Inertia::render('Peminjaman/Index');
})->name('peminjaman.index');

Route::get('/peminjaman/{id}', function (string $id) {
    return Inertia::render('Peminjaman/Show', [
        'id' => $id,
    ]);
})->name('peminjaman.show');

Route::get('/jenis-bumdes', function () {
    return Inertia::render('JenisBumdes/Index');
})->name('jenis-bumdes.index');

Route::get('/jenis-bumdes/{id}', function (string $id) {
    return Inertia::render('JenisBumdes/Show', [
        'id' => $id,
    ]);
})->name('jenis-bumdes.show');

Route::get('/simpan-pinjam', function () {
    return Inertia::render('SimpanPinjam');
})->name('simpan-pinjam');

Route::get('/laporan', function () {
    return Inertia::render('Laporan');
})->name('laporan');

Route::get('/profile', function () {
    return Inertia::render('Profile');
})->name('profile');

Route::get('/pengaturan', function () {
    return redirect()->route('profile');
})->name('pengaturan');
