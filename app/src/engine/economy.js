export const INITIAL_CREDITS = 20;

export const REWARDS = {
  hit: 10,
  sink: 25
};

export function computeReward(result, sunkShip, weatherMultiplier = 1) {
  if (result !== 'hit') return 0;
  let total = REWARDS.hit;
  if (sunkShip) total += REWARDS.sink;
  return Math.round(total * weatherMultiplier);
}
