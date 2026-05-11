import { BOARD_SIZE, inBounds } from './board.js';

export const ABILITIES = {
  radar:   { id: 'radar',   name: 'Radar',         cost: 30, icon: '⊙', desc: 'Revela un área 3×3 enemiga durante 3s.' },
  airstrike:{ id: 'airstrike', name: 'Ataque Aéreo', cost: 50, icon: '✈', desc: 'Dispara 3 celdas en línea (fila o columna).' },
  shield:  { id: 'shield',  name: 'Escudo',        cost: 40, icon: '◈', desc: 'Bloquea el próximo disparo enemigo.' },
  torpedo: { id: 'torpedo', name: 'Torpedo',       cost: 35, icon: '⌖', desc: 'Dispara en cruz (5 celdas: centro + N/S/E/O).' }
};

export function radarCells(cx, cy) {
  const cells = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const x = cx + dx, y = cy + dy;
      if (inBounds(x, y)) cells.push([x, y]);
    }
  }
  return cells;
}

export function airstrikeCells(cx, cy, direction) {
  const cells = [];
  if (direction === 'horizontal') {
    for (let dy = -1; dy <= 1; dy++) {
      const y = cy + dy;
      if (inBounds(cx, y)) cells.push([cx, y]);
    }
  } else {
    for (let dx = -1; dx <= 1; dx++) {
      const x = cx + dx;
      if (inBounds(x, cy)) cells.push([x, cy]);
    }
  }
  return cells;
}

export function torpedoCells(cx, cy) {
  return [[cx,cy],[cx-1,cy],[cx+1,cy],[cx,cy-1],[cx,cy+1]]
    .filter(([x,y]) => inBounds(x,y));
}
