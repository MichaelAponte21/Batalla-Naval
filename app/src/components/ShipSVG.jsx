// Top-down ship silhouettes. Coordinates use normalized (l=length 0..1, w=width 0..1).
// Horizontal: x = l*size, y = w.  Vertical: x = w, y = l*size.

const SIZES = { carrier: 5, battleship: 4, submarine: 3, destroyer: 2 };

export default function ShipSVG({ typeId, vertical = false, sunk = false }) {
  const size = SIZES[typeId] ?? 2;
  const vw = vertical ? 1 : size;
  const vh = vertical ? size : 1;

  const pt = (l, w) => `${vertical ? w : l * size},${vertical ? l * size : w}`;
  const X  = (l, w) => vertical ? w : l * size;
  const Y  = (l, w) => vertical ? l * size : w;
  const sw = 0.025;

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        opacity: sunk ? 0.45 : 1,
        filter: sunk ? 'sepia(0.6) brightness(0.45)' : 'none',
        pointerEvents: 'none',
      }}
    >
      {typeId === 'carrier'    && <CarrierShape    pt={pt} X={X} Y={Y} sw={sw} />}
      {typeId === 'battleship' && <BattleshipShape pt={pt} X={X} Y={Y} sw={sw} />}
      {typeId === 'submarine'  && <SubmarineShape  pt={pt} X={X} Y={Y} sw={sw} />}
      {typeId === 'destroyer'  && <DestroyerShape  pt={pt} X={X} Y={Y} sw={sw} />}
    </svg>
  );
}

// ── Portaviones (5 cells) ─────────────────────────────────────────────────────
function CarrierShape({ pt, X, Y, sw }) {
  return (
    <>
      {/* Hull — wide flat deck */}
      <path
        d={`M ${pt(0.02,0.10)} L ${pt(0.88,0.10)} Q ${pt(1,0.50)} ${pt(0.88,0.90)} L ${pt(0.02,0.90)} Q ${pt(0,0.50)} ${pt(0.02,0.10)} Z`}
        fill="rgba(50,68,85,0.88)" stroke="var(--accent)" strokeWidth={sw}
      />
      {/* Island superstructure — aft, offset to one side */}
      <path
        d={`M ${pt(0.60,0.08)} L ${pt(0.84,0.08)} L ${pt(0.84,0.40)} L ${pt(0.60,0.40)} Z`}
        fill="var(--accent)" opacity="0.65"
      />
      {/* Flight deck centerline — dashed */}
      <line
        x1={X(0.05,0.52)} y1={Y(0.05,0.52)}
        x2={X(0.56,0.52)} y2={Y(0.56,0.52)}
        stroke="var(--accent)" strokeWidth={sw * 0.6} strokeDasharray="0.3 0.2" opacity="0.55"
      />
      {/* Bow highlight arc */}
      <path
        d={`M ${pt(0.86,0.12)} Q ${pt(1,0.50)} ${pt(0.86,0.88)}`}
        fill="none" stroke="var(--accent)" strokeWidth={sw * 1.4} opacity="0.35"
      />
    </>
  );
}

// ── Acorazado (4 cells) ───────────────────────────────────────────────────────
function BattleshipShape({ pt, X, Y, sw }) {
  return (
    <>
      {/* Hull */}
      <path
        d={`M ${pt(0.02,0.18)} L ${pt(0.88,0.18)} Q ${pt(1,0.50)} ${pt(0.88,0.82)} L ${pt(0.02,0.82)} Q ${pt(0,0.50)} ${pt(0.02,0.18)} Z`}
        fill="rgba(45,60,78,0.90)" stroke="var(--accent)" strokeWidth={sw}
      />
      {/* Fore main turret */}
      <circle cx={X(0.20,0.50)} cy={Y(0.20,0.50)} r={0.09} fill="var(--accent)" opacity="0.82" />
      {/* Aft turret */}
      <circle cx={X(0.66,0.50)} cy={Y(0.66,0.50)} r={0.08} fill="var(--accent)" opacity="0.65" />
      {/* Center bridge superstructure */}
      <path
        d={`M ${pt(0.36,0.30)} L ${pt(0.52,0.30)} L ${pt(0.52,0.70)} L ${pt(0.36,0.70)} Z`}
        fill="var(--accent)" opacity="0.45"
      />
    </>
  );
}

// ── Submarino (3 cells) ───────────────────────────────────────────────────────
function SubmarineShape({ pt, X, Y, sw }) {
  return (
    <>
      {/* Hull — elongated teardrop */}
      <path
        d={[
          `M ${pt(0.06,0.50)}`,
          `Q ${pt(0.08,0.20)} ${pt(0.32,0.18)}`,
          `L ${pt(0.68,0.18)}`,
          `Q ${pt(0.92,0.20)} ${pt(0.94,0.50)}`,
          `Q ${pt(0.92,0.80)} ${pt(0.68,0.82)}`,
          `L ${pt(0.32,0.82)}`,
          `Q ${pt(0.08,0.80)} ${pt(0.06,0.50)} Z`,
        ].join(' ')}
        fill="rgba(38,52,68,0.92)" stroke="var(--accent)" strokeWidth={sw}
      />
      {/* Conning tower (sail) */}
      <path
        d={`M ${pt(0.36,0.26)} L ${pt(0.58,0.26)} L ${pt(0.58,0.62)} L ${pt(0.36,0.62)} Z`}
        fill="var(--accent)" opacity="0.72"
      />
      {/* Periscope dot */}
      <circle
        cx={X(0.47,0.50)} cy={Y(0.47,0.50)} r={0.055}
        fill="rgba(0,0,0,0.55)" stroke="var(--accent)" strokeWidth={sw * 0.6}
      />
    </>
  );
}

// ── Destructor (2 cells) ──────────────────────────────────────────────────────
function DestroyerShape({ pt, X, Y, sw }) {
  return (
    <>
      {/* Hull — narrow, very pointed bow */}
      <path
        d={`M ${pt(0.03,0.38)} L ${pt(0.72,0.26)} Q ${pt(1,0.50)} ${pt(0.72,0.74)} L ${pt(0.03,0.62)} Q ${pt(0,0.50)} ${pt(0.03,0.38)} Z`}
        fill="rgba(42,56,72,0.90)" stroke="var(--accent)" strokeWidth={sw}
      />
      {/* Single main gun turret */}
      <circle cx={X(0.28,0.50)} cy={Y(0.28,0.50)} r={0.13} fill="var(--accent)" opacity="0.80" />
    </>
  );
}
