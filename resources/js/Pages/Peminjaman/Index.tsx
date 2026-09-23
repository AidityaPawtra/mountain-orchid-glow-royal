import { useMemo, useState, type ReactNode } from "react";
import { router, Head, usePage } from "@inertiajs/react";
import { AlertTriangle, Boxes, Package, PackageCheck, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { LoanForm } from "@/components/forms/loan-form";
import { PageHeader } from "@/components/layout/page-header";
import { LoanStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
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
import { itemStats, loanStats, matchesQuery, withResolvedLoans } from "@/lib/finance";
import { formatDate } from "@/lib/format";
import { usePagination } from "@/hooks/use-pagination";
import { mapItem, mapLoan } from "@/lib/mapper";
import { submitToServer } from "@/lib/submit";
import type { LoanStatus } from "@/lib/types";

function PeminjamanPage() {
  // Data peminjaman & barang berasal dari database (LoanController@index)
  const { loans: rawLoans, items: rawItems } = usePage<{
    loans: unknown[];
    items: unknown[];
  }>().props;
  const loans = useMemo(
    () => (Array.isArray(rawLoans) ? rawLoans.map(mapLoan) : []),
    [rawLoans],
  );
  const items = useMemo(
    () => (Array.isArray(rawItems) ? rawItems.map(mapItem) : []),
    [rawItems],
  );

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | LoanStatus>("all");
  const [open, setOpen] = useState(false);

  const resolved = useMemo(() => withResolvedLoans(loans), [loans]);
  const stats = loanStats(resolved);
  const inventory = itemStats(items);

  const filtered = useMemo(() => {
    return resolved
      .filter((row) => status === "all" || row.status === status)
      .filter((row) =>
        matchesQuery([row.borrowerName, row.itemName, row.purpose, row.phone], query),
      )
      .sort((a, b) => b.borrowDate.localeCompare(a.borrowDate) || b.createdAt.localeCompare(a.createdAt));
  }, [resolved, status, query]);

  const pager = usePagination(filtered);

  return (
    <>
      <Head title="Peminjaman Barang - BUMDes Desa Wengkal" />
      <div className="space-y-6">
        <PageHeader
          title="Peminjaman Barang"
          description="Kelola seluruh data peminjaman barang BUMDes."
          actions={
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" />
              Tambah Peminjaman
            </Button>
          }
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Barang" value={String(inventory.total)} hint={`${inventory.units} unit`} icon={Boxes} />
          <StatCard label="Barang sedang dipinjam" value={String(inventory.borrowed)} icon={Package} tone="warning" />
          <StatCard label="Barang tersedia" value={String(inventory.available)} icon={PackageCheck} tone="success" />
          <StatCard label="Peminjaman terlambat" value={String(stats.overdue)} icon={AlertTriangle} tone="danger" />
        </section>

        <div className="grid gap-3 md:grid-cols-[1fr_200px]">
          <SearchBar
            value={query}
            onChange={(v) => { setQuery(v); pager.setPage(1); }}
            placeholder="Cari peminjam, barang, atau keperluan"
          />
          <Select
            value={status}
            onChange={(e) => { setStatus(e.target.value as typeof status); pager.setPage(1); }}
          >
            <option value="all">Semua status</option>
            <option value="borrowed">Dipinjam</option>
            <option value="returned">Dikembalikan</option>
            <option value="overdue">Terlambat</option>
          </Select>
        </div>

        <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-card)]">
          {filtered.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="Tidak ada data peminjaman"
                description="Buat peminjaman baru untuk warga atau lembaga desa."
                action={<Button onClick={() => setOpen(true)}>Tambah Peminjaman</Button>}
              />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14">No</TableHead>
                    <TableHead>Nama Peminjam</TableHead>
                    <TableHead>Barang</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Tanggal Pinjam</TableHead>
                    <TableHead>Rencana Kembali</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pager.slice.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer"
                      onClick={() => router.visit(`/peminjaman/${row.id}`)}
                    >
                      <TableCell className="tabular-nums text-muted-foreground">
                        {(pager.page - 1) * pager.pageSize + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{row.borrowerName}</TableCell>
                      <TableCell>{row.itemName}</TableCell>
                      <TableCell className="tabular-nums">{row.quantity}</TableCell>
                      <TableCell>{formatDate(row.borrowDate)}</TableCell>
                      <TableCell>{formatDate(row.returnDate)}</TableCell>
                      <TableCell>
                        <LoanStatusBadge status={row.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            router.visit(`/peminjaman/${row.id}`);
                          }}
                        >
                          Detail
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Tambah Peminjaman</DialogTitle>
              <DialogDescription>Stok barang akan berkurang otomatis setelah disimpan.</DialogDescription>
            </DialogHeader>
            <LoanForm
              items={items}
              submitLabel="Simpan"
              onCancel={() => setOpen(false)}
              onSubmit={async (value) => {
                const result = await submitToServer("post", "/peminjaman", value);
                if (!result.ok) return result;
                setOpen(false);
                toast.success("Peminjaman berhasil dicatat.");
                return { ok: true };
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default PeminjamanPage;

PeminjamanPage.layout = (page: ReactNode) => <AppShell>{page}</AppShell>;
