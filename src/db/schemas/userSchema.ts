import { Table } from 'dexie';

export interface UserProfile {
  id?: number;
  userId: number;
  phone?: string;
  country?: string;
  city?: string;
  birthDate?: Date;
  kycLevel: number;
  twoFactorEnabled: boolean;
  lastLoginIp?: string;
  referralCode?: string;
  referredBy?: number;
  updatedAt: Date;
}

export interface UserStatistics {
  id?: number;
  userId: number;
  totalTrades: number;
  totalVolume: string;
  successRate: number;
  profitLoss: string;
  lastTradeAt?: Date;
  updatedAt: Date;
}

export interface UserSession {
  id?: number;
  userId: number;
  token: string;
  deviceInfo: string;
  ipAddress: string;
  lastActivityAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface Transaction {
  id?: number;
  userId: number;
  type: 'deposit' | 'withdrawal' | 'trade' | 'transfer' | 'fee';
  asset: string;
  amount: string;
  fee: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  txHash?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserNotification {
  id?: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ApiKey {
  id?: number;
  userId: number;
  key: string;
  secret: string;
  name: string;
  permissions: string[];
  ipWhitelist?: string[];
  lastUsedAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}