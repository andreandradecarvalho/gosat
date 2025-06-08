<?php

namespace App\Services;

use App\Models\CreditOffer;
use App\Models\Institution;
use App\Models\Modality;
use App\Repositories\CreditOfferRepository;
use App\Repositories\InstitutionRepository;
use App\Repositories\ModalityRepository;
use App\Services\ApiRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class BankService
{
    protected $apiUrl;
    protected $apiKey;
    protected $institutionRepository;
    protected $modalityRepository;
    protected $creditOfferRepository;
    protected $apiRequest;
    protected $cpfsTest;

    public function __construct(
        InstitutionRepository $institutionRepository,
        ModalityRepository $modalityRepository,
        CreditOfferRepository $creditOfferRepository,
        ApiRequest $apiRequest
    ) {
        $this->institutionRepository = $institutionRepository;
        $this->modalityRepository = $modalityRepository;
        $this->creditOfferRepository = $creditOfferRepository;
        $this->apiRequest = $apiRequest;
        // Configurações da API (substitua pelos valores reais)
        $this->apiUrl = env('BANK_API_URL', 'https://dev.gosat.org/api/v1/');
        $this->cpfsTest = ['11111111111', '22222222222', '12312312312'];
    }

    /**
     * Busca ofertas de crédito na API e salva no banco de dados
     *
     * @param string $cpf
     * @return array
     */
    public function getBanksOffers(string $cpf, float|null $valor = null): mixed
    {
        if (in_array($cpf, $this->cpfsTest)) {
            $apiResponse = $this->fetch($cpf);
        }else{
            $apiResponse = $this->simulatedOffers($cpf, $valor);
        }

        return $apiResponse;
    }

    protected function fetch(string $cpf): array
    {
        return $this->apiRequest->send($this->apiUrl . 'simulacao/credito', [
            'cpf' => $cpf,
        ]);
    }

    protected function simulatedOffers(string $cpf, float|null $valor = null): mixed
    {
        return ['instituicoes' => $this->institutionRepository->getInstitutionsWithModalities(false, $valor)];
    }

    protected function saveBanksOffers(string $cpf, array $apiResponse): void
    {
        try {
            if (!isset($apiResponse['instituicoes'])) {
                return;
            }

            foreach ($apiResponse['instituicoes'] as $institutionData) {
                // Cria ou atualiza a instituição

                $institution = $this->institutionRepository->firstOrCreate(
                    ['id' => $institutionData['id']],
                    ['name' => $institutionData['nome']]
                );

                foreach ($institutionData['modalidades'] as $modalityData) {
                    // Cria ou atualiza a modalidade
                    $modality = $this->modalityRepository->firstOrCreate(
                        ['code' => $modalityData['cod']],
                        ['name' => $modalityData['nome']]
                    );

                    // Associa a instituição à modalidade
                    $institution->modalities()->syncWithoutDetaching([$modality->id]);

                    $creditOffer = $this->creditOfferRepository->firstOrCreate(
                        [
                            'cpf' => $cpf,
                            'institution_id' => $institution->id,
                            'modality_id' => $modality->id,
                            'modality_code' => $modalityData['cod'],
                        ],
                        [
                            // Aqui você pode adicionar outros campos quando disponíveis
                            'MinInstallments' => null,
                            'MaxInstallments' => null,
                            'MinValue' => null,
                            'MaxValue' => null,
                            'MonthlyInterest' => null,
                        ]
                    );
                }
            }
        } catch (\Exception $e) {
            // Log do erro, mas não interrompe o fluxo
            \Log::error('Erro ao salvar ofertas de crédito: ' . $e->getMessage());
        }
    }
}
