import { create } from "zustand";
import { DEMO_CREDENTIALS } from "@/lib/constants";
import { defaultSettings } from "@/data/dummy-data";
import { todayISO } from "@/lib/format";
import { resetDemoData, seedIfNeeded, storageApi } from "@/lib/storage";
import { resolveLoanStatus } from "@/lib/finance";
import { uid } from "@/lib/utils";
import type {
  AppNotification,
  AppSettings,
  ExpenseRecord,
  IncomeRecord,
  InventoryItem,
  LoanRecord,
  Session,
  UserAccount,
} from "@/lib/types";

type AppStore = {
  ready: boolean;
  session: Session | null;
  users: UserAccount[];
  income: IncomeRecord[];
  expenses: ExpenseRecord[];
  items: InventoryItem[];
  loans: LoanRecord[];
  settings: AppSettings;
  notifications: AppNotification[];
  hydrate: () => void;
  login: (identifier: string, password: string) => { ok: true } | { ok: false; message: string };
  logout: () => void;
  addIncome: (payload: Omit<IncomeRecord, "id" | "createdAt">) => void;
  updateIncome: (id: string, payload: Omit<IncomeRecord, "id" | "createdAt">) => void;
  deleteIncome: (id: string) => void;
  addExpense: (payload: Omit<ExpenseRecord, "id" | "createdAt">) => void;
  updateExpense: (id: string, payload: Omit<ExpenseRecord, "id" | "createdAt">) => void;
  deleteExpense: (id: string) => void;
  addItem: (payload: Omit<InventoryItem, "id" | "borrowed"> & { borrowed?: number }) => void;
  updateItem: (id: string, payload: Omit<InventoryItem, "id">) => void;
  deleteItem: (id: string) => { ok: true } | { ok: false; message: string };
  addLoan: (
    payload: Omit<LoanRecord, "id" | "createdAt" | "status" | "itemName" | "actualReturnDate">,
  ) => { ok: true; id: string } | { ok: false; message: string };
  updateLoan: (
    id: string,
    payload: Omit<LoanRecord, "id" | "createdAt" | "status" | "itemName" | "actualReturnDate">,
  ) => { ok: true } | { ok: false; message: string };
  returnLoan: (id: string) => { ok: true } | { ok: false; message: string };
  deleteLoan: (id: string) => void;
  saveSettings: (payload: AppSettings) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  restoreDemo: () => void;
};

function persist(partial: Partial<AppStore>) {
  if (partial.income) storageApi.saveIncome(partial.income);
  if (partial.expenses) storageApi.saveExpenses(partial.expenses);
  if (partial.items) storageApi.saveItems(partial.items);
  if (partial.loans) storageApi.saveLoans(partial.loans);
  if (partial.settings) storageApi.saveSettings(partial.settings);
  if (partial.notifications) storageApi.saveNotifications(partial.notifications);
  if (partial.users) storageApi.saveUsers(partial.users);
  if ("session" in partial) storageApi.saveSession(partial.session ?? null);
}

