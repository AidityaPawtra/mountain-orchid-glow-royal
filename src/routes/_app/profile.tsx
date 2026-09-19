import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import type { AppSettings } from "@/lib/types";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilPage,
});

function ProfilPage() {
  const settings = useAppStore((s) => s.settings);
  const saveSettings = useAppStore((s) => s.saveSettings);
  const restoreDemo = useAppStore((s) => s.restoreDemo);
  const [form, setForm] = useState<AppSettings>(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetOpen, setResetOpen] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.bumdesName.trim()) nextErrors.bumdesName = "Nama BUMDes wajib diisi.";
    if (!form.villageName.trim()) nextErrors.villageName = "Nama desa wajib diisi.";
    if (!form.adminName.trim()) nextErrors.adminName = "Nama admin wajib diisi.";
    if (!form.adminUsername.trim()) nextErrors.adminUsername = "Username wajib diisi.";
    if (!form.adminEmail.trim()) nextErrors.adminEmail = "Email admin wajib diisi.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    saveSettings({
      ...form,
      bumdesName: form.bumdesName.trim(),
      villageName: form.villageName.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      adminName: form.adminName.trim(),
      adminUsername: form.adminUsername.trim(),
      adminEmail: form.adminEmail.trim(),
    });
    toast.success("Perubahan profil disimpan.");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil"
        description="Kelola profil BUMDes dan akun administrator."
      />

      <form onSubmit={handleSubmit} className="grid gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Profil BUMDes</CardTitle>
            <CardDescription>Identitas lembaga yang tampil pada laporan dan halaman login.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama BUMDes" htmlFor="set-bumdes" required error={errors.bumdesName}>
              <Input
                id="set-bumdes"
                value={form.bumdesName}
                onChange={(e) => setForm({ ...form, bumdesName: e.target.value })}
              />
            </Field>
            <Field label="Nama Desa" htmlFor="set-desa" required error={errors.villageName}>
              <Input
                id="set-desa"
                value={form.villageName}
                onChange={(e) => setForm({ ...form, villageName: e.target.value })}
              />
            </Field>
            <Field label="Alamat" htmlFor="set-alamat" className="sm:col-span-2">
              <Textarea
                id="set-alamat"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </Field>
            <Field label="Nomor Telepon" htmlFor="set-tel">
              <Input
                id="set-tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <Field label="Email" htmlFor="set-email">
              <Input
                id="set-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profil Admin</CardTitle>
            <CardDescription>Nama dan akun yang digunakan untuk masuk ke sistem.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama" htmlFor="adm-name" required error={errors.adminName}>
              <Input
                id="adm-name"
                value={form.adminName}
                onChange={(e) => setForm({ ...form, adminName: e.target.value })}
              />
            </Field>
            <Field label="Username" htmlFor="adm-user" required error={errors.adminUsername}>
              <Input
                id="adm-user"
                value={form.adminUsername}
                onChange={(e) => setForm({ ...form, adminUsername: e.target.value })}
              />
            </Field>
            <Field label="Email" htmlFor="adm-email" required error={errors.adminEmail} className="sm:col-span-2">
              <Input
                id="adm-email"
                type="email"
                value={form.adminEmail}
                onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
              />
            </Field>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={() => setResetOpen(true)}>
            Pulihkan data contoh
          </Button>
          <Button type="submit">Simpan Perubahan</Button>
        </div>
      </form>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Pulihkan data contoh?"
        description="Semua transaksi, barang, dan peminjaman akan dikembalikan ke data awal. Profil saat ini tidak diubah."
        confirmLabel="Pulihkan"
        destructive
        onConfirm={() => {
          restoreDemo();
          toast.success("Data contoh dipulihkan.");
        }}
      />
    </div>
  );
}
