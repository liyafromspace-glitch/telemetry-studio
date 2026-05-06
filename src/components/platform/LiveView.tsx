import { liveSignals, type LiveSignal } from "@/data/mockPlatform";
import { Clock, ArrowRight } from "lucide-react";
import { LiveSystemPulse } from "@/components/ide/LiveSystemPulse";
import { StatusBadge } from "@/components/ui/status-badge";
import { TracePanel } from "@/components/ide/TracePanel";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface LiveViewProps {
  onNavigateToInvestigate: (signalParam: string) => void;
}

const mockHistory: Record<string, number[]> = {
  "TI-R12-01.PV": [84, 85, 87, 89, 92, 94, 96],
  "PI-R12-01.PV": [9.8, 10.2, 10.5, 11.0, 11.5, 11.8, 12.3],
  "SI-R12-01.PV": [1420, 1430, 1440, 1445, 1450, 1448, 1450],
  "LI-R12-01.PV": [80, 79, 79, 78, 78, 78, 78],
  "XV-R12-01.ST": [1, 1, 1, 1, 1, 1, 1],
  "TI-R12-02.PV": [83, 84, 86, 88, 89, 90, 91],
};

function MiniSparkline({ data, status }: { data: number[]; status: string }) {
  const filtered = data.filter((v) => v > 0);
  if (filtered.length < 2) return <span className="text-[10px] text-muted-foreground">—</span>;
  const min = Math.min(...filtered);
  const max = Math.max(...filtered);
  const range = max - min || 1;
  const w = 64;
  const h = 20;
  const pts = filtered.map((v, i) => ({
    x: (i / (filtered.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 4) - 2,
  }));
  const linePoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const color =
    status === "critical"
      ? "hsl(0, 72%, 51%)"
      : status === "warning"
      ? "hsl(38, 80%, 50%)"
      : "hsl(0, 0%, 35%)";

  return (
    <svg width={w} height={h} className="inline-block">
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2" fill={color} />
    </svg>
  );
}

export function LiveView({ onNavigateToInvestigate }: LiveViewProps) {
  const criticalCount = liveSignals.filter((s) => s.status === "critical").length;
  const warningCount = liveSignals.filter((s) => s.status === "warning").length;

  return (
    <ResizablePanelGroup direction="vertical" className="flex-1">
      <ResizablePanel defaultSize={75} minSize={40}>
        <div className="flex flex-col h-full min-h-0">
          {/* Dominant alert moment */}
          <div className="alert-dominant flex items-start gap-4 px-6 py-4 shrink-0">
            <div className="mt-1 relative shrink-0">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-destructive animate-ping opacity-60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="type-state text-destructive/80 mb-1">Runtime error · TI-R12-01</div>
              <div className="type-object text-[15px] text-foreground">
                Temperature exceeds threshold
              </div>
              <div className="type-evidence mt-1.5 text-muted-foreground">
                <span className="text-destructive font-semibold">96°C</span>
                <span className="text-muted-foreground/50"> / 90°C threshold</span>
                <span className="text-muted-foreground/40"> · 6°C over</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateToInvestigate("TI-R12-01")}
              className="shrink-0 px-3 py-1.5 text-[11px] font-medium bg-destructive/15 hover:bg-destructive/25 text-destructive rounded-md flex items-center gap-1.5 transition-colors border border-destructive/20"
            >
              Debug <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-between px-6 py-2 border-b border-border/60 shrink-0">
            <div className="flex items-center gap-3 text-xs">
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-success animate-ping opacity-75" />
              </div>
              <LiveSystemPulse />
            </div>
            <div className="flex items-center gap-4 type-metadata">
              <span><span className="text-destructive font-medium">{criticalCount}</span> errors</span>
              <span><span className="text-warning font-medium">{warningCount}</span> warnings</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> just now
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50 type-state">
                  <th className="text-left px-6 py-2 font-medium w-8"></th>
                  <th className="text-left px-3 py-2 font-medium">Signal</th>
                  <th className="text-right px-3 py-2 font-medium">Value</th>
                  <th className="text-right px-3 py-2 font-medium">Expected</th>
                  <th className="text-left px-3 py-2 font-medium">Unit</th>
                  <th className="text-center px-3 py-2 font-medium">Trend</th>
                  <th className="text-left px-3 py-2 font-medium">Rule</th>
                  <th className="text-left px-3 py-2 font-medium">Matrix</th>
                  <th className="text-left px-3 py-2 font-medium">Time</th>
                  <th className="text-center px-6 py-2 font-medium"></th>
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
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={8} collapsible>
        <TracePanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function SignalRow({
  signal,
  onInvestigate,
}: {
  signal: LiveSignal;
  onInvestigate: (p: string) => void;
}) {
  const sparkData = mockHistory[signal.parameter] || [];
  const dotColor =
    signal.status === "critical" ? "bg-destructive"
    : signal.status === "warning" ? "bg-warning"
    : "bg-muted-foreground/30";

  return (
    <tr className="border-b border-border/40 transition-colors hover:bg-accent/20 group">
      <td className="px-6 py-2.5">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      </td>
      <td className="px-3 py-2.5 type-evidence font-medium">{signal.parameter}</td>
      <td
        className={`px-3 py-2.5 text-right type-evidence ${
          signal.status === "critical"
            ? "text-destructive font-semibold"
            : signal.status === "warning"
            ? "text-warning"
            : "text-foreground"
        }`}
      >
        {signal.currentValue}
      </td>
      <td className="px-3 py-2.5 text-right type-evidence text-muted-foreground/70">{signal.expectedValue}</td>
      <td className="px-3 py-2.5 type-metadata">{signal.unit}</td>
      <td className="px-3 py-2.5 text-center">
        <MiniSparkline data={sparkData} status={signal.status} />
      </td>
      <td className="px-3 py-2.5 type-metadata truncate max-w-[140px]">{signal.linkedFunction}</td>
      <td className="px-3 py-2.5 type-metadata truncate max-w-[160px]">{signal.linkedMatrix}</td>
      <td className="px-3 py-2.5 type-metadata font-mono">{signal.timestamp.split(" ")[1]}</td>
      <td className="px-6 py-2.5 text-center">
        {signal.status !== "normal" && (
          <button
            onClick={() => onInvestigate(signal.parameter)}
            className="text-[11px] text-muted-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors opacity-0 group-hover:opacity-100"
          >
            Inspect <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </td>
    </tr>
  );
}
