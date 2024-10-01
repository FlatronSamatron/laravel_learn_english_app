<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\FavoriteResource;
use App\Http\Resources\WordResource;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteWordsController extends Controller
{
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

    public function getFavoriteWords(Request $request)
    {
//        $per_page = 20;
//        $page = $request->query('page');
//        $favorites = Favorite::where('user_id', auth()->id())->with('word')->paginate($per_page, ['*'], 'page', $page);
//        $favoriteWords = $favorites->pluck('word');
//
//        return [
//                'words' => WordResource::collection($favoriteWords),
//                'pagination' => [
//                        'current' => $favorites->currentPage(),
//                        'pageSize' => $favorites->perPage(),
//                        'total' => $favorites->total(),
//                ]
//        ];

        $favorites = Favorite::where('user_id', auth()->id())->with('word')->get()->pluck('word');

        return WordResource::collection($favorites)->resolve();
    }
}
