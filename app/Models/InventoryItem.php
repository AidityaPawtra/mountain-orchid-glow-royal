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
    'quantity',
    'borrowed',
    'condition',
])]
class InventoryItem extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    public $incrementing = false;

    /**
     * Get loans associated with this inventory item.
     */
    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class, 'item_id');
    }
}
