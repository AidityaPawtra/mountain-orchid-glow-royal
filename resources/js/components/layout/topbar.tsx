import { useEffect, useMemo, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Bell, LogOut, Menu, Search } from "lucide-react";
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
import {
  DEFAULT_SETTINGS,
  mapNotification,
  mapSettings,
} from "@/lib/mapper";

type SearchResult = { id: string; label: string; to: string };

export function Topbar({
  onToggleCollapse,
}: {
  onToggleCollapse: () => void;
}) {
  // Semua data topbar berasal dari server (database):
  // user, profil BUMDes, dan notifikasi dibagikan HandleInertiaRequests.
  const {
    auth,
    settings: rawSettings,
    notifications: rawNotifications,
  } = usePage<{
    auth: { user: { id: string; name: string; username: string; email: string } | null };
    settings: unknown;
    notifications: unknown[];
  }>().props;

  const settings = useMemo(
    () => mapSettings(rawSettings) ?? DEFAULT_SETTINGS,
    [rawSettings],
  );
  const mappedNotifications = useMemo(
    () =>
      Array.isArray(rawNotifications) ? rawNotifications.map(mapNotification) : [],
    [rawNotifications],
  );

  // State lokal supaya badge/daftar notifikasi bisa langsung ter-update
  // (dicentang dibaca) tanpa harus menunggu halaman di-reload oleh Inertia.
  // Disinkronkan ulang tiap kali props dari server berubah (mis. setelah
  // pindah halaman biasa).
  const [notifications, setNotifications] = useState(mappedNotifications);
  useEffect(() => {
    setNotifications(mappedNotifications);
  }, [mappedNotifications]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const unread = notifications.filter((n) => !n.read).length;
  const name = auth?.user?.name || settings.adminName || "Admin";

  function csrfToken(): string {
    return (
      document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content") ?? ""
    );
  }

  /**
   * Tandai notifikasi terbaca lewat fetch biasa (BUKAN router.post Inertia).
   * Sengaja dipisah dari navigasi Inertia: kalau memakai router.post di sini,
   * itu memicu "kunjungan halaman" Inertia sendiri yang bisa berbenturan
   * dengan router.visit(item.href) yang dijalankan hampir bersamaan saat
   * notifikasi diklik -- responsnya bisa saling menimpa dan halaman terasa
   * "balik sendiri" ke Dashboard sesaat setelah pindah halaman. Dengan fetch
   * biasa, ini murni panggilan API di belakang layar, tidak menyentuh
   * riwayat/route Inertia sama sekali.
   */
  async function markReadOnServer(id: string) {
    try {
      await fetch(`/notifications/${encodeURIComponent(id)}/read`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken(),
        },
      });
    } catch {
      // Biarkan; status "dibaca" tetap tampil optimis di UI, akan
      // tersinkron lagi saat halaman berikutnya dimuat.
    }
  }

  async function markAllReadOnServer() {
    try {
      await fetch("/notifications/read-all", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken(),
        },
      });
    } catch {
      // sama seperti di atas
    }
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((row) => (row.id === id ? { ...row, read: true } : row)),
    );
    void markReadOnServer(id);
  }

  function markAll() {
    setNotifications((prev) => prev.map((row) => ({ ...row, read: true })));
    void markAllReadOnServer();
  }

  function handleNotificationClick(item: (typeof notifications)[number]) {
    markRead(item.id);
    // Satu-satunya navigasi Inertia yang sebenarnya untuk aksi ini.
    if (item.href) router.visit(item.href);
  }

  // Pencarian global: ditanyakan ke database lewat GET /pencarian?q=...
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/pencarian?q=${encodeURIComponent(q)}`, {
          headers: { Accept: "application/json" },
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) {
          setResults([]);
          return;
        }
        const data = await response.json();
        setResults(Array.isArray(data) ? (data as SearchResult[]).slice(0, 8) : []);
      } catch {
        // dibatalkan (ketikan baru) atau koneksi gagal: abaikan
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function handleLogout() {
    router.post("/logout");
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
                    router.visit(row.to);
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
                  onSelect={() => handleNotificationClick(item)}
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

        {/* Klik avatar/nama -> langsung ke halaman Profile. Tanpa dropdown. */}
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-muted"
        >
          <Avatar name={name} />
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-medium leading-tight">{name}</span>
            <span className="block text-xs text-muted-foreground">Admin</span>
          </span>
        </Link>

        {/* Tombol Keluar terpisah, di sebelah profile. */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label="Keluar"
          title="Keluar"
          className="text-danger hover:text-danger"
        >
          <LogOut className="size-5" />
        </Button>
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
