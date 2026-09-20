<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'id',
    'savings_loan_id',
    'payment_date',
    'amount',
    'notes',
])]
class SavingsLoanPayment extends Model
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
            'payment_date' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    /**
     * Get the savings loan that this payment belongs to.
     */
    public function savingsLoan(): BelongsTo
    {
        return $this->belongsTo(SavingsLoan::class, 'savings_loan_id');
    }
}
