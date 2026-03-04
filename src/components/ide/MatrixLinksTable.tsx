import { MatrixRow } from "@/data/mockMatrices";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface MatrixLinksTableProps {
  rows: MatrixRow[];
  selectedAsset: string | null;
}

export function MatrixLinksTable({ rows, selectedAsset }: MatrixLinksTableProps) {
  const filteredRows = selectedAsset
    ? rows.filter(r => r.source.includes(selectedAsset.split(" ").pop() || "") || r.target.includes(selectedAsset.split(" ").pop() || ""))
    : rows;

  const statusIcon = (s: "ok" | "warning" | "error") => {
    if (s === "error") return <XCircle className="w-3 h-3 text-destructive flex-shrink-0" />;
    if (s === "warning") return <AlertTriangle className="w-3 h-3 text-warning flex-shrink-0" />;
    return <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />;
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 animate-fade-in">
      <div className="ide-header">Связи</div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
              <th className="text-left px-3 py-2 font-medium">Источник СИ</th>
              <th className="text-left px-3 py-2 font-medium">Целевой СИ</th>
              <th className="text-left px-3 py-2 font-medium">Тип зависимости</th>
              <th className="text-right px-3 py-2 font-medium">Допустимое отклонение</th>
              <th className="text-left px-3 py-2 font-medium">Ед. изм.</th>
              <th className="text-center px-3 py-2 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
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
  );
}
