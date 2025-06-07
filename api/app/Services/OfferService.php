<?php

namespace App\Services;

use App\Models\CreditOffer;
use App\Repositories\CreditOfferRepository;
use App\Repositories\CreditOfferSimulationRepository;
use App\Repositories\ModalityRepository;
use App\Services\Util;
use Illuminate\Support\Facades\Log;

class OfferService
{
    protected $apiUrl;
    protected $apiRequest;
    protected $creditOfferSimulationRepository;
    protected $creditOfferRepository;
    protected $modalityRepository;
    protected $util;
    protected $cpfsTest;


    public function __construct(
        ApiRequest $apiRequest,
        CreditOfferSimulationRepository $creditOfferSimulationRepository,
        CreditOfferRepository $creditOfferRepository,
        ModalityRepository $modalityRepository,
        Util $util
    ) {
        $this->apiRequest = $apiRequest;
        $this->creditOfferSimulationRepository = $creditOfferSimulationRepository;
        $this->creditOfferRepository = $creditOfferRepository;
        $this->modalityRepository = $modalityRepository;
        $this->util = $util;
        $this->apiUrl = env('BANK_API_URL', 'https://dev.gosat.org/api/v1/');
        $this->cpfsTest = ['11111111111', '22222222222', '12312312312'];
    }

    /**
     * Obtém e salva uma simulação de oferta de crédito
     *
     * @param string $cpf
     * @param int $institutionId
     * @param string $modalityCode
     * @return array
     */
    public function getOffer(string $cpf, int $institutionId, string $modalityCode, float $valorSolicitado = null): array
    {


        if (in_array($cpf, $this->cpfsTest)) {
            $apiResponse = $this->fetch($cpf, $institutionId, $modalityCode);
        } else {
            $apiResponse = $this->creditOfferRepository->getByInstitutionAndModalityCode($institutionId, $modalityCode);
        }

        $apiResponse = $this->util->calculatePayment($valorSolicitado, $apiResponse);

        // Salva a simulação no banco de dados
        $this->saveOffer($cpf, $institutionId, $modalityCode, $apiResponse);

        return $apiResponse;
    }

    /**
     * Busca a simulação na API externa
     *
     * @param string $cpf
     * @param int $institutionId
     * @param string $modalityCode
     * @return array
     */
    protected function fetch(string $cpf, int $institutionId, string $modalityCode): array
    {
        $response = $this->apiRequest->send($this->apiUrl . 'simulacao/oferta', [
            'cpf' => $cpf,
            'instituicao_id' => $institutionId,
            'codModalidade' => $modalityCode
        ]);
        return $response;
    }

    /**
     * Salva os dados da simulação no banco de dados
     *
     * @param string $cpf
     * @param int $institutionId
     * @param string $modalityCode
     * @param array $simulationData
     * @return void
     */
    protected function saveOffer(string $cpf, int $institutionId, string $modalityCode, array $simulationData): void
    {
        $modality = $this->modalityRepository->getModalities($modalityCode);
        try {
            $this->creditOfferSimulationRepository->firstOrCreate(
                [
                    'cpf' => $cpf,
                    'institution_id' => $institutionId,
                    'modality_code' => $modalityCode,

                    'minInstallments' => $simulationData['QntParcelaMin'],
                    'maxInstallments' => $simulationData['QntParcelaMax'],
                    'minValue' => $simulationData['valorMin'],
                    'maxValue' => $simulationData['valorMax'],
                    'monthlyInterest' => $simulationData['jurosMes'],
                    'requestedValueUnformatted' => $this->util->cleanCurrencyToFloat($simulationData['valorSolicitadoSemFormato']),
                    'installments' => $simulationData['parcelas'],
                    'total_value' => $this->util->cleanCurrencyToFloat($simulationData['valorTotal']),
                    'installment_value' => $this->util->cleanCurrencyToFloat($simulationData['valorParcela']),
                ],
                [
                    'contracted' => '',
                    'date_contracted' => '',
                ]
            );
        } catch (\Exception $e) {
            // Log do erro, mas não interrompe o fluxo
            \Log::error('Erro ao salvar simulação de crédito: ' . $e->getMessage());
        }
    }
}
