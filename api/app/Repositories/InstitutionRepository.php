<?php

namespace App\Repositories;

use App\Models\Institution;
use App\Interfaces\InstitutionInterface;
use App\Repositories\BaseRepository;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;

class InstitutionRepository extends BaseRepository implements InstitutionInterface
{
    public function __construct(Institution $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all institutions with their modalities and simulation data
     *
     * @param bool $onlyFeatured Whether to return only featured institutions
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getInstitutionsWithModalities(bool $onlyFeatured = false, float $valor = null): Collection
    {
        $query = $this->model->with(['modalities', 'creditOffers']);

        if ($onlyFeatured) {
            $query->where('featured', true);
        }
        if ($valor) {
            $query->whereHas('creditOffers', function (Builder $query) use ($valor) {
                $query->where('simulation', true)->where('MinValue', '>=', $valor);
            });
        }

        return $query->get()->map(function($institution) {
            return [
                'id' => $institution->id,
                'nome' => $institution->name,
                'logo' => $institution->logo,
                'featured' => (bool)$institution->featured,
                'simulation' => (bool)$institution->simulation,
                'modalidades' => $institution->modalities->map(function($modality) use ($institution) {
                    $offer = $institution->creditOffers
                        ->where('modality_id', $modality->id)
                        ->where('simulation', true)
                        ->first();

                    return [
                        'id' => $modality->id,
                        'name' => $modality->name,
                        'code' => $modality->code,
                        'simulation' => (bool)$modality->simulation,
                        'offer' => $offer ? [
                            'min_installments' => $offer->MinInstallments,
                            'max_installments' => $offer->MaxInstallments,
                            'min_value' => $offer->MinValue,
                            'max_value' => $offer->MaxValue,
                            'monthly_interest' => (float)$offer->MonthlyInterest,
                        ] : null
                    ];
                })

            ];
        });
    }

    /**
     * Get all available modalities across all institutions
     *
     * @return \Illuminate\Support\Collection
     */
    public function getAllModalities(): Collection
    {
        return \App\Models\Modality::with('institutions')
            ->where('simulation', true)
            ->get()
            ->map(function($modality) {
                return [
                    'id' => $modality->id,
                    'name' => $modality->name,
                    'code' => $modality->code,
                    'institution_count' => $modality->institutions->count(),
                ];
            });
    }
}
