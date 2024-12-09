import { useQuery, useMutation, useQueryClient } from 'react-query';
import { db } from '../db/db';

export function useAdminData() {
  const queryClient = useQueryClient();

  // Получение списка пользователей
  const useUsers = () => useQuery('users', () => db.users.toArray());

  // Получение списка балансов
  const useBalances = () => useQuery('balances', () => db.balances.toArray());

  // Получение аудит логов
  const useAuditLogs = () => useQuery('audit-logs', () => db.auditLogs.orderBy('timestamp').reverse().toArray());

  // Получение запросов на верификацию
  const useVerificationRequests = () => useQuery('verification-requests', () => 
    db.verificationRequests.orderBy('submittedAt').reverse().toArray()
  );

  // Мутация для обновления баланса
  const useUpdateBalance = () => useMutation(
    async ({ userId, asset, amount, type }: { 
      userId: number; 
      asset: string; 
      amount: string; 
      type: 'credit' | 'debit' 
    }) => {
      await db.updateUserBalance(userId, asset, amount, type);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('balances');
      }
    }
  );

  // Мутация для обновления статуса верификации
  const useUpdateVerification = () => useMutation(
    async ({ requestId, status, userId }: {
      requestId: number;
      status: 'approved' | 'rejected';
      userId: number;
    }) => {
      await db.verificationRequests.update(requestId, {
        status,
        reviewedAt: new Date()
      });

      if (status === 'approved') {
        await db.users.update(userId, { isVerified: true });
      }

      await db.addAuditLog(
        userId,
        `verification_${status}`,
        `Verification request ${status}`
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('verification-requests');
        queryClient.invalidateQueries('users');
      }
    }
  );

  return {
    useUsers,
    useBalances,
    useAuditLogs,
    useVerificationRequests,
    useUpdateBalance,
    useUpdateVerification
  };
}