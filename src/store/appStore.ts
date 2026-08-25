import { create } from 'zustand';

interface AppState {
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  quickViewProductId: string | null;
  setQuickViewProductId: (id: string | null) => void;
  currency: 'USD' | 'UZS';
  setCurrency: (currency: 'USD' | 'UZS') => void;
}

export const useAppStore = create<AppState>((set) => ({
  isCartOpen: false,
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  quickViewProductId: null,
  setQuickViewProductId: (id) => set({ quickViewProductId: id }),
  currency: 'USD',
  setCurrency: (currency) => set({ currency }),
}));
