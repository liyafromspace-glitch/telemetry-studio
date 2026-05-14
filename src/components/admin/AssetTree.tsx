import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search, Building2, Layers, Cpu, Wrench, HardDrive, Activity } from "lucide-react";
import { assets, type Asset, type AssetKind, assetKindLabels } from "@/data/mockAssets";
import { cn } from "@/lib/utils";

interface AssetTreeProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const kindIcon: Record<AssetKind, React.ComponentType<{ className?: string }>> = {
  building: Building2,
  floor: Layers,
  system: Cpu,
  equipment: Wrench,
  device: HardDrive,
  signal: Activity,
};

const healthDot: Record<string, string> = {
  healthy: "bg-success",
  degraded: "bg-warning",
  critical: "bg-destructive",
  unknown: "bg-muted-foreground/40",
};

export function AssetTree({ selectedId, onSelect }: AssetTreeProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(["bld-tower-a", "flr-a-bsm", "flr-a-2", "sys-cooling", "sys-air-2", "eq-pump-4"])
  );

  const childrenMap = useMemo(() => {
    const m = new Map<string | null, Asset[]>();
    for (const a of assets) {
      const arr = m.get(a.parentId) || [];
      arr.push(a);
      m.set(a.parentId, arr);
    }
    return m;
  }, []);

  const matchSet = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    const matches = new Set<string>();
    for (const a of assets) {
      if (a.name.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q))) {
        let cur: Asset | undefined = a;
        while (cur) {
          matches.add(cur.id);
          cur = assets.find((x) => x.id === cur!.parentId) || undefined;
        }
      }
    }
    return matches;
  }, [search]);

  const toggle = (id: string) =>
    setExpanded((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const renderNode = (node: Asset, depth: number) => {
    if (matchSet && !matchSet.has(node.id)) return null;
    const kids = childrenMap.get(node.id) || [];
    const hasKids = kids.length > 0;
    const isOpen = expanded.has(node.id) || (matchSet && matchSet.has(node.id));
    const Icon = kindIcon[node.kind];
    const active = selectedId === node.id;

    return (
      <div key={node.id}>
        <button
          onClick={() => onSelect(node.id)}
          className={cn(
            "w-full flex items-center gap-1.5 pr-2 py-1 text-xs transition-colors group",
            active ? "bg-accent text-foreground" : "text-secondary-foreground hover:bg-accent/50"
          )}
          style={{ paddingLeft: 8 + depth * 12 }}
        >
          {hasKids ? (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(node.id);
              }}
              className="w-3.5 h-3.5 flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </span>
          ) : (
            <span className="w-3.5" />
          )}
          <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{node.name}</span>
          <span className={cn("ml-auto w-1.5 h-1.5 rounded-full shrink-0", healthDot[node.health])} />
        </button>
        {isOpen && hasKids && kids.map((c) => renderNode(c, depth + 1))}
      </div>
    );
  };

  const roots = childrenMap.get(null) || [];

  const counts = assets.reduce((acc, a) => {
    acc[a.kind] = (acc[a.kind] || 0) + 1;
    return acc;
  }, {} as Record<AssetKind, number>);

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border shrink-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Asset Hierarchy
        </div>
      </div>
      <div className="p-2.5 border-b border-border shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets, tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-input text-foreground text-xs pl-8 pr-3 py-2 rounded-lg border border-border focus:border-primary focus:outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-1.5 min-h-0">
        {roots.map((r) => renderNode(r, 0))}
      </div>
      <div className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground shrink-0 flex items-center justify-between">
        <span>{assets.length} entities</span>
        <span className="font-mono">
          {Object.entries(counts)
            .map(([k, v]) => `${assetKindLabels[k as AssetKind][0]}${v}`)
            .join(" · ")}
        </span>
      </div>
    </div>
  );
}
