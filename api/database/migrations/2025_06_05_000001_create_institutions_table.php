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
        // Tabela de instituições
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('simulation')->default(false);
            $table->timestamps();
        });

        // Tabela de modalidades
        Schema::create('modalities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code');
            $table->boolean('simulation')->default(false);
            $table->timestamps();
        });

        // Tabela pivô para relacionamento muitos-para-muitos entre instituições e modalidades
        Schema::create('institution_modality', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('modality_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // Tabela para armazenar as ofertas de crédito
        Schema::create('credit_offers', function (Blueprint $table) {
            $table->id();
            $table->string('cpf', 11)->nullable();
            $table->foreignId('institution_id')->constrained();
            $table->foreignId('modality_id')->constrained();
            $table->string('modality_code', 100)->nullable();
            $table->integer('MinInstallments')->nullable();
            $table->integer('MaxInstallments')->nullable();
            $table->integer('MinValue')->nullable();
            $table->integer('MaxValue')->nullable();
            $table->decimal('MonthlyInterest', 10, 4)->nullable();
            $table->boolean('simulation')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_offers');
        Schema::dropIfExists('institution_modality');
        Schema::dropIfExists('modalities');
        Schema::dropIfExists('institutions');
    }
};
