import { motion, AnimatePresence } from 'framer-motion';

/**
 * Lightweight particle bursts rendered as divs (no external lib needed for our scale).
 * Each burst auto-removes after its animation completes.
 */
export function Burst({ type, onDone, color }) {
  const count = type === 'sink' ? 18 : type === 'hit' ? 12 : 8;
  const particles = Array.from({ length: count });
  const palette = color || (type === 'hit' ? ['#ff7a3a', '#ffd166', '#fff'] :
                            type === 'sink' ? ['#ff3a1f', '#ff9633', '#222'] :
                            ['#a8d8ff', '#fff', '#5a9fd4']);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      onAnimationComplete={onDone}
    >
      {particles.map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 20 + Math.random() * (type === 'sink' ? 60 : 30);
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const size = 3 + Math.random() * (type === 'sink' ? 6 : 3);
        const c = palette[Math.floor(Math.random() * palette.length)];
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size,
              height: size,
              background: c,
              boxShadow: `0 0 ${size * 2}px ${c}`,
              marginLeft: -size / 2,
              marginTop: -size / 2
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y: y + (type === 'sink' ? 20 : 0), opacity: 0, scale: 0.4 }}
            transition={{ duration: type === 'sink' ? 1.0 : 0.6, ease: 'easeOut' }}
          />
        );
      })}
    </motion.div>
  );
}

/**
 * Renders a Burst on top of a specific cell, given a board container ref.
 */
export function CellBurstLayer({ boardSize = 10, bursts, onDone }) {
  // bursts: [{ id, x, y, type }]
  return (
    <div className="absolute inset-1 pointer-events-none" style={{ display: 'grid',
      gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
      gridTemplateRows: `repeat(${boardSize}, 1fr)`,
      gap: '2px'
    }}>
      <AnimatePresence>
        {bursts.map(b => (
          <div
            key={b.id}
            style={{ gridColumn: b.y + 1, gridRow: b.x + 1, position: 'relative' }}
          >
            <Burst type={b.type} onDone={() => onDone(b.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
