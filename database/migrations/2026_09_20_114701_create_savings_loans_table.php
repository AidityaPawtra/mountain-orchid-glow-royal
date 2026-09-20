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
        Schema::create('savings_loans', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('borrower_name');
            $table->string('phone');
            $table->text('address')->nullable();
            $table->date('loan_date');
            $table->date('due_date');
            $table->decimal('loan_amount', 15, 2)->default(0);
            $table->decimal('installment_amount', 15, 2)->default(0);
            $table->decimal('total_paid', 15, 2)->default(0);
            $table->text('purpose')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings_loans');
    }
};
