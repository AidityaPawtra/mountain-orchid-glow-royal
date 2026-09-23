import type {
  ExpenseRecord,
  IncomeRecord,
  ProofFile,
} from "@/lib/types";

// ======================================================
// API CONFIG
// ======================================================

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ??
  (typeof window !== "undefined" ? "/api" : "http://localhost:8000/api")
).replace(/\/$/, "");

// ======================================================
// GENERIC REQUEST
// ======================================================

type ApiResponse<T> = T;

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,

      headers: {
        Accept: "application/json",

        ...(options.body instanceof FormData
          ? {}
          : {
              "Content-Type":
                "application/json",
            }),

        ...(options.headers ?? {}),
      },
    },
  );

  if (!response.ok) {
    let message =
      `Request gagal (${response.status}).`;

    try {
      const error =
        await response.json();

      if (
        error?.message &&
        typeof error.message ===
          "string"
      ) {
        message =
          error.message;
      }

      if (
        error?.errors &&
        typeof error.errors ===
          "object"
      ) {
        const firstError =
          Object.values(
            error.errors,
          )[0];

        if (
          Array.isArray(
            firstError,
          ) &&
          typeof firstError[0] ===
            "string"
        ) {
          message =
            firstError[0];
        }
      }
    } catch {
      // Gunakan pesan default
    }

    throw new Error(message);
  }

  if (
    response.status ===
    204
  ) {
    return undefined as T;
  }

  return response.json();
}

// ======================================================
// PROOF FILE HELPER
// ======================================================

/**
 * Mengubah data URL yang dibuat frontend
 * menjadi Blob agar dapat dikirim sebagai file
 * melalui multipart/form-data.
 */
function dataUrlToBlob(
  dataUrl: string,
): Blob | null {
  try {
    const parts =
      dataUrl.split(",");

    if (
      parts.length < 2
    ) {
      return null;
    }

    const header =
      parts[0];

    const base64 =
      parts.slice(1).join(",");

    const mimeMatch =
      header.match(
        /^data:(.*?);base64$/,
      );

    const mime =
      mimeMatch?.[1] ??
      "application/octet-stream";

    const binary =
      atob(base64);

    const bytes =
      new Uint8Array(
        binary.length,
      );

    for (
      let index = 0;
      index <
      binary.length;
      index += 1
    ) {
      bytes[index] =
        binary.charCodeAt(
          index,
        );
    }

    return new Blob(
      [bytes],
      {
        type: mime,
      },
    );
  } catch {
    return null;
  }
}

/**
 * Menambahkan bukti transaksi ke FormData.
 */
function appendProof(
  formData: FormData,
  proof?: ProofFile | null,
) {
  if (
    !proof?.dataUrl
  ) {
    return;
  }

  /*
   * Kalau dataUrl sebenarnya sudah berupa
   * URL dari server, jangan dikirim ulang
   * sebagai file.
   */
  if (
    !proof.dataUrl.startsWith(
      "data:",
    )
  ) {
    return;
  }

  const blob =
    dataUrlToBlob(
      proof.dataUrl,
    );

  if (!blob) {
    return;
  }

  formData.append(
    "proof",
    blob,
    proof.name ||
      "bukti-transaksi",
  );
}

// ======================================================
// BOOTSTRAP
// ======================================================

export type BootstrapResponse = {
  settings: unknown;

  bumdesTypes: unknown[];

  items: unknown[];

  income: unknown[];

  expenses: unknown[];

  loans: unknown[];

  savingsLoans: unknown[];

  savingsLoanPayments:
    unknown[];

  notifications:
    unknown[];

  users: unknown[];
};

export function fetchBootstrap() {
  return request<BootstrapResponse>(
    "/bootstrap",
  );
}

// ======================================================
// PEMASUKAN
// ======================================================

/**
 * bumdesTypeId dibuat optional pada payload API
 * karena endpoint Laravel menerima nullable.
 *
 * IncomeRecord frontend tetap memiliki
 * bumdesTypeId: string.
 */
export type CreateIncomePayload =
  Omit<
    IncomeRecord,
    "id" |
      "createdAt" |
      "bumdesTypeId"
  > & {
    bumdesTypeId?: string;
  };

export function fetchIncome() {
  return request<unknown[]>(
    "/income",
  );
}

export function createIncome(
  payload: CreateIncomePayload,
) {
  const formData =
    new FormData();

  if (
    payload.bumdesTypeId
  ) {
    formData.append(
      "bumdesTypeId",
      payload.bumdesTypeId,
    );
  }

  formData.append(
    "date",
    payload.date,
  );

  formData.append(
    "source",
    payload.source,
  );

  formData.append(
    "category",
    payload.category,
  );

  formData.append(
    "description",
    payload.description,
  );

  formData.append(
    "amount",
    String(
      payload.amount,
    ),
  );

  appendProof(
    formData,
    payload.proof,
  );

  return request<{
    ok: boolean;
    data: unknown;
  }>("/income", {
    method: "POST",
    body: formData,
  });
}

// ======================================================
// PENGELUARAN
// ======================================================

/**
 * bumdesTypeId dibuat optional pada payload API
 * karena endpoint Laravel menerima nullable.
 */
export type CreateExpensePayload =
  Omit<
    ExpenseRecord,
    "id" |
      "createdAt" |
      "bumdesTypeId"
  > & {
    bumdesTypeId?: string;
  };

export function fetchExpenses() {
  return request<unknown[]>(
    "/expenses",
  );
}

export function createExpense(
  payload: CreateExpensePayload,
) {
  const formData =
    new FormData();

  if (
    payload.bumdesTypeId
  ) {
    formData.append(
      "bumdesTypeId",
      payload.bumdesTypeId,
    );
  }

  formData.append(
    "date",
    payload.date,
  );

  formData.append(
    "category",
    payload.category,
  );

  formData.append(
    "purpose",
    payload.purpose,
  );

  formData.append(
    "description",
    payload.description,
  );

  formData.append(
    "amount",
    String(
      payload.amount,
    ),
  );

  appendProof(
    formData,
    payload.proof,
  );

  return request<{
    ok: boolean;
    data: unknown;
  }>("/expenses", {
    method: "POST",
    body: formData,
  });
}

// ======================================================
// JENIS BUMDes
// ======================================================

export function fetchBumdesTypes() {
  return request<unknown[]>(
    "/bumdes-types",
  );
}

// ======================================================
// SIMPAN PINJAM
// ======================================================

export function fetchSavingsLoans() {
  return request<unknown[]>(
    "/savings-loans",
  );
}
