import { useState } from "react";
import { BookOpen, Activity, Zap, XCircle, Clock, CheckCircle, Thermometer, Gauge } from "lucide-react";
import { type Incident } from "@/data/mockPlatform";
import { TimelineList, type TimelineItem } from "@/components/ui/timeline-list";
import { StatusBadge } from "@/components/ui/status-badge";

interface SystemStoryProps {
  incident: Incident;
}

interface StoryEvent {
  time: string;
  type: "signal" | "condition" | "function" | "matrix" | "incident" | "action" | "resolved";
  title: string;
  detail: string;
  severity: "info" | "warning" | "critical" | "success";
}

const storyByIncident: Record<string, StoryEvent[]> = {
  "inc-001": [
    { time: "09:28", type: "signal", title: "Температура стабильна", detail: "TI-R12-01.PV = 84°C, в пределах нормы", severity: "info" },
    { time: "09:31", type: "signal", title: "Температура начинает расти", detail: "TI-R12-01.PV = 87°C, +3°C за 3 мин", severity: "info" },
    { time: "09:32", type: "signal", title: "Давление растёт", detail: "PI-R12-01.PV = 11.8 бар, корреляция с температурой", severity: "warning" },
    { time: "09:33", type: "condition", title: "Превышен порог 90°C", detail: "TI-R12-01.PV = 92°C > 90°C → TRUE", severity: "critical" },
    { time: "09:34", type: "function", title: "Активировано правило «Контроль перегрева»", detail: "Температура 96°C + давление 12.3 бар → условие выполнено", severity: "critical" },
    { time: "09:35", type: "action", title: "Закрыт клапан подачи XV-R12-01", detail: "Автоматическое перекрытие по правилу аварийной защиты", severity: "critical" },
    { time: "09:36", type: "incident", title: "Инцидент INC-4201 зарегистрирован", detail: "Автоматическое создание: перегрев резервуара-12", severity: "critical" },
    { time: "09:40", type: "action", title: "Назначен Петров К.С.", detail: "Андреева А.Н. назначила ответственного", severity: "info" },
    { time: "09:45", type: "action", title: "Датчик TI-R12-01 проверен", detail: "Показания подтверждены — перегрев реальный", severity: "warning" },
  ],
  "inc-002": [
    { time: "09:30", type: "signal", title: "Давление в норме", detail: "PI-R12-01.PV = 10.5 бар", severity: "info" },
    { time: "09:32", type: "signal", title: "Давление растёт", detail: "PI-R12-01.PV = 11.8 бар, приближается к верхней границе", severity: "warning" },
    { time: "09:33", type: "condition", title: "Превышение диапазона", detail: "PI-R12-01.PV = 12.3 > 11 бар → TRUE", severity: "critical" },
    { time: "09:33", type: "incident", title: "Инцидент INC-4198 создан", detail: "Автоматическое создание: повышенное давление", severity: "critical" },
  ],
  "inc-003": [
    { time: "14:18", type: "signal", title: "Скорость насоса стабильна", detail: "SI-R12-01.PV = 1420 RPM", severity: "info" },
    { time: "14:20", type: "signal", title: "Скачок скорости", detail: "SI-R12-01.PV = 1520 RPM, превышение 1500 RPM", severity: "warning" },
    { time: "14:20", type: "incident", title: "Инцидент INC-4150 создан", detail: "Превышение допустимой скорости насоса", severity: "critical" },
    { time: "15:00", type: "action", title: "Назначен Смирнов И.И.", detail: "Петров К.С. назначил ответственного", severity: "info" },
    { time: "11:00", type: "resolved", title: "Рампа скорректирована", detail: "Скорость нарастания ограничена до 200 RPM/с", severity: "success" },
  ],
};

const defaultStory: StoryEvent[] = [
  { time: "—", type: "signal", title: "Событие зафиксировано", detail: "Системное событие", severity: "info" },
];

const severityToDotColor: Record<string, TimelineItem["dotColor"]> = {
  info: "primary",
  warning: "warning",
  critical: "destructive",
  success: "success",
};

const typeIcons: Record<string, React.ReactNode> = {
  signal: <Activity className="w-3 h-3" />,
  condition: <Zap className="w-3 h-3" />,
  function: <Zap className="w-3 h-3" />,
  matrix: <Zap className="w-3 h-3" />,
  incident: <XCircle className="w-3 h-3" />,
  action: <Clock className="w-3 h-3" />,
  resolved: <CheckCircle className="w-3 h-3" />,
};

export function SystemStory({ incident }: SystemStoryProps) {
  const events = storyByIncident[incident.id] || defaultStory;

  const items: TimelineItem[] = events.map((event, i) => ({
    id: `event-${i}`,
    label: event.time,
    title: event.title,
    description: event.detail,
    dotColor: severityToDotColor[event.severity],
    icon: typeIcons[event.type],
  }));

  return (
    <TimelineList
      title="Хронология системы"
      headerIcon={<BookOpen className="w-3.5 h-3.5" />}
      items={items}
      expandable
    />
  );
}
