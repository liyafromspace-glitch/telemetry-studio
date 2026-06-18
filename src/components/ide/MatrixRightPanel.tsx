import { Matrix } from "@/data/mockMatrices";
import { RuleStatus, statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Keyboard, Link2, FileText, Cpu } from "lucide-react";
import { useState } from "react";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import {
  InspectorShell,
  InspectorRow,
  type InspectorTone,
} from "@/components/ui/inspector-shell";

interface MatrixRightPanelProps {
  matrix: Matrix;
}

const statusTone: Record<RuleStatus, InspectorTone> = {
  active: "success",
  error: "destructive",
  draft: "muted",
  scheduled: "warning",
};

export function MatrixRightPanel({ matrix }: MatrixRightPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["desc", "validation", "deps", "metadata"])
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <InspectorShell
      hero={{
        kind: "Matrix",
        id: matrix.id,
        title: matrix.name,
        subtitle: `${matrix.matrixType} · v${matrix.version}`,
        status: { label: statusLabels[matrix.status], tone: statusTone[matrix.status] },
      }}
      footer={
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
          <Keyboard className="w-2.5 h-2.5" />
          <span>⌘↵ Validate · ⌘⇧S Activate · Esc Close</span>
        </div>
      }
    >
      <CollapsibleSection title="Описание" open={openSections.has("desc")} onToggle={() => toggleSection("desc")}>
        <div className="px-3 py-2 text-[11px] font-mono text-foreground/85 leading-relaxed">
          {matrix.description}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Validation Console" open={openSections.has("validation")} onToggle={() => toggleSection("validation")}>
        <div className="px-3 py-2 space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="w-3 h-3 shrink-0" />
            <span className="uppercase tracking-wider text-[10px]">Structure OK</span>
          </div>
          {matrix.warningCount > 0 && (
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span className="uppercase tracking-wider text-[10px]">{matrix.warningCount} warnings</span>
            </div>
          )}
          {matrix.errorCount > 0 && (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-3 h-3 shrink-0" />
              <span className="uppercase tracking-wider text-[10px]">{matrix.errorCount} errors</span>
            </div>
          )}
          {matrix.rows.filter((r) => r.statusMessage).map((row) => (
            <div
              key={row.id}
              className={`flex items-start gap-1.5 pl-4 ${row.status === "error" ? "text-destructive" : "text-warning"}`}
            >
              <span className="text-[10px]">└</span>
              <span className="text-[10px] uppercase tracking-wider">{row.source}: {row.statusMessage}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Dependencies" open={openSections.has("deps")} onToggle={() => toggleSection("deps")}>
        <div className="px-3 py-2 space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Link2 className="w-3 h-3" /> Parameters
            </span>
            <span className="text-foreground tabular-nums">{matrix.parametersLinked}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Cpu className="w-3 h-3" /> Functions
            </span>
            <span className="text-foreground tabular-nums">{matrix.functionsLinked}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <FileText className="w-3 h-3" /> Reports
            </span>
            <span className="text-foreground tabular-nums">{matrix.reportsUsed}</span>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Metadata" open={openSections.has("metadata")} onToggle={() => toggleSection("metadata")}>
        <div className="px-3 py-2 space-y-1.5">
          <InspectorRow k="Author" v={matrix.author} />
          <InspectorRow k="Created" v={matrix.createdAt} />
          <InspectorRow k="Last check" v={matrix.lastCheck} />
          <InspectorRow k="Rows" v={String(matrix.rows.length)} mono />
          <InspectorRow
            k="Assets"
            v={String(matrix.assets.reduce((acc, a) => acc + 1 + (a.children?.length || 0), 0))}
            mono
          />
          <InspectorRow k="ID" v={matrix.id} mono />
        </div>
      </CollapsibleSection>
    </InspectorShell>
  );
}
