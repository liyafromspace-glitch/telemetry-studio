import { liveSignals, type LiveSignal } from "@/data/mockPlatform";
import { Radio, Clock, ArrowRight } from "lucide-react";
import { LiveSystemPulse } from "@/components/ide/LiveSystemPulse";
import { StatusBadge } from "@/components/ui/status-badge";

interface LiveViewProps {
  onNavigateToInvestigate: (signalParam: string) => void;
}

const mockHistory: Record<string, number[]> = {
  "TI03025.PV": [85, 84, 83, 82, 0, 0, 0],
  "PT02012.PV": [340, 355, 370, 390, 400, 412, 413],
  "FT01007.PV": [900, 950, 1000, 1050, 1100, 1200, 1247],
  "LT04001.PV": [4.1, 4.15, 4.2, 4.18, 4.22, 4.21, 4.21],
  "DT05003.PV": [841, 842, 841, 843, 842, 842, 842],
  "HT06002.PV": [92, 94, 95, 96, 97, 98, 99]
};

function MiniSparkline({ data, status }: {data: number[];status: string;}) {
  const filtered = data.filter((v) => v > 0);
  if (filtered.length < 2) return <span className="text-[10px] text-muted-foreground">—</span>;
  const min = Math.min(...filtered);
  const max = Math.max(...filtered);
  const range = max - min || 1;
  const w = 60;
  const h = 18;
  const pts = filtered.map((v, i) => ({
    x: i / (filtered.length - 1) * w,
    y: h - (v - min) / range * (h - 4) - 2
  }));
  const linePoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const color = status === "critical" ? "hsl(0, 84%, 60%)" : status === "warning" ? "hsl(38, 92%, 50%)" : "hsl(0, 0%, 50%)";

  return (
    <svg width={w} height={h} className="inline-block">
      <polyline points={linePoints} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>);

}

export function LiveView({ onNavigateToInvestigate }: LiveViewProps) {
  const criticalCount = liveSignals.filter((s) => s.status === "critical").length;
  const warningCount = liveSignals.filter((s) => s.status === "warning").length;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-success" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping opacity-75" />
            </div>
            
          </div>
          <LiveSystemPulse />
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <StatusBadge variant="error" size="xs">
            {criticalCount} критических
          </StatusBadge>
          <StatusBadge variant="warning" size="xs">
            {warningCount} предупреждений
          </StatusBadge>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Обновлено: только что
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider bg-card">
              <th className="text-left px-4 py-2.5 font-medium">Статус</th>
              <th className="text-left px-4 py-2.5 font-medium">Параметр</th>
              <th className="text-right px-4 py-2.5 font-medium">Текущее</th>
              <th className="text-right px-4 py-2.5 font-medium">Ожидаемое</th>
              <th className="text-left px-4 py-2.5 font-medium">Ед.</th>
              <th className="text-center px-4 py-2.5 font-medium">Тренд</th>
              <th className="text-left px-4 py-2.5 font-medium">Функция</th>
              <th className="text-left px-4 py-2.5 font-medium">Матрица</th>
              <th className="text-left px-4 py-2.5 font-medium">Время</th>
              <th className="text-center px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {liveSignals.map((signal) =>
            <SignalRow key={signal.id} signal={signal} onInvestigate={onNavigateToInvestigate} />
            )}
          </tbody>
        </table>
      </div>
    </div>);

}

function SignalRow({ signal, onInvestigate }: {signal: LiveSignal;onInvestigate: (p: string) => void;}) {
  const sparkData = mockHistory[signal.parameter] || [];

  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/30">
      <td className="px-4 py-2.5">
        <StatusBadge
          variant={signal.status === "critical" ? "error" : signal.status === "warning" ? "warning" : "success"}
          size="xs">
          
          {signal.status === "critical" ? "Error" : signal.status === "warning" ? "Warning" : "OK"}
        </StatusBadge>
      </td>
      <td className="px-4 py-2.5 font-mono text-[11px] text-foreground font-medium">{signal.parameter}</td>
      <td className={`px-4 py-2.5 text-right font-mono text-[11px] ${
      signal.status === "critical" ? "text-destructive font-medium" : signal.status === "warning" ? "text-warning" : "text-foreground"}`
      }>
        {signal.currentValue}
      </td>
      <td className="px-4 py-2.5 text-right font-mono text-[11px] text-muted-foreground">{signal.expectedValue}</td>
      <td className="px-4 py-2.5 text-muted-foreground">{signal.unit}</td>
      <td className="px-4 py-2.5 text-center">
        <MiniSparkline data={sparkData} status={signal.status} />
      </td>
      <td className="px-4 py-2.5 text-muted-foreground truncate max-w-[140px]">{signal.linkedFunction}</td>
      <td className="px-4 py-2.5 text-muted-foreground truncate max-w-[160px]">{signal.linkedMatrix}</td>
      <td className="px-4 py-2.5 text-[10px] text-muted-foreground">{signal.timestamp.split(" ")[1]}</td>
      <td className="px-4 py-2.5 text-center">
        {signal.status !== "normal" &&
        <button
          onClick={() => onInvestigate(signal.parameter)}
          className="text-[10px] text-foreground hover:underline flex items-center gap-0.5">
          
            Расследовать <ArrowRight className="w-2.5 h-2.5" />
          </button>
        }
      </td>
    </tr>);

}