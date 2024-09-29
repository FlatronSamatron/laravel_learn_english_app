<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\WordsStoreRequest;
use App\Http\Resources\BookResource;
use App\Http\Resources\WordResource;
use App\Models\Book;
use App\Models\Word;
use Illuminate\Http\Request;

class WordController extends Controller
{
    public function words()
    {
        $books = BookResource::collection(Book::all())->resolve();

        return inertia('Admin/Words', compact('books'));
    }

    public function wordsStore(WordsStoreRequest $request)
    {
        $dataList = $request->validated();

        foreach ($dataList as $data) {
            ['ru' => $ru, 'ua' => $ua] = $data['translate'];
            unset($data['translate']);

            $word = Word::create($data);

            $translates = [];
            $translate_words = [];

            foreach ($ru as $key => $value) {
                $translates[$key] = [
                        "ru" => $value,
                        "ua" => $ua[$key] ?? "",
                        "word_id" => $word->id
                ];
            }

            foreach ($translates['name']['ru'] as $key => $value) {
                $translate_words[] = [
                        "ru" => $value,
                        "ua" => $translates['name']['ua'][$key] ?? "",
                        "word_id" => $word->id
                ];
            }

            $word->translations()->insert($translate_words);
            $word->definitionTranslations()->insert($translates['definition']);
            $word->exampleTranslations()->insert($translates['example']);
        }
    }

    public function wordsList()
    {
        $books = BookResource::collection(Book::all())->resolve();

        return inertia('Admin/WordsList', compact('books'));
    }

    public function getWordsList(Request $request)
    {
        $data = $request->validate([
                'book_id' => 'required|exists:books,id',
                'unit_id' => 'required|exists:units,id'
        ]);

        $words = Word::where([
                'book_id' => $data['book_id'],
                'unit_id' => $data['unit_id'],
        ])->get();

        return WordResource::collection($words)->resolve();
    }
}
