@extends('layouts.app')
@section('title', 'Detail Peminjaman')

@section('content')
<div class="space-y-6">
    <div class="flex items-center gap-4">
        <a href="{{ route('peminjaman.index') }}"
            class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Kembali
        </a>
        <div>
            <h1 class="text-2xl font-bold text-foreground">Detail Peminjaman</h1>
            <p class="mt-0.5 text-sm text-muted-foreground">ID: {{ $loan->id }}</p>
        </div>
    </div>

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

    <div class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-border bg-surface p-6 shadow-card space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-base font-semibold text-foreground">Informasi Peminjam</h2>
                <span class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium {{ $statusColor }}">
                    {{ $statusLabel }}
                </span>
            </div>
            <dl class="space-y-3">
                <div class="flex justify-between text-sm">
                    <dt class="text-muted-foreground">Nama</dt>
                    <dd class="font-medium text-foreground">{{ $loan->borrower_name }}</dd>
                </div>
                <div class="flex justify-between text-sm">
                    <dt class="text-muted-foreground">No. HP</dt>
                    <dd class="font-medium text-foreground">{{ $loan->phone }}</dd>
                </div>
                <div class="flex justify-between text-sm">
                    <dt class="text-muted-foreground">Keperluan</dt>
                    <dd class="font-medium text-foreground text-right">{{ $loan->purpose ?: '-' }}</dd>
                </div>
            </dl>
        </div>

        <div class="rounded-2xl border border-border bg-surface p-6 shadow-card space-y-4">
            <h2 class="text-base font-semibold text-foreground">Detail Barang</h2>
            <dl class="space-y-3">
                <div class="flex justify-between text-sm">
                    <dt class="text-muted-foreground">Barang</dt>
                    <dd class="font-medium text-foreground">{{ $loan->item_name }}</dd>
                </div>
                <div class="flex justify-between text-sm">
                    <dt class="text-muted-foreground">Jumlah</dt>
                    <dd class="font-medium text-foreground">{{ $loan->quantity }}</dd>
                </div>
                <div class="flex justify-between text-sm">
                    <dt class="text-muted-foreground">Tgl Pinjam</dt>
                    <dd class="font-medium text-foreground">{{ \Carbon\Carbon::parse($loan->borrow_date)->format('d M Y') }}</dd>
                </div>
                <div class="flex justify-between text-sm">
                    <dt class="text-muted-foreground">Tgl Kembali</dt>
                    <dd class="font-medium text-foreground">{{ \Carbon\Carbon::parse($loan->return_date)->format('d M Y') }}</dd>
                </div>
                @if ($loan->actual_return_date)
                <div class="flex justify-between text-sm">
                    <dt class="text-muted-foreground">Kembali Aktual</dt>
                    <dd class="font-medium text-success">{{ \Carbon\Carbon::parse($loan->actual_return_date)->format('d M Y') }}</dd>
                </div>
                @endif
                @if ($loan->notes)
                <div class="flex justify-between text-sm">
                    <dt class="text-muted-foreground">Catatan</dt>
                    <dd class="font-medium text-foreground text-right">{{ $loan->notes }}</dd>
                </div>
                @endif
            </dl>
        </div>
    </div>

    <div class="flex gap-3">
        @if ($loan->status !== 'returned')
            <button data-return-action="{{ route('peminjaman.return', $loan->id) }}"
                class="inline-flex items-center gap-2 rounded-xl bg-success px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Tandai Dikembalikan
            </button>
        @endif
        <form id="del-loan-show" method="POST" action="{{ route('peminjaman.destroy', $loan->id) }}">
            @csrf @method('DELETE')
        </form>
        <button data-confirm-delete="Yakin hapus data peminjaman ini?" data-form="del-loan-show"
            class="inline-flex items-center gap-2 rounded-xl border border-danger/30 bg-danger-soft px-4 py-2.5 text-sm font-semibold text-danger hover:bg-danger hover:text-white transition-colors">
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Hapus
        </button>
    </div>
</div>
@endsection
