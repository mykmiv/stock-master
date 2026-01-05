// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  LeagueName, 
  getLeagueConfig, 
  getNextLeague,
  getPreviousLeague,
  getCurrentMonthNumber, 
  getMonthStartDate,
  getDaysLeftInMonth,
  LEAGUE_SIZE,
  PROMOTION_ZONE,
  DEMOTION_ZONE,
  LeagueConfig
} from '@/data/leagues';

export interface LeagueMember {
  id: string;
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  current_level: number;
  monthly_xp: number;
  league_rank: number;
}

interface UserLeagueData {
  id: string;
  user_id: string;
  current_league: LeagueName;
  league_group_id: string | null;
  league_rank: number;
  month_number: number;
  monthly_xp: number;
  highest_league_reached: LeagueName;
  total_promotions: number;
  total_demotions: number;
  months_participated: number;
  total_top_3_finishes: number;
  total_first_place_finishes: number;
}

interface UseLeagueReturn {
  userLeague: UserLeagueData | null;
  leagueConfig: LeagueConfig | null;
  leagueMembers: LeagueMember[];
  isLoading: boolean;
  monthNumber: number;
  daysLeft: number;
  joinLeague: () => Promise<void>;
  refreshLeague: () => Promise<void>;
  updateMonthlyXP: (xpGained: number) => Promise<void>;
  createLeagueNotification: (
    type: 'promotion' | 'demotion' | 'top1' | 'top3' | 'top10' | 'monthly_result',
    finalRank: number,
    league: LeagueName,
    newLeague?: LeagueName
  ) => Promise<void>;
  processMonthlyResults: () => Promise<void>;
}

