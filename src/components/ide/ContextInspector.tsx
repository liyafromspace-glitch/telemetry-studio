import { liveSignals, incidents, reports } from "@/data/mockPlatform";
import { rules } from "@/data/mockRules";
import { matrices } from "@/data/mockMatrices";
import {
  Radio, Bug, Cpu, Grid3X3, FileText,
  ArrowRight, ExternalLink, ChevronDown, ChevronUp
} from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";

interface ContextInspectorProps {
  className?: string;
}

export function ContextInspector({ className }: ContextInspectorProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Show contextual info based on most critical signal
  const criticalSignal = liveSignals.find((s) => s.status === "critical");
  const activeIncident = incidents.find((i) => i.status === "in_progress");
  const linkedRule = criticalSignal
    ? rules.find((r) => r.name === criticalSignal.linkedFunction)
    : rules[0];
  const linkedMatrix = criticalSignal
    ? matrices.find((m) => m.name === criticalSignal.linkedMatrix)
    : matrices[0];

  if (collapsed) {
    return (
      <div className={`border-l border-border bg-card flex flex-col ${className}`}>
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Expand Inspector"
        >
          <ChevronDown className="w-3 h-3 rotate-90" />
        </button>
      </div>
    );
  }

  return (
    <div className={`border-l border-border bg-card flex flex-col min-h-0 overflow-y-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Inspector
        </span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronUp className="w-3 h-3 -rotate-90" />
        </button>
      </div>

      {/* Active Signal */}
      {criticalSignal && (
        <InspectorSection
          icon={<Radio className="w-3 h-3" />}
          title="Активный сигнал"
        >
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-foreground">{criticalSignal.parameter}</span>
              <StatusBadge variant="error" size="xs">critical</StatusBadge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Текущее</div>
                <div className="font-mono text-destructive font-medium">
                  {criticalSignal.currentValue} {criticalSignal.unit}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Ожидаемое</div>
                <div className="font-mono text-muted-foreground">{criticalSignal.expectedValue}</div>
              </div>
            </div>
            <MiniSparkline />
          </div>
        </InspectorSection>
      )}

      {/* Active Incident */}
      {activeIncident && (
        <InspectorSection
          icon={<Bug className="w-3 h-3" />}
          title="Активный инцидент"
        >
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">{activeIncident.code}</span>
              <StatusBadge variant="error" size="xs">{activeIncident.priority}</StatusBadge>
            </div>
            <div className="text-foreground text-[11px]">{activeIncident.title}</div>
            <div className="text-[10px] text-muted-foreground">
              {activeIncident.tasks.filter((t) => t.done).length}/{activeIncident.tasks.length} задач выполнено
            </div>
          </div>
        </InspectorSection>
      )}

      {/* Linked Rule */}
      {linkedRule && (
        <InspectorSection
          icon={<Cpu className="w-3 h-3" />}
          title="Связанное правило"
        >
          <div className="space-y-2 text-xs">
            <div className="text-foreground font-medium text-[11px]">{linkedRule.name}</div>
            <div className="font-mono text-[10px] text-muted-foreground">
              v{linkedRule.version} · {linkedRule.parameterType}
            </div>
            {linkedRule.name === "Контроль перегрева" && (
              <div className="bg-destructive/8 border border-destructive/15 rounded-lg p-2 text-[10px] font-mono">
                <div className="text-muted-foreground">Температура = <span className="text-destructive">96°C</span></div>
                <div className="text-muted-foreground">Порог = <span className="text-foreground">90°C</span></div>
                <div className="text-destructive mt-1">→ правило активировано</div>
              </div>
            )}
            <InspectorLink label="Перейти к определению" />
            <InspectorLink label="Показать использования" />
          </div>
        </InspectorSection>
      )}

      {/* Linked Matrix */}
      {linkedMatrix && (
        <InspectorSection
          icon={<Grid3X3 className="w-3 h-3" />}
          title="Связанная матрица"
        >
          <div className="space-y-1.5 text-xs">
            <div className="text-foreground font-medium text-[11px]">{linkedMatrix.name}</div>
            <div className="font-mono text-[10px] text-muted-foreground">
              v{linkedMatrix.version} · {linkedMatrix.rows.length} связей
            </div>
            <InspectorLink label="Перейти к определению" />
          </div>
        </InspectorSection>
      )}

      {/* References */}
      <InspectorSection
        icon={<FileText className="w-3 h-3" />}
        title="References"
      >
        <div className="space-y-1 text-[11px]">
          {reports.slice(0, 3).map((rep) => (
            <div key={rep.id} className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors py-0.5">
              <FileText className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{rep.name}</span>
            </div>
          ))}
        </div>
      </InspectorSection>

      {/* Keyboard hints */}
      <div className="mt-auto p-3 border-t border-border">
        <div className="text-[9px] text-muted-foreground font-mono space-y-0.5">
          <div>F12 — Go to definition</div>
          <div>⌘⇧F — Find usages</div>
          <div>Esc — Close panel</div>
        </div>
      </div>
    </div>
  );
}

function InspectorSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border">
      <div className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {title}
      </div>
      <div className="px-4 pb-3">{children}</div>
    </div>
  );
}

function InspectorLink({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors">
      <ExternalLink className="w-2.5 h-2.5" />
      {label}
    </button>
  );
}

function MiniSparkline() {
  const data = [84, 85, 87, 89, 92, 94, 96];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 24;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 4) - 2,
  }));
  const linePoints = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={w} height={h} className="w-full">
      <polyline
        points={linePoints}
        fill="none"
        stroke="hsl(0, 72%, 51%)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2" fill="hsl(0, 72%, 51%)" />
    </svg>
  );
}
