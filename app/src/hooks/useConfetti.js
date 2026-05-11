import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore.js';

export function useConfetti() {
  const showConfetti = useGameStore(s => s.showConfetti);
  const clearConfetti = useGameStore(s => s.clearConfetti);
  const mode = useGameStore(s => s.mode);

  useEffect(() => {
    if (!showConfetti) return;

    if (mode === 'advanced') {
      // Sci-fi: cyan/orange burst
      const fire = (angle, x) =>
        confetti({ angle, spread: 55, particleCount: 80, origin: { x, y: 0.6 },
          colors: ['#00e5ff', '#ff6a00', '#ffffff', '#8b5cf6'], scalar: 1.1 });
      fire(60, 0.25);
      setTimeout(() => fire(120, 0.75), 200);
      setTimeout(() => confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 },
        colors: ['#00e5ff', '#ff6a00', '#ffffff'] }), 500);
    } else {
      // Classic: golden naval burst
      const fire = (angle, x) =>
        confetti({ angle, spread: 50, particleCount: 60, origin: { x, y: 0.6 },
          colors: ['#c9a96e', '#e8d9b0', '#ffffff', '#8b3a1f'], scalar: 1.0 });
      fire(55, 0.2);
      setTimeout(() => fire(125, 0.8), 250);
      setTimeout(() => confetti({ particleCount: 100, spread: 80, origin: { y: 0.55 },
        colors: ['#c9a96e', '#e8d9b0', '#ffffff'] }), 600);
    }

    const t = setTimeout(clearConfetti, 3000);
    return () => clearTimeout(t);
  }, [showConfetti]);
}
