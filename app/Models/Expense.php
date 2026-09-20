<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'id',
    'bumdes_type_id',
    'date',
    'category',
    'purpose',
    'description',
    'amount',
    'proof',
])]
class Expense extends Model
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
            'date' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    /**
     * Get the BUMDes unit that owns this expense.
     */
    public function bumdesType(): BelongsTo
    {
        return $this->belongsTo(BumdesType::class, 'bumdes_type_id');
    }
}
