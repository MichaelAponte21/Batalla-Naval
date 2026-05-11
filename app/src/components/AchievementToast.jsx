import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore.js';
import { ACHIEVEMENTS } from '../engine/progression.js';

export default function AchievementToast() {
  const newAchievements = useGameStore(s => s.newAchievements);
  const clearNewAchievements = useGameStore(s => s.clearNewAchievements);

  useEffect(() => {
    if (newAchievements.length > 0) {
      const t = setTimeout(clearNewAchievements, 4500);
      return () => clearTimeout(t);
    }
  }, [newAchievements.length]);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {newAchievements.map(id => {
          const def = ACHIEVEMENTS.find(a => a.id === id);
          if (!def) return null;
          return (
            <motion.div
              key={id}
              initial={{ x: 80, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="panel px-4 py-3 flex items-center gap-3 min-w-[280px]"
              style={{ borderColor: 'var(--accent)', boxShadow: '0 0 20px var(--accent)' }}
            >
              <span className="text-3xl">{def.icon}</span>
              <div className="flex-1">
                <div className="text-xs opacity-60 tracking-wider">LOGRO DESBLOQUEADO</div>
                <div className="font-bold text-sm" style={{ color: 'var(--accent)' }}>{def.name}</div>
                <div className="text-xs opacity-70">{def.desc}</div>
              </div>
              <div className="text-xs font-bold" style={{ color: 'var(--accent)' }}>+{def.reward}◈</div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
