import { Rule, statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, FileText, Link2, GitBranch, Save, Zap, ChevronUp } from "lucide-react";
import { useState } from "react";
import { StatusBadge, ruleStatusToVariant } from "@/components/ui/status-badge";

function highlightCode(code: string) {
  return code.split('\n').map((line, i) => {
    if (line.trimStart().startsWith('//')) {
      return <div key={i}><span className="comment">{line}</span></div>;
    }
    const keywords = /\b(const|let|var|if|else|return|function|new|typeof|instanceof)\b/g;
    const stringRegex = /"[^"]*"|'[^']*'/g;
    const numberRegex = /\b\d+\.?\d*\b/g;
    const tokens: {start: number;end: number;type: string;text: string;}[] = [];
    let match;
    while ((match = stringRegex.exec(line)) !== null) {
      tokens.push({ start: match.index, end: match.index + match[0].length, type: 'string', text: match[0] });
    }
    while ((match = keywords.exec(line)) !== null) {
      const overlaps = tokens.some((t) => match!.index >= t.start && match!.index < t.end);
      if (!overlaps) tokens.push({ start: match.index, end: match.index + match[0].length, type: 'keyword', text: match[0] });
    }
    while ((match = numberRegex.exec(line)) !== null) {
      const overlaps = tokens.some((t) => match!.index >= t.start && match!.index < t.end);
      if (!overlaps) tokens.push({ start: match.index, end: match.index + match[0].length, type: 'number', text: match[0] });
    }
    tokens.sort((a, b) => a.start - b.start);
    if (tokens.length === 0) return <div key={i}>{line || '\u00A0'}</div>;
    const result: React.ReactNode[] = [];
    let pos = 0;
    tokens.forEach((token, ti) => {
      if (token.start > pos) result.push(<span key={`t-${ti}-pre`}>{line.slice(pos, token.start)}</span>);
      result.push(<span key={`t-${ti}`} className={token.type}>{token.text}</span>);
      pos = token.end;
    });
    if (pos < line.length) result.push(<span key="rest">{line.slice(pos)}</span>);
    return <div key={i}>{result}</div>;
  });
}

function GlowDiagram() {
  const nodes = [
  { x: 50, y: 30, label: "Сигнал" },
  { x: 160, y: 30, label: "Фильтр" },
  { x: 270, y: 30, label: "Функция" },
  { x: 105, y: 100, label: "λ" },
  { x: 215, y: 100, label: "Матрица" },
  { x: 50, y: 165, label: "Датчик" },
  { x: 160, y: 165, label: "Проверка" },
  { x: 270, y: 165, label: "Отчёт" }];

  const edges: [number, number][] = [
  [0, 3], [1, 3], [1, 4], [2, 4],
  [3, 5], [3, 6], [4, 6], [4, 7]];

  return (
    <svg viewBox="0 0 320 200" className="w-full h-full">
      <defs>
        <linearGradient id="edgeGradPurpleTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(271 60% 55%)" stopOpacity="0.8" />
          <stop offset="50%" stopColor="hsl(240 50% 55%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(185 70% 50%)" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {edges.map(([from, to], i) => {
        const f = nodes[from],t = nodes[to];
        return (
          <g key={i}>
            <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
            stroke="url(#edgeGradPurpleTeal)" strokeWidth="1.5" opacity="0.7" />
          </g>);

      })}
      {nodes.map((n, i) =>
      <g key={i} className="graph-node">
          <rect x={n.x - 20} y={n.y - 16} width={40} height={32} rx={3}
        fill="hsl(228 10% 14%)" stroke="hsl(185 60% 45%)" strokeWidth="1" />
          <rect x={n.x - 15} y={n.y - 11} width={30} height={22} rx={2}
        fill="hsl(228 10% 18%)" stroke="hsl(185 50% 35%)" strokeWidth="0.5" />
          <text x={n.x} y={n.y + 2} textAnchor="middle" fill="hsl(185 50% 70%)" fontSize="6" fontFamily="Inter, sans-serif">
            {n.label}
          </text>
        </g>
      )}
    </svg>);

}

export function RuleOverview({ rule }: RuleOverviewProps) {
  const [structureOpen, setStructureOpen] = useState(true);

  return (
    <div className="p-4 space-y-4">
      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="stat-card">
          <div className="stat-card-label">
            Статус
          </div>
          <div className="stat-card-value">
            <StatusBadge variant={ruleStatusToVariant(rule.status)} size="md">
              {statusLabels[rule.status]}
            </StatusBadge>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">
            <GitBranch className="w-3.5 h-3.5 text-primary" />
            Версия
          </div>
          <div className="stat-card-value">v{rule.version}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">
            <FileText className="w-3.5 h-3.5 text-primary" />
            Отчёты
          </div>
          <div className="stat-card-value">{rule.reportsUsed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">
            <Link2 className="w-3.5 h-3.5 text-primary" />
            Параметры
          </div>
          <div className="stat-card-value">{rule.parametersLinked}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">
            {rule.errorCount > 0 ?
            <XCircle className="w-3.5 h-3.5 text-destructive" /> :
            rule.warningCount > 0 ?
            <AlertTriangle className="w-3.5 h-3.5 text-warning" /> :
            <CheckCircle className="w-3.5 h-3.5 text-success" />
            }
            Проблемы
          </div>
          <div className="stat-card-value">{rule.errorCount} / {rule.warningCount}</div>
        </div>
      </div>

      {/* Properties */}
      <div className="vercel-card">
        <div className="ide-header flex items-center justify-between">
          <span>Основные свойства</span>
        </div>
        <div className="p-3 grid grid-cols-2 gap-x-8 gap-y-3 text-xs">
          <Property label="Название правила" value={rule.name} />
          <Property label="Тип параметра" value={rule.parameterType} />
          <Property label="Автор" value={rule.author} />
          <Property label="Последняя проверка" value={rule.lastCheck} />
          <Property label="Создано" value={rule.createdAt} />
          <Property label="ID" value={rule.id} mono />
        </div>
      </div>

      {/* Code editor */}
      <div className="vercel-card relative overflow-hidden">
        <div className="ide-header">Функция преобразования</div>
        <pre className="p-4 pl-5 text-xs font-mono text-foreground overflow-x-auto leading-relaxed code-block" style={{ background: 'hsl(228 12% 11%)' }}>
          <code>{highlightCode(rule.code)}</code>
        </pre>
      </div>

      {/* Structure section */}
      
















      
    </div>);
}

function Property({ label, value, mono }: {label: string;value: string;mono?: boolean;}) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 font-medium">{label}</div>
      <div className={`text-foreground ${mono ? "font-mono text-[11px]" : "font-medium"}`}>{value}</div>
    </div>);
}

interface RuleOverviewProps {
  rule: Rule;
}