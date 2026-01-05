// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { mockStocks } from '@/data/mockStocks';
import { toast } from 'sonner';

export interface PortfolioHolding {
  id: string;
  symbol: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  totalValue: number;
  pnl: number;
  pnlPercent: number;
}

export interface PortfolioData {
  id: string;
  cashBalance: number;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
}

export interface TradeData {
  symbol: string;
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop_loss';
  shares: number;
  price: number;
}

interface UsePortfolioReturn {
  portfolio: PortfolioData | null;
  isLoading: boolean;
  executeTrade: (trade: TradeData) => Promise<boolean>;
  refreshPortfolio: () => Promise<void>;
  trades: TradeRecord[];
}

export interface TradeRecord {
  id: string;
  symbol: string;
  side: string;
  orderType: string;
  shares: number;
  price: number;
  totalValue: number;
  status: string;
  executedAt: string;
}

export function usePortfolio(): UsePortfolioReturn {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPortfolio = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (portfolioError) throw portfolioError;

      // Fetch holdings
      const { data: holdingsData, error: holdingsError } = await supabase
        .from('holdings')
        .select('*')
        .eq('portfolio_id', portfolioData.id);

      if (holdingsError) throw holdingsError;

      // Fetch trades
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .eq('portfolio_id', portfolioData.id)
        .order('executed_at', { ascending: false })
        .limit(50);

      if (tradesError) throw tradesError;

      // Map holdings with current prices
      const holdings: PortfolioHolding[] = (holdingsData || []).map((h) => {
        const stock = mockStocks.find((s) => s.symbol === h.symbol);
        const currentPrice = stock?.price || h.average_cost;
        const totalValue = h.shares * currentPrice;
        const costBasis = h.shares * h.average_cost;
        const pnl = totalValue - costBasis;
        const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

        return {
          id: h.id,
          symbol: h.symbol,
          shares: Number(h.shares),
          averageCost: Number(h.average_cost),
          currentPrice,
          totalValue,
          pnl,
          pnlPercent,
        };
      });

      const totalHoldingsValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
      const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.averageCost, 0);
      const totalPnl = totalHoldingsValue - totalCost;
      const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

      setPortfolio({
        id: portfolioData.id,
        cashBalance: Number(portfolioData.cash_balance),
        holdings,
        totalValue: Number(portfolioData.cash_balance) + totalHoldingsValue,
        totalPnl,
        totalPnlPercent,
      });

      setTrades(
        (tradesData || []).map((t) => ({
          id: t.id,
          symbol: t.symbol,
          side: t.side,
          orderType: t.order_type,
          shares: Number(t.shares),
          price: Number(t.price),
          totalValue: Number(t.total_value),
          status: t.status || 'executed',
          executedAt: t.executed_at,
        }))
      );
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to load portfolio');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const executeTrade = async (trade: TradeData): Promise<boolean> => {
    if (!user || !portfolio) return false;

    const totalValue = trade.shares * trade.price;

    try {
      if (trade.side === 'buy') {
        // Check sufficient funds
        if (totalValue > portfolio.cashBalance) {
          toast.error('Insufficient funds');
          return false;
        }

        // Update cash balance
        const newCashBalance = portfolio.cashBalance - totalValue;
        await supabase
          .from('portfolios')
          .update({ cash_balance: newCashBalance })
          .eq('id', portfolio.id);

        // Check existing holding
        const existingHolding = portfolio.holdings.find((h) => h.symbol === trade.symbol);

        if (existingHolding) {
          // Update existing holding
          const newShares = existingHolding.shares + trade.shares;
          const newAvgCost =
            (existingHolding.shares * existingHolding.averageCost + trade.shares * trade.price) /
            newShares;

          await supabase
            .from('holdings')
            .update({ shares: newShares, average_cost: newAvgCost })
            .eq('id', existingHolding.id);
        } else {
          // Create new holding
          await supabase.from('holdings').insert({
            portfolio_id: portfolio.id,
            symbol: trade.symbol,
            shares: trade.shares,
            average_cost: trade.price,
          });
        }
      } else {
        // Sell
        const existingHolding = portfolio.holdings.find((h) => h.symbol === trade.symbol);

        if (!existingHolding || existingHolding.shares < trade.shares) {
          toast.error('Insufficient shares');
          return false;
        }

        // Update cash balance
        const newCashBalance = portfolio.cashBalance + totalValue;
        await supabase
          .from('portfolios')
          .update({ cash_balance: newCashBalance })
          .eq('id', portfolio.id);

        // Update or delete holding
        const newShares = existingHolding.shares - trade.shares;

        if (newShares <= 0) {
          await supabase.from('holdings').delete().eq('id', existingHolding.id);
        } else {
          await supabase
            .from('holdings')
            .update({ shares: newShares })
            .eq('id', existingHolding.id);
        }
      }

      // Record trade
      await supabase.from('trades').insert({
        portfolio_id: portfolio.id,
        symbol: trade.symbol,
        side: trade.side,
        order_type: trade.orderType,
        shares: trade.shares,
        price: trade.price,
        total_value: totalValue,
        status: 'executed',
      });

      toast.success(
        `${trade.side === 'buy' ? 'Bought' : 'Sold'} ${trade.shares} shares of ${trade.symbol}`
      );

      await fetchPortfolio();
      return true;
    } catch (error) {
      console.error('Error executing trade:', error);
      toast.error('Trade execution failed');
      return false;
    }
  };

  return {
    portfolio,
    isLoading,
    executeTrade,
    refreshPortfolio: fetchPortfolio,
    trades,
  };
}
