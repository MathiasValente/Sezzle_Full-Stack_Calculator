import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Calculator } from './Calculator';
import * as api from '../services/api';

// Mock the API client layer
vi.mock('../services/api', () => {
  return {
    calculate: vi.fn(),
    checkHealth: vi.fn().mockResolvedValue(true),
  };
});

describe('Calculator Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('renders initial display values and keypad keys correctly', () => {
    render(<Calculator />);
    
    // Initial display screen starts at '0'
    const screenValue = screen.getByText('0', { selector: '.value-line' });
    expect(screenValue).toBeInTheDocument();
    
    // Expect standard buttons to be present
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('√')).toBeInTheDocument();
    expect(screen.getByText('÷')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
  });

  it('updates screen display as number keys are clicked', () => {
    render(<Calculator />);
    
    const button7 = screen.getByText('7');
    const button5 = screen.getByText('5');
    
    fireEvent.click(button7);
    fireEvent.click(button5);
    
    const display = screen.getByText('75', { selector: '.value-line' });
    expect(display).toBeInTheDocument();
  });

  it('prevents entering multiple decimal points', () => {
    render(<Calculator />);
    
    const button2 = screen.getByText('2');
    const buttonDot = screen.getByText('.');
    const button5 = screen.getByText('5');
    
    fireEvent.click(button2);
    fireEvent.click(buttonDot);
    fireEvent.click(button5);
    fireEvent.click(buttonDot); // second dot (should be ignored)
    
    const display = screen.getByText('2.5', { selector: '.value-line' });
    expect(display).toBeInTheDocument();
  });

  it('clears screen values when pressing Clear (C) button', () => {
    render(<Calculator />);
    
    const button9 = screen.getByText('9');
    const buttonClear = screen.getByText('C');
    
    fireEvent.click(button9);
    expect(screen.getByText('9', { selector: '.value-line' })).toBeInTheDocument();
    
    fireEvent.click(buttonClear);
    expect(screen.getByText('0', { selector: '.value-line' })).toBeInTheDocument();
  });

  it('submits calculation to the API and renders the result upon clicking equals (=)', async () => {
    const mockCalculate = vi.spyOn(api, 'calculate').mockResolvedValueOnce({
      result: 42,
      expression: '12 + 30 = 42',
    });

    render(<Calculator />);
    
    // Enter "12"
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    
    // Click operator "+"
    fireEvent.click(screen.getByText('+'));
    
    // Enter "30"
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('0'));
    
    // Click "="
    fireEvent.click(screen.getByText('='));
    
    // Wait for the mock API call and verify it is triggered with correct payloads
    await waitFor(() => {
      expect(mockCalculate).toHaveBeenCalledWith({
        operator: 'add',
        operand1: 12,
        operand2: 30,
      });
    });

    // Check display value is result "42"
    const display = screen.getByText('42', { selector: '.value-line' });
    expect(display).toBeInTheDocument();

    // Check history shows result
    const historyItem = screen.getByText('12 + 30 = 42', { selector: '.history-item-exp' });
    expect(historyItem).toBeInTheDocument();
  });
});
