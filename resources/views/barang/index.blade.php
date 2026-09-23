@extends('layouts.app')
@section('title', 'Data Barang')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-foreground">Data Barang</h1>
            <p class="mt-1 text-sm text-muted-foreground">Inventaris barang milik BUMDes</p>
        </div>
        <button data-modal="modal-tambah-barang"
            class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Tambah Barang
        </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Total Jenis Barang</p>
            <p class="mt-2 text-2xl font-bold text-foreground">{{ $items->count() }}</p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Total Stok</p>
            <p class="mt-2 text-2xl font-bold text-foreground">{{ $items->sum('quantity') }}</p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Sedang Dipinjam</p>
            <p class="mt-2 text-2xl font-bold text-warning">{{ $items->sum('borrowed') }}</p>
        </div>
    </div>

    <div class="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div class="flex items-center justify-between p-5 pb-3">
            <h2 class="text-base font-semibold text-foreground">Daftar Barang</h2>
            <input type="search" placeholder="Cari barang..." data-search-table="barang-table"
                class="w-56 rounded-xl border border-input bg-background px-3.5 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <div class="overflow-x-auto">
            <table id="barang-table" class="w-full text-sm">
                <thead class="border-y border-border bg-muted/40">
                    <tr>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Nama Barang</th>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Kategori</th>
                        <th class="px-5 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Total</th>
                        <th class="px-5 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Tersedia</th>
                        <th class="px-5 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Dipinjam</th>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Kondisi</th>
                        <th class="px-5 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border">
                    @forelse ($items as $item)
                        @php $available = $item->quantity - $item->borrowed; @endphp
                        <tr class="hover:bg-muted/30 transition-colors">
                            <td class="px-5 py-3.5 font-medium text-foreground">{{ $item->name }}</td>
                            <td class="px-5 py-3.5">
                                <span class="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-medium">
                                    {{ $item->category }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5 text-center font-medium text-foreground">{{ $item->quantity }}</td>
                            <td class="px-5 py-3.5 text-center">
                                <span class="font-semibold {{ $available > 0 ? 'text-success' : 'text-danger' }}">{{ $available }}</span>
                            </td>
                            <td class="px-5 py-3.5 text-center text-warning font-medium">{{ $item->borrowed }}</td>
                            <td class="px-5 py-3.5">
                                @php
                                    $condColor = match($item->condition) {
                                        'Baik' => 'bg-success-soft text-success',
                                        'Rusak Ringan' => 'bg-warning-soft text-warning',
                                        default => 'bg-danger-soft text-danger',
                                    };
                                @endphp
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {{ $condColor }}">
                                    {{ $item->condition }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5">
                                <div class="flex items-center justify-center gap-2">
                                    <button
                                        data-modal="modal-tambah-barang"
                                        data-edit='@json(["name"=>$item->name,"category"=>$item->category,"quantity"=>$item->quantity,"condition"=>$item->condition])'
                                        data-action="{{ route('barang.update', $item->id) }}"
                                        class="rounded-lg p-1.5 text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors">
                                        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>
                                    <form id="del-barang-{{ $item->id }}" method="POST" action="{{ route('barang.destroy', $item->id) }}">
                                        @csrf @method('DELETE')
                                    </form>
                                    <button data-confirm-delete="Yakin hapus barang ini?" data-form="del-barang-{{ $item->id }}"
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
                        <tr><td colspan="7" class="px-5 py-12 text-center text-muted-foreground">Belum ada data barang.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<div id="modal-tambah-barang" class="modal fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="modal-backdrop absolute inset-0 bg-black/50"></div>
    <div class="relative w-full max-w-md rounded-2xl bg-surface shadow-xl">
        <div class="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 class="text-base font-semibold text-foreground">Data Barang</h3>
            <button data-close-modal="modal-tambah-barang" class="text-muted-foreground hover:text-foreground">
                <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <form method="POST" action="{{ route('barang.store') }}" data-base-action="{{ route('barang.store') }}">
            @csrf
            <input type="hidden" name="_method" value="POST">
            <div class="space-y-4 px-6 py-5">
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Nama Barang <span class="text-danger">*</span></label>
                    <input type="text" name="name" required placeholder="cth: Kursi Plastik"
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Kategori <span class="text-danger">*</span></label>
                        <input type="text" name="category" required placeholder="cth: Perlengkapan"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Jumlah <span class="text-danger">*</span></label>
                        <input type="number" name="quantity" min="0" required placeholder="0"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Kondisi <span class="text-danger">*</span></label>
                    <select name="condition" required
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="Baik">Baik</option>
                        <option value="Rusak Ringan">Rusak Ringan</option>
                        <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end gap-3 border-t border-border px-6 py-4">
                <button type="button" data-close-modal="modal-tambah-barang"
                    class="rounded-xl border border-input px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">Batal</button>
                <button type="submit"
                    class="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">Simpan</button>
            </div>
        </form>
    </div>
</div>
@endsection
