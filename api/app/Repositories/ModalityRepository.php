<?php

namespace App\Repositories;

use App\Models\Modality;
use App\Interfaces\ModalityInterface;
use App\Repositories\BaseRepository;

class ModalityRepository extends BaseRepository implements ModalityInterface
{

  public function __construct(Modality $model)
    {
        parent::__construct($model);
    }

    public function getModalities(string $code): ?Modality
    {
        return $this->model->where('code', $code)->first();
    }

}
