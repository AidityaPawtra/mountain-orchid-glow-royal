<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'bumdes_name',
    'village_name',
    'address',
    'phone',
    'email',
    'admin_name',
    'admin_username',
    'admin_email',
])]
class Setting extends Model
{
    use HasFactory;
}
