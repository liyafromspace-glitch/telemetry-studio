import { useState } from "react";
import { Rule } from "@/data/mockRules";
import { GitBranch, Clock, User, X } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { TimelineList, type TimelineItem } from "@/components/ui/timeline-list";

interface VersionHistoryProps {
  rule: Rule;
}

interface VersionEntry {
  version: number;
  date: string;
  author: string;
  changes: string;
  current: boolean;
  code: string;
}

/** Simulate a previous version of code by making small edits */
function previousCode(code: string, version: number): string {
  if (version >= 3) return code;
  if (version === 2) {
    return code
      .replace(/TEMP_THRESHOLD = 90/, "TEMP_THRESHOLD = 95")
      .replace(/PRESSURE_THRESHOLD = 11/, "PRESSURE_THRESHOLD = 12")
      .replace(/} else if \(input\.temperature > TEMP_THRESHOLD \* 0\.95\) \{[\s\S]*?\}/, "");
  }
  return code
    .replace(/TEMP_THRESHOLD = 90/, "TEMP_THRESHOLD = 100")
    .replace(/PRESSURE_THRESHOLD = 11/, "PRESSURE_THRESHOLD = 13")
    .replace(/createIncident\("Перегрев резервуара"\);\s*\n/, "")
    .replace(/} else if \(input\.temperature > TEMP_THRESHOLD \* 0\.95\) \{[\s\S]*?\}/, "");
}

function diffLines(a: string, b: string) {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const aSet = new Set(aLines);
  const bSet = new Set(bLines);
  return {
    left: aLines.map((line) => ({ line, status: bSet.has(line) ? "same" : "removed" as const })),
    right: bLines.map((line) => ({ line, status: aSet.has(line) ? "same" : "added" as const })),
  };
}

export function VersionHistory({ rule }: VersionHistoryProps) {
  const [compareWith, setCompareWith] = useState<number | null>(null);

  const versions: VersionEntry[] = Array.from({ length: rule.version }, (_, i) => {
    const v = rule.version - i;
    return {
      version: v,
      date: new Date(Date.parse(rule.createdAt) + (v - 1) * 7 * 86400000).toISOString().slice(0, 10),
      author: i === 0 ? rule.author : i === 1 ? "Петров К.С." : "Смирнов И.И.",
      changes: i === 0 ? "Обновление логики проверки" : i === 1 ? "Добавление обработки ошибок" : "Начальная версия",
      current: i === 0,
      code: i === 0 ? rule.code : previousCode(rule.code, v),
    };
  });

  const current = versions[0];
  const previous = compareWith !== null ? versions.find((v) => v.version === compareWith) : null;

  const items: TimelineItem[] = versions.map((v) => ({
    id: `v${v.version}`,
    label: `v${v.version}`,
    title: v.changes,
    dotColor: v.current ? "primary" as const : "muted-foreground" as const,
    active: v.current,
    icon: <GitBranch className="w-3 h-3 text-primary" />,
    meta: (
      <span className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <User className="w-2.5 h-2.5" /> {v.author}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" /> {v.date}
        </span>
      </span>
    ),
    action: v.current ? (
      <StatusBadge variant="active" size="xs">текущая</StatusBadge>
    ) : (
      <button
        onClick={() => setCompareWith(v.version)}
        className="text-[10px] text-muted-foreground hover:text-primary hover:underline"
      >
        Сравнить
      </button>
    ),
  }));

  return (
    <div className="p-4 animate-fade-in space-y-4">
      <TimelineList
        title="История версий"
        headerIcon={<GitBranch className="w-3 h-3" />}
        items={items}
      />

      {previous && (
        <div className="vercel-card animate-fade-in">
          <div className="ide-header flex items-center justify-between">
            <span>
              Diff · v{previous.version} → v{current.version}
            </span>
            <button
              onClick={() => setCompareWith(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <DiffView previous={previous} current={current} />
        </div>
      )}
    </div>
  );
}

function DiffView({ previous, current }: { previous: VersionEntry; current: VersionEntry }) {
  const { left, right } = diffLines(previous.code, current.code);

  return (
    <div className="grid grid-cols-2 gap-px bg-border text-[11px] font-mono leading-relaxed">
      <div className="bg-card">
        <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
          v{previous.version} · {previous.date}
        </div>
        <div className="overflow-x-auto">
          {left.map((row, i) => (
            <div
              key={i}
              className={`px-3 py-0.5 whitespace-pre ${
                row.status === "removed"
                  ? "bg-destructive/10 text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              <span className="inline-block w-4 text-muted-foreground/50">
                {row.status === "removed" ? "-" : " "}
              </span>
              {row.line || "\u00A0"}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card">
        <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
          v{current.version} · {current.date} <span className="text-primary">(current)</span>
        </div>
        <div className="overflow-x-auto">
          {right.map((row, i) => (
            <div
              key={i}
              className={`px-3 py-0.5 whitespace-pre ${
                row.status === "added"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80"
              }`}
            >
              <span className="inline-block w-4 text-muted-foreground/50">
                {row.status === "added" ? "+" : " "}
              </span>
              {row.line || "\u00A0"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
