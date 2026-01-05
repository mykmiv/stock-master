// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  LEVELS, 
  getLevelByXP, 
  getXPProgressInLevel, 
  XP_SOURCES, 
  XP_MULTIPLIERS,
  Level 
} from '@/data/xpLevels';
import { triggerConfetti } from '@/lib/confetti';

export type XPSource = keyof typeof XP_SOURCES;

interface XPTransaction {
  id: string;
  amount: number;
  source: string;
  multiplier: number;
  final_amount: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface UseXPReturn {
  totalXP: number;
  currentLevel: Level;
  xpProgress: { current: number; needed: number; percent: number };
  isLoading: boolean;
  recentTransactions: XPTransaction[];
  pendingLevelUp: Level | null;
  awardXP: (source: XPSource, metadata?: Record<string, unknown>) => Promise<number>;
  dismissLevelUp: () => void;
  refreshXP: () => Promise<void>;
}

export function useXP(): UseXPReturn {
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<XPTransaction[]>([]);
  const [pendingLevelUp, setPendingLevelUp] = useState<Level | null>(null);

  const totalXP = profile?.xp || 0;
  const currentLevel = getLevelByXP(totalXP);
  const xpProgress = getXPProgressInLevel(totalXP);

  // Fetch recent transactions
  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('xp_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) {
      setRecentTransactions(data as XPTransaction[]);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Calculate multipliers
  const getMultiplier = useCallback((): number => {
    let multiplier = 1.0;
    
    // Weekend bonus
    const day = new Date().getDay();
    if (day === 0 || day === 6) {
      multiplier *= XP_MULTIPLIERS.weekendBonus;
    }
    
    // TODO: Add premium check and combo streak logic
    
    return multiplier;
  }, []);

  // Award XP
  const awardXP = useCallback(async (
    source: XPSource, 
    metadata: Record<string, unknown> = {}
  ): Promise<number> => {
    if (!user || !profile) return 0;
    
    setIsLoading(true);
    
    try {
      const baseAmount = XP_SOURCES[source];
      const multiplier = getMultiplier();
      const finalAmount = Math.floor(baseAmount * multiplier);
      
      const previousLevel = getLevelByXP(profile.xp);
      const newTotalXP = profile.xp + finalAmount;
      const newLevel = getLevelByXP(newTotalXP);
      
      // Insert XP transaction
      await supabase
        .from('xp_transactions')
        .insert([{
          user_id: user.id,
          amount: baseAmount,
          source,
          multiplier,
          final_amount: finalAmount,
          metadata: metadata as unknown as Record<string, never>,
        }]);
      
      // Update profile XP and level info
      await supabase
        .from('profiles')
        .update({
          xp: newTotalXP,
          current_level: newLevel.level,
          level_name: newLevel.name,
          tier: newLevel.tier,
        })
        .eq('user_id', user.id);
      
      // Also update weekly XP in user_leagues (for league competition)
      const { data: userLeague } = await supabase
        .from('user_leagues')
        .select('weekly_xp')
        .eq('user_id', user.id)
        .single();
      
      if (userLeague) {
        await supabase
          .from('user_leagues')
          .update({ weekly_xp: (userLeague.weekly_xp || 0) + finalAmount })
          .eq('user_id', user.id);
      }
      
      // Check for level up
      if (newLevel.level > previousLevel.level) {
        setPendingLevelUp(newLevel);
        triggerConfetti();
      }
      
      // Refresh data
      await refreshProfile();
      await fetchTransactions();
      
      return finalAmount;
    } catch (error) {
      console.error('Error awarding XP:', error);
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [user, profile, getMultiplier, refreshProfile, fetchTransactions]);

  const dismissLevelUp = useCallback(() => {
    setPendingLevelUp(null);
  }, []);

  const refreshXP = useCallback(async () => {
    await refreshProfile();
    await fetchTransactions();
  }, [refreshProfile, fetchTransactions]);

  return {
    totalXP,
    currentLevel,
    xpProgress,
    isLoading,
    recentTransactions,
    pendingLevelUp,
    awardXP,
    dismissLevelUp,
    refreshXP,
  };
}
