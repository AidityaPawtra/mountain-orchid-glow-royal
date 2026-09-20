<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'id',
    'borrower_name',
    'phone',
    'address',
    'loan_date',
    'due_date',
    'loan_amount',
    'installment_amount',
    'total_paid',
    'purpose',
    'notes',
    'status',
])]
class SavingsLoan extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    public $incrementing = false;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'loan_date' => 'date',
            'due_date' => 'date',
            'loan_amount' => 'decimal:2',
            'installment_amount' => 'decimal:2',
            'total_paid' => 'decimal:2',
        ];
    }

    /**
     * Get the payments associated with this savings loan.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(SavingsLoanPayment::class, 'savings_loan_id');
    }
}
