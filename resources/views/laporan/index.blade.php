@extends('layouts.app')
@section('title', 'Laporan Keuangan')

@section('content')
<div class="space-y-6">
    <div>
        <h1 class="text-2xl font-bold text-foreground">Laporan Keuangan</h1>
        <p class="mt-1 text-sm text-muted-foreground">Ringkasan keuangan BUMDes Desa Wengkal</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Total Pemasukan</p>
            <p class="mt-2 text-2xl font-bold text-success">Rp {{ number_format($totalIncome, 0, ',', '.') }}</p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Total Pengeluaran</p>
            <p class="mt-2 text-2xl font-bold text-danger">Rp {{ number_format($totalExpense, 0, ',', '.') }}</p>
        </div>
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <p class="text-sm text-muted-foreground font-medium">Saldo Akhir</p>
            <p class="mt-2 text-2xl font-bold {{ $balance >= 0 ? 'text-success' : 'text-danger' }}">
                Rp {{ number_format($balance, 0, ',', '.') }}
            </p>
        </div>
    </div>

    {{-- Per Unit BUMDes --}}
    <div class="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div class="p-5 pb-3">
            <h2 class="text-base font-semibold text-foreground">Ringkasan per Unit BUMDes</h2>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="border-y border-border bg-muted/40">
                    <tr>
                        <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Unit BUMDes</th>
                        <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Pemasukan</th>
                        <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Pengeluaran</th>
                        <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Saldo</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border">
                    @foreach ($bumdesTypes as $type)
                        @php
                            $inc  = $income->where('bumdes_type_id', $type->id)->sum('amount');
                            $exp  = $expenses->where('bumdes_type_id', $type->id)->sum('amount');
                            $bal  = $inc - $exp;
                        @endphp
                        <tr class="hover:bg-muted/30">
                            <td class="px-5 py-3.5 font-medium text-foreground">{{ $type->name }}</td>
                            <td class="px-5 py-3.5 text-right tabular-nums text-success">+Rp {{ number_format($inc, 0, ',', '.') }}</td>
                            <td class="px-5 py-3.5 text-right tabular-nums text-danger">-Rp {{ number_format($exp, 0, ',', '.') }}</td>
                            <td class="px-5 py-3.5 text-right tabular-nums font-semibold {{ $bal >= 0 ? 'text-success' : 'text-danger' }}">
                                Rp {{ number_format($bal, 0, ',', '.') }}
                            </td>
                        </tr>
                    @endforeach
                    {{-- Tanpa unit --}}
                    @php
                        $incNoUnit  = $income->whereNull('bumdes_type_id')->sum('amount');
                        $expNoUnit  = $expenses->whereNull('bumdes_type_id')->sum('amount');
                        $balNoUnit  = $incNoUnit - $expNoUnit;
                    @endphp
                    @if ($incNoUnit > 0 || $expNoUnit > 0)
                        <tr class="hover:bg-muted/30">
                            <td class="px-5 py-3.5 text-muted-foreground italic">Tanpa Unit</td>
                            <td class="px-5 py-3.5 text-right tabular-nums text-success">+Rp {{ number_format($incNoUnit, 0, ',', '.') }}</td>
                            <td class="px-5 py-3.5 text-right tabular-nums text-danger">-Rp {{ number_format($expNoUnit, 0, ',', '.') }}</td>
                            <td class="px-5 py-3.5 text-right tabular-nums font-semibold {{ $balNoUnit >= 0 ? 'text-success' : 'text-danger' }}">
                                Rp {{ number_format($balNoUnit, 0, ',', '.') }}
                            </td>
                        </tr>
                    @endif
                </tbody>
            </table>
        </div>
    </div>

    {{-- Tabs: Pemasukan / Pengeluaran --}}
    <div class="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div class="flex border-b border-border px-5">
            <button data-tab-btn="tab-r-income" data-tab-group="laporan"
                class="tab-active -mb-px border-b-2 border-primary px-4 py-3.5 text-sm font-medium text-primary">
                Pemasukan ({{ $income->count() }})
            </button>
            <button data-tab-btn="tab-r-expense" data-tab-group="laporan"
                class="tab-inactive px-4 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pengeluaran ({{ $expenses->count() }})
            </button>
        </div>

        <div id="tab-r-income" data-tab-panel-group="laporan">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="border-b border-border bg-muted/40">
                        <tr>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Tanggal</th>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Sumber</th>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Kategori</th>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Unit</th>
                            <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        @forelse ($income as $inc)
                            <tr class="hover:bg-muted/30">
                                <td class="px-5 py-3.5 text-muted-foreground">{{ \Carbon\Carbon::parse($inc->date)->format('d M Y') }}</td>
                                <td class="px-5 py-3.5 text-foreground">{{ $inc->source }}</td>
                                <td class="px-5 py-3.5"><span class="rounded-full bg-primary-soft text-primary px-2.5 py-0.5 text-xs">{{ $inc->category }}</span></td>
                                <td class="px-5 py-3.5 text-muted-foreground">{{ $inc->bumdesType?->name ?? '-' }}</td>
                                <td class="px-5 py-3.5 text-right font-semibold text-success tabular-nums">+Rp {{ number_format($inc->amount, 0, ',', '.') }}</td>
                            </tr>
                        @empty
                            <tr><td colspan="5" class="px-5 py-8 text-center text-muted-foreground">Belum ada data.</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <div id="tab-r-expense" data-tab-panel-group="laporan" class="hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="border-b border-border bg-muted/40">
                        <tr>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Tanggal</th>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Keperluan</th>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Kategori</th>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Unit</th>
                            <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        @forelse ($expenses as $exp)
                            <tr class="hover:bg-muted/30">
                                <td class="px-5 py-3.5 text-muted-foreground">{{ \Carbon\Carbon::parse($exp->date)->format('d M Y') }}</td>
                                <td class="px-5 py-3.5 text-foreground">{{ $exp->purpose }}</td>
                                <td class="px-5 py-3.5"><span class="rounded-full bg-warning-soft text-warning px-2.5 py-0.5 text-xs">{{ $exp->category }}</span></td>
                                <td class="px-5 py-3.5 text-muted-foreground">{{ $exp->bumdesType?->name ?? '-' }}</td>
                                <td class="px-5 py-3.5 text-right font-semibold text-danger tabular-nums">-Rp {{ number_format($exp->amount, 0, ',', '.') }}</td>
                            </tr>
                        @empty
                            <tr><td colspan="5" class="px-5 py-8 text-center text-muted-foreground">Belum ada data.</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<style>
.tab-active { border-bottom: 2px solid var(--color-primary); color: var(--color-primary); }
.tab-inactive { border-bottom: 2px solid transparent; }
</style>
@endsection
