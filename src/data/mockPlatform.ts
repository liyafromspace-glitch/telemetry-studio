// Shared platform data: incidents, reports, live signals, context, users

export type AppState = "live" | "investigate" | "analyze" | "configure" | "govern" | "admin";

export interface PlatformContext {
  environment: string;
  reservoir: string;
  measurementSystem: string;
  period: string;
}

export const defaultContext: PlatformContext = {
  environment: "Северное месторождение",
  reservoir: "Резервуар-12",
  measurementSystem: "TI-R12-01",
  period: "10.03.2026 09:00 – 10:00",
};

// ─── Live Signals ───

export interface LiveSignal {
  id: string;
  parameter: string;
  currentValue: string;
  expectedValue: string;
  unit: string;
  status: "critical" | "warning" | "normal";
  linkedFunction: string;
  linkedMatrix: string;
  timestamp: string;
}

export const liveSignals: LiveSignal[] = [
  {
    id: "sig-001",
    parameter: "TI-R12-01.PV",
    currentValue: "96.4",
    expectedValue: "< 90",
    unit: "°C",
    status: "critical",
    linkedFunction: "Контроль перегрева",
    linkedMatrix: "Аварийная защита резервуара",
    timestamp: "2026-03-10 09:34:12",
  },
  {
    id: "sig-002",
    parameter: "PI-R12-01.PV",
    currentValue: "12.3",
    expectedValue: "8–11",
    unit: "бар",
    status: "warning",
    linkedFunction: "Контроль давления линии",
    linkedMatrix: "Аварийная защита резервуара",
    timestamp: "2026-03-10 09:34:08",
  },
  {
    id: "sig-003",
    parameter: "SI-R12-01.PV",
    currentValue: "1450",
    expectedValue: "1200–1500",
    unit: "RPM",
    status: "normal",
    linkedFunction: "Мониторинг насоса",
    linkedMatrix: "Матрица управляющих механизмов",
    timestamp: "2026-03-10 09:34:05",
  },
  {
    id: "sig-004",
    parameter: "LI-R12-01.PV",
    currentValue: "78",
    expectedValue: "60–90",
    unit: "%",
    status: "normal",
    linkedFunction: "Контроль уровня топлива",
    linkedMatrix: "Матрица параметров резервуара",
    timestamp: "2026-03-10 09:34:02",
  },
  {
    id: "sig-005",
    parameter: "XV-R12-01.ST",
    currentValue: "ОТКРЫТ",
    expectedValue: "ОТКРЫТ",
    unit: "",
    status: "normal",
    linkedFunction: "Управление клапаном подачи",
    linkedMatrix: "Матрица управляющих механизмов",
    timestamp: "2026-03-10 09:34:00",
  },
  {
    id: "sig-006",
    parameter: "TI-R12-02.PV",
    currentValue: "91.2",
    expectedValue: "< 90",
    unit: "°C",
    status: "warning",
    linkedFunction: "Контроль перегрева",
    linkedMatrix: "Аварийная защита резервуара",
    timestamp: "2026-03-10 09:33:55",
  },
];

// ─── Incidents ───

export type IncidentStatus = "new" | "in_progress" | "monitoring" | "resolved";

export interface IncidentTask {
  id: string;
  title: string;
  assignee: string;
  done: boolean;
}

export interface Incident {
  id: string;
  code: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: "critical" | "high" | "medium" | "low";
  linkedParameters: string[];
  linkedReports: string[];
  linkedFunctions: string[];
  linkedMatrices: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
  assignee: string;
  tasks: IncidentTask[];
  history: { date: string; action: string; user: string }[];
}

export const incidentStatusLabels: Record<IncidentStatus, string> = {
  new: "Новый",
  in_progress: "В работе",
  monitoring: "На контроле",
  resolved: "Решён",
};

