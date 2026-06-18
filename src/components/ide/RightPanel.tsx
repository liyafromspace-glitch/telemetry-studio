import { Rule, RuleStatus, statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Keyboard, Cpu, Link2, FileText, Zap } from "lucide-react";
import { useState } from "react";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import {
  InspectorShell,
  InspectorRow,
  InspectorTag,
  type InspectorTone,
} from "@/components/ui/inspector-shell";

interface RightPanelProps {
  rule: Rule;
}

const ruleStatusTone: Record<RuleStatus, InspectorTone> = {
  active: "success",
  error: "destructive",
  draft: "muted",
  scheduled: "warning",
};

const mockSparklineData: Record<string, number[]> = {
  "Температура": [84, 85, 87, 89, 92, 95, 96],
  "Давление": [9.8, 10.2, 10.5, 11.0, 11.5, 11.8, 12.3],
  "Скорость": [1420, 1430, 1440, 1445, 1450, 1448, 1450],
  "Уровень": [80, 79, 79, 78, 78, 78, 78],
  "Клапан": [1, 1, 1, 1, 1, 1, 0],
  "Общее": [50, 55, 52, 58, 54, 56, 53],
};

const templates = [
  { id: "t1", name: "Контроль перегрева" },
  { id: "t2", name: "Аварийное давление" },
  { id: "t3", name: "Отказ клапана" },
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
    new Set(["signals", "validation", "deps", "metadata"])
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
    <InspectorShell
      hero={{
        kind: "Rule",
        id: rule.id,
        title: rule.name,
        subtitle: `${rule.parameterType} · v${rule.version}`,
        status: { label: statusLabels[rule.status], tone: ruleStatusTone[rule.status] },
      }}
      footer={
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
          <Keyboard className="w-2.5 h-2.5" />
          <span>⌘↵ Validate · ⌘⇧S Deploy · Esc Close</span>
        </div>
      }
    >
      <CollapsibleSection title="Input Signals" open={openSections.has("signals")} onToggle={() => toggleSection("signals")}>
        <div className="px-3 py-2 space-y-2">
          <InspectorRow k="Parameter" v={rule.parameterType} />
          <InspectorRow k="Recent">
            <Sparkline data={sparkData} />
          </InspectorRow>
          <div className="flex gap-1 flex-wrap justify-end font-mono text-[10px] text-muted-foreground tabular-nums">
            {sparkData.map((v, i) => (
              <span key={i}>{v}</span>
            ))}
          </div>
          {rule.parameterType === "Температура" && (
            <div className="flex items-start gap-2 px-2 py-1.5 font-mono text-[10px] text-destructive border border-destructive/40 bg-destructive/5">
              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
              <span className="uppercase tracking-wider">Temp 96°C exceeds threshold 90°C</span>
            </div>
          )}
          {rule.parameterType === "Давление" && (
            <div className="flex items-start gap-2 px-2 py-1.5 font-mono text-[10px] text-warning border border-warning/40 bg-warning/5">
              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
              <span className="uppercase tracking-wider">Pressure 12.3 bar near critical</span>
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Validation Console" open={openSections.has("validation")} onToggle={() => toggleSection("validation")}>
        <div className="px-3 py-2 space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="w-3 h-3 shrink-0" />
            <span className="uppercase tracking-wider text-[10px]">Syntax OK</span>
          </div>
          {rule.warningCount > 0 && (
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span className="uppercase tracking-wider text-[10px]">{rule.warningCount} warnings</span>
            </div>
          )}
          {rule.errorCount > 0 && (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-3 h-3 shrink-0" />
              <span className="uppercase tracking-wider text-[10px]">{rule.errorCount} errors</span>
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Dependencies" open={openSections.has("deps")} onToggle={() => toggleSection("deps")}>
        <div className="px-3 py-2 space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Link2 className="w-3 h-3" /> Signals
            </span>
            <span className="text-foreground tabular-nums">{rule.parametersLinked}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <FileText className="w-3 h-3" /> Reports
            </span>
            <span className="text-foreground tabular-nums">{rule.reportsUsed}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Cpu className="w-3 h-3" /> Rules
            </span>
            <span className="text-foreground tabular-nums">2</span>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Metadata" open={openSections.has("metadata")} onToggle={() => toggleSection("metadata")}>
        <div className="px-3 py-2 space-y-1.5">
          <InspectorRow k="Author" v={rule.author} />
          <InspectorRow k="Created" v={rule.createdAt} />
          <InspectorRow k="Last check" v={rule.lastCheck} />
          <InspectorRow k="Asset" v="Резервуар-12" />
          <InspectorRow k="ID" v={rule.id} mono />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Templates" open={openSections.has("templates")} onToggle={() => toggleSection("templates")}>
        <div className="px-1.5 py-1.5 space-y-0.5">
          {templates.map((t) => (
            <button
              key={t.id}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] font-mono text-muted-foreground hover:text-[hsl(var(--conn-orange))] hover:bg-accent/50 transition-colors text-left"
            >
              <Zap className="w-3 h-3" />
              <span className="truncate">{t.name}</span>
            </button>
          ))}
        </div>
      </CollapsibleSection>
    </InspectorShell>
  );
}
