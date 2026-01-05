import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { StockyCharacter } from '@/components/mascot/StockyCharacter';

export function DuolingoTimerWidget() {
  const [time, setTime] = useState({ hours: 0, minutes: 5, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev;
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
          if (minutes >= 60) {
            minutes = 0;
            hours++;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-24 left-4 z-40"
    >
      <div 
        className="relative rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg"
        style={{ backgroundColor: '#1F3A51' }}
      >
        {/* Sparkle decorations */}
        <motion.div
          className="absolute -top-2 -left-1"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </motion.div>
        <motion.div
          className="absolute -top-1 -right-2"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          <Sparkles className="w-3 h-3 text-yellow-300" />
        </motion.div>

        {/* Mini Stocky icon */}
        <div className="w-8 h-8 rounded-full bg-[#58CC02] flex items-center justify-center overflow-hidden">
          <span className="text-lg">🦉</span>
        </div>

        {/* Timer display */}
        <div className="font-mono text-white font-bold text-lg tracking-wider">
          {formatNumber(time.hours)}:{formatNumber(time.minutes)}:{formatNumber(time.seconds)}
        </div>
      </div>
    </motion.div>
  );
}
