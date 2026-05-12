import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore.js';

const CATEGORY_PREFIX = {
  shot:   'SCANNER',
  radio:  'COMMS  ',
  system: 'SISTEMA',
  alert:  'ALERTA ',
};

function timestamp(ts) {
  const d = new Date(ts);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function TacticalLog() {
  const events = useGameStore(s => s.events);
  const listRef = useRef(null);

  // Auto-scroll to top (newest entry is always first in the array)
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [events.length]);

  return (
    <div className="tactical-log w-full" style={{ maxHeight: 110 }}>
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-3 py-1"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(0,0,0,0.4)',
        }}
      >
        <span style={{ color: 'var(--accent)', fontSize: '0.6rem', letterSpacing: '0.15em', fontWeight: 700 }}>
          ◈ BITÁCORA TÁCTICA
        </span>
        <span style={{ color: 'var(--accent)', fontSize: '0.6rem', opacity: 0.5 }}>
          {events.length} entradas
        </span>
      </div>

      {/* Log entries */}
      <div
        ref={listRef}
        className="overflow-y-auto px-3 py-1"
        style={{ maxHeight: 82 }}
      >
        <AnimatePresence initial={false}>
          {events.map(ev => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={`tactical-log-entry cat-${ev.category ?? 'shot'}`}
            >
              <span style={{ opacity: 0.45 }}>[{timestamp(ev.ts)}]</span>
              {' '}
              <span style={{ opacity: 0.7 }}>{CATEGORY_PREFIX[ev.category ?? 'shot']}:</span>
              {' '}
              {ev.msg}
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="tactical-log-entry cat-system" style={{ opacity: 0.4 }}>
            — En espera de actividad de combate —
          </div>
        )}
      </div>
    </div>
  );
}
