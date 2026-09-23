<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Income;
use App\Models\InventoryItem;
use App\Models\Loan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Pencarian global untuk kolom cari di Topbar.
     * Mengembalikan maksimal 8 hasil: [{ id, label, to }].
     */
    public function index(Request $request): JsonResponse
    {
        // Karakter wildcard LIKE dibuang supaya pencarian tetap literal.
        $keyword = trim(str_replace(['%', '_'], '', (string) $request->query('q', '')));

        if (mb_strlen($keyword) < 2) {
            return response()->json([]);
        }

        $like = '%'.$keyword.'%';

        $incomes = Income::where(fn ($q) => $q->where('source', 'like', $like)->orWhere('category', 'like', $like))
            ->latest('date')->limit(2)->get()
            ->map(fn (Income $row) => [
                'id' => 'income-'.$row->id,
                'label' => 'Masuk · '.$row->source,
                'to' => '/uang-masuk',
            ]);

        $expenses = Expense::where(fn ($q) => $q->where('purpose', 'like', $like)->orWhere('category', 'like', $like))
            ->latest('date')->limit(2)->get()
            ->map(fn (Expense $row) => [
                'id' => 'expense-'.$row->id,
                'label' => 'Keluar · '.$row->purpose,
                'to' => '/uang-keluar',
            ]);

        $loans = Loan::where(fn ($q) => $q->where('borrower_name', 'like', $like)
            ->orWhere('item_name', 'like', $like)
            ->orWhere('purpose', 'like', $like))
            ->latest('borrow_date')->limit(3)->get()
            ->map(fn (Loan $row) => [
                'id' => 'loan-'.$row->id,
                'label' => 'Pinjam · '.$row->borrower_name.' — '.$row->item_name,
                'to' => '/peminjaman/'.$row->id,
            ]);

        $items = InventoryItem::where('name', 'like', $like)
            ->limit(3)->get()
            ->map(fn (InventoryItem $row) => [
                'id' => 'item-'.$row->id,
                'label' => 'Barang · '.$row->name,
                'to' => '/barang',
            ]);

        return response()->json(
            $incomes->concat($expenses)->concat($loans)->concat($items)->take(8)->values()
        );
    }
}
