<?php

namespace App\Services;

use App\Repositories\InstitutionRepository;
use Illuminate\Support\Facades\Http;

class ApiRequest
{
    protected $apiUrl;
    protected $apiKey;
    protected $institutionRepository;

    public function __construct(InstitutionRepository $institutionRepository)
    {
        $this->apiUrl = env('BANK_API_URL', 'https://dev.gosat.org/api/v1/');
        $this->institutionRepository = $institutionRepository;
    }

    /**
     * Busca ofertas de crédito no cache ou na API e salva no banco de dados
     *
     * @param string $url
     * @param array $data
     * @return array
     */
    public function send(string $url, array $data): array
    {
        try {
            // Faz a chamada à API externa
            $response = Http::withHeaders([
                'Accept' => 'application/json',
            ])->timeout(30)->post($url, $data);

            $statusCode = $response->status();

            // Verifica o código de status da resposta
            if ($response->successful()) {
                return $response->json();
            }

            $errorMessage = $this->errorMessage($statusCode);

            // Adiciona detalhes adicionais se disponíveis
            $responseData = $response->json();
            if (is_array($responseData) && isset($responseData['message'])) {
                $errorMessage .= ' Detalhes: ' . $responseData['message'];
            } else {
                $errorMessage .= ' Status: ' . $statusCode . ' - ' . $response->reason();
            }

            throw new \RuntimeException($errorMessage, $statusCode);
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            throw new \RuntimeException('Falha na conexão com a API de simulação: ' . $e->getMessage(), 0, $e);
        } catch (\Illuminate\Http\Client\RequestException $e) {
            throw new \RuntimeException('Erro na requisição para a API de simulação: ' . $e->getMessage(), 0, $e);
        } catch (\Exception $e) {
            // Se já for uma exceção específica, apenas propague
            if ($e instanceof \RuntimeException) {
                throw $e;
            }
            throw new \RuntimeException('Erro inesperado ao consultar a API de simulação: ' . $e->getMessage(), 0, $e);
        }
    }

    public function getSimulatedOffers($cpf, $valor = null) {
        return $this->institutionRepository->getInstitutionsWithModalities();
    }

    public function errorMessage($statusCode)
    {
        // Tratamento específico para códigos de erro comuns
        switch ($statusCode) {
            case 400:
                $errorMessage = 'Requisição inválida. Verifique os parâmetros fornecidos.';
                break;
            case 401:
            case 403:
                $errorMessage = 'Não autorizado. Verifique as credenciais de acesso à API.';
                break;
            case 404:
                $errorMessage = 'Recurso não encontrado na API de simulação.';
                break;
            case 422:
                $errorMessage = 'Dados inválidos fornecidos para a simulação.';
                break;
            case 429:
                $errorMessage = 'Muitas requisições. Por favor, tente novamente mais tarde.';
                break;
            case 500:
                $errorMessage = 'Erro interno no servidor da API de simulação.';
                break;
            case 503:
                $errorMessage = 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
                break;
            default:
                $errorMessage = 'Erro ao consultar a API de simulação.';
        }
    }
}