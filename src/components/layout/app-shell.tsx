import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DesktopSidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BrandMark } from "@/components/brand-logo";
import { useAppStore } from "@/lib/store";

export function SplashScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
      <BrandMark className="size-12" />
      <p className="text-sm font-medium text-navy">BUMDes Desa Wengkal</p>
      <p className="text-xs text-muted-foreground">Memuat data aplikasi...</p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const ready = useAppStore((s) => s.ready);
  const session = useAppStore((s) => s.session);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (ready && !session) {
      void navigate({ to: "/login" });
    }
  }, [ready, session, navigate]);

  if (!ready || !session) return <SplashScreen />;

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar collapsed={collapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onToggleCollapse={() => setCollapsed((v) => !v)} />
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
