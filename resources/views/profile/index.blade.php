@extends('layouts.app')
@section('title', 'Profil & Pengaturan')

@section('content')
<div class="space-y-6">
    <div>
        <h1 class="text-2xl font-bold text-foreground">Profil & Pengaturan</h1>
        <p class="mt-1 text-sm text-muted-foreground">Kelola informasi BUMDes dan akun administrator</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
        {{-- Info BUMDes --}}
        <div class="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <h2 class="text-base font-semibold text-foreground mb-5">Informasi BUMDes</h2>
            <form method="POST" action="{{ route('profile.update') }}">
                @csrf @method('PUT')
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Nama BUMDes <span class="text-danger">*</span></label>
                        <input type="text" name="bumdesName" required
                            value="{{ old('bumdesName', $settings?->bumdes_name ?? '') }}"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Nama Desa <span class="text-danger">*</span></label>
                        <input type="text" name="villageName" required
                            value="{{ old('villageName', $settings?->village_name ?? '') }}"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Alamat</label>
                        <textarea name="address" rows="2"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none">{{ old('address', $settings?->address ?? '') }}</textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-foreground mb-1.5">No. Telepon</label>
                            <input type="text" name="phone" value="{{ old('phone', $settings?->phone ?? '') }}"
                                class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-foreground mb-1.5">Email</label>
                            <input type="email" name="email" value="{{ old('email', $settings?->email ?? '') }}"
                                class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        </div>
                    </div>
                    <hr class="border-border">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Nama Admin <span class="text-danger">*</span></label>
                        <input type="text" name="adminName" required value="{{ old('adminName', $user?->name ?? '') }}"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Username Admin <span class="text-danger">*</span></label>
                        <input type="text" name="adminUsername" required value="{{ old('adminUsername', $user?->username ?? '') }}"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Email Admin <span class="text-danger">*</span></label>
                        <input type="email" name="adminEmail" required value="{{ old('adminEmail', $user?->email ?? '') }}"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                </div>
                <div class="mt-5">
                    <button type="submit"
                        class="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>

        {{-- Ganti Password --}}
        <div class="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <h2 class="text-base font-semibold text-foreground mb-5">Ganti Password</h2>
            <form method="POST" action="{{ route('profile.password') }}">
                @csrf @method('PUT')
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Password Saat Ini <span class="text-danger">*</span></label>
                        <input type="password" name="currentPassword" required
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        @error('currentPassword')
                            <p class="mt-1 text-xs text-danger">{{ $message }}</p>
                        @enderror
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-foreground mb-1.5">Password Baru <span class="text-danger">*</span></label>
                        <input type="password" name="newPassword" required minlength="8"
                            class="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    </div>
                </div>
                <div class="mt-5">
                    <button type="submit"
                        class="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                        Ganti Password
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
