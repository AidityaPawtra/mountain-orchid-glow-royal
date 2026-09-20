<?php

namespace App\Http\Controllers;

use App\Models\BumdesType;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Loan;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard page with summarized data.
     */
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'income' => Income::latest('date')->get(),
            'expenses' => Expense::latest('date')->get(),
            'loans' => Loan::latest('borrow_date')->get(),
            'bumdesTypes' => BumdesType::where('status', 'active')->get(),
        ]);
    }
}
