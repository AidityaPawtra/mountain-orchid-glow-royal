import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { readProofFile } from "@/lib/file";
import { parseAmount, todayISO } from "@/lib/format";
import type { ExpenseRecord, ProofFile } from "@/lib/types";

export type ExpenseFormValue = Omit<ExpenseRecord, "id" | "createdAt">;

const EMPTY: ExpenseFormValue = {
  date: todayISO(),
  category: "Operasional",
  purpose: "",
  description: "",
  amount: 0,
  proof: null,
};

export function ExpenseForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: ExpenseFormValue;
  submitLabel: string;
  onSubmit: (value: ExpenseFormValue) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ExpenseFormValue>(initial ?? EMPTY);
  const [amountText, setAmountText] = useState(initial?.amount ? String(initial.amount) : "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleProof(file?: File) {
    if (!file) {
      setForm((prev) => ({ ...prev, proof: null }));
      return;
    }
    const proof: ProofFile = await readProofFile(file);
    setForm((prev) => ({ ...prev, proof }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.date) nextErrors.date = "Tanggal wajib diisi.";
    if (!form.category) nextErrors.category = "Kategori wajib dipilih.";
    if (!form.purpose.trim()) nextErrors.purpose = "Keperluan wajib diisi.";
    if (!form.description.trim()) nextErrors.description = "Keterangan wajib diisi.";
    const amount = parseAmount(amountText);
    if (!amountText.trim()) nextErrors.amount = "Jumlah wajib diisi.";
    else if (!Number.isFinite(amount) || amount <= 0) nextErrors.amount = "Jumlah harus berupa angka lebih dari 0.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({
      ...form,
      amount,
      purpose: form.purpose.trim(),
      description: form.description.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tanggal" htmlFor="exp-date" required error={errors.date}>
          <Input
            id="exp-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </Field>
        <Field label="Kategori" htmlFor="exp-cat" required error={errors.category}>
          <Select
            id="exp-cat"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Keperluan" htmlFor="exp-purpose" required error={errors.purpose}>
        <Input
          id="exp-purpose"
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          placeholder="Contoh: Pembelian ATK"
        />
      </Field>
      <Field label="Jumlah" htmlFor="exp-amount" required error={errors.amount}>
        <Input
          id="exp-amount"
          inputMode="numeric"
          value={amountText}
          onChange={(e) => setAmountText(e.target.value)}
          placeholder="250000"
        />
      </Field>
      <Field label="Keterangan" htmlFor="exp-desc" required error={errors.description}>
        <Textarea
          id="exp-desc"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </Field>
      <Field label="Bukti Transaksi" htmlFor="exp-proof">
        <Input
          id="exp-proof"
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => void handleProof(e.target.files?.[0])}
        />
        {form.proof?.name ? (
          <p className="text-xs text-muted-foreground">Berkas: {form.proof.name}</p>
        ) : null}
      </Field>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
