<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditOffer extends Model
{
    protected $fillable = [
        'cpf',
        'institution_id',
        'modality_id',
        'modality_code',
        'MinInstallments',
        'MaxInstallments',
        'MinValue',
        'MaxValue',
        'MonthlyInterest',
        'contracted',
        'date_contracted',
    ];

    protected $casts = [
        'MinInstallments' => 'integer',
        'MaxInstallments' => 'integer',
        'MinValue' => 'integer',
        'MaxValue' => 'integer',
        'MonthlyInterest' => 'decimal:2',
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
