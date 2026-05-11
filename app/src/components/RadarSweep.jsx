import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';

/**
 * Rotating radar beam drawn on a Canvas overlay on top of the player's board.
 * Briefly illuminates ship silhouettes as it passes.
 */
export default function RadarSweep({ size = 460, mode }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = size / 2, cy = size / 2, r = size * 0.5;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Rotating sweep arc (filled wedge)
      const a = angleRef.current;
      const sweep = Math.PI / 8; // arc width
      const grad = ctx.createConicalGradient
        ? null // not widely supported
        : null;

      // Draw trailing glow arcs
      for (let i = 0; i < 12; i++) {
        const trailAngle = a - (i * sweep / 12);
        const alpha = (1 - i / 12) * (mode === 'advanced' ? 0.12 : 0.06);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, trailAngle, trailAngle + sweep / 12);
        ctx.closePath();
        ctx.fillStyle = mode === 'advanced'
          ? `rgba(0, 229, 255, ${alpha})`
          : `rgba(201, 169, 110, ${alpha})`;
        ctx.fill();
      }

      // Leading edge line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.strokeStyle = mode === 'advanced'
        ? 'rgba(0, 229, 255, 0.5)'
        : 'rgba(201, 169, 110, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Ring
      ctx.beginPath();
      ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
      ctx.strokeStyle = mode === 'advanced'
        ? 'rgba(0, 229, 255, 0.1)'
        : 'rgba(201, 169, 110, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Cross hairs
      ctx.strokeStyle = mode === 'advanced' ? 'rgba(0,229,255,0.05)' : 'rgba(201,169,110,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(size, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, size); ctx.stroke();

      angleRef.current = (a + 0.018) % (Math.PI * 2);
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ctx.clearRect(0, 0, size, size); };
  }, [size, mode]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.75rem',
        width: 'calc(100% - 1.75rem)',
        height: 'calc(100% - 1.5rem)',
        pointerEvents: 'none',
        zIndex: 10,
        borderRadius: '2px'
      }}
    />
  );
}
