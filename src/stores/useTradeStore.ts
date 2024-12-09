import { create } from 'zustand';

interface TradeStore {
  price: string;
  amount: string;
  side: 'buy' | 'sell' | null;
  setPrice: (price: string) => void;
  setAmount: (amount: string) => void;
  setSide: (side: 'buy' | 'sell' | null) => void;
}

export const useTradeStore = create<TradeStore>((set) => ({
  price: '',
  amount: '',
  side: null,
  setPrice: (price) => set({ price }),
  setAmount: (amount) => set({ amount }),
  setSide: (side) => set({ side }),
}));