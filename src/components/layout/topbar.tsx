import { useMemo, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Search, Settings, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar";
import { formatDateTime } from "@/lib/format";
import { mergeTransactions } from "@/lib/finance";
import { useAppStore } from "@/lib/store";

export function Topbar({
  onToggleCollapse,
}: {
  onToggleCollapse: () => void;
}) {
  const navigate = useNavigate();
  const router = useRouter();
  const session = useAppStore((s) => s.session);
  const settings = useAppStore((s) => s.settings);
  const notifications = useAppStore((s) => s.notifications);
  const markRead = useAppStore((s) => s.markNotificationRead);
  const markAll = useAppStore((s) => s.markAllNotificationsRead);
  const logout = useAppStore((s) => s.logout);
  const income = useAppStore((s) => s.income);
  const expenses = useAppStore((s) => s.expenses);
  const loans = useAppStore((s) => s.loans);
  const items = useAppStore((s) => s.items);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const unread = notifications.filter((n) => !n.read).length;
  const name = session?.name || settings.adminName || "Admin";

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const tx = mergeTransactions(income, expenses)
      .filter((row) =>
        [row.title, row.category].join(" ").toLowerCase().includes(q),
      )
      .slice(0, 4)
      .map((row) => ({
        id: row.id,
        label: `${row.type === "income" ? "Masuk" : "Keluar"} · ${row.title}`,
        to: row.type === "income" ? "/uang-masuk" : "/uang-keluar",
      }));
    const loanHits = loans
      .filter((row) =>
        [row.borrowerName, row.itemName, row.purpose].join(" ").toLowerCase().includes(q),
      )
      .slice(0, 3)
      .map((row) => ({
        id: row.id,
        label: `Pinjam · ${row.borrowerName} — ${row.itemName}`,
        to: `/peminjaman/${row.id}`,
      }));
    const itemHits = items
      .filter((row) => row.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((row) => ({
        id: row.id,
        label: `Barang · ${row.name}`,
        to: "/barang",
      }));
    return [...tx, ...loanHits, ...itemHits].slice(0, 8);
  }, [query, income, expenses, loans, items]);

  function handleLogout() {
    logout();
    void navigate({ to: "/login" });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Buka menu"
        >
          <Menu className="size-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onToggleCollapse}
          aria-label="Ciutkan sidebar"
        >
          <Menu className="size-5" />
        </Button>

        <div className="relative min-w-0 flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari transaksi, barang, atau peminjam..."
            className="h-10 bg-muted/70 pl-9"
          />
          {results.length > 0 ? (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card-hover)]">
              {results.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  className="block w-full px-3 py-2.5 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    setQuery("");
                    router.history.push(row.to);
                  }}
                >
                  {row.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="relative" aria-label="Notifikasi">
              <Bell className="size-5" />
              {unread > 0 ? (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger" />
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifikasi</span>
              {unread > 0 ? (
                <button type="button" className="text-xs text-primary" onClick={markAll}>
                  Tandai dibaca
                </button>
              ) : null}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">Tidak ada notifikasi.</p>
            ) : (
              notifications.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  className="flex-col items-start gap-1 py-2.5"
                  onSelect={() => {
                    markRead(item.id);
                    if (item.href) router.history.push(item.href);
                  }}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="font-medium text-foreground">{item.title}</span>
                    {!item.read ? <span className="size-1.5 rounded-full bg-primary" /> : null}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.body}</span>
                  <span className="text-[11px] text-muted-foreground">{formatDateTime(item.time)}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-muted"
            >
              <Avatar name={name} />
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium leading-tight">{name}</span>
                <span className="block text-xs text-muted-foreground">Admin</span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Akun</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => void navigate({ to: "/pengaturan" })}>
              <UserRound className="size-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void navigate({ to: "/pengaturan" })}>
              <Settings className="size-4" />
              Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout} className="text-danger">
              <LogOut className="size-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0">
          <SheetTitle className="sr-only">Menu navigasi</SheetTitle>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
