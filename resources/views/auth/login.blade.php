@extends('layouts.auth')
@section('title', 'Login')

@section('content')
<div class="w-full max-w-md">
    {{-- Logo --}}
    <div class="mb-8 text-center">
        <div class="mx-auto mb-4 size-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <svg class="size-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
        </div>
        <h1 class="text-2xl font-bold text-foreground">BUMDes Desa Wengkal</h1>
        <p class="mt-1 text-sm text-muted-foreground">Sistem Administrasi Keuangan & Inventaris</p>
    </div>

    {{-- Card --}}
    <div class="rounded-2xl border border-border bg-surface p-8 shadow-card">
        <h2 class="mb-6 text-lg font-semibold text-foreground">Masuk ke Sistem</h2>

        @if (!empty($errors) && $errors->any())
            <div class="mb-4 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('login.post') }}" class="space-y-4">
            @csrf

            <div>
                <label for="username" class="block text-sm font-medium text-foreground mb-1.5">
                    Username atau Email
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    value="{{ old('username') }}"
                    required
                    autofocus
                    placeholder="admin"
                    class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm
                           placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary
                           focus:border-transparent transition-shadow"
                >
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-foreground mb-1.5">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm
                           placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary
                           focus:border-transparent transition-shadow"
                >
            </div>

            <div class="flex items-center gap-2">
                <input type="checkbox" id="remember" name="remember"
                    class="size-4 rounded border-input accent-primary">
                <label for="remember" class="text-sm text-muted-foreground">Ingat saya</label>
            </div>

            <button type="submit"
                class="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white
                       hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2
                       focus:ring-primary focus:ring-offset-2 mt-2">
                Masuk
            </button>
        </form>
    </div>

    <p class="mt-6 text-center text-xs text-muted-foreground">
        &copy; {{ date('Y') }} BUMDes Desa Wengkal. Hak cipta dilindungi.
    </p>
</div>
@endsection
