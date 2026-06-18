import { useMemo, useState } from "react";
import { assets, assetRelations, relationLabels, type AssetRelation, type Asset } from "@/data/mockAssets";
import { ChevronUp, ChevronDown } from "lucide-react";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { InspectorShell, InspectorEmpty as EmptyHint, type InspectorTone } from "@/components/ui/inspector-shell";

function useSection(initial = true) {
  const [open, setOpen] = useState(initial);
  return { open, onToggle: () => setOpen((v) => !v) };
}

interface AssetInspectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const healthTone: Record<string, string> = {
  healthy: "text-success",
  degraded: "text-warning",
  critical: "text-destructive",
  unknown: "text-muted-foreground",
};

const healthSwatch: Record<string, string> = {
  healthy: "bg-success",
  degraded: "bg-warning",
  critical: "bg-destructive",
  unknown: "bg-muted-foreground/40",
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
      className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] font-mono hover:bg-accent/50 hover:text-[hsl(var(--conn-orange))] transition-colors text-left group"
    >
      <Icon className={`w-3 h-3 ${direction === "up" ? "text-[hsl(var(--conn-blue))]" : "text-[hsl(var(--conn-orange))]"}`} />
      <span className="text-muted-foreground uppercase text-[9px] tracking-[0.18em] w-16 shrink-0">
        {relationLabels[rel.kind]}
      </span>
      <span className="text-foreground truncate group-hover:text-[hsl(var(--conn-orange))]">{asset.name}</span>
      <span className={`w-1.5 h-1.5 rounded-[1px] shrink-0 ${healthSwatch[asset.health]}`} />
      <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{asset.kind}</span>
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
      <InspectorShell>
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center gap-2 font-mono">
          <div className="n-label">No asset selected</div>
          <div className="text-[11px] text-muted-foreground/80 max-w-[220px] leading-relaxed">
            Pick an asset to inspect dependencies, downstream impact and health.
          </div>
        </div>
      </InspectorShell>
    );
  }

  const healthToneMap: Record<string, InspectorTone> = {
    healthy: "success",
    degraded: "warning",
    critical: "destructive",
    unknown: "muted",
  };

  return (
    <InspectorShell
      hero={{
        kind: asset.kind,
        id: asset.id,
        title: asset.name,
        subtitle: asset.vendor ? `${asset.vendor} · ${asset.model}` : undefined,
        status: { label: asset.health, tone: healthToneMap[asset.health] ?? "muted" },
      }}
    >
      <SectionDeps upstream={upstream} onSelect={onSelect} />
      <SectionImpact downstream={downstream} impactSet={impactSet} onSelect={onSelect} />
      <SectionRelated related={related} onSelect={onSelect} />
      <SectionHealth asset={asset} upstream={upstream} downstream={downstream} />
      <SectionTags asset={asset} />
      <SectionMeta asset={asset} />
    </InspectorShell>
  );
}


function SectionDeps({ upstream, onSelect }: { upstream: { rel: AssetRelation; asset: Asset }[]; onSelect: (id: string) => void }) {
  const s = useSection(true);
  return (
    <CollapsibleSection title="Dependencies" {...s}>
      <div className="space-y-0.5 px-1.5 py-1.5">
        {upstream.length === 0 ? (
          <EmptyHint
            what="No upstream dependencies."
            why="This asset isn't fed or controlled by anything — it may be a source, or a missing topology link."
            action="Add a 'feeds' or 'controls' relation from its parent system."
          />
        ) : (
          upstream.map(({ rel, asset: a }) => <RelationLine key={rel.id} rel={rel} asset={a} onSelect={onSelect} direction="up" />)
        )}
      </div>
    </CollapsibleSection>
  );
}

