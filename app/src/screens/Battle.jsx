import { useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore.js';
import Board from '../components/Board.jsx';
import HUD from '../components/HUD.jsx';
import AbilityBar from '../components/AbilityBar.jsx';
import WeatherOverlay from '../components/WeatherOverlay.jsx';
import PassPCOverlay from '../components/PassPCOverlay.jsx';
import { Burst } from '../components/ParticleFX.jsx';
import RadarSweep from '../components/RadarSweep.jsx';
import WaterTrail from '../components/WaterTrail.jsx';
import AchievementToast from '../components/AchievementToast.jsx';
import { ABILITIES, radarCells, airstrikeCells, torpedoCells } from '../engine/abilities.js';
import { playFx } from '../hooks/useAudio.js';
import { useConfetti } from '../hooks/useConfetti.js';

export default function Battle() {
  const mode             = useGameStore(s => s.mode);
  const turn             = useGameStore(s => s.turn);
  const playerBoard      = useGameStore(s => s.playerBoard);
  const enemyBoard       = useGameStore(s => s.enemyBoard);
  const playerFleet      = useGameStore(s => s.playerFleet);
  const enemyFleet       = useGameStore(s => s.enemyFleet);
  const playerShoot      = useGameStore(s => s.playerShoot);
  const useAbilityAt     = useGameStore(s => s.useAbilityAt);
  const activeAbility    = useGameStore(s => s.activeAbility);
  const shotAnims        = useGameStore(s => s.shotAnims);
  const consumeAnim      = useGameStore(s => s.consumeAnim);
  const radarReveals     = useGameStore(s => s.radarReveals);
  const zoomTarget       = useGameStore(s => s.zoomTarget);
  const clearZoomTarget  = useGameStore(s => s.clearZoomTarget);
  const activeSkin       = useGameStore(s => s.activeSkin);
  const difficulty       = useGameStore(s => s.difficulty);
  const isLocal2P        = useGameStore(s => s.isLocal2P);
  const handoffPending   = useGameStore(s => s.handoffPending);
  const local2pAttacker  = useGameStore(s => s.local2pAttacker);
  const confirmHandoff   = useGameStore(s => s.confirmHandoff);

  useConfetti();

  const [airstrikeDir, setAirstrikeDir] = useState('horizontal');
  const [hoverEnemy, setHoverEnemy]     = useState(null);
  const [shakePlayer, setShakePlayer]   = useState(false);
  const [shakeEnemy, setShakeEnemy]     = useState(false);
  const [zoomEnemy, setZoomEnemy]       = useState(false);

  const playerBoardRef = useRef(null);
  const enemyBoardRef  = useRef(null);

  const abilityPreview = useMemo(() => {
    if (!activeAbility || !hoverEnemy || activeAbility === 'shield') return null;
    let cells = [];
    if (activeAbility === 'radar')     cells = radarCells(hoverEnemy.x, hoverEnemy.y);
    else if (activeAbility === 'airstrike') cells = airstrikeCells(hoverEnemy.x, hoverEnemy.y, airstrikeDir);
    else if (activeAbility === 'torpedo')   cells = torpedoCells(hoverEnemy.x, hoverEnemy.y);
    return { cells };
  }, [activeAbility, hoverEnemy, airstrikeDir]);

  useEffect(() => {
    if (shotAnims.length === 0) return;
    const a = shotAnims[shotAnims.length - 1];
    if (a.type === 'hit') {
      playFx(a.sunk ? 'sink' : 'explosion');
      if (a.side === 'player') { setShakePlayer(true); setTimeout(() => setShakePlayer(false), 450); }
      if (a.side === 'enemy')  { setShakeEnemy(true);  setTimeout(() => setShakeEnemy(false),  450); }
    } else if (a.type === 'miss') {
      playFx('splash');
    } else if (a.type === 'shield') {
      playFx('alert');
    }
  }, [shotAnims.length]);

  useEffect(() => {
    if (zoomTarget && zoomTarget.side === 'enemy') {
      setZoomEnemy(true);
      const t = setTimeout(() => { setZoomEnemy(false); clearZoomTarget(); }, 600);
      return () => clearTimeout(t);
    }
  }, [zoomTarget]);

  const handleEnemyClick = (x, y) => {
    if (turn !== 'player') return;
    playFx('shoot');
    if (activeAbility) useAbilityAt(x, y, airstrikeDir);
    else playerShoot(x, y);
  };

  const skinClass = `skin-${activeSkin}`;

  // In 2P, "enemy" label depends on who is attacking
  const ownLabel    = isLocal2P ? `Jugador ${local2pAttacker === 'p1' ? 1 : 2}` : 'Tu flota';
  const enemyLabel  = isLocal2P ? `Jugador ${local2pAttacker === 'p1' ? 2 : 1}` : 'Aguas enemigas';

  return (
    <div className="relative w-full h-full flex flex-col items-center p-4 gap-3 overflow-auto">
      <WeatherOverlay />
      <AchievementToast />

      <div className="w-full max-w-7xl relative z-10">
        <HUD />
      </div>

      {/* Difficulty badge — not shown in 2P */}
      {!isLocal2P && (
        <div className="relative z-10">
          <span className={`diff-badge diff-${difficulty}`}>
            vs {difficulty === 'recruit' ? 'Recluta' : difficulty === 'admiral' ? 'Almirante' : 'Tramposo'}
          </span>
        </div>
      )}

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-4 relative z-10 items-start justify-center">
        {/* Player / own board */}
        <div className="flex-1 flex flex-col items-center">
          <div className="title text-lg mb-2 opacity-80">{ownLabel}</div>
          <div className={`relative ${skinClass}`} ref={playerBoardRef}>
            <Board board={playerBoard} fleet={playerFleet} isOwn shaking={shakePlayer} />
            <RadarSweep mode={mode} />
            <WaterTrail containerRef={playerBoardRef} />
            <BurstLayer side="player" anims={shotAnims} onDone={consumeAnim} />
          </div>
        </div>

        {/* Abilities column (advanced only) */}
        {mode === 'advanced' && (
          <div className="flex flex-col gap-3 items-center self-stretch justify-center min-w-[230px]">
            <AbilityBar />
            {activeAbility === 'airstrike' && (
              <div className="panel p-2 flex gap-2 text-xs">
                <button className="btn !px-2 !py-1"
                  style={{ borderColor: airstrikeDir === 'horizontal' ? 'var(--accent)' : undefined }}
                  onClick={() => setAirstrikeDir('horizontal')}>↔</button>
                <button className="btn !px-2 !py-1"
                  style={{ borderColor: airstrikeDir === 'vertical' ? 'var(--accent)' : undefined }}
                  onClick={() => setAirstrikeDir('vertical')}>↕</button>
              </div>
            )}
            <TurnIndicator turn={turn} />
          </div>
        )}

        {mode !== 'advanced' && <TurnIndicator turn={turn} />}

        {/* Enemy / target board */}
        <div className="flex-1 flex flex-col items-center">
          <div className="title text-lg mb-2 opacity-80">{enemyLabel}</div>
          <motion.div
            className={`relative ${zoomEnemy ? 'zoom-hit' : ''}`}
            ref={enemyBoardRef}
            onMouseLeave={() => setHoverEnemy(null)}
          >
            <EnemyBoardWrapper onHover={setHoverEnemy}>
              <Board
                board={enemyBoard}
                fleet={enemyFleet}
                onCellClick={turn === 'player' ? handleEnemyClick : null}
                abilityPreview={abilityPreview}
                radarReveals={radarReveals}
                shaking={shakeEnemy}
              />
            </EnemyBoardWrapper>
            <WaterTrail containerRef={enemyBoardRef} />
            <BurstLayer side="enemy" anims={shotAnims} onDone={consumeAnim} />
          </motion.div>
          {activeAbility && (
            <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="mt-2 text-xs italic" style={{ color: 'var(--warning, var(--accent))' }}>
              ◈ {ABILITIES[activeAbility]?.name}: selecciona objetivo
            </motion.div>
          )}
        </div>
      </div>

      {/* 2P handoff overlay */}
      {isLocal2P && handoffPending && (
        <PassPCOverlay
          nextPlayer={local2pAttacker === 'p1' ? 2 : 1}
          phase="battle"
          onConfirm={confirmHandoff}
        />
      )}
    </div>
  );
}

function EnemyBoardWrapper({ children, onHover }) {
  return (
    <div onMouseMove={(e) => {
      const t = e.target;
      if (t?.classList?.contains('grid-cell')) {
        const allCells = t.parentElement.children;
        const idx = Array.from(allCells).indexOf(t);
        if (idx >= 0) onHover({ x: Math.floor(idx / 10), y: idx % 10 });
      }
    }}>
      {children}
    </div>
  );
}

function TurnIndicator({ turn }) {
  return (
    <motion.div key={turn} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className="panel px-4 py-2 text-center" style={{ minWidth: 140 }}>
      <div className="text-xs opacity-60">TURNO</div>
      <div className="text-lg font-bold tracking-wider"
        style={{ color: turn === 'player' ? 'var(--accent)' : '#ff6a6a' }}>
        {turn === 'player' ? 'TUYO' : 'ENEMIGO'}
      </div>
    </motion.div>
  );
}

function BurstLayer({ side, anims, onDone }) {
  const ours = anims.filter(a => a.side === side);
  if (ours.length === 0) return null;
  return (
    <div className="absolute inset-0 pointer-events-none"
      style={{ padding: '1.5rem 0 0 1.75rem' }}>
      <div className="absolute inset-0 grid"
        style={{ gridTemplateColumns: 'repeat(10, 1fr)', gridTemplateRows: 'repeat(10, 1fr)', gap: '2px', padding: '4px' }}>
        {ours.map(b => (
          <div key={b.id}
            style={{ gridColumn: b.y + 1, gridRow: b.x + 1, position: 'relative', pointerEvents: 'none' }}>
            <Burst type={b.type === 'hit' ? (b.sunk ? 'sink' : 'hit') : (b.type === 'shield' ? 'hit' : 'miss')}
                   onDone={() => onDone(b.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
