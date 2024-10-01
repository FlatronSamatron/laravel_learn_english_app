<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\WordsStoreRequest;
use App\Http\Resources\BookResource;
use App\Http\Resources\TranslateResource;
use App\Http\Resources\WordResource;
use App\Models\Book;
use App\Models\Word;
use App\Models\WordTranslation;
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

    public function updateWordTranslate(WordTranslation $translate, Request $request)
    {
        $data = $request->validate([
                'ru' => 'string|nullable',
                'ua' => 'string|nullable'
        ]);

        $translate->update($data);
    }

    public function deleteWordTranslate(WordTranslation $translate)
    {
        $translate->delete();
    }

    public function createWordTranslate(Word $word, Request $request)
    {
        $data = $request->validate([
                'ru' => 'string|nullable',
                'ua' => 'string|nullable'
        ]);

        $data = [
                'ru' => $data['ru'] ?? "",
                'ua' => $data['ua'] ?? ""
        ];

        $translate = $word->translations()->create($data);

        return (new TranslateResource($translate))->resolve();
    }
}
