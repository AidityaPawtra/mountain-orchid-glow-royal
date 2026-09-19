import { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportTransactionsCsv, printReport, reportHtml } from "@/lib/export";
import { computeBalance, totalExpense, totalIncome } from "@/lib/finance";
import { MONTH_LABELS, formatDate, formatRupiah } from "@/lib/format";
import { useAppStore } from "@/lib/store";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

export default function LaporanPage() {
  const income = useAppStore((s) => s.income);
  const expenses = useAppStore((s) => s.expenses);
  const settings = useAppStore((s) => s.settings);

  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("all");
  const [kind, setKind] = useState("all");

  const filteredIncome = useMemo(() => {
    return income.filter((row) => {
      if (!row.date.startsWith(year)) return false;
      if (month !== "all" && !row.date.startsWith(`${year}-${month}`)) return false;
      return true;
    });
  }, [income, year, month]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((row) => {
      if (!row.date.startsWith(year)) return false;
      if (month !== "all" && !row.date.startsWith(`${year}-${month}`)) return false;
      return true;
    });
  }, [expenses, year, month]);

  const showIncome = kind !== "expense";
  const showExpense = kind !== "income";
  const masuk = totalIncome(filteredIncome);
  const keluar = totalExpense(filteredExpenses);
  const saldo = computeBalance(filteredIncome, filteredExpenses);
  const periodLabel =
    month === "all"
      ? `Tahun ${year}`
      : `${MONTH_LABELS[Number(month) - 1]} ${year}`;

  function handleExcel() {
    exportTransactionsCsv(
      showIncome ? filteredIncome : [],
      showExpense ? filteredExpenses : [],
      `laporan-bumdes-${year}${month !== "all" ? `-${month}` : ""}.csv`,
    );
    toast.success("Berkas Excel (CSV) diunduh.");
  }

  function handlePdf() {
    const ok = printReport(
      "Laporan Keuangan BUMDes",
      reportHtml({
        title: `Laporan Keuangan ${settings.bumdesName}`,
        periodLabel,
        masuk,
        keluar,
        saldo,
        income: showIncome ? filteredIncome : [],
        expenses: showExpense ? filteredExpenses : [],
      }),
    );
    if (!ok) {
      toast.error("Popup diblokir. Izinkan jendela baru untuk mencetak PDF.");
      return;
    }
    toast.success("Siapkan cetak / simpan sebagai PDF.");
  }

  return (
    <AppShell>
      <Head title="Laporan Keuangan - BUMDes Desa Wengkal" />
      <div className="space-y-6">
        <PageHeader
          title="Laporan Keuangan"
          description="Ringkasan pemasukan, pengeluaran, dan saldo berdasarkan periode."
          actions={
            <>
              <Button variant="outline" onClick={handlePdf}>
                <Printer className="size-4" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={handleExcel}>
                <FileSpreadsheet className="size-4" />
                Export Excel
              </Button>
            </>
          }
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <Select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="all">Semua bulan</option>
            {MONTH_LABELS.map((label, index) => (
              <option key={label} value={String(index + 1).padStart(2, "0")}>
                {label}
              </option>
            ))}
          </Select>
          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </Select>
          <Select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="all">Semua transaksi</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </Select>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Uang Masuk" value={formatRupiah(masuk)} icon={ArrowDownLeft} />
          <StatCard label="Total Uang Keluar" value={formatRupiah(keluar)} icon={ArrowUpRight} tone="danger" />
          <StatCard
            label="Saldo"
            value={formatRupiah(saldo)}
            icon={Wallet}
            tone="success"
          />
        </section>

        <Card className="p-5">
          <Tabs defaultValue="pemasukan">
            <TabsList>
              <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
              <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
            </TabsList>
            <TabsContent value="pemasukan">
              {filteredIncome.length === 0 ? (
                <EmptyState title="Tidak ada pemasukan" description={`Tidak ada data untuk ${periodLabel}.`} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Sumber Dana</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncome.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{formatDate(row.date)}</TableCell>
                        <TableCell className="font-medium">{row.source}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatRupiah(row.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            <TabsContent value="pengeluaran">
              {filteredExpenses.length === 0 ? (
                <EmptyState title="Tidak ada pengeluaran" description={`Tidak ada data untuk ${periodLabel}.`} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Keperluan</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{formatDate(row.date)}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell className="font-medium">{row.purpose}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatRupiah(row.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Download className="size-3.5" />
          Export Excel mengunduh CSV yang dapat dibuka di Microsoft Excel. Export PDF membuka pratinjau cetak.
        </p>
      </div>
    </AppShell>
  );
}
