<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InventoryItemController extends Controller
{
    /**
     * Display a listing of inventory items.
     */
    public function index(): Response
    {
        return Inertia::render('Barang', [
            'items' => InventoryItem::latest()->get(),
        ]);
    }

    /**
     * Store a newly created inventory item.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'category' => ['required', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:0'],
            'condition' => ['required', 'string', 'in:Baik,Rusak Ringan,Rusak Berat'],
        ]);

        InventoryItem::create([
            'id' => 'item-'.Str::lower(Str::random(6)),
            'name' => $validated['name'],
            'category' => $validated['category'],
            'quantity' => $validated['quantity'],
            'borrowed' => 0,
            'condition' => $validated['condition'],
        ]);

        return redirect()->back()->with('success', 'Barang inventaris berhasil ditambahkan.');
    }

    /**
     * Update the specified inventory item.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $item = InventoryItem::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'category' => ['required', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:0'],
            'condition' => ['required', 'string', 'in:Baik,Rusak Ringan,Rusak Berat'],
        ]);

        // Jumlah total tidak boleh lebih kecil dari yang sedang dipinjam.
        if ($validated['quantity'] < $item->borrowed) {
            return redirect()->back()->withErrors([
                'quantity' => "Jumlah tidak boleh lebih kecil dari yang sedang dipinjam ({$item->borrowed}).",
            ]);
        }

        $item->update($validated);

        return redirect()->back()->with('success', 'Data barang berhasil diperbarui.');
    }

    /**
     * Remove the specified inventory item.
     */
    public function destroy(string $id): RedirectResponse
    {
        $item = InventoryItem::findOrFail($id);

        if ($item->borrowed > 0) {
            return redirect()->back()->withErrors([
                'item' => 'Barang tidak dapat dihapus karena masih ada yang dipinjam.',
            ]);
        }

        $item->delete();

        return redirect()->back()->with('success', 'Barang inventaris berhasil dihapus.');
    }
}
