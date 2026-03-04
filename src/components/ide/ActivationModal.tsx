import { Rule } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Shield, ArrowRight, GitBranch } from "lucide-react";

interface ActivationModalProps {
  rule: Rule;
  onClose: () => void;
  onActivate: () => void;
}

const stages = [
  { id: "draft", label: "Черновик" },
  { id: "simulation", label: "Симуляция" },
  { id: "verified", label: "Проверено" },
  { id: "test", label: "Тестовая среда" },
  { id: "production", label: "Продакшн" },
];

// Mock diff
const mockDiff = {
  before: "Температура > 90",
  after: "Температура > 95",
};

export function ActivationModal({ rule, onClose, onActivate }: ActivationModalProps) {
  const canActivate = rule.errorCount === 0;
  // Simulate current stage based on rule status
  const currentStageIndex = rule.status === "draft" ? 0 : rule.status === "error" ? 1 : 3;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="ide-panel rounded-sm w-full max-w-lg shadow-2xl animate-scale-in">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Активация правила</span>
        </div>

        <div className="p-4 space-y-4">
          {/* Staged deployment pipeline */}
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              Этап развёртывания
            </div>
            <div className="flex items-center gap-0.5">
              {stages.map((stage, i) => (
                <div key={stage.id} className="flex items-center gap-0.5">
                  <div className={`px-2 py-1 rounded-sm text-[10px] font-medium border ${
                    i < currentStageIndex ? "border-success/50 bg-success/10 text-success" :
                    i === currentStageIndex ? "border-primary bg-primary/10 text-primary" :
                    "border-border bg-secondary text-muted-foreground"
                  }`}>
                    {i < currentStageIndex && <CheckCircle className="w-2.5 h-2.5 inline mr-0.5" />}
                    {stage.label}
                  </div>
                  {i < stages.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Validation results */}
          <div className="space-y-1.5 text-xs font-mono">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              Проверка выполнена:
            </div>
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-3 h-3" /> Синтаксис корректен
            </div>
            {rule.errorCount > 0 ? (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="w-3 h-3" /> {rule.errorCount} критических ошибок
              </div>
            ) : (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="w-3 h-3" /> Нет критических ошибок
              </div>
            )}
            {rule.warningCount > 0 && (
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-3 h-3" /> {rule.warningCount} предупреждений
              </div>
            )}
          </div>

          {/* Change diff */}
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              Изменения:
            </div>
            <div className="ide-panel rounded-sm p-2 text-xs font-mono space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-sm line-through">{mockDiff.before}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success bg-success/10 px-1.5 py-0.5 rounded-sm">{mockDiff.after}</span>
              </div>
            </div>
          </div>

          {/* Impact */}
          <div className="ide-panel rounded-sm p-3 text-xs space-y-1.5">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              Будет затронуто:
            </div>
            <div className="flex justify-between text-foreground">
              <span>Параметров</span>
              <span className="font-mono">{rule.parametersLinked}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Функций</span>
              <span className="font-mono">2</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Активных отчётов</span>
              <span className="font-mono">{rule.reportsUsed}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Версия изменится</span>
              <span className="font-mono flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-primary" />
                v{rule.version} → v{rule.version + 1}
              </span>
            </div>
          </div>

          {/* Mini dependency preview */}
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              Граф зависимостей:
            </div>
            <svg width="100%" height="40" viewBox="0 0 400 40" className="rounded-sm bg-background p-1">
              <circle cx={40} cy={20} r={8} fill="hsl(127, 50%, 49%, 0.15)" stroke="hsl(127, 50%, 49%)" strokeWidth={1} />
              <text x={40} y={23} textAnchor="middle" fill="hsl(220, 10%, 85%)" fontSize="6">SIG</text>
              <line x1={50} y1={20} x2={140} y2={20} stroke="hsl(228, 8%, 30%)" strokeWidth={1} strokeDasharray="3 2" />

              <polygon points="150,8 170,20 150,32 130,20" fill="hsl(212, 92%, 58%, 0.15)" stroke="hsl(212, 92%, 58%)" strokeWidth={1} />
              <text x={150} y={23} textAnchor="middle" fill="hsl(220, 10%, 85%)" fontSize="6">FN</text>
              <line x1={170} y1={20} x2={230} y2={12} stroke="hsl(228, 8%, 30%)" strokeWidth={1} strokeDasharray="3 2" />
              <line x1={170} y1={20} x2={230} y2={28} stroke="hsl(228, 8%, 30%)" strokeWidth={1} strokeDasharray="3 2" />

              <rect x={230} y={4} width={40} height={16} rx={8} fill="hsl(127, 50%, 49%, 0.1)" stroke="hsl(127, 50%, 49%)" strokeWidth={1} />
              <text x={250} y={15} textAnchor="middle" fill="hsl(220, 10%, 85%)" fontSize="5">Отч.1</text>
              <rect x={230} y={22} width={40} height={16} rx={8} fill="hsl(39, 74%, 48%, 0.1)" stroke="hsl(39, 74%, 48%)" strokeWidth={1} />
              <text x={250} y={33} textAnchor="middle" fill="hsl(220, 10%, 85%)" fontSize="5">Отч.2</text>
            </svg>
          </div>

          {!canActivate && (
            <div className="text-xs text-destructive bg-destructive/10 p-2 rounded-sm">
              Невозможно активировать: имеются критические ошибки
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={() => { onActivate(); onClose(); }}
            disabled={!canActivate}
            className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Активировать
          </button>
        </div>
      </div>
    </div>
  );
}
