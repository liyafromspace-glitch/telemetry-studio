import { useState } from "react";
import { reports, type Report } from "@/data/mockPlatform";
import {
  FileText, Link2, Cpu, Grid3X3, ChevronRight, Clock, ArrowRight, TrendingUp
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface AnalyzeViewProps {
  onNavigateToInvestigate: () => void;
}

// Mock chart data
const chartData = Array.from({ length: 20 }, (_, i) => ({
  time: `${String(i + 1).padStart(2, "0")}:00`,
  TI03025: i < 15 ? 82 + Math.random() * 6 : null,
  PT02012: 320 + Math.random() * 30 + (i > 12 ? i * 8 : 0),
  FT01007: 900 + Math.random() * 200 + (i > 15 ? 300 : 0),
}));

export function AnalyzeView({ onNavigateToInvestigate }: AnalyzeViewProps) {
  const [selectedId, setSelectedId] = useState<string>(reports[0].id);
  const selected = reports.find((r) => r.id === selectedId) || reports[0];

  return (
    <div className="flex-1 flex min-h-0">
      {/* Report list */}
      <div className="w-[260px] min-w-[260px] border-r border-border flex flex-col bg-card">
        <div className="ide-header">Отчёты</div>
        <div className="flex-1 overflow-y-auto">
          {reports.map((rep) => (
            <button
              key={rep.id}
              onClick={() => setSelectedId(rep.id)}
              className={`w-full text-left px-3 py-2 border-b border-border transition-colors ${
                selectedId === rep.id ? "bg-accent" : "hover:bg-accent/30"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs">
                <FileText className="w-3 h-3 text-muted-foreground" />
                <span className="text-foreground truncate">{rep.name}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> {rep.lastGenerated}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Report detail */}
      <ReportDetail report={selected} onNavigateToInvestigate={onNavigateToInvestigate} />
    </div>
  );
}

function ReportDetail({ report, onNavigateToInvestigate }: { report: Report; onNavigateToInvestigate: () => void }) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Отчёты</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{report.name}</span>
        </div>
        <button
          onClick={onNavigateToInvestigate}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground bg-secondary rounded-sm transition-colors"
        >
          Показать связанные инциденты <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-background p-4 space-y-4 animate-fade-in">
        {/* Description */}
        <div className="ide-panel rounded-sm">
          <div className="ide-header">Описание</div>
          <div className="p-3 text-xs text-foreground leading-relaxed">{report.description}</div>
        </div>

        {/* Chart */}
        <div className="ide-panel rounded-sm">
          <div className="ide-header flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" /> Визуализация
          </div>
          <div className="p-3 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 8%, 22%)" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220, 8%, 55%)" }} stroke="hsl(228, 8%, 22%)" />
                <YAxis tick={{ fontSize: 9, fill: "hsl(220, 8%, 55%)" }} stroke="hsl(228, 8%, 22%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(230, 9%, 17%)",
                    border: "1px solid hsl(228, 8%, 22%)",
                    borderRadius: "4px",
                    fontSize: "10px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Line type="monotone" dataKey="TI03025" stroke="hsl(212, 92%, 58%)" strokeWidth={1.5} dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="PT02012" stroke="hsl(2, 93%, 63%)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="FT01007" stroke="hsl(39, 74%, 48%)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Linked entities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="ide-panel rounded-sm">
            <div className="ide-header flex items-center gap-1.5">
              <Link2 className="w-3 h-3" /> Параметры
            </div>
            <div className="p-3 space-y-1">
              {report.linkedParameters.map((p) => (
                <div key={p} className="text-xs font-mono text-foreground">{p}</div>
              ))}
            </div>
          </div>
          <div className="ide-panel rounded-sm">
            <div className="ide-header flex items-center gap-1.5">
              <Cpu className="w-3 h-3" /> Функции
            </div>
            <div className="p-3 space-y-1">
              {report.linkedFunctions.map((f) => (
                <div key={f} className="text-xs text-foreground">{f}</div>
              ))}
            </div>
          </div>
          <div className="ide-panel rounded-sm">
            <div className="ide-header flex items-center gap-1.5">
              <Grid3X3 className="w-3 h-3" /> Матрицы
            </div>
            <div className="p-3 space-y-1">
              {report.linkedMatrices.map((m) => (
                <div key={m} className="text-xs text-foreground">{m}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
