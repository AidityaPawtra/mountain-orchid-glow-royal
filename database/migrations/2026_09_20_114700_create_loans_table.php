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
        Schema::create('loans', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('borrower_name');
            $table->string('phone');
            $table->string('item_id')->nullable();
            $table->string('item_name');
            $table->integer('quantity')->default(1);
            $table->date('borrow_date');
            $table->date('return_date');
            $table->date('actual_return_date')->nullable();
            $table->text('purpose')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('borrowed');
            $table->timestamps();

            $table->foreign('item_id')->references('id')->on('inventory_items')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
