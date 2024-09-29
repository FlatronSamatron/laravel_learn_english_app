<?php

use App\Models\{Unit, Book};
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('words', function (Blueprint $table) {
            $table->id();
            $table->string('word_hash')->unique();
            $table->string('name');
            $table->string('transcription');
            $table->string('definition');
            $table->string('example');
            $table->foreignIdFor(Unit::class)->index()->constrained();
            $table->foreignIdFor(Book::class)->index()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('words');
    }
};
