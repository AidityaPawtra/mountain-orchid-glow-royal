import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { itemAvailability } from "@/lib/finance";
import { todayISO } from "@/lib/format";
import type { InventoryItem, LoanRecord } from "@/lib/types";

export type LoanFormResult =
  | { ok: true; message?: undefined }
  | { ok: false; message: string };

export type LoanFormValue = {
  borrowerName: string;
  phone: string;
  itemId: string;
  quantity: number;
  borrowDate: string;
  returnDate: string;
  purpose: string;
  notes: string;
};

export function LoanForm({
  items,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  items: InventoryItem[];
  initial?: Partial<LoanRecord>;
  submitLabel: string;
  /**
   * Boleh sinkron atau Promise. Untuk simpan ke database, kembalikan
   * Promise dari submitToServer() supaya pesan error dari server
   * (mis. stok tidak cukup) tampil di dalam form.
   */
  onSubmit: (value: LoanFormValue) => LoanFormResult | Promise<LoanFormResult>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<LoanFormValue>({
    borrowerName: initial?.borrowerName ?? "",
    phone: initial?.phone ?? "",
    itemId: initial?.itemId ?? items[0]?.id ?? "",
    quantity: initial?.quantity ?? 1,
    borrowDate: initial?.borrowDate ?? todayISO(),
    returnDate: initial?.returnDate ?? todayISO(),
    purpose: initial?.purpose ?? "",
    notes: initial?.notes ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selected = items.find((item) => item.id === form.itemId);
  const available = useMemo(() => {
    if (!selected) return 0;
    const restored = initial?.itemId === selected.id ? initial.quantity ?? 0 : 0;
    return itemAvailability(selected) + restored;
  }, [selected, initial]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const nextErrors: Record<string, string> = {};
    if (!form.borrowerName.trim()) nextErrors.borrowerName = "Nama peminjam wajib diisi.";
    if (!form.phone.trim()) nextErrors.phone = "Nomor HP wajib diisi.";
    if (!form.itemId) nextErrors.itemId = "Barang wajib dipilih.";
    if (!form.purpose.trim()) nextErrors.purpose = "Keperluan wajib diisi.";
    if (!form.borrowDate) nextErrors.borrowDate = "Tanggal pinjam wajib diisi.";
    if (!form.returnDate) nextErrors.returnDate = "Rencana kembali wajib diisi.";
    if (form.returnDate && form.borrowDate && form.returnDate < form.borrowDate) {
      nextErrors.returnDate = "Tanggal kembali tidak boleh lebih awal dari tanggal pinjam.";
    }
    if (!Number.isFinite(form.quantity) || form.quantity <= 0) {
      nextErrors.quantity = "Jumlah harus lebih dari 0.";
    } else if (form.quantity > available) {
      nextErrors.quantity = `Jumlah tidak boleh melebihi stok tersedia (${available}).`;
    }
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      const result = await onSubmit({
        ...form,
        borrowerName: form.borrowerName.trim(),
        phone: form.phone.trim(),
        purpose: form.purpose.trim(),
        notes: form.notes.trim(),
      });
      if (!result.ok) setFormError(result.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {formError ? (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{formError}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama Peminjam" htmlFor="loan-name" required error={errors.borrowerName}>
          <Input
            id="loan-name"
            value={form.borrowerName}
            onChange={(e) => setForm({ ...form, borrowerName: e.target.value })}
          />
        </Field>
        <Field label="No. HP" htmlFor="loan-phone" required error={errors.phone}>
          <Input
            id="loan-phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="08xxxxxxxxxx"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Barang" htmlFor="loan-item" required error={errors.itemId}>
          <Select
            id="loan-item"
            value={form.itemId}
            onChange={(e) => setForm({ ...form, itemId: e.target.value, quantity: 1 })}
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Jumlah" htmlFor="loan-qty" required error={errors.quantity}>
          <Input
            id="loan-qty"
            type="number"
            min={1}
            max={available}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          />
          <p className="text-xs text-muted-foreground">Stok tersedia: {available}</p>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tanggal Pinjam" htmlFor="loan-from" required error={errors.borrowDate}>
          <Input
            id="loan-from"
            type="date"
            value={form.borrowDate}
            onChange={(e) => setForm({ ...form, borrowDate: e.target.value })}
          />
        </Field>
        <Field label="Rencana Kembali" htmlFor="loan-to" required error={errors.returnDate}>
          <Input
            id="loan-to"
            type="date"
            value={form.returnDate}
            onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Keperluan" htmlFor="loan-purpose" required error={errors.purpose}>
        <Input
          id="loan-purpose"
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
        />
      </Field>
      <Field label="Catatan" htmlFor="loan-notes">
        <Textarea
          id="loan-notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </Field>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
