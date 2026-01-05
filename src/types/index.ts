export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export type OrderType = 'market' | 'limit' | 'stop_loss' | 'trailing_stop';

export type OrderStatus = 'pending' | 'executed' | 'cancelled';

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  level: string | null;
  xp: number | null;
  coins: number | null;
  streak_days: number | null;
  last_activity_date: string | null;
  onboarding_completed: boolean | null;
  is_admin: boolean | null;
  risk_tolerance: string | null;
  trading_goals: string | null;
  lessons_completed: number | null;
  perfect_scores: number | null;
  current_level: number | null;
  user_level: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  level: UserLevel;
  order_index: number;
  xp_reward: number;
  duration_minutes: number;
  created_at: string;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  quiz_score: number | null;
  completed_at: string | null;
}

export interface Portfolio {
  id: string;
  user_id: string;
  cash_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Holding {
  id: string;
  portfolio_id: string;
  symbol: string;
  shares: number;
  average_cost: number;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  portfolio_id: string;
  symbol: string;
  order_type: OrderType;
  side: 'buy' | 'sell';
  shares: number;
  price: number;
  total_value: number;
  status: OrderStatus;
  executed_at: string;
}

export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface WatchlistItem {
  id: string;
  watchlist_id: string;
  symbol: string;
  added_at: string;
}

export interface ChartAnalysis {
  id: string;
  user_id: string;
  image_url: string | null;
  analysis_result: Record<string, unknown> | null;
  patterns_found: string[] | null;
  trend: string | null;
  support_levels: number[] | null;
  resistance_levels: number[] | null;
  recommendation: string | null;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

// Mock stock data type
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

// Quiz types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Badge definitions
export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold';
  requirement: string;
}
