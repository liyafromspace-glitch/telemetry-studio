import { Rule, statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, FileText, Link2, GitBranch, Save, Zap, ChevronUp } from "lucide-react";
import { useState } from "react";

interface RuleOverviewProps {
  rule: Rule;
}

function highlightCode(code: string) {
  return code.split('\n').map((line, i) => {
    if (line.trimStart().startsWith('//')) {
      return <div key={i}><span className="comment">{line}</span></div>;
    }

    const keywords = /\b(const|let|var|if|else|return|function|new|typeof|instanceof)\b/g;
    const stringRegex = /"[^"]*"|'[^']*'/g;
    const numberRegex = /\b\d+\.?\d*\b/g;

    const tokens: { start: number; end: number; type: string; text: string }[] = [];

    let match;
    while ((match = stringRegex.exec(line)) !== null) {
      tokens.push({ start: match.index, end: match.index + match[0].length, type: 'string', text: match[0] });
    }
    while ((match = keywords.exec(line)) !== null) {
      const overlaps = tokens.some(t => match!.index >= t.start && match!.index < t.end);
      if (!overlaps) tokens.push({ start: match.index, end: match.index + match[0].length, type: 'keyword', text: match[0] });
    }
    while ((match = numberRegex.exec(line)) !== null) {
      const overlaps = tokens.some(t => match!.index >= t.start && match!.index < t.end);
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

// Structure diagram with glow
function GlowDiagram({ variant }: { variant: number }) {
  const sizes = [
    { outer: 70, inner: 35 },
    { outer: 60, inner: 30 },
    { outer: 55, inner: 28 },
  ];
  const s = sizes[variant % 3];
  
  return (
    <div className="aspect-[4/3] bg-background/30 rounded-sm border border-border flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at center, hsl(185 70% 50% / 0.15) 0%, transparent 70%)'
        }}
      />
      <div 
        className="rounded-full border-2 glow-ring flex items-center justify-center"
        style={{ width: s.outer, height: s.outer }}
      >
        <div 
          className="rounded-full border glow-ring-inner"
          style={{ width: s.inner, height: s.inner }}
        />
      </div>
    </div>
  );
}

export function RuleOverview({ rule }: RuleOverviewProps) {
  const [structureOpen, setStructureOpen] = useState(true);

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="stat-card">
          <div className="stat-card-label">
            <span className={`status-dot ${
              rule.status === "active" ? "status-active" :
              rule.status === "error" ? "status-error" :
              rule.status === "draft" ? "status-draft" : "status-scheduled"
            }`} />
            Статус
          </div>
          <div className="stat-card-value">{statusLabels[rule.status]}</div>
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
            {rule.errorCount > 0
              ? <XCircle className="w-3.5 h-3.5 text-destructive" />
              : rule.warningCount > 0
                ? <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                : <CheckCircle className="w-3.5 h-3.5 text-success" />
            }
            Проблемы
          </div>
          <div className="stat-card-value">{rule.errorCount} / {rule.warningCount}</div>
        </div>
      </div>

      {/* Properties */}
      <div className="ide-panel-glow rounded-sm">
        <div className="ide-header flex items-center justify-between">
          <span>Основные свойства</span>
          <div className="flex items-center gap-1.5 normal-case tracking-normal">
            <button className="btn-secondary !text-[10px] !py-0.5 !px-2">
              <CheckCircle className="w-3 h-3" />
              Проверить
            </button>
            <button className="btn-secondary !text-[10px] !py-0.5 !px-2">
              <Save className="w-3 h-3" />
              Сохранить
            </button>
            <button className="btn-primary !text-[10px] !py-0.5 !px-2">
              <Zap className="w-3 h-3" />
              Активировать
            </button>
          </div>
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
      <div className="ide-panel-glow rounded-sm relative overflow-hidden">
        <div className="ide-header">Функция преобразования</div>
        {/* Left glow edge */}
        <div 
          className="absolute left-0 top-8 bottom-0 w-1"
          style={{ background: 'linear-gradient(180deg, hsl(185 70% 50% / 0.3) 0%, hsl(185 70% 50% / 0.05) 100%)' }}
        />
        <pre className="p-4 pl-5 text-xs font-mono text-foreground overflow-x-auto leading-relaxed code-block" style={{ background: 'hsl(228 12% 11%)' }}>
          <code>{highlightCode(rule.code)}</code>
        </pre>
      </div>

      {/* Structure section */}
      <div className="ide-panel-glow rounded-sm">
        <button 
          onClick={() => setStructureOpen(!structureOpen)}
          className="ide-header w-full flex items-center justify-between cursor-pointer hover:bg-accent/30 transition-colors"
        >
          <span>Структура и матрицы</span>
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${structureOpen ? '' : 'rotate-180'}`} />
        </button>
        {structureOpen && (
          <div className="p-4 grid grid-cols-3 gap-4">
            {[0, 1, 2].map(i => (
              <GlowDiagram key={i} variant={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Property({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5 font-medium">{label}</div>
      <div className={`text-foreground ${mono ? "font-mono text-[11px]" : "font-medium"}`}>{value}</div>
    </div>
  );
}
