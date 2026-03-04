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

type GraphMode = "modules" | "functions" | "signals";

interface GraphNode {
  id: string;
  label: string;
  type: "signal" | "function" | "matrix" | "report" | "incident";
  status: "success" | "warning" | "error";
  x: number;
  y: number;
  tooltip: string;
  lastRun?: string;
  errorCount?: number;
}

export function DependencyGraph({ rule, onNavigateToRule }: DependencyGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [graphMode, setGraphMode] = useState<GraphMode>("functions");

  const ruleStatus = rule.errorCount > 0 ? "error" : rule.warningCount > 0 ? "warning" : "success";

  const nodesByMode: Record<GraphMode, GraphNode[]> = {
    modules: [
      { id: "sig", label: "Сигналы", type: "signal", status: "success", x: 80, y: 160, tooltip: `Модуль сигналов\nТип: Модуль\nСтатус: Активен\nПоследний запуск: 14:32\nОшибок: 0`, lastRun: "14:32", errorCount: 0 },
      { id: "fn", label: "Функции", type: "function", status: ruleStatus, x: 300, y: 160, tooltip: `Модуль функций\nТип: Модуль\nСтатус: ${ruleStatus === "error" ? "Ошибка" : "Активен"}\nПоследний запуск: ${rule.lastCheck}\nОшибок: ${rule.errorCount}`, lastRun: rule.lastCheck, errorCount: rule.errorCount },
      { id: "mx", label: "Матрицы", type: "matrix", status: "success", x: 520, y: 160, tooltip: `Модуль матриц\nТип: Модуль\nСтатус: Активен\nПоследний запуск: 10:15\nОшибок: 0`, lastRun: "10:15", errorCount: 0 },
      { id: "rp", label: "Отчёты", type: "report", status: "success", x: 720, y: 160, tooltip: `Модуль отчётов\nТип: Модуль\nСтатус: Активен\nПоследний запуск: 06:00\nОшибок: 0`, lastRun: "06:00", errorCount: 0 },
    ],
    functions: [
      { id: "src", label: rule.parameterType, type: "signal", status: "success", x: 80, y: 160, tooltip: `${rule.parameterType}\nТип: Сигнал\nСтатус: Активен\nПоследний запуск: 14:32\nОшибок: 0`, lastRun: "14:32", errorCount: 0 },
      { id: "rule", label: rule.name, type: "function", status: ruleStatus, x: 300, y: 160, tooltip: `${rule.name}\nТип: Функция\nСтатус: ${ruleStatus === "error" ? "Ошибка" : ruleStatus === "warning" ? "Предупреждение" : "Активен"}\nПоследний запуск: ${rule.lastCheck}\nОшибок: ${rule.errorCount}`, lastRun: rule.lastCheck, errorCount: rule.errorCount },
      { id: "mx", label: "Матрица СИ", type: "matrix", status: rule.warningCount > 0 ? "warning" : "success", x: 300, y: 60, tooltip: `Матрица зависимостей СИ\nТип: Матрица\nСтатус: ${rule.warningCount > 0 ? "Предупреждение" : "Активен"}\nПоследний запуск: 10:15\nОшибок: 0`, lastRun: "10:15", errorCount: 0 },
      { id: "r1", label: "Отчёт #1", type: "report", status: "success", x: 540, y: 100, tooltip: "Отчёт #1\nТип: Отчёт\nСтатус: Активен\nПоследний запуск: 06:00\nОшибок: 0", lastRun: "06:00", errorCount: 0 },
      { id: "r2", label: "Отчёт #2", type: "report", status: rule.warningCount > 0 ? "warning" : "success", x: 540, y: 220, tooltip: `Отчёт #2\nТип: Отчёт\nСтатус: ${rule.warningCount > 0 ? "Предупреждения" : "Активен"}\nПоследний запуск: 06:00\nОшибок: 0`, lastRun: "06:00", errorCount: 0 },
    ],
    signals: [
      { id: "s1", label: "TI03025.PV", type: "signal", status: "error", x: 80, y: 80, tooltip: "TI03025.PV\nТип: Сигнал\nСтатус: Потеря\nПоследний запуск: 14:32\nОшибок: 1", lastRun: "14:32", errorCount: 1 },
      { id: "s2", label: "PT02012.PV", type: "signal", status: "error", x: 80, y: 160, tooltip: "PT02012.PV\nТип: Сигнал\nСтатус: Превышение\nПоследний запуск: 14:31\nОшибок: 1", lastRun: "14:31", errorCount: 1 },
      { id: "s3", label: "FT01007.PV", type: "signal", status: "warning", x: 80, y: 240, tooltip: "FT01007.PV\nТип: Сигнал\nСтатус: Аномалия\nПоследний запуск: 14:30\nОшибок: 0", lastRun: "14:30", errorCount: 0 },
      { id: "fn", label: rule.name, type: "function", status: ruleStatus, x: 360, y: 160, tooltip: `${rule.name}\nТип: Функция\nСтатус: ${ruleStatus}\nПоследний запуск: ${rule.lastCheck}\nОшибок: ${rule.errorCount}`, lastRun: rule.lastCheck, errorCount: rule.errorCount },
      { id: "inc", label: "INC-2989", type: "incident", status: "error", x: 600, y: 80, tooltip: "INC-2989\nТип: Инцидент\nСтатус: В работе\nПоследний запуск: 14:35\nОшибок: 1", lastRun: "14:35", errorCount: 1 },
      { id: "r1", label: "Отчёт #1", type: "report", status: "success", x: 600, y: 240, tooltip: "Отчёт #1\nТип: Отчёт\nСтатус: Активен\nПоследний запуск: 06:00\nОшибок: 0", lastRun: "06:00", errorCount: 0 },
    ],
  };

  const edgesByMode: Record<GraphMode, [string, string, number][]> = {
    modules: [["sig", "fn", 1], ["fn", "mx", 1], ["mx", "rp", 1]],
    functions: [["src", "rule", 2], ["mx", "rule", 1], ["rule", "r1", 1], ["rule", "r2", 1]],
    signals: [["s1", "fn", 3], ["s2", "fn", 3], ["s3", "fn", 2], ["fn", "inc", 3], ["fn", "r1", 1]],
  };

  const nodes = nodesByMode[graphMode];
  const edges = edgesByMode[graphMode];
  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  const statusColor = (s: string) =>
    s === "success" ? "hsl(160 55% 48%)" : s === "warning" ? "hsl(39 74% 48%)" : "hsl(2 93% 63%)";

  const statusBg = (s: string, hovered: boolean) => {
    const alpha = hovered ? 0.25 : 0.12;
    return s === "success" ? `hsl(160 55% 48% / ${alpha})` : s === "warning" ? `hsl(39 74% 48% / ${alpha})` : `hsl(2 93% 63% / ${alpha})`;
  };

  const renderNodeShape = (node: GraphNode, isHovered: boolean) => {
    const color = statusColor(node.status);
    const bg = statusBg(node.status, isHovered);
    const sw = isHovered ? 2 : 1.5;

    switch (node.type) {
      case "signal":
        return <circle cx={node.x} cy={node.y} r={28} fill={bg} stroke={color} strokeWidth={sw} filter={isHovered ? "url(#depNodeGlow)" : undefined} className="transition-all duration-150" />;
      case "function":
        return <HexagonShape cx={node.x} cy={node.y} r={32} fill={bg} stroke={color} strokeWidth={sw} />;
      case "matrix":
        return <rect x={node.x - 28} y={node.y - 24} width={56} height={48} rx={3} fill={bg} stroke={color} strokeWidth={sw} filter={isHovered ? "url(#depNodeGlow)" : undefined} className="transition-all duration-150" />;
      case "incident":
        return <TriangleShape cx={node.x} cy={node.y} r={28} fill={bg} stroke={color} strokeWidth={sw} />;
      case "report":
        return <rect x={node.x - 40} y={node.y - 20} width={80} height={40} rx={3} fill={bg} stroke={color} strokeWidth={sw} filter={isHovered ? "url(#depNodeGlow)" : undefined} className="transition-all duration-150" />;
      default:
        return <rect x={node.x - 40} y={node.y - 20} width={80} height={40} rx={3} fill={bg} stroke={color} strokeWidth={sw} filter={isHovered ? "url(#depNodeGlow)" : undefined} className="transition-all duration-150" />;
    }
  };

  return (
    <div className="p-4 animate-fade-in">
      <div className="ide-panel-glow rounded-sm">
        <div className="ide-header flex items-center justify-between">
          <span>Граф зависимостей</span>
          <div className="flex gap-0.5 normal-case tracking-normal glass-controls rounded-md px-1 py-0.5">
            {(["modules", "functions", "signals"] as GraphMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setGraphMode(mode)}
                className={`px-2 py-0.5 rounded-sm text-[9px] transition-all duration-150 ${
                  graphMode === mode ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "modules" ? "Модули" : mode === "functions" ? "Функции" : "Сигналы"}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <TooltipProvider delayDuration={200}>
            <svg width="700" height="320" viewBox="0 0 700 320" className="w-full max-w-[700px]">
              <defs>
                <filter id="edgeGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="depNodeGlow">
                  <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="hsl(185 70% 50%)" floodOpacity="0.2" />
                </filter>
                <linearGradient id="depEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(271 60% 55%)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(185 70% 50%)" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              {edges.map(([from, to, criticality]) => {
                const a = getNode(from);
                const b = getNode(to);
                if (!a || !b) return null;
                const isHighlighted = hoveredNode === from || hoveredNode === to;
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={isHighlighted ? "url(#depEdgeGrad)" : "hsl(228 8% 22%)"}
                    strokeWidth={isHighlighted ? criticality + 1.5 : criticality}
                    strokeDasharray={criticality >= 3 ? "none" : "4 2"}
                    filter={isHighlighted ? "url(#edgeGlow)" : undefined}
                    className="transition-all duration-150"
                  />
                );
              })}

              {nodes.map((node) => {
                const isHovered = hoveredNode === node.id;
                return (
                  <Tooltip key={node.id}>
                    <TooltipTrigger asChild>
                      <g
                        className="graph-node"
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => {
                          if (node.type === "function" && onNavigateToRule) onNavigateToRule();
                        }}
                      >
                        {/* Ripple effect on hover */}
                        {isHovered && (
                          <circle cx={node.x} cy={node.y} r={20} fill="none" 
                            stroke={statusColor(node.status)} strokeWidth="1" 
                            opacity="0.3" className="animate-ripple" />
                        )}
                        {renderNodeShape(node, isHovered)}
                        <text x={node.x} y={node.y - 2} textAnchor="middle" fill="hsl(220, 10%, 85%)" fontSize="9" fontFamily="Inter, sans-serif">
                          {node.label.length > 14 ? node.label.slice(0, 13) + "…" : node.label}
                        </text>
                        <text x={node.x} y={node.y + 10} textAnchor="middle" fill="hsl(220, 8%, 50%)" fontSize="7" fontFamily="Inter, sans-serif">
                          {node.type === "signal" ? "Сигнал" : node.type === "function" ? "Функция" : node.type === "matrix" ? "Матрица" : node.type === "incident" ? "Инцидент" : "Отчёт"}
                        </text>
                      </g>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs whitespace-pre-line max-w-[220px] animate-scale-in">
                      {node.tooltip}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </svg>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground px-1">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-success inline-block" /> Успешно</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" /> Предупреждения</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" /> Ошибки</span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1">
          <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill="none" stroke="hsl(220,8%,50%)" strokeWidth="1" /></svg> Сигнал
        </span>
        <span className="flex items-center gap-1">
          <svg width="12" height="12"><rect x="1" y="1" width="10" height="10" rx="1" fill="none" stroke="hsl(220,8%,50%)" strokeWidth="1" /></svg> Матрица
        </span>
        <span className="flex items-center gap-1">
          <svg width="14" height="12"><polygon points="7,1 13,6 7,11 1,6" fill="none" stroke="hsl(220,8%,50%)" strokeWidth="1" /></svg> Функция
        </span>
      </div>
    </div>
  );
}

function HexagonShape({ cx, cy, r, fill, stroke, strokeWidth }: { cx: number; cy: number; r: number; fill: string; stroke: string; strokeWidth: number }) {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * 0.8 * Math.sin(angle)}`;
  }).join(" ");
  return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} className="transition-all duration-150" />;
}

function TriangleShape({ cx, cy, r, fill, stroke, strokeWidth }: { cx: number; cy: number; r: number; fill: string; stroke: string; strokeWidth: number }) {
  const points = `${cx},${cy - r * 0.9} ${cx + r},${cy + r * 0.6} ${cx - r},${cy + r * 0.6}`;
  return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} className="transition-all duration-150" />;
}
