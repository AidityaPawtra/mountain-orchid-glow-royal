import { useMemo, type ReactNode } from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Package,
  Wallet,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  cashflowByMonth,
  computeBalance,
  loanStats,
  mergeTransactions,
  totalExpense,
  totalIncome,
} from "@/lib/finance";
import { formatDate, formatNumber, formatRupiah } from "@/lib/format";
import { mapExpense, mapIncome, mapLoan } from "@/lib/mapper";

function DashboardPage() {
  // Semua data dashboard berasal dari database (DashboardController@index)
  const {
    auth,
    income: rawIncome,
    expenses: rawExpenses,
    loans: rawLoans,
  } = usePage<{
    auth: { user: { name: string } | null };
    income: unknown[];
    expenses: unknown[];
    loans: unknown[];
  }>().props;

  const income = useMemo(
    () => (Array.isArray(rawIncome) ? rawIncome.map(mapIncome) : []),
    [rawIncome],
  );
  const expenses = useMemo(
    () => (Array.isArray(rawExpenses) ? rawExpenses.map(mapExpense) : []),
    [rawExpenses],
  );
  const loans = useMemo(
    () => (Array.isArray(rawLoans) ? rawLoans.map(mapLoan) : []),
    [rawLoans],
  );
  const year = new Date().getFullYear();

  const masuk = totalIncome(income);
  const keluar = totalExpense(expenses);
  const saldo = computeBalance(income, expenses);
  const stats = loanStats(loans);
  const chartData = useMemo(() => cashflowByMonth(income, expenses, year), [income, expenses, year]);
  const recent = mergeTransactions(income, expenses).slice(0, 6);

  return (
    <>
      <Head title="Dashboard - BUMDes Desa Wengkal" />
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description={`Selamat datang, ${auth?.user?.name || "Admin"}`}
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Uang Masuk" value={formatRupiah(masuk)} icon={ArrowDownLeft} tone="primary" />
          <StatCard label="Total Uang Keluar" value={formatRupiah(keluar)} icon={ArrowUpRight} tone="danger" />
          <StatCard label="Saldo BUMDes" value={formatRupiah(saldo)} icon={Wallet} tone="success" />
          <StatCard
            label="Peminjaman Aktif"
            value={formatNumber(stats.active)}
            icon={Package}
            tone="warning"
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
          <Card className="p-0">
            <CardHeader className="p-5 pb-2">
              <CardTitle>Grafik Arus Kas</CardTitle>
              <p className="text-sm text-muted-foreground">Perbandingan uang masuk dan keluar per bulan ({year})</p>
            </CardHeader>
            <CardContent className="h-80 p-5 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
                      tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      width={48}
                    />
                    <Tooltip
                      formatter={(value) => formatRupiah(Number(value ?? 0))}
                      contentStyle={{ borderRadius: 12, borderColor: "var(--color-border)" }}
                    />
                    <Legend />
                    <Bar dataKey="masuk" name="Uang Masuk" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="keluar" name="Uang Keluar" fill="var(--color-danger)" radius={[6, 6, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="p-5">
            <h3 className="text-base font-semibold">Peminjaman Barang</h3>
            <p className="mt-1 text-sm text-muted-foreground">Ringkasan status inventaris yang sedang beredar.</p>
            <div className="mt-5 space-y-3">
              <LoanStatRow label="Aktif" value={stats.active} tone="bg-warning-soft text-warning" />
              <LoanStatRow label="Selesai" value={stats.returned} tone="bg-success-soft text-success" />
              <LoanStatRow label="Terlambat" value={stats.overdue} tone="bg-danger-soft text-danger" />
            </div>
            <Link
              href="/peminjaman"
              className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
            >
              Lihat semua peminjaman
            </Link>
          </Card>
        </section>

        <Card className="overflow-hidden p-0">
          <CardHeader className="p-5 pb-3">
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recent.length === 0 ? (
              <div className="px-5 pb-5">
                <EmptyState title="Belum ada transaksi" description="Catat uang masuk atau keluar untuk melihat ringkasan di sini." />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((row) => (
                  <li key={`${row.type}-${row.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{row.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(row.date)} · {row.category}
                      </p>
                    </div>
                    <p
                      className={
                        row.type === "income"
                          ? "shrink-0 text-sm font-semibold tabular-nums text-success"
                          : "shrink-0 text-sm font-semibold tabular-nums text-danger"
                      }
                    >
                      {row.type === "income" ? "+" : "−"}
                      {formatRupiah(row.amount)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function LoanStatRow({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`rounded-full px-2.5 py-0.5 text-sm font-semibold tabular-nums ${tone}`}>
        {formatNumber(value)}
      </span>
    </div>
  );
}

export default DashboardPage;

DashboardPage.layout = (page: ReactNode) => <AppShell>{page}</AppShell>;
