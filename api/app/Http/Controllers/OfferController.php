<?php

namespace App\Http\Controllers;

use App\Services\OfferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\Util;
use App\Services\RequestValidate;

class OfferController extends Controller
{
    protected $offerService;
    protected $util;
    protected $requestValidate;

    public function __construct(OfferService $offerService, Util $util, RequestValidate $requestValidate)
    {
        $this->offerService = $offerService;
        $this->util = $util;
        $this->requestValidate = $requestValidate;
    }

    /**
     * Realiza uma simulação de oferta de crédito para um CPF, instituição e modalidade específicos
     */
    public function getOffer(Request $request): JsonResponse
    {
        try {
            $cpf = $this->util->apenasNumeros($request->input('cpf'));
            $instituicaoId = $this->util->apenasNumeros($request->input('instituicao_id'));
            $codModalidade = $request->input('codModalidade');
            $valor = $this->util->convertToFloat($request->input('valorSolicitado'));

            // Valida os dados da requisição
            $this->requestValidate([
                'cpf' => $cpf,
                'instituicao_id' => $instituicaoId,
                'codModalidade' => $codModalidade
            ]);

            $simulation = $this->offerService->getOffer($cpf, $instituicaoId, $codModalidade,($valor ? $valor : 0.00));

            return response()->json([
                'success' => true,
                'message' => 'Simulação realizada com sucesso',
                'data' => [
                    'cpf' => $cpf,
                    'instituicao_id' => $instituicaoId,
                    'codModalidade' => $codModalidade,
                    'simulation' => $simulation
                ]
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
     * Valida os dados de simulação fornecidos na requisição
     *
     * @param Request $request
     * @return void
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function requestValidate(array $data): void
    {
        $this->requestValidate->validate(
            $data,
            [
                'cpf' => 'required|string|size:11',
                'instituicao_id' => 'required|integer|min:1',
                'codModalidade' => 'required|string|min:1',
            ],
            [
            'cpf.required' => 'CPF é obrigatório.',
            'cpf.size' => 'CPF deve ter exatamente 11 caracteres numéricos.',
            'instituicao_id.required' => 'Instituição é obrigatória.',
            'instituicao_id.integer' => 'Instituição deve ser um número inteiro.',
            'instituicao_id.min' => 'Instituição deve ser maior ou igual a 1.',
            'codModalidade.required' => 'Modalidade é obrigatória.',
            'codModalidade.string' => 'Modalidade deve ser uma string.',
            'codModalidade.min' => 'Modalidade deve ter pelo menos 1 caractere.',
        ]);
    }
}
