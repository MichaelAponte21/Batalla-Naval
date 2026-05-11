export const SHIP_TYPES = [
  { id: 'carrier',    name: 'Portaviones', size: 5, count: 1 },
  { id: 'battleship', name: 'Acorazado',   size: 4, count: 1 },
  { id: 'submarine',  name: 'Submarino',   size: 3, count: 1 },
  { id: 'destroyer',  name: 'Destructor',  size: 2, count: 2 }
];

export function getInitialFleet() {
  const fleet = [];
  let uid = 0;
  for (const t of SHIP_TYPES) {
    for (let i = 0; i < t.count; i++) {
      fleet.push({
        uid: `${t.id}-${uid++}`,
        typeId: t.id,
        name: t.name,
        size: t.size,
        hits: 0,
        sunk: false,
        cells: []
      });
    }
  }
  return fleet;
}

export const TOTAL_SHIP_CELLS = SHIP_TYPES.reduce(
  (acc, t) => acc + t.size * t.count,
  0
);
