import { useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useParallax } from '../../hooks/useParallax.js';

function createParticles(width, height, count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  }));
}

export default function HeroBackground() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const reducedMotion = useReducedMotion();
  const slowParallaxY = useParallax(70);
  const shapes = useMemo(
    () => [
      { size: 'h-16 w-16', left: 'left-[8%]', top: 'top-[14%]', delay: 0 },
      { size: 'h-20 w-20', left: 'left-[72%]', top: 'top-[22%]', delay: 0.3 },
      { size: 'h-14 w-14', left: 'left-[20%]', top: 'top-[72%]', delay: 0.6 },
      { size: 'h-24 w-24', left: 'left-[82%]', top: 'top-[68%]', delay: 0.9 },
    ],
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return undefined;
    const ctx = canvas.getContext('2d');
    let frameId;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resize();
    const particles = createParticles(canvas.width, canvas.height, 42);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
        if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;

        const dxPointer = p.x - pointerRef.current.x;
        const dyPointer = p.y - pointerRef.current.y;
        const pointerDistance = Math.hypot(dxPointer, dyPointer);
        if (pointerDistance < 140) {
          const force = (140 - pointerDistance) / 1400;
          p.vx += (dxPointer / (pointerDistance || 1)) * force;
          p.vy += (dyPointer / (pointerDistance || 1)) * force;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(110, 180, 255, ${0.22 - dist / 520})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      frameId = window.requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }}
      onMouseLeave={() => {
        pointerRef.current = { x: -1000, y: -1000 };
      }}
    >
      <motion.div
        className="absolute inset-0 gradient-mesh"
        animate={
          reducedMotion
            ? undefined
            : { backgroundPosition: ['0% 30%', '100% 70%', '0% 30%'] }
        }
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />

      <motion.div className="absolute inset-0" style={{ y: slowParallaxY }}>
        {shapes.map((shape) => (
          <motion.div
            key={`${shape.left}-${shape.top}`}
            className={`absolute ${shape.left} ${shape.top} ${shape.size} rounded-[30%] border border-sky-300/20 bg-gradient-to-br from-sky-400/20 via-transparent to-violet-400/20 backdrop-blur-sm`}
            animate={
              reducedMotion
                ? undefined
                : {
                    y: [0, -15, 0],
                    rotateX: [0, 12, 0],
                    rotateY: [0, -12, 0],
                    rotateZ: [0, 10, 0],
                  }
            }
            transition={{
              duration: 6 + shape.delay * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: shape.delay,
            }}
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          />
        ))}
      </motion.div>
    </div>
  );
}
