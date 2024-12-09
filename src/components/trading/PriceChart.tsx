import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, Spinner, VStack, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button } from '@chakra-ui/react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useQuery } from 'react-query';
import { api, handleApiError } from '../../utils/api';
import { ChartToolbar } from './chart/ChartToolbar';
import { useTradeStore } from '../../stores/useTradeStore';

interface PriceChartProps {
  symbol: string;
  onRemove?: () => void;
}

export function PriceChart({ symbol, onRemove }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const [interval, setInterval] = useState('15m');
  const [chartType, setChartType] = useState('candlestick');
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { setPrice } = useTradeStore();

  const { data: klines, isLoading, error } = useQuery(
    ['klines', symbol, interval],
    async () => {
      const response = await api.get('/api/v3/klines', {
        params: {
          symbol,
          interval,
          limit: 1000
        }
      });
      return response.data.map((k: any[]) => ({
        time: k[0] / 1000,
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5])
      }));
    },
    {
      refetchInterval: 1000,
      retry: 3,
      onError: (error) => {
        console.warn('Chart data fetch error:', handleApiError(error));
      }
    }
  );

  useEffect(() => {
    if (!chartContainerRef.current || !klines?.length) return;

    // Очищаем предыдущий график при необходимости
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1A202C' },
        textColor: '#D9D9D9',
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      grid: {
        vertLines: { color: '#2D3748' },
        horzLines: { color: '#2D3748' },
      },
      crosshair: {
        mode: 1,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    let series: ISeriesApi<any>;

    switch (chartType) {
      case 'line':
        series = chart.addLineSeries({
          color: '#48BB78',
          lineWidth: 2,
        });
        series.setData(klines.map((k: any) => ({
          time: k.time,
          value: k.close,
        })));
        break;
      
      default:
        series = chart.addCandlestickSeries({
          upColor: '#48BB78',
          downColor: '#F56565',
          borderVisible: false,
          wickUpColor: '#48BB78',
          wickDownColor: '#F56565',
        });
        series.setData(klines);
    }

    seriesRef.current = series;

    // Добавляем обработчик клика на график
    chart.subscribeClick((param) => {
      if (param.point && seriesRef.current) {
        const price = param.seriesPrices.get(seriesRef.current);
        if (price) {
          setSelectedPrice(price.toString());
          onOpen();
        }
      }
    });

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, [klines, chartType]);

  const handlePriceTransfer = () => {
    if (selectedPrice) {
      setPrice(selectedPrice);
      onClose();
    }
  };

  if (isLoading) {
    return (
      <VStack justify="center" h="500px">
        <Spinner size="xl" color="yellow.400" />
        <Text>Загрузка графика...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.500" color="white" borderRadius="md">
        <Text>Ошибка загрузки графика: {handleApiError(error)}</Text>
      </Box>
    );
  }

  return (
    <Box bg="gray.800" borderRadius="lg">
      <ChartToolbar
        interval={interval}
        onIntervalChange={setInterval}
        chartType={chartType}
        onChartTypeChange={setChartType}
      />
      <Box ref={chartContainerRef} w="100%" h="500px" />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              Перенести цену?
            </AlertDialogHeader>
            <AlertDialogBody>
              Хотите использовать выбранную цену {selectedPrice} для создания ордера?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Нет
              </Button>
              <Button colorScheme="yellow" onClick={handlePriceTransfer} ml={3}>
                Да
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}