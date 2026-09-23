import { DATA_VERSION, STORAGE_KEYS } from "@/lib/constants";

import {
  defaultBumdesTypes,
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
  BumdesType,
  ExpenseRecord,
  IncomeRecord,
  InventoryItem,
  LoanRecord,
  SavingsLoanPayment,
  SavingsLoanRecord,
  Session,
  UserAccount,
} from "@/lib/types";

// ======================================================
// CHECK LOCAL STORAGE
// ======================================================

function canUseStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

// ======================================================
// READ JSON
// ======================================================

export function readJSON<T>(
  key: string,
  fallback: T,
): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ======================================================
// WRITE JSON
// ======================================================

export function writeJSON<T>(
  key: string,
  value: T,
) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    key,
    JSON.stringify(value),
  );
}

// ======================================================
// REMOVE STORAGE KEY
// ======================================================

export function removeKey(
  key: string,
) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(key);
}

// ======================================================
// SEED DEMO DATA
// ======================================================

export function seedIfNeeded() {
  if (!canUseStorage()) {
    return;
  }

  const version =
    window.localStorage.getItem(
      STORAGE_KEYS.version,
    );

  /*
   * Kalau data versi sekarang sudah tersedia,
   * jangan seed ulang.
   */
  if (
    version === DATA_VERSION &&
    window.localStorage.getItem(
      STORAGE_KEYS.income,
    )
  ) {
    /*
     * Pastikan data BUMDes tetap tersedia.
     * Ini penting untuk localStorage lama yang
     * dibuat sebelum fitur Jenis BUMDes ditambahkan.
     */
    if (
      !window.localStorage.getItem(
        STORAGE_KEYS.bumdesTypes,
      )
    ) {
      writeJSON(
        STORAGE_KEYS.bumdesTypes,
        defaultBumdesTypes,
      );
    }

    /*
     * Pastikan storage Simpan Pinjam tersedia
     * untuk localStorage lama.
     */
    if (
      !window.localStorage.getItem(
        STORAGE_KEYS.savingsLoans,
      )
    ) {
      writeJSON(
        STORAGE_KEYS.savingsLoans,
        [],
      );
    }

    return;
  }

  // ------------------------------------------
  // DATA DEMO
  // ------------------------------------------

  writeJSON(
    STORAGE_KEYS.users,
    defaultUsers,
  );

  writeJSON(
    STORAGE_KEYS.income,
    defaultIncome,
  );

  writeJSON(
    STORAGE_KEYS.expenses,
    defaultExpenses,
  );

  writeJSON(
    STORAGE_KEYS.bumdesTypes,
    defaultBumdesTypes,
  );

  writeJSON(
    STORAGE_KEYS.items,
    defaultItems,
  );

  writeJSON(
    STORAGE_KEYS.loans,
    defaultLoans,
  );

  /*
   * Belum ada dummy data Simpan Pinjam.
   * Gunakan array kosong sebagai data awal.
   */
  writeJSON(
    STORAGE_KEYS.savingsLoans,
    [],
  );

  writeJSON(
    STORAGE_KEYS.settings,
    defaultSettings,
  );

  writeJSON(
    STORAGE_KEYS.notifications,
    defaultNotifications,
  );

  window.localStorage.setItem(
    STORAGE_KEYS.version,
    DATA_VERSION,
  );
}

// ======================================================
// RESET DEMO DATA
// ======================================================

export function resetDemoData() {
  if (!canUseStorage()) {
    return;
  }

  removeKey(
    STORAGE_KEYS.session,
  );

  writeJSON(
    STORAGE_KEYS.users,
    defaultUsers,
  );

  writeJSON(
    STORAGE_KEYS.income,
    defaultIncome,
  );

  writeJSON(
    STORAGE_KEYS.expenses,
    defaultExpenses,
  );

  writeJSON(
    STORAGE_KEYS.bumdesTypes,
    defaultBumdesTypes,
  );

  writeJSON(
    STORAGE_KEYS.items,
    defaultItems,
  );

  writeJSON(
    STORAGE_KEYS.loans,
    defaultLoans,
  );

  writeJSON(
    STORAGE_KEYS.savingsLoans,
    [],
  );

  writeJSON(
    STORAGE_KEYS.settings,
    defaultSettings,
  );

  writeJSON(
    STORAGE_KEYS.notifications,
    defaultNotifications,
  );

  window.localStorage.setItem(
    STORAGE_KEYS.version,
    DATA_VERSION,
  );
}

// ======================================================
// STORAGE API
// ======================================================

