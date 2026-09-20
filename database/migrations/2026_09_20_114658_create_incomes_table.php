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
        Schema::create('incomes', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('bumdes_type_id')->nullable();
            $table->date('date');
            $table->string('source');
            $table->string('category');
            $table->text('description')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->text('proof')->nullable();
            $table->timestamps();

            $table->foreign('bumdes_type_id')->references('id')->on('bumdes_types')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incomes');
    }
};
