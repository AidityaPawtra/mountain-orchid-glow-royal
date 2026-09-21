import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  Eye,
  FileImage,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
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

import {
  exportTransactionsCsv,
  printReport,
  reportHtml,
} from "@/lib/export";
import {
  computeBalance,
  totalExpense,
  totalIncome,
} from "@/lib/finance";
import {
  MONTH_LABELS,
  formatDate,
  formatRupiah,
} from "@/lib/format";
import { useAppStore } from "@/lib/store";
import type {
  ExpenseRecord,
  IncomeRecord,
  ProofFile,
} from "@/lib/types";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/_app/laporan")({
  component: LaporanPage,
});

// ======================================================
// TYPE
// ======================================================

type TransactionKind =
  | "all"
  | "income"
  | "expense";

type ReportTransaction = {
  id: string;
  type: "income" | "expense";
  date: string;
  category: string;
  party: string;
  description: string;
  amount: number;
  proof?: ProofFile | null;
};

// ======================================================
// HELPERS
// ======================================================

function normalizeProof(
  proof: unknown,
): ProofFile | null {
  if (!proof) {
    return null;
  }

  // ----------------------------------------------------
  // BACKEND BISA MENGIRIM PROOF DALAM BENTUK STRING JSON
  // ----------------------------------------------------
  if (typeof proof === "string") {
    const trimmed = proof.trim();

    if (!trimmed) {
      return null;
    }

    // Contoh:
    // "{\"name\":\"foto.jpg\",\"path\":\"proofs/income/foto.jpg\",\"url\":\"http://localhost:8000/storage/...\"}"
    try {
      const parsed = JSON.parse(trimmed);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        return normalizeProof(parsed);
      }
    } catch {
      // Bukan JSON, lanjut cek apakah string tersebut URL
      // atau hanya nama file.
    }

    if (
      trimmed.startsWith("data:image/") ||
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/storage/")
    ) {
      return {
        name: "Bukti transaksi",
        dataUrl: trimmed,
      };
    }

    return {
      name: trimmed,
    };
  }

  // ----------------------------------------------------
  // OBJECT DARI LOCAL STORAGE / API
  // ----------------------------------------------------
  if (
    typeof proof === "object" &&
    !Array.isArray(proof)
  ) {
    const value = proof as {
      name?: unknown;
      dataUrl?: unknown;
      url?: unknown;
      path?: unknown;
    };

    const name =
      typeof value.name === "string" &&
      value.name.trim()
        ? value.name
        : "Bukti transaksi";

    // Prioritas:
    // 1. dataUrl
    // 2. url dari Laravel
    // 3. path dari Laravel
    let dataUrl: string | undefined;

    if (
      typeof value.dataUrl === "string" &&
      value.dataUrl.trim()
    ) {
      dataUrl = value.dataUrl.trim();
    } else if (
      typeof value.url === "string" &&
      value.url.trim()
    ) {
      dataUrl = value.url.trim();
    } else if (
      typeof value.path === "string" &&
      value.path.trim()
    ) {
      const path = value.path.trim();

      if (path.startsWith("http://") || path.startsWith("https://")) {
        dataUrl = path;
      } else if (path.startsWith("/storage/")) {
        dataUrl = path;
      } else {
        dataUrl = `/storage/${path.replace(/^\/+/, "")}`;
      }
    }

    return {
      name,
      ...(dataUrl ? { dataUrl } : {}),
    };
  }

  return null;
}

function isImageProof(
  proof: ProofFile | null,
) {
  if (!proof?.dataUrl) {
    return false;
  }

  const value =
    proof.dataUrl.toLowerCase();

  return (
    value.startsWith("data:image/") ||
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/.test(
      value,
    )
  );
}

// ======================================================
// PAGE
// ======================================================

