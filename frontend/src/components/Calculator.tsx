import React, { useState, useEffect } from 'react';
import { calculate, checkHealth } from '../services/api';
import type { CalculateRequest } from '../services/api';
import { 
  Trash2, 
  RotateCcw
} from 'lucide-react';

interface HistoryItem {
  id: string;
  expression: string;
  result: number;
}

export const Calculator: React.FC = () => {
  // Calculator States
  const [input, setInput] = useState<string>('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<CalculateRequest['operator'] | null>(null);
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  
  // History States
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Track the physical active buttons for visual keyboard feedback
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  // Load history from LocalStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calc_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse calculation history', e);
      }
    }

    // Perform initial health check
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 10000); // Check health every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    const healthy = await checkHealth();
    setIsOnline(healthy);
  };

  // Helper: map operators to readable display characters
  const getOperatorSymbol = (op: CalculateRequest['operator'] | null): string => {
    switch (op) {
      case 'add': return '+';
      case 'subtract': return '-';
      case 'multiply': return '×';
      case 'divide': return '÷';
      case 'power': return '^';
      default: return '';
    }
  };

  // Digital Screen Display Helper
  const getScreenExpression = (): string => {
    if (expression) return expression;
    if (prevValue !== null && operator) {
      return `${prevValue} ${getOperatorSymbol(operator)}`;
    }
    return '';
  };

  const getScreenValue = (): string => {
    if (loading) return 'Calculating...';
    if (error) return 'Error';
    if (input) return input;
    if (result !== null) return result.toString();
    return '0';
  };

  // 1. Digit / Decimal Inputs
  const handleDigit = (digit: string) => {
    setError(null);
    setResult(null);

    if (digit === '.') {
      if (input.includes('.')) return; // Prevent multiple decimal points
      if (input === '') {
        setInput('0.');
        return;
      }
    }

    // Limit length to keep display visually aligned
    if (input.length >= 15) return;

    setInput((prev) => prev + digit);
  };

  // 2. Clear State
  const handleClear = () => {
    setInput('');
    setPrevValue(null);
    setOperator(null);
    setExpression('');
    setResult(null);
    setError(null);
    setLoading(false);
  };

  // 3. Delete Backspace
  const handleDelete = () => {
    setError(null);
    if (input) {
      setInput((prev) => prev.slice(0, -1));
    }
  };

  // 4. Binary Operator Handler (+, -, *, /, ^)
  const handleOperator = async (op: CalculateRequest['operator']) => {
    setError(null);
    
    // Evaluate if we are chaining operations (e.g. "5 + 3 * 2")
    if (input !== '' && prevValue !== null && operator) {
      await handleEvaluate(op);
      return;
    }

    let baseValue = 0;
    if (input !== '') {
      baseValue = parseFloat(input);
    } else if (result !== null) {
      baseValue = result; // Continue using previous result
    } else {
      return; // No input to apply operator to
    }

    setPrevValue(baseValue);
    setOperator(op);
    setResult(null);
    setInput('');
    setExpression(`${baseValue} ${getOperatorSymbol(op)}`);
  };

  // 5. Unary operations (Square Root, Percentage)
  const handleUnaryOp = async (op: 'sqrt' | 'percentage') => {
    setError(null);
    let val = 0;
    
    if (input !== '') {
      val = parseFloat(input);
    } else if (result !== null) {
      val = result;
    } else {
      return;
    }

    setLoading(true);
    try {
      let reqPayload: CalculateRequest;

      if (op === 'percentage' && prevValue !== null) {
        // Percentage of base, e.g. 10% of 500
        reqPayload = {
          operator: 'percentage',
          operand1: val,
          operand2: prevValue
        };
      } else {
        reqPayload = {
          operator: op,
          operand1: val
        };
      }

      const res = await calculate(reqPayload);
      
      // If we performed a percent calculation as part of a running equation (like 200 + 10%):
      // The result of 10% of 200 is 20. We want to put 20 as the current input so user can press =
      if (op === 'percentage' && prevValue !== null) {
        setInput(res.result.toString());
        setExpression(`${prevValue} ${getOperatorSymbol(operator)} ${res.result}`);
      } else {
        // Standard root/percentage: makes it the final result immediately
        setResult(res.result);
        setExpression(res.expression);
        setInput('');
        setPrevValue(null);
        setOperator(null);
        
        // Add to history
        addHistoryItem(res.expression, res.result);
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // 6. Evaluate Expression (=)
  const handleEvaluate = async (nextOperator: CalculateRequest['operator'] | null = null) => {
    if (prevValue === null || !operator || input === '') return;

    setLoading(true);
    setError(null);

    const currentOperand2 = parseFloat(input);

    try {
      const payload: CalculateRequest = {
        operator,
        operand1: prevValue,
        operand2: currentOperand2
      };

      const res = await calculate(payload);

      if (nextOperator) {
        // Chained operator scenario: result becomes the next prevValue
        setPrevValue(res.result);
        setOperator(nextOperator);
        setResult(null);
        setInput('');
        setExpression(`${res.result} ${getOperatorSymbol(nextOperator)}`);
      } else {
        // Final evaluation
        setResult(res.result);
        setExpression(res.expression);
        setPrevValue(null);
        setOperator(null);
        setInput('');
      }

      // Add to history
      addHistoryItem(res.expression, res.result);
    } catch (err: any) {
      setError(err.message || 'Calculation error');
    } finally {
      setLoading(false);
    }
  };

  // History management utilities
  const addHistoryItem = (exp: string, val: number) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: exp,
      result: val,
    };
    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 20); // Keep last 20 calculations
      localStorage.setItem('calc_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calc_history');
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setError(null);
    setResult(item.result);
    setExpression(item.expression);
    setInput('');
    setPrevValue(null);
    setOperator(null);
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      // Visual feedback mapping
      let feedbackKey = key;
      if (key === 'Enter') feedbackKey = '=';
      if (key === 'Escape') feedbackKey = 'c';
      if (key === '*') feedbackKey = 'x';
      if (key === '/') feedbackKey = '/';
      setPressedKey(feedbackKey);

      // Digits & Dot
      if (/^[0-9.]$/.test(key)) {
        handleDigit(key);
      }
      // Operators
      else if (key === '+') {
        handleOperator('add');
      } else if (key === '-') {
        handleOperator('subtract');
      } else if (key === '*') {
        handleOperator('multiply');
      } else if (key === '/') {
        e.preventDefault(); // Prevent quick find shortcut in some browsers
        handleOperator('divide');
      } else if (key === '^') {
        handleOperator('power');
      } else if (key === '%') {
        handleUnaryOp('percentage');
      }
      // Equal / Enter
      else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEvaluate();
      }
      // Backspace
      else if (key === 'Backspace') {
        handleDelete();
      }
      // Escape (Clear)
      else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [input, prevValue, operator, result]);

  return (
    <div className="app-container">
      {/* 1. Calculator Core Box */}
      <div className="calculator glass-panel">
        {/* Health status header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
          <span style={{ color: isOnline ? '#4ade80' : '#f87171', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: isOnline ? '#4ade80' : '#f87171',
              boxShadow: isOnline ? '0 0 8px #4ade80' : '0 0 8px #f87171'
            }} />
            {isOnline ? 'Backend Online' : 'Backend Offline'}
          </span>
          <span style={{ color: 'var(--color-text-dim)' }}>React & Go Math Engine</span>
        </div>

        {/* Screen Display */}
        <div className={`display-screen ${loading ? 'calculating' : ''}`}>
          {loading && <div className="loading-indicator" />}
          <div className="expression-line">{getScreenExpression()}</div>
          <div className="value-line">{getScreenValue()}</div>
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Keypad Layout */}
        <div className="keypad">
          {/* Row 1 */}
          <button 
            onClick={handleClear} 
            className={`calc-btn danger ${pressedKey === 'c' ? 'pressed' : ''}`}
            title="Clear (Esc)"
          >
            C
          </button>
          <button 
            onClick={() => handleOperator('power')} 
            className={`calc-btn operator ${pressedKey === '^' ? 'pressed' : ''}`}
            title="Power (^)"
          >
            xʸ
          </button>
          <button 
            onClick={() => handleUnaryOp('sqrt')} 
            className={`calc-btn operator ${pressedKey === 's' ? 'pressed' : ''}`}
            title="Square Root"
          >
            √
          </button>
          <button 
            onClick={() => handleOperator('divide')} 
            className={`calc-btn operator ${pressedKey === '/' ? 'pressed' : ''}`}
            title="Divide (/)"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button 
            onClick={() => handleDigit('7')} 
            className={`calc-btn ${pressedKey === '7' ? 'pressed' : ''}`}
          >
            7
          </button>
          <button 
            onClick={() => handleDigit('8')} 
            className={`calc-btn ${pressedKey === '8' ? 'pressed' : ''}`}
          >
            8
          </button>
          <button 
            onClick={() => handleDigit('9')} 
            className={`calc-btn ${pressedKey === '9' ? 'pressed' : ''}`}
          >
            9
          </button>
          <button 
            onClick={() => handleOperator('multiply')} 
            className={`calc-btn operator ${pressedKey === 'x' ? 'pressed' : ''}`}
            title="Multiply (*)"
          >
            ×
          </button>

          {/* Row 3 */}
          <button 
            onClick={() => handleDigit('4')} 
            className={`calc-btn ${pressedKey === '4' ? 'pressed' : ''}`}
          >
            4
          </button>
          <button 
            onClick={() => handleDigit('5')} 
            className={`calc-btn ${pressedKey === '5' ? 'pressed' : ''}`}
          >
            5
          </button>
          <button 
            onClick={() => handleDigit('6')} 
            className={`calc-btn ${pressedKey === '6' ? 'pressed' : ''}`}
          >
            6
          </button>
          <button 
            onClick={() => handleOperator('subtract')} 
            className={`calc-btn operator ${pressedKey === '-' ? 'pressed' : ''}`}
            title="Subtract (-)"
          >
            -
          </button>

          {/* Row 4 */}
          <button 
            onClick={() => handleDigit('1')} 
            className={`calc-btn ${pressedKey === '1' ? 'pressed' : ''}`}
          >
            1
          </button>
          <button 
            onClick={() => handleDigit('2')} 
            className={`calc-btn ${pressedKey === '2' ? 'pressed' : ''}`}
          >
            2
          </button>
          <button 
            onClick={() => handleDigit('3')} 
            className={`calc-btn ${pressedKey === '3' ? 'pressed' : ''}`}
          >
            3
          </button>
          <button 
            onClick={() => handleOperator('add')} 
            className={`calc-btn operator ${pressedKey === '+' ? 'pressed' : ''}`}
            title="Add (+)"
          >
            +
          </button>

          {/* Row 5 */}
          <button 
            onClick={handleDelete} 
            className="calc-btn"
            title="Backspace"
          >
            ⌫
          </button>
          <button 
            onClick={() => handleDigit('0')} 
            className={`calc-btn ${pressedKey === '0' ? 'pressed' : ''}`}
          >
            0
          </button>
          <button 
            onClick={() => handleDigit('.')} 
            className={`calc-btn ${pressedKey === '.' ? 'pressed' : ''}`}
          >
            .
          </button>
          <button 
            onClick={() => handleUnaryOp('percentage')} 
            className={`calc-btn operator ${pressedKey === '%' ? 'pressed' : ''}`}
            title="Percentage (%)"
          >
            %
          </button>

          {/* Row 6 */}
          <button 
            onClick={handleClearHistory} 
            className="calc-btn"
            style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}
            title="Clear Saved History"
          >
            Reset H
          </button>
          <button 
            onClick={() => handleEvaluate()} 
            className={`calc-btn equals ${pressedKey === '=' ? 'pressed' : ''}`}
            title="Calculate (Enter)"
          >
            =
          </button>
        </div>
      </div>

      {/* 2. Calculator History Sidebar */}
      <div className="history-panel glass-panel">
        <div className="history-header">
          <h2>
            <RotateCcw size={18} />
            History
          </h2>
          <button 
            onClick={handleClearHistory} 
            className="clear-history-btn"
            disabled={history.length === 0}
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="empty-history">
              <span>No history yet</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                Perform some calculations to save them here.
              </span>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className="history-item"
                onClick={() => handleLoadHistory(item)}
                title="Click to restore to calculator"
              >
                <div className="history-item-exp">{item.expression}</div>
                <div className="history-item-val">{item.result}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
