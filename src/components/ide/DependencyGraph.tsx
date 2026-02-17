import { Rule } from "@/data/mockRules";

interface DependencyGraphProps {
  rule: Rule;
}

interface GraphNode {
  id: string;
  label: string;
  type: "source" | "rule" | "function" | "report";
  status: "success" | "warning" | "error";
  x: number;
  y: number;
}

export function DependencyGraph({ rule }: DependencyGraphProps) {
  const nodes: GraphNode[] = [
    { id: "src", label: rule.parameterType, type: "source", status: "success", x: 80, y: 160 },
    { id: "rule", label: rule.name, type: "rule", status: rule.errorCount > 0 ? "error" : rule.warningCount > 0 ? "warning" : "success", x: 300, y: 160 },
    { id: "fn", label: "Функция", type: "function", status: rule.errorCount > 0 ? "error" : "success", x: 520, y: 160 },
    { id: "r1", label: "Отчёт #1", type: "report", status: "success", x: 720, y: 80 },
    { id: "r2", label: "Отчёт #2", type: "report", status: rule.warningCount > 0 ? "warning" : "success", x: 720, y: 160 },
    { id: "r3", label: "Отчёт #3", type: "report", status: "success", x: 720, y: 240 },
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

  const statusBg = (s: string) =>
    s === "success" ? "hsl(127, 50%, 49%, 0.1)" : s === "warning" ? "hsl(39, 74%, 48%, 0.1)" : "hsl(2, 93%, 63%, 0.1)";

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="p-4 animate-fade-in">
      <div className="ide-panel rounded-sm">
        <div className="ide-header">Граф зависимостей</div>
        <div className="p-4 overflow-x-auto">
          <svg width="840" height="320" viewBox="0 0 840 320" className="w-full max-w-[840px]">
            {/* Edges */}
            {edges.map(([from, to]) => {
              const a = getNode(from);
              const b = getNode(to);
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x + 60}
                  y1={a.y}
                  x2={b.x - 60}
                  y2={b.y}
                  stroke="hsl(228, 8%, 30%)"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              );
            })}
            {/* Arrow heads */}
            {edges.map(([from, to]) => {
              const b = getNode(to);
              return (
                <circle
                  key={`arrow-${from}-${to}`}
                  cx={b.x - 60}
                  cy={b.y}
                  r="3"
                  fill="hsl(228, 8%, 40%)"
                />
              );
            })}
            {/* Nodes */}
            {nodes.map((node) => (
              <g key={node.id} className="cursor-pointer">
                <rect
                  x={node.x - 58}
                  y={node.y - 22}
                  width="116"
                  height="44"
                  rx="4"
                  fill={statusBg(node.status)}
                  stroke={statusColor(node.status)}
                  strokeWidth="1.5"
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
            ))}
          </svg>
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
