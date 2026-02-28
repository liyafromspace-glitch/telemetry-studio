import { liveSignals, type LiveSignal } from "@/data/mockPlatform";
import { AlertTriangle, Radio, XCircle, CheckCircle, Clock, ArrowRight } from "lucide-react";

interface LiveViewProps {
  onNavigateToInvestigate: (signalParam: string) => void;
}

export function LiveView({ onNavigateToInvestigate }: LiveViewProps) {
  const criticalCount = liveSignals.filter((s) => s.status === "critical").length;
  const warningCount = liveSignals.filter((s) => s.status === "warning").length;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2 text-xs">
          <Radio className="w-3.5 h-3.5 text-destructive animate-pulse" />
          <span className="font-medium text-foreground">Мониторинг в реальном времени</span>
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

      {/* Signals table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider bg-card">
              <th className="text-left px-4 py-2 font-medium">Статус</th>
              <th className="text-left px-4 py-2 font-medium">Параметр</th>
              <th className="text-right px-4 py-2 font-medium">Текущее</th>
              <th className="text-right px-4 py-2 font-medium">Ожидаемое</th>
              <th className="text-left px-4 py-2 font-medium">Ед.</th>
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
