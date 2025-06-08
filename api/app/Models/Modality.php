<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Modality extends Model
{
    protected $fillable = ['name', 'code'];

    /**
     * As instituições que oferecem esta modalidade
     */
    public function institutions(): BelongsToMany
    {
        return $this->belongsToMany(Institution::class, 'institution_modality');
    }

    /**
     * As ofertas de crédito para esta modalidade
     */
    public function creditOffers()
    {
        return $this->hasMany(CreditOffer::class);
    }
}
