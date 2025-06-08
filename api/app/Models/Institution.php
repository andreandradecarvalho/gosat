<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Institution extends Model
{
    protected $fillable = ['name'];

    /**
     * As modalidades oferecidas por esta instituição
     */
    public function modalities(): BelongsToMany
    {
        return $this->belongsToMany(Modality::class, 'institution_modality');
    }

    /**
     * As ofertas de crédito desta instituição
     */
    public function creditOffers()
    {
        return $this->hasMany(CreditOffer::class);
    }
}
