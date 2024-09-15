<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $withCount = ['units'];

    protected $guarded = [];

    public function units()
    {
        return $this->hasMany(Unit::class);
    }
}
