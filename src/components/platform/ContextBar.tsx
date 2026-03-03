import { type PlatformContext } from "@/data/mockPlatform";
import { MapPin, Database, Cpu, Calendar } from "lucide-react";

interface ContextBarProps {
  context: PlatformContext;
}

export function ContextBar({ context }: ContextBarProps) {
  const isProduction = context.environment.includes("Северное");

  return (
    <div className="h-7 flex items-center gap-4 px-3 border-b border-border bg-card text-[10px] text-muted-foreground">
      <span className={isProduction ? "env-badge-production" : "env-badge-test"}>
        {isProduction ? "ПРОДАКШН" : "ТЕСТ"}
      </span>
      <span className="flex items-center gap-1">
        <MapPin className="w-2.5 h-2.5" />
        <span className="text-foreground font-medium">{context.environment}</span>
      </span>
      <span className="flex items-center gap-1">
        <Database className="w-2.5 h-2.5" />
        {context.reservoir}
      </span>
      <span className="flex items-center gap-1">
        <Cpu className="w-2.5 h-2.5" />
        {context.measurementSystem}
      </span>
      <span className="flex items-center gap-1">
        <Calendar className="w-2.5 h-2.5" />
        {context.period}
      </span>
    </div>
  );
}
