
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, ArrowUpDown, GitCompare } from 'lucide-react';

interface LoanFiltersProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  maxAmountFilter: string;
  setMaxAmountFilter: (value: string) => void;
  maxRateFilter: string;
  setMaxRateFilter: (value: string) => void;
  modalityFilter: string;
  setModalityFilter: (value: string) => void;
  onClearFilters: () => void;
  onOpenComparison: () => void;
  comparisonCount: number;
}

export const LoanFilters: React.FC<LoanFiltersProps> = ({
  sortBy,
  setSortBy,
  maxAmountFilter,
  setMaxAmountFilter,
  maxRateFilter,
  setMaxRateFilter,
  modalityFilter,
  setModalityFilter,
  onClearFilters,
  onOpenComparison,
  comparisonCount,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Ordenação
          </div>
          {comparisonCount > 0 && (
            <Button 
              onClick={onOpenComparison}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <GitCompare className="h-4 w-4" />
              Comparar ({comparisonCount})
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Ordenação */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Ordenar por
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="most-advantageous">⭐ Mais vantajosa</SelectItem>
                <SelectItem value="rate-asc">Menor taxa</SelectItem>
                <SelectItem value="rate-desc">Maior taxa</SelectItem>
                <SelectItem value="amount-asc">Menor valor</SelectItem>
                <SelectItem value="amount-desc">Maior valor</SelectItem>
                <SelectItem value="approval">Aprovação mais rápida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por modalidade */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Tipo de crédito
            </label>
            <Select value={modalityFilter} onValueChange={setModalityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="pessoal">Crédito pessoal</SelectItem>
                <SelectItem value="consignado">Crédito consignado</SelectItem>
                <SelectItem value="13">Antecipação 13º</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por valor máximo */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Valor máximo (R$)
            </label>
            <Input
              type="number"
              placeholder="Ex: 50000"
              value={maxAmountFilter}
              onChange={(e) => setMaxAmountFilter(e.target.value)}
            />
          </div>

          {/* Filtro por taxa máxima */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Taxa máxima (% a.m.)
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="Ex: 3.5"
              value={maxRateFilter}
              onChange={(e) => setMaxRateFilter(e.target.value)}
            />
          </div>

          {/* Botão limpar filtros */}
          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={onClearFilters}
              className="w-full"
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
