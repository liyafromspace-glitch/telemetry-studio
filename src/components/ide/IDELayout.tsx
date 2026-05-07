import { useState } from "react";
import { rules } from "@/data/mockRules";
import { matrices } from "@/data/mockMatrices";
import { IDESidebar, type SelectedItem } from "./IDESidebar";
import { CenterPanel } from "./CenterPanel";
import { MatrixCenterPanel } from "./MatrixCenterPanel";
import { RightPanel } from "./RightPanel";
import { MatrixRightPanel } from "./MatrixRightPanel";
import { Activity } from "lucide-react";
import { DebugProvider } from "./DebugContext";

export function IDELayoutInner() {
  const [selected, setSelected] = useState<SelectedItem>({ type: "rule", item: rules[0] });

  const totalActive =
    rules.filter((r) => r.status === "active").length +
    matrices.filter((m) => m.status === "active").length;
  const totalErrors =
    rules.filter((r) => r.status === "error").length +
    matrices.filter((m) => m.status === "error").length;

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Top bar */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-border bg-card text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground tracking-tight">
            Industrial Telemetry Workspace
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">Производственная среда</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="status-dot status-active" />
            {totalActive} активных
          </span>
          <span className="flex items-center gap-1">
            <span className="status-dot status-error" />
            {totalErrors} ошибок
          </span>
          <span>v2.4.1</span>
        </div>
      </div>

      {/* Main IDE area */}
      <div className="flex-1 flex min-h-0">
        <IDESidebar selected={selected} onSelect={setSelected} />
        {selected.type === "rule" ? (
          <>
            <CenterPanel rule={selected.item} />
            <RightPanel rule={selected.item} />
          </>
        ) : (
          <>
            <MatrixCenterPanel matrix={selected.item} />
            <MatrixRightPanel matrix={selected.item} />
          </>
        )}
      </div>

      {/* Status bar */}
      <div className="h-6 flex items-center justify-between px-3 border-t border-border bg-card text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>LF</span>
          <span>{selected.type === "rule" ? "TypeScript" : "Matrix Config"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>⌘K Поиск</span>
          <span>{selected.type === "rule" ? "Функции" : "Матрицы"}</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
}
