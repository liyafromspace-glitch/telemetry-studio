import { useMemo, useState } from "react";
import { assets, assetRelations, relationLabels, type AssetRelation, type Asset } from "@/data/mockAssets";
import { ChevronUp, ChevronDown, Tag, Activity, Heart, Link2, Layers } from "lucide-react";
import { CollapsibleSection } from "@/components/ui/collapsible-section";

function useSection(initial = true) {
  const [open, setOpen] = useState(initial);
  return { open, onToggle: () => setOpen((v) => !v) };
}

interface AssetInspectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const healthBg: Record<string, string> = {
  healthy: "bg-success/15 text-success",
  degraded: "bg-warning/15 text-warning",
  critical: "bg-destructive/15 text-destructive",
  unknown: "bg-muted text-muted-foreground",
};

function RelationLine({
  rel,
  asset,
  onSelect,
  direction,
}: {
  rel: AssetRelation;
  asset: Asset;
  onSelect: (id: string) => void;
  direction: "up" | "down";
}) {
  const Icon = direction === "up" ? ChevronUp : ChevronDown;
  return (
    <button
      onClick={() => onSelect(asset.id)}
      className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] rounded-md hover:bg-accent transition-colors text-left group"
    >
      <Icon className={`w-3 h-3 ${direction === "up" ? "text-blue-400" : "text-orange-400"}`} />
      <span className="text-muted-foreground uppercase text-[9px] tracking-wider w-16 shrink-0">
        {relationLabels[rel.kind]}
      </span>
      <span className="text-foreground truncate group-hover:text-primary">{asset.name}</span>
      <span className="ml-auto text-[9px] text-muted-foreground">{asset.kind}</span>
    </button>
  );
}

export function AssetInspector({ selectedId, onSelect }: AssetInspectorProps) {
  const asset = assets.find((a) => a.id === selectedId);

  const upstream = useMemo(
    () =>
      assetRelations
        .filter((r) => r.to === selectedId)
        .map((r) => ({ rel: r, asset: assets.find((a) => a.id === r.from)! }))
        .filter((x) => x.asset),
    [selectedId]
  );

  const downstream = useMemo(
    () =>
      assetRelations
        .filter((r) => r.from === selectedId)
        .map((r) => ({ rel: r, asset: assets.find((a) => a.id === r.to)! }))
        .filter((x) => x.asset),
    [selectedId]
  );

  // Downstream impact: full transitive set
  const impactSet = useMemo(() => {
    if (!selectedId) return [];
    const visited = new Set<string>();
    const queue = [selectedId];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const r of assetRelations) {
        if (r.from === cur && !visited.has(r.to)) {
          visited.add(r.to);
          queue.push(r.to);
        }
      }
    }
    return [...visited].map((id) => assets.find((a) => a.id === id)!).filter(Boolean);
  }, [selectedId]);

  const related = useMemo(() => {
    if (!asset) return [];
    return assets.filter(
      (a) => a.id !== asset.id && a.tags.some((t) => asset.tags.includes(t))
    );
  }, [asset]);

  if (!asset) {
    return (
      <div className="flex flex-col h-full bg-card overflow-hidden items-center justify-center text-xs text-muted-foreground">
        Select an asset
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border shrink-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Inspector
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Hero */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{asset.kind}</div>
              <div className="text-[15px] font-semibold tracking-tight text-foreground truncate">
                {asset.name}
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${healthBg[asset.health]}`}>
              {asset.health}
            </span>
          </div>
          {asset.vendor && (
            <div className="text-[11px] text-muted-foreground mt-1">
              {asset.vendor} · {asset.model}
            </div>
          )}
        </div>

        <SectionDeps upstream={upstream} onSelect={onSelect} />
        <SectionImpact downstream={downstream} impactSet={impactSet} onSelect={onSelect} />
        <SectionRelated related={related} onSelect={onSelect} />
        <SectionHealth asset={asset} upstream={upstream} downstream={downstream} />
        <SectionTags asset={asset} />
        <SectionMeta asset={asset} />
      </div>
    </div>
  );
}
