import { useState } from "react";
import { Rule } from "@/data/mockRules";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DependencyGraphProps {
  rule: Rule;
  onNavigateToRule?: () => void;
}

interface GraphNode {
  id: string;
  label: string;
  type: "source" | "rule" | "function" | "report";
  status: "success" | "warning" | "error";
  x: number;
  y: number;
  tooltip: string;
}

export function DependencyGraph({ rule, onNavigateToRule }: DependencyGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes: GraphNode[] = [
    { id: "src", label: rule.parameterType, type: "source", status: "success", x: 80, y: 160, tooltip: `Источник: ${rule.parameterType}\nСвязано параметров: ${rule.parametersLinked}` },
    { id: "rule", label: rule.name, type: "rule", status: rule.errorCount > 0 ? "error" : rule.warningCount > 0 ? "warning" : "success", x: 300, y: 160, tooltip: `Правило: ${rule.name}\nВерсия: v${rule.version}\nОшибок: ${rule.errorCount} · Предупреждений: ${rule.warningCount}` },
    { id: "fn", label: "Функция", type: "function", status: rule.errorCount > 0 ? "error" : "success", x: 520, y: 160, tooltip: `Функция обработки\nСтатус: ${rule.errorCount > 0 ? "Ошибка" : "Работает"}` },
    { id: "r1", label: "Отчёт #1", type: "report", status: "success", x: 720, y: 80, tooltip: "Отчёт #1\nСтатус: Активен\nОбновлён: Сегодня" },
    { id: "r2", label: "Отчёт #2", type: "report", status: rule.warningCount > 0 ? "warning" : "success", x: 720, y: 160, tooltip: `Отчёт #2\nСтатус: ${rule.warningCount > 0 ? "Предупреждения" : "Активен"}` },
    { id: "r3", label: "Отчёт #3", type: "report", status: "success", x: 720, y: 240, tooltip: "Отчёт #3\nСтатус: Активен\nОбновлён: Вчера" },
  ];

  const edges: [string, string][] = [
    ["src", "rule"],
    ["rule", "fn"],
    ["fn", "r1"],
    ["fn", "r2"],
    ["fn", "r3"],
  ];

  const statusColor = (s: string) =>
    s === "success" ? "hsl(127, 50%, 49%)" : s === "warning" ? "hsl(39, 74%, 48%)" : "hsl(2, 93%, 63%)";

  const statusBg = (s: string, hovered: boolean) => {
    const alpha = hovered ? 0.25 : 0.1;
    return s === "success" ? `hsl(127, 50%, 49%, ${alpha})` : s === "warning" ? `hsl(39, 74%, 48%, ${alpha})` : `hsl(2, 93%, 63%, ${alpha})`;
  };

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  const handleNodeClick = (node: GraphNode) => {
    if (node.type === "rule" && onNavigateToRule) {
      onNavigateToRule();
    }
  };

  return (
    <div className="p-4 animate-fade-in">
      <div className="ide-panel rounded-sm">
        <div className="ide-header">Граф зависимостей</div>
        <div className="p-4 overflow-x-auto">
          <TooltipProvider delayDuration={200}>
            <svg width="840" height="320" viewBox="0 0 840 320" className="w-full max-w-[840px]">
              {/* Edges */}
              {edges.map(([from, to]) => {
                const a = getNode(from);
                const b = getNode(to);
                const isHighlighted = hoveredNode === from || hoveredNode === to;
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={a.x + 60}
                    y1={a.y}
                    x2={b.x - 60}
                    y2={b.y}
                    stroke={isHighlighted ? "hsl(220, 10%, 55%)" : "hsl(228, 8%, 30%)"}
                    strokeWidth={isHighlighted ? 2 : 1.5}
                    strokeDasharray="4 2"
                    className="transition-all duration-150"
                  />
                );
              })}
              {/* Arrow heads */}
              {edges.map(([from, to]) => {
                const b = getNode(to);
                const isHighlighted = hoveredNode === from || hoveredNode === to;
                return (
                  <circle
                    key={`arrow-${from}-${to}`}
                    cx={b.x - 60}
                    cy={b.y}
                    r={isHighlighted ? 4 : 3}
                    fill={isHighlighted ? "hsl(220, 10%, 60%)" : "hsl(228, 8%, 40%)"}
                    className="transition-all duration-150"
                  />
                );
              })}
              {/* Nodes */}
              {nodes.map((node) => {
                const isHovered = hoveredNode === node.id;
                return (
                  <Tooltip key={node.id}>
                    <TooltipTrigger asChild>
                      <g
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => handleNodeClick(node)}
                      >
                        <rect
                          x={node.x - 58}
                          y={node.y - 22}
                          width="116"
                          height="44"
                          rx="4"
                          fill={statusBg(node.status, isHovered)}
                          stroke={statusColor(node.status)}
                          strokeWidth={isHovered ? 2 : 1.5}
                          className="transition-all duration-150"
                        />
                        <circle
                          cx={node.x - 44}
                          cy={node.y}
                          r="4"
                          fill={statusColor(node.status)}
                        />
                        <text
                          x={node.x + 4}
                          y={node.y + 1}
                          textAnchor="middle"
                          fill="hsl(220, 10%, 85%)"
                          fontSize="10"
                          fontFamily="Inter, sans-serif"
                        >
                          {node.label.length > 14 ? node.label.slice(0, 13) + "…" : node.label}
                        </text>
                        <text
                          x={node.x + 4}
                          y={node.y + 14}
                          textAnchor="middle"
                          fill="hsl(220, 8%, 55%)"
                          fontSize="8"
                          fontFamily="Inter, sans-serif"
                        >
                          {node.type === "source" ? "Источник" : node.type === "rule" ? "Правило" : node.type === "function" ? "Обработка" : "Отчёт"}
                        </text>
                      </g>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs whitespace-pre-line max-w-[200px]">
                      {node.tooltip}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </svg>
          </TooltipProvider>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground px-1">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-success inline-block" /> Успешно</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" /> Предупреждения</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" /> Ошибки</span>
      </div>
    </div>
  );
}
