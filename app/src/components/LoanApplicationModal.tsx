
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bank } from '@/pages/Index';
import { formatCPF, validateCPF } from '@/utils/cpfUtils';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Calendar, Percent, CheckCircle } from 'lucide-react';

interface SimulationData {
  QntParcelaMin: number;
  QntParcelaMax: number;
  valorMin: number;
  valorMax: number;
  jurosMes: number;
  valorSolicitadoSemFormato: number;
  valorSolicitado: string;
  parcelas: number;
  valorTotal: string;
  valorParcela: string;
}

interface LoanApplicationModalProps {
  bank: Bank;
  userCpf: string;
  isOpen: boolean;
  onClose: () => void;
  simulationData?: SimulationData | null;
}

export const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({
  bank,
  userCpf,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: userCpf,
    amount: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'cpf') {
      value = formatCPF(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Valor é obrigatório';
    } else {
      const amount = parseFloat(formData.amount.replace(/\D/g, ''));
      if (bank.minAmount && amount < bank.minAmount) {
        newErrors.amount = `Valor mínimo: ${formatCurrency(bank.minAmount)}`;
      } else if (bank.maxAmount && amount > bank.maxAmount) {
        newErrors.amount = `Valor máximo: ${formatCurrency(bank.maxAmount)}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simular envio da solicitação
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Solicitação enviada!",
        description: "Você receberá uma resposta em até 24 horas.",
      });
      onClose();
    }, 2000);
  };

  const handleAmountChange = (value: string) => {
    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    // Formata como moeda
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(numbers) / 100 || 0);
    
    handleInputChange('amount', formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{bank.logo}</span>
            <div>
              <h3 className="text-xl font-bold">Solicitar Empréstimo</h3>
              <p className="text-sm text-gray-600">{bank.nome}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para solicitar seu empréstimo
          </DialogDescription>
        </DialogHeader>

        {/* Informações do Empréstimo */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-800 mb-3">Detalhes da Oferta</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Taxa de juros</p>
                <p className="font-bold text-green-600">
                  {simulationData ? (simulationData.jurosMes * 100).toFixed(2) : bank.interestRate || '0.00'}% a.m.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Parcelas</p>
                <p className="font-medium">
                  {simulationData ? 
                    `${simulationData.QntParcelaMin}x - ${simulationData.QntParcelaMax}x` : 
                    `Até ${bank.installments || 0}x`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Valor mínimo</p>
                <p className="font-medium">
                  {simulationData ? 
                    `R$ ${simulationData.valorMin.toFixed(2).replace('.', ',')}` : 
                    (bank.minAmount ? formatCurrency(bank.minAmount) : 'R$ 0,00')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Valor máximo</p>
                <p className="font-medium">
                  {simulationData ? 
                    `R$ ${simulationData.valorMax.toFixed(2).replace('.', ',')}` : 
                    (bank.maxAmount ? formatCurrency(bank.maxAmount) : 'R$ 0,00')}
                </p>
              </div>
            </div>
            
            {simulationData?.valorParcela && (
              <div className="flex items-center gap-2 col-span-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Valor da Parcela</p>
                  <p className="font-bold text-blue-600">{simulationData.valorParcela}</p>
                </div>
              </div>
            )}
            
            {simulationData?.valorTotal && (
              <div className="flex items-center gap-2 col-span-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Valor Total</p>
                  <p className="font-bold text-green-600">{simulationData.valorTotal}</p>
                </div>
              </div>
            )}
          </div>

          {bank.featured && (
            <Badge className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
              ⭐ Oferta Especial
            </Badge>
          )}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) => handleInputChange('cpf', e.target.value)}
              className={errors.cpf ? 'border-red-500' : ''}
              maxLength={14}
              disabled={isSubmitting}
            />
            {errors.cpf && <p className="text-sm text-red-500">{errors.cpf}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor Desejado *</Label>
            <Input
              id="amount"
              type="text"
              placeholder="R$ 0,00"
              value={formData.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={errors.amount ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            <p className="text-xs text-gray-500">
              Entre {formatCurrency(bank.minAmount)} e {formatCurrency(bank.maxAmount)}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Enviar Solicitação
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          🔒 Seus dados estão seguros e protegidos
        </div>
      </DialogContent>
    </Dialog>
  );
};
