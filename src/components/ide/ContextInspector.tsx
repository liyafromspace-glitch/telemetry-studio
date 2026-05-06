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
    <div className={`border-l border-border/60 bg-card/40 flex flex-col min-h-0 overflow-y-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0">
        <span className="type-state">Inspector</span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronUp className="w-3 h-3 -rotate-90" />
        </button>
      </div>

      {/* Active Signal — hero */}
      {criticalSignal && (
        <InspectorSection
          icon={<Radio className="w-3 h-3" />}
          title="Active signal"
        >
          <div className="space-y-3">
            <div>
              <div className="font-mono text-[11px] text-muted-foreground/70">{criticalSignal.parameter}</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[28px] font-semibold tracking-tight text-destructive leading-none">
                  {criticalSignal.currentValue}
                </span>
                <span className="text-xs text-muted-foreground/60">{criticalSignal.unit}</span>
              </div>
              <div className="type-metadata mt-1">
                vs <span className="font-mono text-foreground/70">{criticalSignal.expectedValue}</span> expected
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
              <div className="font-mono text-[10.5px] space-y-0.5 pl-2 border-l border-destructive/40">
                <div className="text-muted-foreground/70">temp <span className="text-destructive">= 96°C</span></div>
                <div className="text-muted-foreground/70">limit <span className="text-foreground/80">= 90°C</span></div>
                <div className="text-destructive/90 pt-0.5">→ rule fired</div>
              </div>
            )}
            <div className="flex flex-col gap-1 pt-1">
              <InspectorLink label="Go to definition" />
              <InspectorLink label="Find usages" />
            </div>
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
    <div className="px-5 py-4 border-t border-border/40 first:border-t-0">
      <div className="flex items-center gap-1.5 type-state mb-2.5">
        <span className="text-muted-foreground/50">{icon}</span>
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

function InspectorLink({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1 text-[10px] text-foreground/60 hover:text-foreground transition-colors">
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
  const w = 200;
  const h = 36;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 6) - 3,
  }));
  const linePoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `0,${h} ${linePoints} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9 block" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="hsl(0, 72%, 51%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#spark-fill)" />
      <polyline
        points={linePoints}
        fill="none"
        stroke="hsl(0, 72%, 60%)"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
