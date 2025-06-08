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
        Schema::table('credit_offers', function (Blueprint $table) {
            $table->decimal('requested_value', 15, 2)->after('modality_code')->nullable();
            $table->integer('installments')->after('MaxValue')->nullable();
            $table->decimal('monthly_interest', 10, 6)->after('installments')->nullable();
            $table->decimal('total_value', 15, 2)->after('monthly_interest')->nullable();
            $table->decimal('installment_value', 15, 2)->after('total_value')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('credit_offers', function (Blueprint $table) {
            $table->dropColumn([
                'requested_value',
                'installments',
                'monthly_interest',
                'total_value',
                'installment_value'
            ]);
        });
    }
};