export const incidents: Incident[] = [
  {
    id: "inc-001",
    code: "INC-4201",
    title: "Перегрев резервуара-12",
    description: "Температура резервуара-12 достигла 96.4°C при пороге 90°C. Активировано правило «Контроль перегрева». Клапан подачи закрыт автоматически. Требуется расследование причины роста температуры.",
    status: "in_progress",
    priority: "critical",
    linkedParameters: ["TI-R12-01.PV", "PI-R12-01.PV", "SI-R12-01.PV"],
    linkedReports: ["Анализ перегрева резервуара-12", "Корреляция температура–давление"],
    linkedFunctions: ["Контроль перегрева", "Контроль давления линии"],
    linkedMatrices: ["Аварийная защита резервуара"],
    createdAt: "2026-03-10 09:36",
    updatedAt: "2026-03-10 09:45",
    author: "Система",
    assignee: "Петров К.С.",
    tasks: [
      { id: "t1", title: "Проверить показания датчика TI-R12-01", assignee: "Петров К.С.", done: true },
      { id: "t2", title: "Определить причину роста температуры", assignee: "Петров К.С.", done: false },
      { id: "t3", title: "Оценить корреляцию с давлением линии", assignee: "Смирнов И.И.", done: false },
      { id: "t4", title: "Скорректировать порог правила при необходимости", assignee: "Андреева А.Н.", done: false },
    ],
    history: [
      { date: "2026-03-10 09:34", action: "Температура TI-R12-01 превысила порог 90°C", user: "Система" },
      { date: "2026-03-10 09:34", action: "Правило «Контроль перегрева» активировано", user: "Система" },
      { date: "2026-03-10 09:35", action: "Клапан подачи XV-R12-01 закрыт", user: "Система" },
      { date: "2026-03-10 09:36", action: "Инцидент создан автоматически", user: "Система" },
      { date: "2026-03-10 09:40", action: "Назначен Петров К.С.", user: "Андреева А.Н." },
      { date: "2026-03-10 09:45", action: "Датчик TI-R12-01 проверен — показания подтверждены", user: "Петров К.С." },
    ],
  },
  {
    id: "inc-002",
    code: "INC-4198",
    title: "Повышенное давление линии подачи",
    description: "Давление на линии подачи резервуара-12 достигло 12.3 бар при верхней границе 11 бар. Возможная связь с перегревом.",
    status: "new",
    priority: "high",
    linkedParameters: ["PI-R12-01.PV"],
    linkedReports: ["Корреляция температура–давление"],
    linkedFunctions: ["Контроль давления линии"],
    linkedMatrices: ["Аварийная защита резервуара"],
    createdAt: "2026-03-10 09:33",
    updatedAt: "2026-03-10 09:33",
    author: "Система",
    assignee: "",
    tasks: [],
    history: [
      { date: "2026-03-10 09:33", action: "Давление PI-R12-01 превысило 11 бар", user: "Система" },
      { date: "2026-03-10 09:33", action: "Инцидент создан автоматически", user: "Система" },
    ],
  },
  {
    id: "inc-003",
    code: "INC-4150",
    title: "Некорректная скорость насоса R12",
    description: "Скорость насоса SI-R12-01 кратковременно превысила 1500 RPM. Причина: скачок нагрузки при изменении режима подачи.",
    status: "resolved",
    priority: "medium",
    linkedParameters: ["SI-R12-01.PV"],
    linkedReports: ["Надёжность оборудования резервуара-12"],
    linkedFunctions: ["Мониторинг насоса"],
    linkedMatrices: ["Матрица управляющих механизмов"],
    createdAt: "2026-03-08 14:20",
    updatedAt: "2026-03-09 11:00",
    author: "Смирнов И.И.",
    assignee: "Смирнов И.И.",
    tasks: [
      { id: "t1", title: "Проверить настройки ЧРП насоса", assignee: "Смирнов И.И.", done: true },
      { id: "t2", title: "Скорректировать рампу разгона", assignee: "Смирнов И.И.", done: true },
    ],
    history: [
      { date: "2026-03-08 14:20", action: "Превышение скорости насоса зафиксировано", user: "Система" },
      { date: "2026-03-08 15:00", action: "Назначен Смирнов И.И.", user: "Петров К.С." },
      { date: "2026-03-09 11:00", action: "Рампа скорректирована, сигнал стабилен", user: "Смирнов И.И." },
    ],
  },
  {
    id: "inc-004",
    code: "INC-4120",
    title: "Низкий уровень топлива R12",
    description: "Уровень топлива в резервуаре-12 опустился до 55%. Плановое пополнение выполнено.",
    status: "resolved",
    priority: "low",
    linkedParameters: ["LI-R12-01.PV"],
    linkedReports: ["Надёжность оборудования резервуара-12"],
    linkedFunctions: ["Контроль уровня топлива"],
    linkedMatrices: ["Матрица параметров резервуара"],
    createdAt: "2026-03-05 08:00",
    updatedAt: "2026-03-05 16:00",
    author: "Андреева А.Н.",
    assignee: "Петров К.С.",
    tasks: [
      { id: "t1", title: "Организовать пополнение", assignee: "Петров К.С.", done: true },
    ],
    history: [
      { date: "2026-03-05 08:00", action: "Уровень топлива ниже 60%", user: "Система" },
      { date: "2026-03-05 16:00", action: "Резервуар пополнен до 85%", user: "Петров К.С." },
    ],
  },
];

// ─── Reports ───

export interface Report {
  id: string;
  name: string;
  description: string;
  linkedParameters: string[];
  linkedFunctions: string[];
  linkedMatrices: string[];
  lastGenerated: string;
  period: string;
}

