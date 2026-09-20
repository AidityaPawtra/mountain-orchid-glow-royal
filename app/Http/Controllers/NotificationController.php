<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class NotificationController extends Controller
{
    /**
     * Mark a notification as read.
     */
    public function markAsRead(string $id): RedirectResponse|JsonResponse
    {
        $notification = Notification::find($id);

        if ($notification) {
            $notification->update(['read' => true]);
        }

        if (request()->wantsJson()) {
            return response()->json(['ok' => true]);
        }

        return redirect()->back();
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): RedirectResponse|JsonResponse
    {
        Notification::where('read', false)->update(['read' => true]);

        if (request()->wantsJson()) {
            return response()->json(['ok' => true]);
        }

        return redirect()->back();
    }
}
