import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../db/db';

interface AdminStore {
  currentAdmin: User | null;
  setCurrentAdmin: (admin: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
  hasPermission: (permission: string) => boolean;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      currentAdmin: null,
      setCurrentAdmin: (admin) => set({ currentAdmin: admin }),
      isAuthenticated: false,
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      permissions: [],
      setPermissions: (permissions) => set({ permissions }),
      hasPermission: (permission) => {
        const { currentAdmin, permissions } = get();
        if (!currentAdmin) return false;
        if (currentAdmin.role === 'admin') return true;
        return permissions.includes(permission);
      }
    }),
    {
      name: 'admin-storage'
    }
  )
);