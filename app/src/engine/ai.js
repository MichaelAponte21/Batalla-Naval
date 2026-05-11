import { BOARD_SIZE, CellState, inBounds } from './board.js';

export const DIFFICULTIES = {
  recruit: { id: 'recruit',  label: 'Recluta',   desc: 'Disparos al azar' },
  admiral: { id: 'admiral',  label: 'Almirante',  desc: 'Búsqueda táctica + análisis de probabilidad' },
  cheater: { id: 'cheater',  label: 'Tramposo',   desc: 'Almirante + usa habilidades especiales' }
};

export function createAIState(difficulty = 'admiral') {
  return { mode: 'HUNT', queue: [], lastHits: [], difficulty };
}

function cellTried(board, x, y) {
  const c = board[x][y];
  return c === CellState.HIT || c === CellState.MISS;
}

function neighbors(x, y) {
  return [[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(([a,b]) => inBounds(a,b));
}

// ────────────────────────── RECLUTA ──────────────────────────
function recruitShot(board) {
  const cands = [];
  for (let i = 0; i < BOARD_SIZE; i++)
    for (let j = 0; j < BOARD_SIZE; j++)
      if (!cellTried(board, i, j)) cands.push([i,j]);
  return cands[Math.floor(Math.random() * cands.length)];
}

// ────────────────────────── ALMIRANTE ──────────────────────────
/**
 * Build a probability density map: for each cell, how many possible ship
 * placements (of any remaining ship size) can cover it.
 */
function buildProbabilityMap(board, remainingSizes) {
  const prob = Array.from({ length: BOARD_SIZE }, () => new Array(BOARD_SIZE).fill(0));
  const orientations = ['h', 'v'];
  for (const size of remainingSizes) {
    for (const ori of orientations) {
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const cells = [];
          let valid = true;
          for (let k = 0; k < size; k++) {
            const rr = ori === 'h' ? r : r + k;
            const cc = ori === 'h' ? c + k : c;
            if (!inBounds(rr, cc) || board[rr][cc] === CellState.MISS) { valid = false; break; }
            cells.push([rr, cc]);
          }
          if (valid) cells.forEach(([rr, cc]) => { prob[rr][cc]++; });
        }
      }
    }
  }
  // Zero out already-tried cells
  for (let i = 0; i < BOARD_SIZE; i++)
    for (let j = 0; j < BOARD_SIZE; j++)
      if (cellTried(board, i, j)) prob[i][j] = 0;
  return prob;
}

function admiralShot(board, ai, remainingSizes) {
  // Drain target queue (from prior hit)
  while (ai.queue.length > 0) {
    const [x, y] = ai.queue.shift();
    if (!cellTried(board, x, y)) return [x, y];
  }
  // Probability hunt
  const prob = buildProbabilityMap(board, remainingSizes);
  let best = -1, bestCells = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      // Parity filter for efficiency (checkerboard)
      if ((i + j) % 2 !== 0) continue;
      if (prob[i][j] > best) { best = prob[i][j]; bestCells = [[i,j]]; }
      else if (prob[i][j] === best) bestCells.push([i,j]);
    }
  }
  if (bestCells.length === 0) {
    // Fallback: any untried
    for (let i = 0; i < BOARD_SIZE; i++)
      for (let j = 0; j < BOARD_SIZE; j++)
        if (!cellTried(board, i, j)) return [i,j];
  }
  return bestCells[Math.floor(Math.random() * bestCells.length)];
}

// ────────────────────────── PUBLIC ──────────────────────────
export function aiChooseShot(board, ai, remainingSizes = [5,4,3,2,2]) {
  if (ai.difficulty === 'recruit') return recruitShot(board);
  // admiral + cheater both use probability map in target phase
  return admiralShot(board, ai, remainingSizes);
}

/**
 * Whether the cheater AI should deploy an ability this turn.
 * Returns ability id or null.
 */
export function cheaterChooseAbility(turn, credits, aiFleetDmg) {
  if (turn % 4 !== 0) return null; // only every 4 turns
  if (credits < 30) return null;
  // Prefer torpedo if it has credits, else radar to find player ships
  if (credits >= 50 && Math.random() < 0.3) return 'airstrike';
  if (credits >= 35 && Math.random() < 0.4) return 'torpedo';
  return null;
}

export function aiOnResult(ai, x, y, result, sunk) {
  if (result === 'hit') {
    ai.lastHits.push([x, y]);
    if (sunk) {
      ai.mode = 'HUNT';
      ai.queue = [];
      ai.lastHits = [];
    } else {
      ai.mode = 'TARGET';
      if (ai.lastHits.length >= 2) {
        const [a, b] = ai.lastHits.slice(-2);
        const dx = b[0] - a[0], dy = b[1] - a[1];
        const next = [b[0] + dx, b[1] + dy];
        const prev = [a[0] - dx, a[1] - dy];
        ai.queue = [next, prev].filter(([nx, ny]) => inBounds(nx, ny));
      } else {
        ai.queue.push(...neighbors(x, y));
      }
    }
  } else if (result === 'miss' && ai.mode === 'TARGET' && ai.lastHits.length >= 2) {
    const first = ai.lastHits[0];
    const last = ai.lastHits[ai.lastHits.length - 1];
    const dx = Math.sign(last[0] - first[0]);
    const dy = Math.sign(last[1] - first[1]);
    const back = [first[0] - dx, first[1] - dy];
    if (inBounds(back[0], back[1])) ai.queue.unshift(back);
  }
}
