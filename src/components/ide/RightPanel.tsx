import { Rule, statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Keyboard, Cpu, Link2, FileText, Zap } from "lucide-react";
import { useState } from "react";
import { StatusBadge, ruleStatusToVariant } from "@/components/ui/status-badge";
import { CollapsibleSection, PropRow } from "@/components/ui/collapsible-section";
import { useDebug, signalRegistry } from "./DebugContext";

interface RightPanelProps {
  rule: Rule;
}

const mockSparklineData: Record<string, number[]> = {
  "Температура": [84, 85, 87, 89, 92, 95, 96],
  "Давление": [9.8, 10.2, 10.5, 11.0, 11.5, 11.8, 12.3],
  "Скорость": [1420, 1430, 1440, 1445, 1450, 1448, 1450],
  "Уровень": [80, 79, 79, 78, 78, 78, 78],
  "Клапан": [1, 1, 1, 1, 1, 1, 0],
  "Общее": [50, 55, 52, 58, 54, 56, 53],
};

const templates = [
  { id: "t1", name: "Контроль перегрева", icon: "🔥" },
  { id: "t2", name: "Аварийное давление", icon: "⚡" },
  { id: "t3", name: "Отказ клапана", icon: "🔧" },
];

function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 140;
  const h = 28;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 6) - 3,
  }));
  const linePoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `0,${h} ${linePoints} ${w},${h}`;

  return (
    <svg width={w} height={h} className="inline-block">
      <defs>
        <linearGradient id="sparkArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(160, 60%, 45%)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="hsl(160, 60%, 45%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sparkArea)" />
      <polyline points={linePoints} fill="none" stroke="hsl(160, 60%, 45%)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2" fill="hsl(160, 60%, 45%)" />
    </svg>
  );
}

export function RightPanel({ rule }: RightPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["logic", "signals", "validation", "metadata"])
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const sparkData = mockSparklineData[rule.parameterType] || mockSparklineData["Общее"];

  return (
    <div className="flex flex-col h-full bg-card overflow-y-auto border-l border-border">
      <CollapsibleSection title="Rule Logic" open={openSections.has("logic")} onToggle={() => toggleSection("logic")}>
        <div className="p-4 space-y-2.5 text-xs">
          <PropRow label="Название" value={rule.name} />
          <PropRow label="Тип" value={rule.parameterType} />
          <PropRow label="Статус">
            <StatusBadge variant={ruleStatusToVariant(rule.status)}>
              {statusLabels[rule.status]}
            </StatusBadge>
          </PropRow>
          <PropRow label="Версия" value={`v${rule.version}`} />

          {rule.name === "Контроль перегрева" && (
            <div className="mt-3 p-3 rounded-xl border border-destructive/15 bg-destructive/5 text-[11px] font-mono text-foreground leading-relaxed">
              <div className="text-[9px] text-destructive uppercase tracking-wider font-semibold mb-1.5">Inline Debug</div>
              <div className="text-muted-foreground">Температура = <span className="text-destructive">96°C</span></div>
              <div className="text-muted-foreground">Порог = <span className="text-foreground">90°C</span></div>
              <div className="text-muted-foreground">Давление = <span className="text-warning">12.3 бар</span></div>
              <div className="text-destructive mt-1">→ rule activated → valve closed</div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Input Signals" open={openSections.has("signals")} onToggle={() => toggleSection("signals")}>
        <SignalList parameterType={rule.parameterType} sparkData={sparkData} />
      </CollapsibleSection>

      <CollapsibleSection title="Validation Console" open={openSections.has("validation")} onToggle={() => toggleSection("validation")}>
        <div className="p-4 space-y-1.5 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Синтаксис OK
          </div>
          {rule.warningCount > 0 && (
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              {rule.warningCount} предупр.
            </div>
          )}
          {rule.errorCount > 0 && (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {rule.errorCount} ошибок
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Dependencies" open={openSections.has("deps")} onToggle={() => toggleSection("deps")}>
        <div className="p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link2 className="w-3 h-3" />
            <span>{rule.parametersLinked} сигналов</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="w-3 h-3" />
            <span>{rule.reportsUsed} отчётов</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cpu className="w-3 h-3" />
            <span>2 правила</span>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Metadata" open={openSections.has("metadata")} onToggle={() => toggleSection("metadata")}>
        <div className="p-4 space-y-2.5 text-xs">
          <PropRow label="Автор" value={rule.author} />
          <PropRow label="Создано" value={rule.createdAt} />
          <PropRow label="Проверка" value={rule.lastCheck} />
          <PropRow label="Объект" value="Резервуар-12" />
          <PropRow label="ID" value={rule.id} mono />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Templates" open={openSections.has("templates")} onToggle={() => toggleSection("templates")}>
        <div className="p-2.5 space-y-0.5">
          {templates.map((t) => (
            <button
              key={t.id}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <Zap className="w-3 h-3" />
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      <div className="p-3 border-t border-border mt-auto">
        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
          <Keyboard className="w-2.5 h-2.5" />
          <span>⌘↵ Validate · ⌘⇧S Deploy · Esc Close</span>
        </div>
      </div>
    </div>
  );
}

const paramToSignalKeys: Record<string, string[]> = {
  "Температура": ["TI-R12-01"],
  "Давление": ["PI-R12-01"],
  "Скорость": ["SI-R12-01"],
  "Клапан": ["XV-R12-01"],
  "Уровень": [],
};

function SignalList({ parameterType, sparkData }: { parameterType: string; sparkData: number[] }) {
  const { highlightedSignal, setHighlightedSignal } = useDebug();
  const keys = paramToSignalKeys[parameterType] || [];

  return (
    <div className="p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="type-state">Bound signals</span>
        {highlightedSignal && (
          <button
            onClick={() => setHighlightedSignal(null)}
            className="text-[9px] text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
      {keys.length === 0 && (
        <div className="text-[10px] text-muted-foreground italic">No bound signals</div>
      )}
      {keys.map((key) => {
        const snap = signalRegistry[key];
        if (!snap) return null;
        const active = highlightedSignal === key;
        const dotColor =
          snap.status === "error" ? "bg-destructive" :
          snap.status === "warning" ? "bg-warning" : "bg-success";
        return (
          <button
            key={key}
            onClick={() => setHighlightedSignal(active ? null : key)}
            className={`w-full text-left rounded-md px-2.5 py-2 transition-colors border ${
              active
                ? "border-primary/50 bg-primary/5"
                : "border-transparent hover:bg-accent/40"
            }`}
            title="Click to highlight related rule clauses"
          >
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              <span className="font-mono text-[11px] text-foreground">{snap.signal}</span>
              <span className="ml-auto font-mono text-[11px] text-foreground">{snap.value}</span>
            </div>
            {snap.threshold && (
              <div className="mt-1 pl-3.5 text-[10px] text-muted-foreground font-mono">
                threshold {snap.threshold} · {snap.timestamp}
              </div>
            )}
          </button>
        );
      })}
      <div className="pt-2 mt-1 border-t border-border/40 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">Trend</span>
        <Sparkline data={sparkData} />
      </div>
    </div>
  );
}
