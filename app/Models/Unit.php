<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function words()
    {
        return $this->hasMany(Word::class);
    }

    public function story()
    {
        return $this->hasOne(UnitStory::class);
    }
}
