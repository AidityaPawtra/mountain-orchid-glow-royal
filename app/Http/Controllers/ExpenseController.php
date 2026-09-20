<?php

namespace App\Http\Controllers;

use App\Models\BumdesType;
use App\Models\Expense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    /**
     * Display a listing of expense records.
     */
    public function index(): Response
    {
        return Inertia::render('UangKeluar', [
            'expenses' => Expense::with('bumdesType')->latest('date')->get(),
            'bumdesTypes' => BumdesType::where('status', 'active')->get(),
        ]);
    }

    /**
     * Store a newly created expense record.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bumdesTypeId' => ['nullable', 'string', 'exists:bumdes_types,id'],
            'date' => ['required', 'date'],
            'category' => ['required', 'string', 'max:100'],
            'purpose' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'amount' => ['required', 'numeric', 'min:0'],
            'proof' => ['nullable'],
        ]);

        Expense::create([
            'id' => 'exp-'.Str::lower(Str::random(6)),
            'bumdes_type_id' => $validated['bumdesTypeId'] ?? null,
            'date' => $validated['date'],
            'category' => $validated['category'],
            'purpose' => $validated['purpose'],
            'description' => $validated['description'] ?? '',
            'amount' => $validated['amount'],
            'proof' => is_array($validated['proof'] ?? null) ? json_encode($validated['proof']) : ($validated['proof'] ?? null),
        ]);

        return redirect()->back()->with('success', 'Pengeluaran berhasil dicatat.');
    }

    /**
     * Update the specified expense record.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $expense = Expense::findOrFail($id);

        $validated = $request->validate([
            'bumdesTypeId' => ['nullable', 'string', 'exists:bumdes_types,id'],
            'date' => ['required', 'date'],
            'category' => ['required', 'string', 'max:100'],
            'purpose' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string'],
            'amount' => ['required', 'numeric', 'min:0'],
            'proof' => ['nullable'],
        ]);

        $expense->update([
            'bumdes_type_id' => $validated['bumdesTypeId'] ?? $expense->bumdes_type_id,
            'date' => $validated['date'],
            'category' => $validated['category'],
            'purpose' => $validated['purpose'],
            'description' => $validated['description'] ?? '',
            'amount' => $validated['amount'],
            'proof' => is_array($validated['proof'] ?? null) ? json_encode($validated['proof']) : ($validated['proof'] ?? $expense->proof),
        ]);

        return redirect()->back()->with('success', 'Pengeluaran berhasil diperbarui.');
    }

    /**
     * Remove the specified expense record.
     */
    public function destroy(string $id): RedirectResponse
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();

        return redirect()->back()->with('success', 'Pengeluaran berhasil dihapus.');
    }
}
