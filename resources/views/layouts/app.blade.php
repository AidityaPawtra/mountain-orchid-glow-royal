<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', config('app.name', 'BUMDes Desa Wengkal'))</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-background text-foreground antialiased font-sans">

{{-- MOBILE SIDEBAR OVERLAY --}}
<div id="sidebar-overlay" class="fixed inset-0 z-30 bg-black/50 hidden lg:hidden"></div>

{{-- SIDEBAR --}}
<aside id="sidebar" class="fixed inset-y-0 left-0 z-40 w-[260px] bg-sidebar text-sidebar-fg flex flex-col
    transition-transform duration-200 -translate-x-full lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shrink-0">

    {{-- LOGO --}}
    <div class="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="size-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <svg class="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        points="9 22 9 12 15 12 15 22" class="stroke-current"/>
                </svg>
            </div>
            <div>
                <p class="text-sm font-semibold leading-tight text-sidebar-fg">BUMDes</p>
                <p class="text-xs text-sidebar-muted leading-tight">Desa Wengkal</p>
            </div>
        </div>
        <button id="sidebar-close-btn" class="lg:hidden text-sidebar-muted hover:text-sidebar-fg">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
    </div>

    {{-- NAV --}}
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <a href="{{ route('dashboard') }}" data-nav-link
            class="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg">
            <svg class="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Dashboard
        </a>

        {{-- Keuangan accordion --}}
        <div data-nav-accordion>
            <button data-nav-accordion-toggle
                class="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg">
                <svg class="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                <span class="flex-1 text-left">Keuangan</span>
                <svg data-chevron class="size-4 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div data-nav-accordion-body class="mt-1 space-y-1 pl-4 hidden">
                <a href="{{ route('uang-masuk') }}" data-nav-link
                    class="flex h-10 items-center gap-3 rounded-xl px-3 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg">
                    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                    Uang Masuk
                </a>
                <a href="{{ route('uang-keluar') }}" data-nav-link
                    class="flex h-10 items-center gap-3 rounded-xl px-3 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg">
                    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                    Uang Keluar
                </a>
            </div>
        </div>

        <a href="{{ route('peminjaman.index') }}" data-nav-link
            class="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg">
            <svg class="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            Peminjaman Barang
        </a>

        <a href="{{ route('simpan-pinjam') }}" data-nav-link
            class="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg">
            <svg class="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Simpan Pinjam
        </a>

        <a href="{{ route('barang') }}" data-nav-link
            class="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg">
            <svg class="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            </svg>
            Data Barang
        </a>

        <a href="{{ route('jenis-bumdes.index') }}" data-nav-link
            class="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg">
            <svg class="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            Jenis BUMDes
        </a>

        <a href="{{ route('laporan') }}" data-nav-link
            class="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg">
            <svg class="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Laporan
        </a>

        <a href="{{ route('profile') }}" data-nav-link
            class="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg">
            <svg class="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Profil & Pengaturan
        </a>
    </nav>

    {{-- SIDEBAR FOOTER --}}
    <div class="border-t border-white/10 px-4 py-4">
        <p class="text-[11px] uppercase tracking-wider text-sidebar-muted">Sistem Administrasi</p>
        <p class="mt-1 text-xs text-sidebar-fg/80">Keuangan & Inventaris BUMDes</p>
    </div>
</aside>

{{-- MAIN WRAPPER --}}
<div class="flex flex-col flex-1 min-h-screen lg:pl-[260px]">

    {{-- TOPBAR --}}
    <header class="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-surface/80 backdrop-blur-sm px-4 lg:px-6">
        {{-- Mobile hamburger --}}
        <button id="sidebar-open-btn" class="lg:hidden text-muted-foreground hover:text-foreground -ml-1">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>

        <div class="flex-1"></div>

        {{-- User dropdown --}}
        <div class="relative">
            <button data-dropdown-toggle="user-dropdown"
                class="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors">
                <div class="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    {{ strtoupper(substr(auth()->user()->name ?? 'A', 0, 1)) }}
                </div>
                <span class="hidden sm:block text-sm text-foreground">{{ auth()->user()->name ?? 'Admin' }}</span>
                <svg class="size-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div id="user-dropdown" class="dropdown-menu hidden absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface shadow-lg p-1 z-50">
                <a href="{{ route('profile') }}" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Profil
                </a>
                <hr class="my-1 border-border">
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors">
                        <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        Keluar
                    </button>
                </form>
            </div>
        </div>
    </header>

    {{-- FLASH MESSAGES --}}
    @if (session('success'))
        <div data-flash class="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-success/20 bg-success-soft px-4 py-3 text-sm font-medium text-success shadow-lg">
            <svg class="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ session('success') }}
        </div>
    @endif
    @if (session('error') || $errors->any())
        <div data-flash class="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger shadow-lg">
            <svg class="size-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ session('error') ?? $errors->first() }}
        </div>
    @endif

    {{-- PAGE CONTENT --}}
    <main class="flex-1 p-4 lg:p-6">
        @yield('content')
    </main>
</div>

</body>
</html>
