import { useState, useCallback } from "react";
import { Rule } from "@/data/mockRules";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GraphTimeline, type TimePoint } from "./GraphTimeline";
import { StatusBadgeSvg } from "@/components/ui/status-badge";

interface DependencyGraphProps {
  rule: Rule;
  onNavigateToRule?: () => void;
}

type GraphMode = "modules" | "functions" | "signals";

interface GraphNode {
  id: string;
  label: string;
  type: "signal" | "function" | "matrix" | "report" | "incident";
  status: "success" | "warning" | "error";
  x: number;
  y: number;
  tooltip: string;
  connColor: "blue" | "orange" | "pink" | "green";
}

interface GraphEdge {
  from: string;
  to: string;
  color: "blue" | "orange" | "pink" | "green";
  dashed: boolean;
}

const connColors = {
  blue: "hsl(217, 91%, 60%)",
  orange: "hsl(38, 92%, 50%)",
  pink: "hsl(330, 81%, 60%)",
  green: "hsl(142, 71%, 45%)",
};

export function DependencyGraph({ rule, onNavigateToRule }: DependencyGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [graphMode, setGraphMode] = useState<GraphMode>("functions");
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [timeIndex, setTimeIndex] = useState(0);
  const [timeOverrides, setTimeOverrides] = useState<Record<string, "success" | "warning" | "error">>({});

  const ruleStatus = rule.errorCount > 0 ? "error" : rule.warningCount > 0 ? "warning" : "success";

  const nodesByMode: Record<GraphMode, GraphNode[]> = {
    modules: [
      { id: "sig", label: "Сигналы", type: "signal", status: "success", x: 100, y: 140, tooltip: "Модуль сигналов\nТип: Модуль\nСтатус: Активен", connColor: "blue" },
      { id: "fn", label: "Функции", type: "function", status: ruleStatus, x: 300, y: 140, tooltip: "Модуль функций\nТип: Модуль", connColor: "orange" },
      { id: "mx", label: "Матрицы", type: "matrix", status: "success", x: 500, y: 140, tooltip: "Модуль матриц\nТип: Модуль", connColor: "pink" },
      { id: "rp", label: "Отчёты", type: "report", status: "success", x: 680, y: 140, tooltip: "Модуль отчётов\nТип: Модуль", connColor: "green" },
    ],
    functions: [
      { id: "src", label: rule.parameterType, type: "signal", status: "success", x: 100, y: 140, tooltip: `${rule.parameterType}\nТип: Сигнал`, connColor: "blue" },
      { id: "rule", label: rule.name, type: "function", status: ruleStatus, x: 320, y: 140, tooltip: `${rule.name}\nТип: Функция`, connColor: "orange" },
      { id: "mx", label: "Матрица СИ", type: "matrix", status: rule.warningCount > 0 ? "warning" : "success", x: 320, y: 50, tooltip: "Матрица зависимостей СИ", connColor: "pink" },
      { id: "r1", label: "Отчёт #1", type: "report", status: "success", x: 560, y: 90, tooltip: "Отчёт #1", connColor: "green" },
      { id: "r2", label: "Отчёт #2", type: "report", status: rule.warningCount > 0 ? "warning" : "success", x: 560, y: 190, tooltip: "Отчёт #2", connColor: "green" },
    ],
    signals: [
      { id: "s1", label: "TI03025.PV", type: "signal", status: "error", x: 80, y: 60, tooltip: "TI03025.PV\nПотеря", connColor: "blue" },
      { id: "s2", label: "PT02012.PV", type: "signal", status: "error", x: 80, y: 140, tooltip: "PT02012.PV\nПревышение", connColor: "blue" },
      { id: "s3", label: "FT01007.PV", type: "signal", status: "warning", x: 80, y: 220, tooltip: "FT01007.PV\nАномалия", connColor: "orange" },
      { id: "fn", label: rule.name, type: "function", status: ruleStatus, x: 360, y: 140, tooltip: rule.name, connColor: "pink" },
      { id: "inc", label: "INC-2989", type: "incident", status: "error", x: 600, y: 80, tooltip: "INC-2989\nВ работе", connColor: "pink" },
      { id: "r1", label: "Отчёт #1", type: "report", status: "success", x: 600, y: 200, tooltip: "Отчёт #1", connColor: "green" },
    ],
  };

  const edgesByMode: Record<GraphMode, GraphEdge[]> = {
    modules: [
      { from: "sig", to: "fn", color: "blue", dashed: true },
      { from: "fn", to: "mx", color: "orange", dashed: true },
      { from: "mx", to: "rp", color: "pink", dashed: true },
    ],
    functions: [
      { from: "src", to: "rule", color: "blue", dashed: false },
      { from: "mx", to: "rule", color: "pink", dashed: true },
      { from: "rule", to: "r1", color: "orange", dashed: true },
      { from: "rule", to: "r2", color: "orange", dashed: true },
    ],
    signals: [
      { from: "s1", to: "fn", color: "blue", dashed: false },
      { from: "s2", to: "fn", color: "blue", dashed: false },
      { from: "s3", to: "fn", color: "orange", dashed: true },
      { from: "fn", to: "inc", color: "pink", dashed: false },
      { from: "fn", to: "r1", color: "green", dashed: true },
    ],
  };

  const nodes = nodesByMode[graphMode].map(n => ({
    ...n,
    status: timeOverrides[n.id] || n.status,
  }));
  const edges = edgesByMode[graphMode];
  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  // Traverse graph to find all upstream (ancestors) and downstream (descendants)
  const getUpstream = useCallback((nodeId: string, visited = new Set<string>()): Set<string> => {
    visited.add(nodeId);
    edges.filter(e => e.to === nodeId && !visited.has(e.from)).forEach(e => getUpstream(e.from, visited));
    return visited;
  }, [edges]);

  const getDownstream = useCallback((nodeId: string, visited = new Set<string>()): Set<string> => {
    visited.add(nodeId);
    edges.filter(e => e.from === nodeId && !visited.has(e.to)).forEach(e => getDownstream(e.to, visited));
    return visited;
  }, [edges]);

  const upstream = focusedNode ? getUpstream(focusedNode) : new Set<string>();
  const downstream = focusedNode ? getDownstream(focusedNode) : new Set<string>();

  type FocusRole = "self" | "upstream" | "downstream" | "none";
  const getNodeRole = (nodeId: string): FocusRole => {
    if (!focusedNode) return "self";
    if (nodeId === focusedNode) return "self";
    if (upstream.has(nodeId)) return "upstream";
    if (downstream.has(nodeId)) return "downstream";
    return "none";
  };

  const isInFocus = (nodeId: string) => getNodeRole(nodeId) !== "none";

  const handleTimeChange = useCallback((point: TimePoint) => {
    const overrides: Record<string, "success" | "warning" | "error"> = {};
    for (const [key, val] of Object.entries(point.signals)) {
      overrides[key] = val.status;
    }
    setTimeOverrides(overrides);
  }, []);

  const handleNodeClick = (nodeId: string) => {
    setFocusedNode(focusedNode === nodeId ? null : nodeId);
  };

  const cardW = 140;
  const cardH = 52;

  return (
    <div className="p-4 animate-fade-in">
      <div className="vercel-card">
        <div className="ide-header flex items-center justify-between">
          <span>Граф зависимостей</span>
          <div className="flex gap-1 normal-case tracking-normal">
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-150 ${
                showTimeline ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ⏱ Time Travel
            </button>
            <div className="w-px bg-border mx-1" />
            <div className="flex gap-0.5 bg-muted rounded-md p-0.5">
              {(["modules", "functions", "signals"] as GraphMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => { setGraphMode(mode); setFocusedNode(null); }}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-150 ${
                    graphMode === mode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode === "modules" ? "Модули" : mode === "functions" ? "Функции" : "Сигналы"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showTimeline && (
          <GraphTimeline
            onTimeChange={handleTimeChange}
            currentIndex={timeIndex}
            onIndexChange={setTimeIndex}
          />
        )}

        <div className="p-4 overflow-x-auto">
          <TooltipProvider delayDuration={200}>
            <svg width="740" height="280" viewBox="0 0 740 280" className="w-full max-w-[740px]">
              <defs>
                {Object.entries(connColors).map(([key, color]) => (
                  <marker key={key} id={`arrow-${key}`} viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0,0 L6,3 L0,6" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
                  </marker>
                ))}
              </defs>

              {edges.map((edge) => {
                const a = getNode(edge.from);
                const b = getNode(edge.to);
                if (!a || !b) return null;
                const isHighlighted = hoveredNode === edge.from || hoveredNode === edge.to;
                const inFocus = isInFocus(edge.from) && isInFocus(edge.to);
                const color = connColors[edge.color];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const angle = Math.atan2(dy, dx);
                const ax = a.x + Math.cos(angle) * (cardW / 2 + 4);
                const ay = a.y + Math.sin(angle) * (cardH / 2 + 4);
                const bx = b.x - Math.cos(angle) * (cardW / 2 + 4);
                const by = b.y - Math.sin(angle) * (cardH / 2 + 4);

                return (
                  <g key={`${edge.from}-${edge.to}`} opacity={inFocus ? 1 : 0.12} className="transition-all duration-200">
                    <line
                      x1={ax} y1={ay} x2={bx} y2={by}
                      stroke={color}
                      strokeWidth={isHighlighted ? 2 : 1.5}
                      strokeDasharray={edge.dashed ? "6 4" : "none"}
                      opacity={isHighlighted ? 0.9 : 0.45}
                      markerEnd={`url(#arrow-${edge.color})`}
                    />
                    <circle cx={ax} cy={ay} r={3.5} fill={color} opacity={isHighlighted ? 1 : 0.7} />
                    <circle cx={bx} cy={by} r={3.5} fill={color} opacity={isHighlighted ? 1 : 0.7} />
                  </g>
                );
              })}

              {nodes.map((node) => {
                const isHovered = hoveredNode === node.id;
                const role = getNodeRole(node.id);
                const inFocus = role !== "none";
                const borderColor = connColors[node.connColor];
                const roleColor = role === "upstream" ? "hsl(217, 91%, 60%)" : role === "downstream" ? "hsl(38, 92%, 50%)" : undefined;
                const strokeColor = isHovered ? borderColor : roleColor && role !== "self" ? roleColor : "hsl(0, 0%, 18%)";

                return (
                  <Tooltip key={node.id}>
                    <TooltipTrigger asChild>
                      <g
                        className="graph-node"
                        style={{ opacity: inFocus ? 1 : 0.15, transition: "opacity 220ms ease" }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => handleNodeClick(node.id)}
                      >
                        <rect
                          x={node.x - cardW / 2}
                          y={node.y - cardH / 2}
                          width={cardW}
                          height={cardH}
                          rx={8}
                          fill="hsl(0, 0%, 10%)"
                          stroke={strokeColor}
                          strokeWidth={role === "self" ? 2 : isHovered ? 1.5 : 1}
                          strokeDasharray={node.type === "matrix" || node.type === "report" ? "4 3" : "none"}
                          className="transition-all duration-200"
                        />
                        {/* Direction indicator for upstream/downstream */}
                        {focusedNode && role === "upstream" && (
                          <text x={node.x + cardW / 2 - 16} y={node.y - cardH / 2 + 12} fontSize="9" fill="hsl(217, 91%, 60%)">↑</text>
                        )}
                        {focusedNode && role === "downstream" && (
                          <text x={node.x + cardW / 2 - 16} y={node.y - cardH / 2 + 12} fontSize="9" fill="hsl(38, 92%, 50%)">↓</text>
                        )}
                        <text
                          x={node.x - cardW / 2 + 12}
                          y={node.y - 2}
                          fill="hsl(0, 0%, 90%)"
                          fontSize="10"
                          fontFamily="Inter, sans-serif"
                          fontWeight="500"
                        >
                          {node.label.length > 15 ? node.label.slice(0, 14) + "…" : node.label}
                        </text>
                        <text
                          x={node.x - cardW / 2 + 12}
                          y={node.y + 12}
                          fill="hsl(0, 0%, 45%)"
                          fontSize="8"
                          fontFamily="Inter, sans-serif"
                        >
                          {node.type === "signal" ? "Сигнал" : node.type === "function" ? "Функция" : node.type === "matrix" ? "Матрица" : node.type === "incident" ? "Инцидент" : "Отчёт"}
                        </text>
                        <circle
                          cx={node.x - cardW / 2}
                          cy={node.y}
                          r={4}
                          fill={borderColor}
                        />
                      </g>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs whitespace-pre-line max-w-[220px]">
                      {node.tooltip}
                      {role === "self" && focusedNode && "\n🔍 Фокус: нажмите ещё раз для сброса"}
                      {role === "upstream" && "\n↑ Upstream — зависимость"}
                      {role === "downstream" && "\n↓ Downstream — эффект"}
                    </TooltipContent>
                  </Tooltip>
                );
              })}

              {/* Status badges rendered on top */}
              {nodes.map((node) => {
                const inFocus = isInFocus(node.id);
                return (
                  <g key={`badge-${node.id}`} style={{ opacity: inFocus ? 1 : 0.15 }}>
                    <StatusBadgeSvg
                      x={node.x + cardW / 2 - 60}
                      y={node.y - cardH / 2 + 8}
                      status={node.status}
                    />
                  </g>
                );
              })}
            </svg>
          </TooltipProvider>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground px-1">
        <span className="flex items-center gap-1.5"><span className="conn-dot conn-dot-blue" style={{ width: 6, height: 6 }} /> Сигналы</span>
        <span className="flex items-center gap-1.5"><span className="conn-dot conn-dot-orange" style={{ width: 6, height: 6 }} /> Функции</span>
        <span className="flex items-center gap-1.5"><span className="conn-dot conn-dot-pink" style={{ width: 6, height: 6 }} /> Матрицы</span>
        <span className="flex items-center gap-1.5"><span className="conn-dot conn-dot-green" style={{ width: 6, height: 6 }} /> Отчёты</span>
        <span className="text-border">|</span>
        <span>— прямая связь</span>
        <span>- - - зависимость</span>
        {focusedNode && (
          <>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1"><span style={{ color: "hsl(217, 91%, 60%)" }}>↑</span> upstream</span>
            <span className="flex items-center gap-1"><span style={{ color: "hsl(38, 92%, 50%)" }}>↓</span> downstream</span>
            <span className="text-border">|</span>
            <button onClick={() => setFocusedNode(null)} className="text-foreground hover:underline">
              Сбросить фокус
            </button>
          </>
        )}
      </div>
    </div>
  );
}