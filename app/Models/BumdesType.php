<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'id',
    'name',
    'category',
    'description',
    'status',
])]
class BumdesType extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    public $incrementing = false;

    /**
     * Get all incomes associated with this BUMDes unit.
     */
    public function incomes(): HasMany
    {
        return $this->hasMany(Income::class, 'bumdes_type_id');
    }

    /**
     * Get all expenses associated with this BUMDes unit.
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'bumdes_type_id');
    }
}
