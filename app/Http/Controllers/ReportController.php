<?php

namespace App\Http\Controllers;

use App\Models\BumdesType;
use App\Models\Expense;
use App\Models\Income;
use App\Models\InventoryItem;
use App\Models\Loan;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Display the financial and inventory reports page.
     */
    public function index(): Response
    {
        return Inertia::render('Laporan', [
            'income' => Income::with('bumdesType')->latest('date')->get(),
            'expenses' => Expense::with('bumdesType')->latest('date')->get(),
            'loans' => Loan::with('item')->latest('borrow_date')->get(),
            'items' => InventoryItem::all(),
            'bumdesTypes' => BumdesType::where('status', 'active')->get(),
        ]);
    }
}
