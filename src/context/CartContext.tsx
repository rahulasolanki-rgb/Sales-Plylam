import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '../types';
import { apiProxy } from '../apiProxy';
import { env } from '../config/env';
import { isSalesUser } from '../utils/profile';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  pricingType?: number;
  customer?: Cart["customer"];
  customerId?: number | null;
  selectedCustomerName?: string | null;
  selectedCustomerPricingType?: number | null;
  setCustomerId: (id: number | null, name?: string | null, pricingType?: number | null) => void;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  getItemQuantity: (productId: string) => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [pricingType, setPricingType] = useState<number | undefined>(undefined);
  const [customer, setCustomer] = useState<Cart["customer"] | undefined>(undefined);
  const [customerId, setCustomerIdState] = useState<number | null>(() => {
    const stored = localStorage.getItem("selected_customer_id");
    return stored ? Number(stored) : null;
  });
  const [selectedCustomerName, setSelectedCustomerNameState] = useState<string | null>(() => {
    return localStorage.getItem("selected_customer_name");
  });
  const [selectedCustomerPricingType, setSelectedCustomerPricingTypeState] = useState<number | null>(() => {
    const stored = localStorage.getItem("selected_customer_pricing_type");
    return stored ? Number(stored) : null;
  });

  const persistCustomerName = (name: string | null) => {
    setSelectedCustomerNameState(name);
    if (name) {
      localStorage.setItem("selected_customer_name", name);
    } else {
      localStorage.removeItem("selected_customer_name");
    }
  };

  const persistCustomerPricingType = (type: number | null) => {
    setSelectedCustomerPricingTypeState(type);
    if (type !== null) {
      localStorage.setItem("selected_customer_pricing_type", String(type));
    } else {
      localStorage.removeItem("selected_customer_pricing_type");
    }
  };

  const setCustomerId = (id: number | null, name?: string | null, pricingType?: number | null) => {
    setCustomerIdState(id);
    if (id) {
      localStorage.setItem("selected_customer_id", String(id));
    } else {
      localStorage.removeItem("selected_customer_id");
    }
    if (name !== undefined) {
      persistCustomerName(name);
    } else if (id === null) {
      persistCustomerName(null);
    }
    if (pricingType !== undefined) {
      persistCustomerPricingType(pricingType);
    } else if (id === null) {
      persistCustomerPricingType(null);
    }
  };

  const refreshCart = async () => {
    try {
      if (isSalesUser() && !customerId) {
        setCartItems([]);
        setCartTotal(0);
        setPricingType(undefined);
        setCustomer(undefined);
        return;
      }
      const cart = await apiProxy.getCart(customerId ?? undefined);
      setCartItems(cart.items ?? []);
      setCartTotal(Number(cart.total ?? 0));
      setPricingType(cart.pricing_type);
      setCustomer(cart.customer);
      persistCustomerName(cart.customer?.name ?? null);
      persistCustomerPricingType(cart.customer?.pricing_type ?? null);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(env.AUTH_TOKEN_KEY);
    const salesUser = isSalesUser();
    if (!token || (salesUser && !customerId)) {
      setCartItems([]);
      setCartTotal(0);
      setPricingType(undefined);
      setCustomer(undefined);
      return;
    }
    refreshCart();
  }, [customerId]);

  const addToCart = async (productId: string, quantity: number) => {
    await apiProxy.addToCart(productId, quantity, customerId ?? undefined);
    await refreshCart();
  };

  const removeFromCart = async (productId: string) => {
    await apiProxy.removeFromCart(productId, customerId ?? undefined);
    await refreshCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
    } else {
      await apiProxy.addToCart(productId, quantity);
      await refreshCart();
    }
  };

  const getItemQuantity = (productId: string) => {
    const item = cartItems.find((i) => i.product_id === productId);
    return item ? item.quantity : 0;
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        pricingType,
        customer,
        customerId,
        setCustomerId,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        refreshCart,
        selectedCustomerName,
        selectedCustomerPricingType,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
