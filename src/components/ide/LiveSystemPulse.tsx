import { useState, useEffect } from "react";
import { Activity, Zap, AlertTriangle } from "lucide-react";

interface PulseData {
  signalsPerSec: number;
  rulesPerSec: number;
  activeIncidents: number;
}

export function LiveSystemPulse() {
  const [pulse, setPulse] = useState<PulseData>({
    signalsPerSec: 142,
    rulesPerSec: 38,
    activeIncidents: 2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse({
        signalsPerSec: 130 + Math.floor(Math.random() * 30),
        rulesPerSec: 32 + Math.floor(Math.random() * 15),
        activeIncidents: 2,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 bg-card/80 border border-border/60 rounded-full pl-2.5 pr-4 py-1.5 shadow-sm">
      {/* Live indicator */}
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-success animate-ping opacity-60" />
        </div>
        <span className="text-[11px] font-semibold text-foreground uppercase tracking-[0.12em]">Live</span>
      </div>

      {/* Mini telemetry wave */}
      <PulseWave value={pulse.signalsPerSec} />

      <div className="flex items-center gap-4 text-[11px]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="font-mono text-foreground font-semibold tabular-nums">{pulse.signalsPerSec}</span>
          <span className="text-muted-foreground/70">сигналов/с</span>
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Zap className="w-3 h-3 text-warning fill-warning" />
          <span className="font-mono text-foreground font-semibold tabular-nums">{pulse.rulesPerSec}</span>
          <span className="text-muted-foreground/70">правил/с</span>
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <AlertTriangle className="w-3 h-3 text-muted-foreground" />
          <span className="font-mono text-foreground font-semibold tabular-nums">{pulse.activeIncidents}</span>
          <span className="text-muted-foreground/70">инцидентов</span>
        </span>
      </div>
    </div>
  );
}

function PulseWave({ value }: { value: number }) {
  const [history, setHistory] = useState<number[]>(Array(24).fill(0));

  useEffect(() => {
    setHistory((prev) => [...prev.slice(1), value]);
  }, [value]);

  const w = 56;
  const h = 18;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  const pts = history.map((v, i) => ({
    x: (i / (history.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 4) - 2,
  }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;

  return (
    <svg width={w} height={h} className="inline-block">
      <defs>
        <linearGradient id="pulseAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(0, 0%, 93%)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="hsl(0, 0%, 93%)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pulseLineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(0, 0%, 93%)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="hsl(0, 0%, 93%)" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#pulseAreaGrad)" />
      <polyline
        points={line}
        fill="none"
        stroke="url(#pulseLineGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="1.5" fill="hsl(0, 0%, 93%)" />
    </svg>
  );
}
