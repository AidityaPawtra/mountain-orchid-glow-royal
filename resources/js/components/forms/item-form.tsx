import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from "@/lib/constants";
import type { InventoryItem, ItemCondition } from "@/lib/types";

export type ItemFormValue = Omit<InventoryItem, "id">;

export function ItemForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: ItemFormValue;
  submitLabel: string;
  onSubmit: (value: ItemFormValue) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ItemFormValue>(
    initial ?? {
      name: "",
      category: "Perlengkapan",
      quantity: 1,
      borrowed: 0,
      condition: "Baik",
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Nama barang wajib diisi.";
    if (!form.category) nextErrors.category = "Kategori wajib dipilih.";
    if (!Number.isFinite(form.quantity) || form.quantity <= 0) {
      nextErrors.quantity = "Jumlah harus lebih dari 0.";
    }
    if (form.quantity < form.borrowed) {
      nextErrors.quantity = `Jumlah tidak boleh lebih kecil dari yang sedang dipinjam (${form.borrowed}).`;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({ ...form, name: form.name.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="Nama Barang" htmlFor="item-name" required error={errors.name}>
        <Input
          id="item-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kategori" htmlFor="item-cat" required error={errors.category}>
          <Select
            id="item-cat"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Kondisi" htmlFor="item-cond">
          <Select
            id="item-cond"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value as ItemCondition })}
          >
            {ITEM_CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Jumlah Total" htmlFor="item-qty" required error={errors.quantity}>
        <Input
          id="item-qty"
          type="number"
          min={1}
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
        />
      </Field>
      {initial ? (
        <p className="text-xs text-muted-foreground">Sedang dipinjam: {form.borrowed} unit</p>
      ) : null}
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
