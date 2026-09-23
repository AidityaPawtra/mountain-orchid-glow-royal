@extends('layouts.app')
@section('title', 'Dashboard - BUMDes Desa Wengkal')

@section('content')
<div class="space-y-6">
    {{-- PAGE HEADER --}}
    <div>
        <h1 class="text-2xl font-bold text-foreground">Dashboard</h1>
        <p class="mt-1 text-sm text-muted-foreground">Selamat datang, {{ auth()->user()->name ?? 'Admin' }}</p>
    </div>

    {{-- STAT CARDS --}}
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div class="flex items-center justify-between">
                <p class="text-sm text-muted-foreground font-medium">Total Uang Masuk</p>
                <span class="size-9 rounded-xl bg-primary-soft flex items-center justify-center">
                    <svg class="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                </span>
            </div>
            <p class="mt-3 text-2xl font-bold text-foreground">{{ 'Rp ' . number_format($totalIncome, 0, ',', '.') }}</p>
        </div>

        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div class="flex items-center justify-between">
                <p class="text-sm text-muted-foreground font-medium">Total Uang Keluar</p>
                <span class="size-9 rounded-xl bg-danger-soft flex items-center justify-center">
                    <svg class="size-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                </span>
            </div>
            <p class="mt-3 text-2xl font-bold text-foreground">{{ 'Rp ' . number_format($totalExpense, 0, ',', '.') }}</p>
        </div>

        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div class="flex items-center justify-between">
                <p class="text-sm text-muted-foreground font-medium">Saldo BUMDes</p>
                <span class="size-9 rounded-xl bg-success-soft flex items-center justify-center">
                    <svg class="size-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                </span>
            </div>
            <p class="mt-3 text-2xl font-bold {{ $balance >= 0 ? 'text-success' : 'text-danger' }}">
                {{ 'Rp ' . number_format($balance, 0, ',', '.') }}
            </p>
        </div>

        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div class="flex items-center justify-between">
                <p class="text-sm text-muted-foreground font-medium">Peminjaman Aktif</p>
                <span class="size-9 rounded-xl bg-warning-soft flex items-center justify-center">
                    <svg class="size-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                </span>
            </div>
            <p class="mt-3 text-2xl font-bold text-foreground">{{ $activeLoans }}</p>
        </div>
    </div>

    {{-- CHART + LOAN STATS --}}
    <div class="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        {{-- Chart --}}
        <div class="rounded-2xl border border-border bg-surface p-0 shadow-card overflow-hidden">
            <div class="p-5 pb-2">
                <h2 class="text-base font-semibold text-foreground">Grafik Arus Kas</h2>
                <p class="text-sm text-muted-foreground">Perbandingan uang masuk dan keluar per bulan ({{ now()->year }})</p>
            </div>
            <div class="p-5 pt-2 h-72">
                <canvas id="cashflowChart"></canvas>
            </div>
        </div>

        {{-- Loan stats --}}
        <div class="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h3 class="text-base font-semibold text-foreground">Peminjaman Barang</h3>
            <p class="mt-1 text-sm text-muted-foreground">Ringkasan status inventaris yang sedang beredar.</p>
            <div class="mt-5 space-y-3">
                <div class="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                    <span class="text-sm text-muted-foreground">Aktif</span>
                    <span class="rounded-full bg-warning-soft text-warning px-2.5 py-0.5 text-sm font-semibold">{{ $activeLoans }}</span>
                </div>
                <div class="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                    <span class="text-sm text-muted-foreground">Selesai</span>
                    <span class="rounded-full bg-success-soft text-success px-2.5 py-0.5 text-sm font-semibold">{{ $returnedLoans }}</span>
                </div>
                <div class="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                    <span class="text-sm text-muted-foreground">Terlambat</span>
                    <span class="rounded-full bg-danger-soft text-danger px-2.5 py-0.5 text-sm font-semibold">{{ $overdueLoans }}</span>
                </div>
            </div>
            <a href="{{ route('peminjaman.index') }}"
                class="mt-6 inline-flex text-sm font-medium text-primary hover:underline">
                Lihat semua peminjaman →
            </a>
        </div>
    </div>

    {{-- RECENT TRANSACTIONS --}}
    <div class="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div class="p-5 pb-3">
            <h2 class="text-base font-semibold text-foreground">Transaksi Terbaru</h2>
        </div>
        @if ($recent->isEmpty())
            <div class="px-5 pb-5">
                <p class="text-sm text-muted-foreground text-center py-8">Belum ada transaksi yang dicatat.</p>
            </div>
        @else
            <ul class="divide-y divide-border">
                @foreach ($recent as $row)
                    <li class="flex items-center justify-between gap-4 px-5 py-3.5">
                        <div class="min-w-0">
                            <p class="truncate text-sm font-medium text-foreground">{{ $row['title'] }}</p>
                            <p class="text-xs text-muted-foreground">
                                {{ \Carbon\Carbon::parse($row['date'])->format('d M Y') }} · {{ $row['category'] }}
                            </p>
                        </div>
                        <p class="shrink-0 text-sm font-semibold tabular-nums {{ $row['type'] === 'income' ? 'text-success' : 'text-danger' }}">
                            {{ $row['type'] === 'income' ? '+' : '−' }}Rp {{ number_format($row['amount'], 0, ',', '.') }}
                        </p>
                    </li>
                @endforeach
            </ul>
        @endif
    </div>
</div>

{{-- Chart.js --}}
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script>
    const chartData = @json($chartData->values());
    const ctx = document.getElementById('cashflowChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.map(d => d.month),
            datasets: [
                {
                    label: 'Uang Masuk',
                    data: chartData.map(d => d.masuk),
                    backgroundColor: '#0b63ce',
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'Uang Keluar',
                    data: chartData.map(d => d.keluar),
                    backgroundColor: '#c03535',
                    borderRadius: 6,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: ctx => 'Rp ' + Number(ctx.raw).toLocaleString('id-ID')
                    }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    grid: { color: '#e2e8f0' },
                    ticks: {
                        callback: v => 'Rp ' + (v/1000) + 'k'
                    }
                }
            }
        }
    });
</script>
@endsection
