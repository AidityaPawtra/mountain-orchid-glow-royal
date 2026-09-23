@extends('layouts.app')
@section('title', 'Simpan Pinjam')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-foreground">Simpan Pinjam</h1>
            <p class="mt-1 text-sm text-muted-foreground">Kelola pinjaman uang anggota BUMDes</p>
        </div>
        <button data-modal="modal-tambah-sl"
            class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Tambah Pinjaman
        </button>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Total Pinjaman</p>
            <p class="mt-2 text-2xl font-bold text-foreground">Rp {{ number_format($savingsLoans->sum('loan_amount'), 0, ',', '.') }}</p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Aktif</p>
            <p class="mt-2 text-2xl font-bold text-warning">{{ $savingsLoans->where('status','active')->count() }}</p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Lunas</p>
            <p class="mt-2 text-2xl font-bold text-success">{{ $savingsLoans->where('status','paid')->count() }}</p>
        </div>
    </div>

    <div class="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div class="flex items-center justify-between p-5 pb-3">
            <h2 class="text-base font-semibold text-foreground">Daftar Pinjaman</h2>
            <input type="search" placeholder="Cari anggota..." data-search-table="sl-table"
                class="w-56 rounded-xl border border-input bg-background px-3.5 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <div class="overflow-x-auto">
            <table id="sl-table" class="w-full text-sm">
                <thead class="border-y border-border bg-muted/40">
                    <tr>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Anggota</th>
                        <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Pinjaman</th>
                        <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Terbayar</th>
                        <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Sisa</th>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Jatuh Tempo</th>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
                        <th class="px-5 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border">
                    @forelse ($savingsLoans as $sl)
                        @php
                            $sisa = $sl->loan_amount - $sl->total_paid;
                            $statusColor = match($sl->status) {
                                'active' => 'bg-warning-soft text-warning',
                                'paid'   => 'bg-success-soft text-success',
                                default  => 'bg-muted text-muted-foreground',
                            };
                            $statusLabel = match($sl->status) {
                                'active' => 'Aktif',
                                'paid'   => 'Lunas',
                                default  => $sl->status,
                            };
                        @endphp
                        <tr class="hover:bg-muted/30 transition-colors">
                            <td class="px-5 py-3.5">
                                <p class="font-medium text-foreground">{{ $sl->borrower_name }}</p>
                                <p class="text-xs text-muted-foreground">{{ $sl->phone }}</p>
                            </td>
                            <td class="px-5 py-3.5 text-right tabular-nums font-medium text-foreground">Rp {{ number_format($sl->loan_amount, 0, ',', '.') }}</td>
                            <td class="px-5 py-3.5 text-right tabular-nums text-success font-medium">Rp {{ number_format($sl->total_paid, 0, ',', '.') }}</td>
                            <td class="px-5 py-3.5 text-right tabular-nums {{ $sisa > 0 ? 'text-danger' : 'text-success' }} font-medium">Rp {{ number_format($sisa, 0, ',', '.') }}</td>
                            <td class="px-5 py-3.5 text-muted-foreground">{{ \Carbon\Carbon::parse($sl->due_date)->format('d M Y') }}</td>
                            <td class="px-5 py-3.5">
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {{ $statusColor }}">{{ $statusLabel }}</span>
                            </td>
                            <td class="px-5 py-3.5">
                                <div class="flex items-center justify-center gap-1">
                                    @if ($sl->status === 'active')
                                        <button data-payment-action="{{ route('simpan-pinjam.payment', $sl->id) }}"
                                            data-modal="modal-bayar-sl"
                                            class="rounded-lg p-1.5 text-muted-foreground hover:text-success hover:bg-success-soft transition-colors" title="Catat Angsuran">
                                            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        </button>
                                    @endif
                                    <button
                                        data-modal="modal-tambah-sl"
                                        data-edit='@json(["borrowerName"=>$sl->borrower_name,"phone"=>$sl->phone,"address"=>$sl->address,"loanDate"=>$sl->loan_date?->format("Y-m-d"),"dueDate"=>$sl->due_date?->format("Y-m-d"),"loanAmount"=>$sl->loan_amount,"installmentAmount"=>$sl->installment_amount,"purpose"=>$sl->purpose,"notes"=>$sl->notes])'
                                        data-action="{{ route('simpan-pinjam.update', $sl->id) }}"
                                        class="rounded-lg p-1.5 text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors">
                                        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>
                                    <form id="del-sl-{{ $sl->id }}" method="POST" action="{{ route('simpan-pinjam.destroy', $sl->id) }}">
                                        @csrf @method('DELETE')
                                    </form>
                                    <button data-confirm-delete="Yakin hapus data pinjaman ini?" data-form="del-sl-{{ $sl->id }}"
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
                        <tr><td colspan="7" class="px-5 py-12 text-center text-muted-foreground">Belum ada data simpan pinjam.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

