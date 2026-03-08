import { useEffect, useState } from 'react';

function useAnimatedValue(targetValue, duration = 600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const target = Number(targetValue || 0);
    const start = performance.now();
    const startValue = value;

    let rafId = 0;
    const tick = (now) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const next = Math.round(startValue + (target - startValue) * elapsed);
      setValue(next);
      if (elapsed < 1) rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [targetValue]);

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
