<?php

namespace App\Http\Middleware;

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
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $setting = Setting::first();
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => (string) $user->id,
                    'name' => $user->name,
                    'username' => $user->username ?? 'admin',
                    'email' => $user->email,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'initialData' => [
                'settings' => $setting ? [
                    'bumdesName' => $setting->bumdes_name,
                    'villageName' => $setting->village_name,
                    'address' => $setting->address ?? '',
                    'phone' => $setting->phone ?? '',
                    'email' => $setting->email ?? '',
                    'adminName' => $setting->admin_name ?? 'Admin',
                    'adminUsername' => $setting->admin_username ?? 'admin',
                    'adminEmail' => $setting->admin_email ?? 'admin@bumdeswengkal.id',
                ] : null,
                'bumdesTypes' => BumdesType::all()->map(fn ($t) => [
                    'id' => $t->id,
                    'name' => $t->name,
                    'category' => $t->category,
                    'description' => $t->description ?? '',
                    'status' => $t->status,
                    'createdAt' => $t->created_at?->toISOString() ?? now()->toISOString(),
                ]),
                'items' => InventoryItem::all()->map(fn ($i) => [
                    'id' => $i->id,
                    'name' => $i->name,
                    'category' => $i->category,
                    'quantity' => (int) $i->quantity,
                    'borrowed' => (int) $i->borrowed,
                    'condition' => $i->condition,
                ]),
                'income' => Income::latest('date')->get()->map(fn ($inc) => [
                    'id' => $inc->id,
                    'bumdesTypeId' => $inc->bumdes_type_id ?? '',
                    'date' => $inc->date instanceof \DateTimeInterface ? $inc->date->format('Y-m-d') : (string) $inc->date,
                    'source' => $inc->source,
                    'category' => $inc->category,
                    'description' => $inc->description ?? '',
                    'amount' => (float) $inc->amount,
                    'proof' => $inc->proof ? json_decode($inc->proof, true) : null,
                    'createdAt' => $inc->created_at?->toISOString() ?? now()->toISOString(),
                ]),
                'expenses' => Expense::latest('date')->get()->map(fn ($exp) => [
                    'id' => $exp->id,
                    'bumdesTypeId' => $exp->bumdes_type_id ?? '',
                    'date' => $exp->date instanceof \DateTimeInterface ? $exp->date->format('Y-m-d') : (string) $exp->date,
                    'category' => $exp->category,
                    'purpose' => $exp->purpose,
                    'description' => $exp->description ?? '',
                    'amount' => (float) $exp->amount,
                    'proof' => $exp->proof ? json_decode($exp->proof, true) : null,
                    'createdAt' => $exp->created_at?->toISOString() ?? now()->toISOString(),
                ]),
                'loans' => Loan::latest('borrow_date')->get()->map(fn ($l) => [
                    'id' => $l->id,
                    'borrowerName' => $l->borrower_name,
                    'phone' => $l->phone,
                    'itemId' => $l->item_id ?? '',
                    'itemName' => $l->item_name,
                    'quantity' => (int) $l->quantity,
                    'borrowDate' => $l->borrow_date instanceof \DateTimeInterface ? $l->borrow_date->format('Y-m-d') : (string) $l->borrow_date,
                    'returnDate' => $l->return_date instanceof \DateTimeInterface ? $l->return_date->format('Y-m-d') : (string) $l->return_date,
                    'actualReturnDate' => $l->actual_return_date instanceof \DateTimeInterface ? $l->actual_return_date->format('Y-m-d') : ($l->actual_return_date ? (string) $l->actual_return_date : null),
                    'purpose' => $l->purpose ?? '',
                    'notes' => $l->notes ?? '',
                    'status' => $l->status,
                    'createdAt' => $l->created_at?->toISOString() ?? now()->toISOString(),
                ]),
                'savingsLoans' => SavingsLoan::latest('loan_date')->get()->map(fn ($sl) => [
                    'id' => $sl->id,
                    'borrowerName' => $sl->borrower_name,
                    'phone' => $sl->phone,
                    'address' => $sl->address ?? '',
                    'loanDate' => $sl->loan_date instanceof \DateTimeInterface ? $sl->loan_date->format('Y-m-d') : (string) $sl->loan_date,
                    'dueDate' => $sl->due_date instanceof \DateTimeInterface ? $sl->due_date->format('Y-m-d') : (string) $sl->due_date,
                    'loanAmount' => (float) $sl->loan_amount,
                    'installmentAmount' => (float) $sl->installment_amount,
                    'totalPaid' => (float) $sl->total_paid,
                    'purpose' => $sl->purpose ?? '',
                    'notes' => $sl->notes ?? '',
                    'status' => $sl->status,
                    'createdAt' => $sl->created_at?->toISOString() ?? now()->toISOString(),
                ]),
                'savingsLoanPayments' => SavingsLoanPayment::latest('payment_date')->get()->map(fn ($p) => [
                    'id' => $p->id,
                    'savingsLoanId' => $p->savings_loan_id,
                    'paymentDate' => $p->payment_date instanceof \DateTimeInterface ? $p->payment_date->format('Y-m-d') : (string) $p->payment_date,
                    'amount' => (float) $p->amount,
                    'notes' => $p->notes ?? '',
                    'createdAt' => $p->created_at?->toISOString() ?? now()->toISOString(),
                ]),
                'notifications' => Notification::latest('time')->get()->map(fn ($n) => [
                    'id' => $n->id,
                    'title' => $n->title,
                    'body' => $n->body,
                    'time' => $n->time?->toISOString() ?? now()->toISOString(),
                    'read' => (bool) $n->read,
                    'href' => $n->href,
                ]),
                'users' => User::all()->map(fn ($u) => [
                    'id' => (string) $u->id,
                    'username' => $u->username ?? 'admin',
                    'password' => '',
                    'name' => $u->name,
                    'email' => $u->email,
                ]),
            ],
        ];
    }
}
