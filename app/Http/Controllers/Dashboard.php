<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Http\Resources\ExampleTranslateResource;
use App\Http\Resources\FavoriteResource;
use App\Http\Resources\WordResource;
use App\Http\Resources\WordStatisticResource;
use App\Models\Book;
use App\Models\ExampleTranslation;
use App\Models\Favorite;
use App\Models\Unit;
use App\Models\UnitComplete;
use App\Models\User;
use App\Models\UserWordStatistic;
use App\Models\Word;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Traits\Tappable;

class Dashboard extends Controller
{
    function index()
    {
        $unitCompleted = auth()->user()->unitCompleted;

        ["book_id" => $book_id, "unit_id" => $unit_id] = $unitCompleted;

        $bookUnit = [
                'book_id' => $book_id ?? Book::first()->id,
                'unit_id' => $unit_id ?? Unit::first()->id,
        ];

        $wordsData = Word::where($bookUnit)->get();

        $books = BookResource::collection(Book::all())->resolve();
        $words = WordResource::collection($wordsData)->resolve();

        $favorites = auth()->user()->favorites->pluck('word_id')->toArray();

        $language = 'ru';

        return inertia('Dashboard', compact('books', 'words', 'language', 'favorites', 'bookUnit'));
    }

    public function addToFavorite(Request $request)
    {
        $data = $request->validate([
                'word_id' => 'required|integer|exists:words,id',
                'book_id' => 'required|integer|exists:books,id',
                'unit_id' => 'required|integer|exists:units,id',
        ]);

        $favoriteWord = auth()->user()->favorites()->where('word_id', $data['word_id']);
        $isFavorite   = $favoriteWord->exists();


        if ($isFavorite) {
            $favoriteWord->delete();
        } else {
            Favorite::create([
                    ...$data,
                    'user_id' => auth()->id(),
            ]);
        }


        return auth()->user()->favorites->pluck('word_id')->toArray();
    }

    public function getUnitWords($book_id, $unit_id)
    {
        $words = Word::where([
                'unit_id' => $unit_id,
                'book_id' => $book_id,
        ])->get();

        return WordResource::collection($words)->resolve();
    }

    public function storeExampleTranslate(Request $request)
    {
        ['word_id' => $word_id, 'translate' => $translate] = $request->validate([
                'word_id'   => 'required|int|exists:words,id',
                'translate' => 'required|string',
        ]);

        auth()->user()->translateExamples()->attach($word_id, ['translate' => $translate]);
    }

    public function getExampleTranslates($book_id, $unit_id)
    {
        $translateExamples = auth()->user()->translateExamples()
                ->where('unit_id', $unit_id)
                ->where('book_id', $book_id)
                ->get();

        return ExampleTranslateResource::collection($translateExamples)->resolve();
    }

    public function storeWordStatistic(Request $request)
    {
        $data = $request->validate([
                'id'              => 'integer|nullable',
                'word_id'         => 'required|integer|exists:words,id',
                'answer_cnt'      => 'required|integer',
                'correct_percent' => 'required|numeric',
        ]);

        if (is_null($data['id'])) {
            unset($data['id']);
            $data['user_id'] = auth()->id();

            $statistic = UserWordStatistic::create($data);
        } else {
            $statWord = UserWordStatistic::where('id', $data['id']);
            $statistic = tap($statWord)->update([
                    'answer_cnt'      => $data['answer_cnt'],
                    'correct_percent' => $data['correct_percent'],
            ])->get();
        }

        return (new WordStatisticResource($statistic->first()))->resolve();
    }
}
