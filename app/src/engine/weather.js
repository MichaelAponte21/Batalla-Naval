export const WEATHERS = {
  calm:  { id: 'calm',  name: 'Mar Calmo',    hitMissChance: 0,    revealDelay: 0,    creditMult: 1.0 },
  fog:   { id: 'fog',   name: 'Niebla',       hitMissChance: 0.2,  revealDelay: 0,    creditMult: 1.0 },
  storm: { id: 'storm', name: 'Tormenta',     hitMissChance: 0,    revealDelay: 1500, creditMult: 1.0 },
  bonus: { id: 'bonus', name: 'Mar Auspicio', hitMissChance: 0,    revealDelay: 0,    creditMult: 1.5 }
};

export const TURNS_PER_CHANGE = 5;

export function rollWeather(prevId) {
  const pool = Object.keys(WEATHERS).filter(k => k !== prevId);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function maybeApplyFog(result, weatherId) {
  if (weatherId !== 'fog') return result;
  if (result === 'hit' && Math.random() < WEATHERS.fog.hitMissChance) {
    return 'miss';
  }
  return result;
}