function SectionImpact({ downstream, impactSet, onSelect }: { downstream: { rel: AssetRelation; asset: Asset }[]; impactSet: Asset[]; onSelect: (id: string) => void }) {
  const s = useSection(true);
  return (
    <CollapsibleSection title={`Downstream Impact · ${String(impactSet.length).padStart(2, "0")}`} {...s}>
      <div className="space-y-0.5 px-1.5 py-1.5">
        {impactSet.length === 0 ? (
          <EmptyHint
            what="Nothing depends on this asset."
            why="A fault here won't cascade — but it also means it's not declared as a source for any downstream system."
            action="Link consumers via 'feeds' or 'measures' so impact analysis can trace incidents."
          />
        ) : (
          <>
            {downstream.map(({ rel, asset: a }) => <RelationLine key={rel.id} rel={rel} asset={a} onSelect={onSelect} direction="down" />)}
            {impactSet.length > downstream.length && (
              <div className="text-[10px] text-muted-foreground px-2 pt-1 font-mono uppercase tracking-wider">+ {impactSet.length - downstream.length} transitive</div>
            )}
          </>
        )}
      </div>
    </CollapsibleSection>
  );
}

function SectionRelated({ related, onSelect }: { related: Asset[]; onSelect: (id: string) => void }) {
  const s = useSection(false);
  return (
    <CollapsibleSection title={`Related · ${String(related.length).padStart(2, "0")}`} {...s}>
      <div className="space-y-0.5 px-1.5 py-1.5">
        {related.slice(0, 8).map((a) => (
          <button key={a.id} onClick={() => onSelect(a.id)} className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] font-mono hover:bg-accent/50 hover:text-[hsl(var(--conn-orange))] transition-colors text-left">
            <span className={`w-1.5 h-1.5 rounded-[1px] ${healthSwatch[a.health]}`} />
            <span className="text-foreground truncate">{a.name}</span>
            <span className="ml-auto text-[9px] text-muted-foreground uppercase tracking-wider">{a.kind}</span>
          </button>
        ))}
        {related.length === 0 && (
          <EmptyHint
            what="No related assets found."
            why="Related grouping uses shared tags — no other asset shares this one's tags yet."
            action="Add shared tags (e.g. 'HVAC', 'Critical') to surface peers across the portfolio."
          />
        )}
      </div>
    </CollapsibleSection>
  );
}

function SectionHealth({ asset, upstream, downstream }: { asset: Asset; upstream: unknown[]; downstream: unknown[] }) {
  const s = useSection(false);
  return (
    <CollapsibleSection title="Semantic Health" {...s}>
      <div className="px-3 py-2 space-y-1.5 font-mono text-[11px]">
        <div className="flex items-center justify-between"><span className="text-muted-foreground uppercase tracking-wider text-[10px]">Status</span><span className={`capitalize ${healthTone[asset.health]}`}>{asset.health}</span></div>
        <div className="flex items-center justify-between"><span className="text-muted-foreground uppercase tracking-wider text-[10px]">Connectivity</span><span className="text-foreground tabular-nums">{upstream.length}↑ / {downstream.length}↓</span></div>
        <div className="flex items-center justify-between"><span className="text-muted-foreground uppercase tracking-wider text-[10px]">Topology</span><span className={asset.aiHints?.length ? "text-warning" : "text-success"}>{asset.aiHints?.length ? "ISSUES" : "VALIDATED"}</span></div>
      </div>
    </CollapsibleSection>
  );
}

function SectionTags({ asset }: { asset: Asset }) {
  const s = useSection(true);
  return (
    <CollapsibleSection title="Tags" {...s}>
      <div className="px-3 py-2 flex flex-wrap gap-1">
        {asset.tags.map((t) => (
          <span key={t} className="px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-none bg-background text-foreground/80 border border-border">
            {t}
          </span>
        ))}
        {asset.tags.length === 0 && <span className="text-[11px] text-warning font-mono">No tags — AI suggests adding tags</span>}
      </div>
    </CollapsibleSection>
  );
}

function SectionMeta({ asset }: { asset: Asset }) {
  const s = useSection(false);
  return (
    <CollapsibleSection title="Metadata" {...s}>
      <div className="px-3 py-2 space-y-1 text-[11px] font-mono">
        <Row k="ID" v={asset.id} />
        <Row k="Kind" v={asset.kind} />
        <Row k="Parent" v={asset.parentId || "—"} />
        {asset.installedAt && <Row k="Installed" v={asset.installedAt} />}
        {asset.lastSeen && <Row k="Last seen" v={asset.lastSeen} />}
      </div>
    </CollapsibleSection>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground uppercase tracking-wider text-[10px]">{k}</span>
      <span className="text-foreground/80 truncate">{v}</span>
    </div>
  );
}
