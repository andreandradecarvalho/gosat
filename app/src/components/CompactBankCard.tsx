
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, Percent, Star, Plus, Loader2 } from 'lucide-react';
import { Bank } from '@/pages/Index';
import { useToast } from '@/components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';


interface BankModalityCard {
  bank: Bank;
  modalidade: string;
  codModalidade: string;
  id: string;
}

interface CompactBankCardProps {
  card: BankModalityCard;
  featured?: boolean;
  userCpf: string;
  loanAmount?: number;
  onSelect: (bank: Bank) => void;
  onCompare: (card: BankModalityCard) => void;
  isSelected: boolean;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
}

export const CompactBankCard: React.FC<CompactBankCardProps> = ({ 
  card, 
  featured = false, 
  userCpf,
  loanAmount,
  onSelect, 
  onCompare,
  isSelected,
  formatCurrency, 
  formatPercentage 
}) => {
  const { bank, modalidade, codModalidade } = card;
  const { simulation } = bank;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDetailsClick = async () => {
    try {
      setIsLoading(true);
      
      // Always make the POST request to get fresh simulation data
      const response = await fetch(`${API_BASE_URL}/simulacao-de-oferta-de-credito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({
          cpf: userCpf.replace(/[^\d]/g, ''), // Remove any non-digit characters
          instituicao_id: bank.id,
          codModalidade: codModalidade,
          valorSolicitado: loanAmount || 1000.00 // Usa o valor informado ou 1000.00 como padrão
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao carregar detalhes da oferta');
      }

      const responseData = await response.json();
      
      if (!responseData.data || !responseData.data.simulation) {
        throw new Error('Dados de simulação não encontrados na resposta');
      }

      const simulation = responseData.data.simulation;
      
      // Update the bank with complete simulation data
      const updatedBank = {
        ...bank,
        simulation: {
          QntParcelaMin: simulation.QntParcelaMin || 0,
          QntParcelaMax: simulation.QntParcelaMax || 0,
          valorMin: simulation.valorMin || 0,
          valorMax: simulation.valorMax || 0,
          jurosMes: simulation.jurosMes || 0,
          valorSolicitado: simulation.valorSolicitado || '',
          valorSolicitadoSemFormato: simulation.valorSolicitadoSemFormato || 0,
          parcelas: simulation.parcelas || 0,
          valorTotal: simulation.valorTotal || '',
          valorParcela: simulation.valorParcela || ''
        }
      };
      
      // Only after successful response, call onSelect to open the modal
      onSelect(updatedBank);
      
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível carregar os detalhes da oferta.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className={`bg-white rounded-lg shadow-md border transition-all duration-300 hover:shadow-lg ${
        featured 
          ? 'border-blue-500 border-2' 
          : 'border-gray-200'
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      {featured && (
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white text-center py-1 rounded-t-lg">
          <span className="text-xs font-medium">⭐ Destaque</span>
        </div>
      )}
      
      <div className="p-4">
        {/* Header compacto */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{bank.logo || '🏦'}</span>
            <div>
              <h3 className="text-sm font-bold text-gray-800">{bank.nome}</h3>
              <Badge variant="outline" className="text-xs px-2 py-0">
                {modalidade}
              </Badge>
            </div>
          </div>
          {bank.simulation.valorMin > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCompare(card)}
            className={`p-1 h-8 w-8 ${isSelected ? 'bg-blue-100' : ''}`}
          >
            <Plus className="h-3 w-3" />
          </Button>
          )}
        </div>

        {/* Informações em grid compacto */}
        {bank.simulation && (
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            {bank.simulation.valorMin > 0 && (
              <div className="text-center p-2 bg-orange-50 rounded">
                <DollarSign className="h-3 w-3 text-orange-600 mx-auto mb-1" />
                <p className="text-gray-600">Min</p>
                <p className="font-bold text-orange-700">{formatCurrency(bank.simulation.valorMin)}</p>
              </div>
            )}
            {bank.simulation.valorMax > 0 && (
              <div className="text-center p-2 bg-green-50 rounded">
                <DollarSign className="h-3 w-3 text-green-600 mx-auto mb-1" />
                <p className="text-gray-600">Max</p>
                <p className="font-bold text-green-700">{formatCurrency(bank.simulation.valorMax)}</p>
              </div>
            )}
            {bank.simulation.QntParcelaMax > 0 && (
              <div className="text-center p-2 bg-blue-50 rounded">
                <Calendar className="h-3 w-3 text-blue-600 mx-auto mb-1" />
                <p className="text-gray-600">Parcelas</p>
                <p className="font-bold text-blue-700">{bank.simulation.QntParcelaMax}x</p>
              </div>
            )}
            {bank.simulation.jurosMes > 0 && (
              <div className="text-center p-2 bg-purple-50 rounded">
                <Percent className="h-3 w-3 text-purple-600 mx-auto mb-1" />
                <p className="text-gray-600">Taxa</p>
                <p className="font-bold text-purple-700">{formatPercentage(bank.simulation.jurosMes)}</p>
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={handleDetailsClick}
          className="w-full h-8 text-xs"
          variant={featured ? "default" : "secondary"}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Carregando...
            </>
          ) : 'Ver Detalhes'}
        </Button>
      </div>
    </div>
  );
};
