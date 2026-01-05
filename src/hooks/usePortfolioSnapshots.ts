// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PortfolioSnapshot {
  id: string;
  portfolio_id: string;
  total_value: number;
  cash_balance: number;
  invested_value: number;
  snapshot_date: string;
  created_at: string;
}

interface UsePortfolioSnapshotsReturn {
  snapshots: PortfolioSnapshot[];
  isLoading: boolean;
  recordSnapshot: (portfolioId: string, totalValue: number, cashBalance: number, investedValue: number) => Promise<void>;
}

export function usePortfolioSnapshots(): UsePortfolioSnapshotsReturn {
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSnapshots = useCallback(async () => {
    if (!user) {
      setSnapshots([]);
      setIsLoading(false);
      return;
    }

    try {
      // First get user's portfolio
      const { data: portfolio } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!portfolio) {
        setSnapshots([]);
        setIsLoading(false);
        return;
      }

      // Get snapshots for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('portfolio_snapshots')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .gte('snapshot_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('snapshot_date', { ascending: true });

      if (error) throw error;

      setSnapshots(data || []);
    } catch (error) {
      console.error('Error fetching portfolio snapshots:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSnapshots();
  }, [fetchSnapshots]);

  const recordSnapshot = useCallback(async (
    portfolioId: string,
    totalValue: number,
    cashBalance: number,
    investedValue: number
  ) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Upsert to handle existing snapshot for today
      const { error } = await supabase
        .from('portfolio_snapshots')
        .upsert({
          portfolio_id: portfolioId,
          total_value: totalValue,
          cash_balance: cashBalance,
          invested_value: investedValue,
          snapshot_date: today,
        }, {
          onConflict: 'portfolio_id,snapshot_date',
        });

      if (error) throw error;

      // Refresh snapshots
      await fetchSnapshots();
    } catch (error) {
      console.error('Error recording portfolio snapshot:', error);
    }
  }, [user, fetchSnapshots]);

  return { snapshots, isLoading, recordSnapshot };
}
