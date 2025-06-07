<?php

namespace App\Http\Controllers;

use App\Services\BankService;
use App\Services\Util;
use App\Services\RequestValidate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BankController extends Controller
{
    protected $bankService;
    protected $util;
    protected $requestValidate;

    public function __construct(BankService $bankService, Util $util, RequestValidate $requestValidate)
    {
        $this->bankService = $bankService;
        $this->util = $util;
        $this->requestValidate = $requestValidate;
    }

    /**
     * Retorna as ofertas de crédito disponíveis para um CPF
     */
    public function getAvailableBanks(Request $request): JsonResponse
    {
        try {
            $cpf = $this->util->apenasNumeros($request->input('cpf'));
            $valor = $this->util->apenasNumeros($request->input('valor'));

            $this->requestValidate(['cpf' => $cpf]);

            return response()->json([
                'success' => true,
                'message' => 'Ofertas disponíveis recuperadas com sucesso',
                'data' => $this->bankService->getBanksOffers($cpf, ($valor ? (float)$valor : null))
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Erro de validação (CPF inválido)
            return response()->json([
                'success' => false,
                'message' => 'Dados inválidos fornecidos',
                'errors' => $e->errors()
            ], 422);

        } catch (\RuntimeException $e) {
            $statusCode = $e->getCode() ?: 400;

            if ($statusCode >= 400 && $statusCode < 500) {
                $httpCode = $statusCode;
            } else {
                $httpCode = 400;
            }

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error_code' => 'bank_api_error',
                'details' => $e->getPrevious() ? $e->getPrevious()->getMessage() : null
            ], $httpCode);

        } catch (\Exception $e) {
            // Erro inesperado
            return response()->json([
                'success' => false,
                'message' => 'Ocorreu um erro inesperado ao processar sua solicitação',
                'error' => config('app.debug') ? $e->getMessage() : null,
                'error_code' => 'internal_server_error'
            ], 500);
        }
    }

    /**
     * Valida o CPF fornecido na requisição
     *
     * @param Request $request
     * @return void
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function requestValidate($cpf): void
    {

        $this->requestValidate->validate(
            $cpf,
            [
                'cpf' => 'required|string|size:11|regex:/^[0-9]+$/',
            ],
            [
                'cpf.required' => 'CPF é obrigatório.',
                'cpf.size' => 'CPF deve ter exatamente 11 caracteres numéricos.',
                'cpf.regex' => 'CPF deve conter apenas números.',
        ]);
    }

}
