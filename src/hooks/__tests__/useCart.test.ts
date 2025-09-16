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
    
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.getCartCount()).toBe(0);
    expect(result.current.getCartTotal()).toBe(0);
  });

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart());
    
    const product = {
      id: '1',
      name: 'Test Product',
      price_krw: 100000,
      category: 'test',
    };

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.getCartCount()).toBe(2);
    expect(result.current.cartItems[0].quantity).toBe(2);
  });

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart());
    
    const product = {
      id: '1',
      name: 'Test Product',
      price_krw: 100000,
      category: 'test',
    };

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
      result.current.removeFromCart('1');
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.getCartCount()).toBe(0);
  });

  it('clears cart', () => {
    const { result } = renderHook(() => useCart());
    
    const product = {
      id: '1',
      name: 'Test Product',
      price_krw: 100000,
      category: 'test',
    };

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
      result.current.clearCart();
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.getCartCount()).toBe(0);
  });
});
