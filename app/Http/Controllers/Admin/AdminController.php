<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\WordsStoreRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\Unit;
use App\Models\Word;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class AdminController extends Controller
{
    public function index()
    {
        return inertia('Admin/Dashboard');
    }
}
