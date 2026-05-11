import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore.js';
import { WEATHERS } from '../engine/weather.js';

export default function WeatherOverlay() {
  const weatherId = useGameStore(s => s.weatherId);
  const mode = useGameStore(s => s.mode);
  if (mode !== 'advanced') return null;
  const w = WEATHERS[weatherId];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={weatherId}
        className={`absolute inset-0 pointer-events-none weather-${weatherId}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {weatherId === 'fog' && (
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(120,140,160,0.35) 100%)'
          }} />
        )}
        {weatherId === 'storm' && (
          <>
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(180deg, rgba(0,0,30,0.3), rgba(0,0,0,0.5))'
            }} />
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px bg-cyan-200/40"
                style={{
                  height: 20 + Math.random() * 30,
                  left: `${Math.random() * 100}%`,
                  top: -40
                }}
                animate={{ y: '110vh' }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'linear'
                }}
              />
            ))}
          </>
        )}
        {weatherId === 'bonus' && (
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at center, rgba(0,229,255,0.08), transparent 60%)'
          }} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
