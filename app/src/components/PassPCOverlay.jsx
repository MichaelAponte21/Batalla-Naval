import { motion } from 'framer-motion';

export default function PassPCOverlay({ nextPlayer, phase, onConfirm }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'rgba(5,8,16,0.97)', backdropFilter: 'blur(10px)' }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.08 }}
        className="flex flex-col items-center gap-8 text-center px-8 max-w-md"
      >
        <div style={{ fontSize: '4rem' }}>🖥️</div>

        <div>
          <div
            className="title text-5xl mb-3"
            style={{ color: 'var(--accent)' }}
          >
            JUGADOR {nextPlayer}
          </div>
          <div className="text-xl opacity-80 mb-3">
            {phase === 'setup' ? 'Coloca tu flota' : 'Es tu turno de atacar'}
          </div>
          <div className="text-sm opacity-40 italic leading-relaxed">
            Pasa el equipo al Jugador {nextPlayer}
            <br />y asegúrate de que el otro no mire
          </div>
        </div>

        <motion.button
          className="btn text-lg px-10 py-4"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)', minWidth: 220 }}
          onClick={onConfirm}
          whileHover={{ scale: 1.05, boxShadow: '0 0 24px var(--accent)' }}
          whileTap={{ scale: 0.97 }}
        >
          ⚓ Estoy listo
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
