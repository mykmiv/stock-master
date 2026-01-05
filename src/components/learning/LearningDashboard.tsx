import React from 'react';
import { Trophy, Coins, Star } from 'lucide-react';
import { StockyCharacter } from '@/components/mascot/StockyCharacter';
import { StreakTracker } from '@/components/rewards/StreakTracker';
import { useAuth } from '@/hooks/useAuth';
import { LEVELS } from '@/types/lesson.types';

export function LearningDashboard() {
  const { profile } = useAuth();
  
  const userXP = profile?.xp || 0;
  const userCoins = (profile as any)?.coins || 0;
  const userStreak = profile?.streak_days || 0;
  
  // Calculate current level
  const currentLevel = LEVELS.reduce((level, lvl) => {
    return userXP >= lvl.xpRequired ? lvl.level : level;
  }, 1);
  
  const levelInfo = LEVELS.find(l => l.level === currentLevel) || LEVELS[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      {/* Top Stats Bar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Streak */}
              <StreakTracker streakDays={userStreak} />
              
              {/* XP */}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                <span className="font-bold text-lg">{userXP.toLocaleString()}</span>
                <span className="text-sm text-gray-500">XP</span>
              </div>
              
              {/* Coins */}
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-lg">{userCoins}</span>
                <span className="text-sm text-gray-500">coins</span>
              </div>
            </div>
            
            {/* Stocky Avatar & Level */}
            <div className="flex items-center gap-3">
              <StockyCharacter emotion="happy" size="small" />
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-500" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-gray-600">Niveau {currentLevel}</span>
                  <span className="text-xs text-gray-500">{levelInfo.title}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Selector */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Votre Parcours d'Apprentissage
          </h2>
          <select className="px-4 py-2 border rounded-lg bg-white text-sm">
            <option>Tous les modules</option>
            <option>Module 1: Fondamentaux</option>
            <option>Module 2: Analyse Technique</option>
            <option>Module 3: Analyse Technique Avancée</option>
            <option>Module 4: Stratégies de Trading</option>
            <option>Module 5: Psychologie & Gestion des Risques</option>
          </select>
        </div>
      </div>
    </div>
  );
}
