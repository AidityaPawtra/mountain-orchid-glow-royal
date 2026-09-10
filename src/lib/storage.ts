import { DATA_VERSION, STORAGE_KEYS } from "@/lib/constants";
import {
  defaultExpenses,
  defaultIncome,
  defaultItems,
  defaultLoans,
  defaultNotifications,
  defaultSettings,
  defaultUsers,
} from "@/data/dummy-data";
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

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeKey(key: string) {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(key);
}

export function seedIfNeeded() {
  if (!canUseStorage()) return;
  const version = window.localStorage.getItem(STORAGE_KEYS.version);
  if (version === DATA_VERSION && window.localStorage.getItem(STORAGE_KEYS.income)) {
    return;
  }

  writeJSON(STORAGE_KEYS.users, defaultUsers);
  writeJSON(STORAGE_KEYS.income, defaultIncome);
  writeJSON(STORAGE_KEYS.expenses, defaultExpenses);
  writeJSON(STORAGE_KEYS.items, defaultItems);
  writeJSON(STORAGE_KEYS.loans, defaultLoans);
  writeJSON(STORAGE_KEYS.settings, defaultSettings);
  writeJSON(STORAGE_KEYS.notifications, defaultNotifications);
  window.localStorage.setItem(STORAGE_KEYS.version, DATA_VERSION);
}

export function resetDemoData() {
  if (!canUseStorage()) return;
  removeKey(STORAGE_KEYS.session);
  writeJSON(STORAGE_KEYS.users, defaultUsers);
  writeJSON(STORAGE_KEYS.income, defaultIncome);
  writeJSON(STORAGE_KEYS.expenses, defaultExpenses);
  writeJSON(STORAGE_KEYS.items, defaultItems);
  writeJSON(STORAGE_KEYS.loans, defaultLoans);
  writeJSON(STORAGE_KEYS.settings, defaultSettings);
  writeJSON(STORAGE_KEYS.notifications, defaultNotifications);
  window.localStorage.setItem(STORAGE_KEYS.version, DATA_VERSION);
}

export const storageApi = {
  users: () => readJSON<UserAccount[]>(STORAGE_KEYS.users, defaultUsers),
  saveUsers: (value: UserAccount[]) => writeJSON(STORAGE_KEYS.users, value),
  session: () => readJSON<Session | null>(STORAGE_KEYS.session, null),
  saveSession: (value: Session | null) => {
    if (value) writeJSON(STORAGE_KEYS.session, value);
    else removeKey(STORAGE_KEYS.session);
  },
  income: () => readJSON<IncomeRecord[]>(STORAGE_KEYS.income, defaultIncome),
  saveIncome: (value: IncomeRecord[]) => writeJSON(STORAGE_KEYS.income, value),
  expenses: () => readJSON<ExpenseRecord[]>(STORAGE_KEYS.expenses, defaultExpenses),
  saveExpenses: (value: ExpenseRecord[]) => writeJSON(STORAGE_KEYS.expenses, value),
  items: () => readJSON<InventoryItem[]>(STORAGE_KEYS.items, defaultItems),
  saveItems: (value: InventoryItem[]) => writeJSON(STORAGE_KEYS.items, value),
  loans: () => readJSON<LoanRecord[]>(STORAGE_KEYS.loans, defaultLoans),
  saveLoans: (value: LoanRecord[]) => writeJSON(STORAGE_KEYS.loans, value),
  settings: () => readJSON<AppSettings>(STORAGE_KEYS.settings, defaultSettings),
  saveSettings: (value: AppSettings) => writeJSON(STORAGE_KEYS.settings, value),
  notifications: () =>
    readJSON<AppNotification[]>(STORAGE_KEYS.notifications, defaultNotifications),
  saveNotifications: (value: AppNotification[]) =>
    writeJSON(STORAGE_KEYS.notifications, value),
};
