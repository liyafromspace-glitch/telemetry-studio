import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-[10px] font-medium leading-none whitespace-nowrap select-none",
  {
    variants: {
      variant: {
        success: "bg-success/12 text-success",
        warning: "bg-warning/12 text-warning",
        error: "bg-destructive/12 text-destructive",
        info: "bg-primary/12 text-primary",
        idle: "bg-muted text-muted-foreground",
        active: "bg-success/12 text-success",
        draft: "bg-muted text-muted-foreground",
        scheduled: "bg-primary/12 text-primary",
        neutral: "bg-foreground/8 text-foreground",
      },
      size: {
        xs: "px-1.5 py-0.5 text-[9px]",
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "idle",
      size: "sm",
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean;
}

export function StatusBadge({
  className,
  variant,
  size,
  dot = true,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            variant === "success" || variant === "active" ? "bg-success" :
            variant === "warning" ? "bg-warning" :
            variant === "error" ? "bg-destructive" :
            variant === "info" || variant === "scheduled" ? "bg-primary" :
            variant === "neutral" ? "bg-foreground/50" :
            "bg-muted-foreground"
          )}
        />
      )}
      {children}
    </span>
  );
}

// SVG version for use inside <svg> elements (graphs)
export function StatusBadgeSvg({
  x,
  y,
  status,
  label,
}: {
  x: number;
  y: number;
  status: "success" | "warning" | "error";
  label?: string;
}) {
  const colors = {
    success: { bg: "hsl(142, 71%, 45%)", text: "hsl(142, 71%, 90%)" },
    warning: { bg: "hsl(38, 92%, 50%)", text: "hsl(38, 92%, 90%)" },
    error: { bg: "hsl(0, 84%, 60%)", text: "hsl(0, 84%, 90%)" },
  };
  const labels = { success: "OK", warning: "Warning", error: "Error" };
  const c = colors[status];
  const displayLabel = label || labels[status];
  const w = 48;
  const h = 18;

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={9} fill={c.bg} opacity={0.12} />
      <circle cx={x + 10} cy={y + h / 2} r={2.5} fill={c.bg} opacity={0.9} />
      <text
        x={x + 17}
        y={y + h / 2 + 3}
        fill={c.text}
        fontSize="8"
        fontWeight="500"
        fontFamily="Inter, sans-serif"
      >
        {displayLabel}
      </text>
    </g>
  );
}

// Helper to map RuleStatus to variant
export function ruleStatusToVariant(status: string) {
  switch (status) {
    case "active": return "active" as const;
    case "error": return "error" as const;
    case "draft": return "draft" as const;
    case "scheduled": return "scheduled" as const;
    case "critical": return "error" as const;
    case "warning": return "warning" as const;
    case "normal": return "success" as const;
    case "success": return "success" as const;
    case "resolved": return "success" as const;
    case "in_progress": return "info" as const;
    case "monitoring": return "warning" as const;
    case "new": return "error" as const;
    default: return "idle" as const;
  }
}
