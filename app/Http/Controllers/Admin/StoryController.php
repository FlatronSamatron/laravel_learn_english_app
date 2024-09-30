<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Http\Resources\UnitStoryResource;
use App\Models\Book;
use App\Models\Unit;
use App\Models\UnitStory;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    public function index()
    {
        $books = BookResource::collection(Book::all())->resolve();

        return inertia('Admin/Story', compact('books'));
    }

    public function addStory(Request $request)
    {
        $data = $request->validate([
                'text' => 'required|string',
                'unit_id' => 'required|integer'
        ]);

        $unit = Unit::find($data['unit_id']);

        if($unit->story()->exists()){
            return response()->json([
                    'error' => 'The story has already been added to this unit'
            ], 400);
        } else {
            UnitStory::create($data);

            return response()->json([
                    'message' => 'The story added to unit'
            ]);
        }
    }

    public function storiesList()
    {
        $books = BookResource::collection(Book::all())->resolve();

        return inertia('Admin/StoriesList', compact('books'));
    }

    public function getStory(Unit $unit)
    {
        return (new UnitStoryResource($unit->story))->resolve();
    }

    public function updateStory(UnitStory $story, Request $request)
    {
        $data = $request->validate([
           'text' => 'required|string'
        ]);

        $story->update($data);

        return response()->json([
                'message' => 'The story updated'
        ]);
    }
}
