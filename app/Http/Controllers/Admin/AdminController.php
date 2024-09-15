<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\Unit;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return inertia('Admin/Dashboard');
    }

    public function book()
    {
        $books = BookResource::collection(Book::all())->resolve();

        return inertia('Admin/Book', compact('books'));
    }

    public function bookStore(Request $request)
    {
        $data = $request->validate([
                'book_number'       => 'required|integer',
                'description' => 'required|string',
        ]);

        $book = Book::query()->create($data);

        return BookResource::make($book)->resolve();
    }


    public function unit()
    {
        $books = BookResource::collection(Book::all())->resolve();

        return inertia('Admin/Unit', compact('books'));
    }

    public function unitStore(Request $request)
    {
        $data  = $request->validate([
                'unit_number' => 'required|integer',
                'book_id' => 'required|exists:books,id',
        ]);

        if(Unit::where([
                ['book_id', $data['book_id']],
                ['unit_number', $data['unit_number']]
        ])->exists()){
            return response()->json([
                    'error' => 'The unit already exists for this book.'
            ], 400);
        }

        Unit::query()->create($data);
    }

    public function words()
    {
        return inertia('Admin/Words');
    }
}
