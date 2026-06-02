import { useState, useEffect, useMemo } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { rules } from "@/data/mockRules";
import { matrices } from "@/data/mockMatrices";
import { liveSignals, incidents, reports } from "@/data/mockPlatform";
import {
  Radio, Bug, BarChart3, Settings2, Shield,
  Cpu, Grid3X3, AlertTriangle, FileText, Zap, Play
} from "lucide-react";
import { type AppState } from "@/data/mockPlatform";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (state: AppState) => void;
  onSelectEntity?: (type: string, id: string) => void;
}

interface CommandEntry {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
  meta?: string;
}

export function CommandPalette({ open, onOpenChange, onNavigate, onSelectEntity }: CommandPaletteProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const entries = useMemo<CommandEntry[]>(() => {
    const items: CommandEntry[] = [];

    // Navigation
    const navItems: { state: AppState; label: string; icon: React.ReactNode; shortcut?: string }[] = [
      { state: "live", label: "Monitor — Мониторинг сигналов", icon: <Radio className="w-3.5 h-3.5" />, shortcut: "⌘1" },
      { state: "investigate", label: "Investigate — Расследование инцидентов", icon: <Bug className="w-3.5 h-3.5" />, shortcut: "⌘I" },
      { state: "analyze", label: "Trace — Отчёты и анализ", icon: <BarChart3 className="w-3.5 h-3.5" />, shortcut: "⌘3" },
      { state: "configure", label: "Configure — Редактор правил", icon: <Settings2 className="w-3.5 h-3.5" />, shortcut: "⌘M" },
      { state: "govern", label: "Deploy — Управление версиями", icon: <Shield className="w-3.5 h-3.5" />, shortcut: "⌘5" },
    ];
    navItems.forEach((n) =>
      items.push({
        id: `nav-${n.state}`,
        label: n.label,
        category: "Навигация",
        icon: n.icon,
        action: () => { onNavigate(n.state); onOpenChange(false); },
        shortcut: n.shortcut,
      })
    );

    // Rules
    rules.forEach((r) =>
      items.push({
        id: `rule-${r.id}`,
        label: r.name,
        category: "Правила",
        icon: <Cpu className="w-3.5 h-3.5" />,
        action: () => { onSelectEntity?.("rule", r.id); onOpenChange(false); },
        meta: `v${r.version} · ${r.parameterType}`,
      })
    );

    // Matrices
    matrices.forEach((m) =>
      items.push({
        id: `matrix-${m.id}`,
        label: m.name,
        category: "Матрицы",
        icon: <Grid3X3 className="w-3.5 h-3.5" />,
        action: () => { onSelectEntity?.("matrix", m.id); onOpenChange(false); },
        meta: `v${m.version} · ${m.matrixType}`,
      })
    );

    // Signals
    liveSignals.forEach((s) =>
      items.push({
        id: `signal-${s.id}`,
        label: `${s.parameter} — ${s.currentValue} ${s.unit}`,
        category: "Сигналы",
        icon: <Radio className="w-3.5 h-3.5" />,
        action: () => { onNavigate("live"); onOpenChange(false); },
        meta: s.status,
      })
    );

    // Incidents
    incidents.forEach((inc) =>
      items.push({
        id: `inc-${inc.id}`,
        label: `${inc.code} — ${inc.title}`,
        category: "Инциденты",
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        action: () => { onNavigate("investigate"); onOpenChange(false); },
        meta: inc.priority,
      })
    );

    // Reports
    reports.forEach((rep) =>
      items.push({
        id: `rep-${rep.id}`,
        label: rep.name,
        category: "Отчёты",
        icon: <FileText className="w-3.5 h-3.5" />,
        action: () => { onNavigate("analyze"); onOpenChange(false); },
      })
    );

    // Actions
    items.push({
      id: "action-simulate",
      label: "Запустить симуляцию",
      category: "Действия",
      icon: <Play className="w-3.5 h-3.5" />,
      action: () => { onNavigate("configure"); onOpenChange(false); },
      shortcut: "⌘↵",
    });
    items.push({
      id: "action-deploy",
      label: "Deploy текущее правило",
      category: "Действия",
      icon: <Zap className="w-3.5 h-3.5" />,
      action: () => { onNavigate("configure"); onOpenChange(false); },
      shortcut: "⌘⇧S",
    });

    return items;
  }, [onNavigate, onOpenChange, onSelectEntity]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandEntry[]> = {};
    entries.forEach((e) => {
      if (!groups[e.category]) groups[e.category] = [];
      groups[e.category].push(e);
    });
    return groups;
  }, [entries]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Поиск команд, правил, сигналов..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty className="py-8 text-center text-xs text-muted-foreground">
          Ничего не найдено
        </CommandEmpty>
        {Object.entries(grouped).map(([category, items]) => (
          <CommandGroup key={category} heading={category}>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={item.action}
                className="flex items-center gap-3 py-2.5"
              >
                <span className="text-muted-foreground">{item.icon}</span>
                <span className="flex-1 text-xs">{item.label}</span>
                {item.meta && (
                  <span className="text-[10px] text-muted-foreground font-mono">{item.meta}</span>
                )}
                {item.shortcut && (
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
