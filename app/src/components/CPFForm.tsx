
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Loader2 } from 'lucide-react';
import { formatCPF, formatMoney } from '@/utils/cpfUtils';
import { useToast } from '@/hooks/use-toast';
import { parseCurrency } from '@/utils/currencyUtils';

interface CPFFormProps {
  onSubmit: (cpf: string, amount?: number) => void;
  isLoading: boolean;
}

export const CPFForm: React.FC<CPFFormProps> = ({ onSubmit, isLoading }) => {
  const [cpf, setCpf] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedCPF = formatCPF(value);
    setCpf(formattedCPF);
    setError('');
  };

  const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedAmount = formatMoney(value);
    setAmount(formattedAmount);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cpf) {
      setError('Por favor, insira seu CPF');
      return;
    }

   /* if (!validateCPF(cpf)) {
      setError('CPF inválido. Verifique os números digitados.');
      toast({
        title: "CPF inválido",
        description: "Por favor, verifique os números digitados.",
        variant: "destructive",
      });
      return;
    }*/

    // Parse amount to number if provided, otherwise pass undefined
    const parsedAmount = amount ? parseCurrency(amount) : undefined;
    
    onSubmit(cpf, parsedAmount);
    toast({
      title: "Buscando ofertas...",
      description: "Estamos consultando os melhores empréstimos para você!",
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const input = e.target;
    let value = input.value.replace(/[^0-9,.]/g, ''); // Permite números, vírgula e ponto
  
    // Se o campo estiver vazio, limpa o estado
    if (value === '') {
      setAmount('');
      return;
    }
  
    // Remove múltiplos pontos ou vírgulas, mantendo apenas o último separador decimal
    value = value.replace(/(\.|,)+/g, match => match.slice(-1));
  
    // Substitui vírgula por ponto para conversão numérica
    value = value.replace(',', '.');
  
    // Converte para número
    let numberValue = parseFloat(value);
  
    // Se o valor não for válido, limpa o estado
    if (isNaN(numberValue)) {
      setAmount('');
      return;
    }
  
    // Limita o valor máximo a 1.000.000,00
    if (numberValue > 1000000) {
      numberValue = 1000000;
    }
  
    // Formata o valor como moeda no padrão brasileiro (BRL)
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numberValue);
  
    // Remove o símbolo "R$" para exibir apenas o valor formatado no input
    const cleanFormattedValue = formattedValue.replace('R$', '').trim();
  
    // Atualiza o valor formatado no estado
    setAmount(cleanFormattedValue);
  
    // Mantém o cursor na posição correta
    const cursorPosition = input.selectionStart;
    setTimeout(() => {
      if (cursorPosition !== null) {
        const newPosition = cursorPosition + (cleanFormattedValue.length - input.value.length);
        input.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };
  
  // Format amount for display (add thousand separators)
  const formatDisplayAmount = (value: string): string => {
    if (!value) return '';
    
    const [integerPart, decimalPart] = value.split('.');
    
    // Add thousand separators
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Join with comma as decimal separator
    return decimalPart !== undefined 
      ? `${formattedInteger},${decimalPart}`
      : formattedInteger;
  };
  
  // Parse display value back to internal format
  const parseDisplayAmount = (displayValue: string): string => {
    return displayValue.replace(/\./g, '').replace(',', '.');
  };
  
  // Handle blur to format the amount
  const handleAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value.replace(/[^0-9]/g, '');
    
    if (value === '') {
      setAmount('');
      return;
    }
    
    // Garante que o valor tenha 2 casas decimais
    const numberValue = (parseFloat(value) / 100).toFixed(2);
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(numberValue));
    
    setAmount(formattedValue);
    input.value = formattedValue; // Atualiza o valor formatado no input
  };
  
  // Handle focus to show raw number for easier editing
  const handleAmountFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value.replace(/[^0-9]/g, '');
    
    if (value) {
      // Mostra o valor sem formatação para facilitar a edição
      input.value = (parseFloat(value) / 100).toFixed(2).replace('.', ',');
      input.select();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Consulte suas opções
        </h3>
        <p className="text-gray-600">
          Digite seu CPF e valor desejado para ver ofertas personalizadas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                CPF
              </Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleInputChange}
                className={`text-lg h-12 mt-1 ${error ? 'border-red-500' : ''}`}
                maxLength={14}
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Valor desejado (opcional)
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0,00"
                  value={amount ? formatMoney(amount) : ''}
                  onChange={handleMoneyChange}
                  className="text-lg h-12 pl-10"
                  disabled={isLoading}
                  inputMode="text"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Deixe em branco para ver todos os valores disponíveis</p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Buscando ofertas...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Buscar Empréstimos
            </>
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Seus dados estão seguros e protegidos
        </p>
      </div>
    </div>
  );
};