{{-- MODAL TAMBAH PINJAMAN --}}
<div id="modal-tambah-sl" class="modal fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="modal-backdrop absolute inset-0 bg-black/50"></div>
    <div class="relative w-full max-w-lg rounded-2xl bg-surface shadow-xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-border px-6 py-4 sticky top-0 bg-surface z-10">
            <h3 class="text-base font-semibold text-foreground">Data Pinjaman</h3>
            <button data-close-modal="modal-tambah-sl" class="text-muted-foreground hover:text-foreground">
                <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <form method="POST" action="{{ route('simpan-pinjam.store') }}" data-base-action="{{ route('simpan-pinjam.store') }}">
            @csrf
            <input type="hidden" name="_method" value="POST">
            <div class="space-y-4 px-6 py-5">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Nama Anggota <span class="text-danger">*</span></label>
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
                    <label class="block text-sm font-medium text-foreground mb-1.5">Alamat</label>
                    <input type="text" name="address" placeholder="Alamat anggota"
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Tgl Pinjam <span class="text-danger">*</span></label>
                        <input type="date" name="loanDate" required
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Jatuh Tempo <span class="text-danger">*</span></label>
                        <input type="date" name="dueDate" required
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Jumlah Pinjaman (Rp) <span class="text-danger">*</span></label>
                        <input type="number" name="loanAmount" min="1" required placeholder="0"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Angsuran/Bulan (Rp) <span class="text-danger">*</span></label>
                        <input type="number" name="installmentAmount" min="1" required placeholder="0"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Keperluan</label>
                    <input type="text" name="purpose" placeholder="Tujuan pinjaman"
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
            </div>
            <div class="flex justify-end gap-3 border-t border-border px-6 py-4 sticky bottom-0 bg-surface">
                <button type="button" data-close-modal="modal-tambah-sl"
                    class="rounded-xl border border-input px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">Batal</button>
                <button type="submit"
                    class="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">Simpan</button>
            </div>
        </form>
    </div>
</div>

{{-- MODAL BAYAR ANGSURAN --}}
<div id="modal-bayar-sl" class="modal fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="modal-backdrop absolute inset-0 bg-black/50"></div>
    <div class="relative w-full max-w-md rounded-2xl bg-surface shadow-xl">
        <div class="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 class="text-base font-semibold text-foreground">Catat Angsuran</h3>
            <button data-close-modal="modal-bayar-sl" class="text-muted-foreground hover:text-foreground">
                <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <form method="POST" action="#">
            @csrf
            <div class="space-y-4 px-6 py-5">
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Tanggal Bayar <span class="text-danger">*</span></label>
                    <input type="date" name="paymentDate" required value="{{ now()->format('Y-m-d') }}"
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Jumlah (Rp) <span class="text-danger">*</span></label>
                    <input type="number" name="amount" min="1" required placeholder="0"
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Catatan</label>
                    <input type="text" name="notes" placeholder="Opsional"
                        class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
            </div>
            <div class="flex justify-end gap-3 border-t border-border px-6 py-4">
                <button type="button" data-close-modal="modal-bayar-sl"
                    class="rounded-xl border border-input px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">Batal</button>
                <button type="submit"
                    class="rounded-xl bg-success px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">Simpan Angsuran</button>
            </div>
        </form>
    </div>
</div>
@endsection
