// @ts-nocheck
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useMarketHours } from '@/hooks/useMarketHours';
import { Progress } from '@/components/ui/progress';
import { Flame, Star, TrendingUp, Target } from 'lucide-react';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { DailyChallenge } from '@/components/dashboard/DailyChallenge';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { PortfolioPerformanceChart } from '@/components/dashboard/PortfolioPerformanceChart';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { profile } = useAuth();
  const { marketStatus, statusText } = useMarketHours();
  const xpProgress = profile ? (profile.xp % 100) : 0;
  const currentLevel = profile ? Math.floor(profile.xp / 100) + 1 : 1;

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Duolingo-style Header with Avatar + Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar with level badge */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="relative"
            >
              <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-white font-black text-2xl shadow-lg">
                {profile?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-warning flex items-center justify-center text-xs font-black text-black shadow-md border-2 border-background">
                {currentLevel}
              </div>
            </motion.div>

            {/* Username + Welcome */}
            <div>
              <h1 className="text-2xl font-black text-foreground">
                {profile?.username || 'Trader'}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                Keep learning! 
                <span className="inline-block animate-bounce-subtle">🚀</span>
              </p>
            </div>
          </div>

          {/* Stats compacts à droite */}
          <div className="hidden md:flex items-center gap-3">
            {/* Streak */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-red"
            >
              <Flame className="h-5 w-5 text-destructive" />
              <span className="font-black text-destructive">{profile?.streak_days || 0}</span>
            </motion.div>
            {/* XP */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-orange"
            >
              <Star className="h-5 w-5 text-warning fill-warning" />
              <span className="font-black text-amber-700 dark:text-warning">{profile?.xp || 0}</span>
            </motion.div>
            {/* Market Status */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className={cn(
                "h-2.5 w-2.5 rounded-full",
                marketStatus === 'open' && "bg-success animate-pulse",
                marketStatus === 'extended' && "bg-warning animate-pulse",
                marketStatus === 'closed' && "bg-muted-foreground"
              )} />
              <span className="font-semibold">
                {marketStatus === 'open' && "Market Open"}
                {marketStatus === 'extended' && "Extended Hours"}
                {marketStatus === 'closed' && "Market Closed"}
              </span>
            </motion.div>
          </div>
        </div>

        {/* XP Progress Bar - Duolingo Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 p-5 border-2 border-primary/20"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-muted-foreground">Level {currentLevel}</p>
              <p className="text-xs text-muted-foreground">{xpProgress} / 100 XP</p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-gradient">
            <div 
              className="progress-gradient-fill flex items-center justify-end pr-2"
              style={{ width: `${Math.max(xpProgress, 5)}%` }}
            >
              {xpProgress > 10 && (
                <Star className="h-3 w-3 text-white fill-white animate-pulse" />
              )}
            </div>
          </div>
          
          <p className="text-xs text-center mt-2 text-muted-foreground font-semibold">
            {100 - xpProgress} XP to Level {currentLevel + 1}
          </p>
        </motion.div>

        {/* Stats Grid - Duolingo Style Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {/* XP Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="stat-card bg-gradient-orange"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="icon-circle bg-warning">
                <Star className="h-6 w-6 text-white fill-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-amber-700 dark:text-warning">{profile?.xp || 0}</p>
                <p className="text-xs font-bold text-muted-foreground">Total XP</p>
              </div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="stat-card bg-gradient-red"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="icon-circle bg-destructive animate-pulse">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-destructive">{profile?.streak_days || 0}</p>
                <p className="text-xs font-bold text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </motion.div>

          {/* Level Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="stat-card bg-gradient-emerald"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="icon-circle bg-success">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-success capitalize">{profile?.level || 'beginner'}</p>
                <p className="text-xs font-bold text-muted-foreground">Your Level</p>
              </div>
            </div>
          </motion.div>

          {/* Readiness Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="stat-card bg-gradient-blue"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="icon-circle bg-secondary">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-secondary">{profile?.readiness_score || 0}%</p>
                <p className="text-xs font-bold text-muted-foreground">Readiness</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Market Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-black mb-3">Market Overview</h2>
          <MarketOverview />
        </motion.div>

        {/* Portfolio Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <PortfolioPerformanceChart />
        </motion.div>

        {/* Quick Actions + Daily Challenge */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            <h2 className="text-lg font-black">Quick Actions</h2>
            <QuickActions />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <DailyChallenge />
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
