import { Rule } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Shield } from "lucide-react";

interface ActivationModalProps {
  rule: Rule;
  onClose: () => void;
  onActivate: () => void;
}

export function ActivationModal({ rule, onClose, onActivate }: ActivationModalProps) {
  const canActivate = rule.errorCount === 0;

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 animate-fade-in">
      <div className="ide-panel rounded-sm w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Активация правила</span>
        </div>

        <div className="p-4 space-y-4">
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
              <span>Активных отчётов</span>
              <span className="font-mono">{rule.reportsUsed}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Версия изменится</span>
              <span className="font-mono">v{rule.version} → v{rule.version + 1}</span>
            </div>
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
