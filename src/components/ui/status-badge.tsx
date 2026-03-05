import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Vercel-style status badge — bordered pill with colored dot + neutral text.
 * Clean, minimal, consistent across the entire system.
 */
const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium leading-none whitespace-nowrap select-none border",
  {
    variants: {
      variant: {
        success: "border-success/25 bg-success/6 text-success",
        warning: "border-warning/25 bg-warning/6 text-warning",
        error: "border-destructive/25 bg-destructive/6 text-destructive",
        info: "border-primary/25 bg-primary/6 text-primary",
        idle: "border-border bg-muted/50 text-muted-foreground",
        active: "border-success/25 bg-success/6 text-success",
        draft: "border-border bg-muted/50 text-muted-foreground",
        scheduled: "border-primary/25 bg-primary/6 text-primary",
        neutral: "border-border bg-foreground/4 text-foreground/70",
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

const dotColorMap: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  info: "bg-primary",
  active: "bg-success",
  scheduled: "bg-primary",
  neutral: "bg-foreground/40",
  idle: "bg-muted-foreground/60",
  draft: "bg-muted-foreground/60",
};

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
            dotColorMap[variant || "idle"]
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
    success: { bg: "hsl(142, 71%, 45%)", border: "hsl(142, 71%, 45%)", text: "hsl(142, 71%, 75%)" },
    warning: { bg: "hsl(38, 92%, 50%)", border: "hsl(38, 92%, 50%)", text: "hsl(38, 92%, 80%)" },
    error: { bg: "hsl(0, 84%, 60%)", border: "hsl(0, 84%, 60%)", text: "hsl(0, 84%, 80%)" },
  };
  const labels = { success: "OK", warning: "Warning", error: "Error" };
  const c = colors[status];
  const displayLabel = label || labels[status];
  const w = 48;
  const h = 18;

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={9} fill="transparent" stroke={c.border} strokeOpacity={0.25} strokeWidth={1} />
      <rect x={x} y={y} width={w} height={h} rx={9} fill={c.bg} opacity={0.06} />
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
