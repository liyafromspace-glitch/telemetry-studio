import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

export interface TraceEntry {
  id: string;
  timestamp: string;
  type: "signal" | "threshold" | "rule" | "action" | "incident";
  message: string;
  entity?: string;
  severity?: "info" | "warning" | "error";
}

const typeLabels: Record<TraceEntry["type"], string> = {
  signal: "SIG",
  threshold: "THR",
  rule: "RUL",
  action: "ACT",
  incident: "INC",
};

const typeColors: Record<TraceEntry["type"], string> = {
  signal: "text-muted-foreground",
  threshold: "text-warning",
  rule: "text-primary",
  action: "text-foreground",
  incident: "text-destructive",
};

const defaultTraces: TraceEntry[] = [
  { id: "t1", timestamp: "09:31:04", type: "signal", message: "TI-R12-01.PV = 84°C", entity: "TI-R12-01", severity: "info" },
  { id: "t2", timestamp: "09:32:18", type: "signal", message: "TI-R12-01.PV = 89°C ↑", entity: "TI-R12-01", severity: "info" },
  { id: "t3", timestamp: "09:33:02", type: "threshold", message: "TI-R12-01.PV приближается к порогу 90°C (89°C)", entity: "TI-R12-01", severity: "warning" },
  { id: "t4", timestamp: "09:33:55", type: "signal", message: "PI-R12-01.PV = 12.3 бар > 11 бар", entity: "PI-R12-01", severity: "warning" },
  { id: "t5", timestamp: "09:34:00", type: "threshold", message: "TI-R12-01.PV = 96°C > порог 90°C", entity: "TI-R12-01", severity: "error" },
  { id: "t6", timestamp: "09:34:01", type: "rule", message: "Контроль перегрева → АКТИВИРОВАНО", entity: "rule-001", severity: "error" },
  { id: "t7", timestamp: "09:34:02", type: "action", message: "XV-R12-01 → ЗАКРЫТ (автоматически)", entity: "XV-R12-01", severity: "info" },
  { id: "t8", timestamp: "09:34:05", type: "incident", message: "INC-4201 создан: Перегрев резервуара-12", entity: "inc-001", severity: "error" },
  { id: "t9", timestamp: "09:35:12", type: "signal", message: "TI-R12-01.PV = 94°C ↓ (клапан закрыт)", entity: "TI-R12-01", severity: "info" },
  { id: "t10", timestamp: "09:36:00", type: "signal", message: "SI-R12-01.PV = 1450 RPM (норма)", entity: "SI-R12-01", severity: "info" },
];

interface TracePanelProps {
  onSelectTrace?: (entry: TraceEntry) => void;
  className?: string;
}

export function TracePanel({ onSelectTrace, className }: TracePanelProps) {
  const [filter, setFilter] = useState<TraceEntry["type"] | "all">("all");
  const [collapsed, setCollapsed] = useState(false);

  const filtered = filter === "all"
    ? defaultTraces
    : defaultTraces.filter((t) => t.type === filter);

  const filterTypes: (TraceEntry["type"] | "all")[] = ["all", "signal", "threshold", "rule", "action", "incident"];
  const filterLabels: Record<string, string> = {
    all: "Все",
    signal: "Сигналы",
    threshold: "Пороги",
    rule: "Правила",
    action: "Действия",
    incident: "Инциденты",
  };

  if (collapsed) {
    return (
      <div className={`border-t border-border bg-card ${className}`}>
        <button
          onClick={() => setCollapsed(false)}
          className="w-full flex items-center justify-between px-4 py-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="uppercase tracking-wider font-semibold">Trace Log</span>
          <ChevronUp className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-card border-t border-border min-h-0 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Trace Log
          </span>
          <div className="flex items-center gap-0.5">
            {filterTypes.map((ft) => (
              <button
                key={ft}
                onClick={() => setFilter(ft)}
                className={`px-2 py-0.5 text-[9px] font-medium rounded-md transition-colors ${
                  filter === ft
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filterLabels[ft]}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Trace entries */}
      <div className="flex-1 overflow-y-auto font-mono text-[11px] min-h-0">
        {filtered.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelectTrace?.(entry)}
            className="w-full flex items-center gap-3 px-4 py-1 hover:bg-accent/30 transition-colors text-left"
          >
            <span className="text-[10px] text-muted-foreground w-14 shrink-0">{entry.timestamp}</span>
            <span className={`text-[9px] font-semibold w-6 shrink-0 ${typeColors[entry.type]}`}>
              {typeLabels[entry.type]}
            </span>
            <span className={`flex-1 truncate ${
              entry.severity === "error" ? "text-destructive" :
              entry.severity === "warning" ? "text-warning" :
              "text-foreground/70"
            }`}>
              {entry.message}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
