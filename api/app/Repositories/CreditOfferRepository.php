<?php

namespace App\Repositories;

use App\Models\CreditOffer;
use App\Interfaces\CreditOfferInterface;
use App\Repositories\BaseRepository;
use App\Services\Util;
use Carbon\Carbon;

class CreditOfferRepository extends BaseRepository implements CreditOfferInterface
{
    protected $util;
    public function __construct(CreditOffer $model, Util $util)
    {
        parent::__construct($model);
        $this->util = $util;
    }

    public function getAll()
    {
        return $this->model->get();
    }
    public function getByInstitutionAndModalityCode($institutionId, $modalityCode)
    {

        return $this->model
            ->where('institution_id', $institutionId)
            ->where('modality_code', $modalityCode)
            ->get()
            ->map(function ($offer) {
                return [
                    'QntParcelaMin' => $offer->MinInstallments,
                    'QntParcelaMax' => $offer->MaxInstallments,

                    'valorMin' => $offer->MinValue,
                    'valorMax' => $offer->MaxValue,
                    'jurosMes' => $this->util->cleanCurrencyToFloat($offer->MonthlyInterest)
                ];
            })[0];
    }
}

/**2 array:5 [
  "QntParcelaMin" => 12
  "QntParcelaMax" => 48
  "valorMin" => 5000
  "valorMax" => 8000
  "jurosMes" => 0.0495
] */
