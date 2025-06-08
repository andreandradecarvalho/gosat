// Using environment variables for API configuration
console.log('Environment Variables:', import.meta.env);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('VITE_API_TOKEN:', import.meta.env.VITE_API_TOKEN);

// Get API configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '39IJeoyMzMNPoPSgbNwMV1i5vYGL0JSl4Lw2KCVmAYk3BINVkSWgJi4EXYHRnNfn';

export interface ConsultaOfertasPayload {
  cpf: string;
  valor?: number;
}

export interface OfertaCredito {
  // Identificação
  id?: number;
  
  // Dados da instituição
  instituicao: string;
  
  // Valores e taxas
  valorMin: number;
  valorMax: number;
  jurosMes: number;
  
  // Parcelas
  qntParcelaMin: number;
  qntParcelaMax: number;
  
  // Informações adicionais
  modalidade?: string;
  codModalidade?: string;
  
  // Outros campos que podem ser retornados pela API
  [key: string]: unknown;
}

interface ApiError extends Error {
  status?: number;
  response?: Record<string, unknown>;
}

export const consultaOfertasDeCredito = async ({ cpf, valor }: ConsultaOfertasPayload): Promise<{ data: { ofertas: OfertaCredito[] } }> => {
  const url = `${API_BASE_URL}/consulta-ofertas-de-credito`;
  const requestBody = {
    cpf: cpf.replace(/[^\d]/g, ''), // Remove formatting
    ...(valor && { valor }), // Only include valor if it's provided
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify(requestBody),
    credentials: 'same-origin' as const,
  };

  console.log('Request Options:', requestOptions);

  console.group('API Request');
  console.log('URL:', url);
  console.log('Method:', 'POST');
  console.log('Headers:', requestOptions.headers);
  console.log('Body:', requestBody);
  console.groupEnd();

  try {
    const response = await fetch(url, requestOptions);
    
    let responseData;
    const contentType = response.headers.get('content-type');
    
    // Log response details
    console.group('API Response');
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    try {
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        responseData = { message: text };
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      const errorText = await response.text().catch(() => 'Failed to read response body');
      console.log('Response body:', errorText);
      responseData = { message: errorText };
    }
    console.groupEnd();

    if (!response.ok) {
      const error = new Error(responseData.message || `HTTP error! status: ${response.status}`) as ApiError;
      error.status = response.status;
      error.response = responseData;
      throw error;
    }

    return responseData;
  } catch (error) {
    const apiError = error as ApiError;
    
    console.group('API Error');
    console.error('Error details:', {
      name: apiError.name,
      message: apiError.message,
      status: apiError.status,
      response: apiError.response,
      stack: apiError.stack,
    });
    console.groupEnd();
    
    throw new Error(apiError.message || 'Erro ao consultar ofertas');
  }
};
