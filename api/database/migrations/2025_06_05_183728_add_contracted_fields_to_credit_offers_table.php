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
            $table->boolean('contracted')->default(false);
            $table->timestamp('date_contracted')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('credit_offers', function (Blueprint $table) {
            $table->dropColumn(['contracted', 'date_contracted']);
        });
    }
};
