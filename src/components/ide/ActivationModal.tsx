import { Rule } from "@/data/mockRules";
import { CheckCircle, AlertTriangle, XCircle, Shield, GitBranch, TrendingUp } from "lucide-react";

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

const mockDiff = { before: "Температура > 90", after: "Температура > 95" };

const riskAnalysis = {
  affectedSignals: 18,
  affectedObjects: 4,
  potentialIncidents: "+12%",
  riskLevel: "medium" as "low" | "medium" | "high",
  affectedNodes: ["TI03025.PV", "PT02012.PV", "HT06002.PV", "FT01007.PV"],
};

export function ActivationModal({ rule, onClose, onActivate }: ActivationModalProps) {
  const canActivate = rule.errorCount === 0;
  const currentStageIndex = rule.status === "draft" ? 0 : rule.status === "error" ? 1 : 3;

  return (
    <div className="fixed inset-0 bg-background/85 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="vercel-card w-full max-w-2xl shadow-2xl animate-scale-in">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border">
          <Shield className="w-4 h-4 text-foreground" />
          <span className="text-sm font-medium text-foreground">Deploy Rule</span>
        </div>

        <div className="p-5 space-y-5">
          {/* Staged deployment pipeline */}
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2.5">Deployment Pipeline</div>
            <div className="flex items-center gap-1 w-full overflow-x-auto pb-1">
              {stages.map((stage, i) => (
                <div key={stage.id} className="flex items-center gap-1 shrink-0">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap ${
                      i < currentStageIndex
                        ? "status-badge-success"
                        : i === currentStageIndex
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < currentStageIndex && <CheckCircle className="w-2.5 h-2.5 flex-shrink-0" />}
                    <span>{stage.label}</span>
                  </div>
                  {i < stages.length - 1 && <div className="w-5 h-px bg-border" />}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-2.5">
              {stages.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-all"
                  style={{
                    background:
                      i < currentStageIndex
                        ? "hsl(152, 60%, 42%)"
                        : i === currentStageIndex
                        ? "hsl(160, 60%, 45%)"
                        : "hsl(0, 0%, 12%)",
                    opacity: i > currentStageIndex ? 0.3 : 1,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Validation results */}
          <div className="space-y-2 text-xs font-mono">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Validation passed:</div>
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
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2.5">Change Diff:</div>
            <div className="bg-background rounded-xl border border-border p-3 text-xs font-mono space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-destructive bg-destructive/8 px-2.5 py-1 rounded-lg line-through">{mockDiff.before}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success bg-success/8 px-2.5 py-1 rounded-lg">{mockDiff.after}</span>
              </div>
            </div>
          </div>

          {/* Activation Risk Simulator */}
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" /> Анализ риска
            </div>
            <div
              className={`vercel-card p-4 text-xs space-y-2.5 border-l-2 ${
                riskAnalysis.riskLevel === "high"
                  ? "border-l-destructive"
                  : riskAnalysis.riskLevel === "medium"
                  ? "border-l-warning"
                  : "border-l-success"
              }`}
            >
              <div className="flex justify-between text-foreground">
                <span>Затронуто сигналов</span>
                <span className="font-mono font-medium">{riskAnalysis.affectedSignals}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Затронуто объектов</span>
                <span className="font-mono font-medium">{riskAnalysis.affectedObjects}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Потенциал инцидентов</span>
                <span
                  className={`font-mono font-medium ${
                    riskAnalysis.riskLevel === "high"
                      ? "text-destructive"
                      : riskAnalysis.riskLevel === "medium"
                      ? "text-warning"
                      : "text-success"
                  }`}
                >
                  {riskAnalysis.potentialIncidents}
                </span>
              </div>
              <RiskHeatBar level={riskAnalysis.riskLevel} />
              <div className="flex flex-wrap gap-1.5 mt-1">
                {riskAnalysis.affectedNodes.map((n) => (
                  <span key={n} className="px-2 py-0.5 text-[9px] font-mono bg-muted rounded-lg text-muted-foreground">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Impact */}
          <div className="vercel-card p-4 text-xs space-y-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Будет затронуто:</div>
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
                <GitBranch className="w-3 h-3 text-muted-foreground" />
                v{rule.version} → v{rule.version + 1}
              </span>
            </div>
          </div>

          {!canActivate && (
            <div className="text-xs text-destructive bg-destructive/8 p-3 rounded-xl border border-destructive/15">
              Невозможно активировать: имеются критические ошибки
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-lg">
            Отмена
          </button>
          <button
            onClick={() => { onActivate(); onClose(); }}
            disabled={!canActivate}
            className="btn-primary rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Deploy
          </button>
        </div>
      </div>
    </div>
  );
}

function RiskHeatBar({ level }: { level: "low" | "medium" | "high" }) {
  const segments = 5;
  const active = level === "low" ? 1 : level === "medium" ? 3 : 5;
  return (
    <div className="flex gap-1">
      {Array.from({ length: segments }, (_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full transition-all"
          style={{
            background:
              i < active
                ? i < 2
                  ? "hsl(152, 60%, 42%)"
                  : i < 4
                  ? "hsl(38, 80%, 50%)"
                  : "hsl(0, 72%, 51%)"
                : "hsl(0, 0%, 12%)",
            opacity: i < active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
