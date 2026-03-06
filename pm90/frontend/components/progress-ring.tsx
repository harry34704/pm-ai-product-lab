export function ProgressRing({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * 52;
  const dash = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex items-center gap-4 rounded-[26px] border border-white/10 bg-white/5 p-5">
      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="url(#pm90-ring)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={dash}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="pm90-ring" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#3cc8ff" />
            <stop offset="100%" stopColor="#4ce2c6" />
          </linearGradient>
        </defs>
      </svg>
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-white">{clamped}%</p>
        <p className="mt-2 text-sm text-slate-300">Sequential unlocking keeps the journey focused and measurable.</p>
      </div>
    </div>
  );
}
