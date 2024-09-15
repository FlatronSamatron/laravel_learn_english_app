<?php

use App\Http\Controllers\Admin\AdminController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['admin', 'auth'])->group(function (){
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/admin/book', [AdminController::class, 'book'])->name('admin.book');
    Route::post('/admin/book/store', [AdminController::class, 'bookStore'])->name('admin.book.store');
    Route::get('/admin/unit', [AdminController::class, 'unit'])->name('admin.unit');
    Route::post('/admin/unit/store', [AdminController::class, 'unitStore'])->name('admin.unit.store');
    Route::get('/admin/words', [AdminController::class, 'words'])->name('admin.words');
});

require __DIR__.'/auth.php';
