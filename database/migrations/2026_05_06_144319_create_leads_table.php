<?php

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
        Schema::create('leads', function (Blueprint $table) {
           $table->id();
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
        $table->string('name');
        $table->string('contact');
        $table->text('address');
        $table->text('needs');
        $table->enum('status', ['new', 'contacted', 'negotiation', 'converted', 'lost'])->default('new');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
