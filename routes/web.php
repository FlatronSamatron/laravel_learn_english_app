<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\BookController;
use App\Http\Controllers\Admin\StoryController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\WordController;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [Dashboard::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['admin', 'auth'])->group(function (){
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/admin/book', [BookController::class, 'book'])->name('admin.book');
    Route::post('/admin/book/store', [BookController::class, 'bookStore'])->name('admin.book.store');
    Route::get('/admin/unit', [UnitController::class, 'unit'])->name('admin.unit');
    Route::post('/admin/unit/store', [UnitController::class, 'unitStore'])->name('admin.unit.store');
    Route::get('/admin/words', [WordController::class, 'words'])->name('admin.words');
    Route::post('/admin/words/store', [WordController::class, 'wordsStore'])->name('admin.words.store');
    Route::get('/admin/words/list', [WordController::class, 'wordsList'])->name('admin.words.list');
    Route::post('/admin/words/list', [WordController::class, 'getWordsList'])->name('admin.words.list.get');
    Route::get('/admin/stories', [StoryController::class, 'index'])->name('admin.stories');
    Route::post('/admin/stories', [StoryController::class, 'addStory'])->name('admin.stories.store');
    Route::get('/admin/stories/list', [StoryController::class, 'storiesList'])->name('admin.stories.list');
    Route::get('/admin/stories/{unit}', [StoryController::class, 'getStory'])->name('admin.stories.get');
    Route::post('/admin/stories/{story}', [StoryController::class, 'updateStory'])->name('admin.stories.update');
});

Route::middleware(['auth'])->group(function (){
    Route::post('/words/favorite', [Dashboard::class, 'addToFavorite'])->name('word.favorite');
    Route::get('/words/{book_id}/{unit_id}', [Dashboard::class, 'getUnitWords'])->name('words.unit.list');
    Route::post('/words/example', [Dashboard::class, 'storeExampleTranslate'])->name('words.example');
    Route::get('/words/example/{book_id}/{unit_id}', [Dashboard::class, 'getExampleTranslates'])->name('words.example.translates');
    Route::post('/words/statistic', [Dashboard::class, 'storeWordStatistic'])->name('words.statistic.store');
    Route::get('/unit/{unit}/story', [Dashboard::class, 'getUnitStory'])->name('units.story');
});

require __DIR__.'/auth.php';
