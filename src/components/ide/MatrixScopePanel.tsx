import { useState } from "react";
import { AssetNode } from "@/data/mockMatrices";
import { ChevronDown, ChevronRight, Box, PanelLeftClose, PanelLeft } from "lucide-react";

interface MatrixScopePanelProps {
  assets: AssetNode[];
  selectedAsset: string | null;
  onSelectAsset: (id: string | null) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const sensorTypes = ["Все", "Температура", "Давление", "Уровень", "Плотность"] as const;

export function MatrixScopePanel({ assets, selectedAsset, onSelectAsset, collapsed, onToggleCollapse }: MatrixScopePanelProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    const collect = (nodes: AssetNode[]) => {
      nodes.forEach(n => { ids.add(n.id); if (n.children) collect(n.children); });
    };
    collect(assets);
    return ids;
  });
  const [filterType, setFilterType] = useState<string>("Все");

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Count selected sensors
  const countSensors = (node: AssetNode): number => {
    if (!node.children) return 1;
    return node.children.reduce((acc, c) => acc + countSensors(c), 0);
  };

  const selectedNode = findNode(assets, selectedAsset);

  if (collapsed) {
    return (
      <div className="w-8 min-w-8 border-r border-border flex flex-col items-center pt-2 bg-card">
        <button onClick={onToggleCollapse} className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="Область действия">
          <PanelLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-[220px] min-w-[220px] border-r border-border flex flex-col bg-card">
      <div className="ide-header flex items-center justify-between">
        <span>Область действия</span>
        <button onClick={onToggleCollapse} className="text-muted-foreground hover:text-foreground transition-colors">
          <PanelLeftClose className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter by type */}
      <div className="p-2 border-b border-border">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 font-medium">
          Фильтр по типу СИ
        </div>
        <div className="flex flex-wrap gap-1">
          {sensorTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2 py-0.5 text-[10px] rounded-sm border transition-colors ${
                filterType === type
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-secondary text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Asset tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {assets.map(asset => (
          <ScopeTreeNode
            key={asset.id}
            node={asset}
            depth={0}
            expandedNodes={expandedNodes}
            selectedId={selectedAsset}
            onToggle={toggleNode}
            onSelect={onSelectAsset}
            filterType={filterType}
          />
        ))}
      </div>

      {/* Selection summary */}
      <div className="p-2 border-t border-border text-[10px] text-muted-foreground">
        <span className="font-medium text-foreground">Выбрано: </span>
        {selectedNode ? (
          <span>{selectedNode.label} ({selectedNode.children ? countSensors(selectedNode) + " датчиков" : "1 датчик"})</span>
        ) : (
          <span>Все активы</span>
        )}
      </div>
    </div>
  );
}

function findNode(nodes: AssetNode[], id: string | null): AssetNode | null {
  if (!id) return null;
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

function ScopeTreeNode({
  node,
  depth,
  expandedNodes,
  selectedId,
  onToggle,
  onSelect,
  filterType,
}: {
  node: AssetNode;
  depth: number;
  expandedNodes: Set<string>;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string | null) => void;
  filterType: string;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedId === node.id;

  // Filter leaf nodes by sensor type
  if (!hasChildren && filterType !== "Все") {
    const label = node.label.toLowerCase();
    const typeMap: Record<string, string[]> = {
      "Температура": ["температур"],
      "Давление": ["давлен"],
      "Уровень": ["уровн"],
      "Плотность": ["плотност"],
    };
    const keywords = typeMap[filterType] || [];
    if (!keywords.some(k => label.includes(k))) return null;
  }

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) onToggle(node.id);
          onSelect(isSelected ? null : node.id);
        }}
        className={`w-full flex items-center gap-1.5 py-1 text-xs transition-colors ${
          isSelected
            ? "bg-accent text-accent-foreground"
            : "text-sidebar-foreground hover:bg-accent/50"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          isExpanded ? <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}
        <Box className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        <span className="truncate">{node.label}</span>
      </button>
      {hasChildren && isExpanded && node.children!.map(child => (
        <ScopeTreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          expandedNodes={expandedNodes}
          selectedId={selectedId}
          onToggle={onToggle}
          onSelect={onSelect}
          filterType={filterType}
        />
      ))}
    </div>
  );
}
