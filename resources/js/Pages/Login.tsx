import { useState, useEffect } from "react";
import { router, Head, usePage } from "@inertiajs/react";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";

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

export default function LoginPage() {
  const auth = (usePage().props as { auth?: { user: unknown } }).auth;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [forgotOpen, setForgotOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      router.visit("/dashboard");
    }
  }, [auth]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    const trimmed = identifier.trim();
    if (!trimmed) nextErrors.identifier = "Email atau username wajib diisi.";
    if (!password) nextErrors.password = "Kata sandi wajib diisi.";
    setFieldErrors(nextErrors);
    setError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    router.post(
      "/login",
      { username: trimmed, password },
      {
        onError: (errors) => {
          setSubmitting(false);
          setError(
            errors.username ||
              errors.password ||
              "Username atau kata sandi tidak sesuai.",
          );
        },
        onFinish: () => setSubmitting(false),
      },
    );
  }

  return (
    <>
      <Head title="Masuk - BUMDes Desa Wengkal" />
      <div className="min-h-screen bg-[#F7F9FB]">
        <div className="grid min-h-screen lg:grid-cols-2">
          <div className="relative hidden overflow-hidden lg:block">
            <img
              src="/login-village.jpg"
              alt="BUMDes Desa Wengkal"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 flex min-h-screen flex-col justify-between p-10 text-white">
              <div>
                <img
                  src="/logo.jpg"
                  alt="Logo BUMDes"
                  className="h-16 w-16 rounded-2xl object-cover shadow-lg"
                />
              </div>
              <div className="max-w-lg pb-8">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-white/80">
                  Sistem Pengelolaan BUMDes
                </p>
                <h1 className="text-4xl font-semibold leading-tight">
                  BUMDes Desa Wengkal
                </h1>
                <p className="mt-4 max-w-md text-base leading-7 text-white/85">
                  Sistem pengelolaan keuangan, barang, dan administrasi BUMDes
                  Desa Wengkal.
                </p>
              </div>
            </div>
          </div>

          <div className="flex min-h-screen items-center justify-center px-6 py-10">
            <div className="w-full max-w-md">
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <img
                  src="/logo.jpg"
                  alt="Logo BUMDes Desa Wengkal"
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1F5D90]">
                    BUMDes Desa Wengkal
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sistem Pengelolaan BUMDes
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight text-[#222]">
                  Selamat Datang
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Masuk ke sistem pengelolaan BUMDes Desa Wengkal
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field
                    label="Email atau Username"
                    htmlFor="login-identifier"
                    required
                    error={fieldErrors.identifier}
                  >
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="login-identifier"
                        type="text"
                        autoComplete="username"
                        value={identifier}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          setFieldErrors((p) => {
                            const n = { ...p };
                            delete n.identifier;
                            return n;
                          });
                          setError("");
                        }}
                        placeholder="Masukkan email atau username"
                        className="h-11 pl-10"
                        disabled={submitting}
                      />
                    </div>
                  </Field>

                  <Field
                    label="Kata Sandi"
                    htmlFor="login-password"
                    required
                    error={fieldErrors.password}
                  >
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setFieldErrors((p) => {
                            const n = { ...p };
                            delete n.password;
                            return n;
                          });
                          setError("");
                        }}
                        placeholder="Masukkan kata sandi"
                        className="h-11 pl-10 pr-10"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                        aria-label={
                          showPassword
                            ? "Sembunyikan kata sandi"
                            : "Tampilkan kata sandi"
                        }
                        disabled={submitting}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </Field>

                  {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  ) : null}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setForgotOpen(true)}
                      className="text-sm font-medium text-[#1F5D90] transition hover:underline"
                    >
                      Lupa password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full rounded-xl"
                    disabled={submitting}
                  >
                    {submitting ? "Memproses..." : "Masuk"}
                  </Button>
                </form>
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} BUMDes Desa Wengkal
              </p>
            </div>
          </div>
        </div>

        <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Lupa Password</DialogTitle>
              <DialogDescription className="leading-6">
                Untuk mereset kata sandi, silakan menghubungi ketua BUMDes Desa
                Wengkal.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" onClick={() => setForgotOpen(false)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}