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

export type IncomeRecord = {
  id: string;
  date: string;
  source: string;
  category: string;
  description: string;
  amount: number;
  proof?: ProofFile | null;
  createdAt: string;
};

export type ExpenseRecord = {
  id: string;
  date: string;
  category: string;
  purpose: string;
  description: string;
  amount: number;
  proof?: ProofFile | null;
  createdAt: string;
};

export type ItemCondition = "Baik" | "Rusak Ringan" | "Rusak Berat";

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  borrowed: number;
  condition: ItemCondition;
};

export type LoanStatus = "borrowed" | "returned" | "overdue";

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
