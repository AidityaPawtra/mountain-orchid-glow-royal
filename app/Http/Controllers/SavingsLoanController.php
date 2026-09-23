<?php

namespace App\Http\Controllers;

use App\Models\SavingsLoan;
use App\Models\SavingsLoanPayment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SavingsLoanController extends Controller
{
    /**
     * Display a listing of savings and loans.
     */
    public function index(): Response
    {
        return Inertia::render('SimpanPinjam', [
            'savingsLoans' => SavingsLoan::with('payments')->latest('loan_date')->get(),
            'savingsLoanPayments' => SavingsLoanPayment::latest('payment_date')->get(),
        ]);
    }

    /**
     * Store a newly created savings loan record.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'borrowerName' => ['required', 'string', 'max:150'],
            'phone' => ['required', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'loanDate' => ['required', 'date'],
            'dueDate' => ['required', 'date', 'after_or_equal:loanDate'],
            'loanAmount' => ['required', 'numeric', 'min:1'],
            'installmentAmount' => ['required', 'numeric', 'min:1'],
            'purpose' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        SavingsLoan::create([
            'id' => 'sl-'.Str::lower(Str::random(6)),
            'borrower_name' => $validated['borrowerName'],
            'phone' => $validated['phone'],
            'address' => $validated['address'] ?? '',
            'loan_date' => $validated['loanDate'],
            'due_date' => $validated['dueDate'],
            'loan_amount' => $validated['loanAmount'],
            'installment_amount' => $validated['installmentAmount'],
            'total_paid' => 0,
            'purpose' => $validated['purpose'] ?? '',
            'notes' => $validated['notes'] ?? '',
            'status' => 'active',
        ]);

        return redirect()->back()->with('success', 'Pinjaman uang baru berhasil dicatat.');
    }

    /**
     * Update the specified savings loan record.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $savingsLoan = SavingsLoan::findOrFail($id);

        $validated = $request->validate([
            'borrowerName' => ['required', 'string', 'max:150'],
            'phone' => ['required', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'loanDate' => ['required', 'date'],
            'dueDate' => ['required', 'date', 'after_or_equal:loanDate'],
            'loanAmount' => ['required', 'numeric', 'min:1'],
            'installmentAmount' => ['required', 'numeric', 'min:1'],
            'purpose' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        // Status mengikuti total yang sudah dibayar terhadap jumlah pinjaman baru.
        $status = $savingsLoan->total_paid >= $validated['loanAmount'] ? 'paid' : 'active';

        $savingsLoan->update([
            'borrower_name' => $validated['borrowerName'],
            'phone' => $validated['phone'],
            'address' => $validated['address'] ?? '',
            'loan_date' => $validated['loanDate'],
            'due_date' => $validated['dueDate'],
            'loan_amount' => $validated['loanAmount'],
            'installment_amount' => $validated['installmentAmount'],
            'purpose' => $validated['purpose'] ?? '',
            'notes' => $validated['notes'] ?? '',
            'status' => $status,
        ]);

        return redirect()->back()->with('success', 'Data pinjaman berhasil diperbarui.');
    }

    /**
     * Record a new installment payment.
     */
    public function addPayment(Request $request, string $id): RedirectResponse
    {
        $savingsLoan = SavingsLoan::findOrFail($id);

        $validated = $request->validate([
            'paymentDate' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        // Pembayaran tidak boleh melebihi sisa pinjaman.
        $remaining = max(0, round((float) $savingsLoan->loan_amount - (float) $savingsLoan->total_paid, 2));
        if (round((float) $validated['amount'], 2) > $remaining) {
            return redirect()->back()->withErrors([
                'amount' => 'Pembayaran tidak boleh lebih dari sisa pinjaman.',
            ]);
        }

        SavingsLoanPayment::create([
            'id' => 'slp-'.Str::lower(Str::random(6)),
            'savings_loan_id' => $savingsLoan->id,
            'payment_date' => $validated['paymentDate'],
            'amount' => $validated['amount'],
            'notes' => $validated['notes'] ?? '',
        ]);

        $newTotal = $savingsLoan->total_paid + $validated['amount'];
        $newStatus = $newTotal >= $savingsLoan->loan_amount ? 'paid' : 'active';

        $savingsLoan->update([
            'total_paid' => $newTotal,
            'status' => $newStatus,
        ]);

        return redirect()->back()->with('success', 'Pembayaran angsuran berhasil dicatat.');
    }

    /**
     * Remove the specified savings loan record.
     */
    public function destroy(string $id): RedirectResponse
    {
        $savingsLoan = SavingsLoan::findOrFail($id);
        $savingsLoan->delete();

        return redirect()->back()->with('success', 'Data simpan pinjam berhasil dihapus.');
    }
}
