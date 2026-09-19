import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { IncomeForm, type IncomeFormValue } from "@/components/forms/income-form";
import {
  ExpenseForm,
  type ExpenseFormValue,
} from "@/components/forms/expense-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { formatRupiah } from "@/lib/format";

interface Props {
  id?: string;
}

export default function JenisBumdesShowPage({ id: propId }: Props) {
  const currentId = propId || (typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean).pop() : "");

  const bumdesTypes = useAppStore((state) => state.bumdesTypes);
  const income = useAppStore((state) => state.income);
  const expenses = useAppStore((state) => state.expenses);

  const addIncome = useAppStore((state) => state.addIncome);
  const addExpense = useAppStore((state) => state.addExpense);

  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  const bumdes = bumdesTypes.find((item) => item.id === currentId);

  if (!bumdes) {
    return (
      <AppShell>
        <Head title="BUMDes Tidak Ditemukan" />
        <div className="space-y-6">
          <Link
            href="/jenis-bumdes"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Jenis BUMDes
          </Link>

          <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
            <h1 className="text-lg font-semibold">BUMDes tidak ditemukan</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Data unit BUMDes yang kamu cari tidak tersedia.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const currentBumdes = bumdes;

  const bumdesIncome = income.filter((item) => item.bumdesTypeId === bumdes.id);
  const bumdesExpenses = expenses.filter((item) => item.bumdesTypeId === bumdes.id);

  const totalIncomeAmount = bumdesIncome.reduce((total, item) => total + item.amount, 0);
  const totalExpenseAmount = bumdesExpenses.reduce((total, item) => total + item.amount, 0);
  const balance = totalIncomeAmount - totalExpenseAmount;

  const transactions = [
    ...bumdesIncome.map((item) => ({
      id: item.id,
      date: item.date,
      type: "income" as const,
      category: item.category,
      party: item.source,
      description: item.description,
      amount: item.amount,
    })),
    ...bumdesExpenses.map((item) => ({
      id: item.id,
      date: item.date,
      type: "expense" as const,
      category: item.category,
      party: item.purpose,
      description: item.description,
      amount: item.amount,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  function handleAddIncome(value: IncomeFormValue) {
    addIncome({
      ...value,
      bumdesTypeId: currentBumdes.id,
    });
    setIncomeOpen(false);
    toast.success(`Pemasukan ${currentBumdes.name} berhasil disimpan.`);
  }

  function handleAddExpense(value: ExpenseFormValue) {
    addExpense({
      ...value,
      bumdesTypeId: currentBumdes.id,
    });
    setExpenseOpen(false);
    toast.success(`Pengeluaran ${currentBumdes.name} berhasil disimpan.`);
  }

  return (
    <AppShell>
      <Head title={`${bumdes.name} - BUMDes Desa Wengkal`} />
      <div className="space-y-6">
        {/* HEADER */}
        <div className="space-y-4">
          <Link
            href="/jenis-bumdes"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Jenis BUMDes
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Wallet className="size-5" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {bumdes.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {bumdes.category || "Lainnya"}
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              {bumdes.description || "Tidak ada deskripsi."}
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div>
          <span
            className={
              bumdes.status === "active"
                ? "inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600"
                : "inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
            }
          >
            {bumdes.status === "active" ? "Aktif" : "Nonaktif"}
          </span>
        </div>

        {/* AKSI KEUANGAN */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => setIncomeOpen(true)}
            disabled={bumdes.status !== "active"}
          >
            <ArrowDownLeft className="size-4" />
            Tambah Uang Masuk
          </Button>

          <Button
            variant="outline"
            onClick={() => setExpenseOpen(true)}
            disabled={bumdes.status !== "active"}
          >
            <ArrowUpRight className="size-4" />
            Tambah Uang Keluar
          </Button>
        </div>

        {/* RINGKASAN KEUANGAN */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <ArrowDownLeft className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pemasukan</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatRupiah(totalIncomeAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                <ArrowUpRight className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatRupiah(totalExpenseAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Wallet className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatRupiah(balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DATA TRANSAKSI */}
        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="p-5">
            <h2 className="font-semibold">Riwayat Transaksi</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Seluruh transaksi yang terhubung dengan {bumdes.name}.
            </p>
          </div>

          {transactions.length === 0 ? (
            <div className="border-t px-5 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Belum ada transaksi untuk unit ini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border-t">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="bg-muted/40 text-left">
                    <th className="px-5 py-3 font-medium">Tanggal</th>
                    <th className="px-5 py-3 font-medium">Jenis</th>
                    <th className="px-5 py-3 font-medium">Kategori</th>
                    <th className="px-5 py-3 font-medium">Sumber / Tujuan</th>
                    <th className="px-5 py-3 font-medium">Keterangan</th>
                    <th className="px-5 py-3 text-right font-medium">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map((transaction) => (
                    <tr
                      key={`${transaction.type}-${transaction.id}`}
                      className="transition hover:bg-muted/30"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                        {new Intl.DateTimeFormat("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(new Date(transaction.date))}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={
                            transaction.type === "income"
                              ? "inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600"
                              : "inline-flex rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600"
                          }
                        >
                          {transaction.type === "income" ? "Uang Masuk" : "Uang Keluar"}
                        </span>
                      </td>
                      <td className="px-5 py-4">{transaction.category}</td>
                      <td className="px-5 py-4">{transaction.party}</td>
                      <td className="max-w-[280px] px-5 py-4 text-muted-foreground">
                        {transaction.description}
                      </td>
                      <td
                        className={
                          transaction.type === "income"
                            ? "whitespace-nowrap px-5 py-4 text-right font-semibold text-emerald-600"
                            : "whitespace-nowrap px-5 py-4 text-right font-semibold text-red-600"
                        }
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatRupiah(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* DIALOG TAMBAH UANG MASUK */}
        <Dialog open={incomeOpen} onOpenChange={setIncomeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Uang Masuk</DialogTitle>
              <DialogDescription>
                Catat pemasukan untuk {bumdes.name}.
              </DialogDescription>
            </DialogHeader>
            <IncomeForm
              bumdesTypeId={bumdes.id}
              submitLabel="Simpan"
              onSubmit={handleAddIncome}
              onCancel={() => setIncomeOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* DIALOG TAMBAH UANG KELUAR */}
        <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Uang Keluar</DialogTitle>
              <DialogDescription>
                Catat pengeluaran untuk {bumdes.name}.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm
              bumdesTypeId={bumdes.id}
              submitLabel="Simpan"
              onSubmit={handleAddExpense}
              onCancel={() => setExpenseOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
