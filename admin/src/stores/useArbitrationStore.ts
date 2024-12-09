import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dispute, DisputeMessage, DisputeStatus } from '../types/arbitration';

interface ArbitrationStore {
  disputes: Dispute[];
  selectedDispute: Dispute | null;
  filters: {
    id?: string;
    status?: DisputeStatus;
    sort?: string;
  };
  setSelectedDispute: (dispute: Dispute | null) => void;
  setFilters: (filters: Partial<ArbitrationStore['filters']>) => void;
  updateDisputeStatus: (id: number, status: DisputeStatus) => Promise<void>;
  addMessage: (disputeId: number, message: DisputeMessage) => Promise<void>;
}

export const useArbitrationStore = create<ArbitrationStore>()(
  persist(
    (set, get) => ({
      disputes: [],
      selectedDispute: null,
      filters: {},
      setSelectedDispute: (dispute) => set({ selectedDispute: dispute }),
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),
      updateDisputeStatus: async (id, status) => {
        const { disputes } = get();
        const updatedDisputes = disputes.map(dispute =>
          dispute.id === id ? { ...dispute, status } : dispute
        );
        set({ disputes: updatedDisputes });
      },
      addMessage: async (disputeId, message) => {
        const { disputes } = get();
        const updatedDisputes = disputes.map(dispute =>
          dispute.id === disputeId
            ? { ...dispute, messages: [...dispute.messages, message] }
            : dispute
        );
        set({ disputes: updatedDisputes });
      }
    }),
    {
      name: 'arbitration-storage'
    }
  )
);