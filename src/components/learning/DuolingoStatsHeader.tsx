import React from 'react';
import { Star, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { LEVELS } from '@/types/lesson.types';
import { StreakTracker } from '@/components/rewards/StreakTracker';

export function StatsHeader() {
  const { profile } = useAuth();
  
  const totalXP = profile?.xp || 0;
  const totalCoins = (profile as any)?.coins || 0;
  const streakDays = profile?.streak_days || 0;
  
  // Calculate current level
  const currentLevel = LEVELS.reduce((level, lvl) => {
    return totalXP >= lvl.xpRequired ? lvl.level : level;
  }, 1);
  
  const levelInfo = LEVELS.find(l => l.level === currentLevel) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === currentLevel + 1);
  const xpInCurrentLevel = totalXP - levelInfo.xpRequired;
  const xpNeededForNext = nextLevel ? nextLevel.xpRequired - totalXP : 0;
  const progressPercent = nextLevel 
    ? ((xpInCurrentLevel / (nextLevel.xpRequired - levelInfo.xpRequired)) * 100)
    : 100;

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Streak */}
          <div className="flex items-center gap-3">
            <StreakTracker streakDays={streakDays} />
          </div>

          {/* Center: XP & Level */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-bold text-lg text-gray-900">
                  {totalXP.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-600">Total XP</p>
            </div>

            {/* Level badge */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full shadow-lg">
              <p className="text-xs font-medium">Niveau</p>
              <p className="text-xl font-black text-center">{currentLevel}</p>
            </div>
          </div>

          {/* Right: Coins */}
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-gray-600 text-right">Coins</p>
              <p className="font-bold text-sm text-gray-900">
                💰 {totalCoins}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar to next level */}
        {nextLevel && (
          <div className="mt-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center mt-1">
              {xpNeededForNext} XP pour le niveau {currentLevel + 1}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
