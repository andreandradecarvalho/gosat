
import React, { useState, useEffect, useRef } from 'react';
import { CPFForm } from '@/components/CPFForm';
import { BankList } from '@/components/BankList';
import { Search, CreditCard, Shield, TrendingUp, BarChart2, List, Star, Building2 as Bank } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SimulationModal } from '@/components/SimulationModal';
import { consultaOfertasDeCredito, OfertaCredito } from '@/services/creditService';
import { useToast } from '@/components/ui/use-toast';

type ChartData = {
  name: string;
  value: number;
};

export interface Modalidade {
  nome: string;
  cod: string;
}

export interface Simulation {
  QntParcelaMin: number;
  QntParcelaMax: number;
  valorMin: number;
  valorMax: number;
  jurosMes: number;
}

export interface Bank {
  id: number;
  nome: string;
  modalidades: Modalidade[];
  simulation?: Simulation;
  // Campos opcionais para compatibilidade com o design atual
  logo?: string;
  interestRate?: number;
  maxAmount?: number;
  minAmount?: number;
  installments?: number;
  approval?: string;
  featured?: boolean;
  // Adicionando campos da API
  instituicao?: string;
  valorMin?: number;
  valorMax?: number;
  jurosMes?: number;
  qntParcelaMin?: number;
  qntParcelaMax?: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    instituicoes: Bank[];
  };
}

