export function HorizontalBars({
  items,
  labelKey,
  valueKey,
}: {
  items: Array<Record<string, string | number>>;
  labelKey: string;
  valueKey: string;
}) {
  const maxValue = Math.max(...items.map((item) => Number(item[valueKey])), 1);

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const value = Number(item[valueKey]);
        const width = `${(value / maxValue) * 100}%`;
        return (
          <div key={`${item[labelKey]}`}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-300">{String(item[labelKey])}</span>
              <span className="text-cyan-200">{value}</span>
            </div>
            <div className="h-3 rounded-full bg-white/6">
              <div className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300" style={{ width }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function RetentionLine({ points }: { points: Array<{ day: string; retention: number }> }) {
  const width = 360;
  const height = 160;
  const maxValue = Math.max(...points.map((point) => point.retention), 1);
  const stepX = width / Math.max(points.length - 1, 1);
  const polyline = points
    .map((point, index) => {
      const x = index * stepX;
      const y = height - (point.retention / maxValue) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full">
        <polyline fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="1" points={`0,${height - 10} ${width},${height - 10}`} />
        <polyline fill="none" stroke="url(#retention-gradient)" strokeWidth="4" strokeLinecap="round" points={polyline} />
        <defs>
          <linearGradient id="retention-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#3cc8ff" />
            <stop offset="100%" stopColor="#4ce2c6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-4 flex justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
        {points.map((point) => (
          <span key={point.day}>{point.day}</span>
        ))}
      </div>
    </div>
  );
}
