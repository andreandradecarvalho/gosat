
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bank } from '@/pages/Index';
import { DollarSign, Calendar, Percent, CreditCard, Calculator, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface SimulationModalProps {
  bank: Bank;
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  bank,
  isOpen,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleLoanApplication = async () => {
    try {
      setIsSubmitting(true);
      // Here you would typically redirect to the loan application page or show a form
      toast({
        title: 'Solicitação de empréstimo',
        description: 'Você será redirecionado para a página de solicitação de empréstimo.',
        variant: 'default',
      });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erro ao processar solicitação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível processar sua solicitação. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return (value).toFixed(2) + '%';
  };

  // Calcular exemplo de prestação usando valorSolicitadoSemFormato e parcelas
  const calculateSampleInstallment = () => {
    // Verifica se bank e bank.simulation existem
    if (!bank || !bank.simulation) {
        return { prestacao: 0, parcelas: 0, valor: 0, valorTotal: 0 };
    }

    const { valorSolicitadoSemFormato, parcelas, jurosMes } = bank.simulation;

    // Validações adicionais
    if (
        valorSolicitadoSemFormato === undefined ||
        parcelas === undefined ||
        jurosMes === undefined ||
        valorSolicitadoSemFormato <= 0 ||
        parcelas <= 0 ||
        jurosMes < 0
    ) {
        return { prestacao: 0, parcelas: 0, valor: 0, valorTotal: 0 };
    }

    const taxa = jurosMes;
    const valor = valorSolicitadoSemFormato;
    const numParcelas = parcelas;

    // Cálculo da prestação com arredondamento
    const prestacao = valor * (taxa * Math.pow(1 + taxa, numParcelas)) / (Math.pow(1 + taxa, numParcelas) - 1);
    const prestacaoArredondada = isNaN(prestacao) ? 0 : Number(prestacao.toFixed(2));
    const valorTotal = prestacaoArredondada * numParcelas;

    console.log('valor', valor);
    console.log('parcelas', parcelas);
    console.log('taxa', taxa);
console.log('prestacao', prestacao);
console.log('prestacaoArredondada', prestacaoArredondada);
console.log('valorTotal', valorTotal);
    return {
        prestacao: prestacaoArredondada,
        parcelas: numParcelas,
        valor: valor,
        valorTotal: Number(valorTotal.toFixed(2)) // Arredonda o valor total também
    };
};
console.log('---------------');
console.log(bank.simulation.jurosMes);
console.log('---------------');
  const sampleCalculation = calculateSampleInstallment();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{bank.logo || '🏦'}</span>
            <div>
              <h3 className="text-xl font-bold">Detalhes da Simulação</h3>
              <p className="text-sm text-gray-600">{bank.nome}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Confira os detalhes da simulação de empréstimo
          </DialogDescription>
        </DialogHeader>

        {/* Modalidades disponíveis */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Modalidades disponíveis:</h4>
          <div className="flex flex-wrap gap-2">
            {bank.modalidades.map((modalidade, index) => (
              <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                <CreditCard className="h-3 w-3 mr-1" />
                {modalidade.nome}
              </Badge>
            ))}
          </div>
        </div>

        {/* Informações da Simulação */}
        {bank.simulation && (
          <div className="space-y-6">
            {/* Valores Disponíveis */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Valores Disponíveis
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Valor mínimo</p>
                  <p className="font-bold text-green-600 text-lg">{formatCurrency(bank.simulation.valorMin)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Valor máximo</p>
                  <p className="font-bold text-green-600 text-lg">{formatCurrency(bank.simulation.valorMax)}</p>
                </div>
              </div>
            </div>

            {/* Opções de Parcelas */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Opções de Parcelas
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Mínimo</p>
                  <p className="font-bold text-blue-600 text-lg">{bank.simulation.QntParcelaMin}x</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Máximo</p>
                  <p className="font-bold text-blue-600 text-lg">{bank.simulation.QntParcelaMax}x</p>
                </div>
              </div>
            </div>

            {/* Taxa de Juros */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Percent className="h-4 w-4 text-purple-600" />
                Taxa de Juros
              </h4>
              <div className="text-center">
                <p className="text-xs text-gray-600">Taxa mensal</p>
                <p className="font-bold text-purple-600 text-2xl">{formatPercentage(bank.simulation.jurosMes)}</p>
              </div>
            </div>

            {/* Exemplo de Prestação */}
               <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-gray-600" />
                  Exemplo de Prestação
                </h4>
                <div className="text-center space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Empréstimo de {formatCurrency(sampleCalculation.valor)}</p>
                    <p className="text-xs text-gray-600">em {sampleCalculation.parcelas} parcelas</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(sampleCalculation.prestacao)}
                    </p>
                    <p className="text-xs text-gray-500">por mês*</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-lg font-bold text-gray-800">
                      {formatCurrency(sampleCalculation.valorTotal)}
                    </p>
                    <p className="text-xs text-gray-500">valor total*</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    *Valores aproximados para simulação
                  </p>
                </div>
              </div>
         
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Fechar
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            onClick={handleLoanApplication}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Solicitar Empréstimo'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
