import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import GridLayout, { Layout } from 'react-grid-layout';
import { OrderBook } from '../components/trading/OrderBook';
import { PriceChart } from '../components/trading/PriceChart';
import { TradeHistory } from '../components/trading/TradeHistory';
import { TradeWidget } from '../components/trading/TradeWidget';
import { PairSelector } from '../components/trading/PairSelector';
import { MarketOverview } from '../components/trading/MarketOverview';
import { PositionsTable } from '../components/trading/PositionsTable';
import { WidgetManager } from '../components/WidgetManager';
import { useLayoutStore } from '../stores/useLayoutStore';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

type Breakpoint = 'lg' | 'md' | 'sm';

// Оптимизированные лейауты для лучшего распределения пространства
const defaultLayouts: Record<Breakpoint, Layout[]> = {
  lg: [
    { i: 'search', x: 0, y: 0, w: 6, h: 12, minW: 4, minH: 8 },
    { i: 'overview', x: 0, y: 12, w: 6, h: 12, minW: 4, minH: 8 },
    { i: 'chart', x: 6, y: 0, w: 18, h: 24, minW: 12, minH: 15 },
    { i: 'orderbook', x: 24, y: 0, w: 8, h: 12, minW: 6, minH: 8 },
    { i: 'trades', x: 24, y: 12, w: 8, h: 12, minW: 6, minH: 8 },
    { i: 'trade', x: 0, y: 24, w: 32, h: 12, minW: 8, minH: 10 },
    { i: 'positions', x: 0, y: 36, w: 32, h: 10, minW: 8, minH: 8 }
  ],
  md: [
    { i: 'search', x: 0, y: 0, w: 8, h: 10, minW: 4, minH: 8 },
    { i: 'overview', x: 0, y: 10, w: 8, h: 10, minW: 4, minH: 8 },
    { i: 'chart', x: 8, y: 0, w: 16, h: 20, minW: 8, minH: 12 },
    { i: 'orderbook', x: 24, y: 0, w: 8, h: 10, minW: 4, minH: 8 },
    { i: 'trades', x: 24, y: 10, w: 8, h: 10, minW: 4, minH: 8 },
    { i: 'trade', x: 0, y: 20, w: 32, h: 10, minW: 6, minH: 8 },
    { i: 'positions', x: 0, y: 30, w: 32, h: 8, minW: 6, minH: 6 }
  ],
  sm: [
    { i: 'search', x: 0, y: 0, w: 12, h: 8, minW: 12, minH: 6 },
    { i: 'overview', x: 0, y: 8, w: 12, h: 8, minW: 12, minH: 6 },
    { i: 'chart', x: 0, y: 16, w: 12, h: 16, minW: 12, minH: 10 },
    { i: 'orderbook', x: 0, y: 32, w: 12, h: 10, minW: 6, minH: 8 },
    { i: 'trades', x: 0, y: 42, w: 12, h: 10, minW: 6, minH: 8 },
    { i: 'trade', x: 0, y: 52, w: 12, h: 12, minW: 6, minH: 8 },
    { i: 'positions', x: 0, y: 64, w: 12, h: 8, minW: 6, minH: 6 }
  ]
};

export function TradingView() {
  const { symbol } = useParams<{ symbol: string }>();
  const [currentSymbol, setCurrentSymbol] = useState(symbol || 'BTCUSDT');
  const { layouts, setLayouts, visibleWidgets, setVisibleWidgets } = useLayoutStore();
  
  const breakpoint = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' }) as Breakpoint || 'lg';
  const cols = useBreakpointValue({ base: 12, md: 32, lg: 32 }) || 32;
  
  const containerWidth = useBreakpointValue({ 
    base: window.innerWidth - 32,
    sm: Math.min(1200, window.innerWidth - 32),
    md: Math.min(1600, window.innerWidth - 32),
    lg: Math.min(2000, window.innerWidth - 32)
  }) || 1200;

  useEffect(() => {
    if (!layouts[breakpoint]) {
      setLayouts(breakpoint, defaultLayouts[breakpoint]);
    }
  }, [breakpoint, layouts, setLayouts]);

  useEffect(() => {
    if (symbol) {
      setCurrentSymbol(symbol);
    }
  }, [symbol]);

  const handleLayoutChange = (layout: Layout[]) => {
    setLayouts(breakpoint, layout);
  };

  const handleSymbolChange = (newSymbol: string) => {
    setCurrentSymbol(newSymbol);
  };

  return (
    <Box p={4} maxW="100vw" overflow="hidden">
      <Box mt={4} className="layout" w="100%">
        <GridLayout
          className="layout"
          layout={layouts[breakpoint] || defaultLayouts[breakpoint]}
          cols={cols}
          rowHeight={20}
          width={containerWidth}
          margin={[10, 10]}
          containerPadding={[0, 0]}
          isDraggable={true}
          isResizable={true}
          compactType={null}
          preventCollision={false}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".widget-header"
        >
          {visibleWidgets.search && (
            <Box key="search" bg="gray.800" borderRadius="lg" overflow="hidden">
              <PairSelector
                currentSymbol={currentSymbol}
                onSymbolChange={handleSymbolChange}
                onRemove={() => setVisibleWidgets({ ...visibleWidgets, search: false })}
              />
            </Box>
          )}
          
          {visibleWidgets.overview && (
            <Box key="overview" bg="gray.800" borderRadius="lg" overflow="hidden">
              <MarketOverview 
                symbol={currentSymbol}
                onRemove={() => setVisibleWidgets({ ...visibleWidgets, overview: false })}
              />
            </Box>
          )}

          {visibleWidgets.chart && (
            <Box key="chart" bg="gray.800" borderRadius="lg" overflow="hidden">
              <PriceChart 
                symbol={currentSymbol}
                onRemove={() => setVisibleWidgets({ ...visibleWidgets, chart: false })}
              />
            </Box>
          )}

          {visibleWidgets.orderbook && (
            <Box key="orderbook" bg="gray.800" borderRadius="lg" overflow="hidden">
              <OrderBook 
                symbol={currentSymbol}
                onRemove={() => setVisibleWidgets({ ...visibleWidgets, orderbook: false })}
              />
            </Box>
          )}

          {visibleWidgets.trades && (
            <Box key="trades" bg="gray.800" borderRadius="lg" overflow="hidden">
              <TradeHistory 
                symbol={currentSymbol}
                onRemove={() => setVisibleWidgets({ ...visibleWidgets, trades: false })}
              />
            </Box>
          )}

          {visibleWidgets.trade && (
            <Box key="trade" bg="gray.800" borderRadius="lg" overflow="hidden">
              <TradeWidget 
                symbol={currentSymbol}
                onRemove={() => setVisibleWidgets({ ...visibleWidgets, trade: false })}
              />
            </Box>
          )}

          {visibleWidgets.positions && (
            <Box key="positions" bg="gray.800" borderRadius="lg" overflow="hidden">
              <PositionsTable 
                onRemove={() => setVisibleWidgets({ ...visibleWidgets, positions: false })}
              />
            </Box>
          )}
        </GridLayout>
      </Box>
      <WidgetManager 
        visibleWidgets={visibleWidgets}
        onAddWidget={(widgetId) => setVisibleWidgets({ ...visibleWidgets, [widgetId]: true })}
      />
    </Box>
  );
}