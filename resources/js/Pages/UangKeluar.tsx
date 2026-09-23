import { useMemo, useState, type ReactNode } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { ArrowUpRight, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { ExpenseForm, type ExpenseFormValue } from "@/components/forms/expense-form";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";
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
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { filterByPeriod, matchesQuery, totalExpense } from "@/lib/finance";
import { formatDate, formatRupiah } from "@/lib/format";
import { usePagination } from "@/hooks/use-pagination";
import { mapExpense } from "@/lib/mapper";
import type { ExpenseRecord } from "@/lib/types";

// ======================================================
// PAGE
// ======================================================

function UangKeluarPage() {
  // Receive expenses from Inertia page props (from ExpenseController)
  const { expenses: rawExpenses } = usePage<{ expenses: unknown[] }>().props;
  const expenses: ExpenseRecord[] = useMemo(
    () => (Array.isArray(rawExpenses) ? rawExpenses.map(mapExpense) : []),
    [rawExpenses],
  );

  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("all");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseRecord | null>(null);
  const [deleting, setDeleting] = useState<ExpenseRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    return filterByPeriod(expenses, period)
      .filter((row) => category === "all" || row.category === category)
      .filter((row) =>
        matchesQuery([row.purpose, row.category, row.description, formatRupiah(row.amount)], query),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, period, category, query]);

  const pager = usePagination(filtered);

  function handleCreate(value: ExpenseFormValue) {
    setSubmitting(true);
    router.post(
      "/uang-keluar",
      {
        bumdesTypeId: value.bumdesTypeId || null,
        date: value.date,
        category: value.category,
        purpose: value.purpose,
        description: value.description,
        amount: value.amount,
        proof: value.proof ? JSON.stringify(value.proof) : null,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setOpen(false);
          toast.success("Uang keluar berhasil disimpan.");
        },
        onError: () => {
          toast.error("Gagal menyimpan data. Periksa kembali isian formulir.");
        },
        onFinish: () => setSubmitting(false),
      },
    );
  }

  function handleUpdate(value: ExpenseFormValue) {
    if (!editing) return;
    setSubmitting(true);
    router.put(
      `/uang-keluar/${editing.id}`,
      {
        bumdesTypeId: value.bumdesTypeId || null,
        date: value.date,
        category: value.category,
        purpose: value.purpose,
        description: value.description,
        amount: value.amount,
        proof: value.proof ? JSON.stringify(value.proof) : null,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setEditing(null);
          toast.success("Data pengeluaran diperbarui.");
        },
        onError: () => {
          toast.error("Gagal memperbarui data.");
        },
        onFinish: () => setSubmitting(false),
      },
    );
  }

  function handleDelete() {
    if (!deleting) return;
    router.delete(`/uang-keluar/${deleting.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Data pengeluaran dihapus.");
      },
      onError: () => {
        toast.error("Gagal menghapus data.");
      },
      onFinish: () => setDeleting(null),
    });
  }

  return (
    <>
      <Head title="Uang Keluar - BUMDes Desa Wengkal" />
      <div className="space-y-6">
        <PageHeader
          title="Uang Keluar"
          description="Kelola seluruh data pengeluaran BUMDes."
          actions={
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" />
              Tambah Uang Keluar
            </Button>
          }
        />

        <StatCard
          label="Total Pengeluaran"
          value={formatRupiah(totalExpense(filtered))}
          hint={query || period !== "all" || category !== "all" ? "Mengikuti filter aktif" : "Seluruh data"}
          icon={ArrowUpRight}
          tone="danger"
        />

        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <SearchBar value={query} onChange={(v) => { setQuery(v); pager.setPage(1); }} placeholder="Cari keperluan, kategori, atau keterangan" />
          <Select value={period} onChange={(e) => { setPeriod(e.target.value); pager.setPage(1); }}>
            <option value="all">Semua periode</option>
            <option value="this-month">Bulan ini</option>
            <option value="last-month">Bulan lalu</option>
            <option value="this-year">Tahun ini</option>
          </Select>
          <Select value={category} onChange={(e) => { setCategory(e.target.value); pager.setPage(1); }}>
            <option value="all">Semua kategori</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>

        <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-card)]">
          {filtered.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="Tidak ada data pengeluaran"
                description="Tambah transaksi uang keluar atau ubah filter pencarian."
                action={<Button onClick={() => setOpen(true)}>Tambah Uang Keluar</Button>}
              />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14">No</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Keperluan</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pager.slice.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {(pager.page - 1) * pager.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{formatDate(row.date)}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell className="font-medium">{row.purpose}</TableCell>
                      <TableCell className="max-w-[240px] truncate">{row.description}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatRupiah(row.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" onClick={() => setEditing(row)} aria-label="Edit">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(row)} aria-label="Hapus">
                          <Trash2 className="size-4 text-danger" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t border-border px-4 py-3">
                <Pagination
                  page={pager.page}
                  pageCount={pager.pageCount}
                  onPageChange={pager.setPage}
                  total={pager.total}
                  pageSize={pager.pageSize}
                />
              </div>
            </>
          )}
        </div>

        {/* TAMBAH */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Uang Keluar</DialogTitle>
              <DialogDescription>Catat pengeluaran baru dari kas BUMDes.</DialogDescription>
            </DialogHeader>
            <ExpenseForm submitLabel={submitting ? "Menyimpan..." : "Simpan"} onSubmit={handleCreate} onCancel={() => setOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* EDIT */}
        <Dialog open={Boolean(editing)} onOpenChange={(v) => !v && setEditing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Uang Keluar</DialogTitle>
              <DialogDescription>Perbarui data pengeluaran yang dipilih.</DialogDescription>
            </DialogHeader>
            {editing ? (
              <ExpenseForm
                initial={editing}
                submitLabel={submitting ? "Menyimpan..." : "Simpan Perubahan"}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(null)}
              />
            ) : null}
          </DialogContent>
        </Dialog>

        {/* HAPUS */}
        <ConfirmDialog
          open={Boolean(deleting)}
          onOpenChange={(v) => !v && setDeleting(null)}
          title="Hapus pengeluaran?"
          description="Data yang dihapus akan mengubah saldo BUMDes secara otomatis."
          onConfirm={handleDelete}
        />
      </div>
    </>
  );
}

export default UangKeluarPage;

UangKeluarPage.layout = (page: ReactNode) => <AppShell>{page}</AppShell>;