const Index = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [userCpf, setUserCpf] = useState('');
  const [loanAmount, setLoanAmount] = useState<number | undefined>(undefined);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const offersRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  
  // Scroll para as ofertas quando os bancos são carregados
  useEffect(() => {
    if (banks.length > 0 && !isLoading && offersRef.current) {
      setTimeout(() => {
        offersRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    }
  }, [banks, isLoading]);

  // Função auxiliar para obter o logo do banco
  const getBankLogo = (bankName?: string): string => {
    if (!bankName) return '🏦';
    
    const logos: Record<string, string> = {
      'itau': '🏦',
      'bradesco': '🏦',
      'santander': '🏦',
      'caixa': '🏦',
      'nubank': '🟣',
      'inter': '🟠',
      'c6': '⚫',
      'pan': '🔵',
      'safra': '🔵',
      'banco do brasil': '🟡',
      'bmg': '🔵',
      'sicoob': '🔵',
      'sicredi': '🔴'
    };
    
    const lowerName = bankName.toLowerCase();
    const logo = Object.entries(logos).find(([key]) => lowerName.includes(key));
    return logo ? logo[1] : '🏦';
  };

  const handleCPFSubmit = async (cpf: string, amount?: number) => {
    setIsLoading(true);
    setHasSearched(true);
    setUserCpf(cpf);
    setLoanAmount(amount);
    setBanks([]); // Limpar resultados anteriores

    try {
      const response = await consultaOfertasDeCredito({
        cpf: cpf.replace(/[^\d]/g, ''), // Keep only digits
        valor: amount
      });

      // Check if there are any offers
      if (!response.data?.instituicoes?.length) {
        toast({
          title: "Nenhuma oferta encontrada",
          description: "Não encontramos ofertas disponíveis para o CPF informado.",
          variant: "default",
        });
        return;
      }
      

     
      // Define interfaces for API response
      interface ApiOffer {
        min_installments: number;
        max_installments: number;
        min_value: number;
        max_value: number;
        monthly_interest: number;
      }

      interface ApiModalidade {
        id: number;
        name?: string;
        code?: string;
        nome?: string;
        cod?: string;
        simulation?: boolean;
        offer?: ApiOffer;
      }

      interface ApiInstituicao {
        id: number;
        nome: string;
        logo?: string;
        featured?: boolean;
        modalidades: ApiModalidade[];
        simulation?: boolean;
      }

      interface ApiResponseData {
        instituicoes: ApiInstituicao[];
      }

      // Map the API response to the format expected by BankList component
      const formattedBanks = response.data.instituicoes.map((instituicao: ApiInstituicao, index: number) => {
        // Process each loan type (modalidade) in the institution
        console.log('Processing institution:', instituicao.nome);
       
        let modalidades = instituicao.modalidades
          .filter((m: ApiModalidade) => m.offer) // Only include modalidades with offers
          .map((modalidade: ApiModalidade) => ({
            id: modalidade.id,
            nome: modalidade?.name || modalidade?.nome || 'Modalidade não especificada',
            cod: modalidade?.code || modalidade?.cod || '',
            simulation: modalidade?.simulation || false,
            offer: modalidade?.offer ? {
              QntParcelaMin: modalidade.offer.min_installments,
              QntParcelaMax: modalidade.offer.max_installments,
              valorMin: modalidade.offer.min_value,
              valorMax: modalidade.offer.max_value,
              jurosMes: modalidade.offer.monthly_interest
            } : {
              QntParcelaMin: 0,
              QntParcelaMax: 0,
              valorMin: 0,
              valorMax: 0,
              jurosMes: 0
            }
          }));


        if (!instituicao?.simulation && modalidades.length === 0) {
          modalidades = instituicao.modalidades.map((modalidade: ApiModalidade) => ({
            id: modalidade.id || 0,
            nome: modalidade?.nome || modalidade?.name || 'Modalidade não especificada',
            cod: modalidade?.cod || modalidade?.code || '',
            simulation: false,
            offer: {
              QntParcelaMin: 0,
              QntParcelaMax: 0,
              valorMin: 0,
              valorMax: 0,
              jurosMes: 0
            }
          }));
        }
  

      

        // Skip institutions with no valid offers
        if (modalidades.length === 0) return null;
  
        
        return {
          id: instituicao.id || index + 1,
          nome: instituicao.nome || `Instituição ${index + 1}`,
          logo: instituicao.logo || '🏦',
          featured: instituicao.featured || false,
          modalidades,
          // Map to the existing simulation format for backward compatibility
          simulation: modalidades[0]?.offer || {
            QntParcelaMin: 12,
            QntParcelaMax: 60,
            valorMin: 1000,
            valorMax: 50000,
            jurosMes: 0.03
          },
          // Additional fields for the UI
          interestRate: modalidades[0]?.offer?.jurosMes ? 
            modalidades[0].offer.jurosMes * 100 : 3, // Convert to percentage
          maxAmount: modalidades[0]?.offer?.max_value,
          minAmount: modalidades[0]?.offer?.min_value,
          installments: modalidades[0]?.offer?.max_installments
        };
      }).filter(Boolean); // Remove any null entries
  
      console.log('----------------------');
      console.log('formattedBanks', formattedBanks);
      console.log('----------------------');
      setBanks(formattedBanks);
      
      // Show success message if we have results
      if (formattedBanks.length > 0) {
        toast({
          title: "Ofertas carregadas",
          description: `Encontramos ${formattedBanks.length} ofertas para você!`,
          variant: "default",
        });
      } else {
        toast({
          title: "Nenhuma oferta disponível",
          description: "Não encontramos ofertas disponíveis com os critérios informados.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
      
      let errorMessage = 'Não foi possível carregar as ofertas. Tente novamente mais tarde.';
      
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('403')) {
          errorMessage = 'Acesso não autorizado. Verifique suas credenciais.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Endpoint não encontrado. Verifique a URL da API.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else if (error.message.includes('NetworkError')) {
          errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
        }
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Clear banks in case of error
      setBanks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBank(null);
  };

  // Helper function to generate random colors for charts
  const getRandomColor = (index: number) => {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', 
      '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#D0ED57'
    ];
    return colors[index % colors.length];
  };

  // Get offers count per bank
  const getOffersPerBank = (): ChartData[] => {
    const bankOffers: Record<string, number> = {};
    console.log('-------------');
    console.log('banks',banks);
    console.log('-------------');
    banks.forEach(bank => {
      const bankName = bank.nome || 'Banco sem nome';
      // Count each bank's offers (each bank can have multiple loan types)
      bankOffers[bankName] = (bankOffers[bankName] || 0) + bank.modalidades.length;
    });
    
    return Object.entries(bankOffers)
      .map(([name, value]) => ({
        name: `${name}      `,
        value
      }))
      .sort((a, b) => b.value - a.value); // Sort by number of offers (descending)
  };

  // Get interest rate data for the bar chart
  const getInterestRateData = () => {
    return banks
      .filter(bank => bank.jurosMes !== undefined)
      .map(bank => ({
        name: bank.nome,
        taxa: parseFloat((bank.jurosMes * 100).toFixed(2))
      }))
      .sort((a, b) => a.taxa - b.taxa);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {selectedBank && (
        <SimulationModal
          bank={selectedBank}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              EmpréstiFácil
            </h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Encontre o melhor
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block">
              empréstimo para você
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Compare ofertas de diferentes bancos e escolha a opção que melhor se adapta ao seu perfil
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Busca Rápida</h3>
              <p className="text-gray-600 text-sm">Compare ofertas em segundos</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">100% Seguro</h3>
              <p className="text-gray-600 text-sm">Seus dados protegidos</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Melhores Taxas</h3>
              <p className="text-gray-600 text-sm">As menores do mercado</p>
            </div>
          </div>
        </div>

        {/* CPF Form */}
        <div className="max-w-md mx-auto mb-12">
          <CPFForm onSubmit={handleCPFSubmit} isLoading={isLoading} />
        </div>

        {/* Results */}
        {hasSearched && (
          <div ref={offersRef} className="max-w-6xl mx-auto">
            <BankList 
              banks={banks} 
              isLoading={isLoading} 
              userCpf={userCpf}
              loanAmount={loanAmount}
              onSelectBank={handleBankSelect}
            />
            
            {/* Statistics Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart2 className="h-6 w-6 text-blue-600" />
                Estatísticas das Ofertas
              </h3>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total de Bancos</p>
                      <p className="text-3xl font-bold text-gray-800">{banks.length}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Bank className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipos de Empréstimo</p>
                      <p className="text-3xl font-bold text-gray-800">
                        {new Set(banks.flatMap(bank => bank.modalidades.map(m => m.nome))).size}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <List className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
                  <div className="flex items-center justify-between h-full">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Total de Ofertas</p>
                      <p className="text-3xl font-bold text-blue-900">
                        {banks.reduce((total, bank) => total + (bank.modalidades?.length || 0), 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <List className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="mt-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Ofertas por Banco</h4>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getOffersPerBank()}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={150}
                        tick={{ fontSize: 14 }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [value, 'Ofertas']}
                        labelFormatter={(label) => label.replace(/ - \d+ ofertas?$/, '')}
                      />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Número de Ofertas"
                        fill="#4f46e5"
                        radius={[0, 4, 4, 0]}
                      >
                        {getOffersPerBank().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getRandomColor(index)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
