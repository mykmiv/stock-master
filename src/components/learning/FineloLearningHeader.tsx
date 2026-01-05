import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function FineloLearningHeader() {
  const { profile } = useAuth();
  
  const streakDays = profile?.streak_days || 0;
  const totalCoins = (profile as any)?.coins || 0;

  return (
    <div className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 px-6 py-6 relative overflow-hidden">
      {/* StockMaster Logo */}
      <div className="absolute top-6 left-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-black text-2xl">S</span>
        </div>
      </div>

      {/* Top Stats Bar */}
      <div className="flex justify-end items-center gap-4 mb-8">
        {/* Daily Streak */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-lg text-gray-900">{streakDays}</span>
        </div>
        
        {/* Trading Coins */}
        <div className="flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full">
          <span className="text-xl">💰</span>
          <span className="font-bold text-lg text-amber-700">
            ${totalCoins.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="mb-4 relative z-10">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-purple-900 italic mb-2 leading-tight">
          Zero to Hero
          <br />
          Trading Path
        </h1>
        <button className="flex items-center gap-2 text-indigo-600 font-semibold text-base hover:text-indigo-700 transition-colors">
          View All Modules
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Stocky & Trading Characters - Top Right */}
      <div className="absolute -top-4 right-4 flex items-end gap-2">
        {/* Green Bull (Small) */}
        <div className="relative animate-bounce-slow" style={{ animationDelay: '0.2s' }}>
          <svg width="55" height="75" viewBox="0 0 55 75">
            {/* Green Bull Body */}
            <ellipse cx="27.5" cy="45" rx="20" ry="25" fill="#10B981" />
            {/* Head */}
            <circle cx="27.5" cy="28" r="16" fill="#10B981" />
            {/* Eyes */}
            <circle cx="22" cy="26" r="4" fill="white" />
            <circle cx="33" cy="26" r="4" fill="white" />
            <circle cx="23" cy="27" r="2" fill="#111" />
            <circle cx="34" cy="27" r="2" fill="#111" />
            {/* Smile */}
            <path d="M 20 32 Q 27.5 36 35 32" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Horns */}
            <path d="M 15 20 Q 12 12 15 8" stroke="#F59E0B" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 40 20 Q 43 12 40 8" stroke="#F59E0B" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Vest */}
            <ellipse cx="27.5" cy="50" rx="18" ry="15" fill="#059669" />
          </svg>
        </div>

        {/* Stocky - Main Character (Large) */}
        <div className="relative animate-bounce-slow">
          <svg width="95" height="125" viewBox="0 0 95 125">
            {/* Body */}
            <ellipse cx="47.5" cy="80" rx="36" ry="42" fill="#4F46E5" />
            {/* Arms */}
            <ellipse cx="20" cy="72" rx="13" ry="22" fill="#4F46E5" />
            <ellipse cx="75" cy="72" rx="13" ry="22" fill="#4F46E5" />
            {/* Head */}
            <circle cx="47.5" cy="48" r="26" fill="#4F46E5" />
            {/* Eyes - Happy */}
            <circle cx="38" cy="44" r="6" fill="white" />
            <circle cx="57" cy="44" r="6" fill="white" />
            <circle cx="39" cy="45" r="3" fill="#111" />
            <circle cx="58" cy="45" r="3" fill="#111" />
            {/* Big Smile */}
            <path d="M 34 54 Q 47.5 62 61 54" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Horns - Bull */}
            <path d="M 26 38 Q 20 26 26 20" stroke="#F59E0B" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M 69 38 Q 75 26 69 20" stroke="#F59E0B" strokeWidth="7" fill="none" strokeLinecap="round" />
            {/* Green Trading Vest */}
            <ellipse cx="47.5" cy="86" rx="30" ry="24" fill="#10B981" />
            {/* $ Symbol on vest */}
            <text x="42" y="92" fontSize="16" fill="white" fontWeight="bold">$</text>
          </svg>
        </div>

        {/* Red Bear (Small) */}
        <div className="relative animate-bounce-slow" style={{ animationDelay: '0.4s' }}>
          <svg width="55" height="75" viewBox="0 0 55 75">
            {/* Red Bear Body */}
            <ellipse cx="27.5" cy="45" rx="20" ry="25" fill="#EF4444" />
            {/* Head */}
            <circle cx="27.5" cy="28" r="16" fill="#EF4444" />
            {/* Angry Eyes */}
            <line x1="18" y1="24" x2="26" y2="26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="29" y1="26" x2="37" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="22" cy="27" r="2" fill="#111" />
            <circle cx="33" cy="27" r="2" fill="#111" />
            {/* Frown */}
            <path d="M 21 36 Q 27.5 33 34 36" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Ears */}
            <circle cx="15" cy="18" r="6" fill="#DC2626" />
            <circle cx="40" cy="18" r="6" fill="#DC2626" />
            {/* Vest */}
            <ellipse cx="27.5" cy="50" rx="18" ry="15" fill="#B91C1C" />
          </svg>
        </div>
      </div>

      {/* Decorative Chart Elements */}
      <div className="absolute top-6 right-20 opacity-30">
        <svg width="45" height="45" viewBox="0 0 45 45">
          <rect x="8" y="22" width="5" height="18" fill="#10B981" rx="2" />
          <line x1="10.5" y1="22" x2="10.5" y2="16" stroke="#10B981" strokeWidth="1.5" />
          <rect x="20" y="12" width="5" height="28" fill="#EF4444" rx="2" />
          <line x1="22.5" y1="12" x2="22.5" y2="6" stroke="#EF4444" strokeWidth="1.5" />
          <rect x="32" y="18" width="5" height="22" fill="#10B981" rx="2" />
          <line x1="34.5" y1="18" x2="34.5" y2="12" stroke="#10B981" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}
