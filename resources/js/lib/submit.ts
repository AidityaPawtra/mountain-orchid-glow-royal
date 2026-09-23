import { router } from "@inertiajs/react";

/**
 * Helper untuk mengirim perubahan data ke server Laravel (database)
 * lewat Inertia, dan mengembalikan hasilnya sebagai Promise
 * supaya mudah dipakai di form / dialog.
 */
// `message?: undefined` pada cabang sukses membuat `result.message`
// tetap bisa dibaca walau tsconfig memakai strict: false.
export type SubmitResult =
  | { ok: true; message?: undefined }
  | { ok: false; message: string };

export function firstError(
  errors: unknown,
  fallback = "Terjadi kesalahan. Silakan coba lagi.",
): string {
  if (!errors || typeof errors !== "object") return fallback;
  const first = Object.values(errors as Record<string, unknown>)[0];
  if (Array.isArray(first)) {
    return typeof first[0] === "string" && first[0] ? first[0] : fallback;
  }
  return typeof first === "string" && first ? first : fallback;
}

type Method = "post" | "put" | "delete";

export function submitToServer(
  method: Method,
  url: string,
  data: Record<string, unknown> = {},
): Promise<SubmitResult> {
  return new Promise((resolve) => {
    const options = {
      preserveScroll: true,
      onSuccess: () => resolve({ ok: true } as SubmitResult),
      onError: (errors: unknown) =>
        resolve({ ok: false, message: firstError(errors) } as SubmitResult),
      // Kalau tidak ada onSuccess/onError (mis. koneksi putus),
      // pastikan Promise tetap selesai. Resolve kedua diabaikan.
      onFinish: () =>
        resolve({
          ok: false,
          message: "Gagal terhubung ke server. Periksa koneksi lalu coba lagi.",
        } as SubmitResult),
    };

    if (method === "delete") {
      router.delete(url, options);
    } else {
      router[method](url, data as never, options);
    }
  });
}
