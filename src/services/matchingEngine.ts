import { db } from '../db/db';
import { Order, Trade } from './orderService';
import { Decimal } from 'decimal.js';
import { EventEmitter } from 'events';
import { Subject } from 'rxjs';

interface OrderBook {
  bids: Map<string, Order[]>;
  asks: Map<string, Order[]>;
}

export const orderBookEvents = {
  orderBookUpdate: new Subject<{ symbol: string, bids: [string, string][], asks: [string, string][] }>(),
};

class MatchingEngine extends EventEmitter {
  private orderBooks: Map<string, OrderBook> = new Map();

  constructor() {
    super();
    this.initializeOrderBooks().catch(err => {
      console.error('Error initializing order books:', err);
    });
  }

  private async initializeOrderBooks() {
    try {
      // Создаем базовую структуру для каждой торговой пары
      const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
      symbols.forEach(symbol => {
        this.orderBooks.set(symbol, {
          bids: new Map(),
          asks: new Map()
        });
      });

      // Загружаем активные ордера
      const activeOrders = await db.orders.where('status')
        .anyOf(['new', 'partially_filled'])
        .toArray();

      // Добавляем ордера в соответствующие стаканы
      activeOrders.forEach(order => {
        if (order) {
          this.addToOrderBook(order);
        }
      });
    } catch (error) {
      console.error('Error in initializeOrderBooks:', error);
    }
  }

  private addToOrderBook(order: Order) {
    const orderBook = this.orderBooks.get(order.symbol);
    if (!orderBook) {
      this.orderBooks.set(order.symbol, {
        bids: new Map(),
        asks: new Map()
      });
    }

    const priceLevel = order.price;
    const side = order.side === 'buy' ? 'bids' : 'asks';
    const orders = orderBook?.[side].get(priceLevel) || [];
    orders.push(order);
    orderBook?.[side].set(priceLevel, orders);
  }

  public getOrderBook(symbol: string) {
    const orderBook = this.orderBooks.get(symbol);
    if (!orderBook) {
      return { bids: [], asks: [] };
    }

    const bids = Array.from(orderBook.bids.entries())
      .map(([price, orders]) => [
        price,
        orders.reduce((sum, order) => 
          new Decimal(sum).plus(order.amount).toString(), '0'
        )
      ] as [string, string]);

    const asks = Array.from(orderBook.asks.entries())
      .map(([price, orders]) => [
        price,
        orders.reduce((sum, order) => 
          new Decimal(sum).plus(order.amount).toString(), '0'
        )
      ] as [string, string]);

    return { bids, asks };
  }

  public removeOrder(order: Order) {
    const orderBook = this.orderBooks.get(order.symbol);
    if (!orderBook) return;

    const side = order.side === 'buy' ? 'bids' : 'asks';
    const orders = orderBook[side].get(order.price) || [];
    const updatedOrders = orders.filter(o => o.id !== order.id);
    
    if (updatedOrders.length > 0) {
      orderBook[side].set(order.price, updatedOrders);
    } else {
      orderBook[side].delete(order.price);
    }
  }

  public async processOrder(order: Order): Promise<Trade[]> {
    const trades: Trade[] = [];
    // Логика матчинга ордеров
    // В демо-версии просто возвращаем пустой массив
    return trades;
  }
}

export const matchingEngine = new MatchingEngine();