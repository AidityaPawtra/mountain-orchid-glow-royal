import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import {
  updateUserPassword,
  verifyUserPassword,
} from "@/lib/password";
import type { AppSettings } from "@/lib/types";

export const Route = createFileRoute(
  "/_app/profile",
)({
  component: ProfilPage,
});

function ProfilPage() {
  const settings = useAppStore(
    (s) => s.settings,
  );

  const session = useAppStore(
    (s) => s.session,
  );

  const saveSettings = useAppStore(
    (s) => s.saveSettings,
  );

  const restoreDemo = useAppStore(
    (s) => s.restoreDemo,
  );

  const [form, setForm] =
    useState<AppSettings>(settings);

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [resetOpen, setResetOpen] =
    useState(false);

  // ==================================================
  // PASSWORD
  // ==================================================

  const [
    passwordOpen,
    setPasswordOpen,
  ] = useState(false);

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    passwordErrors,
    setPasswordErrors,
  ] = useState<Record<string, string>>(
    {},
  );

  const [
    passwordSubmitting,
    setPasswordSubmitting,
  ] = useState(false);

  // ==================================================
  // PROFILE SUBMIT
  // ==================================================

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const nextErrors: Record<
      string,
      string
    > = {};

    if (!form.bumdesName.trim()) {
      nextErrors.bumdesName =
        "Nama BUMDes wajib diisi.";
    }

    if (!form.villageName.trim()) {
      nextErrors.villageName =
        "Nama desa wajib diisi.";
    }

    if (!form.adminName.trim()) {
      nextErrors.adminName =
        "Nama admin wajib diisi.";
    }

    if (!form.adminUsername.trim()) {
      nextErrors.adminUsername =
        "Username wajib diisi.";
    }

    if (!form.adminEmail.trim()) {
      nextErrors.adminEmail =
        "Email admin wajib diisi.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    saveSettings({
      ...form,
      bumdesName:
        form.bumdesName.trim(),
      villageName:
        form.villageName.trim(),
      address:
        form.address.trim(),
      phone:
        form.phone.trim(),
      email:
        form.email.trim(),
      adminName:
        form.adminName.trim(),
      adminUsername:
        form.adminUsername.trim(),
      adminEmail:
        form.adminEmail.trim(),
    });

    toast.success(
      "Perubahan profil disimpan.",
    );
  }

  // ==================================================
  // OPEN CHANGE PASSWORD
  // ==================================================

  function openChangePassword() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({});
    setPasswordOpen(true);
  }

  // ==================================================
  // CHANGE PASSWORD
  // ==================================================

  function handleChangePassword(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const nextErrors: Record<
      string,
      string
    > = {};

    if (!currentPassword) {
      nextErrors.currentPassword =
        "Password saat ini wajib diisi.";
    }

    if (!newPassword) {
      nextErrors.newPassword =
        "Password baru wajib diisi.";
    } else if (
      newPassword.length < 8
    ) {
      nextErrors.newPassword =
        "Password baru minimal 8 karakter.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        "Konfirmasi password wajib diisi.";
    } else if (
      confirmPassword !== newPassword
    ) {
      nextErrors.confirmPassword =
        "Konfirmasi password tidak sama.";
    }

    if (
      currentPassword &&
      newPassword &&
      currentPassword === newPassword
    ) {
      nextErrors.newPassword =
        "Password baru harus berbeda dari password saat ini.";
    }

    setPasswordErrors(
      nextErrors,
    );

    if (Object.keys(nextErrors).length) {
      return;
    }

    if (!session?.userId) {
      setPasswordErrors({
        form: "Sesi pengguna tidak ditemukan. Silakan login kembali.",
      });
      return;
    }

    setPasswordSubmitting(true);

    const isValid =
      verifyUserPassword(
        session.userId,
        currentPassword,
      );

    if (!isValid) {
      setPasswordSubmitting(false);

      setPasswordErrors({
        currentPassword:
          "Password saat ini salah.",
      });

      return;
    }

    const updated =
      updateUserPassword(
        session.userId,
        newPassword,
      );

    setPasswordSubmitting(false);

    if (!updated) {
      setPasswordErrors({
        form: "Password gagal diperbarui. Silakan coba lagi.",
      });
      return;
    }

    setPasswordOpen(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({});

    toast.success(
      "Password berhasil diubah.",
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil"
        description="Kelola profil BUMDes dan akun administrator."
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-5"
      >
        {/* ==================================================
            PROFIL BUMDES
        ================================================== */}

        <Card>
          <CardHeader>
            <CardTitle>
              Profil BUMDes
            </CardTitle>

            <CardDescription>
              Identitas lembaga yang tampil pada laporan dan halaman login.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nama BUMDes"
              htmlFor="set-bumdes"
              required
              error={
                errors.bumdesName
              }
            >
              <Input
                id="set-bumdes"
                value={
                  form.bumdesName
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    bumdesName:
                      e.target.value,
                  })
                }
              />
            </Field>

            <Field
              label="Nama Desa"
              htmlFor="set-desa"
              required
              error={
                errors.villageName
              }
            >
              <Input
                id="set-desa"
                value={
                  form.villageName
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    villageName:
                      e.target.value,
                  })
                }
              />
            </Field>

            <Field
              label="Alamat"
              htmlFor="set-alamat"
              className="sm:col-span-2"
            >
              <Textarea
                id="set-alamat"
                value={
                  form.address
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    address:
                      e.target.value,
                  })
                }
              />
            </Field>

            <Field
              label="Nomor Telepon"
              htmlFor="set-tel"
            >
              <Input
                id="set-tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone:
                      e.target.value,
                  })
                }
              />
            </Field>

            <Field
              label="Email"
              htmlFor="set-email"
            >
              <Input
                id="set-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value,
                  })
                }
              />
            </Field>
          </CardContent>
        </Card>

        {/* ==================================================
            PROFIL ADMIN
        ================================================== */}

        <Card>
          <CardHeader>
            <CardTitle>
              Profil Admin
            </CardTitle>

            <CardDescription>
              Nama dan akun yang digunakan untuk masuk ke sistem.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nama"
              htmlFor="adm-name"
              required
              error={
                errors.adminName
              }
            >
              <Input
                id="adm-name"
                value={
                  form.adminName
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    adminName:
                      e.target.value,
                  })
                }
              />
            </Field>

            <Field
              label="Username"
              htmlFor="adm-user"
              required
              error={
                errors.adminUsername
              }
            >
              <Input
                id="adm-user"
                value={
                  form.adminUsername
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    adminUsername:
                      e.target.value,
                  })
                }
              />
            </Field>

            <Field
              label="Email"
              htmlFor="adm-email"
              required
              error={
                errors.adminEmail
              }
              className="sm:col-span-2"
            >
              <Input
                id="adm-email"
                type="email"
                value={
                  form.adminEmail
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    adminEmail:
                      e.target.value,
                  })
                }
              />
            </Field>
          </CardContent>
        </Card>

        {/* ==================================================
            KEAMANAN AKUN
        ================================================== */}

        <Card>
          <CardHeader>
            <CardTitle>
              Keamanan Akun
            </CardTitle>

            <CardDescription>
              Ubah password yang digunakan saat login ke sistem.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LockKeyhole className="size-5" />
                </div>

                <div>
                  <p className="font-medium text-foreground">
                    Password akun administrator
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Gunakan password baru minimal 8 karakter.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={
                  openChangePassword
                }
                className="shrink-0"
              >
                Ubah Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ==================================================
            BUTTON
        ================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setResetOpen(true)
            }
          >
            Pulihkan data contoh
          </Button>

          <Button type="submit">
            Simpan Perubahan
          </Button>
        </div>
      </form>

      {/* ==================================================
          CONFIRM RESET
      ================================================== */}

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={
          setResetOpen
        }
        title="Pulihkan data contoh?"
        description="Semua transaksi, barang, dan peminjaman akan dikembalikan ke data awal. Profil saat ini tidak diubah."
        confirmLabel="Pulihkan"
        destructive
        onConfirm={() => {
          restoreDemo();

          toast.success(
            "Data contoh dipulihkan.",
          );
        }}
      />

      {/* ==================================================
          CHANGE PASSWORD DIALOG
      ================================================== */}

      <Dialog
        open={passwordOpen}
        onOpenChange={
          setPasswordOpen
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Ubah Password
            </DialogTitle>

            <DialogDescription>
              Masukkan password saat ini, kemudian buat password baru.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={
              handleChangePassword
            }
            className="grid gap-4"
          >
            {passwordErrors.form ? (
              <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
                {
                  passwordErrors.form
                }
              </p>
            ) : null}

            {/* CURRENT PASSWORD */}

            <Field
              label="Password Saat Ini"
              htmlFor="current-password"
              required
              error={
                passwordErrors.currentPassword
              }
            >
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="current-password"
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  className="pl-9 pr-10"
                  autoComplete="current-password"
                  value={
                    currentPassword
                  }
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value,
                    )
                  }
                  placeholder="Masukkan password saat ini"
                />

                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setShowCurrentPassword(
                      (value) =>
                        !value,
                    )
                  }
                  aria-label={
                    showCurrentPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </Field>

            {/* NEW PASSWORD */}

            <Field
              label="Password Baru"
              htmlFor="new-password"
              required
              error={
                passwordErrors.newPassword
              }
            >
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="new-password"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  className="pl-9 pr-10"
                  autoComplete="new-password"
                  value={
                    newPassword
                  }
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value,
                    )
                  }
                  placeholder="Minimal 8 karakter"
                />

                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setShowNewPassword(
                      (value) =>
                        !value,
                    )
                  }
                  aria-label={
                    showNewPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </Field>

            {/* CONFIRM PASSWORD */}

            <Field
              label="Konfirmasi Password Baru"
              htmlFor="confirm-password"
              required
              error={
                passwordErrors.confirmPassword
              }
            >
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  className="pl-9 pr-10"
                  autoComplete="new-password"
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value,
                    )
                  }
                  placeholder="Ulangi password baru"
                />

                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) =>
                        !value,
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </Field>

            <p className="text-xs text-muted-foreground">
              Password baru minimal 8 karakter dan harus berbeda dari password sebelumnya.
            </p>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setPasswordOpen(
                    false,
                  )
                }
              >
                Batal
              </Button>

              <Button
                type="submit"
                disabled={
                  passwordSubmitting
                }
              >
                {passwordSubmitting
                  ? "Menyimpan..."
                  : "Simpan Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}