import { db } from '../db/db';
import { Decimal } from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import { matchingEngine } from './matchingEngine';
import { Subject } from 'rxjs';

export interface Order {
  id: string;
  userId: number;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market' | 'stop' | 'stop_limit';
  price: string;
  amount: string;
  filled: string;
  status: 'new' | 'partially_filled' | 'filled' | 'cancelled';
  stopPrice?: string;
  stopLoss?: string;
  takeProfit?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trade {
  id: string;
  orderId: string;
  symbol: string;
  price: string;
  amount: string;
  side: 'buy' | 'sell';
  maker: number;
  taker: number;
  timestamp: Date;
}

export const orderEvents = {
  orderCreated: new Subject<Order>(),
  orderUpdated: new Subject<Order>(),
  orderCancelled: new Subject<string>(),
  tradeExecuted: new Subject<Trade>(),
};

class OrderService {
  private async validateOrder(order: Partial<Order>): Promise<void> {
    if (!order.userId || !order.symbol || !order.amount || !order.type) {
      throw new Error('Не все обязательные поля заполнены');
    }

    try {
      // Проверка минимального объема
      const amountDecimal = new Decimal(order.amount);
      if (amountDecimal.lessThan('0.00001')) {
        throw new Error('Объем ордера слишком мал');
      }

      // Проверка цены для лимитных ордеров
      if (order.type === 'limit' && !order.price) {
        throw new Error('Для лимитного ордера необходимо указать цену');
      }

      // Проверка стоп-цены для стоп-ордеров
      if ((order.type === 'stop' || order.type === 'stop_limit') && !order.stopPrice) {
        throw new Error('Для стоп-ордера необходимо указать стоп-цену');
      }

      // Проверка баланса
      const [baseAsset] = order.symbol.split('USDT');
      const balance = await db.balances
        .where({ userId: order.userId, asset: order.side === 'buy' ? 'USDT' : baseAsset })
        .first();

      if (!balance) {
        throw new Error('Недостаточно средств');
      }

      const orderValue = order.side === 'buy' && order.price
        ? amountDecimal.times(order.price)
        : amountDecimal;

      if (new Decimal(balance.free).lessThan(orderValue)) {
        throw new Error('Недостаточно средств');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Ошибка валидации ордера');
    }
  }

  private async lockFunds(userId: number, asset: string, amount: string): Promise<void> {
    await db.transaction('rw', db.balances, async () => {
      const balance = await db.balances
        .where({ userId, asset })
        .first();

      if (!balance) {
        throw new Error('Баланс не найден');
      }

      try {
        const free = new Decimal(balance.free);
        const locked = new Decimal(balance.locked);
        const amountToLock = new Decimal(amount);

        if (free.lessThan(amountToLock)) {
          throw new Error('Недостаточно средств');
        }

        await db.balances.update(balance.id!, {
          free: free.minus(amountToLock).toString(),
          locked: locked.plus(amountToLock).toString(),
          timestamp: new Date()
        });
      } catch (error) {
        throw new Error('Ошибка при блокировке средств');
      }
    });
  }

  private async unlockFunds(userId: number, asset: string, amount: string): Promise<void> {
    await db.transaction('rw', db.balances, async () => {
      const balance = await db.balances
        .where({ userId, asset })
        .first();

      if (!balance) {
        throw new Error('Баланс не найден');
      }

      try {
        const free = new Decimal(balance.free);
        const locked = new Decimal(balance.locked);
        const amountToUnlock = new Decimal(amount);

        if (locked.lessThan(amountToUnlock)) {
          throw new Error('Некорректное состояние блокировки');
        }

        await db.balances.update(balance.id!, {
          free: free.plus(amountToUnlock).toString(),
          locked: locked.minus(amountToUnlock).toString(),
          timestamp: new Date()
        });
      } catch (error) {
        throw new Error('Ошибка при разблокировке средств');
      }
    });
  }

  async createOrder(orderData: Omit<Order, 'id' | 'filled' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    await this.validateOrder(orderData);

    const order: Order = {
      ...orderData,
      id: uuidv4(),
      filled: '0',
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      // Блокируем средства
      const [baseAsset] = order.symbol.split('USDT');
      if (order.side === 'buy' && order.price) {
        await this.lockFunds(
          order.userId,
          'USDT',
          new Decimal(order.amount).times(order.price).toString()
        );
      } else {
        await this.lockFunds(order.userId, baseAsset, order.amount);
      }

      // Сохраняем ордер
      await db.orders.add(order);
      orderEvents.orderCreated.next(order);

      // Пытаемся исполнить ордер
      if (order.type !== 'stop' && order.type !== 'stop_limit') {
        const trades = await matchingEngine.processOrder(order);
        
        if (trades.length > 0) {
          const totalFilled = trades.reduce(
            (sum, trade) => sum.plus(trade.amount),
            new Decimal(0)
          );

          const newStatus = totalFilled.equals(order.amount) ? 'filled' : 'partially_filled';
          await this.updateOrderStatus(order.id, newStatus, totalFilled.toString());

          await db.trades.bulkAdd(trades);
          trades.forEach(trade => orderEvents.tradeExecuted.next(trade));
        }
      }

      return order;
    } catch (error) {
      // В случае ошибки разблокируем средства
      const [baseAsset] = order.symbol.split('USDT');
      try {
        if (order.side === 'buy' && order.price) {
          await this.unlockFunds(
            order.userId,
            'USDT',
            new Decimal(order.amount).times(order.price).toString()
          );
        } else {
          await this.unlockFunds(order.userId, baseAsset, order.amount);
        }
      } catch (unlockError) {
        console.error('Error unlocking funds:', unlockError);
      }
      throw error;
    }
  }

  async cancelOrder(orderId: string, userId: number): Promise<void> {
    const order = await db.orders.get(orderId);
    
    if (!order || order.userId !== userId) {
      throw new Error('Ордер не найден');
    }

    if (order.status === 'filled') {
      throw new Error('Ордер уже исполнен');
    }

    try {
      // Возвращаем средства
      const [baseAsset] = order.symbol.split('USDT');
      const remainingAmount = new Decimal(order.amount).minus(order.filled);

      if (order.side === 'buy' && order.price) {
        await this.unlockFunds(
          userId,
          'USDT',
          remainingAmount.times(order.price).toString()
        );
      } else {
        await this.unlockFunds(userId, baseAsset, remainingAmount.toString());
      }

      // Отменяем ордер
      await db.orders.update(orderId, {
        status: 'cancelled',
        updatedAt: new Date()
      });

      orderEvents.orderCancelled.next(orderId);
      matchingEngine.removeOrder(order);
    } catch (error) {
      throw new Error('Ошибка при отмене ордера');
    }
  }

  private async updateOrderStatus(orderId: string, status: Order['status'], filled: string): Promise<void> {
    try {
      await db.orders.update(orderId, {
        status,
        filled,
        updatedAt: new Date()
      });

      const updatedOrder = await db.orders.get(orderId);
      if (updatedOrder) {
        orderEvents.orderUpdated.next(updatedOrder);
      }
    } catch (error) {
      throw new Error('Ошибка при обновлении статуса ордера');
    }
  }

  async getOrderBook(symbol: string): Promise<{ bids: [string, string][], asks: [string, string][] }> {
    return matchingEngine.getOrderBook(symbol);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return db.orders
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('createdAt');
  }

  async getUserTrades(userId: number): Promise<Trade[]> {
    return db.trades
      .where('maker')
      .equals(userId)
      .or('taker')
      .equals(userId)
      .reverse()
      .sortBy('timestamp');
  }
}

export const orderService = new OrderService();