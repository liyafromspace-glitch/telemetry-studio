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
    const COL_W = 168;
    const ROW_H = 64;
    const PAD_X = 40;
    const PAD_Y = 40;

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

  const aiInsights = useMemo(() => {
    const issues: { id: string; severity: "info" | "warn"; message: string }[] = [];
    for (const a of assets) {
      if (a.kind === "equipment" && a.tags.length === 0) {
        issues.push({ id: a.id, severity: "warn", message: `${a.name}: missing tags` });
      }
    }
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
    const stroke = healthStroke[a.health];
    const isSelected = selectedId === id;
    const isHovered = hovered === id;
    const dim = !isInFocus(id);
    const w = 120;
    const h = 32;

    // Pixel-style box with corner brackets (terminal frame)
    const x = pos.x - w / 2;
    const y = pos.y - h / 2;
    const c = 4; // bracket size

    return (
      <Tooltip key={id}>
        <TooltipTrigger asChild>
          <g
            style={{ opacity: dim ? 0.2 : 1, cursor: "pointer", transition: "opacity 180ms ease" }}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(id)}
          >
            {/* Background pixel fill */}
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={isSelected ? "hsl(var(--conn-orange) / 0.08)" : "hsl(var(--background))"}
              stroke={isSelected ? "hsl(var(--conn-orange))" : "hsl(var(--border))"}
              strokeWidth={1}
              shapeRendering="crispEdges"
            />
            {/* Corner brackets — terminal feel */}
            {[
              [x, y, x + c, y, x, y + c],
              [x + w, y, x + w - c, y, x + w, y + c],
              [x, y + h, x + c, y + h, x, y + h - c],
              [x + w, y + h, x + w - c, y + h, x + w, y + h - c],
            ].map((pts, i) => (
              <polyline
                key={i}
                points={`${pts[0]},${pts[1]} ${pts[2]},${pts[3]} ${pts[0]},${pts[1]} ${pts[4]},${pts[5]}`}
                fill="none"
                stroke={isSelected ? "hsl(var(--conn-orange))" : "hsl(var(--muted-foreground) / 0.5)"}
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
            ))}
            {/* Health pixel */}
            <rect x={x + 6} y={pos.y - 3} width={6} height={6} fill={stroke} shapeRendering="crispEdges" />
            {/* Name */}
            <text
              x={x + 18}
              y={pos.y - 1}
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              fontWeight={isSelected ? 600 : 500}
              fill={isSelected ? "hsl(var(--conn-orange))" : "hsl(var(--foreground))"}
              style={{ letterSpacing: "0.02em" }}
            >
              {a.name.length > 17 ? a.name.slice(0, 16) + "…" : a.name}
            </text>
            {/* Meta */}
            <text
              x={x + 18}
              y={pos.y + 10}
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
              fill="hsl(var(--muted-foreground))"
              style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}
            >
              {a.kind} · {a.health[0].toUpperCase()}
            </text>
            {isHovered && !isSelected && (
              <rect
                x={x - 2}
                y={y - 2}
                width={w + 4}
                height={h + 4}
                fill="none"
                stroke="hsl(var(--conn-orange))"
                strokeOpacity={0.5}
                strokeWidth={1}
                strokeDasharray="2 2"
                shapeRendering="crispEdges"
              />
            )}
          </g>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-[10px] max-w-[200px] font-mono">
          <div className="font-medium">{a.name}</div>
          <div className="text-muted-foreground uppercase tracking-wider">{a.kind} · {a.health}</div>
          {a.vendor && <div className="text-muted-foreground">{a.vendor} {a.model}</div>}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header bar */}
      <div className="h-9 flex items-center justify-between px-4 border-b border-border shrink-0 bg-card/40">
        <div className="flex items-center gap-3">
          <span className="n-label">
            <span className="n-accent">▸</span> Relationship Graph
          </span>
          <span className="n-mono text-[10px] text-muted-foreground/70 tracking-wider">
            {String(assets.length).padStart(2, "0")} NODES · {String(assetRelations.length + assets.filter((a) => a.parentId).length).padStart(2, "0")} EDGES
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono">
          <button
            onClick={() => setShowAi((v) => !v)}
            className={`flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider transition-colors ${
              showAi ? "text-[hsl(var(--conn-orange))]" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            AI
          </button>
          <button
            onClick={() => setFocusMode((v) => !v)}
            className={`flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider transition-colors ${
              focusMode ? "text-[hsl(var(--conn-orange))]" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Focus className="w-3 h-3" />
            Focus
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <Maximize2 className="w-3 h-3" />
            Fit
          </button>
        </div>
      </div>

      {/* Canvas with dot grid */}
      <div className="flex-1 min-h-0 overflow-auto nostalgic-dot-grid relative">
        <div className="absolute inset-0 nostalgic-scanlines pointer-events-none" />
        <TooltipProvider delayDuration={150}>
          <svg
            width={layout.width}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            className="block relative"
          >
            {/* Column headers */}
            {(["building", "floor", "system", "equipment", "device", "signal"] as AssetKind[]).map(
              (k, i) => (
                <g key={k}>
                  <text
                    x={40 + i * 168 + 70}
                    y={18}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight={500}
                    fill="hsl(var(--muted-foreground))"
                    textAnchor="middle"
                    style={{ textTransform: "uppercase", letterSpacing: "0.22em" }}
                  >
                    {String(i).padStart(2, "0")} · {k}
                  </text>
                  <line
                    x1={40 + i * 168 + 70 - 30}
                    x2={40 + i * 168 + 70 + 30}
                    y1={24}
                    y2={24}
                    stroke="hsl(var(--border))"
                    strokeDasharray="2 2"
                    shapeRendering="crispEdges"
                  />
                </g>
              )
            )}
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
                  <path d="M0,0 L6,3 L0,6" fill="none" stroke={c} strokeWidth="1" opacity="0.8" />
                </marker>
              ))}
            </defs>
            {edges.map((e) => {
              const a = layout.positions[e.from];
              const b = layout.positions[e.to];
              if (!a || !b) return null;
              const inFocus = isInFocus(e.from) && isInFocus(e.to);
              const isUpstreamEdge = selectedId && e.to === selectedId;
              const isDownstreamEdge = selectedId && e.from === selectedId;
              const touchesSelected = isUpstreamEdge || isDownstreamEdge;
              const colorKey = isUpstreamEdge
                ? "blue"
                : isDownstreamEdge
                ? "orange"
                : e.structural
                ? "blue"
                : relationColors[e.kind];
              const color = connColors[colorKey];
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const angle = Math.atan2(dy, dx);
              const ax = a.x + Math.cos(angle) * 62;
              const ay = a.y + Math.sin(angle) * 14;
              const bx = b.x - Math.cos(angle) * 62;
              const by = b.y - Math.sin(angle) * 14;
              return (
                <line
                  key={e.id}
                  x1={ax}
                  y1={ay}
                  x2={bx}
                  y2={by}
                  stroke={color}
                  strokeWidth={touchesSelected ? 1.25 : 1}
                  strokeDasharray={e.structural && !touchesSelected ? "2 3" : touchesSelected ? "none" : "4 2"}
                  opacity={!inFocus ? 0.08 : touchesSelected ? 1 : selectedId ? 0.25 : 0.45}
                  markerEnd={`url(#asset-arrow-${colorKey})`}
                  shapeRendering="crispEdges"
                />
              );
            })}
            {assets.map((a) => renderNode(a.id))}
          </svg>
        </TooltipProvider>
      </div>

      {/* AI strip */}
      {showAi && (aiInsights.length > 0 || explain) && (
        <div className="border-t border-dashed border-border bg-card/40 px-4 py-2 shrink-0 space-y-1 font-mono">
          {explain && (
            <div className="flex items-start gap-2 text-[11px]">
              <span className="text-[hsl(var(--conn-orange))] text-[10px] mt-0.5">▸ AI</span>
              <span className="text-foreground/90">{explain}</span>
            </div>
          )}
          {aiInsights.map((ins, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px]">
              <span className="text-warning text-[10px] mt-0.5">!</span>
              <button
                className="text-foreground/80 hover:text-[hsl(var(--conn-orange))] text-left"
                onClick={() => onSelect(ins.id)}
              >
                {ins.message}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-border bg-card/30 px-4 py-1.5 shrink-0 flex items-center gap-4 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
        {Object.entries(relationLabels).map(([k, label]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span
              className="w-3 h-px"
              style={{ background: connColors[relationColors[k as keyof typeof relationLabels]] }}
            />
            {label}
          </span>
        ))}
        <span className="text-border">|</span>
        <span>┄┄ structural</span>
      </div>
    </div>
  );
}
