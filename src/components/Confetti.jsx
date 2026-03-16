import { useRef, useEffect } from 'react';

// simple confetti effect triggered externally by calling `trigger()` on the ref
export default function Confetti({ triggerRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const pieces = [];
    const colors = ['#f87171', '#34d399', '#60a5fa', '#facc15', '#a855f7'];

    const spawn = () => {
      for (let i = 0; i < 100; i++) {
        pieces.push({
          x: Math.random() * canvas.width,
          y: -20,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 5 + 2,
          color: colors[(Math.random() * colors.length) | 0],
          size: Math.random() * 6 + 4,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p, i) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > canvas.height) {
          pieces.splice(i, 1);
        }
      });
      if (pieces.length) animationId = requestAnimationFrame(draw);
    };

    if (!triggerRef) return undefined;

    triggerRef.current = () => {
      spawn();
      draw();
    };

    window.addEventListener('resize', resize);
    resize();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      triggerRef.current = null;
    };
  }, [triggerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
