import React from 'react';
import { motion } from 'framer-motion';
import { Star, Lock, Video, Gift, Headphones, Check } from 'lucide-react';
import { LessonWithProgress } from '@/types/lesson.types';

interface DuolingoPathNodeProps {
  lesson: LessonWithProgress;
  onLessonClick: (lesson: LessonWithProgress) => void;
  index: number;
  isCurrent?: boolean;
}

export function DuolingoPathNode({ 
  lesson, 
  onLessonClick, 
  index,
  isCurrent = false
}: DuolingoPathNodeProps) {
  const isCompleted = lesson.isCompleted;
  const isLocked = lesson.isLocked && !isCurrent;
  const isActive = isCurrent || (!isLocked && !isCompleted);

  // Different icons based on lesson type or index
  const getIcon = () => {
    if (isCompleted) {
      return <Check className="w-8 h-8 text-white" strokeWidth={3} />;
    }
    
    const iconIndex = index % 4;
    const iconClass = isLocked ? "w-8 h-8 text-gray-400" : "w-8 h-8 text-white";
    
    switch (iconIndex) {
      case 0:
        return <Star className={iconClass} fill={isLocked ? "transparent" : "white"} />;
      case 1:
        return <Video className={iconClass} />;
      case 2:
        return <Gift className={iconClass} />;
      case 3:
        return <Headphones className={iconClass} />;
      default:
        return <Star className={iconClass} fill={isLocked ? "transparent" : "white"} />;
    }
  };

  // Progress percentage (mock for now)
  const progressPercent = isCompleted ? 100 : isCurrent ? 70 : 0;

  const handleClick = () => {
    if (!isLocked) {
      onLessonClick(lesson);
    }
  };

  return (
    <div className="relative">
      {/* Progress ring for active node */}
      {isCurrent && (
        <svg className="absolute -inset-2 w-24 h-24" viewBox="0 0 96 96">
          {/* Background ring */}
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="#E5E5E5"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <motion.circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="#58CC02"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progressPercent / 100)}`}
            transform="rotate(-90 48 48)"
            initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - progressPercent / 100) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
      )}

      <motion.button
        onClick={handleClick}
        disabled={isLocked}
        whileHover={!isLocked ? { scale: 1.05 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          border-4 transition-all duration-200
          ${isCompleted 
            ? 'bg-[#58CC02] border-[#46A302] shadow-[0_6px_0_#3D8C02]' 
            : isCurrent
            ? 'bg-[#58CC02] border-white shadow-[0_6px_0_#3D8C02,0_0_20px_rgba(88,204,2,0.4)]'
            : isLocked 
            ? 'bg-[#E5E5E5] border-[#D0D0D0] shadow-[0_4px_0_#B8B8B8] cursor-not-allowed' 
            : 'bg-[#58CC02] border-[#46A302] shadow-[0_6px_0_#3D8C02]'
          }
        `}
        style={isCurrent ? { 
          animation: 'pulse-glow 2s ease-in-out infinite'
        } : {}}
      >
        {getIcon()}

        {/* Lock overlay for locked lessons */}
        {isLocked && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-gray-500" />
          </div>
        )}
      </motion.button>

      {/* Lesson number badge */}
      {!isLocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-md"
        >
          <span className="text-xs font-bold text-gray-700">
            {lesson.lesson_number || index + 1}
          </span>
        </motion.div>
      )}
    </div>
  );
}
