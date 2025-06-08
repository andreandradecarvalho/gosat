import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Calendar, Star, Loader2, CreditCard, User, Banknote, Percent } from 'lucide-react';
import { Bank } from '@/pages/Index';
import { LoanFilters } from './LoanFilters';
import { CompactBankCard } from './CompactBankCard';
import { ComparisonModal } from './ComparisonModal';

interface BankListProps {
  banks: Bank[];
  isLoading: boolean;
  userCpf: string;
  loanAmount?: number;
  onSelectBank: (bank: Bank) => void;
}

interface BankModalityCard {
  bank: Bank;
  modalidade: string;
  codModalidade: string;
  id: string;
}

export const BankList: React.FC<BankListProps> = ({ banks, isLoading, userCpf, loanAmount, onSelectBank }) => {
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<BankModalityCard[]>([]);
  
  // Estados para filtros e ordenação
  const [sortBy, setSortBy] = useState('most-advantageous');
  const [maxAmountFilter, setMaxAmountFilter] = useState('');
  const [maxRateFilter, setMaxRateFilter] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return (value).toFixed(2) + '%';
  };

  // Função para calcular score de vantagem
  const calculateAdvantageScore = (card: BankModalityCard) => {
    const { bank } = card;
    if (!bank.simulation) return 0;

    let score = 0;
    const { jurosMes = 0, valorMax = 0, QntParcelaMax = 0 } = bank.simulation;
    
    // Taxa de juros (peso 40%) - menor é melhor
    // Evita divisão por zero e valores negativos
    const normalizedRate = Math.max(0.01, jurosMes); // Mínimo de 0.01% para evitar divisão por zero
    const rateScore = (1 / normalizedRate) * 40;
    score += rateScore;
    
    // Valor máximo (peso 30%) - maior é melhor
    // Normaliza para uma escala de 0 a 100.000
    const normalizedAmount = Math.min(valorMax, 100000); // Limita em 100.000 para normalização
    const amountScore = (normalizedAmount / 100000) * 30;
    score += amountScore;
    
    // Prazo máximo (peso 20%) - mais parcelas é melhor
    // Normaliza para uma escala de 0 a 60 meses (5 anos)
    const normalizedInstallments = Math.min(QntParcelaMax, 60);
    const installmentScore = (normalizedInstallments / 60) * 20;
    score += installmentScore;
    
    // Banco em destaque (peso 10%)
    const featuredScore = bank.featured ? 10 : 0;
    score += featuredScore;
    
    // Se não houver simulação, retorna 0 para ficar no final da lista
    if (!bank.simulation) return 0;
    
    return score;
  };

  const handleBankSelect = (bank: Bank) => {
    onSelectBank(bank);
  };

  // Remove handleModalClose as it's now handled by the parent

  const handleCompareToggle = (card: BankModalityCard) => {
    setSelectedForComparison(prev => {
      const isSelected = prev.some(c => c.id === card.id);
      if (isSelected) {
        return prev.filter(c => c.id !== card.id);
      } else {
        return [...prev, card];
      }
    });
  };

  const handleRemoveFromComparison = (cardId: string) => {
    setSelectedForComparison(prev => prev.filter(c => c.id !== cardId));
  };

  const handleClearFilters = () => {
    setSortBy('most-advantageous');
    setMaxAmountFilter('');
    setMaxRateFilter('');
    setModalityFilter('all');
  };

  // Criar cards separados para cada modalidade de cada banco
  const bankModalityCards = useMemo(() => {
    const cards: BankModalityCard[] = [];
    
    banks.forEach(bank => {
      bank.modalidades.forEach(modalidade => {
        cards.push({
          bank,
          modalidade: modalidade.nome || modalidade.name || 'Crédito Pessoal',
          codModalidade: modalidade.cod || modalidade.code || '',
          id: `${bank.id}-${modalidade.cod || modalidade.code}`
        });
      });
    });

    return cards;
  }, [banks]);

  // Agrupar cards por tipo de modalidade
  const cardsByModality = useMemo(() => {
    const grouped: { [key: string]: BankModalityCard[] } = {
      'crédito pessoal': [],
      'crédito consignado': [],
      'antecipação de 13º salário': [],
      'financiamento de veículo': [],
      'crédito empresarial': [],
      'antecipação de restituição IR': [],
      'financiamento imobiliário': [],
      'crédito com garantia': [],
      'refinanciamento': []
    };

    bankModalityCards.forEach(card => {
      const modalidadeNome = card.modalidade.toLowerCase();
      
      // Mapeamento de termos de busca para categorias
      if (modalidadeNome.includes('pessoal')) {
        grouped['crédito pessoal'].push(card);
      } else if (modalidadeNome.includes('consignado')) {
        grouped['crédito consignado'].push(card);
      } else if (modalidadeNome.includes('13') || modalidadeNome.includes('décimo terceiro') || modalidadeNome.includes('13º')) {
        grouped['antecipação de 13º salário'].push(card);
      } else if (modalidadeNome.includes('veículo') || modalidadeNome.includes('veiculo') || modalidadeNome.includes('automóvel') || modalidadeNome.includes('automovel')) {
        grouped['financiamento de veículo'].push(card);
      } else if (modalidadeNome.includes('empresarial') || modalidadeNome.includes('empresa') || modalidadeNome.includes('pme') || modalidadeNome.includes('mei')) {
        grouped['crédito empresarial'].push(card);
      } else if (modalidadeNome.includes('restituição') || modalidadeNome.includes('ir') || modalidadeNome.includes('imposto de renda')) {
        grouped['antecipação de restituição IR'].push(card);
      } else if (modalidadeNome.includes('imobiliário') || modalidadeNome.includes('imobiliario') || modalidadeNome.includes('casa própria') || modalidadeNome.includes('imóvel')) {
        grouped['financiamento imobiliário'].push(card);
      } else if (modalidadeNome.includes('garantia') || modalidadeNome.includes('garantido') || modalidadeNome.includes('garantir')) {
        grouped['crédito com garantia'].push(card);
      } else if (modalidadeNome.includes('refinanciamento') || modalidadeNome.includes('refinanciar') || modalidadeNome.includes('refin')) {
        grouped['refinanciamento'].push(card);
      } else {
        // Se não se encaixar em nenhuma categoria, coloca em crédito pessoal como padrão
        grouped['crédito pessoal'].push(card);
      }
    });

    // Remove categorias vazias
    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 0) {
        delete grouped[key];
      }
    });

    return grouped;
  }, [bankModalityCards]);

  // Filtros e ordenação para cada modalidade
  const getFilteredAndSortedCards = (modalityCards: BankModalityCard[]) => {
    let filtered = [...modalityCards];

    // Filtro por modalidade
    if (modalityFilter !== 'all') {
      filtered = filtered.filter(card => {
        const modalidadeNome = card.modalidade.toLowerCase();
        switch (modalityFilter) {
          case 'pessoal':
            return modalidadeNome.includes('pessoal');
          case 'consignado':
            return modalidadeNome.includes('consignado');
          case '13':
            return modalidadeNome.includes('13') || modalidadeNome.includes('antecipação');
          default:
            return true;
        }
      });
    }

    // Aplicar outros filtros
    if (maxAmountFilter) {
      const maxAmount = parseFloat(maxAmountFilter);
      filtered = filtered.filter(card => {
        const valorMax = card.bank.simulation?.valorMax;
        return valorMax !== undefined && valorMax > 0 && valorMax >= maxAmount;
      });
    }

    if (maxRateFilter) {
      const maxRate = parseFloat(maxRateFilter) / 100; // Converter porcentagem para decimal
      filtered = filtered.filter(card => {
        const jurosMes = card.bank.simulation?.jurosMes;
        return jurosMes !== undefined && jurosMes > 0 && jurosMes <= maxRate;
      });
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      // Se um dos itens não tem simulação, coloca no final
      if (!a.bank.simulation && !b.bank.simulation) return 0;
      if (!a.bank.simulation) return 1;
      if (!b.bank.simulation) return -1;

      // Se tem simulação, aplica a ordenação escolhida
      switch (sortBy) {
        case 'most-advantageous':
          return calculateAdvantageScore(b) - calculateAdvantageScore(a);
        case 'rate-asc':
          return (a.bank.simulation.jurosMes || 0) - (b.bank.simulation.jurosMes || 0);
        case 'rate-desc':
          return (b.bank.simulation.jurosMes || 0) - (a.bank.simulation.jurosMes || 0);
        case 'amount-asc':
          return (a.bank.simulation.valorMax || 0) - (b.bank.simulation.valorMax || 0);
        case 'amount-desc':
          return (b.bank.simulation.valorMax || 0) - (a.bank.simulation.valorMax || 0);
        case 'approval':
          // Priorizar bancos em destaque para aprovação rápida
          const aFeatured = a.bank.featured ? 0 : 1;
          const bFeatured = b.bank.featured ? 0 : 1;
          return aFeatured - bFeatured;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'crédito pessoal':
        return <User className="h-5 w-5" />;
      case 'crédito consignado':
        return <CreditCard className="h-5 w-5" />;
      case 'antecipação de 13º salário':
        return <Banknote className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'crédito pessoal':
        return 'from-blue-600 to-blue-400';
      case 'crédito consignado':
        return 'from-green-600 to-green-400';
      case 'antecipação de 13º salário':
        return 'from-purple-600 to-purple-400';
      default:
        return 'from-gray-600 to-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Consultando bancos parceiros...
        </h3>
        <p className="text-gray-600">
          Estamos buscando as melhores ofertas para você
        </p>
      </div>
    );
  }

  if (banks.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Nenhuma oferta encontrada
        </h3>
        <p className="text-gray-600">
          Tente novamente mais tarde
        </p>
      </div>
    );
  }

  const totalCards = bankModalityCards.length;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          Ofertas Disponíveis
        </h3>
        <p className="text-gray-600">
          Encontramos {totalCards} opções de empréstimo para você
        </p>
      </div>

      {/* Filtros */}
      <LoanFilters
        sortBy={sortBy}
        setSortBy={setSortBy}
        maxAmountFilter={maxAmountFilter}
        setMaxAmountFilter={setMaxAmountFilter}
        maxRateFilter={maxRateFilter}
        setMaxRateFilter={setMaxRateFilter}
        modalityFilter={modalityFilter}
        setModalityFilter={setModalityFilter}
        onClearFilters={handleClearFilters}
        onOpenComparison={() => setIsComparisonOpen(true)}
        comparisonCount={selectedForComparison.length}
      />

      {/* Seções por modalidade */}
      {Object.entries(cardsByModality).map(([modality, modalityCards]) => {
        if (modalityCards.length === 0) return null;

        const filteredCards = getFilteredAndSortedCards(modalityCards);
        if (filteredCards.length === 0) return null;

        const featuredCards = filteredCards.filter(card => card.bank.featured);
        const regularCards = filteredCards.filter(card => !card.bank.featured);
        const minAmount = filteredCards.filter(card => card.bank.modalidades.some(modality => modality.offer.valorMin > 0));

        let sortBy = 'most-advantageous';
        if (minAmount.length <= 0) {
         sortBy = 'amount-asc';
        }
        
        return (
          <div key={modality} className="space-y-6">
            {/* Header da modalidade */}
            <div className={`bg-gradient-to-r ${getModalityColor(modality)} rounded-2xl p-6 text-white`}>
              <div className="flex items-center gap-3 mb-2">
                {getModalityIcon(modality)}
                <h4 className="text-2xl font-bold capitalize">{modality}</h4>
              </div>
              <p className="text-white/90">
                {filteredCards.length} {filteredCards.length === 1 ? 'oferta disponível' : 'ofertas disponíveis'}
                {sortBy === 'most-advantageous' && (
                  <span className="ml-2 text-yellow-200">✨ Ordenado por vantagem</span>
                )}
              </p>
            </div>

            {/* Cards em destaque */}
            {featuredCards.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h5 className="text-lg font-semibold text-gray-800">Ofertas em Destaque</h5>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredCards.map((card) => (
                    <CompactBankCard 
                      key={card.id} 
                      card={card} 
                      featured 
                      userCpf={userCpf}
                      loanAmount={loanAmount}
                      onSelect={handleBankSelect} 
                      onCompare={handleCompareToggle}
                      isSelected={selectedForComparison.some(c => c.id === card.id)}
                      formatCurrency={formatCurrency} 
                      formatPercentage={formatPercentage} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cards regulares */}
            {regularCards.length > 0 && (
              <div>
                {featuredCards.length > 0 && (
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Outras Ofertas</h5>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regularCards.map((card) => (
                    <CompactBankCard 
                      key={card.id} 
                      card={card} 
                      userCpf={userCpf}
                      loanAmount={loanAmount}
                      onSelect={handleBankSelect} 
                      onCompare={handleCompareToggle}
                      isSelected={selectedForComparison.some(c => c.id === card.id)}
                      formatCurrency={formatCurrency} 
                      formatPercentage={formatPercentage} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Modal de comparação */}
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        selectedCards={selectedForComparison}
        loanAmount={loanAmount}
        onRemoveCard={handleRemoveFromComparison}
        onSelectBank={handleBankSelect}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentage}
      />
    </div>
  );
};