export const useAppStore = create<AppStore>((set, get) => ({
  ready: false,
  session: null,
  users: [],
  income: [],
  expenses: [],
  items: [],
  loans: [],
  settings: defaultSettings,
  notifications: [],

  hydrate: () => {
    seedIfNeeded();
    const loans = storageApi.loans().map((loan) => ({
      ...loan,
      status: resolveLoanStatus(loan),
    }));
    storageApi.saveLoans(loans);
    set({
      ready: true,
      session: storageApi.session(),
      users: storageApi.users(),
      income: storageApi.income(),
      expenses: storageApi.expenses(),
      items: storageApi.items(),
      loans,
      settings: storageApi.settings(),
      notifications: storageApi.notifications(),
    });
  },

  login: (identifier, password) => {
    const id = identifier.trim().toLowerCase();
    const users = get().users.length ? get().users : storageApi.users();
    const user = users.find(
      (row) =>
        row.username.toLowerCase() === id ||
        row.email.toLowerCase() === id,
    );
    if (!user || user.password !== password) {
      return { ok: false, message: "Username atau kata sandi tidak sesuai." };
    }
    const session: Session = {
      userId: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    };
    persist({ session } as Partial<AppStore>);
    set({ session });
    return { ok: true };
  },

  logout: () => {
    persist({ session: null } as Partial<AppStore>);
    set({ session: null });
  },

  addIncome: (payload) => {
    const row: IncomeRecord = {
      ...payload,
      id: uid("inc"),
      createdAt: new Date().toISOString(),
    };
    const income = [row, ...get().income];
    persist({ income });
    set({ income });
  },

  updateIncome: (id, payload) => {
    const income = get().income.map((row) =>
      row.id === id ? { ...row, ...payload } : row,
    );
    persist({ income });
    set({ income });
  },

  deleteIncome: (id) => {
    const income = get().income.filter((row) => row.id !== id);
    persist({ income });
    set({ income });
  },

  addExpense: (payload) => {
    const row: ExpenseRecord = {
      ...payload,
      id: uid("exp"),
      createdAt: new Date().toISOString(),
    };
    const expenses = [row, ...get().expenses];
    persist({ expenses });
    set({ expenses });
  },

  updateExpense: (id, payload) => {
    const expenses = get().expenses.map((row) =>
      row.id === id ? { ...row, ...payload } : row,
    );
    persist({ expenses });
    set({ expenses });
  },

  deleteExpense: (id) => {
    const expenses = get().expenses.filter((row) => row.id !== id);
    persist({ expenses });
    set({ expenses });
  },

  addItem: (payload) => {
    const item: InventoryItem = {
      id: uid("item"),
      name: payload.name,
      category: payload.category,
      quantity: payload.quantity,
      borrowed: payload.borrowed ?? 0,
      condition: payload.condition,
    };
    const items = [item, ...get().items];
    persist({ items });
    set({ items });
  },

  updateItem: (id, payload) => {
    const current = get().items.find((row) => row.id === id);
    if (!current) return;
    const borrowed = Math.min(payload.borrowed, payload.quantity);
    const items = get().items.map((row) =>
      row.id === id ? { ...row, ...payload, borrowed } : row,
    );
    persist({ items });
    set({ items });
  },

  deleteItem: (id) => {
    const item = get().items.find((row) => row.id === id);
    if (!item) return { ok: false, message: "Barang tidak ditemukan." };
    if (item.borrowed > 0) {
      return {
        ok: false,
        message: "Barang tidak dapat dihapus karena masih ada yang dipinjam.",
      };
    }
    const items = get().items.filter((row) => row.id !== id);
    persist({ items });
    set({ items });
    return { ok: true };
  },

  addLoan: (payload) => {
    const item = get().items.find((row) => row.id === payload.itemId);
    if (!item) return { ok: false, message: "Barang tidak ditemukan." };
    const available = item.quantity - item.borrowed;
    if (payload.quantity > available) {
      return { ok: false, message: `Jumlah melebihi stok tersedia (${available}).` };
    }
    if (payload.returnDate < payload.borrowDate) {
      return { ok: false, message: "Tanggal kembali tidak boleh lebih awal dari tanggal pinjam." };
    }
    const loan: LoanRecord = {
      ...payload,
      id: uid("loan"),
      itemName: item.name,
      status: resolveLoanStatus({
        ...payload,
        id: "tmp",
        itemName: item.name,
        status: "borrowed",
        createdAt: "",
      }),
      createdAt: new Date().toISOString(),
    };
    const loans = [loan, ...get().loans];
    const items = get().items.map((row) =>
      row.id === item.id ? { ...row, borrowed: row.borrowed + payload.quantity } : row,
    );
    persist({ loans, items });
    set({ loans, items });
    return { ok: true, id: loan.id };
  },

  updateLoan: (id, payload) => {
    const loan = get().loans.find((row) => row.id === id);
    if (!loan) return { ok: false, message: "Data peminjaman tidak ditemukan." };
    if (loan.status === "returned") {
      return { ok: false, message: "Peminjaman yang sudah dikembalikan tidak dapat diubah." };
    }
    const nextItem = get().items.find((row) => row.id === payload.itemId);
    if (!nextItem) return { ok: false, message: "Barang tidak ditemukan." };
    if (payload.returnDate < payload.borrowDate) {
      return { ok: false, message: "Tanggal kembali tidak boleh lebih awal dari tanggal pinjam." };
    }

    let items = get().items.map((row) => {
      if (row.id === loan.itemId) {
        return { ...row, borrowed: Math.max(0, row.borrowed - loan.quantity) };
      }
      return row;
    });
    const target = items.find((row) => row.id === payload.itemId);
    if (!target) return { ok: false, message: "Barang tidak ditemukan." };
    const available = target.quantity - target.borrowed;
    if (payload.quantity > available) {
      return { ok: false, message: `Jumlah melebihi stok tersedia (${available}).` };
    }
    items = items.map((row) =>
      row.id === payload.itemId
        ? { ...row, borrowed: row.borrowed + payload.quantity }
        : row,
    );
    const loans = get().loans.map((row) =>
      row.id === id
        ? {
            ...row,
            ...payload,
            itemName: nextItem.name,
            status: resolveLoanStatus({ ...row, ...payload, itemName: nextItem.name }),
          }
        : row,
    );
    persist({ loans, items });
    set({ loans, items });
    return { ok: true };
  },

  returnLoan: (id) => {
    const loan = get().loans.find((row) => row.id === id);
    if (!loan) return { ok: false, message: "Data peminjaman tidak ditemukan." };
    if (loan.status === "returned") return { ok: true };
    const loans = get().loans.map((row) =>
      row.id === id
        ? {
            ...row,
            status: "returned" as const,
            actualReturnDate: todayISO(),
          }
        : row,
    );
    const items = get().items.map((row) =>
      row.id === loan.itemId
        ? { ...row, borrowed: Math.max(0, row.borrowed - loan.quantity) }
        : row,
    );
    persist({ loans, items });
    set({ loans, items });
    return { ok: true };
  },

  deleteLoan: (id) => {
    const loan = get().loans.find((row) => row.id === id);
    if (!loan) return;
    const loans = get().loans.filter((row) => row.id !== id);
    const items =
      loan.status === "returned"
        ? get().items
        : get().items.map((row) =>
            row.id === loan.itemId
              ? { ...row, borrowed: Math.max(0, row.borrowed - loan.quantity) }
              : row,
          );
    persist({ loans, items });
    set({ loans, items });
  },

  saveSettings: (payload) => {
    const users = get().users.map((user) =>
      user.username === DEMO_CREDENTIALS.username
        ? {
            ...user,
            name: payload.adminName,
            username: payload.adminUsername,
            email: payload.adminEmail,
          }
        : user,
    );
    persist({ settings: payload, users });
    const session = get().session
      ? {
          ...get().session!,
          name: payload.adminName,
          username: payload.adminUsername,
          email: payload.adminEmail,
        }
      : null;
    persist({ session } as Partial<AppStore>);
    set({ settings: payload, users, session });
  },

  markNotificationRead: (id) => {
    const notifications = get().notifications.map((row) =>
      row.id === id ? { ...row, read: true } : row,
    );
    persist({ notifications });
    set({ notifications });
  },

  markAllNotificationsRead: () => {
    const notifications = get().notifications.map((row) => ({ ...row, read: true }));
    persist({ notifications });
    set({ notifications });
  },

  restoreDemo: () => {
    const session = get().session;
    resetDemoData();
    if (session) storageApi.saveSession(session);
    seedIfNeeded();
    const loans = storageApi.loans().map((loan) => ({
      ...loan,
      status: resolveLoanStatus(loan),
    }));
    storageApi.saveLoans(loans);
    set({
      ready: true,
      session: storageApi.session(),
      users: storageApi.users(),
      income: storageApi.income(),
      expenses: storageApi.expenses(),
      items: storageApi.items(),
      loans,
      settings: storageApi.settings(),
      notifications: storageApi.notifications(),
    });
  },
}));
