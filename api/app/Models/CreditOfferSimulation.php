<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditOfferSimulation extends Model
{
    protected $table = 'credit_offers_simulations';

    protected $fillable = [
        'cpf',
        'institution_id',
        'modality_code',
        'minInstallments',
        'maxInstallments',
        'minValue',
        'maxValue',
        'monthlyInterest',
        'requestedValueUnformatted',
        'installments',
        'total_value',
        'installment_value',
    ];

    protected $casts = [
        'contracted' => 'boolean',
        'date_contracted' => 'datetime',
    ];

    /**
     * A instituição que oferece este crédito
     */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * A modalidade deste crédito
     */
    public function modality(): BelongsTo
    {
        return $this->belongsTo(Modality::class);
    }
}