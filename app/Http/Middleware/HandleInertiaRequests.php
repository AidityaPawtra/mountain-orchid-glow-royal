<?php

namespace App\Http\Middleware;

use App\Models\Notification;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'username' => $request->user()->username,
                    'email' => $request->user()->email,
                ] : null,
            ],

            // Profil BUMDes (dipakai Topbar dan judul Laporan). Diambil dari database.
            'settings' => fn () => $request->user() ? Setting::first() : null,

            // Notifikasi Topbar. Diambil dari database, terbaru di atas.
            'notifications' => fn () => $request->user()
                ? Notification::latest('time')->limit(20)->get()
                : [],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
