import { useState } from "react";
import { Matrix, AssetNode } from "@/data/mockMatrices";
import { ChevronDown, ChevronRight, Box, AlertTriangle, XCircle, CheckCircle } from "lucide-react";

interface MatrixStructureProps {
  matrix: Matrix;
}

export function MatrixStructure({ matrix }: MatrixStructureProps) {
  const [expandedAssets, setExpandedAssets] = useState<Set<string>>(
    new Set(matrix.assets.map((a) => a.id))
  );
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const toggleAsset = (id: string) => {
    setExpandedAssets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const statusIcon = (s: "ok" | "warning" | "error") => {
    if (s === "error") return <XCircle className="w-3 h-3 text-destructive flex-shrink-0" />;
    if (s === "warning") return <AlertTriangle className="w-3 h-3 text-warning flex-shrink-0" />;
    return <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />;
  };

  return (
    <div className="flex h-full animate-fade-in">
      {/* LEFT: Asset Hierarchy */}
      <div className="w-[220px] min-w-[220px] border-r border-border flex flex-col">
        <div className="ide-header">Иерархия активов</div>
        <div className="flex-1 overflow-y-auto py-1">
          {matrix.assets.map((asset) => (
            <AssetTreeNode
              key={asset.id}
              node={asset}
              expanded={expandedAssets.has(asset.id)}
              selectedId={selectedAsset}
              onToggle={toggleAsset}
              onSelect={setSelectedAsset}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Matrix Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="ide-header">Конфигурация матрицы</div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-3 py-2 font-medium">Источник СИ</th>
                <th className="text-left px-3 py-2 font-medium">Целевой СИ</th>
                <th className="text-left px-3 py-2 font-medium">Тип зависимости</th>
                <th className="text-right px-3 py-2 font-medium">Отклонение</th>
                <th className="text-left px-3 py-2 font-medium">Ед. изм.</th>
                <th className="text-center px-3 py-2 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {matrix.rows
                .filter((r) => !selectedAsset || r.source.includes(selectedAsset.split(" ").pop() || ""))
                .map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border hover:bg-accent/30 transition-colors ${
                      row.status === "error" ? "bg-destructive/5" : row.status === "warning" ? "bg-warning/5" : ""
                    }`}
                  >
                    <td className="px-3 py-2 text-foreground font-mono text-[11px]">{row.source}</td>
                    <td className="px-3 py-2 text-foreground font-mono text-[11px]">{row.target}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.dependencyType}</td>
                    <td className="px-3 py-2 text-right text-foreground font-mono">{row.deviation}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.unit}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1.5">
                        {statusIcon(row.status)}
                        {row.statusMessage && (
                          <span className={`text-[10px] ${row.status === "error" ? "text-destructive" : "text-warning"}`}>
                            {row.statusMessage}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AssetTreeNode({
  node,
  expanded,
  selectedId,
  onToggle,
  onSelect,
}: {
  node: AssetNode;
  expanded: boolean;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string | null) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) onToggle(node.id);
          onSelect(selectedId === node.id ? null : node.id);
        }}
        className={`w-full flex items-center gap-1.5 px-2 py-1 text-xs transition-colors ${
          selectedId === node.id
            ? "bg-accent text-accent-foreground"
            : "text-sidebar-foreground hover:bg-accent/50"
        }`}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <span className="w-3" />
        )}
        <Box className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        <span className="truncate">{node.label}</span>
      </button>
      {hasChildren && expanded && node.children!.map((child) => (
        <button
          key={child.id}
          onClick={() => onSelect(selectedId === child.id ? null : child.id)}
          className={`w-full flex items-center gap-1.5 pl-7 pr-2 py-1 text-xs transition-colors ${
            selectedId === child.id
              ? "bg-accent text-accent-foreground"
              : "text-sidebar-foreground hover:bg-accent/50"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
          <span className="truncate">{child.label}</span>
        </button>
      ))}
    </div>
  );
}
