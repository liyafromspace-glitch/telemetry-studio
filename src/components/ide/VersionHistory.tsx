import { Rule } from "@/data/mockRules";
import { GitBranch, Clock, User } from "lucide-react";

interface VersionHistoryProps {
  rule: Rule;
}

export function VersionHistory({ rule }: VersionHistoryProps) {
  const versions = Array.from({ length: rule.version }, (_, i) => ({
    version: rule.version - i,
    date: new Date(Date.parse(rule.createdAt) + (rule.version - i - 1) * 7 * 86400000)
      .toISOString()
      .slice(0, 10),
    author: i === 0 ? rule.author : i === 1 ? "Петров К.С." : "Смирнов И.И.",
    changes: i === 0 ? "Обновление логики проверки" : i === 1 ? "Добавление обработки ошибок" : "Начальная версия",
    current: i === 0,
  }));

  return (
    <div className="p-4 animate-fade-in">
      <div className="ide-panel rounded-sm">
        <div className="ide-header">История версий</div>
        <div className="divide-y divide-border">
          {versions.map((v) => (
            <div
              key={v.version}
              className={`p-3 flex items-start gap-3 text-xs ${
                v.current ? "bg-accent/50" : ""
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <GitBranch className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">v{v.version}</span>
                  {v.current && (
                    <span className="text-[9px] uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm">
                      текущая
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground mt-0.5">{v.changes}</div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-2.5 h-2.5" /> {v.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {v.date}
                  </span>
                </div>
              </div>
              {!v.current && (
                <button className="text-[10px] text-primary hover:underline flex-shrink-0">
                  Сравнить
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
