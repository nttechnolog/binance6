import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Decimal } from 'decimal.js';

interface WalletStore {
  withdrawalLimit: string;
  dailyWithdrawn: string;
  hideBalance: boolean;
  hideSmallBalances: boolean;
  setHideBalance: (hide: boolean) => void;
  setHideSmallBalances: (hide: boolean) => void;
  updateDailyWithdrawn: (amount: string) => void;
  resetDailyWithdrawn: () => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      withdrawalLimit: '2', // 2 BTC
      dailyWithdrawn: '0',
      hideBalance: false,
      hideSmallBalances: true,
      setHideBalance: (hide) => set({ hideBalance: hide }),
      setHideSmallBalances: (hide) => set({ hideSmallBalances: hide }),
      updateDailyWithdrawn: (amount) => {
        const current = new Decimal(get().dailyWithdrawn);
        set({ dailyWithdrawn: current.plus(amount).toString() });
      },
      resetDailyWithdrawn: () => set({ dailyWithdrawn: '0' })
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        hideBalance: state.hideBalance,
        hideSmallBalances: state.hideSmallBalances,
        dailyWithdrawn: state.dailyWithdrawn
      })
    }
  )
);