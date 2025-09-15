import { renderHook, act } from '@testing-library/react';
import { useCart } from '@/hooks/useCart';

// Mock du contexte de devise
jest.mock('@/contexts/CurrencyContext', () => ({
  useCurrency: () => ({
    formatPrice: (price: number) => `${price} XAF`,
  }),
}));

describe('useCart Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart());
    
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart());
    
    const product = {
      id: '1',
      name: 'Test Product',
      price_krw: 100000,
      weight: 1,
    };

    act(() => {
      result.current.addItem(product, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart());
    
    const product = {
      id: '1',
      name: 'Test Product',
      price_krw: 100000,
      weight: 1,
    };

    act(() => {
      result.current.addItem(product, 2);
      result.current.removeItem('1');
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it('clears cart', () => {
    const { result } = renderHook(() => useCart());
    
    const product = {
      id: '1',
      name: 'Test Product',
      price_krw: 100000,
      weight: 1,
    };

    act(() => {
      result.current.addItem(product, 2);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });
});
