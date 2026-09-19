export type UserAccount = {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
};

export type Session = {
  userId: string;
  username: string;
  name: string;
  email: string;
};

export type ProofFile = {
  name: string;
  dataUrl?: string;
};

/**
 * Jenis / unit usaha BUMDes
 */
export type BumdesType = {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
};

/**
 * PEMASUKAN
 *
 * Pemasukan tetap terhubung dengan
 * unit / jenis BUMDes.
 */
export type IncomeRecord = {
  id: string;
  bumdesTypeId: string;
  date: string;
  source: string;
  category: string;
  description: string;
  amount: number;
  proof?: ProofFile | null;
  createdAt: string;
};

/**
 * PENGELUARAN
 *
 * Pengeluaran tetap terhubung dengan
 * unit / jenis BUMDes.
 */
export type ExpenseRecord = {
  id: string;
  bumdesTypeId: string;
  date: string;
  category: string;
  purpose: string;
  description: string;
  amount: number;
  proof?: ProofFile | null;
  createdAt: string;
};

export type ItemCondition =
  | "Baik"
  | "Rusak Ringan"
  | "Rusak Berat";

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  borrowed: number;
  condition: ItemCondition;
};

/**
 * PEMINJAMAN BARANG
 *
 * Berbeda dengan Simpan Pinjam uang.
 */
export type LoanStatus =
  | "borrowed"
  | "returned"
  | "overdue";

export type LoanRecord = {
  id: string;
  borrowerName: string;
  phone: string;
  itemId: string;
  itemName: string;
  quantity: number;
  borrowDate: string;
  returnDate: string;
  actualReturnDate?: string | null;
  purpose: string;
  notes: string;
  status: LoanStatus;
  createdAt: string;
};

/**
 * SIMPAN PINJAM UANG
 *
 * BERDIRI SENDIRI.
 *
 * Tidak terhubung ke Jenis BUMDes,
 * sehingga TIDAK memiliki bumdesTypeId.
 */
export type SavingsLoanStatus =
  | "active"
  | "paid"
  | "overdue";

export type SavingsLoanRecord = {
  id: string;

  borrowerName: string;
  phone: string;
  address: string;

  loanDate: string;
  dueDate: string;

  loanAmount: number;
  installmentAmount: number;
  totalPaid: number;

  purpose: string;
  notes: string;

  status: SavingsLoanStatus;
  createdAt: string;
};

/**
 * Riwayat pembayaran / angsuran
 * untuk pinjaman uang BUMDes.
 */
export type SavingsLoanPayment = {
  id: string;
  savingsLoanId: string;
  paymentDate: string;
  amount: number;
  notes: string;
  createdAt: string;
};

export type AppSettings = {
  bumdesName: string;
  villageName: string;
  address: string;
  phone: string;
  email: string;
  adminName: string;
  adminUsername: string;
  adminEmail: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
};

export type UnifiedTransaction = {
  id: string;
  type: "income" | "expense";
  date: string;
  title: string;
  category: string;
  amount: number;
  createdAt: string;
};