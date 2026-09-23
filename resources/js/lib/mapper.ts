import type {
  AppNotification,
  AppSettings,
  BumdesType,
  ExpenseRecord,
  IncomeRecord,
  InventoryItem,
  LoanRecord,
  ProofFile,
  SavingsLoanPayment,
  SavingsLoanRecord,
} from "@/lib/types";

function rec(v: unknown): Record<string, unknown> {
  return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : {};
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function num(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Laravel mengirim kolom tanggal sebagai ISO string
 * (contoh: "2026-09-20T00:00:00.000000Z"). Frontend hanya
 * memakai bagian tanggalnya (YYYY-MM-DD) supaya cocok dengan
 * <input type="date">, perbandingan string, dan formatDate().
 * Timezone aplikasi = UTC (config/app.php), jadi aman dipotong.
 */
export function dateOnly(v: unknown): string {
  if (typeof v !== "string") return "";
  const match = v.trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

export function normalizeProof(value: unknown): ProofFile | null {
  if (!value) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return normalizeProof(parsed);
      }
    } catch {
      // bukan JSON
    }

    if (
      trimmed.startsWith("data:image/") ||
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/storage/")
    ) {
      return { name: "Bukti transaksi", dataUrl: trimmed };
    }

    return { name: trimmed };
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    const r = value as Record<string, unknown>;
    const name = str(r.name, "Bukti transaksi");
    let dataUrl: string | undefined;

    if (typeof r.dataUrl === "string" && r.dataUrl.trim()) {
      dataUrl = r.dataUrl.trim();
    } else if (typeof r.url === "string" && r.url.trim()) {
      dataUrl = r.url.trim();
    } else if (typeof r.path === "string" && r.path.trim()) {
      const p = r.path.trim();
      dataUrl = p.startsWith("http") || p.startsWith("/storage/")
        ? p
        : `/storage/${p.replace(/^\/+/, "")}`;
    }

    return { name, ...(dataUrl ? { dataUrl } : {}) };
  }

  return null;
}

export function mapIncome(v: unknown): IncomeRecord {
  const r = rec(v);
  return {
    id: str(r.id),
    bumdesTypeId: str(r.bumdesTypeId ?? r.bumdes_type_id),
    date: dateOnly(r.date),
    source: str(r.source),
    category: str(r.category),
    description: str(r.description),
    amount: num(r.amount),
    proof: normalizeProof(r.proof),
    createdAt: str(r.createdAt ?? r.created_at, new Date().toISOString()),
  };
}

export function mapExpense(v: unknown): ExpenseRecord {
  const r = rec(v);
  return {
    id: str(r.id),
    bumdesTypeId: str(r.bumdesTypeId ?? r.bumdes_type_id),
    date: dateOnly(r.date),
    category: str(r.category),
    purpose: str(r.purpose),
    description: str(r.description),
    amount: num(r.amount),
    proof: normalizeProof(r.proof),
    createdAt: str(r.createdAt ?? r.created_at, new Date().toISOString()),
  };
}

export function mapBumdesType(v: unknown): BumdesType {
  const r = rec(v);
  return {
    id: str(r.id),
    name: str(r.name),
    category: str(r.category) || "Lainnya",
    description: str(r.description),
    status: r.status === "inactive" ? "inactive" : "active",
    createdAt: str(r.createdAt ?? r.created_at, new Date().toISOString()),
  };
}

export function mapItem(v: unknown): InventoryItem {
  const r = rec(v);
  const cond = r.condition;
  return {
    id: str(r.id),
    name: str(r.name),
    category: str(r.category),
    quantity: num(r.quantity),
    borrowed: num(r.borrowed),
    condition:
      cond === "Rusak Ringan" || cond === "Rusak Berat" ? cond : "Baik",
  };
}

export function mapLoan(v: unknown): LoanRecord {
  const r = rec(v);
  const status =
    r.status === "returned" || r.status === "overdue" ? r.status : "borrowed";
  return {
    id: str(r.id),
    borrowerName: str(r.borrowerName ?? r.borrower_name),
    phone: str(r.phone),
    itemId: str(r.itemId ?? r.item_id),
    itemName: str(r.itemName ?? r.item_name),
    quantity: num(r.quantity),
    borrowDate: dateOnly(r.borrowDate ?? r.borrow_date),
    returnDate: dateOnly(r.returnDate ?? r.return_date),
    actualReturnDate: dateOnly(r.actualReturnDate ?? r.actual_return_date) || null,
    purpose: str(r.purpose),
    notes: str(r.notes),
    status: status as LoanRecord["status"],
    createdAt: str(r.createdAt ?? r.created_at, new Date().toISOString()),
  };
}

export function mapSavingsLoan(v: unknown): SavingsLoanRecord {
  const r = rec(v);
  const totalPaid = num(r.totalPaid ?? r.total_paid);
  const loanAmount = num(r.loanAmount ?? r.loan_amount);
  const status: SavingsLoanRecord["status"] =
    r.status === "paid" || totalPaid >= loanAmount
      ? "paid"
      : r.status === "overdue"
        ? "overdue"
        : "active";

  return {
    id: str(r.id),
    borrowerName: str(r.borrowerName ?? r.borrower_name),
    phone: str(r.phone),
    address: str(r.address),
    loanDate: dateOnly(r.loanDate ?? r.loan_date),
    dueDate: dateOnly(r.dueDate ?? r.due_date),
    loanAmount,
    installmentAmount: num(r.installmentAmount ?? r.installment_amount),
    totalPaid,
    purpose: str(r.purpose),
    notes: str(r.notes),
    status,
    createdAt: str(r.createdAt ?? r.created_at, new Date().toISOString()),
  };
}

export function mapSavingsLoanPayment(v: unknown): SavingsLoanPayment {
  const r = rec(v);
  return {
    id: str(r.id),
    savingsLoanId: str(r.savingsLoanId ?? r.savings_loan_id),
    paymentDate: dateOnly(r.paymentDate ?? r.payment_date),
    amount: num(r.amount),
    notes: str(r.notes),
    createdAt: str(r.createdAt ?? r.created_at, new Date().toISOString()),
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  bumdesName: "BUMDes Desa Wengkal",
  villageName: "Desa Wengkal",
  address: "",
  phone: "",
  email: "",
  adminName: "Admin",
  adminUsername: "admin",
  adminEmail: "admin@bumdeswengkal.id",
};

export function mapSettings(v: unknown): AppSettings | null {
  if (!v) return null;
  const r = rec(v);
  return {
    bumdesName: str(r.bumdesName ?? r.bumdes_name, DEFAULT_SETTINGS.bumdesName),
    villageName: str(r.villageName ?? r.village_name, DEFAULT_SETTINGS.villageName),
    address: str(r.address),
    phone: str(r.phone),
    email: str(r.email),
    adminName: str(r.adminName ?? r.admin_name, DEFAULT_SETTINGS.adminName),
    adminUsername: str(r.adminUsername ?? r.admin_username, DEFAULT_SETTINGS.adminUsername),
    adminEmail: str(r.adminEmail ?? r.admin_email, DEFAULT_SETTINGS.adminEmail),
  };
}

export function mapNotification(v: unknown): AppNotification {
  const r = rec(v);
  const href = str(r.href);
  return {
    id: str(r.id),
    title: str(r.title),
    body: str(r.body),
    time: str(r.time ?? r.created_at),
    read: r.read === true || r.read === 1 || r.read === "1",
    ...(href ? { href } : {}),
  };
}
