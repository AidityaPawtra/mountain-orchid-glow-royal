@extends('layouts.app')
@section('title', 'Peminjaman Barang')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-foreground">Peminjaman Barang</h1>
            <p class="mt-1 text-sm text-muted-foreground">Kelola catatan peminjaman inventaris BUMDes</p>
        </div>
        <button data-modal="modal-tambah-peminjaman"
            class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Tambah Peminjaman
        </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Aktif</p>
            <p class="mt-2 text-2xl font-bold text-warning">{{ $loans->where('status','borrowed')->count() }}</p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Dikembalikan</p>
            <p class="mt-2 text-2xl font-bold text-success">{{ $loans->where('status','returned')->count() }}</p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Terlambat</p>
            <p class="mt-2 text-2xl font-bold text-danger">{{ $loans->where('status','overdue')->count() }}</p>
        </div>
    </div>

    <div class="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div class="flex items-center justify-between p-5 pb-3">
            <h2 class="text-base font-semibold text-foreground">Daftar Peminjaman</h2>
            <input type="search" placeholder="Cari peminjam..." data-search-table="peminjaman-table"
                class="w-56 rounded-xl border border-input bg-background px-3.5 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <div class="overflow-x-auto">
            <table id="peminjaman-table" class="w-full text-sm">
                <thead class="border-y border-border bg-muted/40">
                    <tr>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Peminjam</th>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Barang</th>
                        <th class="px-5 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Qty</th>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Pinjam</th>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Kembali</th>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
                        <th class="px-5 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border">
                    @forelse ($loans as $loan)
                        @php
                            $statusColor = match($loan->status) {
                                'borrowed' => 'bg-warning-soft text-warning',
                                'returned' => 'bg-success-soft text-success',
                                'overdue'  => 'bg-danger-soft text-danger',
                                default    => 'bg-muted text-muted-foreground',
                            };
                            $statusLabel = match($loan->status) {
                                'borrowed' => 'Dipinjam',
                                'returned' => 'Dikembalikan',
                                'overdue'  => 'Terlambat',
                                default    => $loan->status,
                            };
                        @endphp
                        <tr class="hover:bg-muted/30 transition-colors">
                            <td class="px-5 py-3.5">
                                <p class="font-medium text-foreground">{{ $loan->borrower_name }}</p>
                                <p class="text-xs text-muted-foreground">{{ $loan->phone }}</p>
                            </td>
                            <td class="px-5 py-3.5 text-foreground">{{ $loan->item_name }}</td>
                            <td class="px-5 py-3.5 text-center font-medium text-foreground">{{ $loan->quantity }}</td>
                            <td class="px-5 py-3.5 text-muted-foreground">{{ \Carbon\Carbon::parse($loan->borrow_date)->format('d M Y') }}</td>
                            <td class="px-5 py-3.5 text-muted-foreground">{{ \Carbon\Carbon::parse($loan->return_date)->format('d M Y') }}</td>
                            <td class="px-5 py-3.5">
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {{ $statusColor }}">
                                    {{ $statusLabel }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5">
                                <div class="flex items-center justify-center gap-1">
                                    <a href="{{ route('peminjaman.show', $loan->id) }}"
                                        class="rounded-lg p-1.5 text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors" title="Detail">
                                        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                        </svg>
                                    </a>
                                    @if ($loan->status !== 'returned')
                                        <button data-return-action="{{ route('peminjaman.return', $loan->id) }}"
                                            class="rounded-lg p-1.5 text-muted-foreground hover:text-success hover:bg-success-soft transition-colors" title="Kembalikan">
                                            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        </button>
                                    @endif
                                    <form id="del-loan-{{ $loan->id }}" method="POST" action="{{ route('peminjaman.destroy', $loan->id) }}">
                                        @csrf @method('DELETE')
                                    </form>
                                    <button data-confirm-delete="Yakin hapus data peminjaman ini?" data-form="del-loan-{{ $loan->id }}"
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
                        <tr><td colspan="7" class="px-5 py-12 text-center text-muted-foreground">Belum ada data peminjaman.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<div id="modal-tambah-peminjaman" class="modal fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="modal-backdrop absolute inset-0 bg-black/50"></div>
    <div class="relative w-full max-w-lg rounded-2xl bg-surface shadow-xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-border px-6 py-4 sticky top-0 bg-surface z-10">
            <h3 class="text-base font-semibold text-foreground">Tambah Peminjaman</h3>
            <button data-close-modal="modal-tambah-peminjaman" class="text-muted-foreground hover:text-foreground">
                <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <form method="POST" action="{{ route('peminjaman.store') }}">
            @csrf
            <div class="space-y-4 px-6 py-5">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Nama Peminjam <span class="text-danger">*</span></label>
                        <input type="text" name="borrowerName" required placeholder="Nama lengkap"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">No. HP <span class="text-danger">*</span></label>
                        <input type="text" name="phone" required placeholder="08xx"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Barang <span class="text-danger">*</span></label>
                    <select name="itemId" required
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Pilih barang</option>
                        @foreach ($items as $item)
                            @php $avail = $item->quantity - $item->borrowed; @endphp
                            <option value="{{ $item->id }}" {{ $avail <= 0 ? 'disabled' : '' }}>
                                {{ $item->name }} (Tersedia: {{ $avail }})
                            </option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Jumlah <span class="text-danger">*</span></label>
                    <input type="number" name="quantity" min="1" required placeholder="1"
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Tgl Pinjam <span class="text-danger">*</span></label>
                        <input type="date" name="borrowDate" required
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Tgl Kembali <span class="text-danger">*</span></label>
                        <input type="date" name="returnDate" required
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Keperluan</label>
                    <input type="text" name="purpose" placeholder="Keperluan peminjaman"
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Catatan</label>
                    <textarea name="notes" rows="2" placeholder="Opsional..."
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
                </div>
            </div>
            <div class="flex justify-end gap-3 border-t border-border px-6 py-4 sticky bottom-0 bg-surface">
                <button type="button" data-close-modal="modal-tambah-peminjaman"
                    class="rounded-xl border border-input px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">Batal</button>
                <button type="submit"
                    class="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">Simpan</button>
            </div>
        </form>
    </div>
</div>
@endsection
