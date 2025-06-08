<?php

namespace App\Repositories;

use App\Interfaces\BaseInterface;

class BaseRepository implements BaseInterface
{
  protected $model;

  public function __construct(object $model)
    {
        $this->model = $model;
    }

  public function firstOrCreate(array $attributes, array $values): object
  {
    return $this->model::firstOrCreate($attributes, $values);
  }

  public function updateOrCreate(array $attributes, array $values): object
  {
    return $this->model::updateOrCreate($attributes, $values);
  }
}
