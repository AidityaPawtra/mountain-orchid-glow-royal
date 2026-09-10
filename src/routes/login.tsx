import { useState } from "react";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const ready = useAppStore((s) => s.ready);
  const session = useAppStore((s) => s.session);
  const login = useAppStore((s) => s.login);
  const settings = useAppStore((s) => s.settings);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [forgotOpen, setForgotOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (ready && session) return <Navigate to="/dashboard" />;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!identifier.trim()) nextErrors.identifier = "Email atau username wajib diisi.";
    if (!password) nextErrors.password = "Kata sandi wajib diisi.";
    setFieldErrors(nextErrors);
    setError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    const result = login(identifier, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden lg:block">
        <img
          src="/login-village.jpg"
          alt="Suasana Desa Wengkal"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-navy/20" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-navy-fg">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-navy-muted">
            Badan Usaha Milik Desa
          </p>
          <h2 className="mt-2 max-w-md text-3xl font-semibold tracking-tight">
            Mengelola kas dan inventaris desa dengan tertib dan transparan.
          </h2>
        </div>
      </section>

      <section className="flex items-center justify-center bg-background px-5 py-10">
        <div className="w-full max-w-[400px]">
          <BrandLogo light />
          <h1 className="mt-10 text-3xl font-semibold tracking-tight text-navy">Selamat Datang</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Silakan login untuk melanjutkan ke sistem {settings.bumdesName}.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            {error ? (
              <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
            ) : null}
            <Field label="Email atau Username" htmlFor="login-id" required error={fieldErrors.identifier}>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-id"
                  className="pl-9"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin"
                />
              </div>
            </Field>
            <Field label="Password" htmlFor="login-pass" required error={fieldErrors.password}>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-pass"
                  className="pl-9 pr-10"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => setForgotOpen(true)}
              >
                Lupa password?
              </button>
            </div>
            <Button type="submit" className="h-11 w-full" disabled={submitting}>
              Login
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Akun demo: <span className="font-medium text-foreground">admin</span> /{" "}
              <span className="font-medium text-foreground">admin123</span>
            </p>
          </form>
        </div>
      </section>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lupa password</DialogTitle>
            <DialogDescription>
              Untuk mereset kata sandi, hubungi ketua BUMDes Desa Wengkal di {settings.phone} atau {settings.email}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => setForgotOpen(false)}>
              Mengerti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