function LaporanPage() {
  const income = useAppStore(
    (s) => s.income,
  );

  const expenses = useAppStore(
    (s) => s.expenses,
  );

  const settings = useAppStore(
    (s) => s.settings,
  );

  // ====================================================
  // FILTER
  // ====================================================

  const [year, setYear] =
    useState("2026");

  const [month, setMonth] =
    useState("all");

  const [kind, setKind] =
    useState<TransactionKind>(
      "all",
    );

  const [search, setSearch] =
    useState("");

  // ====================================================
  // DETAIL
  // ====================================================

  const [
    selectedTransaction,
    setSelectedTransaction,
  ] =
    useState<ReportTransaction | null>(
      null,
    );

  const [
    detailOpen,
    setDetailOpen,
  ] = useState(false);

  // ====================================================
  // FILTER INCOME
  // ====================================================

  const filteredIncome = useMemo(
    () => {
      return income.filter(
        (row) => {
          if (
            !row.date.startsWith(
              year,
            )
          ) {
            return false;
          }

          if (
            month !== "all" &&
            !row.date.startsWith(
              `${year}-${month}`,
            )
          ) {
            return false;
          }

          return true;
        },
      );
    },
    [
      income,
      year,
      month,
    ],
  );

  // ====================================================
  // FILTER EXPENSE
  // ====================================================

  const filteredExpenses =
    useMemo(() => {
      return expenses.filter(
        (row) => {
          if (
            !row.date.startsWith(
              year,
            )
          ) {
            return false;
          }

          if (
            month !== "all" &&
            !row.date.startsWith(
              `${year}-${month}`,
            )
          ) {
            return false;
          }

          return true;
        },
      );
    }, [
      expenses,
      year,
      month,
    ]);

  // ====================================================
  // SHOW / HIDE TRANSACTION TYPE
  // ====================================================

  const showIncome =
    kind !== "expense";

  const showExpense =
    kind !== "income";

  // ====================================================
  // SUMMARY
  // ====================================================

  const masuk =
    totalIncome(
      showIncome
        ? filteredIncome
        : [],
    );

  const keluar =
    totalExpense(
      showExpense
        ? filteredExpenses
        : [],
    );

  const saldo =
    computeBalance(
      showIncome
        ? filteredIncome
        : [],
      showExpense
        ? filteredExpenses
        : [],
    );

  // ====================================================
  // PERIOD
  // ====================================================

  const periodLabel =
    month === "all"
      ? `Tahun ${year}`
      : `${
          MONTH_LABELS[
            Number(month) - 1
          ]
        } ${year}`;

  // ====================================================
  // COMBINED TRANSACTIONS
  // ====================================================

  const transactions =
    useMemo(() => {
      const incomeTransactions: ReportTransaction[] =
        showIncome
          ? filteredIncome.map(
              (
                row: IncomeRecord,
              ) => ({
                id: row.id,
                type: "income",
                date: row.date,
                category:
                  row.category,
                party: row.source,
                description:
                  row.description,
                amount:
                  row.amount,
                proof:
                  normalizeProof(
                    row.proof,
                  ),
              }),
            )
          : [];

      const expenseTransactions: ReportTransaction[] =
        showExpense
          ? filteredExpenses.map(
              (
                row: ExpenseRecord,
              ) => ({
                id: row.id,
                type: "expense",
                date: row.date,
                category:
                  row.category,
                party: row.purpose,
                description:
                  row.description,
                amount:
                  row.amount,
                proof:
                  normalizeProof(
                    row.proof,
                  ),
              }),
            )
          : [];

      const combined = [
        ...incomeTransactions,
        ...expenseTransactions,
      ];

      const keyword =
        search
          .trim()
          .toLowerCase();

      const searched =
        !keyword
          ? combined
          : combined.filter(
              (transaction) =>
                [
                  transaction.date,
                  transaction.category,
                  transaction.party,
                  transaction.description,
                  transaction.type ===
                  "income"
                    ? "pemasukan"
                    : "pengeluaran",
                ]
                  .join(" ")
                  .toLowerCase()
                  .includes(
                    keyword,
                  ),
            );

      return searched.sort(
        (a, b) =>
          b.date.localeCompare(
            a.date,
          ),
      );
    }, [
      filteredIncome,
      filteredExpenses,
      showIncome,
      showExpense,
      search,
    ]);

  // ====================================================
  // DETAIL
  // ====================================================

  function handleDetail(
    transaction: ReportTransaction,
  ) {
    setSelectedTransaction(
      transaction,
    );

    setDetailOpen(true);
  }

  // ====================================================
  // EXPORT CSV
  // ====================================================

  function handleExcel() {
    exportTransactionsCsv(
      showIncome
        ? filteredIncome
        : [],
      showExpense
        ? filteredExpenses
        : [],
      `laporan-bumdes-${year}${
        month !== "all"
          ? `-${month}`
          : ""
      }.csv`,
    );

    toast.success(
      "Berkas Excel (CSV) diunduh.",
    );
  }

  // ====================================================
  // EXPORT PDF
  // ====================================================

  function handlePdf() {
    const ok =
      printReport(
        "Laporan Keuangan BUMDes",
        reportHtml({
          title: `Laporan Keuangan ${settings.bumdesName}`,
          periodLabel,
          masuk,
          keluar,
          saldo,
          income:
            showIncome
              ? filteredIncome
              : [],
          expenses:
            showExpense
              ? filteredExpenses
              : [],
        }),
      );

    if (!ok) {
      toast.error(
        "Popup diblokir. Izinkan jendela baru untuk mencetak PDF.",
      );
      return;
    }

    toast.success(
      "Siapkan cetak / simpan sebagai PDF.",
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-6 pb-8">
      {/* ==================================================
          HEADER
      ================================================== */}

      <PageHeader
        title="Laporan Keuangan"
        description="Ringkasan pemasukan dan pengeluaran BUMDes berdasarkan periode."
        actions={
          <>
            <Button
              variant="outline"
              onClick={handlePdf}
            >
              <Printer className="size-4" />
              Export PDF
            </Button>

            <Button
              variant="outline"
              onClick={handleExcel}
            >
              <FileSpreadsheet className="size-4" />
              Export Excel
            </Button>
          </>
        }
      />

      {/* ==================================================
          FILTER
      ================================================== */}

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_200px]">
          {/* SEARCH */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Cari transaksi
            </label>

            <Input
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              placeholder="Cari kategori, sumber, tujuan, atau keterangan..."
            />
          </div>

          {/* MONTH */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Bulan
            </label>

            <Select
              value={month}
              onChange={(
                event,
              ) =>
                setMonth(
                  event.target
                    .value,
                )
              }
            >
              <option value="all">
                Semua bulan
              </option>

              {MONTH_LABELS.map(
                (
                  label,
                  index,
                ) => (
                  <option
                    key={label}
                    value={String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  >
                    {label}
                  </option>
                ),
              )}
            </Select>
          </div>

          {/* YEAR */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tahun
            </label>

            <Select
              value={year}
              onChange={(
                event,
              ) =>
                setYear(
                  event.target
                    .value,
                )
              }
            >
              <option value="2026">
                2026
              </option>

              <option value="2025">
                2025
              </option>
            </Select>
          </div>

          {/* KIND */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Jenis Transaksi
            </label>

            <Select
              value={kind}
              onChange={(
                event,
              ) =>
                setKind(
                  event.target
                    .value as TransactionKind,
                )
              }
            >
              <option value="all">
                Semua transaksi
              </option>

              <option value="income">
                Pemasukan
              </option>

              <option value="expense">
                Pengeluaran
              </option>
            </Select>
          </div>
        </div>
      </Card>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Uang Masuk"
          value={formatRupiah(
            masuk,
          )}
          icon={
            ArrowDownLeft
          }
        />

        <StatCard
          label="Total Uang Keluar"
          value={formatRupiah(
            keluar,
          )}
          icon={
            ArrowUpRight
          }
          tone="danger"
        />

        <StatCard
          label="Saldo"
          value={formatRupiah(
            saldo,
          )}
          icon={Wallet}
          tone="success"
        />
      </section>

      {/* ==================================================
          TRANSACTION TABLE
      ================================================== */}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-1 border-b p-5">
          <h2 className="font-semibold text-foreground">
            Daftar Transaksi
          </h2>

          <p className="text-sm text-muted-foreground">
            Seluruh pemasukan dan
            pengeluaran untuk{" "}
            {periodLabel.toLowerCase()}.
          </p>
        </div>

        {transactions.length ===
        0 ? (
          <div className="p-5">
            <EmptyState
              title="Tidak ada transaksi"
              description={`Tidak ada transaksi yang sesuai dengan filter untuk ${periodLabel}.`}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Tanggal
                  </TableHead>

                  <TableHead>
                    Keterangan
                  </TableHead>

                  <TableHead>
                    Kategori
                  </TableHead>

                  <TableHead>
                    Sumber / Tujuan
                  </TableHead>

                  <TableHead className="text-right">
                    Jumlah
                  </TableHead>

                  <TableHead className="w-[110px] text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.map(
                  (
                    transaction,
                  ) => (
                    <TableRow
                      key={`${transaction.type}-${transaction.id}`}
                    >
                      {/* TANGGAL */}

                      <TableCell className="whitespace-nowrap">
                        {formatDate(
                          transaction.date,
                        )}
                      </TableCell>

                      {/* KETERANGAN */}

                      <TableCell>
                        <span
                          className={
                            transaction.type ===
                            "income"
                              ? "inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700"
                              : "inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-700"
                          }
                        >
                          {transaction.type ===
                          "income"
                            ? "Pemasukan"
                            : "Pengeluaran"}
                        </span>
                      </TableCell>

                      {/* KATEGORI */}

                      <TableCell>
                        {transaction.category ||
                          "-"}
                      </TableCell>

                      {/* SUMBER / TUJUAN */}

                      <TableCell className="font-medium">
                        {transaction.party ||
                          "-"}
                      </TableCell>

                      {/* JUMLAH */}

                      <TableCell
                        className={
                          transaction.type ===
                          "income"
                            ? "whitespace-nowrap text-right font-semibold text-emerald-600 tabular-nums"
                            : "whitespace-nowrap text-right font-semibold text-red-600 tabular-nums"
                        }
                      >
                        {transaction.type ===
                        "income"
                          ? "+"
                          : "-"}{" "}
                        {formatRupiah(
                          transaction.amount,
                        )}
                      </TableCell>

                      {/* ACTION */}

                      <TableCell>
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() =>
                              handleDetail(
                                transaction,
                              )
                            }
                          >
                            <Eye className="size-4" />
                            Detail
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* ==================================================
          DETAIL TRANSACTION
      ================================================== */}

      <Dialog
        open={detailOpen}
        onOpenChange={
          setDetailOpen
        }
      >
        <DialogContent className="max-w-2xl">
          {selectedTransaction && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span>
                    Detail Transaksi
                  </span>

                  <span
                    className={
                      selectedTransaction.type ===
                      "income"
                        ? "inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700"
                        : "inline-flex rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-700"
                    }
                  >
                    {selectedTransaction.type ===
                    "income"
                      ? "Pemasukan"
                      : "Pengeluaran"}
                  </span>
                </DialogTitle>

                <DialogDescription>
                  Informasi lengkap transaksi
                  dan bukti transaksi.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {/* INFORMASI */}

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <DetailItem
                      label="Jenis Transaksi"
                      value={
                        selectedTransaction.type ===
                        "income"
                          ? "Pemasukan"
                          : "Pengeluaran"
                      }
                    />

                    <DetailItem
                      label="Tanggal"
                      value={formatDate(
                        selectedTransaction.date,
                      )}
                    />

                    <DetailItem
                      label="Kategori"
                      value={
                        selectedTransaction.category ||
                        "-"
                      }
                    />

                    <DetailItem
                      label={
                        selectedTransaction.type ===
                        "income"
                          ? "Sumber"
                          : "Tujuan"
                      }
                      value={
                        selectedTransaction.party ||
                        "-"
                      }
                    />

                    <div className="sm:col-span-2">
                      <DetailItem
                        label="Keterangan"
                        value={
                          selectedTransaction.description ||
                          "-"
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <DetailItem
                        label="Jumlah"
                        value={formatRupiah(
                          selectedTransaction.amount,
                        )}
                        emphasized
                        tone={
                          selectedTransaction.type ===
                          "income"
                            ? "income"
                            : "expense"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* BUKTI */}

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FileImage className="size-5 text-primary" />

                    <div>
                      <h3 className="font-semibold">
                        Bukti Transaksi
                      </h3>

                      <p className="text-xs text-muted-foreground">
                        Bukti yang tersimpan pada transaksi ini.
                      </p>
                    </div>
                  </div>

                  {(() => {
                    const proof =
                      normalizeProof(
                        selectedTransaction.proof,
                      );

                    if (!proof) {
                      return (
                        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
                          <FileImage className="mx-auto size-8 text-muted-foreground" />

                          <p className="mt-3 text-sm font-medium">
                            Belum ada bukti transaksi
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Transaksi ini belum memiliki foto atau file bukti.
                          </p>
                        </div>
                      );
                    }

                    if (
                      proof.dataUrl &&
                      isImageProof(proof)
                    ) {
                      return (
                        <div className="space-y-3">
                          <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
                            <img
                              src={
                                proof.dataUrl
                              }
                              alt={
                                proof.name ||
                                "Bukti transaksi"
                              }
                              className="max-h-[520px] w-full object-contain"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <p className="min-w-0 truncate text-sm text-muted-foreground">
                              {
                                proof.name
                              }
                            </p>

                            <a
                              href={
                                proof.dataUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0"
                            >
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-2"
                              >
                                <Eye className="size-4" />
                                Buka
                              </Button>
                            </a>
                          </div>
                        </div>
                      );
                    }

                    if (
                      proof.dataUrl
                    ) {
                      return (
                        <div className="rounded-xl border bg-muted/30 p-5">
                          <p className="text-sm font-medium">
                            Bukti transaksi tersedia
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {
                              proof.name
                            }
                          </p>

                          <a
                            href={
                              proof.dataUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex"
                          >
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Eye className="size-4" />
                              Buka Bukti
                            </Button>
                          </a>
                        </div>
                      );
                    }

                    return (
                      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6">
                        <p className="text-sm font-medium">
                          Bukti tersimpan
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {
                            proof.name
                          }
                        </p>

                        <p className="mt-3 text-xs text-muted-foreground">
                          File bukti tersedia,
                          tetapi pratinjau tidak
                          tersedia pada data transaksi.
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* FOOTER */}

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setDetailOpen(
                        false,
                      )
                    }
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ==================================================
          FOOTNOTE
      ================================================== */}

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Download className="size-3.5" />

        Export Excel mengunduh
        CSV yang dapat dibuka di
        Microsoft Excel. Export PDF
        membuka pratinjau cetak.
      </p>
    </div>
  );
}

// ======================================================
// DETAIL ITEM
// ======================================================

function DetailItem({
  label,
  value,
  emphasized = false,
  tone,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
  tone?:
    | "income"
    | "expense";
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <p
        className={
          emphasized
            ? tone === "income"
              ? "mt-1 text-xl font-bold tabular-nums text-emerald-600"
              : "mt-1 text-xl font-bold tabular-nums text-red-600"
            : "mt-1 text-sm font-medium text-foreground"
        }
      >
        {value}
      </p>
    </div>
  );
}