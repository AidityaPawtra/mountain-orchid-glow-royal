@extends('layouts.app')
@section('title', 'Uang Keluar')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-foreground">Uang Keluar</h1>
            <p class="mt-1 text-sm text-muted-foreground">Catatan semua pengeluaran BUMDes</p>
        </div>
        <button data-modal="modal-tambah-expense"
            class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Tambah
        </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Total Pengeluaran</p>
            <p class="mt-2 text-2xl font-bold text-danger">Rp {{ number_format($expenses->sum('amount'), 0, ',', '.') }}</p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Jumlah Transaksi</p>
            <p class="mt-2 text-2xl font-bold text-foreground">{{ $expenses->count() }}</p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Rata-rata per Transaksi</p>
            <p class="mt-2 text-2xl font-bold text-foreground">
                Rp {{ $expenses->count() ? number_format($expenses->sum('amount') / $expenses->count(), 0, ',', '.') : '0' }}
            </p>
        </div>
    </div>

    <div class="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div class="flex items-center justify-between p-5 pb-3">
            <h2 class="text-base font-semibold text-foreground">Daftar Pengeluaran</h2>
            <input type="search" placeholder="Cari..." data-search-table="expense-table"
                class="w-56 rounded-xl border border-input bg-background px-3.5 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <div class="overflow-x-auto">
            <table id="expense-table" class="w-full text-sm">
                <thead class="border-y border-border bg-muted/40">
                    <tr>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Tanggal</th>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Keperluan</th>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Kategori</th>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Unit BUMDes</th>
                        <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Jumlah</th>
                        <th class="px-5 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border">
                    @forelse ($expenses as $item)
                        <tr class="hover:bg-muted/30 transition-colors">
                            <td class="px-5 py-3.5 text-muted-foreground">{{ \Carbon\Carbon::parse($item->date)->format('d M Y') }}</td>
                            <td class="px-5 py-3.5 font-medium text-foreground">{{ $item->purpose }}</td>
                            <td class="px-5 py-3.5">
                                <span class="inline-flex items-center rounded-full bg-warning-soft text-warning px-2.5 py-0.5 text-xs font-medium">
                                    {{ $item->category }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5 text-muted-foreground">{{ $item->bumdesType?->name ?? '-' }}</td>
                            <td class="px-5 py-3.5 text-right font-semibold text-danger tabular-nums">
                                -Rp {{ number_format($item->amount, 0, ',', '.') }}
                            </td>
                            <td class="px-5 py-3.5">
                                <div class="flex items-center justify-center gap-2">
@php
    $editData = json_encode([
        'bumdesTypeId' => $item->bumdes_type_id,
        'date' => $item->date?->format('Y-m-d'),
        'category' => $item->category,
        'purpose' => $item->purpose,
        'description' => $item->description,
        'amount' => $item->amount,
    ]);
@endphp
<button
    data-modal="modal-tambah-expense"
    data-edit="{{ $editData }}"
    data-action="{{ route('uang-keluar.update', $item->id) }}"
    class="rounded-lg p-1.5 text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors">
    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
    </svg>
</button>
                                    <form id="del-expense-{{ $item->id }}" method="POST" action="{{ route('uang-keluar.destroy', $item->id) }}">
                                        @csrf @method('DELETE')
                                    </form>
                                    <button data-confirm-delete="Yakin hapus data pengeluaran ini?" data-form="del-expense-{{ $item->id }}"
                                        class="rounded-lg p-1.5 text-muted-foreground hover:text-danger hover:bg-danger-soft transition-colors">
                                        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="6" class="px-5 py-12 text-center text-muted-foreground">Belum ada data pengeluaran.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<div id="modal-tambah-expense" class="modal fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="modal-backdrop absolute inset-0 bg-black/50"></div>
    <div class="relative w-full max-w-lg rounded-2xl bg-surface shadow-xl">
        <div class="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 class="text-base font-semibold text-foreground">Catat Pengeluaran</h3>
            <button data-close-modal="modal-tambah-expense" class="text-muted-foreground hover:text-foreground">
                <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <form method="POST" action="{{ route('uang-keluar.store') }}" data-base-action="{{ route('uang-keluar.store') }}">
            @csrf
            <input type="hidden" name="_method" value="POST">
            <div class="space-y-4 px-6 py-5">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Tanggal <span class="text-danger">*</span></label>
                        <input type="date" name="date" required
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Jumlah (Rp) <span class="text-danger">*</span></label>
                        <input type="number" name="amount" min="0" required placeholder="0"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Keperluan <span class="text-danger">*</span></label>
                    <input type="text" name="purpose" required placeholder="cth: Pembelian ATK"
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Kategori <span class="text-danger">*</span></label>
                        <select name="category" required
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="">Pilih kategori</option>
                            <option value="Operasional">Operasional</option>
                            <option value="Gaji">Gaji</option>
                            <option value="Pemeliharaan">Pemeliharaan</option>
                            <option value="Kegiatan">Kegiatan</option>
                            <option value="ATK">ATK</option>
                            <option value="Transport">Transport</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Unit BUMDes</label>
                        <select name="bumdesTypeId"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="">Semua unit</option>
                            @foreach ($bumdesTypes as $type)
                                <option value="{{ $type->id }}">{{ $type->name }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Keterangan</label>
                    <textarea name="description" rows="2" placeholder="Opsional..."
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
                </div>
            </div>
            <div class="flex justify-end gap-3 border-t border-border px-6 py-4">
                <button type="button" data-close-modal="modal-tambah-expense"
                    class="rounded-xl border border-input px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">Batal</button>
                <button type="submit"
                    class="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">Simpan</button>
            </div>
        </form>
    </div>
</div>
@endsection
