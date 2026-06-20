import { Sparkles, ArrowRight, Check } from "lucide-react";

interface AIBriefingStripProps {
  counts: { critical: number; high: number; medium: number; low: number };
  total: number;
  avgConfidence: number;
  onReview: () => void;
  onAcknowledgeAll: () => void;
}

export function AIBriefingStrip({
  counts,
  total,
  avgConfidence,
  onReview,
  onAcknowledgeAll,
}: AIBriefingStripProps) {
  return (
    <div className="relative flex items-center gap-5 px-6 py-2.5 border-b border-dashed border-border bg-card/40 shrink-0 nostalgic-dot-grid-tight">
      <div className="absolute inset-0 nostalgic-scanlines pointer-events-none opacity-40" />

      <div className="relative flex items-center gap-2 shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--conn-orange))]" />
        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-foreground/80">
          AI Operational Brief
        </span>
      </div>

      <div className="relative w-px h-5 bg-border/60" />

      <div className="relative flex-1 min-w-0 text-[11px] font-mono text-foreground/85 truncate">
        <span className="text-foreground">{total}</span>{" "}
        <span className="text-muted-foreground">
          prioritized risks detected from live telemetry, rules, and incidents.
        </span>
      </div>

      <div className="relative flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider shrink-0">
        <SevPill dot="bg-destructive" label="Crit" value={counts.critical} />
        <SevPill dot="bg-warning" label="High" value={counts.high} />
        <SevPill dot="bg-primary" label="Med" value={counts.medium} />
        <span className="text-muted-foreground/60">·</span>
        <span className="text-muted-foreground">
          conf <span className="text-foreground tabular-nums">{avgConfidence}%</span>
        </span>
        <span className="text-muted-foreground/60">·</span>
        <span className="text-muted-foreground">updated just now</span>
      </div>

      <div className="relative flex items-center gap-2 shrink-0">
        <button
          onClick={onAcknowledgeAll}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border hover:border-foreground/40 transition-colors"
        >
          <Check className="w-3 h-3" /> Ack all
        </button>
        <button
          onClick={onReview}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-background bg-foreground hover:bg-foreground/90 transition-colors"
        >
          Review intelligence <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function SevPill({ dot, label, value }: { dot: string; label: string; value: number }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-[1px] ${dot}`} />
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground tabular-nums">{value}</span>
    </span>
  );
}
