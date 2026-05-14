import { useMemo } from "react";
import { assets, assetRelations, relationLabels, type AssetRelation, type Asset } from "@/data/mockAssets";
import { ChevronUp, ChevronDown, Tag, Activity, Heart, Link2, Layers } from "lucide-react";
import { CollapsibleSection } from "@/components/ui/collapsible-section";

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

        <CollapsibleSection title="Dependencies" defaultOpen>
          <div className="space-y-0.5">
            {upstream.length === 0 && (
              <div className="text-[11px] text-muted-foreground px-2 py-1">No upstream dependencies</div>
            )}
            {upstream.map(({ rel, asset: a }) => (
              <RelationLine key={rel.id} rel={rel} asset={a} onSelect={onSelect} direction="up" />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title={`Downstream Impact (${impactSet.length})`}
         
          defaultOpen
        >
          <div className="space-y-0.5">
            {impactSet.length === 0 && (
              <div className="text-[11px] text-muted-foreground px-2 py-1">No downstream impact</div>
            )}
            {downstream.map(({ rel, asset: a }) => (
              <RelationLine key={rel.id} rel={rel} asset={a} onSelect={onSelect} direction="down" />
            ))}
            {impactSet.length > downstream.length && (
              <div className="text-[10px] text-muted-foreground px-2 pt-1">
                + {impactSet.length - downstream.length} transitive
              </div>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={`Related Assets (${related.length})`}>
          <div className="space-y-0.5">
            {related.slice(0, 8).map((a) => (
              <button
                key={a.id}
                onClick={() => onSelect(a.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] rounded-md hover:bg-accent transition-colors text-left"
              >
                <span className="text-foreground truncate">{a.name}</span>
                <span className="ml-auto text-[9px] text-muted-foreground">{a.kind}</span>
              </button>
            ))}
            {related.length === 0 && (
              <div className="text-[11px] text-muted-foreground px-2 py-1">No related assets</div>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Semantic Health">
          <div className="px-2 py-1.5 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Status</span>
              <span className="text-foreground capitalize">{asset.health}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Connectivity</span>
              <span className="text-foreground tabular-nums">
                {upstream.length}↑ / {downstream.length}↓
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Topology</span>
              <span className={asset.aiHints?.length ? "text-warning" : "text-success"}>
                {asset.aiHints?.length ? "Issues detected" : "Validated"}
              </span>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Tags" defaultOpen>
          <div className="px-2 py-1 flex flex-wrap gap-1">
            {asset.tags.map((t) => (
              <span
                key={t}
                className="px-1.5 py-0.5 text-[10px] rounded-md bg-muted text-foreground/80 border border-border"
              >
                {t}
              </span>
            ))}
            {asset.tags.length === 0 && (
              <span className="text-[11px] text-warning">No tags — AI suggests adding tags</span>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Metadata">
          <div className="px-2 py-1.5 space-y-1 text-[11px]">
            <div className="flex justify-between"><span className="text-muted-foreground">ID</span><span className="font-mono text-foreground/80">{asset.id}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Kind</span><span>{asset.kind}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Parent</span><span>{asset.parentId || "—"}</span></div>
            {asset.installedAt && <div className="flex justify-between"><span className="text-muted-foreground">Installed</span><span>{asset.installedAt}</span></div>}
            {asset.lastSeen && <div className="flex justify-between"><span className="text-muted-foreground">Last seen</span><span>{asset.lastSeen}</span></div>}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
