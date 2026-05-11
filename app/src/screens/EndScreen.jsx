import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore.js';
import AchievementToast from '../components/AchievementToast.jsx';
import { useConfetti } from '../hooks/useConfetti.js';

export default function EndScreen() {
  const winner          = useGameStore(s => s.winner);
  const mode            = useGameStore(s => s.mode);
  const difficulty      = useGameStore(s => s.difficulty);
  const coins           = useGameStore(s => s.coins);
  const isLocal2P       = useGameStore(s => s.isLocal2P);
  const local2pAttacker = useGameStore(s => s.local2pAttacker);
  const goToMenu        = useGameStore(s => s.goToMenu);
  const startMode       = useGameStore(s => s.startMode);

  useConfetti();

  const playerWon = winner === 'player';

  // In 2P, 'player' is the current attacker — identify them by number
  const winnerLabel = isLocal2P
    ? `¡JUGADOR ${local2pAttacker === 'p1' ? 1 : 2} GANA!`
    : (playerWon ? '¡VICTORIA!' : 'DERROTA');

  const coinReward = playerWon
    ? (mode === 'advanced' ? (difficulty === 'cheater' ? 200 : difficulty === 'admiral' ? 120 : 60) : 40)
    : 0;

  // Revancha restarts the same mode (including local2p)
  const rematchMode = isLocal2P ? 'local2p' : mode;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8 relative">
      <AchievementToast />

      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: -30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="title text-5xl md:text-7xl text-center"
        style={{ color: playerWon ? 'var(--accent)' : '#ff6a6a' }}
      >
        {winnerLabel}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg opacity-80 italic text-center"
      >
        {playerWon
          ? 'Has hundido toda la flota enemiga.'
          : 'Tu flota descansa en las profundidades.'}
      </motion.div>

      {playerWon && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 250 }}
          className="panel px-6 py-3 flex items-center gap-3"
          style={{ borderColor: 'var(--accent)' }}
        >
          <span className="text-2xl" style={{ color: 'var(--accent)' }}>◈</span>
          <div>
            <div className="text-xs opacity-60">MONEDAS GANADAS</div>
            <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>+{coinReward}</div>
          </div>
          <div className="ml-4 pl-4 border-l" style={{ borderColor: 'var(--accent)' }}>
            <div className="text-xs opacity-60">TOTAL</div>
            <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{coins}</div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4 mt-4"
      >
        <button className="btn" onClick={() => startMode(rematchMode)}>↻ Revancha</button>
        <button className="btn" onClick={goToMenu}>Menú principal</button>
      </motion.div>
    </div>
  );
}
