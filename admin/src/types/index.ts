export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface Balance {
  id: number;
  userId: number;
  asset: string;
  free: string;
  locked: string;
  timestamp: Date;
}

export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}

export interface Statistics {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalVolume: number;
  userGrowth: number;
  tradingVolume: number;
}