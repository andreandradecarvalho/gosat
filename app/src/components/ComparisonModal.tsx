
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, DollarSign, Calendar, Percent, Trash2 } from 'lucide-react';
import { Bank } from '@/pages/Index';

interface BankModalityCard {
  bank: Bank;
  modalidade: string;
  codModalidade: string;
  id: string;
}

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCards: {
    bank: Bank;
    modalidade: string;
  }[];
  loanAmount?: number;
  onRemoveCard: (cardId: string) => void;
  onSelectBank: (bank: Bank) => void;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedCards,
  loanAmount,
  onRemoveCard,
  onSelectBank,
  formatCurrency,
  formatPercentage
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Comparar Ofertas ({selectedCards.length})
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        {selectedCards.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Selecione ofertas para comparar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCards.map((card) => (
              <div key={card.id} className="border rounded-lg p-4 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => onRemoveCard(card.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>

                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{card.bank.logo || '🏦'}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{card.bank.nome}</h3>
                    <Badge variant="outline" className="text-xs">
                      {card.modalidade}
                    </Badge>
                  </div>
                </div>

                {/* Informações */}
                {card.bank.simulation && (
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Valores</span>
                      </div>
                      <p className="text-xs text-gray-600">De {formatCurrency(card.bank.simulation.valorMin)}</p>
                      <p className="font-bold text-green-700">Até {formatCurrency(card.bank.simulation.valorMax)}</p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Parcelas</span>
                      </div>
                      <p className="text-xs text-gray-600">De {card.bank.simulation.QntParcelaMin}x</p>
                      <p className="font-bold text-blue-700">Até {card.bank.simulation.QntParcelaMax}x</p>
                    </div>

                    <div className="bg-purple-50 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Percent className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">Taxa mensal</span>
                      </div>
                      <p className="font-bold text-purple-700 text-lg">{formatPercentage(card.bank.simulation.jurosMes)}</p>
                    </div>

                    {/* Exemplo de Prestação */}
                    <div className="bg-gray-50 rounded-lg p-3 border-2 border-dashed border-gray-300">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-1">
                        <Percent className="h-3 w-3 text-gray-600" />
                        Exemplo de Prestação
                      </h4>
                      {(() => {
                        const simulation = card.bank.simulation;
                        console.log('----------------');
                        console.log('simulation', card);
                        console.log('----------------');
                        // Verifica se os dados necessários existem
                        if (!card.bank.simulation.QntParcelaMin || !card.bank.simulation.jurosMes) {
                          return (
                            <div className="text-center text-sm text-gray-500">
                              Dados de simulação indisponíveis
                            </div>
                          );
                        }
                        
                        const taxa = simulation.jurosMes;
                        // Usa o valor do input do formulário (loanAmount) ou 1000 como fallback
                        const valor = simulation.valorSolicitadoSemFormato || loanAmount || 1000;
                        const numParcelas = simulation.QntParcelaMin; // Usa o número mínimo de parcelas
                        
                        // Cálculo da prestação com arredondamento
                        const prestacao = valor * (taxa * Math.pow(1 + taxa, numParcelas)) / (Math.pow(1 + taxa, numParcelas) - 1);
                        const prestacaoArredondada = isNaN(prestacao) ? 0 : Number(prestacao.toFixed(2));
                        const valorTotal = prestacaoArredondada * numParcelas;
                        
                        return (
                          <div className="text-center space-y-1">
                            <div>
                              <p className="text-xs text-gray-600">Empréstimo de {formatCurrency(valor)}</p>
                              <p className="text-xs text-gray-600">em {numParcelas}x</p>
                            </div>
                            <div className="bg-white rounded p-2">
                              <p className="text-sm font-bold text-gray-800">
                                {formatCurrency(prestacaoArredondada)}
                              </p>
                              <p className="text-xs text-gray-500">por mês*</p>
                            </div>
                            <div className="bg-white rounded p-2">
                              <p className="text-sm font-bold text-gray-800">
                                {formatCurrency(Number(valorTotal.toFixed(2)))}
                              </p>
                              <p className="text-xs text-gray-500">valor total*</p>
                            </div>
                            <p className="text-[10px] text-gray-400">
                              *Valores aproximados para simulação
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => onSelectBank(card.bank)}
                  className="w-full mt-4"
                  size="sm"
                >
                  Ver Detalhes
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
