import { motion } from 'framer-motion';
import { CellState } from '../engine/board.js';

export default function Cell({
  x, y, value, isOwn = false, preview = null, hovered = false,
  revealedByRadar = false, onClick, onHover, onLeave, disabled
}) {
  const classes = ['grid-cell'];
  if (disabled) classes.push('no-interact');

  if (value === CellState.HIT) classes.push('shot', 'hit');
  else if (value === CellState.MISS) classes.push('shot', 'miss');
  else if (value === CellState.SHIP && isOwn) classes.push('ship-own');
  else if (value === CellState.SHIP && revealedByRadar) classes.push('ship-own');

  if (preview === 'valid') classes.push('preview-valid');
  if (preview === 'invalid') classes.push('preview-invalid');
  if (revealedByRadar) classes.push('radar-reveal');

  return (
    <motion.div
      className={classes.join(' ')}
      onClick={disabled ? undefined : () => onClick?.(x, y)}
      onMouseEnter={() => onHover?.(x, y)}
      onMouseLeave={() => onLeave?.(x, y)}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      layout={false}
    >
      {value === CellState.HIT && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-base font-bold pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          style={{ color: '#fff', textShadow: '0 0 6px rgba(0,0,0,0.7)' }}
        >
          ✕
        </motion.div>
      )}
      {value === CellState.MISS && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </motion.div>
      )}
    </motion.div>
  );
}
