export const STORAGE_KEYS = {
  version: "bumdes-wengkal:version",
  users: "bumdes-wengkal:users",
  session: "bumdes-wengkal:session",
  income: "bumdes-wengkal:income",
  expenses: "bumdes-wengkal:expenses",
  bumdesTypes: "bumdes-wengkal:bumdes-types",
  items: "bumdes-wengkal:items",
  loans: "bumdes-wengkal:loans",
  savingsLoans: "bumdes-wengkal:savings-loans",
  savingsLoanPayments:
    "bumdes-wengkal:savings-loan-payments",
  settings: "bumdes-wengkal:settings",
  notifications: "bumdes-wengkal:notifications",
} as const;

export const DATA_VERSION = "1";

export const INCOME_CATEGORIES = [
  "Penjualan",
  "Sewa",
  "Angsuran",
  "Bantuan",
  "Lainnya",
] as const;

export const EXPENSE_CATEGORIES = [
  "Operasional",
  "Pemeliharaan",
  "Kegiatan",
  "ATK",
  "Gaji",
  "Transport",
  "Lainnya",
] as const;

export const ITEM_CATEGORIES = [
  "Perlengkapan",
  "Elektronik",
  "Peralatan Dapur",
  "Lainnya",
] as const;

export const ITEM_CONDITIONS = [
  "Baik",
  "Rusak Ringan",
  "Rusak Berat",
] as const;

export const PAGE_SIZE = 8;

export const DEMO_CREDENTIALS = {
  username: "admin",
  password: "admin123",
  email: "admin@bumdeswengkal.id",
};