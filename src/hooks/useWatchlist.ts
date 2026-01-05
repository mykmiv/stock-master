// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { mockStocks } from '@/data/mockStocks';
import { toast } from 'sonner';

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  addedAt: string;
}

export interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
}

interface UseWatchlistReturn {
  watchlists: Watchlist[];
  isLoading: boolean;
  addToWatchlist: (symbol: string, watchlistId?: string) => Promise<boolean>;
  removeFromWatchlist: (itemId: string) => Promise<boolean>;
  createWatchlist: (name: string) => Promise<string | null>;
  refreshWatchlists: () => Promise<void>;
}

export function useWatchlist(): UseWatchlistReturn {
  const { user } = useAuth();
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWatchlists = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch watchlists
      const { data: watchlistsData, error: watchlistsError } = await supabase
        .from('watchlists')
        .select('*')
        .eq('user_id', user.id);

      if (watchlistsError) throw watchlistsError;

      // Fetch items for each watchlist
      const watchlistsWithItems: Watchlist[] = await Promise.all(
        (watchlistsData || []).map(async (wl) => {
          const { data: items, error: itemsError } = await supabase
            .from('watchlist_items')
            .select('*')
            .eq('watchlist_id', wl.id)
            .order('added_at', { ascending: false });

          if (itemsError) throw itemsError;

          const mappedItems: WatchlistItem[] = (items || []).map((item) => {
            const stock = mockStocks.find((s) => s.symbol === item.symbol);
            return {
              id: item.id,
              symbol: item.symbol,
              name: stock?.name || item.symbol,
              price: stock?.price || 0,
              change: stock?.change || 0,
              changePercent: stock?.changePercent || 0,
              addedAt: item.added_at,
            };
          });

          return {
            id: wl.id,
            name: wl.name,
            items: mappedItems,
          };
        })
      );

      setWatchlists(watchlistsWithItems);
    } catch (error) {
      console.error('Error fetching watchlists:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWatchlists();
  }, [fetchWatchlists]);

  const addToWatchlist = async (symbol: string, watchlistId?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Get default watchlist if not specified
      let targetWatchlistId = watchlistId;
      if (!targetWatchlistId && watchlists.length > 0) {
        targetWatchlistId = watchlists[0].id;
      }

      if (!targetWatchlistId) {
        toast.error('No watchlist found');
        return false;
      }

      // Check if already exists
      const watchlist = watchlists.find((wl) => wl.id === targetWatchlistId);
      if (watchlist?.items.some((item) => item.symbol === symbol)) {
        toast.info(`${symbol} is already in your watchlist`);
        return false;
      }

      await supabase.from('watchlist_items').insert({
        watchlist_id: targetWatchlistId,
        symbol,
      });

      toast.success(`${symbol} added to watchlist`);
      await fetchWatchlists();
      return true;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add to watchlist');
      return false;
    }
  };

  const removeFromWatchlist = async (itemId: string): Promise<boolean> => {
    try {
      await supabase.from('watchlist_items').delete().eq('id', itemId);
      toast.success('Removed from watchlist');
      await fetchWatchlists();
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
      return false;
    }
  };

  const createWatchlist = async (name: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('watchlists')
        .insert({ user_id: user.id, name })
        .select()
        .single();

      if (error) throw error;

      toast.success(`Watchlist "${name}" created`);
      await fetchWatchlists();
      return data.id;
    } catch (error) {
      console.error('Error creating watchlist:', error);
      toast.error('Failed to create watchlist');
      return null;
    }
  };

  return {
    watchlists,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    createWatchlist,
    refreshWatchlists: fetchWatchlists,
  };
}
