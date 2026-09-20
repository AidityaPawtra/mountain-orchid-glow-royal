<?php

namespace App\Http\Controllers;

use App\Models\BumdesType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BumdesTypeController extends Controller
{
    /**
     * Display a listing of BUMDes units.
     */
    public function index(): Response
    {
        return Inertia::render('JenisBumdes/Index', [
            'bumdesTypes' => BumdesType::withCount(['incomes', 'expenses'])->latest()->get(),
        ]);
    }

    /**
     * Display the specified BUMDes unit and its cashflow.
     */
    public function show(string $id): Response
    {
        $type = BumdesType::with(['incomes' => fn ($q) => $q->latest('date'), 'expenses' => fn ($q) => $q->latest('date')])->findOrFail($id);

        return Inertia::render('JenisBumdes/Show', [
            'id' => $id,
            'bumdesType' => $type,
        ]);
    }

    /**
     * Store a newly created BUMDes unit.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        BumdesType::create([
            'id' => 'bumdes-'.Str::slug($validated['name']).'-'.Str::lower(Str::random(4)),
            'name' => $validated['name'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? '',
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Unit usaha BUMDes berhasil ditambahkan.');
    }

    /**
     * Update the specified BUMDes unit.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $type = BumdesType::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $type->update($validated);

        return redirect()->back()->with('success', 'Unit usaha BUMDes berhasil diperbarui.');
    }

    /**
     * Remove the specified BUMDes unit.
     */
    public function destroy(string $id): RedirectResponse
    {
        $type = BumdesType::findOrFail($id);
        $type->delete();

        return redirect()->back()->with('success', 'Unit usaha BUMDes berhasil dihapus.');
    }
}
