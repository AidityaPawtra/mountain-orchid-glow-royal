<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BumdesType;
use App\Models\Expense;
use App\Models\Income;
use App\Models\InventoryItem;
use App\Models\Loan;
use App\Models\Notification;
use App\Models\SavingsLoan;
use App\Models\SavingsLoanPayment;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BumdesApiController extends Controller
{
    /**
     * Get all bootstrap data for initial state hydration.
     */
    public function bootstrap(): JsonResponse
    {
        return response()->json([
            'settings' => Setting::first(),
            'bumdesTypes' => BumdesType::all(),
            'items' => InventoryItem::all(),
            'income' => Income::latest('date')->get(),
            'expenses' => Expense::latest('date')->get(),
            'loans' => Loan::latest('borrow_date')->get(),
            'savingsLoans' => SavingsLoan::latest('loan_date')->get(),
            'savingsLoanPayments' => SavingsLoanPayment::latest('payment_date')->get(),
            'notifications' => Notification::latest('time')->get(),
            'users' => User::select('id', 'name', 'username', 'email')->get(),
        ]);
    }

    /**
     * Get list of income records or create a new one.
     */
    public function income(Request $request): JsonResponse
    {
        if ($request->isMethod('post')) {
            $validated = $request->validate([
                'bumdesTypeId' => [
                    'nullable',
                    'string',
                    'exists:bumdes_types,id',
                ],
                'date' => [
                    'required',
                    'date',
                ],
                'source' => [
                    'required',
                    'string',
                    'max:150',
                ],
                'category' => [
                    'required',
                    'string',
                    'max:100',
                ],
                'description' => [
                    'nullable',
                    'string',
                ],
                'amount' => [
                    'required',
                    'numeric',
                    'min:0',
                ],
                'proof' => [
                    'nullable',
                    'file',
                    'mimes:jpg,jpeg,png,webp,pdf',
                    'max:5120',
                ],
            ]);

            $proof = $this->storeProof(
                $request,
                'income',
            );

            $record = Income::create([
                'id' => 'inc-' . Str::lower(Str::random(6)),
                'bumdes_type_id' =>
                    $validated['bumdesTypeId'] ?? null,
                'date' =>
                    $validated['date'],
                'source' =>
                    $validated['source'],
                'category' =>
                    $validated['category'],
                'description' =>
                    $validated['description'] ?? '',
                'amount' =>
                    $validated['amount'],
                'proof' =>
                    $proof,
            ]);

            return response()->json([
                'ok' => true,
                'data' => $record,
            ], 201);
        }

        return response()->json(
            Income::latest('date')->get(),
        );
    }

    /**
     * Get list of expense records or create a new one.
     */
    public function expenses(Request $request): JsonResponse
    {
        if ($request->isMethod('post')) {
            $validated = $request->validate([
                'bumdesTypeId' => [
                    'nullable',
                    'string',
                    'exists:bumdes_types,id',
                ],
                'date' => [
                    'required',
                    'date',
                ],
                'category' => [
                    'required',
                    'string',
                    'max:100',
                ],
                'purpose' => [
                    'required',
                    'string',
                    'max:150',
                ],
                'description' => [
                    'nullable',
                    'string',
                ],
                'amount' => [
                    'required',
                    'numeric',
                    'min:0',
                ],
                'proof' => [
                    'nullable',
                    'file',
                    'mimes:jpg,jpeg,png,webp,pdf',
                    'max:5120',
                ],
            ]);

            $proof = $this->storeProof(
                $request,
                'expense',
            );

            $record = Expense::create([
                'id' => 'exp-' . Str::lower(Str::random(6)),
                'bumdes_type_id' =>
                    $validated['bumdesTypeId'] ?? null,
                'date' =>
                    $validated['date'],
                'category' =>
                    $validated['category'],
                'purpose' =>
                    $validated['purpose'],
                'description' =>
                    $validated['description'] ?? '',
                'amount' =>
                    $validated['amount'],
                'proof' =>
                    $proof,
            ]);

            return response()->json([
                'ok' => true,
                'data' => $record,
            ], 201);
        }

        return response()->json(
            Expense::latest('date')->get(),
        );
    }

    /**
     * Store uploaded proof file.
     *
     * Database stores JSON metadata:
     * {
     *   "name": "...",
     *   "path": "proofs/income/....jpg",
     *   "url": "http://localhost:8000/storage/proofs/....jpg",
     *   "mime": "image/jpeg",
     *   "size": 12345
     * }
     */
    private function storeProof(
        Request $request,
        string $type,
    ): ?string {
        if (!$request->hasFile('proof')) {
            return null;
        }

        $file = $request->file('proof');

        if (!$file || !$file->isValid()) {
            return null;
        }

        $path = $file->store(
            'proofs/' . $type,
            'public',
        );

        return json_encode([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
            'mime' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);
    }

    /**
     * Get list of inventory items.
     */
    public function items(Request $request): JsonResponse
    {
        if ($request->isMethod('post')) {
            $validated = $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:150',
                ],
                'category' => [
                    'required',
                    'string',
                    'max:100',
                ],
                'quantity' => [
                    'required',
                    'integer',
                    'min:0',
                ],
                'condition' => [
                    'required',
                    'string',
                    'in:Baik,Rusak Ringan,Rusak Berat',
                ],
            ]);

            $item = InventoryItem::create([
                'id' =>
                    'item-' . Str::lower(Str::random(6)),
                'name' =>
                    $validated['name'],
                'category' =>
                    $validated['category'],
                'quantity' =>
                    $validated['quantity'],
                'borrowed' => 0,
                'condition' =>
                    $validated['condition'],
            ]);

            return response()->json([
                'ok' => true,
                'data' => $item,
            ], 201);
        }

        return response()->json(
            InventoryItem::all(),
        );
    }

    /**
     * Get list of loans.
     */
    public function loans(Request $request): JsonResponse
    {
        if ($request->isMethod('post')) {
            $validated = $request->validate([
                'borrowerName' => [
                    'required',
                    'string',
                    'max:150',
                ],
                'phone' => [
                    'required',
                    'string',
                    'max:50',
                ],
                'itemId' => [
                    'required',
                    'string',
                    'exists:inventory_items,id',
                ],
                'quantity' => [
                    'required',
                    'integer',
                    'min:1',
                ],
                'borrowDate' => [
                    'required',
                    'date',
                ],
                'returnDate' => [
                    'required',
                    'date',
                ],
                'purpose' => [
                    'nullable',
                    'string',
                ],
                'notes' => [
                    'nullable',
                    'string',
                ],
            ]);

            $item = InventoryItem::findOrFail(
                $validated['itemId'],
            );

            $loan = Loan::create([
                'id' =>
                    'loan-' . Str::lower(Str::random(6)),
                'borrower_name' =>
                    $validated['borrowerName'],
                'phone' =>
                    $validated['phone'],
                'item_id' =>
                    $item->id,
                'item_name' =>
                    $item->name,
                'quantity' =>
                    $validated['quantity'],
                'borrow_date' =>
                    $validated['borrowDate'],
                'return_date' =>
                    $validated['returnDate'],
                'purpose' =>
                    $validated['purpose'] ?? '',
                'notes' =>
                    $validated['notes'] ?? '',
                'status' =>
                    'borrowed',
            ]);

            $item->increment(
                'borrowed',
                $validated['quantity'],
            );

            return response()->json([
                'ok' => true,
                'data' => $loan,
            ], 201);
        }

        return response()->json(
            Loan::latest('borrow_date')->get(),
        );
    }

    /**
     * Return a borrowed item.
     */
    public function returnLoan(
        string $id,
    ): JsonResponse {
        $loan = Loan::findOrFail($id);

        if ($loan->status !== 'returned') {
            $loan->update([
                'status' => 'returned',
                'actual_return_date' =>
                    now()->toDateString(),
            ]);

            InventoryItem::where(
                'id',
                $loan->item_id,
            )->decrement(
                'borrowed',
                min(
                    $loan->quantity,
                    InventoryItem::where(
                        'id',
                        $loan->item_id,
                    )->value('borrowed') ?? 0,
                ),
            );
        }

        return response()->json([
            'ok' => true,
            'data' => $loan->fresh(),
        ]);
    }

    /**
     * Get list of savings loans.
     */
    public function savingsLoans(): JsonResponse
    {
        return response()->json(
            SavingsLoan::with('payments')
                ->latest('loan_date')
                ->get(),
        );
    }

    /**
     * Get list of BUMDes units.
     */
    public function bumdesTypes(): JsonResponse
    {
        return response()->json(
            BumdesType::all(),
        );
    }

    /**
     * Get or update settings.
     */
    public function settings(
        Request $request,
    ): JsonResponse {
        if ($request->isMethod('post')) {
            $validated = $request->validate([
                'bumdesName' => [
                    'required',
                    'string',
                ],
                'villageName' => [
                    'required',
                    'string',
                ],
                'address' => [
                    'nullable',
                    'string',
                ],
                'phone' => [
                    'nullable',
                    'string',
                ],
                'email' => [
                    'nullable',
                    'string',
                ],
                'adminName' => [
                    'required',
                    'string',
                ],
                'adminUsername' => [
                    'required',
                    'string',
                ],
                'adminEmail' => [
                    'required',
                    'string',
                ],
            ]);

            $setting = Setting::firstOrCreate([
                'id' => 1,
            ]);

            $setting->update([
                'bumdes_name' =>
                    $validated['bumdesName'],
                'village_name' =>
                    $validated['villageName'],
                'address' =>
                    $validated['address'] ?? '',
                'phone' =>
                    $validated['phone'] ?? '',
                'email' =>
                    $validated['email'] ?? '',
                'admin_name' =>
                    $validated['adminName'],
                'admin_username' =>
                    $validated['adminUsername'],
                'admin_email' =>
                    $validated['adminEmail'],
            ]);

            return response()->json([
                'ok' => true,
                'data' => $setting,
            ]);
        }

        return response()->json(
            Setting::first(),
        );
    }
}