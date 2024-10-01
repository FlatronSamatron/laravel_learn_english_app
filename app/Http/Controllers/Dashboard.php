<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Http\Resources\ExampleTranslateResource;
use App\Http\Resources\UnitStoryResource;
use App\Http\Resources\WordResource;
use App\Http\Resources\WordStatisticResource;
use App\Models\Book;
use App\Models\Unit;
use App\Models\UserWordStatistic;
use App\Models\Word;
use Illuminate\Http\Request;

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

        $favoritesIds = auth()->user()->favorites->pluck('word_id')->toArray();

        $language = 'ru';

        return inertia('Dashboard', compact('books', 'words', 'language', 'favoritesIds', 'bookUnit'));
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

    public function getUnitStory(Unit $unit)
    {
        return (new UnitStoryResource($unit->story))->resolve();
    }
}
