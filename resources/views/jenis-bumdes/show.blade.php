@extends('layouts.app')
@section('title', $bumdesType->name)

@section('content')
<div class="space-y-6">
    <div class="flex items-center gap-4">
        <a href="{{ route('jenis-bumdes.index') }}"
            class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Kembali
        </a>
        <div>
            <h1 class="text-2xl font-bold text-foreground">{{ $bumdesType->name }}</h1>
            <p class="mt-0.5 text-sm text-muted-foreground">{{ $bumdesType->category }}</p>
        </div>
    </div>

    @php
        $totalIncome  = $bumdesType->incomes->sum('amount');
        $totalExpense = $bumdesType->expenses->sum('amount');
        $balance      = $totalIncome - $totalExpense;
    @endphp

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
            <p class="text-sm text-muted-foreground font-medium">Saldo</p>
            <p class="mt-2 text-2xl font-bold {{ $balance >= 0 ? 'text-success' : 'text-danger' }}">
                Rp {{ number_format($balance, 0, ',', '.') }}
            </p>
        </div>
    </div>

    {{-- Tabs --}}
    <div class="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div class="flex border-b border-border px-5">
            <button data-tab-btn="tab-income" data-tab-group="bumdes-detail"
                class="tab-active -mb-px border-b-2 border-primary px-4 py-3.5 text-sm font-medium text-primary">
                Pemasukan ({{ $bumdesType->incomes->count() }})
            </button>
            <button data-tab-btn="tab-expense" data-tab-group="bumdes-detail"
                class="tab-inactive px-4 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pengeluaran ({{ $bumdesType->expenses->count() }})
            </button>
        </div>

        <div id="tab-income" data-tab-panel-group="bumdes-detail">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="border-b border-border bg-muted/40">
                        <tr>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Tanggal</th>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Sumber</th>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Kategori</th>
                            <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        @forelse ($bumdesType->incomes as $inc)
                            <tr class="hover:bg-muted/30">
                                <td class="px-5 py-3.5 text-muted-foreground">{{ \Carbon\Carbon::parse($inc->date)->format('d M Y') }}</td>
                                <td class="px-5 py-3.5 text-foreground">{{ $inc->source }}</td>
                                <td class="px-5 py-3.5"><span class="rounded-full bg-primary-soft text-primary px-2.5 py-0.5 text-xs">{{ $inc->category }}</span></td>
                                <td class="px-5 py-3.5 text-right font-semibold text-success tabular-nums">+Rp {{ number_format($inc->amount, 0, ',', '.') }}</td>
                            </tr>
                        @empty
                            <tr><td colspan="4" class="px-5 py-8 text-center text-muted-foreground">Belum ada pemasukan.</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <div id="tab-expense" data-tab-panel-group="bumdes-detail" class="hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="border-b border-border bg-muted/40">
                        <tr>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Tanggal</th>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Keperluan</th>
                            <th class="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Kategori</th>
                            <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        @forelse ($bumdesType->expenses as $exp)
                            <tr class="hover:bg-muted/30">
                                <td class="px-5 py-3.5 text-muted-foreground">{{ \Carbon\Carbon::parse($exp->date)->format('d M Y') }}</td>
                                <td class="px-5 py-3.5 text-foreground">{{ $exp->purpose }}</td>
                                <td class="px-5 py-3.5"><span class="rounded-full bg-warning-soft text-warning px-2.5 py-0.5 text-xs">{{ $exp->category }}</span></td>
                                <td class="px-5 py-3.5 text-right font-semibold text-danger tabular-nums">-Rp {{ number_format($exp->amount, 0, ',', '.') }}</td>
                            </tr>
                        @empty
                            <tr><td colspan="4" class="px-5 py-8 text-center text-muted-foreground">Belum ada pengeluaran.</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style>
.tab-active { border-bottom: 2px solid var(--color-primary); color: var(--color-primary); }
.tab-inactive { border-bottom: 2px solid transparent; color: var(--color-muted-foreground); }
</style>
@endsection
