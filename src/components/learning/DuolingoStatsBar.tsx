import React from 'react';
import { Flame, Zap, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function DuolingoStatsBar() {
  const { profile } = useAuth();
  
  const totalXP = profile?.xp || 0;
  const streakDays = profile?.streak_days || 0;
  const energy = 5; // Default energy/hearts

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        {/* Flag with notification */}
        <div className="relative">
          <div className="w-8 h-6 rounded-sm overflow-hidden shadow-sm">
            <div className="w-full h-1/3 bg-blue-600" />
            <div className="w-full h-1/3 bg-white" />
            <div className="w-full h-1/3 bg-red-500" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600 to-yellow-400 opacity-80 rounded-full blur-sm -z-10" />
          </div>
          <span className="font-extrabold text-orange-500 text-lg">
            {streakDays}
          </span>
        </div>

        {/* XP/Gems */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg rotate-45 flex items-center justify-center shadow-md">
            <div className="w-3 h-3 bg-sky-200/50 rounded-sm -rotate-45" />
          </div>
          <span className="font-extrabold text-sky-500 text-lg">
            {totalXP}
          </span>
        </div>

        {/* Energy/Hearts */}
        <div className="flex items-center gap-1.5">
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
          <span className="font-extrabold text-pink-500 text-lg">
            {energy}
          </span>
        </div>
      </div>
    </div>
  );
}
