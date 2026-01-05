// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TreasureChestProps {
  dayNumber: number;
}

export function TreasureChest({ dayNumber }: TreasureChestProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    if (claimed || !user) return;
    
    const rewards = {
      xp: 100,
      coins: 50
    };
    
    // Animate chest opening
    setIsOpen(true);
    
    try {
      // Award rewards
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, coins')
        .eq('id', user.id)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            xp: (profile.xp || 0) + rewards.xp,
            coins: (profile.coins || 0) + rewards.coins,
          })
          .eq('id', user.id);
      }
      
      setClaimed(true);
      
      // Show reward popup
      toast.success(`Jour ${dayNumber} Complété! +${rewards.xp} XP, +${rewards.coins} coins! 🎉`, {
        duration: 5000,
      });
    } catch (error) {
      console.error('Error claiming treasure:', error);
      toast.error('Erreur lors de la réclamation du trésor');
    }
  };

  return (
    <motion.button
      onClick={handleClaim}
      disabled={claimed}
      whileHover={!claimed ? { scale: 1.1 } : {}}
      whileTap={!claimed ? { scale: 0.95 } : {}}
      className="relative group"
    >
      {/* Sparkles */}
      {!claimed && (
        <>
          <motion.span
            className="absolute -top-4 -left-4 text-2xl"
            animate={{
              y: [0, -10, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0,
            }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute -top-4 -right-4 text-2xl"
            animate={{
              y: [0, -10, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.3,
            }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-2xl"
            animate={{
              y: [0, 10, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.6,
            }}
          >
            ✨
          </motion.span>
        </>
      )}

      {/* Chest SVG */}
      <svg 
        width="120" 
        height="120" 
        viewBox="0 0 120 120"
        className="drop-shadow-lg"
      >
        {/* Chest body */}
        <motion.rect
          x="20"
          y={isOpen ? 70 : 50}
          width="80"
          height="50"
          fill="#8B4513"
          stroke="#654321"
          strokeWidth="2"
          rx="5"
          animate={{
            y: isOpen ? 70 : 50,
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Chest lid */}
        <motion.g
          animate={{
            rotate: isOpen ? -45 : 0,
            transformOrigin: '60px 50px',
          }}
          transition={{ duration: 0.5 }}
        >
          <rect
            x="20"
            y={isOpen ? 20 : 40}
            width="80"
            height="30"
            fill="#A0522D"
            stroke="#654321"
            strokeWidth="2"
            rx="5"
          />
        </motion.g>
        
        {/* Lock */}
        {!claimed && !isOpen && (
          <circle cx="60" cy="55" r="8" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
        )}

        {/* Rewards inside (when open) */}
        {isOpen && (
          <motion.g
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            <text x="35" y="60" fontSize="24">💎</text>
            <text x="65" y="60" fontSize="24">💰</text>
          </motion.g>
        )}
      </svg>

      {/* Label */}
      <div className="mt-2 text-center">
        <p className="text-sm font-bold text-purple-700">
          {claimed ? '✓ Réclamé!' : '🎁 Clique pour réclamer!'}
        </p>
        <p className="text-xs text-gray-600">
          +100 XP, +50 coins
        </p>
      </div>
    </motion.button>
  );
}
