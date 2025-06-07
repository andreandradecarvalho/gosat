<?php

namespace App\Services;

use Illuminate\Support\Facades\Validator;

class RequestValidate
{
    function validate($input, $rules, $messages): void {
        $validator = Validator::make($input, $rules, $messages);
        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }
}

