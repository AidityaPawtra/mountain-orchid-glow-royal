<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\Loan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LoanController extends Controller
{
    /**
     * Display a listing of loans.
     */
    public function index(): Response
    {
        return Inertia::render('Peminjaman/Index', [
            'loans' => Loan::with('item')->latest('borrow_date')->get(),
            'items' => InventoryItem::all(),
        ]);
    }

    /**
     * Display the specified loan detail.
     */
    public function show(string $id): Response
    {
        $loan = Loan::with('item')->findOrFail($id);

        return Inertia::render('Peminjaman/Show', [
            'id' => $id,
            'loan' => $loan,
        ]);
    }

    /**
     * Store a newly created loan record.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'borrowerName' => ['required', 'string', 'max:150'],
            'phone' => ['required', 'string', 'max:50'],
            'itemId' => ['required', 'string', 'exists:inventory_items,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'borrowDate' => ['required', 'date'],
            'returnDate' => ['required', 'date', 'after_or_equal:borrowDate'],
            'purpose' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $item = InventoryItem::findOrFail($validated['itemId']);

        if (($item->quantity - $item->borrowed) < $validated['quantity']) {
            return redirect()->back()->withErrors([
                'quantity' => 'Stok barang yang tersedia tidak mencukupi untuk dipinjam.',
            ]);
        }

        Loan::create([
            'id' => 'loan-'.Str::lower(Str::random(6)),
            'borrower_name' => $validated['borrowerName'],
            'phone' => $validated['phone'],
            'item_id' => $item->id,
            'item_name' => $item->name,
            'quantity' => $validated['quantity'],
            'borrow_date' => $validated['borrowDate'],
            'return_date' => $validated['returnDate'],
            'actual_return_date' => null,
            'purpose' => $validated['purpose'] ?? '',
            'notes' => $validated['notes'] ?? '',
            'status' => 'borrowed',
        ]);

        // Increment borrowed quantity on item
        $item->increment('borrowed', $validated['quantity']);

        return redirect()->back()->with('success', 'Peminjaman barang berhasil dicatat.');
    }

    /**
     * Update the specified loan record.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $loan = Loan::findOrFail($id);

        $validated = $request->validate([
            'borrowerName' => ['required', 'string', 'max:150'],
            'phone' => ['required', 'string', 'max:50'],
            'itemId' => ['required', 'string', 'exists:inventory_items,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'borrowDate' => ['required', 'date'],
            'returnDate' => ['required', 'date', 'after_or_equal:borrowDate'],
            'purpose' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $item = InventoryItem::findOrFail($validated['itemId']);

        // Adjust item borrowed count if quantity or item changed
        if ($loan->status === 'borrowed') {
            if ($loan->item_id === $item->id) {
                $diff = $validated['quantity'] - $loan->quantity;
                $item->increment('borrowed', $diff);
            } else {
                InventoryItem::where('id', $loan->item_id)->decrement('borrowed', $loan->quantity);
                $item->increment('borrowed', $validated['quantity']);
            }
        }

        $loan->update([
            'borrower_name' => $validated['borrowerName'],
            'phone' => $validated['phone'],
            'item_id' => $item->id,
            'item_name' => $item->name,
            'quantity' => $validated['quantity'],
            'borrow_date' => $validated['borrowDate'],
            'return_date' => $validated['returnDate'],
            'purpose' => $validated['purpose'] ?? '',
            'notes' => $validated['notes'] ?? '',
        ]);

        return redirect()->back()->with('success', 'Data peminjaman berhasil diperbarui.');
    }

    /**
     * Mark loan as returned.
     */
    public function returnLoan(Request $request, string $id): RedirectResponse
    {
        $loan = Loan::findOrFail($id);

        if ($loan->status !== 'returned') {
            $loan->update([
                'status' => 'returned',
                'actual_return_date' => now()->toDateString(),
            ]);

            // Decrement borrowed count on item
            InventoryItem::where('id', $loan->item_id)->decrement('borrowed', min($loan->quantity, InventoryItem::where('id', $loan->item_id)->value('borrowed') ?? 0));
        }

        return redirect()->back()->with('success', 'Barang berhasil dikembalikan.');
    }

    /**
     * Remove the specified loan record.
     */
    public function destroy(string $id): RedirectResponse
    {
        $loan = Loan::findOrFail($id);

        if ($loan->status === 'borrowed') {
            InventoryItem::where('id', $loan->item_id)->decrement('borrowed', min($loan->quantity, InventoryItem::where('id', $loan->item_id)->value('borrowed') ?? 0));
        }

        $loan->delete();

        return redirect()->back()->with('success', 'Peminjaman berhasil dihapus.');
    }
}
