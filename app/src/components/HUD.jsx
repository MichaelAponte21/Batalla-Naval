import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore.js';
import { WEATHERS } from '../engine/weather.js';

export default function HUD() {
  const turn = useGameStore(s => s.turn);
  const mode = useGameStore(s => s.mode);
  const credits = useGameStore(s => s.credits);
  const weatherId = useGameStore(s => s.weatherId);
  const events = useGameStore(s => s.events);
  const playerFleet = useGameStore(s => s.playerFleet);
  const enemyFleet = useGameStore(s => s.enemyFleet);
  const shieldActive = useGameStore(s => s.shieldActive);
  const muted = useGameStore(s => s.muted);
  const toggleMute = useGameStore(s => s.toggleMute);
  const goToMenu = useGameStore(s => s.goToMenu);

  const playerAlive = playerFleet.filter(s => !s.sunk).length;
  const enemyAlive = enemyFleet.filter(s => !s.sunk).length;

  return (
    <div className="panel px-5 py-3 flex items-center gap-6 text-sm flex-wrap">
      <button className="btn !px-3 !py-1 text-xs" onClick={goToMenu}>← Menú</button>

      <div className="flex flex-col">
        <span className="opacity-60 text-[10px]">TURNO</span>
        <motion.span
          key={turn}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-bold tracking-wider"
          style={{ color: turn === 'player' ? 'var(--accent)' : '#ff6a6a' }}
        >
          {turn === 'player' ? 'TU TURNO' : 'ENEMIGO'}
        </motion.span>
      </div>

      <div className="flex flex-col">
        <span className="opacity-60 text-[10px]">FLOTA</span>
        <span>
          <span style={{ color: 'var(--accent)' }}>{playerAlive}</span>
          <span className="opacity-50"> vs </span>
          <span style={{ color: '#ff6a6a' }}>{enemyAlive}</span>
        </span>
      </div>

      {mode === 'advanced' && (
        <>
          <div className="flex flex-col">
            <span className="opacity-60 text-[10px]">CRÉDITOS</span>
            <motion.span
              key={credits}
              initial={{ scale: 1.2, color: '#ffd166' }}
              animate={{ scale: 1, color: 'var(--accent)' }}
              className="font-bold"
            >
              ◈ {credits}
            </motion.span>
          </div>
          <div className="flex flex-col">
            <span className="opacity-60 text-[10px]">CLIMA</span>
            <span style={{ color: 'var(--accent)' }}>{WEATHERS[weatherId].name}</span>
          </div>
          {shieldActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-1 panel"
              style={{ borderColor: 'var(--accent)' }}
            >
              ◈ ESCUDO ACTIVO
            </motion.div>
          )}
        </>
      )}

      <div className="flex-1 min-w-[200px] max-h-12 overflow-hidden">
        <AnimatePresence>
          {events.slice(0, 1).map(ev => (
            <motion.div
              key={ev.id}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              className="text-xs italic opacity-80"
            >
              » {ev.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        className="btn !px-3 !py-1 text-xs"
        onClick={toggleMute}
        title={muted ? 'Activar audio' : 'Silenciar'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
