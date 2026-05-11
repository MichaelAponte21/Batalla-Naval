import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore.js';
import { ABILITIES } from '../engine/abilities.js';

export default function AbilityBar() {
  const credits = useGameStore(s => s.credits);
  const activeAbility = useGameStore(s => s.activeAbility);
  const selectAbility = useGameStore(s => s.selectAbility);
  const useAbilityAt = useGameStore(s => s.useAbilityAt);
  const turn = useGameStore(s => s.turn);
  const shieldActive = useGameStore(s => s.shieldActive);
  const cancelAbility = useGameStore(s => s.cancelAbility);

  const handleClick = (id) => {
    if (id === 'shield') {
      // Trigger immediately
      if (credits < ABILITIES.shield.cost || shieldActive || turn !== 'player') return;
      // Use the shield by setting it active without coordinates
      selectAbility('shield');
      useAbilityAt(0, 0);
    } else {
      selectAbility(id);
    }
  };

  return (
    <div className="panel p-3 flex flex-col gap-2 min-w-[220px]">
      <div className="title text-sm mb-1">HABILIDADES</div>
      {Object.values(ABILITIES).map(ab => {
        const canAfford = credits >= ab.cost;
        const active = activeAbility === ab.id;
        const disabled = !canAfford || turn !== 'player' || (ab.id === 'shield' && shieldActive);
        return (
          <motion.button
            key={ab.id}
            onClick={() => handleClick(ab.id)}
            disabled={disabled}
            whileHover={!disabled ? { x: 4 } : undefined}
            whileTap={!disabled ? { scale: 0.97 } : undefined}
            className="panel px-3 py-2 flex items-center justify-between gap-2 text-left"
            style={{
              borderColor: active ? 'var(--warning)' : (canAfford ? 'var(--accent-soft)' : 'transparent'),
              opacity: disabled ? 0.4 : 1,
              boxShadow: active ? '0 0 15px var(--warning)' : undefined,
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
            title={ab.desc}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl" style={{ color: active ? 'var(--warning)' : 'var(--accent)' }}>{ab.icon}</span>
              <div className="flex flex-col">
                <span className="text-xs tracking-wider">{ab.name}</span>
                <span className="text-[10px] opacity-60">{ab.desc}</span>
              </div>
            </div>
            <span
              className="text-xs font-bold"
              style={{ color: canAfford ? 'var(--accent)' : '#888' }}
            >
              {ab.cost}◈
            </span>
          </motion.button>
        );
      })}
      {activeAbility && activeAbility !== 'shield' && (
        <button className="btn !py-1 text-xs mt-1" onClick={cancelAbility}>Cancelar</button>
      )}
    </div>
  );
}
