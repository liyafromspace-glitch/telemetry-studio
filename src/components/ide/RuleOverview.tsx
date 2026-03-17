import { Rule, statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, FileText, Link2, GitBranch } from "lucide-react";
import { StatusBadge, ruleStatusToVariant } from "@/components/ui/status-badge";

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

interface RuleOverviewProps {
  rule: Rule;
}

export function RuleOverview({ rule }: RuleOverviewProps) {
  return (
    <div className="p-5 space-y-5">
      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="stat-card">
          <div className="stat-card-label">Статус</div>
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
            {rule.errorCount > 0 ? (
              <XCircle className="w-3.5 h-3.5 text-destructive" />
            ) : rule.warningCount > 0 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5 text-success" />
            )}
            Проблемы
          </div>
          <div className="stat-card-value">{rule.errorCount} / {rule.warningCount}</div>
        </div>
      </div>

      {/* Properties */}
      <div className="vercel-card">
        <div className="ide-header flex items-center justify-between">
          <span>Properties</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-4 text-xs">
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
        <pre
          className="p-5 text-xs font-mono text-foreground overflow-x-auto leading-relaxed code-block"
          style={{ background: 'hsl(0, 0%, 4%)' }}
        >
          <code>{highlightCode(rule.code)}</code>
        </pre>
      </div>
    </div>
  );
}

function Property({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-medium">{label}</div>
      <div className={`text-foreground ${mono ? "font-mono text-[11px]" : "font-medium"}`}>{value}</div>
    </div>
  );
}
