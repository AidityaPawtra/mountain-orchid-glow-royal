import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Boxes,
  Building2,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  HandCoins,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

type NavItem = {
  to?: string;
  label: string;
  icon: typeof LayoutDashboard;
  children?: {
    to: string;
    label: string;
    icon: typeof LayoutDashboard;
  }[];
};

const NAV: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Keuangan",
    icon: Wallet,
    children: [
      {
        to: "/uang-masuk",
        label: "Uang Masuk",
        icon: ArrowDownLeft,
      },
      {
        to: "/uang-keluar",
        label: "Uang Keluar",
        icon: ArrowUpRight,
      },
    ],
  },
  {
    to: "/peminjaman",
    label: "Peminjaman Barang",
    icon: Package,
  },
  {
    to: "/simpan-pinjam",
    label: "Simpan Pinjam",
    icon: HandCoins,
  },
  {
    to: "/barang",
    label: "Data Barang",
    icon: Boxes,
  },
  {
    to: "/jenis-bumdes",
    label: "Jenis BUMDes",
    icon: Building2,
  },
  {
    to: "/laporan",
    label: "Laporan",
    icon: FileText,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: Settings,
  },
];

function isActivePath(pathname: string, to?: string) {
  if (!to) return false;

  return pathname === to || pathname.startsWith(`${to}/`);
}

export function SidebarNav({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-full flex-col">
      {/* LOGO */}
      <div
        className={cn(
          "border-b border-white/10 px-0 py-6",
          collapsed && "px-2"
        )}
      >
        <div className={cn(!collapsed && "-translate-x-12")}>
          <BrandLogo collapsed={collapsed} />
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          if (item.children) {
            const childActive = item.children.some((child) =>
              isActivePath(pathname, child.to)
            );

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className={cn(
                    "flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg",
                    childActive && "text-sidebar-fg",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className="size-5 shrink-0" />

                  {!collapsed ? (
                    <>
                      <span className="flex-1 text-left">
                        {item.label}
                      </span>

                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform duration-200",
                          open || childActive
                            ? "rotate-0"
                            : "-rotate-90"
                        )}
                      />
                    </>
                  ) : null}
                </button>

                {!collapsed && (open || childActive) ? (
                  <div className="mt-1 space-y-1 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={onNavigate}
                        className={cn(
                          "flex h-10 items-center gap-3 rounded-xl px-3 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg",
                          isActivePath(pathname, child.to) &&
                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                        )}
                      >
                        <child.icon className="size-4" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to!}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg",
                isActivePath(pathname, item.to) &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon className="size-5 shrink-0" />

              {!collapsed ? item.label : null}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      {!collapsed ? (
        <div className="border-t border-white/10 px-4 py-4">
          <p className="text-[11px] uppercase tracking-wider text-sidebar-muted">
            Sistem Administrasi
          </p>

          <p className="mt-1 text-xs text-sidebar-fg/80">
            Keuangan & Inventaris BUMDes
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function DesktopSidebar({
  collapsed,
}: {
  collapsed: boolean;
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 bg-sidebar text-sidebar-fg transition-[width] duration-200 lg:block",
        collapsed ? "w-[76px]" : "w-[260px]"
      )}
    >
      <SidebarNav collapsed={collapsed} />
    </aside>
  );
}