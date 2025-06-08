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
        Schema::create('credit_offers_simulations', function (Blueprint $table) {
            $table->id();
            $table->string('cpf', 11);
            $table->unsignedBigInteger('institution_id');
            $table->string('modality_code', 50);
            $table->integer('minInstallments');
            $table->integer('maxInstallments');
            $table->decimal('minValue', 15, 2);
            $table->decimal('maxValue', 15, 2);
            $table->decimal('monthlyInterest', 10, 6);
            $table->decimal('requestedValueUnformatted', 15, 2);
            $table->integer('installments');
            $table->decimal('total_value', 15, 2);
            $table->decimal('installment_value', 15, 2);
            $table->timestamps();

            // Indexes
            $table->index('cpf');
            $table->index('institution_id');
            $table->index('modality_code');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_offers_simulations');
    }
};
