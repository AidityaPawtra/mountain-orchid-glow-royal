import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { LoanForm } from "@/components/forms/loan-form";
import { PageHeader } from "@/components/layout/page-header";
import { LoanStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resolveLoanStatus } from "@/lib/finance";
import { formatDate } from "@/lib/format";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/_app/peminjaman/$id")({
  component: LoanDetailPage,
});

function LoanDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const loan = useAppStore((s) => s.loans.find((row) => row.id === id));
  const items = useAppStore((s) => s.items);
  const returnLoan = useAppStore((s) => s.returnLoan);
  const updateLoan = useAppStore((s) => s.updateLoan);
  const deleteLoan = useAppStore((s) => s.deleteLoan);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!loan) {
    return (
      <div className="space-y-4">
        <Link to="/peminjaman" className="inline-flex items-center gap-2 text-sm text-primary">
          <ArrowLeft className="size-4" />
          Kembali
        </Link>
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Data peminjaman tidak ditemukan.
        </Card>
      </div>
    );
  }

  const status = resolveLoanStatus(loan);
  const canReturn = status !== "returned";

  function handleReturn() {
    const result = returnLoan(loan!.id);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Barang ditandai sudah dikembalikan. Stok bertambah otomatis.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detail Peminjaman"
        description="Informasi lengkap peminjaman barang BUMDes."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void navigate({ to: "/peminjaman" })}>
              <ArrowLeft className="size-4" />
              Kembali
            </Button>
            {canReturn ? (
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="size-4" />
                Edit
              </Button>
            ) : null}
            <Button variant="destructive" onClick={() => setDeleting(true)}>
              <Trash2 className="size-4" />
              Hapus
            </Button>
          </div>
        }
      />

      <Card className="p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{loan.borrowerName}</h2>
          <LoanStatusBadge status={status} />
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Info label="Nama Peminjam" value={loan.borrowerName} />
          <Info label="No. HP" value={loan.phone} />
          <Info label="Barang" value={loan.itemName} />
          <Info label="Jumlah" value={String(loan.quantity)} />
          <Info label="Tanggal Pinjam" value={formatDate(loan.borrowDate)} />
          <Info label="Rencana Kembali" value={formatDate(loan.returnDate)} />
          <Info label="Keperluan" value={loan.purpose} />
          <Info label="Catatan" value={loan.notes || "—"} />
          <Info label="Status" value={status === "borrowed" ? "Dipinjam" : status === "overdue" ? "Terlambat" : "Dikembalikan"} />
          {loan.actualReturnDate ? (
            <Info label="Tanggal Dikembalikan" value={formatDate(loan.actualReturnDate)} />
          ) : null}
        </dl>

        {canReturn ? (
          <div className="mt-6 border-t border-border pt-5">
            <Button onClick={handleReturn}>Tandai Sudah Dikembalikan</Button>
          </div>
        ) : null}
      </Card>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Peminjaman</DialogTitle>
            <DialogDescription>Perubahan jumlah akan menyesuaikan stok barang.</DialogDescription>
          </DialogHeader>
          <LoanForm
            items={items}
            initial={loan}
            submitLabel="Simpan Perubahan"
            onCancel={() => setEditing(false)}
            onSubmit={(value) => {
              const result = updateLoan(loan.id, value);
              if (!result.ok) return result;
              setEditing(false);
              toast.success("Data peminjaman diperbarui.");
              return { ok: true };
            }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleting}
        onOpenChange={setDeleting}
        title="Hapus peminjaman?"
        description="Jika barang masih dipinjam, stok akan dikembalikan ke inventaris."
        onConfirm={() => {
          deleteLoan(loan.id);
          toast.success("Data peminjaman dihapus.");
          void navigate({ to: "/peminjaman" });
        }}
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
