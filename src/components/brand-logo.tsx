import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-9 shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-primary" />
      <path fill="#F5F8FC" d="M16 6.5l10 8H6z" />
      <rect x="9" y="14" width="14" height="11" fill="#F5F8FC" />
      <rect x="13.5" y="18" width="5" height="7" fill="#0B63CE" />
    </svg>
  );
}

export function BrandLogo({
  collapsed = false,
  light = false,
}: {
  collapsed?: boolean;
  light?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
      <BrandMark className={light ? "text-primary" : "text-primary"} />
      {!collapsed ? (
        <div className="min-w-0">
          <p className={cn("truncate text-sm font-semibold leading-tight", light ? "text-navy" : "text-sidebar-fg")}>
            BUMDes Wengkal
          </p>
          <p className={cn("truncate text-xs", light ? "text-muted-foreground" : "text-sidebar-muted")}>
            Desa Wengkal
          </p>
        </div>
      ) : null}
    </div>
  );
}
