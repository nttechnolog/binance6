import Dexie, { Table } from 'dexie';
import { 
  UserProfile, 
  UserStatistics, 
  UserSession,
  Transaction,
  UserNotification,
  ApiKey
} from './schemas/userSchema';

export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  isVerified?: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface Balance {
  id?: number;
  userId: number;
  asset: string;
  free: string;
  locked: string;
  timestamp: Date;
}

export interface AuditLog {
  id?: number;
  userId: number;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}

export interface Order {
  id?: number;
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

class TradePXDB extends Dexie {
  users!: Table<User>;
  userProfiles!: Table<UserProfile>;
  userStatistics!: Table<UserStatistics>;
  userSessions!: Table<UserSession>;
  balances!: Table<Balance>;
  transactions!: Table<Transaction>;
  auditLogs!: Table<AuditLog>;
  orders!: Table<Order>;
  settings!: Table<any>;

  private static instance: TradePXDB;

  private constructor() {
    super('tradepxDB');
    this.version(6).stores({
      users: '++id, email, role',
      userProfiles: '++id, userId, kycLevel',
      userStatistics: '++id, userId',
      userSessions: '++id, userId, token',
      balances: '++id, userId, asset',
      transactions: '++id, userId, type, status, createdAt',
      auditLogs: '++id, userId, timestamp',
      orders: '++id, userId, symbol, status, createdAt',
      settings: 'key'
    });
  }

  public static getInstance(): TradePXDB {
    if (!TradePXDB.instance) {
      TradePXDB.instance = new TradePXDB();
    }
    return TradePXDB.instance;
  }

  async getUserFullData(userId: number) {
    const [user, balances] = await Promise.all([
      this.users.get(userId),
      this.balances.where('userId').equals(userId).toArray()
    ]);

    return { user, balances };
  }

  async initializeDatabase() {
    try {
      await this.open();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }
}

export const db = TradePXDB.getInstance();

// Инициализируем базу данных при импорте
db.initializeDatabase().catch(console.error);