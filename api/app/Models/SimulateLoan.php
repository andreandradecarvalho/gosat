<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SimulateLoan extends Model
{
    protected $table = 'simulate_loans';
    protected $fillable = [
        'amount',
        'term_months',
        'interest_rate',
        'monthly_payment',
        'status',
    ];
}
