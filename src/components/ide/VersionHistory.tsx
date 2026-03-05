import { Rule } from "@/data/mockRules";
import { GitBranch, Clock, User } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { TimelineList, type TimelineItem } from "@/components/ui/timeline-list";

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
      <span className="text-[10px] text-primary hover:underline">Сравнить</span>
    ),
  }));

  return (
    <div className="p-4 animate-fade-in">
      <TimelineList
        title="История версий"
        headerIcon={<GitBranch className="w-3 h-3" />}
        items={items}
      />
    </div>
  );
}