export const storageApi = {
  // ====================================================
  // USERS
  // ====================================================

  users: () => {
    const list = readJSON<UserAccount[]>(
      STORAGE_KEYS.users,
      defaultUsers,
    );
    return list.map((user) => ({
      ...user,
      password: user.password || DEMO_CREDENTIALS.password,
    }));
  },

  saveUsers: (
    value: UserAccount[],
  ) => {
    const current = storageApi.users();
    const merged = value.map((user) => {
      const existing = current.find((c) => c.id === user.id || c.username === user.username);
      return {
        ...user,
        password: user.password || existing?.password || DEMO_CREDENTIALS.password,
      };
    });
    writeJSON(
      STORAGE_KEYS.users,
      merged,
    );
  },

  // ====================================================
  // SESSION
  // ====================================================

  session: () =>
    readJSON<Session | null>(
      STORAGE_KEYS.session,
      null,
    ),

  saveSession: (
    value: Session | null,
  ) => {
    if (value) {
      writeJSON(
        STORAGE_KEYS.session,
        value,
      );
    } else {
      removeKey(
        STORAGE_KEYS.session,
      );
    }
  },

  // ====================================================
  // PEMASUKAN
  // ====================================================

  income: () =>
    readJSON<IncomeRecord[]>(
      STORAGE_KEYS.income,
      defaultIncome,
    ),

  saveIncome: (
    value: IncomeRecord[],
  ) =>
    writeJSON(
      STORAGE_KEYS.income,
      value,
    ),

  // ====================================================
  // PENGELUARAN
  // ====================================================

  expenses: () =>
    readJSON<ExpenseRecord[]>(
      STORAGE_KEYS.expenses,
      defaultExpenses,
    ),

  saveExpenses: (
    value: ExpenseRecord[],
  ) =>
    writeJSON(
      STORAGE_KEYS.expenses,
      value,
    ),

  // ====================================================
  // JENIS BUMDes
  // ====================================================

  bumdesTypes: () =>
    readJSON<BumdesType[]>(
      STORAGE_KEYS.bumdesTypes,
      defaultBumdesTypes,
    ),

  saveBumdesTypes: (
    value: BumdesType[],
  ) =>
    writeJSON(
      STORAGE_KEYS.bumdesTypes,
      value,
    ),

  // ====================================================
  // BARANG
  // ====================================================

  items: () =>
    readJSON<InventoryItem[]>(
      STORAGE_KEYS.items,
      defaultItems,
    ),

  saveItems: (
    value: InventoryItem[],
  ) =>
    writeJSON(
      STORAGE_KEYS.items,
      value,
    ),

  // ====================================================
  // PEMINJAMAN BARANG
  // ====================================================

  loans: () =>
    readJSON<LoanRecord[]>(
      STORAGE_KEYS.loans,
      defaultLoans,
    ),

  saveLoans: (
    value: LoanRecord[],
  ) =>
    writeJSON(
      STORAGE_KEYS.loans,
      value,
    ),

  // ====================================================
  // SIMPAN PINJAM UANG
  // ====================================================

  savingsLoans: () =>
    readJSON<SavingsLoanRecord[]>(
      STORAGE_KEYS.savingsLoans,
      [],
    ),

  saveSavingsLoans: (
    value: SavingsLoanRecord[],
  ) =>
    writeJSON(
      STORAGE_KEYS.savingsLoans,
      value,
    ),

  // ====================================================
  // PEMBAYARAN SIMPAN PINJAM
  // ====================================================

  savingsLoanPayments: () =>
    readJSON<SavingsLoanPayment[]>(
      STORAGE_KEYS.savingsLoanPayments,
      [],
    ),

  saveSavingsLoanPayments: (
    value: SavingsLoanPayment[],
  ) =>
    writeJSON(
      STORAGE_KEYS.savingsLoanPayments,
      value,
    ),

  // ====================================================
  // SETTINGS
  // ====================================================

  settings: () =>
    readJSON<AppSettings>(
      STORAGE_KEYS.settings,
      defaultSettings,
    ),

  saveSettings: (
    value: AppSettings,
  ) =>
    writeJSON(
      STORAGE_KEYS.settings,
      value,
    ),

  // ====================================================
  // NOTIFICATIONS
  // ====================================================

  notifications: () =>
    readJSON<AppNotification[]>(
      STORAGE_KEYS.notifications,
      defaultNotifications,
    ),

  saveNotifications: (
    value: AppNotification[],
  ) =>
    writeJSON(
      STORAGE_KEYS.notifications,
      value,
    ),
};