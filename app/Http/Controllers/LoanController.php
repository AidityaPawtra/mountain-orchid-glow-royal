<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\Loan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            // Dibutuhkan form "Edit Peminjaman" untuk memilih barang.
            'items' => InventoryItem::all(),
        ]);
    }

    /**
     * Store a newly created loan record.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateLoan($request);

        $item = InventoryItem::findOrFail($validated['itemId']);

        if (($item->quantity - $item->borrowed) < $validated['quantity']) {
            return redirect()->back()->withErrors([
                'quantity' => 'Stok barang yang tersedia tidak mencukupi untuk dipinjam.',
            ]);
        }

        DB::transaction(function () use ($validated, $item) {
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

            $item->increment('borrowed', $validated['quantity']);
        });

        return redirect()->back()->with('success', 'Peminjaman barang berhasil dicatat.');
    }

    /**
     * Update the specified loan record.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $loan = Loan::findOrFail($id);

        if ($this->isReturned($loan)) {
            return redirect()->back()->withErrors([
                'loan' => 'Peminjaman yang sudah dikembalikan tidak dapat diubah.',
            ]);
        }

        $validated = $this->validateLoan($request);

        $item = InventoryItem::findOrFail($validated['itemId']);

        // Cek stok. Kalau barang yang sama, hanya selisih jumlahnya yang perlu tersedia.
        $sameItem = $loan->item_id === $item->id;
        $needed = $sameItem
            ? $validated['quantity'] - $loan->quantity
            : $validated['quantity'];

        if ($needed > 0 && ($item->quantity - $item->borrowed) < $needed) {
            return redirect()->back()->withErrors([
                'quantity' => 'Stok barang yang tersedia tidak mencukupi untuk perubahan ini.',
            ]);
        }

        DB::transaction(function () use ($loan, $item, $validated, $sameItem, $needed) {
            // Peminjaman yang belum dikembalikan (status borrowed ATAU overdue)
            // memang sedang memakai stok, jadi stok ikut disesuaikan.
            if ($sameItem) {
                if ($needed !== 0) {
                    $item->update(['borrowed' => max(0, $item->borrowed + $needed)]);
                }
            } else {
                $this->releaseStock($loan->item_id, $loan->quantity);
                $item->increment('borrowed', $validated['quantity']);
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
        });

        return redirect()->back()->with('success', 'Data peminjaman berhasil diperbarui.');
    }

    /**
     * Mark loan as returned.
     */
    public function returnLoan(Request $request, string $id): RedirectResponse
    {
        $loan = Loan::findOrFail($id);

        if (! $this->isReturned($loan)) {
            DB::transaction(function () use ($loan) {
                $loan->update([
                    'status' => 'returned',
                    'actual_return_date' => now()->toDateString(),
                ]);

                $this->releaseStock($loan->item_id, $loan->quantity);
            });
        }

        return redirect()->back()->with('success', 'Barang berhasil dikembalikan.');
    }

    /**
     * Remove the specified loan record.
     */
    public function destroy(string $id): RedirectResponse
    {
        $loan = Loan::findOrFail($id);

        DB::transaction(function () use ($loan) {
            // Kalau barang belum dikembalikan, stoknya dikembalikan ke inventaris.
            if (! $this->isReturned($loan)) {
                $this->releaseStock($loan->item_id, $loan->quantity);
            }

            $loan->delete();
        });

        // Dihapus dari halaman detail: kembali ke daftar (bukan ke halaman yang sudah tidak ada).
        return redirect()->route('peminjaman.index')->with('success', 'Peminjaman berhasil dihapus.');
    }

    private function isReturned(Loan $loan): bool
    {
        return $loan->status === 'returned' || $loan->actual_return_date !== null;
    }

    /**
     * Kurangi jumlah "borrowed" pada barang, tidak pernah di bawah 0.
     */
    private function releaseStock(?string $itemId, int $quantity): void
    {
        if (! $itemId) {
            return;
        }

        $item = InventoryItem::find($itemId);

        if ($item) {
            $item->update(['borrowed' => max(0, $item->borrowed - $quantity)]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function validateLoan(Request $request): array
    {
        return $request->validate([
            'borrowerName' => ['required', 'string', 'max:150'],
            'phone' => ['required', 'string', 'max:50'],
            'itemId' => ['required', 'string', 'exists:inventory_items,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'borrowDate' => ['required', 'date'],
            'returnDate' => ['required', 'date', 'after_or_equal:borrowDate'],
            'purpose' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
