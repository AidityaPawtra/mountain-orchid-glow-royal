import type { ProofFile } from "@/lib/types";

const MAX_PROOF_BYTES = 5 * 1024 * 1024;

export async function readProofFile(file: File): Promise<ProofFile> {
  if (file.size > MAX_PROOF_BYTES) {
    throw new Error("Ukuran bukti transaksi maksimal 5 MB.");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result));
    };

    reader.onerror = () => {
      reject(new Error("Gagal membaca berkas"));
    };

    reader.readAsDataURL(file);
  });

  return {
    name: file.name,
    dataUrl,
  };
}