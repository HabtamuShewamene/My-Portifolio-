const blueprints = [
  'const interface = buildExperience();',
  'layout.grid(12).align(baseline);',
  'ship(cleanCode, creativeExecution);',
];

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(145deg, color-mix(in oklab, var(--theme-overlay) 80%, transparent), transparent 46%), radial-gradient(circle at top right, color-mix(in oklab, var(--theme-shape-two) 85%, transparent), transparent 30%), radial-gradient(circle at bottom left, color-mix(in oklab, var(--theme-shape-one) 78%, transparent), transparent 28%)',
        }}
      />

      <div
        className="absolute inset-x-[6%] bottom-[16%] top-[14%] rounded-[1.75rem] border"
        style={{ borderColor: 'color-mix(in oklab, var(--theme-border-medium) 65%, transparent)' }}
      />
      <div
        className="absolute left-[5.5%] top-[18%] h-[34%] w-[26%] rounded-tl-[1.5rem] border-l border-t"
        style={{ borderColor: 'color-mix(in oklab, var(--theme-border) 80%, transparent)' }}
      />
      <div
        className="absolute bottom-[14%] right-[7%] h-[26%] w-[22%] rounded-br-[1.5rem] border-b border-r"
        style={{ borderColor: 'color-mix(in oklab, var(--theme-border) 78%, transparent)' }}
      />

      <div className="absolute right-[7%] top-[12%] hidden max-w-[15rem] rounded-2xl border px-4 py-3 text-left md:block"
        style={{
          borderColor: 'color-mix(in oklab, var(--theme-border-medium) 75%, transparent)',
          background: 'color-mix(in oklab, var(--theme-surface) 92%, transparent)',
        }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] theme-text-soft">Blueprint</p>
        <div className="mt-2 space-y-2 font-mono text-[11px] leading-5 theme-text-muted">
          {blueprints.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <div className="absolute bottom-[10%] left-[7%] hidden items-center gap-3 md:flex">
        <span className="h-px w-20" style={{ background: 'linear-gradient(to right, var(--accent-color), transparent)' }} />
        <span className="font-mono text-[11px] uppercase tracking-[0.26em] theme-text-soft">React • Node • Java</span>
      </div>
    </div>
  );
}
