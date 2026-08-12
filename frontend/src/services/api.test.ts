import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculate, checkHealth } from '../services/api';
vi.stubGlobal('fetch', vi.fn());

describe('API Client Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('sends correct request payload and returns data for success calculations', async () => {
    const mockResponse = { result: 15, expression: '10 + 5 = 15' };
    
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await calculate({
      operator: 'add',
      operand1: 10,
      operand2: 5,
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operator: 'add',
        operand1: 10,
        operand2: 5,
      }),
    });
    expect(result).toEqual(mockResponse);
  });

  it('throws descriptive error on server validation failures (e.g. 400 Bad Request)', async () => {
    const mockErrorResponse = { error: 'cannot divide by zero' };
    
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrorResponse,
    });

    await expect(
      calculate({
        operator: 'divide',
        operand1: 10,
        operand2: 0,
      })
    ).rejects.toThrow('cannot divide by zero');
  });

  it('throws network downtime error if server is unreachable', async () => {
    (fetch as any).mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(
      calculate({
        operator: 'add',
        operand1: 1,
        operand2: 2,
      })
    ).rejects.toThrow('Connection failed: Cannot reach the backend calculator service');
  });

  it('correctly assesses backend health check as true on 200 OK', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'healthy' }),
    });

    const healthy = await checkHealth();
    expect(healthy).toBe(true);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/health', {
      method: 'GET',
    });
  });

  it('correctly assesses backend health check as false on failure', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const healthy = await checkHealth();
    expect(healthy).toBe(false);
  });
});
