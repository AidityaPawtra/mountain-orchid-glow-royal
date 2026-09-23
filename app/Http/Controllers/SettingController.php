<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $settings = Setting::first();

        // Data admin ditampilkan dari akun yang benar-benar dipakai login
        // (tabel users), supaya form profil selalu sama dengan akun login.
        if ($settings && $user) {
            $settings->admin_name = $user->name;
            $settings->admin_username = $user->username ?? $settings->admin_username;
            $settings->admin_email = $user->email;
        }

        return Inertia::render('Profile', [
            'settings' => $settings,
            'user' => $user,
        ]);
    }

    /**
     * Simpan profil BUMDes dan profil admin.
     * Password TIDAK diubah di sini. Gunakan updatePassword().
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'bumdesName' => ['required', 'string', 'max:150'],
            'villageName' => ['required', 'string', 'max:150'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:100'],
            'adminName' => ['required', 'string', 'max:100'],
            'adminUsername' => ['required', 'string', 'max:100', Rule::unique('users', 'username')->ignore($user->id)],
            'adminEmail' => ['required', 'email', 'max:100', Rule::unique('users', 'email')->ignore($user->id)],
        ], [
            'adminUsername.unique' => 'Username sudah dipakai akun lain.',
            'adminEmail.unique' => 'Email sudah dipakai akun lain.',
        ]);

        DB::transaction(function () use ($validated, $user) {
            $setting = Setting::firstOrCreate(['id' => 1]);
            $setting->update([
                'bumdes_name' => $validated['bumdesName'],
                'village_name' => $validated['villageName'],
                'address' => $validated['address'] ?? '',
                'phone' => $validated['phone'] ?? '',
                'email' => $validated['email'] ?? '',
                'admin_name' => $validated['adminName'],
                'admin_username' => $validated['adminUsername'],
                'admin_email' => $validated['adminEmail'],
            ]);

            $user->update([
                'name' => $validated['adminName'],
                'username' => $validated['adminUsername'],
                'email' => $validated['adminEmail'],
            ]);
        });

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }

    /**
     * Ubah password akun yang sedang login.
     * Disimpan (di-hash) ke tabel users, sumber yang sama dengan halaman login.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'currentPassword' => ['required', 'string'],
            'newPassword' => ['required', 'string', 'min:8', 'different:currentPassword'],
        ], [
            'currentPassword.required' => 'Password saat ini wajib diisi.',
            'newPassword.required' => 'Password baru wajib diisi.',
            'newPassword.min' => 'Password baru minimal 8 karakter.',
            'newPassword.different' => 'Password baru harus berbeda dari password saat ini.',
        ]);

        $user = $request->user();

        if (! $user) {
            return redirect()->back()->withErrors([
                'currentPassword' => 'Pengguna tidak ditemukan.',
            ]);
        }

        if (! Hash::check($validated['currentPassword'], $user->password)) {
            return redirect()->back()->withErrors([
                'currentPassword' => 'Password saat ini salah.',
            ]);
        }

        // Cast 'hashed' pada model User akan meng-hash password ini.
        $user->update([
            'password' => $validated['newPassword'],
        ]);

        return redirect()->back()->with('success', 'Password berhasil diubah.');
    }
}
