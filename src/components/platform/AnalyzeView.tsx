import { useState } from "react";
import { reports, type Report } from "@/data/mockPlatform";
import {
  FileText, Link2, Cpu, Grid3X3, ChevronRight, Clock, ArrowRight
} from "lucide-react";
import { CausalChain, buildReportChain } from "@/components/ide/CausalChain";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";

interface AnalyzeViewProps {
  onNavigateToInvestigate: () => void;
}

const chartData = Array.from({ length: 40 }, (_, i) => ({
  time: `09:${String(10 + i).padStart(2, "0")}`,
  "TI-R12-01": i < 6 ? 84 + Math.random() * 1.5 : 84 + (i - 6) * 0.55 + Math.random() * 1.2 + (i > 30 ? (i - 30) * 0.8 : 0),
  "PI-R12-01": 9.5 + i * 0.08 + Math.random() * 0.2,
}));

const timeRanges = ["5м", "15м", "30м", "1ч", "3ч", "12ч", "1д"];

export function AnalyzeView({ onNavigateToInvestigate }: AnalyzeViewProps) {
  const [selectedId, setSelectedId] = useState<string>(reports[0].id);
  const [activeRange, setActiveRange] = useState("30м");
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
              className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${
                selectedId === rep.id ? "bg-accent" : "hover:bg-accent/30"
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <FileText className="w-3 h-3 text-muted-foreground" />
                <span className="text-foreground truncate">{rep.name}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> {rep.lastGenerated}
              </div>
            </button>
          ))}
        </div>
      </div>

      <ReportDetail
        report={selected}
        onNavigateToInvestigate={onNavigateToInvestigate}
        activeRange={activeRange}
        onRangeChange={setActiveRange}
      />
    </div>
  );
}

function ReportDetail({
  report,
  onNavigateToInvestigate,
  activeRange,
  onRangeChange,
}: {
  report: Report;
  onNavigateToInvestigate: () => void;
  activeRange: string;
  onRangeChange: (r: string) => void;
}) {
  const lastTemp = chartData[chartData.length - 1]["TI-R12-01"];
  const prevTemp = chartData[chartData.length - 2]["TI-R12-01"];
  const delta = lastTemp - prevTemp;
  const baselineTemp = 84;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-card">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Отчёты</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{report.name}</span>
        </div>
        <button onClick={onNavigateToInvestigate} className="btn-secondary">
          Показать связанные инциденты <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-background p-5 space-y-5 animate-fade-in">
        <div className="vercel-card">
          <div className="ide-header">Описание</div>
          <div className="p-4 text-xs text-foreground leading-relaxed">{report.description}</div>
        </div>

        {/* Chart */}
        <div className="vercel-card overflow-hidden">
          <div className="px-5 pt-5 pb-0">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-2xl font-light font-mono text-foreground tracking-tight">
                {lastTemp.toFixed(1)}<span className="text-sm text-muted-foreground ml-0.5">°C</span>
              </span>
              <span className={`text-xs font-mono ${delta >= 0 ? "text-destructive" : "text-success"}`}>
                {delta >= 0 ? "+" : ""}{delta.toFixed(2)} ({((delta / prevTemp) * 100).toFixed(2)}%)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-4">
              <span className="bg-muted px-2 py-0.5 rounded-md text-[9px] font-mono">TI-R12-01</span>
              <span>Резервуар-12</span>
            </div>
          </div>

          <div className="px-0 h-[280px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="termGradTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.12} />
                    <stop offset="60%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.03} />
                    <stop offset="100%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="termGradPress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(0, 0%, 40%)" stopOpacity={0.06} />
                    <stop offset="100%" stopColor="hsl(0, 0%, 40%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "hsl(0, 0%, 30%)", fontFamily: "JetBrains Mono, monospace" }}
                  interval={7}
                />
                <YAxis hide />
                <ReferenceLine
                  y={baselineTemp}
                  stroke="hsl(0, 0%, 18%)"
                  strokeDasharray="4 4"
                  strokeWidth={0.5}
                />
                <ReferenceLine
                  y={90}
                  stroke="hsl(0, 72%, 35%)"
                  strokeDasharray="2 3"
                  strokeWidth={0.5}
                  label={{ value: "90°C порог", position: "left", fontSize: 9, fill: "hsl(0, 72%, 51%)", fontFamily: "JetBrains Mono" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 4%)",
                    border: "1px solid hsl(0, 0%, 12%)",
                    borderRadius: "10px",
                    fontSize: "10px",
                    fontFamily: "JetBrains Mono, monospace",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                    padding: "10px 14px",
                  }}
                  itemStyle={{ color: "hsl(0, 0%, 75%)" }}
                  labelStyle={{ color: "hsl(0, 0%, 40%)", fontSize: "9px", marginBottom: "4px" }}
                  cursor={{ stroke: "hsl(0, 0%, 25%)", strokeDasharray: "3 3" }}
                />
                <Area
                  type="monotone"
                  dataKey="TI-R12-01"
                  name="Температура °C"
                  stroke="hsl(160, 60%, 45%)"
                  strokeWidth={1.5}
                  fill="url(#termGradTemp)"
                  dot={false}
                  activeDot={{ r: 3, fill: "hsl(160, 60%, 45%)", stroke: "none" }}
                />
                <Area
                  type="monotone"
                  dataKey="PI-R12-01"
                  name="Давление бар"
                  stroke="hsl(0, 0%, 35%)"
                  strokeWidth={1}
                  fill="url(#termGradPress)"
                  dot={false}
                  activeDot={{ r: 2, fill: "hsl(0, 0%, 50%)", stroke: "none" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Time range chips */}
          <div className="px-5 py-3.5 flex items-center gap-1.5 border-t border-border">
            {timeRanges.map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-medium transition-all ${
                  activeRange === r
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {r}
              </button>
            ))}
            <div className="flex-1" />
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-[1.5px] bg-primary inline-block rounded-full" />
                Температура
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-[1px] bg-muted-foreground/40 inline-block rounded-full" />
                Давление
              </span>
            </div>
          </div>
        </div>

        <CausalChain
          title="Цепочка выполнения"
          steps={buildReportChain(report)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="vercel-card">
            <div className="ide-header flex items-center gap-1.5">
              <Link2 className="w-3 h-3" /> Сигналы
            </div>
            <div className="p-4 space-y-1.5">
              {report.linkedParameters.map((p) => (
                <div key={p} className="text-xs font-mono text-foreground">{p}</div>
              ))}
            </div>
          </div>
          <div className="vercel-card">
            <div className="ide-header flex items-center gap-1.5">
              <Cpu className="w-3 h-3" /> Правила
            </div>
            <div className="p-4 space-y-1.5">
              {report.linkedFunctions.map((f) => (
                <div key={f} className="text-xs text-foreground">{f}</div>
              ))}
            </div>
          </div>
          <div className="vercel-card">
            <div className="ide-header flex items-center gap-1.5">
              <Grid3X3 className="w-3 h-3" /> Матрицы
            </div>
            <div className="p-4 space-y-1.5">
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
