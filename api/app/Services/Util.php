<?php

namespace App\Services;

use NumberFormatter;
use Illuminate\Support\Facades\Http;

class Util
{
    function apenasNumeros($string) {
        return preg_replace('/[^0-9]/', '', $string);
    }

    function convertToFloat($valorSolicitado) {
        if (is_numeric($valorSolicitado)) {
            $float = floatval($valorSolicitado);
            return $float;
        } else {
            return null;
        }
    }

    function calculatePayment(float $valorSolicitado, array $offer): array {
        // Extrai valores do array
        $qntParcelaMin = $offer['QntParcelaMin'];
        $jurosMes = $offer['jurosMes'];

        // Calcula o valor total com juros compostos
        $valorTotal = $valorSolicitado * pow(1 + $jurosMes, $qntParcelaMin);

        // Calcula o valor da parcela
        $valorParcela = $valorTotal / $qntParcelaMin;

       return array_merge($offer, [
            'valorSolicitadoSemFormato' => $this->convertToFloat($valorSolicitado),
            'valorSolicitado' => $this->formatCurrency($valorSolicitado),
            'parcelas' => $qntParcelaMin,
            'valorTotal' => $this->formatCurrency($valorTotal),
            'valorParcela' => $this->formatCurrency($valorParcela)
        ]);
    }

    function formatCurrency(float $value, string $currency = 'BRL', int $decimals = 2): string {
        // Define currency format based on locale
        $formatter = new NumberFormatter('pt_BR', NumberFormatter::CURRENCY);
        $formatter->setAttribute(NumberFormatter::FRACTION_DIGITS, $decimals);

        // Format the value
        return $formatter->formatCurrency($value, $currency);
    }

    function cleanCurrencyToFloat(string $value): float {
        // Remove currency symbol (R$), spaces, and thousands separators (.)
        $cleaned = preg_replace('/[R$\s]/u', '', $value);
        if (strpos($value, '.') !== false && strpos($value, ',') !== false) {
            $cleaned = str_replace('.', '', $cleaned);
        }
        $cleaned = str_replace(',', '.', $cleaned);
        // Convert to float
        return floatval($cleaned);
    }

    function generateRandomNumber($min = 0.025, $max = 2.1251)
    {
        return $min + mt_rand() / mt_getrandmax() * ($max - $min);
    }
}
