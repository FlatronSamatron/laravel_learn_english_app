<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Word extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $with = ['translations', 'definitionTranslations', 'exampleTranslations', 'userWordStatistics'];

    public function translations(): HasMany
    {
        return $this->hasMany(WordTranslation::class);
    }

    public function definitionTranslations(): HasMany
    {
        return $this->hasMany(DefinitionTranslation::class);
    }

    public function exampleTranslations(): HasMany
    {
        return $this->hasMany(ExampleTranslation::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function userWordStatistics()
    {
        return $this->hasMany(UserWordStatistic::class)->where('user_id', auth()->id());
    }
}
