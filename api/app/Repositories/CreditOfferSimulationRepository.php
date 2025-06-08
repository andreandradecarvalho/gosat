<?php

namespace App\Repositories;

use App\Models\CreditOfferSimulation;
use App\Interfaces\CreditOfferSimulationInterface;
use App\Repositories\BaseRepository;
use Carbon\Carbon;

class CreditOfferSimulationRepository extends BaseRepository implements CreditOfferSimulationInterface
{
    public function __construct(CreditOfferSimulation $model)
    {
        parent::__construct($model);
    }

}