export function useLeague(): UseLeagueReturn {
  const { user } = useAuth();
  const [userLeague, setUserLeague] = useState<UserLeagueData | null>(null);
  const [leagueMembers, setLeagueMembers] = useState<LeagueMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const monthNumber = getCurrentMonthNumber();
  const daysLeft = getDaysLeftInMonth();

  const leagueConfig = userLeague ? getLeagueConfig(userLeague.current_league) : null;

  // Fetch user's league data
  const fetchUserLeague = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_leagues')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user league:', error);
    }

    if (data) {
      // Map database fields to our interface (week_number -> month_number, weekly_xp -> monthly_xp)
      setUserLeague({
        id: data.id,
        user_id: data.user_id,
        current_league: data.current_league as LeagueName,
        league_group_id: data.league_group_id,
        league_rank: data.league_rank || LEAGUE_SIZE,
        month_number: data.week_number, // Reusing week_number field for month
        monthly_xp: data.weekly_xp || 0, // Reusing weekly_xp field for monthly
        highest_league_reached: (data.highest_league_reached || 'Bronze') as LeagueName,
        total_promotions: data.total_promotions || 0,
        total_demotions: data.total_demotions || 0,
        months_participated: data.weeks_participated || 0,
        total_top_3_finishes: data.total_top_3_finishes || 0,
        total_first_place_finishes: data.total_first_place_finishes || 0,
      });
    }
  }, [user]);

  // Fetch league members (simulated with profiles for now)
  const fetchLeagueMembers = useCallback(async () => {
    if (!user) return;

    // For now, fetch all users with league data and simulate ranking
    const { data: leagueData } = await supabase
      .from('user_leagues')
      .select(`
        id,
        user_id,
        weekly_xp,
        league_rank,
        current_league
      `)
      .eq('current_league', userLeague?.current_league || 'Bronze')
      .order('weekly_xp', { ascending: false })
      .limit(LEAGUE_SIZE);

    if (!leagueData) {
      setLeagueMembers([]);
      return;
    }

    // Fetch profile info for each member
    const userIds = leagueData.map(m => m.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, username, avatar_url, current_level')
      .in('user_id', userIds);

    const members: LeagueMember[] = leagueData.map((member, index) => {
      const profile = profiles?.find(p => p.user_id === member.user_id);
      return {
        id: member.id,
        user_id: member.user_id,
        username: profile?.username || 'Trader',
        avatar_url: profile?.avatar_url,
        current_level: profile?.current_level || 1,
        monthly_xp: member.weekly_xp || 0,
        league_rank: index + 1,
      };
    });

    setLeagueMembers(members);
  }, [user, userLeague?.current_league]);

  // Join league (first time)
  const joinLeague = useCallback(async () => {
    if (!user) return;

    const monthStart = getMonthStartDate();

    const { data, error } = await supabase
      .from('user_leagues')
      .insert([{
        user_id: user.id,
        current_league: 'Bronze',
        week_number: monthNumber, // Reusing week_number for month
        week_start_date: monthStart.toISOString().split('T')[0],
        weekly_xp: 0, // Reusing weekly_xp for monthly
        league_rank: LEAGUE_SIZE,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error joining league:', error);
      return;
    }

    if (data) {
      setUserLeague({
        id: data.id,
        user_id: data.user_id,
        current_league: data.current_league as LeagueName,
        league_group_id: data.league_group_id,
        league_rank: data.league_rank || LEAGUE_SIZE,
        month_number: data.week_number,
        monthly_xp: data.weekly_xp || 0,
        highest_league_reached: 'Bronze',
        total_promotions: 0,
        total_demotions: 0,
        months_participated: 0,
        total_top_3_finishes: 0,
        total_first_place_finishes: 0,
      });
    }
  }, [user, monthNumber]);

  // Update monthly XP (called when user earns XP)
  const updateMonthlyXP = useCallback(async (xpGained: number) => {
    if (!user || !userLeague) return;

    const newMonthlyXP = userLeague.monthly_xp + xpGained;

    const { error } = await supabase
      .from('user_leagues')
      .update({ 
        weekly_xp: newMonthlyXP, // Reusing weekly_xp for monthly
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating monthly XP:', error);
      return;
    }

    setUserLeague(prev => prev ? { ...prev, monthly_xp: newMonthlyXP } : null);
  }, [user, userLeague]);

  const refreshLeague = useCallback(async () => {
    setIsLoading(true);
    await fetchUserLeague();
    await fetchLeagueMembers();
    setIsLoading(false);
  }, [fetchUserLeague, fetchLeagueMembers]);

  // Initial load
  useEffect(() => {
    if (user) {
      refreshLeague();
    }
  }, [user, refreshLeague]);

  // Refetch members when league changes
  useEffect(() => {
    if (userLeague) {
      fetchLeagueMembers();
    }
  }, [userLeague?.current_league, fetchLeagueMembers]);

  // Create league result notification
  const createLeagueNotification = useCallback(async (
    type: 'promotion' | 'demotion' | 'top1' | 'top3' | 'top10' | 'monthly_result',
    finalRank: number,
    league: LeagueName,
    newLeague?: LeagueName
  ) => {
    if (!user) return;

    const leagueData = getLeagueConfig(league);
    const messages: Record<string, { title: string; message: string; notificationType: string }> = {
      promotion: {
        title: `🚀 Promotion en ${newLeague}!`,
        message: `Félicitations! Vous avez terminé #${finalRank} et montez en ligue ${newLeague}.`,
        notificationType: 'success'
      },
      demotion: {
        title: `📉 Relégation en ${newLeague}`,
        message: `Vous avez terminé #${finalRank} et descendez en ligue ${newLeague}. Continuez à gagner de l'XP!`,
        notificationType: 'warning'
      },
      top1: {
        title: `🏆 Champion du mois!`,
        message: `Incroyable! Vous êtes #1 en ligue ${leagueData.icon} ${league}! Récompenses débloquées.`,
        notificationType: 'achievement'
      },
      top3: {
        title: `🥇 Podium atteint!`,
        message: `Bravo! Vous avez terminé #${finalRank} en ligue ${leagueData.icon} ${league}!`,
        notificationType: 'success'
      },
      top10: {
        title: `⭐ Top 10 du mois!`,
        message: `Excellent! Vous avez terminé #${finalRank} en ligue ${leagueData.icon} ${league}.`,
        notificationType: 'success'
      },
      monthly_result: {
        title: `📊 Résultats mensuels`,
        message: `Mois terminé! Vous avez fini #${finalRank} en ligue ${leagueData.icon} ${league}.`,
        notificationType: 'info'
      }
    };

    const { title, message, notificationType } = messages[type];

    await supabase.from('notifications').insert({
      user_id: user.id,
      type: notificationType,
      title,
      message,
      action_url: '/league',
      action_label: 'Voir le classement'
    });
  }, [user]);

  // Process end of month results (call this when month changes)
  const processMonthlyResults = useCallback(async () => {
    if (!user || !userLeague) return;

    const currentRank = userLeague.league_rank || LEAGUE_SIZE;
    const league = userLeague.current_league as LeagueName;
    const nextLeague = getNextLeague(league);
    const prevLeague = getPreviousLeague(league);

    // Determine result type
    if (currentRank === 1) {
      await createLeagueNotification('top1', currentRank, league);
      if (nextLeague) {
        await createLeagueNotification('promotion', currentRank, league, nextLeague.name);
      }
    } else if (currentRank <= 3) {
      await createLeagueNotification('top3', currentRank, league);
      if (currentRank <= PROMOTION_ZONE && nextLeague) {
        await createLeagueNotification('promotion', currentRank, league, nextLeague.name);
      }
    } else if (currentRank <= PROMOTION_ZONE) {
      await createLeagueNotification('top10', currentRank, league);
      if (nextLeague) {
        await createLeagueNotification('promotion', currentRank, league, nextLeague.name);
      }
    } else if (currentRank > LEAGUE_SIZE - DEMOTION_ZONE && prevLeague) {
      await createLeagueNotification('demotion', currentRank, league, prevLeague.name);
    } else {
      await createLeagueNotification('monthly_result', currentRank, league);
    }
  }, [user, userLeague, createLeagueNotification]);

  return {
    userLeague,
    leagueConfig,
    leagueMembers,
    isLoading,
    monthNumber,
    daysLeft,
    joinLeague,
    refreshLeague,
    updateMonthlyXP,
    createLeagueNotification,
    processMonthlyResults,
  };
}
