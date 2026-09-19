import { cn } from "@/lib/utils";

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "A";
  return (
    <span
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary",
        className,
      )}
    >
      {initial}
    </span>
  );
}
