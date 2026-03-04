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
    name: "Матрица зависимостей СИ",
    matrixType: "Зависимости",
    status: "active",
    version: 2,
    author: "Андреев А.Н.",
    lastCheck: "2024-02-20",
    reportsUsed: 5,
    parametersLinked: 12,
    functionsLinked: 3,
    errorCount: 0,
    warningCount: 2,
    createdAt: "2023-10-05",
    description: "Матрица определяет допустимые зависимости между датчиками в пределах выбранной области действия.",
    rows: [
      { id: "r1", source: "Датчик температуры #1", target: "Датчик температуры #2", dependencyType: "Корреляция", deviation: 2.5, unit: "°C", status: "ok" },
      { id: "r2", source: "Датчик температуры #1", target: "Датчик давления #1", dependencyType: "Компенсация", deviation: 0.8, unit: "бар", status: "warning", statusMessage: "Несоответствие единиц измерения" },
      { id: "r3", source: "Датчик давления #1", target: "Датчик давления #2", dependencyType: "Резервирование", deviation: 1.2, unit: "бар", status: "ok" },
      { id: "r4", source: "Датчик уровня #1", target: "Датчик плотности #1", dependencyType: "Расчётная", deviation: 5.0, unit: "кг/м³", status: "warning", statusMessage: "Превышен диапазон допустимого отклонения" },
    ],
    assets: [
      {
        id: "a0", label: "Северное месторождение", children: [
          {
            id: "a1", label: "Резервуар 1", children: [
              { id: "a1-1", label: "Датчик температуры #1" },
              { id: "a1-2", label: "Датчик температуры #2" },
              { id: "a1-3", label: "Датчик давления #1" },
              { id: "a1-4", label: "Датчик уровня #1" },
            ]
          },
          {
            id: "a2", label: "Резервуар 2", children: [
              { id: "a2-1", label: "Датчик давления #2" },
              { id: "a2-2", label: "Датчик плотности #1" },
            ]
          },
        ]
      },
    ],
  },
  {
    id: "matrix-002",
    name: "Матрица соответствия параметров",
    matrixType: "Соответствие параметров",
    status: "active",
    version: 6,
    author: "Петров К.С.",
    lastCheck: "2024-02-17 14:30",
    reportsUsed: 18,
    parametersLinked: 95,
    functionsLinked: 6,
    errorCount: 0,
    warningCount: 0,
    createdAt: "2023-08-12",
    description: "Матрица связывает параметры системы измерения с нормативными значениями и эталонами.",
    rows: [
      { id: "r1", source: "Температура входа", target: "Эталон T-001", dependencyType: "Калибровка", deviation: 0.3, unit: "°C", status: "ok" },
      { id: "r2", source: "Давление входа", target: "Эталон P-001", dependencyType: "Калибровка", deviation: 0.1, unit: "бар", status: "ok" },
      { id: "r3", source: "Плотность", target: "Эталон D-001", dependencyType: "Калибровка", deviation: 0.5, unit: "кг/м³", status: "ok" },
    ],
    assets: [
      {
        id: "a1", label: "Линия 1", children: [
          { id: "a1-1", label: "Температура входа" },
          { id: "a1-2", label: "Давление входа" },
          { id: "a1-3", label: "Плотность" },
        ]
      },
    ],
  },
  {
    id: "matrix-003",
    name: "Матрица плановых и фактических значений",
    matrixType: "План/факт",
    status: "draft",
    version: 2,
    author: "Смирнов И.И.",
    lastCheck: "2024-02-16 09:00",
    reportsUsed: 0,
    parametersLinked: 43,
    functionsLinked: 2,
    errorCount: 0,
    warningCount: 1,
    createdAt: "2024-01-15",
    description: "Матрица сопоставляет плановые значения параметров с фактическими показаниями телеметрии.",
    rows: [
      { id: "r1", source: "Температура план", target: "Температура факт", dependencyType: "Сопоставление", deviation: 0, unit: "°C", status: "ok" },
      { id: "r2", source: "Давление план", target: "Давление факт", dependencyType: "Сопоставление", deviation: 0, unit: "бар", status: "warning", statusMessage: "Значение не подтверждено" },
      { id: "r3", source: "Уровень план", target: "Уровень факт", dependencyType: "Сопоставление", deviation: 0, unit: "м", status: "ok" },
    ],
    assets: [
      {
        id: "a1", label: "Плановые показатели", children: [
          { id: "a1-1", label: "Температура план" },
          { id: "a1-2", label: "Давление план" },
          { id: "a1-3", label: "Уровень план" },
        ]
      },
    ],
  },
  {
    id: "matrix-004",
    name: "Матрица диапазонов давления",
    matrixType: "Диапазоны",
    status: "error",
    version: 3,
    author: "Андреева А.Н.",
    lastCheck: "2024-02-18 08:30",
    reportsUsed: 8,
    parametersLinked: 34,
    functionsLinked: 3,
    errorCount: 2,
    warningCount: 4,
    createdAt: "2023-12-01",
    description: "Матрица определяет допустимые диапазоны давления для каждого участка трубопровода.",
    rows: [
      { id: "r1", source: "Участок А", target: "Манометр #1", dependencyType: "Диапазон", deviation: 10, unit: "бар", status: "ok" },
      { id: "r2", source: "Участок Б", target: "Манометр #2", dependencyType: "Диапазон", deviation: 15, unit: "бар", status: "error", statusMessage: "Циклическая зависимость" },
      { id: "r3", source: "Участок В", target: "Манометр #3", dependencyType: "Диапазон", deviation: 8, unit: "бар", status: "error", statusMessage: "Выход за предельные значения" },
      { id: "r4", source: "Участок Г", target: "Манометр #4", dependencyType: "Диапазон", deviation: 12, unit: "бар", status: "warning", statusMessage: "Приближение к границе диапазона" },
    ],
    assets: [
      {
        id: "a1", label: "Трубопровод 1", children: [
          { id: "a1-1", label: "Участок А" },
          { id: "a1-2", label: "Участок Б" },
        ]
      },
      {
        id: "a2", label: "Трубопровод 2", children: [
          { id: "a2-1", label: "Участок В" },
          { id: "a2-2", label: "Участок Г" },
        ]
      },
    ],
  },
  {
    id: "matrix-005",
    name: "Матрица показателей плотности",
    matrixType: "Показатели плотности",
    status: "scheduled",
    version: 1,
    author: "Петров К.С.",
    lastCheck: "2024-02-15 16:00",
    reportsUsed: 0,
    parametersLinked: 28,
    functionsLinked: 2,
    errorCount: 0,
    warningCount: 0,
    createdAt: "2024-02-10",
    description: "Матрица связывает показатели плотности нефтепродуктов с температурными коррекциями.",
    rows: [
      { id: "r1", source: "Плотномер #1", target: "Термокомпенсатор #1", dependencyType: "Коррекция", deviation: 0.2, unit: "кг/м³", status: "ok" },
      { id: "r2", source: "Плотномер #2", target: "Термокомпенсатор #2", dependencyType: "Коррекция", deviation: 0.3, unit: "кг/м³", status: "ok" },
    ],
    assets: [
      {
        id: "a1", label: "Узел учёта", children: [
          { id: "a1-1", label: "Плотномер #1" },
          { id: "a1-2", label: "Плотномер #2" },
          { id: "a1-3", label: "Термокомпенсатор #1" },
          { id: "a1-4", label: "Термокомпенсатор #2" },
        ]
      },
    ],
  },
  {
    id: "matrix-006",
    name: "Матрица управляющих механизмов",
    matrixType: "Управляющие механизмы",
    status: "active",
    version: 5,
    author: "Смирнов И.И.",
    lastCheck: "2024-02-18 12:00",
    reportsUsed: 14,
    parametersLinked: 52,
    functionsLinked: 5,
    errorCount: 0,
    warningCount: 2,
    createdAt: "2023-07-20",
    description: "Матрица определяет связи между управляющими механизмами и контролируемыми параметрами.",
    rows: [
      { id: "r1", source: "Клапан КР-01", target: "Расходомер #1", dependencyType: "Управление", deviation: 1.5, unit: "м³/ч", status: "ok" },
      { id: "r2", source: "Клапан КР-02", target: "Расходомер #2", dependencyType: "Управление", deviation: 2.0, unit: "м³/ч", status: "warning", statusMessage: "Задержка отклика > 500мс" },
      { id: "r3", source: "Насос Н-01", target: "Манометр #5", dependencyType: "Обратная связь", deviation: 3.0, unit: "бар", status: "ok" },
      { id: "r4", source: "Насос Н-02", target: "Расходомер #3", dependencyType: "Обратная связь", deviation: 1.8, unit: "м³/ч", status: "warning", statusMessage: "Нестабильный сигнал" },
    ],
    assets: [
      {
        id: "a1", label: "Насосная станция", children: [
          { id: "a1-1", label: "Насос Н-01" },
          { id: "a1-2", label: "Насос Н-02" },
        ]
      },
      {
        id: "a2", label: "Узел регулирования", children: [
          { id: "a2-1", label: "Клапан КР-01" },
          { id: "a2-2", label: "Клапан КР-02" },
        ]
      },
    ],
  },
];
