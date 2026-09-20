<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display the profile and application settings page.
     */
    public function index(): Response
    {
        $setting = Setting::first();
        $user = auth()->user() ?? User::where('email', 'admin@bumdeswengkal.id')->first();

        return Inertia::render('Profile', [
            'settings' => $setting,
            'user' => $user,
        ]);
    }

    /**
     * Update application and admin profile settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bumdesName' => ['required', 'string', 'max:150'],
            'villageName' => ['required', 'string', 'max:150'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:100'],
            'adminName' => ['required', 'string', 'max:100'],
            'adminUsername' => ['required', 'string', 'max:100'],
            'adminEmail' => ['required', 'email', 'max:100'],
            'newPassword' => ['nullable', 'string', 'min:6'],
        ]);

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

        // Update admin user account
        $user = auth()->user() ?? User::where('email', 'admin@bumdeswengkal.id')->first();
        if ($user) {
            $userUpdates = [
                'name' => $validated['adminName'],
                'username' => $validated['adminUsername'],
                'email' => $validated['adminEmail'],
            ];

            if (! empty($validated['newPassword'])) {
                $userUpdates['password'] = Hash::make($validated['newPassword']);
            }

            $user->update($userUpdates);
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
