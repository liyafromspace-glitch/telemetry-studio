import { X, ArrowRight, Check, Eye } from "lucide-react";
import {
  InspectorShell,
  InspectorRow,
  InspectorTag,
  type InspectorTone,
} from "@/components/ui/inspector-shell";
import type {
  IntelligenceItem,
  IntelligenceItemSeverity,
} from "@/hooks/useOperationalIntelligence";

interface Props {
  item: IntelligenceItem | null;
  items: IntelligenceItem[];
  onClose: () => void;
  onSelect: (id: string) => void;
  onAcknowledge: (id: string) => void;
  onMonitor: (id: string) => void;
  onOpenInvestigate: (item: IntelligenceItem) => void;
}

const sevTone: Record<IntelligenceItemSeverity, InspectorTone> = {
  critical: "destructive",
  high: "warning",
  medium: "muted",
  low: "muted",
};

const sevDot: Record<IntelligenceItemSeverity, string> = {
  critical: "bg-destructive",
  high: "bg-warning",
  medium: "bg-primary",
  low: "bg-muted-foreground/40",
};

export function IntelligenceInspector({
  item,
  items,
  onClose,
  onSelect,
  onAcknowledge,
  onMonitor,
  onOpenInvestigate,
}: Props) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="w-[760px] max-w-[92vw] h-full flex shrink-0 border-l border-border bg-background shadow-2xl">
        {/* Item list */}
        <div className="w-[240px] border-r border-border bg-card/40 flex flex-col">
          <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-foreground/80">
              AI Intelligence
            </span>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {items.map((it) => {
              const active = it.id === item.id;
              return (
                <button
                  key={it.id}
                  onClick={() => onSelect(it.id)}
                  className={`w-full text-left px-3 py-2.5 border-b border-border/60 transition-colors ${
                    active ? "bg-accent" : "hover:bg-accent/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-[1px] ${sevDot[it.severity]}`} />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                      {it.severity} · {it.confidence}%
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-foreground/90 leading-snug">
                    {it.title}
                  </div>
                  <div className="text-[9px] font-mono uppercase text-muted-foreground/70 mt-1">
                    {it.status}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1 min-w-0">
          <InspectorShell
            hero={{
              kind: `AI · ${item.sourceType}`,
              id: item.sourceId,
              title: item.title,
              subtitle: `${item.assetName} · confidence ${item.confidence}%`,
              status: {
                label: item.status,
                tone: sevTone[item.severity],
              },
            }}
            footer={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAcknowledge(item.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border hover:border-foreground/40 transition-colors"
                >
                  <Check className="w-3 h-3" /> Acknowledge
                </button>
                <button
                  onClick={() => onMonitor(item.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border hover:border-foreground/40 transition-colors"
                >
                  <Eye className="w-3 h-3" /> Mark as monitoring
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => onOpenInvestigate(item)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-background bg-foreground hover:bg-foreground/90 transition-colors"
                >
                  Open in Investigate <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            }
          >
            <div className="p-4 space-y-4">
              {/* Status header */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pb-3 border-b border-dashed border-border">
                <InspectorRow k="Severity">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className={`w-1.5 h-1.5 rounded-[1px] ${sevDot[item.severity]}`} />
                    <span className="uppercase tracking-wider">{item.severity}</span>
                  </span>
                </InspectorRow>
                <InspectorRow k="Status" v={item.status} />
                <InspectorRow k="Confidence" v={`${item.confidence}%`} mono />
                <InspectorRow k="Source">
                  <InspectorTag>
                    {item.sourceType} · {item.sourceId}
                  </InspectorTag>
                </InspectorRow>
              </div>

              {/* AI interpretation */}
              <Section label="Why this matters">
                <p className="text-[11px] font-mono text-foreground/85 leading-relaxed">
                  {item.whyItMatters}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground leading-relaxed mt-1.5">
                  {item.aiReason}
                </p>
              </Section>

              <Section label="Recommended action" accent>
                <p className="text-[11px] font-mono text-foreground leading-relaxed">
                  → {item.recommendedAction}
                </p>
              </Section>

              {item.predictedRisk && (
                <Section label="Predicted risk">
                  <p className="text-[11px] font-mono text-foreground/85 leading-relaxed">
                    {item.predictedRisk}
                  </p>
                </Section>
              )}

              {/* Evidence */}
              <Section label={`Evidence · ${item.evidence.length}`}>
                <div className="border border-border">
                  {item.evidence.map((e, i) => (
                    <div
                      key={e.id}
                      className={`flex items-center gap-3 px-2.5 py-1.5 text-[11px] font-mono ${
                        i > 0 ? "border-t border-border/60" : ""
                      }`}
                    >
                      <span className="text-muted-foreground/70 w-3 text-[9px] tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-foreground/90 flex-1 truncate">{e.label}</span>
                      <span className="text-foreground tabular-nums shrink-0">{e.value}</span>
                      <InspectorTag>{e.sourceType}</InspectorTag>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Causal chain */}
              <Section label="Causal chain">
                <div className="flex flex-col gap-0 font-mono">
                  {[
                    "Temperature drift",
                    "Pressure deviation",
                    "Overheat rule triggered",
                    "Emergency matrix risk",
                  ].map((node, i, arr) => (
                    <div key={node} className="flex flex-col items-start">
                      <div className="flex items-center gap-2 px-2.5 py-1.5 border border-border bg-card/40 text-[11px] text-foreground/90">
                        <span className="w-1 h-1 rounded-full bg-[hsl(var(--conn-orange))]" />
                        {node}
                      </div>
                      {i < arr.length - 1 && (
                        <div className="ml-3 h-3 w-px bg-border" />
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </InspectorShell>
        </div>
      </div>
    </div>
  );
}

function Section({
  label,
  accent,
  children,
}: {
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div
        className={`text-[10px] font-mono uppercase tracking-[0.14em] ${
          accent ? "text-[hsl(var(--conn-orange))]" : "text-muted-foreground"
        }`}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
