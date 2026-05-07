import { Rule, statusLabels } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, FileText, Link2, GitBranch, Sparkles } from "lucide-react";
import { StatusBadge, ruleStatusToVariant } from "@/components/ui/status-badge";
import { useDebug, signalRegistry, getSnapshot } from "./DebugContext";
import { CausalChain, buildIncidentChain } from "./CausalChain";

function highlightCode(code: string, highlightTokens: string[]) {
  const tokenSet = new Set(highlightTokens.map((t) => t.toLowerCase()));
  return code.split('\n').map((line, i) => {
    if (line.trimStart().startsWith('//')) {
      return <div key={i}><span className="comment">{line}</span></div>;
    }
    const keywords = /\b(const|let|var|if|else|return|function|new|typeof|instanceof)\b/g;
    const stringRegex = /"[^"]*"|'[^']*'/g;
    const numberRegex = /\b\d+\.?\d*\b/g;
    const identRegex = /\b[A-Za-z_][A-Za-z0-9_]*\b/g;
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
    if (tokenSet.size > 0) {
      while ((match = identRegex.exec(line)) !== null) {
        if (!tokenSet.has(match[0].toLowerCase())) continue;
        const overlaps = tokens.some((t) => match!.index >= t.start && match!.index < t.end);
        if (!overlaps) tokens.push({ start: match.index, end: match.index + match[0].length, type: 'highlight', text: match[0] });
      }
    }
    tokens.sort((a, b) => a.start - b.start);
    if (tokens.length === 0) return <div key={i}>{line || '\u00A0'}</div>;
    const result: React.ReactNode[] = [];
    let pos = 0;
    tokens.forEach((token, ti) => {
      if (token.start > pos) result.push(<span key={`t-${ti}-pre`}>{line.slice(pos, token.start)}</span>);
      const cls = token.type === 'highlight' ? 'code-highlight' : token.type;
      result.push(<span key={`t-${ti}`} className={cls}>{token.text}</span>);
      pos = token.end;
    });
    if (pos < line.length) result.push(<span key="rest">{line.slice(pos)}</span>);
    // Mark whole line if it contains a highlight
    const hasHighlight = tokens.some((t) => t.type === 'highlight');
    return (
      <div key={i} className={hasHighlight ? 'code-line-active' : undefined}>
        {result}
      </div>
    );
  });
}

interface RuleOverviewProps {
  rule: Rule;
}

export function RuleOverview({ rule }: RuleOverviewProps) {
  const { highlightedSignal, showCausal, setShowCausal } = useDebug();
  const snapshot = getSnapshot(highlightedSignal);
  const tokens = snapshot ? snapshot.codeTokens : [];

  return (
    <div className="px-6 pt-6 pb-8 space-y-8">
      {/* Object header */}
      <div className="space-y-1.5">
        <div className="type-state">Rule · v{rule.version}</div>
        <h1 className="type-object text-[22px]">{rule.name}</h1>
        <div className="flex items-center gap-3 type-metadata">
          <StatusBadge variant={ruleStatusToVariant(rule.status)} size="xs">
            {statusLabels[rule.status]}
          </StatusBadge>
          <span>{rule.parameterType}</span>
          <span>·</span>
          <span>{rule.author}</span>
          <span>·</span>
          <span className="font-mono">{rule.id}</span>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-border/60">
        <div className="stat-card">
          <div className="stat-card-label">
            <GitBranch className="w-3 h-3 text-muted-foreground/60" />
            Version
          </div>
          <div className="stat-card-value">v{rule.version}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">
            <FileText className="w-3 h-3 text-muted-foreground/60" />
            Reports
          </div>
          <div className="stat-card-value">{rule.reportsUsed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">
            <Link2 className="w-3 h-3 text-muted-foreground/60" />
            Linked
          </div>
          <div className="stat-card-value">{rule.parametersLinked}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">
            {rule.errorCount > 0 ? (
              <XCircle className="w-3 h-3 text-destructive" />
            ) : rule.warningCount > 0 ? (
              <AlertTriangle className="w-3 h-3 text-warning" />
            ) : (
              <CheckCircle className="w-3 h-3 text-success" />
            )}
            Issues
          </div>
          <div className="stat-card-value">
            {rule.errorCount}
            <span className="text-muted-foreground/50 font-normal"> / {rule.warningCount}</span>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div className="space-y-3">
        <div className="type-state">Properties</div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-xs">
          <Property label="Название правила" value={rule.name} />
          <Property label="Тип параметра" value={rule.parameterType} />
          <Property label="Автор" value={rule.author} />
          <Property label="Последняя проверка" value={rule.lastCheck} />
          <Property label="Создано" value={rule.createdAt} />
          <Property label="ID" value={rule.id} mono />
        </div>
      </div>

      {/* Code */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="type-state">Transform Function</div>
          <div className="flex items-center gap-2">
            {snapshot && (
              <span className="text-[10px] text-muted-foreground">
                Highlighting clauses for{" "}
                <span className="font-mono text-primary">{snapshot.signal}</span>{" "}
                = <span className="font-mono text-foreground">{snapshot.value}</span>
              </span>
            )}
            <button
              onClick={() => setShowCausal(!showCausal)}
              className="btn-secondary"
              title="Open causal breakdown"
            >
              <Sparkles className="w-3 h-3" />
              {showCausal ? "Hide" : "Show"} why activated
            </button>
          </div>
        </div>
        <pre className="text-xs font-mono text-foreground overflow-x-auto leading-relaxed code-block py-4 px-4 rounded-lg border border-border/50 bg-[hsl(0_0%_4%)]">
          <code>{highlightCode(rule.code, tokens)}</code>
        </pre>
      </div>

      {/* Causal breakdown */}
      {showCausal && (
        <div className="space-y-3 animate-fade-in">
          <div className="type-state">Causal Breakdown</div>
          <CausalChain
            title="Why did this rule activate?"
            steps={buildIncidentChain({
              linkedParameters: ["TI-R12-01", "PI-R12-01"],
              linkedFunctions: [rule.name],
              linkedMatrices: ["Аварийная защита"],
              title: "Перегрев резервуара-12",
              description: "Температура превысила порог при повышенном давлении линии",
            })}
          />
        </div>
      )}
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
