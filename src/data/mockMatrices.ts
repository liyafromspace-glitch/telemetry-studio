import { type RuleStatus } from "./mockRules";

export interface MatrixRow {
  id: string;
  source: string;
  target: string;
  dependencyType: string;
  deviation: number;
  unit: string;
  status: "ok" | "warning" | "error";
  statusMessage?: string;
}

export interface Matrix {
  id: string;
  name: string;
  matrixType: string;
  status: RuleStatus;
  version: number;
  author: string;
  lastCheck: string;
  reportsUsed: number;
  parametersLinked: number;
  functionsLinked: number;
  errorCount: number;
  warningCount: number;
  createdAt: string;
  description: string;
  rows: MatrixRow[];
  assets: AssetNode[];
}

export interface AssetNode {
  id: string;
  label: string;
  children?: AssetNode[];
}

export const matrices: Matrix[] = [
  {
    id: "matrix-001",
    name: "Аварийная защита резервуара",
    matrixType: "Защита",
    status: "active",
    version: 4,
    author: "Андреева А.Н.",
    lastCheck: "2026-03-10 09:36",
    reportsUsed: 4,
    parametersLinked: 12,
    functionsLinked: 3,
    errorCount: 0,
    warningCount: 1,
    createdAt: "2025-06-15",
    description: "Матрица определяет логику аварийной защиты резервуара-12: связи между температурой, давлением и управляющими клапанами.",
    rows: [
      { id: "r1", source: "TI-R12-01 (Температура)", target: "XV-R12-01 (Клапан подачи)", dependencyType: "Аварийное перекрытие", deviation: 6.4, unit: "°C", status: "error", statusMessage: "Превышен порог 90°C → клапан закрыт" },
      { id: "r2", source: "PI-R12-01 (Давление)", target: "XV-R12-01 (Клапан подачи)", dependencyType: "Аварийное перекрытие", deviation: 1.3, unit: "бар", status: "warning", statusMessage: "Давление приближается к порогу" },
      { id: "r3", source: "TI-R12-01 (Температура)", target: "PI-R12-01 (Давление)", dependencyType: "Корреляция", deviation: 0.87, unit: "коэфф.", status: "warning", statusMessage: "Высокая корреляция: рост температуры → рост давления" },
      { id: "r4", source: "SI-R12-01 (Насос)", target: "TI-R12-01 (Температура)", dependencyType: "Компенсация", deviation: 2.1, unit: "°C", status: "ok" },
    ],
    assets: [
      {
        id: "a0", label: "Северное месторождение", children: [
          {
            id: "a1", label: "Резервуар-12", children: [
              { id: "a1-1", label: "TI-R12-01 (Температура основной)" },
              { id: "a1-2", label: "TI-R12-02 (Температура резервный)" },
              { id: "a1-3", label: "PI-R12-01 (Давление линии)" },
              { id: "a1-4", label: "SI-R12-01 (Скорость насоса)" },
              { id: "a1-5", label: "XV-R12-01 (Клапан подачи)" },
              { id: "a1-6", label: "LI-R12-01 (Уровень топлива)" },
            ]
          },
        ]
      },
    ],
  },
  {
    id: "matrix-002",
    name: "Матрица параметров резервуара",
    matrixType: "Параметры",
    status: "active",
    version: 6,
    author: "Петров К.С.",
    lastCheck: "2026-03-10 06:00",
    reportsUsed: 3,
    parametersLinked: 10,
    functionsLinked: 4,
    errorCount: 0,
    warningCount: 0,
    createdAt: "2025-04-12",
    description: "Матрица допустимых диапазонов параметров для резервуара-12.",
    rows: [
      { id: "r1", source: "Температура", target: "Диапазон 20–90°C", dependencyType: "Допустимый диапазон", deviation: 0, unit: "°C", status: "ok" },
      { id: "r2", source: "Давление", target: "Диапазон 2–11 бар", dependencyType: "Допустимый диапазон", deviation: 0, unit: "бар", status: "ok" },
      { id: "r3", source: "Скорость насоса", target: "Диапазон 800–1500 RPM", dependencyType: "Допустимый диапазон", deviation: 0, unit: "RPM", status: "ok" },
      { id: "r4", source: "Уровень топлива", target: "Диапазон 20–95%", dependencyType: "Допустимый диапазон", deviation: 0, unit: "%", status: "ok" },
    ],
    assets: [
      {
        id: "a1", label: "Резервуар-12", children: [
          { id: "a1-1", label: "Температура" },
          { id: "a1-2", label: "Давление" },
          { id: "a1-3", label: "Скорость насоса" },
          { id: "a1-4", label: "Уровень топлива" },
        ]
      },
    ],
  },
  {
    id: "matrix-003",
    name: "Матрица управляющих механизмов",
    matrixType: "Управление",
    status: "active",
    version: 5,
    author: "Смирнов И.И.",
    lastCheck: "2026-03-10 09:35",
    reportsUsed: 2,
    parametersLinked: 5,
    functionsLinked: 3,
    errorCount: 0,
    warningCount: 1,
    createdAt: "2025-07-20",
    description: "Матрица связей между управляющими механизмами и контролируемыми параметрами резервуара-12.",
    rows: [
      { id: "r1", source: "Клапан XV-R12-01", target: "TI-R12-01 (Температура)", dependencyType: "Управление", deviation: 0, unit: "", status: "ok" },
      { id: "r2", source: "Насос SI-R12-01", target: "PI-R12-01 (Давление)", dependencyType: "Обратная связь", deviation: 1.2, unit: "бар", status: "warning", statusMessage: "Задержка отклика 800мс" },
      { id: "r3", source: "Насос SI-R12-01", target: "LI-R12-01 (Уровень)", dependencyType: "Обратная связь", deviation: 0.5, unit: "%", status: "ok" },
    ],
    assets: [
      {
        id: "a1", label: "Насосная станция R12", children: [
          { id: "a1-1", label: "Насос SI-R12-01" },
        ]
      },
      {
        id: "a2", label: "Узел регулирования R12", children: [
          { id: "a2-1", label: "Клапан XV-R12-01" },
        ]
      },
    ],
  },
  {
    id: "matrix-004",
    name: "Матрица корреляций сигналов",
    matrixType: "Корреляции",
    status: "draft",
    version: 1,
    author: "Андреева А.Н.",
    lastCheck: "2026-03-10 09:40",
    reportsUsed: 1,
    parametersLinked: 8,
    functionsLinked: 2,
    errorCount: 0,
    warningCount: 2,
    createdAt: "2026-03-10",
    description: "Матрица кросс-корреляций между сигналами резервуара-12. Используется для выявления причинно-следственных связей.",
    rows: [
      { id: "r1", source: "Температура резервуара", target: "Давление линии", dependencyType: "Корреляция", deviation: 0.87, unit: "коэфф.", status: "warning", statusMessage: "Высокая положительная корреляция" },
      { id: "r2", source: "Температура резервуара", target: "Скорость насоса", dependencyType: "Корреляция", deviation: 0.42, unit: "коэфф.", status: "ok" },
      { id: "r3", source: "Давление линии", target: "Скорость насоса", dependencyType: "Корреляция", deviation: 0.65, unit: "коэфф.", status: "ok" },
      { id: "r4", source: "Температура резервуара", target: "Уровень топлива", dependencyType: "Корреляция", deviation: -0.31, unit: "коэфф.", status: "ok" },
    ],
    assets: [
      {
        id: "a1", label: "Резервуар-12", children: [
          { id: "a1-1", label: "TI-R12-01 (Температура)" },
          { id: "a1-2", label: "PI-R12-01 (Давление)" },
          { id: "a1-3", label: "SI-R12-01 (Скорость насоса)" },
          { id: "a1-4", label: "LI-R12-01 (Уровень топлива)" },
        ]
      },
    ],
  },
];
