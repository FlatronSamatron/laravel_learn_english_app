<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function book()
    {
        $books = BookResource::collection(Book::all())->resolve();

        return inertia('Admin/Book', compact('books'));
    }

    public function bookStore(Request $request)
    {
        $data = $request->validate([
                'book_number' => 'required|integer',
                'description' => 'required|string',
        ]);

        $book = Book::query()->create($data);

        return BookResource::make($book)->resolve();
    }
}
