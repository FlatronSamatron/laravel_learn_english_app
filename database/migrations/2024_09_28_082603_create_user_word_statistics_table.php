<?php

use App\Models\{Word, User};
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
        Schema::create('user_word_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Word::class)->index()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class)->index()->constrained()->cascadeOnDelete();
            $table->integer('answer_cnt')->nullable()->default(null);
            $table->integer('correct_percent')->nullable()->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_word_statistics');
    }
};
