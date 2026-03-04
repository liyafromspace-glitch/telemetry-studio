import { type PlatformContext } from "@/data/mockPlatform";
import { MapPin, Database, Calendar } from "lucide-react";

interface ContextBarProps {
  context: PlatformContext;
}

export function ContextBar({ context }: ContextBarProps) {
  const isProduction = context.environment.includes("Северное");

  return (
    <div className="flex items-center gap-3 text-[11px] text-muted-foreground glass-controls rounded-md px-2.5 py-1">
      <span className={isProduction ? "env-badge-production" : "env-badge-test"}>
        {isProduction ? "ПРОДАКШН" : "ТЕСТ"}
      </span>
      <span className="flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        <span className="text-foreground/80 font-medium">{context.environment}</span>
      </span>
      <span className="flex items-center gap-1">
        <Database className="w-3 h-3" />
        {context.reservoir}
      </span>
      <span className="flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {context.period}
      </span>
    </div>
  );
}
