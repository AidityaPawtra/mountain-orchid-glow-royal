import { cn } from "@/lib/utils";

export function BrandMark({
  className,
}: {
  className?: string;
}) {
  return (
    <img
      src="/logo.jpg"
      alt="Logo BUMDes Wengkal"
      className={cn(
        "size-25 shrink-0 object-contain",
        className
      )}
    />
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
    <div
      className={cn(
        "flex items-center gap-1",
        collapsed && "justify-center"
      )}
    >
      <BrandMark
        className={cn(
          "size-50",
          light && "grayscale brightness-[0.65] opacity-70"
        )}
      />

      {!collapsed ? (
        <div className="min-w-0 -ml-15">
          <p
            className={cn(
              "truncate text-sm font-semibold leading-tight",
              light ? "text-navy" : "text-sidebar-fg"
            )}
          >
            BUMDes Wengkal
          </p>

          <p
            className={cn(
              "truncate text-xs",
              light
                ? "text-muted-foreground"
                : "text-sidebar-muted"
            )}
          >
            Desa Wengkal
          </p>
        </div>
      ) : null}
    </div>
  );
}