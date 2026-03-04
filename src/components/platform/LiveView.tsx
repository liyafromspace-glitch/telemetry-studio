import { liveSignals, type LiveSignal } from "@/data/mockPlatform";
import { AlertTriangle, Radio, XCircle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { LiveSystemPulse } from "@/components/ide/LiveSystemPulse";

interface LiveViewProps {
  onNavigateToInvestigate: (signalParam: string) => void;
}

const mockHistory: Record<string, number[]> = {
  "TI03025.PV": [85, 84, 83, 82, 0, 0, 0],
  "PT02012.PV": [340, 355, 370, 390, 400, 412, 413],
  "FT01007.PV": [900, 950, 1000, 1050, 1100, 1200, 1247],
  "LT04001.PV": [4.1, 4.15, 4.2, 4.18, 4.22, 4.21, 4.21],
  "DT05003.PV": [841, 842, 841, 843, 842, 842, 842],
  "HT06002.PV": [92, 94, 95, 96, 97, 98, 99],
};

function MiniSparkline({ data, status }: { data: number[]; status: string }) {
  const filtered = data.filter(v => v > 0);
  if (filtered.length < 2) return <span className="text-[10px] text-muted-foreground">—</span>;
  const min = Math.min(...filtered);
  const max = Math.max(...filtered);
  const range = max - min || 1;
  const w = 60;
  const h = 18;
  const pts = filtered.map((v, i) => ({
    x: (i / (filtered.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 4) - 2,
  }));
  const linePoints = pts.map(p => `${p.x},${p.y}`).join(" ");
  const areaPoints = `0,${h} ${linePoints} ${w},${h}`;
  const color = status === "critical" ? "hsl(2, 93%, 63%)" : status === "warning" ? "hsl(39, 74%, 48%)" : "hsl(185, 70%, 50%)";

  return (
    <svg width={w} height={h} className="inline-block">
      <defs>
        <linearGradient id={`lg-${status}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`gf-${status}`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <polygon points={areaPoints} fill={`url(#lg-${status})`} />
      <polyline points={linePoints} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" filter={`url(#gf-${status})`} />
    </svg>
  );
}

export function LiveView({ onNavigateToInvestigate }: LiveViewProps) {
  const criticalCount = liveSignals.filter((s) => s.status === "critical").length;
  const warningCount = liveSignals.filter((s) => s.status === "warning").length;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-destructive animate-pulse" />
            <span className="font-medium text-foreground">Мониторинг в реальном времени</span>
          </div>
          {/* Live System Pulse */}
          <LiveSystemPulse />
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-destructive" />
            {criticalCount} критических
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-warning" />
            {warningCount} предупреждений
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Обновлено: только что
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider bg-card">
              <th className="text-left px-4 py-2 font-medium">Статус</th>
              <th className="text-left px-4 py-2 font-medium">Параметр</th>
              <th className="text-right px-4 py-2 font-medium">Текущее</th>
              <th className="text-right px-4 py-2 font-medium">Ожидаемое</th>
              <th className="text-left px-4 py-2 font-medium">Ед.</th>
              <th className="text-center px-4 py-2 font-medium">Тренд</th>
              <th className="text-left px-4 py-2 font-medium">Функция</th>
              <th className="text-left px-4 py-2 font-medium">Матрица</th>
              <th className="text-left px-4 py-2 font-medium">Время</th>
              <th className="text-center px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {liveSignals.map((signal) => (
              <SignalRow key={signal.id} signal={signal} onInvestigate={onNavigateToInvestigate} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SignalRow({ signal, onInvestigate }: { signal: LiveSignal; onInvestigate: (p: string) => void }) {
  const sparkData = mockHistory[signal.parameter] || [];

  return (
    <tr
      className={`border-b border-border transition-colors hover:bg-accent/30 ${
        signal.status === "critical" ? "bg-destructive/5" : signal.status === "warning" ? "bg-warning/5" : ""
      }`}
    >
      <td className="px-4 py-2">
        {signal.status === "critical" ? (
          <XCircle className="w-3.5 h-3.5 text-destructive" />
        ) : signal.status === "warning" ? (
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5 text-success" />
        )}
      </td>
      <td className="px-4 py-2 font-mono text-[11px] text-foreground font-medium">{signal.parameter}</td>
      <td className={`px-4 py-2 text-right font-mono text-[11px] ${
        signal.status === "critical" ? "text-destructive font-medium" : signal.status === "warning" ? "text-warning" : "text-foreground"
      }`}>
        {signal.currentValue}
      </td>
      <td className="px-4 py-2 text-right font-mono text-[11px] text-muted-foreground">{signal.expectedValue}</td>
      <td className="px-4 py-2 text-muted-foreground">{signal.unit}</td>
      <td className="px-4 py-2 text-center">
        <MiniSparkline data={sparkData} status={signal.status} />
      </td>
      <td className="px-4 py-2 text-muted-foreground truncate max-w-[140px]">{signal.linkedFunction}</td>
      <td className="px-4 py-2 text-muted-foreground truncate max-w-[160px]">{signal.linkedMatrix}</td>
      <td className="px-4 py-2 text-[10px] text-muted-foreground">{signal.timestamp.split(" ")[1]}</td>
      <td className="px-4 py-2 text-center">
        {signal.status !== "normal" && (
          <button
            onClick={() => onInvestigate(signal.parameter)}
            className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
          >
            Расследовать <ArrowRight className="w-2.5 h-2.5" />
          </button>
        )}
      </td>
    </tr>
  );
}
