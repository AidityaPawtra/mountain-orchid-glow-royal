import { useMemo, useState, type ReactNode } from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import {
  Building2,
  Pencil,
  Plus,
  Search,
  Trash2,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { mapBumdesType } from "@/lib/mapper";
import { submitToServer } from "@/lib/submit";
import type { BumdesType } from "@/lib/types";

type FormData = {
  name: string;
  category: string;
  description: string;
  status: BumdesType["status"];
};

const emptyForm: FormData = {
  name: "",
  category: "",
  description: "",
  status: "active",
};

function JenisBumdesPage() {
  // Data unit usaha berasal dari database (BumdesTypeController@index)
  const { bumdesTypes: rawTypes } = usePage<{ bumdesTypes: unknown[] }>().props;
  const bumdesTypes: BumdesType[] = useMemo(
    () => (Array.isArray(rawTypes) ? rawTypes.map(mapBumdesType) : []),
    [rawTypes],
  );

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const filteredBumdes = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return bumdesTypes;

    return bumdesTypes.filter((item) =>
      [item.name, item.category, item.description]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [bumdesTypes, search]);

  const openAddDialog = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setDialogOpen(true);
  };

  const openEditDialog = (item: BumdesType) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      status: item.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const category = form.category.trim();
    const description = form.description.trim();

    if (!name) {
      toast.error("Nama BUMDes wajib diisi.");
      return;
    }

    if (!category) {
      toast.error("Kategori BUMDes wajib diisi.");
      return;
    }

    const payload = {
      name,
      category,
      description,
      status: form.status,
    };

    const result = editingId
      ? await submitToServer("put", `/jenis-bumdes/${editingId}`, payload)
      : await submitToServer("post", "/jenis-bumdes", payload);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(
      editingId
        ? "Jenis BUMDes berhasil diperbarui."
        : "Jenis BUMDes berhasil ditambahkan.",
    );

    setDialogOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  const handleDelete = async (item: BumdesType) => {
    const confirmed = window.confirm(
      `Hapus "${item.name}"?\n\nData jenis BUMDes ini akan dihapus dari sistem.`
    );

    if (!confirmed) return;

    const result = await submitToServer("delete", `/jenis-bumdes/${item.id}`);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Jenis BUMDes berhasil dihapus.");
  };

  const activeCount = bumdesTypes.filter((item) => item.status === "active").length;
  const inactiveCount = bumdesTypes.filter((item) => item.status === "inactive").length;

  return (
    <>
      <Head title="Jenis BUMDes - BUMDes Desa Wengkal" />
      <div className="space-y-6 pb-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="size-4" />
              <span>Manajemen BUMDes</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Jenis BUMDes
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Kelola unit usaha BUMDes dan lihat pengelolaan keuangan masing-masing unit.
            </p>
          </div>

          <Button type="button" className="gap-2" onClick={openAddDialog}>
            <Plus className="size-4" />
            Tambah Jenis BUMDes
          </Button>
        </div>

        {/* SUMMARY */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Jenis BUMDes</p>
                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {bumdesTypes.length}
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="size-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">BUMDes Aktif</p>
                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {activeCount}
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <WalletCards className="size-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nonaktif</p>
                <p className="mt-2 text-2xl font-bold tracking-tight">
                  {inactiveCount}
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Building2 className="size-5" />
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, kategori, atau deskripsi BUMDes..."
              className="pl-9"
            />
          </div>
        </div>

        {/* LIST */}
        {filteredBumdes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
              <Building2 className="size-7 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-base font-semibold text-foreground">
              {search.trim() ? "BUMDes tidak ditemukan" : "Belum ada jenis BUMDes"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {search.trim()
                ? "Coba gunakan kata kunci pencarian yang berbeda."
                : "Tambahkan jenis BUMDes pertama untuk mulai mengelola unit usaha."}
            </p>

            {!search.trim() && (
              <Button type="button" className="mt-5 gap-2" onClick={openAddDialog}>
                <Plus className="size-4" />
                Tambah Jenis BUMDes
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredBumdes.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-foreground">
                        {item.name}
                      </h2>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <span
                    className={
                      item.status === "active"
                        ? "shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600"
                        : "shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {item.status === "active" ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                <p className="mt-5 min-h-[60px] text-sm leading-5 text-muted-foreground">
                  {item.description || "Tidak ada deskripsi untuk unit BUMDes ini."}
                </p>

                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                  <Link
                    href={`/jenis-bumdes/${item.id}`}
                    className="min-w-0 flex-1"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <WalletCards className="size-4" />
                      Lihat Keuangan
                    </Button>
                  </Link>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Edit"
                    onClick={() => openEditDialog(item)}
                  >
                    <Pencil className="size-4" />
                    <span className="sr-only">Edit</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Hapus"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Hapus</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DIALOG */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Jenis BUMDes" : "Tambah Jenis BUMDes"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Perbarui informasi unit BUMDes."
                  : "Tambahkan unit usaha BUMDes baru."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="bumdes-name" className="text-sm font-medium text-foreground">
                  Nama BUMDes <span className="ml-1 text-destructive">*</span>
                </label>
                <Input
                  id="bumdes-name"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Contoh: Unit Perdagangan"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bumdes-category" className="text-sm font-medium text-foreground">
                  Kategori <span className="ml-1 text-destructive">*</span>
                </label>
                <Input
                  id="bumdes-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  placeholder="Contoh: Perdagangan"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bumdes-status" className="text-sm font-medium text-foreground">
                  Status
                </label>
                <Select
                  id="bumdes-status"
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value as BumdesType["status"],
                    })
                  }
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="bumdes-description" className="text-sm font-medium text-foreground">
                  Deskripsi
                </label>
                <textarea
                  id="bumdes-description"
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Jelaskan kegiatan atau fungsi unit BUMDes..."
                  rows={4}
                  className="flex min-h-24 w-full resize-none rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/40"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit">
                  {editingId ? "Simpan Perubahan" : "Tambah BUMDes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default JenisBumdesPage;

JenisBumdesPage.layout = (page: ReactNode) => <AppShell>{page}</AppShell>;
