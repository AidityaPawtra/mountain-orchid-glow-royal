<?php

namespace App\Http\Controllers;

use App\Models\BumdesType;
use App\Models\Income;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class IncomeController extends Controller
{
    /**
     * Display a listing of income records.
     */
    public function index(): Response
    {
        return Inertia::render('UangMasuk', [
            'income' => Income::with('bumdesType')->latest('date')->get(),
            'bumdesTypes' => BumdesType::where('status', 'active')->get(),
        ]);
    }

    /**
     * Store a newly created income record.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bumdesTypeId' => ['nullable', 'string', 'exists:bumdes_types,id'],
            'date' => ['required', 'date'],
            'source' => ['required', 'string', 'max:150'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'amount' => ['required', 'numeric', 'min:0'],
            'proof' => ['nullable'],
        ]);

        Income::create([
            'id' => 'inc-'.Str::lower(Str::random(6)),
            'bumdes_type_id' => $validated['bumdesTypeId'] ?? null,
            'date' => $validated['date'],
            'source' => $validated['source'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? '',
            'amount' => $validated['amount'],
            'proof' => is_array($validated['proof'] ?? null) ? json_encode($validated['proof']) : ($validated['proof'] ?? null),
        ]);

        return redirect()->back()->with('success', 'Pemasukan berhasil dicatat.');
    }

    /**
     * Update the specified income record.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $income = Income::findOrFail($id);

        $validated = $request->validate([
            'bumdesTypeId' => ['nullable', 'string', 'exists:bumdes_types,id'],
            'date' => ['required', 'date'],
            'source' => ['required', 'string', 'max:150'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'amount' => ['required', 'numeric', 'min:0'],
            'proof' => ['nullable'],
        ]);

        $income->update([
            'bumdes_type_id' => $validated['bumdesTypeId'] ?? $income->bumdes_type_id,
            'date' => $validated['date'],
            'source' => $validated['source'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? '',
            'amount' => $validated['amount'],
            'proof' => is_array($validated['proof'] ?? null) ? json_encode($validated['proof']) : ($validated['proof'] ?? $income->proof),
        ]);

        return redirect()->back()->with('success', 'Pemasukan berhasil diperbarui.');
    }

    /**
     * Remove the specified income record.
     */
    public function destroy(string $id): RedirectResponse
    {
        $income = Income::findOrFail($id);
        $income->delete();

        return redirect()->back()->with('success', 'Pemasukan berhasil dihapus.');
    }
}
