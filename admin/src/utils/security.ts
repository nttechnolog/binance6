import jwt from 'jsonwebtoken';
import { ADMIN_JWT_SECRET } from '../config/constants';

export const generateToken = (userId: number, role: string) => {
  return jwt.sign(
    { userId, role },
    ADMIN_JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET);
  } catch {
    return null;
  }
};

export const validatePassword = (password: string, policy: any) => {
  if (password.length < policy.minLength) {
    return false;
  }

  if (policy.requireNumbers && !/\d/.test(password)) {
    return false;
  }

  if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    return false;
  }

  return true;
};

export const validateIpAddress = (ip: string, whitelist: string) => {
  const allowedIps = whitelist.split(',').map(ip => ip.trim());
  return allowedIps.includes(ip);
};

export const sanitizeAdminDomain = (domain: string) => {
  return domain.toLowerCase()
    .replace(/[^a-z0-9.-]/g, '')
    .replace(/^[^a-z0-9]/, '')
    .replace(/[^a-z0-9]$/, '');
};