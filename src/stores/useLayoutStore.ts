import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Layout } from 'react-grid-layout';

interface LayoutStore {
  layouts: { [key: string]: Layout[] };
  setLayouts: (breakpoint: string, layout: Layout[]) => void;
  visibleWidgets: { [key: string]: boolean };
  setVisibleWidgets: (widgets: { [key: string]: boolean }) => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      layouts: {},
      setLayouts: (breakpoint, layout) =>
        set((state) => ({
          layouts: {
            ...state.layouts,
            [breakpoint]: layout,
          },
        })),
      visibleWidgets: {
        search: true,
        overview: true,
        chart: true,
        orderbook: true,
        trades: true,
        trade: true,
        positions: true,
      },
      setVisibleWidgets: (widgets) =>
        set(() => ({
          visibleWidgets: widgets,
        })),
    }),
    {
      name: 'layout-storage',
    }
  )
);