export const reports: Report[] = [
  {
    id: "rep-001",
    name: "Анализ перегрева резервуара-12",
    description: "Детальный анализ инцидента перегрева: хронология роста температуры, срабатывание правил, корреляция с давлением и скоростью насоса.",
    linkedParameters: ["TI-R12-01.PV", "PI-R12-01.PV", "SI-R12-01.PV"],
    linkedFunctions: ["Контроль перегрева", "Контроль давления линии"],
    linkedMatrices: ["Аварийная защита резервуара"],
    lastGenerated: "2026-03-10 09:40",
    period: "10.03.2026 09:00 – 10:00",
  },
  {
    id: "rep-002",
    name: "Корреляция температура–давление",
    description: "Анализ взаимосвязи между температурой резервуара и давлением линии подачи. Коэффициент корреляции: 0.87.",
    linkedParameters: ["TI-R12-01.PV", "PI-R12-01.PV"],
    linkedFunctions: ["Контроль перегрева", "Контроль давления линии"],
    linkedMatrices: ["Аварийная защита резервуара", "Матрица параметров резервуара"],
    lastGenerated: "2026-03-10 09:42",
    period: "10.03.2026 09:00 – 10:00",
  },
  {
    id: "rep-003",
    name: "Надёжность оборудования резервуара-12",
    description: "Статистика отказов и инцидентов по оборудованию резервуара-12 за последний месяц.",
    linkedParameters: ["SI-R12-01.PV", "LI-R12-01.PV"],
    linkedFunctions: ["Мониторинг насоса", "Контроль уровня топлива"],
    linkedMatrices: ["Матрица управляющих механизмов"],
    lastGenerated: "2026-03-10 06:00",
    period: "10.02.2026 – 10.03.2026",
  },
  {
    id: "rep-004",
    name: "Тренд температуры за неделю",
    description: "Динамика температурных параметров резервуара-12 за последние 7 дней с визуализацией отклонений.",
    linkedParameters: ["TI-R12-01.PV", "TI-R12-02.PV"],
    linkedFunctions: ["Контроль перегрева"],
    linkedMatrices: ["Аварийная защита резервуара", "Матрица параметров резервуара"],
    lastGenerated: "2026-03-10 06:00",
    period: "03.03.2026 – 10.03.2026",
  },
];

// ─── Version Audit Log ───

export interface VersionAuditEntry {
  id: string;
  entityType: "function" | "matrix";
  entityName: string;
  fromVersion: number;
  toVersion: number;
  changeDescription: string;
  impactParameters: number;
  impactFunctions: number;
  impactReports: number;
  activatedBy: string;
  activatedAt: string;
}

export const versionAuditLog: VersionAuditEntry[] = [
  {
    id: "va-001",
    entityType: "function",
    entityName: "Контроль перегрева",
    fromVersion: 2,
    toVersion: 3,
    changeDescription: "Порог температуры повышен с 90°C до 95°C для снижения ложных срабатываний",
    impactParameters: 12,
    impactFunctions: 2,
    impactReports: 4,
    activatedBy: "Андреева А.Н.",
    activatedAt: "2026-03-10 10:15",
  },
  {
    id: "va-002",
    entityType: "matrix",
    entityName: "Аварийная защита резервуара",
    fromVersion: 3,
    toVersion: 4,
    changeDescription: "Добавлена связь: давление линии → аварийное перекрытие клапана",
    impactParameters: 8,
    impactFunctions: 3,
    impactReports: 2,
    activatedBy: "Петров К.С.",
    activatedAt: "2026-03-09 16:00",
  },
  {
    id: "va-003",
    entityType: "function",
    entityName: "Контроль давления линии",
    fromVersion: 4,
    toVersion: 5,
    changeDescription: "Верхний порог давления скорректирован: 11 бар → 12 бар",
    impactParameters: 6,
    impactFunctions: 1,
    impactReports: 3,
    activatedBy: "Смирнов И.И.",
    activatedAt: "2026-03-08 14:00",
  },
  {
    id: "va-004",
    entityType: "function",
    entityName: "Мониторинг насоса",
    fromVersion: 1,
    toVersion: 2,
    changeDescription: "Добавлена проверка рампы разгона: скорость нарастания < 200 RPM/с",
    impactParameters: 4,
    impactFunctions: 1,
    impactReports: 2,
    activatedBy: "Смирнов И.И.",
    activatedAt: "2026-03-07 11:30",
  },
  {
    id: "va-005",
    entityType: "matrix",
    entityName: "Матрица управляющих механизмов",
    fromVersion: 4,
    toVersion: 5,
    changeDescription: "Обновлена связь: насос SI-R12-01 → клапан XV-R12-01",
    impactParameters: 5,
    impactFunctions: 2,
    impactReports: 1,
    activatedBy: "Петров К.С.",
    activatedAt: "2026-03-06 09:00",
  },
  {
    id: "va-006",
    entityType: "matrix",
    entityName: "Матрица параметров резервуара",
    fromVersion: 5,
    toVersion: 6,
    changeDescription: "Обновлены допустимые диапазоны температуры и уровня для резервуара-12",
    impactParameters: 10,
    impactFunctions: 3,
    impactReports: 4,
    activatedBy: "Андреева А.Н.",
    activatedAt: "2026-03-05 08:45",
  },
];
