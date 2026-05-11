import { useEffect, useRef } from 'react';

/**
 * Canvas overlay that leaves ripple-wake on cursor movement.
 * Attach to a container element via the containerRef.
 */
export default function WaterTrail({ containerRef }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const rafRef = useRef(null);
  const lastPos = useRef(null);

  useEffect(() => {
    const container = containerRef?.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Throttle by distance
      if (lastPos.current) {
        const dx = x - lastPos.current.x, dy = y - lastPos.current.y;
        if (Math.sqrt(dx*dx + dy*dy) < 8) return;
      }
      lastPos.current = { x, y };

      // Add ripple particles
      for (let i = 0; i < 3; i++) {
        particles.current.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          r: 1 + Math.random() * 3,
          alpha: 0.5 + Math.random() * 0.3,
          vr: 0.5 + Math.random() * 0.8,
          va: 0.025 + Math.random() * 0.02
        });
      }
    };

    container.addEventListener('mousemove', onMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter(p => p.alpha > 0.01);
      for (const p of particles.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(170, 210, 240, ${p.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        p.r += p.vr;
        p.alpha -= p.va;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5
      }}
    />
  );
}
