<?php

namespace App\Interfaces;

interface BaseInterface
{
    public function firstOrCreate(array $attributes, array $values): object;
    public function updateOrCreate(array $attributes, array $values): object;
}
