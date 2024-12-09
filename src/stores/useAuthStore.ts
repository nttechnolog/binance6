import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../db/db';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      isAdmin: () => get().user?.role === 'admin',
      isModerator: () => ['admin', 'moderator'].includes(get().user?.role || ''),
      hasPermission: (permission) => {
        const user = get().user;
        if (!user) return false;
        
        // Админ имеет все права
        if (user.role === 'admin') return true;
        
        // Права модератора
        if (user.role === 'moderator') {
          const moderatorPermissions = [
            'view_users',
            'edit_users',
            'view_logs',
            'manage_settings'
          ];
          return moderatorPermissions.includes(permission);
        }
        
        return false;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);