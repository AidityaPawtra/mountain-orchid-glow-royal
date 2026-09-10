import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "danger" | "success" | "warning";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    danger: "bg-danger-soft text-danger",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className={cn("flex size-11 items-center justify-center rounded-xl", tones[tone])}>
          <Icon className="size-5" />
        </span>
      </div>
    </Card>
  );
}
