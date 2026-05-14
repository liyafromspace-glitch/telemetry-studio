import { useCallback, useMemo, useState } from "react";
import { assets, assetRelations, relationLabels, relationColors, type AssetKind, explainAsset } from "@/data/mockAssets";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Focus, Sparkles, Maximize2 } from "lucide-react";

interface AssetGraphProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const connColors: Record<string, string> = {
  blue: "hsl(var(--conn-blue))",
  orange: "hsl(var(--conn-orange))",
  pink: "hsl(var(--conn-pink))",
  green: "hsl(var(--conn-green))",
};

const healthStroke: Record<string, string> = {
  healthy: "hsl(var(--success))",
  degraded: "hsl(var(--warning))",
  critical: "hsl(var(--destructive))",
  unknown: "hsl(var(--border))",
};

const kindShape: Record<AssetKind, "rect" | "hex" | "circle" | "diamond"> = {
  building: "rect",
  floor: "rect",
  system: "hex",
  equipment: "rect",
  device: "diamond",
  signal: "circle",
};

// Layout: place nodes in columns by kind for a constrained, readable graph
const columnByKind: Record<AssetKind, number> = {
  building: 0,
  floor: 1,
  system: 2,
  equipment: 3,
  device: 4,
  signal: 5,
};

export function AssetGraph({ selectedId, onSelect }: AssetGraphProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [showAi, setShowAi] = useState(true);

  const layout = useMemo(() => {
    const COL_W = 160;
    const ROW_H = 64;
    const PAD_X = 40;
    const PAD_Y = 32;

    const byCol: Record<number, string[]> = {};
    for (const a of assets) {
      const c = columnByKind[a.kind];
      (byCol[c] = byCol[c] || []).push(a.id);
    }
    const positions: Record<string, { x: number; y: number }> = {};
    for (const [col, ids] of Object.entries(byCol)) {
      ids.forEach((id, i) => {
        positions[id] = {
          x: PAD_X + Number(col) * COL_W + 70,
          y: PAD_Y + i * ROW_H + 28,
        };
      });
    }
    const width = PAD_X * 2 + Object.keys(byCol).length * COL_W;
    const height = PAD_Y * 2 + Math.max(...Object.values(byCol).map((v) => v.length)) * ROW_H;
    return { positions, width, height };
  }, []);

  // Combine declared relations + parent links so the graph reads as a system
  const edges = useMemo(() => {
    const parentEdges = assets
      .filter((a) => a.parentId)
      .map((a, i) => ({ id: `p${i}`, from: a.parentId!, to: a.id, kind: "located_in" as const, structural: true }));
    return [
      ...parentEdges,
      ...assetRelations.map((r) => ({ ...r, structural: false })),
    ];
  }, []);

  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const e of edges) {
      if (!map.has(e.from)) map.set(e.from, new Set());
      if (!map.has(e.to)) map.set(e.to, new Set());
      map.get(e.from)!.add(e.to);
      map.get(e.to)!.add(e.from);
    }
    return map;
  }, [edges]);

  const focusSet = useMemo(() => {
    if (!focusMode || !selectedId) return null;
    const visited = new Set<string>([selectedId]);
    const queue = [selectedId];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const n of adjacency.get(cur) || []) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
      }
    }
    return visited;
  }, [focusMode, selectedId, adjacency]);

  const isInFocus = useCallback(
    (id: string) => !focusSet || focusSet.has(id),
    [focusSet]
  );

  // AI insights
  const aiInsights = useMemo(() => {
    const issues: { id: string; severity: "info" | "warn"; message: string }[] = [];
    // Missing tags
    for (const a of assets) {
      if (a.kind === "equipment" && a.tags.length === 0) {
        issues.push({ id: a.id, severity: "warn", message: `${a.name}: missing tags` });
      }
    }
    // Disconnected: equipment with no relations
    const connected = new Set<string>();
    for (const r of assetRelations) {
      connected.add(r.from);
      connected.add(r.to);
    }
    for (const a of assets) {
      if (a.kind === "equipment" && !connected.has(a.id)) {
        issues.push({ id: a.id, severity: "warn", message: `${a.name}: disconnected from any system topology` });
      }
    }
    // Topology validation: VFDs without a controlled motor link
    for (const a of assets) {
      if (a.kind === "device" && a.name.includes("VFD")) {
        const ok = assetRelations.some((r) => r.from === a.id && r.kind === "controls");
        if (!ok) issues.push({ id: a.id, severity: "warn", message: `${a.name}: no 'controls' link declared` });
      }
    }
    return issues.slice(0, 4);
  }, []);

  const explain = selectedId ? explainAsset(selectedId) : null;

  const renderNode = (id: string) => {
    const a = assets.find((x) => x.id === id);
    if (!a) return null;
    const pos = layout.positions[id];
    const shape = kindShape[a.kind];
    const stroke = healthStroke[a.health];
    const isSelected = selectedId === id;
    const isHovered = hovered === id;
    const dim = !isInFocus(id);
    const w = 116;
    const h = 36;

    let shapeEl: JSX.Element;
    if (shape === "rect") {
      shapeEl = (
        <rect
          x={pos.x - w / 2}
          y={pos.y - h / 2}
          width={w}
          height={h}
          rx={6}
          fill="hsl(var(--card))"
          stroke={isSelected ? "hsl(var(--primary))" : stroke}
          strokeWidth={isSelected ? 1.5 : 1}
        />
      );
    } else if (shape === "hex") {
      const points = [
        [pos.x - w / 2, pos.y],
        [pos.x - w / 2 + 10, pos.y - h / 2],
        [pos.x + w / 2 - 10, pos.y - h / 2],
        [pos.x + w / 2, pos.y],
        [pos.x + w / 2 - 10, pos.y + h / 2],
        [pos.x - w / 2 + 10, pos.y + h / 2],
      ]
        .map((p) => p.join(","))
        .join(" ");
      shapeEl = (
        <polygon
          points={points}
          fill="hsl(var(--card))"
          stroke={isSelected ? "hsl(var(--primary))" : stroke}
          strokeWidth={isSelected ? 1.5 : 1}
        />
      );
    } else if (shape === "diamond") {
      const points = [
        [pos.x, pos.y - h / 2],
        [pos.x + w / 2, pos.y],
        [pos.x, pos.y + h / 2],
        [pos.x - w / 2, pos.y],
      ]
        .map((p) => p.join(","))
        .join(" ");
      shapeEl = (
        <polygon
          points={points}
          fill="hsl(var(--card))"
          stroke={isSelected ? "hsl(var(--primary))" : stroke}
          strokeWidth={isSelected ? 1.5 : 1}
        />
      );
    } else {
      shapeEl = (
        <ellipse
          cx={pos.x}
          cy={pos.y}
          rx={w / 2}
          ry={h / 2}
          fill="hsl(var(--card))"
          stroke={isSelected ? "hsl(var(--primary))" : stroke}
          strokeWidth={isSelected ? 1.5 : 1}
        />
      );
    }

    return (
      <Tooltip key={id}>
        <TooltipTrigger asChild>
          <g
            style={{ opacity: dim ? 0.15 : 1, cursor: "pointer", transition: "opacity 200ms ease" }}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(id)}
          >
            {shapeEl}
            <circle cx={pos.x - w / 2 + 6} cy={pos.y} r={3} fill={stroke} />
            <text
              x={pos.x - w / 2 + 14}
              y={pos.y - 1}
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight={isSelected ? 600 : 500}
              fill="hsl(var(--foreground))"
            >
              {a.name.length > 16 ? a.name.slice(0, 15) + "…" : a.name}
            </text>
            <text
              x={pos.x - w / 2 + 14}
              y={pos.y + 11}
              fontSize="8"
              fontFamily="Inter, sans-serif"
              fill="hsl(var(--muted-foreground))"
            >
              {a.kind}
            </text>
            {isHovered && (
              <rect
                x={pos.x - w / 2 - 1}
                y={pos.y - h / 2 - 1}
                width={w + 2}
                height={h + 2}
                rx={7}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeOpacity={0.4}
                strokeWidth={1}
              />
            )}
          </g>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-[10px] max-w-[200px]">
          <div className="font-medium">{a.name}</div>
          <div className="text-muted-foreground">{a.kind} · {a.health}</div>
          {a.vendor && <div className="text-muted-foreground">{a.vendor} {a.model}</div>}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="h-9 flex items-center justify-between px-4 border-b border-border shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Relationship Graph
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            {assets.length} nodes · {assetRelations.length + assets.filter((a) => a.parentId).length} edges
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAi((v) => !v)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
              showAi ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            title="AI insights"
          >
            <Sparkles className="w-3 h-3" />
            AI
          </button>
          <button
            onClick={() => setFocusMode((v) => !v)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
              focusMode ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Focus on selected and its neighborhood"
          >
            <Focus className="w-3 h-3" />
            Focus
          </button>
          <button
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] text-muted-foreground hover:text-foreground"
            title="Fit to screen"
          >
            <Maximize2 className="w-3 h-3" />
            Fit
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <TooltipProvider delayDuration={150}>
          <svg
            width={layout.width}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            className="block"
          >
            {/* Column headers */}
            {(["building", "floor", "system", "equipment", "device", "signal"] as AssetKind[]).map(
              (k, i) => (
                <text
                  key={k}
                  x={40 + i * 160 + 70}
                  y={16}
                  fontSize="9"
                  fontFamily="Inter, sans-serif"
                  fontWeight={500}
                  fill="hsl(var(--muted-foreground))"
                  textAnchor="middle"
                  style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
                >
                  {k}
                </text>
              )
            )}
            {/* Edges */}
            <defs>
              {Object.entries(connColors).map(([k, c]) => (
                <marker
                  key={k}
                  id={`asset-arrow-${k}`}
                  viewBox="0 0 6 6"
                  refX="6"
                  refY="3"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M0,0 L6,3 L0,6" fill="none" stroke={c} strokeWidth="1" opacity="0.7" />
                </marker>
              ))}
            </defs>
            {edges.map((e) => {
              const a = layout.positions[e.from];
              const b = layout.positions[e.to];
              if (!a || !b) return null;
              const inFocus = isInFocus(e.from) && isInFocus(e.to);
              const colorKey = e.structural ? "blue" : relationColors[e.kind];
              const color = connColors[colorKey];
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const angle = Math.atan2(dy, dx);
              const ax = a.x + Math.cos(angle) * 60;
              const ay = a.y + Math.sin(angle) * 16;
              const bx = b.x - Math.cos(angle) * 60;
              const by = b.y - Math.sin(angle) * 16;
              return (
                <line
                  key={e.id}
                  x1={ax}
                  y1={ay}
                  x2={bx}
                  y2={by}
                  stroke={color}
                  strokeWidth={1}
                  strokeDasharray={e.structural ? "3 3" : "none"}
                  opacity={inFocus ? 0.55 : 0.08}
                  markerEnd={`url(#asset-arrow-${colorKey})`}
                />
              );
            })}
            {/* Nodes */}
            {assets.map((a) => renderNode(a.id))}
          </svg>
        </TooltipProvider>
      </div>

      {/* AI Insight strip */}
      {showAi && (aiInsights.length > 0 || explain) && (
        <div className="border-t border-border bg-card/50 px-4 py-2 shrink-0 space-y-1.5">
          {explain && (
            <div className="flex items-start gap-2 text-[11px]">
              <Sparkles className="w-3 h-3 text-primary mt-0.5 shrink-0" />
              <span className="text-foreground/90">{explain}</span>
            </div>
          )}
          {aiInsights.map((ins, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px]">
              <Sparkles className="w-3 h-3 text-warning mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                <button
                  className="text-foreground/90 hover:text-primary underline-offset-2 hover:underline"
                  onClick={() => onSelect(ins.id)}
                >
                  {ins.message}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-border bg-card/30 px-4 py-1.5 shrink-0 flex items-center gap-4 text-[10px] text-muted-foreground">
        {Object.entries(relationLabels).map(([k, label]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-px"
              style={{ background: connColors[relationColors[k as keyof typeof relationLabels]] }}
            />
            {label}
          </span>
        ))}
        <span className="text-border">|</span>
        <span>--- structural</span>
      </div>
    </div>
  );
}
