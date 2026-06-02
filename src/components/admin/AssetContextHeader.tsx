import { ChevronRight, ArrowUpRight, ArrowDownRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { assets, assetRelations, assetKindLabels, type Asset } from "@/data/mockAssets";
import { useMemo } from "react";

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const healthTone: Record<string, string> = {
  healthy: "text-success",
  degraded: "text-warning",
  critical: "text-destructive",
  unknown: "text-muted-foreground",
};

const healthDot: Record<string, string> = {
  healthy: "bg-success",
  degraded: "bg-warning",
  critical: "bg-destructive",
  unknown: "bg-muted-foreground/40",
};

function chainOf(id: string): Asset[] {
  const chain: Asset[] = [];
  let cur = assets.find((a) => a.id === id);
  while (cur) {
    chain.unshift(cur);
    cur = cur.parentId ? assets.find((a) => a.id === cur!.parentId) : undefined;
  }
  return chain;
}

export function AssetContextHeader({ selectedId, onSelect }: Props) {
  const asset = selectedId ? assets.find((a) => a.id === selectedId) : null;
  const chain = useMemo(() => (selectedId ? chainOf(selectedId) : []), [selectedId]);

  const { upCount, downCount, impactCount, hasTopologyIssue } = useMemo(() => {
    if (!selectedId) return { upCount: 0, downCount: 0, impactCount: 0, hasTopologyIssue: false };
    const up = assetRelations.filter((r) => r.to === selectedId).length;
    const down = assetRelations.filter((r) => r.from === selectedId).length;
    const visited = new Set<string>();
    const q = [selectedId];
    while (q.length) {
      const c = q.shift()!;
      for (const r of assetRelations) {
        if (r.from === c && !visited.has(r.to)) {
          visited.add(r.to);
          q.push(r.to);
        }
      }
    }
    const a = assets.find((x) => x.id === selectedId);
    return {
      upCount: up,
      downCount: down,
      impactCount: visited.size,
      hasTopologyIssue: !!a?.aiHints?.length,
    };
  }, [selectedId]);

  return (
    <div className="h-11 flex items-center gap-3 px-4 border-b border-border bg-card/40 shrink-0 text-[11px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 min-w-0 flex-1">
        <span className="text-muted-foreground/70 uppercase tracking-[0.14em] text-[10px] font-semibold">
          Admin
        </span>
        <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
        <span className="text-muted-foreground/70 uppercase tracking-[0.14em] text-[10px] font-semibold">
          Assets
        </span>
        {chain.map((a, i) => {
          const last = i === chain.length - 1;
          return (
            <span key={a.id} className="flex items-center gap-1 min-w-0">
              <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
              <button
                onClick={() => onSelect(a.id)}
                className={`truncate transition-colors ${
                  last
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={`${assetKindLabels[a.kind]} · ${a.name}`}
              >
                {a.name}
              </button>
            </span>
          );
        })}
        {!asset && (
          <span className="text-muted-foreground italic ml-1">No asset selected</span>
        )}
      </nav>

      {/* Consolidated status summary */}
      {asset && (
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${healthDot[asset.health]}`} />
            <span className={`uppercase tracking-wider text-[10px] font-semibold ${healthTone[asset.health]}`}>
              {asset.health}
            </span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-3 tabular-nums text-muted-foreground">
            <span className="flex items-center gap-1" title="Upstream dependencies">
              <ArrowUpRight className="w-3 h-3 text-[hsl(var(--conn-blue))]" />
              <span className="text-foreground/90">{upCount}</span>
            </span>
            <span className="flex items-center gap-1" title="Direct downstream">
              <ArrowDownRight className="w-3 h-3 text-[hsl(var(--conn-orange))]" />
              <span className="text-foreground/90">{downCount}</span>
              <span className="text-muted-foreground/60">/ {impactCount} impact</span>
            </span>
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            {hasTopologyIssue ? (
              <>
                <AlertTriangle className="w-3 h-3 text-warning" />
                <span className="text-warning text-[10px] uppercase tracking-wider font-semibold">
                  Topology
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3 text-success" />
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
                  Validated
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
