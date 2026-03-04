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
    activeIncidents: 3,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse({
        signalsPerSec: 130 + Math.floor(Math.random() * 30),
        rulesPerSec: 32 + Math.floor(Math.random() * 15),
        activeIncidents: 2 + Math.floor(Math.random() * 3),
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-muted rounded-lg px-3 py-1.5 animate-fade-in">
      {/* Live indicator */}
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-success" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping opacity-75" />
        </div>
        <span className="text-[10px] font-medium text-foreground uppercase tracking-wider">Live</span>
      </div>

      <div className="w-px h-3.5 bg-border" />

      {/* Mini telemetry wave */}
      <PulseWave value={pulse.signalsPerSec} />

      <div className="flex items-center gap-3 text-[10px]">
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="font-mono text-foreground font-medium">{pulse.signalsPerSec}</span> сиг/с
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Zap className="w-2.5 h-2.5 text-conn-orange" />
          <span className="font-mono text-foreground font-medium">{pulse.rulesPerSec}</span> прав/с
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <AlertTriangle className="w-2.5 h-2.5 text-warning" />
          <span className="font-mono text-foreground font-medium">{pulse.activeIncidents}</span>
        </span>
      </div>
    </div>
  );
}

function PulseWave({ value }: { value: number }) {
  const [history, setHistory] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    setHistory((prev) => [...prev.slice(1), value]);
  }, [value]);

  const w = 48;
  const h = 16;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  const pts = history.map((v, i) => ({
    x: (i / (history.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 4) - 2,
  }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={w} height={h} className="inline-block">
      <defs>
        <linearGradient id="pulseGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(0, 0%, 93%)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(0, 0%, 93%)" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <polyline
        points={line}
        fill="none"
        stroke="url(#pulseGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
