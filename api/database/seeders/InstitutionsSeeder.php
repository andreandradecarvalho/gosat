<?php

namespace Database\Seeders;

use App\Models\Institution;
use App\Models\Modality;
use Illuminate\Database\Seeder;


class InstitutionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    function generateRandomNumber($min = 0.025, $max = 0.0500)
    {
        return $min + mt_rand() / mt_getrandmax() * ($max - $min);
    }
    public function run()
    {
        $institutions = [
            [
                'id' => 1,
                'name' => 'Banco NeoFinance',
                'logo' => "🏦",
                'featured' => true,
                'simulation' => true,
                'modalidades' => [
                    [
                        'name' => 'crédito pessoal',
                        'code' => '3',
                        'simulation' => true,
                    ]
                ],
                'simulation_data' => [
                    'QntParcelaMin' => 6,
                    'QntParcelaMax' => 72,
                    'valorMin' => 500,
                    'valorMax' => 100000,
                    'jurosMes' => 0.0345
                ]
            ],
            [
                'id' => 2,
                'name' => 'CrediMax',
                'logo' => "🏦",
                'featured' => false,
                'simulation' => true,
                'modalidades' => [
                    [
                        'name' => 'empréstimo pessoal',
                        'code' => '4',
                        'simulation' => true,
                    ],
                    [
                        'name' => 'crédito com garantia',
                        'code' => '9',
                        'simulation' => true,
                    ]
                ],
                'simulation_data' => [
                    'QntParcelaMin' => 12,
                    'QntParcelaMax' => 48,
                    'valorMin' => 2000,
                    'valorMax' => 30000,
                    'jurosMes' => 0.0280
                ]
            ],
            [
                'id' => 3,
                'name' => 'Banco Solar',
                'logo' => '☀️',
                'featured' => true,
                'simulation' => true,
                'modalidades' => [
                    [
                        'name' => 'crédito consignado',
                        'code' => '13',
                        'simulation' => true,
                    ],
                    [
                        'name' => 'financiamento de veículo',
                        'code' => '8',
                        'simulation' => true,
                    ],
                    [
                        'name' => 'crédito pessoal',
                        'code' => '3',
                        'simulation' => true,
                    ]
                ],
                'simulation_data' => [
                    'QntParcelaMin' => 3,
                    'QntParcelaMax' => 60,
                    'valorMin' => 1000,
                    'valorMax' => 80000,
                    'jurosMes' => 0.0310
                ]
            ],
            [
                'id' => 4,
                'name' => 'UniBanco',
                'logo' => '🏛️',
                'featured' => false,
                'simulation' => true,
                'modalidades' => [
                    [
                        'name' => 'crédito empresarial',
                        'code' => '10',
                        'simulation' => true,
                    ]
                ],
                'simulation_data' => [
                    'QntParcelaMin' => 12,
                    'QntParcelaMax' => 84,
                    'valorMin' => 5000,
                    'valorMax' => 150000,
                    'jurosMes' => 0.0275
                ]
            ],
            [
                'id' => 5,
                'name' => 'Banco Verde',
                'logo' => '🌳',
                'featured' => true,
                'simulation' => true,
                'modalidades' => [
                    [
                        'name' => 'crédito consignado',
                        'code' => '13',
                        'simulation' => true,
                    ],
                    [
                        'name' => 'empréstimo com garantia',
                        'code' => '9',
                        'simulation' => true,
                    ]
                ],
                'simulation_data' => [
                    'QntParcelaMin' => 6,
                    'QntParcelaMax' => 36,
                    'valorMin' => 300,
                    'valorMax' => 20000,
                    'jurosMes' => 0.0350
                ]
            ],
            [
                'id' => 6,
                'name' => 'FinanPlus',
                'logo' => '💸',
                'featured' => false,
                'simulation' => true,
                'modalidades' => [
                    [
                        'name' => 'financiamento de veículo',
                        'code' => '8',
                        'simulation' => true,
                    ],
                    [
                        'name' => 'antecipação de restituição IR',
                        'code' => '17',
                        'simulation' => true,
                    ]
                ],
                'simulation_data' => [
                    'QntParcelaMin' => 12,
                    'QntParcelaMax' => 60,
                    'valorMin' => 1500,
                    'valorMax' => 60000,
                    'jurosMes' => 0.0305
                ]
            ],
            [
                'id' => 7,
                'name' => 'Banco Estrela',
                'logo' => '⭐',
                'featured' => true,
                'simulation' => true,
                'modalidades' => [
                    [
                        'name' => 'financiamento imobiliário',
                        'code' => '7',
                        'simulation' => true,
                    ]
                ],
                'simulation_data' => [
                    'QntParcelaMin' => 24,
                    'QntParcelaMax' => 120,
                    'valorMin' => 10000,
                    'valorMax' => 500000,
                    'jurosMes' => 0.0260
                ]
            ],
            [
                'id' => 8,
                'name' => 'CrediFácil',
                'logo' => '🧾',
                'featured' => false,
                'simulation' => true,
                'modalidades' => [
                    [
                        'name' => 'empréstimo pessoal',
                        'code' => '4',
                        'simulation' => true,
                    ],
                    [
                        'name' => 'antecipação 13º',
                        'code' => '15',
                        'simulation' => true,
                    ],
                    [
                        'name' => 'crédito com garantia',
                        'code' => '9',
                        'simulation' => true,
                    ]
                ],
                'simulation_data' => [
                    'QntParcelaMin' => 6,
                    'QntParcelaMax' => 48,
                    'valorMin' => 800,
                    'valorMax' => 25000,
                    'jurosMes' => 0.0320
                ]
            ],
            [
                'id' => 9,
                'name' => 'Banco Aurora',
                'logo' => '🌅',
                'featured' => true,
                'simulation' => true,
                'modalidades' => [
                    [
                        'name' => 'crédito pessoal',
                        'code' => '3',
                        'simulation' => true,
                    ],
                    [
                        'name' => 'crédito consignado',
                        'code' => '13',
                        'simulation' => true,
                    ]
                ],
                'simulation_data' => [
                    'QntParcelaMin' => 12,
                    'QntParcelaMax' => 72,
                    'valorMin' => 2000,
                    'valorMax' => 90000,
                    'jurosMes' => 0.0290
                ]
            ],
            [
                'id' => 10,
                'name' => 'MegaCred',
                'logo' => '💼',
                'featured' => false,
                'simulation' => true,
                'modalidades' => [
                    [
                        'name' => 'refinanciamento',
                        'code' => '11',
                        'simulation' => true,
                    ]
                ],
                'simulation_data' => [
                    'QntParcelaMin' => 18,
                    'QntParcelaMax' => 96,
                    'valorMin' => 5000,
                    'valorMax' => 200000,
                    'jurosMes' => 0.0270
                ]
            ]
        ];

        foreach ($institutions as $institutionData) {

            // Create or update institution
            $institution = Institution::updateOrCreate(
                ['id' => $institutionData['id']],
                [
                    'name' => $institutionData['name'],
                    'logo' => $institutionData['logo'],
                    'featured' => $institutionData['featured'],
                    'simulation' => $institutionData['simulation']
                ]
            );

            // Process each modality
            foreach ($institutionData['modalidades'] as $modalityData) {
                // Create or update modality
                $modality = Modality::updateOrCreate(
                    ['code' => $modalityData['code']],
                    [
                        'name' => $modalityData['name'],
                        'simulation' => $modalityData['simulation']
                    ]
                );

                // Attach modality to institution if not already attached
                if (!$institution->modalities()->where('modality_id', $modality->id)->exists()) {
                    $institution->modalities()->attach($modality->id);
                }

                // Create or update credit offer
                $institution->creditOffers()->updateOrCreate(
                    [
                        'modality_id' => $modality->id,
                        'simulation' => true
                    ],
                    [
                        'modality_code' => $modality->code,
                        'MinInstallments' => $institutionData['simulation_data']['QntParcelaMin'],
                        'MaxInstallments' => $institutionData['simulation_data']['QntParcelaMax'],
                        'MinValue' => $institutionData['simulation_data']['valorMin'],
                        'MaxValue' => $institutionData['simulation_data']['valorMax'],
                        'MonthlyInterest' => $this->generateRandomNumber(),
                        'simulation' => true
                    ]
                );
            }
        }
    }
}
