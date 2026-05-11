export const BOARD_SIZE = 10;

export const CellState = {
  WATER: 'water',
  SHIP:  'ship',
  HIT:   'hit',
  MISS:  'miss'
};

export function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => CellState.WATER)
  );
}

export function inBounds(x, y) {
  return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

export function getShipCells(x, y, size, orientation) {
  const cells = [];
  for (let i = 0; i < size; i++) {
    const cx = orientation === 'horizontal' ? x : x + i;
    const cy = orientation === 'horizontal' ? y + i : y;
    cells.push([cx, cy]);
  }
  return cells;
}

export function canPlace(board, x, y, size, orientation) {
  const cells = getShipCells(x, y, size, orientation);
  for (const [cx, cy] of cells) {
    if (!inBounds(cx, cy)) return false;
    if (board[cx][cy] !== CellState.WATER) return false;
  }
  return true;
}

export function placeShip(board, ship, x, y, orientation) {
  const cells = getShipCells(x, y, ship.size, orientation);
  if (!cells.every(([cx, cy]) => inBounds(cx, cy) && board[cx][cy] === CellState.WATER)) {
    return false;
  }
  for (const [cx, cy] of cells) board[cx][cy] = CellState.SHIP;
  ship.cells = cells;
  ship.orientation = orientation;
  return true;
}

export function randomPlacement(fleet) {
  const board = createBoard();
  const orientations = ['horizontal', 'vertical'];
  for (const ship of fleet) {
    let placed = false, attempts = 0;
    while (!placed && attempts < 500) {
      const ori = orientations[Math.floor(Math.random() * 2)];
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);
      if (canPlace(board, x, y, ship.size, ori)) {
        placeShip(board, ship, x, y, ori);
        placed = true;
      }
      attempts++;
    }
  }
  return board;
}

/**
 * Apply a shot to a board.
 * Returns { result: 'hit'|'miss'|'invalid', sunkShip?: ship }
 */
export function applyShot(board, fleet, x, y) {
  if (!inBounds(x, y)) return { result: 'invalid' };
  const cur = board[x][y];
  if (cur === CellState.HIT || cur === CellState.MISS) {
    return { result: 'invalid' };
  }
  if (cur === CellState.SHIP) {
    board[x][y] = CellState.HIT;
    const ship = fleet.find(s => s.cells.some(([cx, cy]) => cx === x && cy === y));
    if (ship) {
      ship.hits += 1;
      if (ship.hits >= ship.size) {
        ship.sunk = true;
        return { result: 'hit', sunkShip: ship };
      }
    }
    return { result: 'hit' };
  }
  board[x][y] = CellState.MISS;
  return { result: 'miss' };
}

export function allShipsSunk(fleet) {
  return fleet.every(s => s.sunk);
}
