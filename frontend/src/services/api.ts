export interface CalculateRequest {
  operator: 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'sqrt' | 'percentage';
  operand1: number;
  operand2?: number;
}

export interface CalculateResponse {
  result: number;
  expression: string;
}

export interface ErrorResponse {
  error: string;
}

// Allow setting VITE_API_URL in development, fallback to localhost:8080
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Sends a calculation request to the backend microservice.
 * @param req CalculateRequest payload
 * @returns CalculateResponse result and expression
 */
export async function calculate(req: CalculateRequest): Promise<CalculateResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    const data = await response.json();

    if (!response.ok) {
      // Cast response to ErrorResponse structure
      const errorData = data as ErrorResponse;
      throw new Error(errorData.error || 'An unexpected error occurred on the server.');
    }

    return data as CalculateResponse;
  } catch (error: any) {
    // If it's already a server-side error with custom message, forward it
    if (error.message && !error.message.includes('fetch')) {
      throw error;
    }
    // Network/fetch errors
    throw new Error('Connection failed: Cannot reach the backend calculator service. Make sure it is running on ' + API_BASE);
  }
}

/**
 * Checks the health of the backend microservice.
 * @returns true if backend is online and healthy
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
    });
    if (response.ok) {
      const data = await response.json();
      return data.status === 'healthy';
    }
    return false;
  } catch {
    return false;
  }
}
