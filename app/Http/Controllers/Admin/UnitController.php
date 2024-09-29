<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function unit()
    {
        $books = BookResource::collection(Book::all())->resolve();

        return inertia('Admin/Unit', compact('books'));
    }

    public function unitStore(Request $request)
    {
        $data = $request->validate([
                'unit_number' => 'required|integer',
                'book_id'     => 'required|exists:books,id',
        ]);

        if (Unit::where([
                ['book_id', $data['book_id']],
                ['unit_number', $data['unit_number']],
        ])->exists()) {
            return response()->json([
                    'error' => 'The unit already exists for this book.',
            ], 400);
        }

        Unit::query()->create($data);
    }
}
