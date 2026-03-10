import { useState } from "react";
import { reports, type Report } from "@/data/mockPlatform";
import {
  FileText, Link2, Cpu, Grid3X3, ChevronRight, Clock, ArrowRight, TrendingUp
} from "lucide-react";
import { CausalChain, buildReportChain } from "@/components/ide/CausalChain";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";

interface AnalyzeViewProps {
  onNavigateToInvestigate: () => void;
}

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

      <ReportDetail report={selected} onNavigateToInvestigate={onNavigateToInvestigate} />
    </div>
  );
}

function ReportDetail({ report, onNavigateToInvestigate }: { report: Report; onNavigateToInvestigate: () => void }) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Отчёты</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{report.name}</span>
        </div>
        <button
          onClick={onNavigateToInvestigate}
          className="btn-secondary"
        >
          Показать связанные инциденты <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-background p-4 space-y-4 animate-fade-in">
        <div className="vercel-card">
          <div className="ide-header">Описание</div>
          <div className="p-3 text-xs text-foreground leading-relaxed">{report.description}</div>
        </div>

        {/* Chart with teal glow palette */}
        <div className="vercel-card">
          <div className="ide-header flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" /> Визуализация
          </div>
          <div className="p-3 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradTI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(185, 70%, 50%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(185, 70%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(2, 93%, 63%)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(2, 93%, 63%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradFT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(39, 74%, 48%)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(39, 74%, 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 8%, 18%)" />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220, 8%, 45%)" }} stroke="hsl(228, 8%, 18%)" />
                <YAxis tick={{ fontSize: 9, fill: "hsl(220, 8%, 45%)" }} stroke="hsl(228, 8%, 18%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 10%)",
                    border: "1px solid hsl(0, 0%, 15%)",
                    borderRadius: "8px",
                    fontSize: "10px",
                    boxShadow: "none",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Area type="monotone" dataKey="TI03025" stroke="hsl(185, 70%, 50%)" strokeWidth={1.5} fill="url(#gradTI)" dot={false} connectNulls={false} />
                <Area type="monotone" dataKey="PT02012" stroke="hsl(2, 93%, 63%)" strokeWidth={1.5} fill="url(#gradPT)" dot={false} />
                <Area type="monotone" dataKey="FT01007" stroke="hsl(39, 74%, 48%)" strokeWidth={1.5} fill="url(#gradFT)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <CausalChain
          title="Логическая цепочка события"
          steps={buildReportChain(report)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="vercel-card">
            <div className="ide-header flex items-center gap-1.5">
              <Link2 className="w-3 h-3" /> Параметры
            </div>
            <div className="p-3 space-y-1">
              {report.linkedParameters.map((p) => (
                <div key={p} className="text-xs font-mono text-foreground">{p}</div>
              ))}
            </div>
          </div>
          <div className="vercel-card">
            <div className="ide-header flex items-center gap-1.5">
              <Cpu className="w-3 h-3" /> Функции
            </div>
            <div className="p-3 space-y-1">
              {report.linkedFunctions.map((f) => (
                <div key={f} className="text-xs text-foreground">{f}</div>
              ))}
            </div>
          </div>
          <div className="vercel-card">
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
