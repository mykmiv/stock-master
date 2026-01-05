// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  date_format: string;
  compact_mode: boolean;
  animations_enabled: boolean;
  show_xp_in_header: boolean;
  
  // Email notifications
  email_daily_streak: boolean;
  email_new_lesson: boolean;
  email_weekly_summary: boolean;
  email_scanner_complete: boolean;
  email_portfolio_alerts: boolean;
  email_badge_unlocked: boolean;
  email_marketing: boolean;
  
  // In-app notifications
  desktop_notifications: boolean;
  sound_effects: boolean;
  
  // Scanner preferences
  confidence_threshold: number;
  auto_fetch_prices: boolean;
  include_fundamentals: boolean;
  include_news: boolean;
  save_scan_history: boolean;
  history_retention_days: number;
  
  // Trading preferences
  starting_cash: number;
  default_order_type: string;
  confirm_before_trade: boolean;
  show_pnl_mode: string;
}

const defaultSettings: Omit<UserSettings, 'id' | 'user_id'> = {
  theme: 'system',
  language: 'en',
  date_format: 'MM/DD/YYYY',
  compact_mode: false,
  animations_enabled: true,
  show_xp_in_header: true,
  email_daily_streak: true,
  email_new_lesson: false,
  email_weekly_summary: true,
  email_scanner_complete: true,
  email_portfolio_alerts: true,
  email_badge_unlocked: true,
  email_marketing: false,
  desktop_notifications: true,
  sound_effects: true,
  confidence_threshold: 70,
  auto_fetch_prices: true,
  include_fundamentals: true,
  include_news: true,
  save_scan_history: true,
  history_retention_days: 30,
  starting_cash: 100000,
  default_order_type: 'market',
  confirm_before_trade: true,
  show_pnl_mode: 'both',
};

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    if (!user) {
      setSettings(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data as UserSettings);
      } else {
        // Create default settings if none exist
        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newSettings as UserSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user || !settings) return false;

    try {
      const { error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  };

  return {
    settings: settings || { ...defaultSettings, id: '', user_id: '' } as UserSettings,
    isLoading,
    updateSettings,
    refreshSettings: fetchSettings,
  };
}
