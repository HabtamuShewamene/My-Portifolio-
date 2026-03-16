import { useEffect, useRef, useState } from 'react';

function useAnimatedValue(targetValue, duration = 600) {
  const [value, setValue] = useState(() => Number(targetValue || 0));
  const valueRef = useRef(Number(targetValue || 0));

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const target = Number(targetValue || 0);
    const start = performance.now();
    const startValue = valueRef.current;

    let rafId = 0;
    const tick = (now) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const next = Math.round(startValue + (target - startValue) * elapsed);
      setValue(next);
      if (elapsed < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        valueRef.current = target;
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [duration, targetValue]);

  return value;
}

function CounterCard({ label, value }) {
  const animated = useAnimatedValue(value);
  return (
    <div className="theme-surface rounded-xl p-4">
      <p className="theme-text-soft text-xs uppercase tracking-wide">{label}</p>
      <p className="theme-text-primary mt-1 text-3xl font-semibold">{animated.toLocaleString()}</p>
    </div>
  );
}

export default function VisitorCounter({ visitors }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <CounterCard label="Active Visitors" value={visitors?.activeVisitors || 0} />
      <CounterCard label="Total Unique Visitors" value={visitors?.totalUniqueVisitors || 0} />
      <CounterCard label="Today's Visitors" value={visitors?.todayVisitors || 0} />
    </div>
  );
}
