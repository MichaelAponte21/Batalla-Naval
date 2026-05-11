// Absolute grid overlay inside Board's grid div.
// Renders ShipSVG silhouettes spanning their occupied cells.
// On own board: shows all placed ships.
// On enemy board: shows only sunk ships (revealed after sinking).

import ShipSVG from './ShipSVG.jsx';

export default function ShipLayer({ fleet, isOwn }) {
  if (!fleet) return null;
  const ships = fleet.filter(s => s.cells?.length > 0 && (isOwn || s.sunk));
  if (ships.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gridTemplateRows: 'repeat(10, 1fr)',
        gap: '2px',
        padding: '4px',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {ships.map(ship => {
        const cells = ship.cells;
        const xs = cells.map(([x]) => x);
        const ys = cells.map(([, y]) => y);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        const vertical = ship.orientation === 'vertical';

        return (
          <div
            key={ship.uid}
            style={{
              gridRow: `${minX + 1} / ${maxX + 2}`,
              gridColumn: `${minY + 1} / ${maxY + 2}`,
              position: 'relative',
            }}
          >
            <ShipSVG typeId={ship.typeId} vertical={vertical} sunk={ship.sunk} />
          </div>
        );
      })}
    </div>
  );
}
