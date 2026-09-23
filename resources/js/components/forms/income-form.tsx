import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { INCOME_CATEGORIES } from "@/lib/constants";
import { readProofFile } from "@/lib/file";
import { parseAmount, todayISO } from "@/lib/format";
import type { IncomeRecord, ProofFile } from "@/lib/types";

export type IncomeFormValue = Omit<IncomeRecord, "id" | "createdAt">;

const EMPTY: IncomeFormValue = {
  bumdesTypeId: "",
  date: "",
  source: "",
  category: "",
  description: "",
  amount: 0,
  proof: null,
};

export function IncomeForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  bumdesTypeId,
  hideCategory = false,
}: {
  initial?: IncomeFormValue;
  submitLabel: string;
  onSubmit: (value: IncomeFormValue) => void;
  onCancel: () => void;
  bumdesTypeId?: string;
  /**
   * Sembunyikan pemilihan kategori (dipakai di halaman Jenis BUMDes).
   * Kategori tetap terisi otomatis dengan "Lainnya" di baliknya,
   * supaya kolom category di database tetap terisi.
   */
  hideCategory?: boolean;
}) {
  const [form, setForm] = useState<IncomeFormValue>({
  ...(initial ?? EMPTY),
  bumdesTypeId: initial?.bumdesTypeId ?? bumdesTypeId ?? "",
});
  const [amountText, setAmountText] = useState(initial?.amount ? String(initial.amount) : "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(next: IncomeFormValue, rawAmount: string) {
    const nextErrors: Record<string, string> = {};
    if (!next.date) nextErrors.date = "Tanggal wajib diisi.";
    if (!next.source.trim()) nextErrors.source = "Sumber dana wajib diisi.";
    if (!hideCategory && !next.category) nextErrors.category = "Kategori wajib dipilih.";
    if (!next.description.trim()) nextErrors.description = "Keterangan wajib diisi.";
    const amount = parseAmount(rawAmount);
    if (!rawAmount.trim()) nextErrors.amount = "Jumlah wajib diisi.";
    else if (!Number.isFinite(amount) || amount <= 0) nextErrors.amount = "Jumlah harus berupa angka lebih dari 0.";
    return { nextErrors, amount };
  }

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
    const { nextErrors, amount } = validate(form, amountText);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
   onSubmit({
  ...form,
  bumdesTypeId: form.bumdesTypeId || bumdesTypeId || "",
  category: hideCategory ? (form.category || "Lainnya") : form.category,
  amount,
  source: form.source.trim(),
  description: form.description.trim(),
});
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className={hideCategory ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Tanggal" htmlFor="inc-date" required error={errors.date}>
          <Input
            id="inc-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </Field>
        {!hideCategory ? (
          <Field label="Kategori" htmlFor="inc-cat" required error={errors.category}>
            <Select
  id="inc-cat"
  value={form.category}
  onChange={(e) =>
    setForm({ ...form, category: e.target.value })
  }
>
  <option value="">Pilih kategori</option>

  {INCOME_CATEGORIES.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</Select>
          </Field>
        ) : null}
      </div>
      <Field label="Sumber Dana" htmlFor="inc-source" required error={errors.source}>
        <Input
          id="inc-source"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          placeholder="Contoh: Unit Usaha"
        />
      </Field>
      <Field label="Jumlah" htmlFor="inc-amount" required error={errors.amount}>
        <Input
          id="inc-amount"
          inputMode="numeric"
          value={amountText}
          onChange={(e) => setAmountText(e.target.value)}
          placeholder="500000"
        />
      </Field>
      <Field label="Keterangan" htmlFor="inc-desc" required error={errors.description}>
        <Textarea
          id="inc-desc"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Uraian pemasukan"
        />
      </Field>
      <Field label="Bukti Transaksi" htmlFor="inc-proof">
        <Input
          id="inc-proof"
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
