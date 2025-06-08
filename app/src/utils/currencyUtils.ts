/**
 * Parses a currency string (like "1.234,56") into a number (1234.56)
 * @param value The currency string to parse
 * @returns The parsed number or NaN if invalid
 */
export const parseCurrency = (value: string): number => {
  if (!value) return NaN;
  
  // Remove all non-digit characters except the last comma or dot
  const cleanValue = value.replace(/[^\d,.]/g, '');
  
  // Handle both comma and dot as decimal separators
  const parts = cleanValue.split(/[.,]/);
  
  if (parts.length > 2) {
    // More than one separator found, invalid format
    return NaN;
  }
  
  // Join integer part and add decimal part if it exists
  const integerPart = parts[0].replace(/\D/g, '');
  const decimalPart = parts[1] ? parts[1].substring(0, 2) : '00';
  
  const numberValue = parseFloat(`${integerPart}.${decimalPart}`);
  return isNaN(numberValue) ? NaN : numberValue;
};

/**
 * Formats a number as a currency string
 * @param value The number to format
 * @returns Formatted currency string (e.g., "1.234,56")
 */
export const formatCurrency = (value: number): string => {
  if (isNaN(value)) return '';
  
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
