import { useMemo, useState, type ReactNode } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { ItemForm, type ItemFormValue } from "@/components/forms/item-form";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITEM_CATEGORIES } from "@/lib/constants";
import { itemAvailability, matchesQuery } from "@/lib/finance";
import { usePagination } from "@/hooks/use-pagination";
import { mapItem } from "@/lib/mapper";
import { submitToServer } from "@/lib/submit";
import type { InventoryItem } from "@/lib/types";

function BarangPage() {
  // Data barang berasal dari database (InventoryItemController@index)
  const { items: rawItems } = usePage<{ items: unknown[] }>().props;
  const items: InventoryItem[] = useMemo(
    () => (Array.isArray(rawItems) ? rawItems.map(mapItem) : []),
    [rawItems],
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [deleting, setDeleting] = useState<InventoryItem | null>(null);

  const filtered = useMemo(() => {
    return items
      .filter((row) => category === "all" || row.category === category)
      .filter((row) => matchesQuery([row.name, row.category, row.condition], query));
  }, [items, category, query]);

  const pager = usePagination(filtered);

  async function handleCreate(value: ItemFormValue) {
    const result = await submitToServer("post", "/barang", {
      name: value.name,
      category: value.category,
      quantity: value.quantity,
      condition: value.condition,
    });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setOpen(false);
    toast.success("Barang berhasil ditambahkan.");
  }

  async function handleUpdate(value: ItemFormValue) {
    if (!editing) return;
    const result = await submitToServer("put", `/barang/${editing.id}`, {
      name: value.name,
      category: value.category,
      quantity: value.quantity,
      condition: value.condition,
    });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setEditing(null);
    toast.success("Data barang diperbarui.");
  }

  async function handleDelete() {
    if (!deleting) return;
    const target = deleting;
    setDeleting(null);
    if (target.borrowed > 0) {
      toast.error("Barang tidak dapat dihapus karena masih ada yang dipinjam.");
      return;
    }
    const result = await submitToServer("delete", `/barang/${target.id}`);
    if (!result.ok) toast.error(result.message);
    else toast.success("Barang dihapus.");
  }

  return (
    <>
      <Head title="Data Barang - BUMDes Desa Wengkal" />
      <div className="space-y-6">
        <PageHeader
          title="Data Barang"
          description="Kelola inventaris barang yang dapat dipinjam warga desa."
          actions={
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" />
              Tambah Barang
            </Button>
          }
        />

        <div className="grid gap-3 md:grid-cols-[1fr_200px]">
          <SearchBar
            value={query}
            onChange={(v) => { setQuery(v); pager.setPage(1); }}
            placeholder="Cari nama atau kategori barang"
          />
          <Select value={category} onChange={(e) => { setCategory(e.target.value); pager.setPage(1); }}>
            <option value="all">Semua kategori</option>
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>

        <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-card)]">
          {filtered.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="Belum ada data barang"
                description="Tambahkan inventaris agar peminjaman dapat dicatat."
                action={<Button onClick={() => setOpen(true)}>Tambah Barang</Button>}
              />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14">No</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Tersedia</TableHead>
                    <TableHead>Dipinjam</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pager.slice.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {(pager.page - 1) * pager.pageSize + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell className="tabular-nums">{row.quantity}</TableCell>
                      <TableCell className="tabular-nums">{itemAvailability(row)}</TableCell>
                      <TableCell className="tabular-nums">{row.borrowed}</TableCell>
                      <TableCell>{row.condition}</TableCell>
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Barang</DialogTitle>
              <DialogDescription>Masukkan data inventaris baru.</DialogDescription>
            </DialogHeader>
            <ItemForm
              submitLabel="Simpan"
              onCancel={() => setOpen(false)}
              onSubmit={handleCreate}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(editing)} onOpenChange={(v) => !v && setEditing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Barang</DialogTitle>
              <DialogDescription>Perbarui data inventaris.</DialogDescription>
            </DialogHeader>
            {editing ? (
              <ItemForm
                initial={editing}
                submitLabel="Simpan Perubahan"
                onCancel={() => setEditing(null)}
                onSubmit={handleUpdate}
              />
            ) : null}
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={Boolean(deleting)}
          onOpenChange={(v) => !v && setDeleting(null)}
          title="Hapus barang?"
          description="Barang yang masih dipinjam tidak dapat dihapus."
          onConfirm={handleDelete}
        />
      </div>
    </>
  );
}

export default BarangPage;

BarangPage.layout = (page: ReactNode) => <AppShell>{page}</AppShell>;
