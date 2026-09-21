import { create } from "zustand";

import { DEMO_CREDENTIALS } from "@/lib/constants";
import { defaultSettings } from "@/data/dummy-data";
import { todayISO } from "@/lib/format";

import {
  resetDemoData,
  seedIfNeeded,
  storageApi,
} from "@/lib/storage";

import { resolveLoanStatus } from "@/lib/finance";
import { uid } from "@/lib/utils";

import {
  createExpense,
  createIncome,
  fetchBootstrap,
} from "@/lib/api-client";

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
  Session,
  UserAccount,
} from "@/lib/types";

// ======================================================
// APP STORE TYPE
// ======================================================

type AppStore = {
  ready: boolean;

  session: Session | null;

  users: UserAccount[];

  income: IncomeRecord[];

  expenses: ExpenseRecord[];

  bumdesTypes: BumdesType[];

  items: InventoryItem[];

  loans: LoanRecord[];

  savingsLoans: SavingsLoanRecord[];

  savingsLoanPayments: SavingsLoanPayment[];

  settings: AppSettings;

  notifications: AppNotification[];

  // ====================================================
  // SYSTEM
  // ====================================================

  hydrate: () => void;

  login: (
    identifier: string,
    password: string,
  ) =>
    | { ok: true }
    | { ok: false; message: string };

  logout: () => void;

  // ====================================================
  // PEMASUKAN
  // ====================================================

  addIncome: (
    payload: Omit<
      IncomeRecord,
      "id" | "createdAt"
    >,
  ) => void;

  updateIncome: (
    id: string,
    payload: Omit<
      IncomeRecord,
      "id" | "createdAt"
    >,
  ) => void;

  deleteIncome: (id: string) => void;

  // ====================================================
  // PENGELUARAN
  // ====================================================

  addExpense: (
    payload: Omit<
      ExpenseRecord,
      "id" | "createdAt"
    >,
  ) => void;

  updateExpense: (
    id: string,
    payload: Omit<
      ExpenseRecord,
      "id" | "createdAt"
    >,
  ) => void;

  deleteExpense: (id: string) => void;

  // ====================================================
  // JENIS BUMDes
  // ====================================================

  addBumdesType: (
    payload: Omit<
      BumdesType,
      "id" | "createdAt"
    >,
  ) => void;

  updateBumdesType: (
    id: string,
    payload: Omit<
      BumdesType,
      "id" | "createdAt"
    >,
  ) => void;

  deleteBumdesType: (id: string) => void;

  // ====================================================
  // BARANG
  // ====================================================

  addItem: (
    payload: Omit<
      InventoryItem,
      "id" | "borrowed"
    > & {
      borrowed?: number;
    },
  ) => void;

  updateItem: (
    id: string,
    payload: Omit<
      InventoryItem,
      "id"
    >,
  ) => void;

  deleteItem: (
    id: string,
  ) =>
    | { ok: true }
    | { ok: false; message: string };

  // ====================================================
  // PEMINJAMAN BARANG
  // ====================================================

  addLoan: (
    payload: Omit<
      LoanRecord,
      | "id"
      | "createdAt"
      | "status"
      | "itemName"
      | "actualReturnDate"
    >,
  ) =>
    | { ok: true; id: string }
    | { ok: false; message: string };

  updateLoan: (
    id: string,
    payload: Omit<
      LoanRecord,
      | "id"
      | "createdAt"
      | "status"
      | "itemName"
      | "actualReturnDate"
    >,
  ) =>
    | { ok: true }
    | { ok: false; message: string };

  returnLoan: (
    id: string,
  ) =>
    | { ok: true }
    | { ok: false; message: string };

  deleteLoan: (id: string) => void;

  // ====================================================
  // SIMPAN PINJAM UANG
  // ====================================================

  addSavingsLoan: (
    payload: Omit<
      SavingsLoanRecord,
      "id" | "createdAt"
    >,
  ) => void;

  updateSavingsLoan: (
    id: string,
    payload: Omit<
      SavingsLoanRecord,
      "id" | "createdAt"
    >,
  ) => void;

  deleteSavingsLoan: (
    id: string,
  ) => void;

  addSavingsLoanPayment: (
    savingsLoanId: string,
    payload: Omit<
      SavingsLoanPayment,
      "id" | "savingsLoanId" | "createdAt"
    >,
  ) =>
    | { ok: true }
    | { ok: false; message: string };

  // ====================================================
  // PENGATURAN
  // ====================================================

  saveSettings: (
    payload: AppSettings,
  ) => void;

  // ====================================================
  // NOTIFIKASI
  // ====================================================

  markNotificationRead: (
    id: string,
  ) => void;

  markAllNotificationsRead: () => void;

  // ====================================================
  // DEMO
  // ====================================================

  restoreDemo: () => void;
};

// ======================================================
// HELPER API MAPPER
// ======================================================

function asRecord(
  value: unknown,
): Record<string, unknown> {
  if (
    typeof value === "object" &&
    value !== null
  ) {
    return value as Record<string, unknown>;
  }

  return {};
}

function asString(
  value: unknown,
  fallback = "",
): string {
  return typeof value === "string"
    ? value
    : fallback;
}

function asNumber(
  value: unknown,
  fallback = 0,
): number {
  const numberValue =
    typeof value === "number"
      ? value
      : Number(value);

  return Number.isFinite(numberValue)
    ? numberValue
    : fallback;
}

function normalizeProof(
  value: unknown,
): ProofFile | null {
  if (!value) {
    return null;
  }

  let parsed: unknown = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return {
        name: value,
      };
    }
  }

  const record = asRecord(parsed);

  const name = asString(
    record.name,
    "Bukti transaksi",
  );

  const dataUrl = asString(
    record.dataUrl,
  );

  return {
    name,
    ...(dataUrl ? { dataUrl } : {}),
  };
}

function mapIncome(
  value: unknown,
): IncomeRecord {
  const row = asRecord(value);

  return {
    id: asString(
      row.id,
      uid("inc"),
    ),

    bumdesTypeId: asString(
      row.bumdesTypeId ??
        row.bumdes_type_id,
    ),

    date: asString(row.date),

    source: asString(
      row.source,
    ),

    category: asString(
      row.category,
    ),

    description: asString(
      row.description,
    ),

    amount: asNumber(
      row.amount,
    ),

    proof: normalizeProof(
      row.proof,
    ),

    createdAt: asString(
      row.createdAt ??
        row.created_at,
      new Date().toISOString(),
    ),
  };
}

function mapExpense(
  value: unknown,
): ExpenseRecord {
  const row = asRecord(value);

  return {
    id: asString(
      row.id,
      uid("exp"),
    ),

    bumdesTypeId: asString(
      row.bumdesTypeId ??
        row.bumdes_type_id,
    ),

    date: asString(
      row.date,
    ),

    category: asString(
      row.category,
    ),

    purpose: asString(
      row.purpose,
    ),

    description: asString(
      row.description,
    ),

    amount: asNumber(
      row.amount,
    ),

    proof: normalizeProof(
      row.proof,
    ),

    createdAt: asString(
      row.createdAt ??
        row.created_at,
      new Date().toISOString(),
    ),
  };
}

function mapBumdesType(
  value: unknown,
): BumdesType {
  const row = asRecord(value);

  return {
    id: asString(
      row.id,
      uid("bumdes"),
    ),

    name: asString(
      row.name,
    ),

    category:
      asString(row.category) ||
      asString(row.type) ||
      "Lainnya",

    description: asString(
      row.description,
    ),

    status:
      row.status === "inactive"
        ? "inactive"
        : "active",

    createdAt: asString(
      row.createdAt ??
        row.created_at,
      new Date().toISOString(),
    ),
  };
}

function mapItem(
  value: unknown,
): InventoryItem {
  const row = asRecord(value);

  return {
    id: asString(
      row.id,
      uid("item"),
    ),

    name: asString(
      row.name,
    ),

    category: asString(
      row.category,
    ),

    quantity: asNumber(
      row.quantity,
    ),

    borrowed: asNumber(
      row.borrowed,
    ),

    condition:
      row.condition ===
        "Rusak Ringan" ||
      row.condition ===
        "Rusak Berat"
        ? row.condition
        : "Baik",
  };
}

function mapLoan(
  value: unknown,
): LoanRecord {
  const row = asRecord(value);

  const mapped: LoanRecord = {
    id: asString(
      row.id,
      uid("loan"),
    ),

    borrowerName: asString(
      row.borrowerName ??
        row.borrower_name,
    ),

    phone: asString(
      row.phone,
    ),

    itemId: asString(
      row.itemId ??
        row.item_id,
    ),

    itemName: asString(
      row.itemName ??
        row.item_name,
    ),

    quantity: asNumber(
      row.quantity,
    ),

    borrowDate: asString(
      row.borrowDate ??
        row.borrow_date,
    ),

    returnDate: asString(
      row.returnDate ??
        row.return_date,
    ),

    actualReturnDate:
      asString(
        row.actualReturnDate ??
          row.actual_return_date,
      ) || null,

    purpose: asString(
      row.purpose,
    ),

    notes: asString(
      row.notes,
    ),

    status:
      row.status === "returned"
        ? "returned"
        : row.status === "overdue"
          ? "overdue"
          : "borrowed",

    createdAt: asString(
      row.createdAt ??
        row.created_at,
      new Date().toISOString(),
    ),
  };

  return {
    ...mapped,

    status:
      resolveLoanStatus(
        mapped,
      ),
  };
}

function mapSavingsLoan(
  value: unknown,
): SavingsLoanRecord {
  const row = asRecord(value);

  const totalPaid = asNumber(
    row.totalPaid ??
      row.total_paid,
  );

  const loanAmount = asNumber(
    row.loanAmount ??
      row.loan_amount,
  );

  let status:
    SavingsLoanRecord["status"];

  if (
    row.status === "paid" ||
    totalPaid >= loanAmount
  ) {
    status = "paid";
  } else if (
    row.status === "overdue"
  ) {
    status = "overdue";
  } else {
    status = "active";
  }

  return {
    id: asString(
      row.id,
      uid("savings-loan"),
    ),

    borrowerName: asString(
      row.borrowerName ??
        row.borrower_name,
    ),

    phone: asString(
      row.phone,
    ),

    address: asString(
      row.address,
    ),

    loanDate: asString(
      row.loanDate ??
        row.loan_date,
    ),

    dueDate: asString(
      row.dueDate ??
        row.due_date,
    ),

    loanAmount,

    installmentAmount:
      asNumber(
        row.installmentAmount ??
          row.installment_amount,
      ),

    totalPaid,

    purpose: asString(
      row.purpose,
    ),

    notes: asString(
      row.notes,
    ),

    status,

    createdAt: asString(
      row.createdAt ??
        row.created_at,
      new Date().toISOString(),
    ),
  };
}

function mapSavingsLoanPayment(
  value: unknown,
): SavingsLoanPayment {
  const row = asRecord(value);

  return {
    id: asString(
      row.id,
      uid("savings-payment"),
    ),

    savingsLoanId: asString(
      row.savingsLoanId ??
        row.savings_loan_id,
    ),

    paymentDate: asString(
      row.paymentDate ??
        row.payment_date,
    ),

    amount: asNumber(
      row.amount,
    ),

    notes: asString(
      row.notes,
    ),

    createdAt: asString(
      row.createdAt ??
        row.created_at,
      new Date().toISOString(),
    ),
  };
}

function mapSettings(
  value: unknown,
): AppSettings | null {
  if (!value) {
    return null;
  }

  const row = asRecord(value);

  return {
    bumdesName:
      asString(
        row.bumdesName ??
          row.bumdes_name,
      ) ||
      defaultSettings.bumdesName,

    villageName:
      asString(
        row.villageName ??
          row.village_name,
      ) ||
      defaultSettings.villageName,

    address:
      asString(
        row.address,
      ) ||
      defaultSettings.address,

    phone:
      asString(
        row.phone,
      ) ||
      defaultSettings.phone,

    email:
      asString(
        row.email,
      ) ||
      defaultSettings.email,

    adminName:
      asString(
        row.adminName ??
          row.admin_name,
      ) ||
      defaultSettings.adminName,

    adminUsername:
      asString(
        row.adminUsername ??
          row.admin_username,
      ) ||
      defaultSettings.adminUsername,

    adminEmail:
      asString(
        row.adminEmail ??
          row.admin_email,
      ) ||
      defaultSettings.adminEmail,
  };
}

function mapNotification(
  value: unknown,
): AppNotification {
  const row = asRecord(value);

  return {
    id: asString(
      row.id,
      uid("notification"),
    ),

    title: asString(
      row.title,
    ),

    body: asString(
      row.body,
    ),

    time: asString(
      row.time,
    ),

    read:
      row.read === true ||
      row.read === 1,

    href:
      asString(
        row.href,
      ) || undefined,
  };
}

// ======================================================
// PERSIST DATA
// ======================================================

function persist(
  partial: Partial<AppStore>,
) {
  if (partial.income) {
    storageApi.saveIncome(
      partial.income,
    );
  }

  if (partial.expenses) {
    storageApi.saveExpenses(
      partial.expenses,
    );
  }

  if (partial.bumdesTypes) {
    storageApi.saveBumdesTypes(
      partial.bumdesTypes,
    );
  }

  if (partial.items) {
    storageApi.saveItems(
      partial.items,
    );
  }

  if (partial.loans) {
    storageApi.saveLoans(
      partial.loans,
    );
  }

  if (partial.savingsLoans) {
    storageApi.saveSavingsLoans(
      partial.savingsLoans,
    );
  }

  if (
    partial.savingsLoanPayments
  ) {
    storageApi.saveSavingsLoanPayments(
      partial.savingsLoanPayments,
    );
  }

  if (partial.settings) {
    storageApi.saveSettings(
      partial.settings,
    );
  }

  if (partial.notifications) {
    storageApi.saveNotifications(
      partial.notifications,
    );
  }

  if (partial.users) {
    storageApi.saveUsers(
      partial.users,
    );
  }

  if ("session" in partial) {
    storageApi.saveSession(
      partial.session ?? null,
    );
  }
}

// ======================================================
// APP STORE
// ======================================================

export const useAppStore =
  create<AppStore>(
    (set, get) => ({
      ready: false,

      session: null,

      users: [],

      income: [],

      expenses: [],

      bumdesTypes: [],

      items: [],

      loans: [],

      savingsLoans: [],

      savingsLoanPayments: [],

      settings:
        defaultSettings,

      notifications: [],

      // ==================================================
      // HYDRATE
      // ==================================================

      hydrate: () => {
        seedIfNeeded();

        const localLoans =
          storageApi
            .loans()
            .map((loan) => ({
              ...loan,

              status:
                resolveLoanStatus(
                  loan,
                ),
            }));

        storageApi.saveLoans(
          localLoans,
        );

        const localState = {
          ready: true,

          session:
            storageApi.session(),

          users:
            storageApi.users(),

          income:
            storageApi.income(),

          expenses:
            storageApi.expenses(),

          bumdesTypes:
            storageApi.bumdesTypes(),

          items:
            storageApi.items(),

          loans:
            localLoans,

          savingsLoans:
            storageApi.savingsLoans(),

          savingsLoanPayments:
            storageApi.savingsLoanPayments(),

          settings:
            storageApi.settings(),

          notifications:
            storageApi.notifications(),
        };

        set(localState);

        // ==================================================
        // SYNC BACKEND
        // ==================================================

        void (async () => {
          try {
            const bootstrap =
              await fetchBootstrap();

            const local = get();

            const remoteIncome =
              Array.isArray(
                bootstrap.income,
              )
                ? bootstrap.income.map(
                    mapIncome,
                  )
                : [];

            const remoteExpenses =
              Array.isArray(
                bootstrap.expenses,
              )
                ? bootstrap.expenses.map(
                    mapExpense,
                  )
                : [];

            const remoteBumdesTypes =
              Array.isArray(
                bootstrap.bumdesTypes,
              )
                ? bootstrap.bumdesTypes.map(
                    mapBumdesType,
                  )
                : [];

            const remoteItems =
              Array.isArray(
                bootstrap.items,
              )
                ? bootstrap.items.map(
                    mapItem,
                  )
                : [];

            const remoteLoans =
              Array.isArray(
                bootstrap.loans,
              )
                ? bootstrap.loans.map(
                    mapLoan,
                  )
                : [];

            const remoteSavingsLoans =
              Array.isArray(
                bootstrap.savingsLoans,
              )
                ? bootstrap.savingsLoans.map(
                    mapSavingsLoan,
                  )
                : [];

            const remotePayments =
              Array.isArray(
                bootstrap.savingsLoanPayments,
              )
                ? bootstrap.savingsLoanPayments.map(
                    mapSavingsLoanPayment,
                  )
                : [];

            const remoteNotifications =
              Array.isArray(
                bootstrap.notifications,
              )
                ? bootstrap.notifications.map(
                    mapNotification,
                  )
                : [];

            const remoteSettings =
              mapSettings(
                bootstrap.settings,
              );

            /*
             * TRANSISI AMAN
             *
             * Kalau database Laravel masih kosong,
             * data LocalStorage tetap dipakai.
             *
             * Begitu database Laravel sudah mempunyai
             * data, data tersebut menjadi sumber utama
             * untuk modul terkait.
             */

            const income =
              remoteIncome.length
                ? remoteIncome
                : local.income;

            const expenses =
              remoteExpenses.length
                ? remoteExpenses
                : local.expenses;

            const bumdesTypes =
              remoteBumdesTypes.length
                ? remoteBumdesTypes
                : local.bumdesTypes;

            const items =
              remoteItems.length
                ? remoteItems
                : local.items;

            const loans =
              remoteLoans.length
                ? remoteLoans
                : local.loans;

            const savingsLoans =
              remoteSavingsLoans.length
                ? remoteSavingsLoans
                : local.savingsLoans;

            const savingsLoanPayments =
              remotePayments.length
                ? remotePayments
                : local.savingsLoanPayments;

            const notifications =
              remoteNotifications.length
                ? remoteNotifications
                : local.notifications;

            const settings =
              remoteSettings ??
              local.settings;

            persist({
              income,
              expenses,
              bumdesTypes,
              items,
              loans,
              savingsLoans,
              savingsLoanPayments,
              settings,
              notifications,
            });

            set({
              income,
              expenses,
              bumdesTypes,
              items,
              loans,
              savingsLoans,
              savingsLoanPayments,
              settings,
              notifications,
            });
          } catch (error) {
            console.warn(
              "[BUMDes] Backend sync gagal. LocalStorage tetap digunakan.",
              error,
            );
          }
        })();
      },

      // ==================================================
      // LOGIN
      // ==================================================

      login: (
        identifier,
        password,
      ) => {
        const id =
          identifier
            .trim()
            .toLowerCase();

        /*
         * PENTING:
         * Selalu ambil users terbaru dari
         * LocalStorage.
         *
         * Password reset mengubah data users
         * di LocalStorage. Zustand tidak otomatis
         * mengetahui perubahan tersebut.
         */
        const users =
          storageApi.users();

        /*
         * Sinkronkan users terbaru ke Zustand
         * supaya state users juga ikut berubah.
         */
        set({
          users,
        });

        const user =
          users.find(
            (row) =>
              row.username
                .toLowerCase() ===
                id ||
              row.email
                .toLowerCase() ===
                id,
          );

        if (
          !user ||
          user.password !== password
        ) {
          return {
            ok: false,
            message:
              "Username atau kata sandi tidak sesuai.",
          };
        }

        const session: Session =
          {
            userId:
              user.id,

            username:
              user.username,

            name:
              user.name,

            email:
              user.email,
          };

        persist({
          session,
        } as Partial<AppStore>);

        set({
          session,
        });

        return {
          ok: true,
        };
      },

      // ==================================================
      // LOGOUT
      // ==================================================

      logout: () => {
        persist({
          session: null,
        } as Partial<AppStore>);

        set({
          session: null,
        });
      },

      // ==================================================
      // PEMASUKAN
      // ==================================================

      addIncome: (
        payload,
      ) => {
        const localRow:
          IncomeRecord =
          {
            ...payload,

            id: uid("inc"),

            createdAt:
              new Date().toISOString(),
          };

        const nextIncome = [
          localRow,
          ...get().income,
        ];

        persist({
          income:
            nextIncome,
        });

        set({
          income:
            nextIncome,
        });

        void createIncome({
          bumdesTypeId:
            payload.bumdesTypeId ||
            undefined,

          date:
            payload.date,

          source:
            payload.source,

          category:
            payload.category,

          description:
            payload.description,

          amount:
            payload.amount,

          proof:
            payload.proof ?? null,
        })
          .then(
            (response) => {
              const serverRecord =
                mapIncome(
                  response.data,
                );

              const syncedIncome =
                get().income.map(
                  (row) =>
                    row.id ===
                    localRow.id
                      ? serverRecord
                      : row,
                );

              persist({
                income:
                  syncedIncome,
              });

              set({
                income:
                  syncedIncome,
              });
            },
          )
          .catch(
            (error) => {
              console.error(
                "[BUMDes] Gagal menyimpan pemasukan ke Laravel:",
                error,
              );
            },
          );
      },

      updateIncome: (
        id,
        payload,
      ) => {
        const income =
          get().income.map(
            (row) =>
              row.id === id
                ? {
                    ...row,
                    ...payload,
                  }
                : row,
          );

        persist({
          income,
        });

        set({
          income,
        });
      },

      deleteIncome: (
        id,
      ) => {
        const income =
          get().income.filter(
            (row) =>
              row.id !== id,
          );

        persist({
          income,
        });

        set({
          income,
        });
      },

      // ==================================================
      // PENGELUARAN
      // ==================================================

      addExpense: (
        payload,
      ) => {
        const localRow:
          ExpenseRecord =
          {
            ...payload,

            id: uid("exp"),

            createdAt:
              new Date().toISOString(),
          };

        const nextExpenses = [
          localRow,
          ...get().expenses,
        ];

        persist({
          expenses:
            nextExpenses,
        });

        set({
          expenses:
            nextExpenses,
        });

        void createExpense({
          bumdesTypeId:
            payload.bumdesTypeId ||
            undefined,

          date:
            payload.date,

          category:
            payload.category,

          purpose:
            payload.purpose,

          description:
            payload.description,

          amount:
            payload.amount,

          proof:
            payload.proof ?? null,
        })
          .then(
            (response) => {
              const serverRecord =
                mapExpense(
                  response.data,
                );

              const syncedExpenses =
                get().expenses.map(
                  (row) =>
                    row.id ===
                    localRow.id
                      ? serverRecord
                      : row,
                );

              persist({
                expenses:
                  syncedExpenses,
              });

              set({
                expenses:
                  syncedExpenses,
              });
            },
          )
          .catch(
            (error) => {
              console.error(
                "[BUMDes] Gagal menyimpan pengeluaran ke Laravel:",
                error,
              );
            },
          );
      },

      updateExpense: (
        id,
        payload,
      ) => {
        const expenses =
          get().expenses.map(
            (row) =>
              row.id === id
                ? {
                    ...row,
                    ...payload,
                  }
                : row,
          );

        persist({
          expenses,
        });

        set({
          expenses,
        });
      },

      deleteExpense: (
        id,
      ) => {
        const expenses =
          get().expenses.filter(
            (row) =>
              row.id !== id,
          );

        persist({
          expenses,
        });

        set({
          expenses,
        });
      },

      // ==================================================
      // JENIS BUMDes
      // ==================================================

      addBumdesType: (
        payload,
      ) => {
        const bumdesType:
          BumdesType =
          {
            ...payload,

            id: uid("bumdes"),

            createdAt:
              new Date().toISOString(),
          };

        const bumdesTypes = [
          bumdesType,
          ...get().bumdesTypes,
        ];

        persist({
          bumdesTypes,
        });

        set({
          bumdesTypes,
        });
      },

      updateBumdesType: (
        id,
        payload,
      ) => {
        const bumdesTypes =
          get().bumdesTypes.map(
            (row) =>
              row.id === id
                ? {
                    ...row,
                    ...payload,
                  }
                : row,
          );

        persist({
          bumdesTypes,
        });

        set({
          bumdesTypes,
        });
      },

      deleteBumdesType: (
        id,
      ) => {
        const bumdesTypes =
          get().bumdesTypes.filter(
            (row) =>
              row.id !== id,
          );

        persist({
          bumdesTypes,
        });

        set({
          bumdesTypes,
        });
      },

      // ==================================================
      // BARANG
      // ==================================================

      addItem: (
        payload,
      ) => {
        const item:
          InventoryItem =
          {
            id: uid("item"),

            name:
              payload.name,

            category:
              payload.category,

            quantity:
              payload.quantity,

            borrowed:
              payload.borrowed ??
              0,

            condition:
              payload.condition,
          };

        const items = [
          item,
          ...get().items,
        ];

        persist({
          items,
        });

        set({
          items,
        });
      },

      updateItem: (
        id,
        payload,
      ) => {
        const current =
          get().items.find(
            (row) =>
              row.id === id,
          );

        if (!current) {
          return;
        }

        const borrowed =
          Math.min(
            payload.borrowed,
            payload.quantity,
          );

        const items =
          get().items.map(
            (row) =>
              row.id === id
                ? {
                    ...row,
                    ...payload,
                    borrowed,
                  }
                : row,
          );

        persist({
          items,
        });

        set({
          items,
        });
      },

      deleteItem: (
        id,
      ) => {
        const item =
          get().items.find(
            (row) =>
              row.id === id,
          );

        if (!item) {
          return {
            ok: false,
            message:
              "Barang tidak ditemukan.",
          };
        }

        if (
          item.borrowed > 0
        ) {
          return {
            ok: false,
            message:
              "Barang tidak dapat dihapus karena masih ada yang dipinjam.",
          };
        }

        const items =
          get().items.filter(
            (row) =>
              row.id !== id,
          );

        persist({
          items,
        });

        set({
          items,
        });

        return {
          ok: true,
        };
      },

      // ==================================================
      // PEMINJAMAN BARANG
      // ==================================================

      addLoan: (
        payload,
      ) => {
        const item =
          get().items.find(
            (row) =>
              row.id ===
              payload.itemId,
          );

        if (!item) {
          return {
            ok: false,
            message:
              "Barang tidak ditemukan.",
          };
        }

        const available =
          item.quantity -
          item.borrowed;

        if (
          payload.quantity >
          available
        ) {
          return {
            ok: false,
            message: `Jumlah melebihi stok tersedia (${available}).`,
          };
        }

        if (
          payload.returnDate <
          payload.borrowDate
        ) {
          return {
            ok: false,
            message:
              "Tanggal kembali tidak boleh lebih awal dari tanggal pinjam.",
          };
        }

        const loan:
          LoanRecord =
          {
            ...payload,

            id: uid("loan"),

            itemName:
              item.name,

            status:
              resolveLoanStatus(
                {
                  ...payload,

                  id: "tmp",

                  itemName:
                    item.name,

                  status:
                    "borrowed",

                  createdAt:
                    "",
                },
              ),

            createdAt:
              new Date().toISOString(),
          };

        const loans = [
          loan,
          ...get().loans,
        ];

        const items =
          get().items.map(
            (row) =>
              row.id === item.id
                ? {
                    ...row,

                    borrowed:
                      row.borrowed +
                      payload.quantity,
                  }
                : row,
          );

        persist({
          loans,
          items,
        });

        set({
          loans,
          items,
        });

        return {
          ok: true,
          id: loan.id,
        };
      },

      updateLoan: (
        id,
        payload,
      ) => {
        const loan =
          get().loans.find(
            (row) =>
              row.id === id,
          );

        if (!loan) {
          return {
            ok: false,
            message:
              "Data peminjaman tidak ditemukan.",
          };
        }

        if (
          loan.status ===
          "returned"
        ) {
          return {
            ok: false,
            message:
              "Peminjaman yang sudah dikembalikan tidak dapat diubah.",
          };
        }

        const nextItem =
          get().items.find(
            (row) =>
              row.id ===
              payload.itemId,
          );

        if (!nextItem) {
          return {
            ok: false,
            message:
              "Barang tidak ditemukan.",
          };
        }

        if (
          payload.returnDate <
          payload.borrowDate
        ) {
          return {
            ok: false,
            message:
              "Tanggal kembali tidak boleh lebih awal dari tanggal pinjam.",
          };
        }

        let items =
          get().items.map(
            (row) => {
              if (
                row.id ===
                loan.itemId
              ) {
                return {
                  ...row,

                  borrowed:
                    Math.max(
                      0,
                      row.borrowed -
                        loan.quantity,
                    ),
                };
              }

              return row;
            },
          );

        const target =
          items.find(
            (row) =>
              row.id ===
              payload.itemId,
          );

        if (!target) {
          return {
            ok: false,
            message:
              "Barang tidak ditemukan.",
          };
        }

        const available =
          target.quantity -
          target.borrowed;

        if (
          payload.quantity >
          available
        ) {
          return {
            ok: false,
            message: `Jumlah melebihi stok tersedia (${available}).`,
          };
        }

        items =
          items.map(
            (row) =>
              row.id ===
              payload.itemId
                ? {
                    ...row,

                    borrowed:
                      row.borrowed +
                      payload.quantity,
                  }
                : row,
          );

        const loans =
          get().loans.map(
            (row) =>
              row.id === id
                ? {
                    ...row,

                    ...payload,

                    itemName:
                      nextItem.name,

                    status:
                      resolveLoanStatus(
                        {
                          ...row,

                          ...payload,

                          itemName:
                            nextItem.name,
                        },
                      ),
                  }
                : row,
          );

        persist({
          loans,
          items,
        });

        set({
          loans,
          items,
        });

        return {
          ok: true,
        };
      },

      returnLoan: (
        id,
      ) => {
        const loan =
          get().loans.find(
            (row) =>
              row.id === id,
          );

        if (!loan) {
          return {
            ok: false,
            message:
              "Data peminjaman tidak ditemukan.",
          };
        }

        if (
          loan.status ===
          "returned"
        ) {
          return {
            ok: true,
          };
        }

        const loans =
          get().loans.map(
            (row) =>
              row.id === id
                ? {
                    ...row,

                    status:
                      "returned" as const,

                    actualReturnDate:
                      todayISO(),
                  }
                : row,
          );

        const items =
          get().items.map(
            (row) =>
              row.id ===
              loan.itemId
                ? {
                    ...row,

                    borrowed:
                      Math.max(
                        0,
                        row.borrowed -
                          loan.quantity,
                      ),
                  }
                : row,
          );

        persist({
          loans,
          items,
        });

        set({
          loans,
          items,
        });

        return {
          ok: true,
        };
      },

      deleteLoan: (
        id,
      ) => {
        const loan =
          get().loans.find(
            (row) =>
              row.id === id,
          );

        if (!loan) {
          return;
        }

        const loans =
          get().loans.filter(
            (row) =>
              row.id !== id,
          );

        const items =
          loan.status ===
          "returned"
            ? get().items
            : get().items.map(
                (row) =>
                  row.id ===
                  loan.itemId
                    ? {
                        ...row,

                        borrowed:
                          Math.max(
                            0,
                            row.borrowed -
                              loan.quantity,
                          ),
                      }
                    : row,
              );

        persist({
          loans,
          items,
        });

        set({
          loans,
          items,
        });
      },

      // ==================================================
      // SIMPAN PINJAM UANG
      // ==================================================

      addSavingsLoan: (
        payload,
      ) => {
        const record:
          SavingsLoanRecord =
          {
            ...payload,

            id: uid(
              "savings-loan",
            ),

            createdAt:
              new Date().toISOString(),
          };

        const savingsLoans = [
          record,
          ...get().savingsLoans,
        ];

        persist({
          savingsLoans,
        });

        set({
          savingsLoans,
        });
      },

      updateSavingsLoan: (
        id,
        payload,
      ) => {
        const savingsLoans =
          get().savingsLoans.map(
            (row) =>
              row.id === id
                ? {
                    ...row,
                    ...payload,
                  }
                : row,
          );

        persist({
          savingsLoans,
        });

        set({
          savingsLoans,
        });
      },

      deleteSavingsLoan: (
        id,
      ) => {
        const savingsLoans =
          get().savingsLoans.filter(
            (row) =>
              row.id !== id,
          );

        const savingsLoanPayments =
          get().savingsLoanPayments.filter(
            (row) =>
              row.savingsLoanId !==
              id,
          );

        persist({
          savingsLoans,
          savingsLoanPayments,
        });

        set({
          savingsLoans,
          savingsLoanPayments,
        });
      },

      addSavingsLoanPayment: (
        savingsLoanId,
        payload,
      ) => {
        const loan =
          get().savingsLoans.find(
            (row) =>
              row.id ===
              savingsLoanId,
          );

        if (!loan) {
          return {
            ok: false,
            message:
              "Data pinjaman tidak ditemukan.",
          };
        }

        if (
          payload.amount <= 0
        ) {
          return {
            ok: false,
            message:
              "Nominal pembayaran harus lebih dari Rp0.",
          };
        }

        const remaining =
          Math.max(
            0,
            loan.loanAmount -
              loan.totalPaid,
          );

        if (
          remaining <= 0
        ) {
          return {
            ok: false,
            message:
              "Pinjaman ini sudah lunas.",
          };
        }

        if (
          payload.amount >
          remaining
        ) {
          return {
            ok: false,
            message: `Pembayaran melebihi sisa pinjaman (${remaining}).`,
          };
        }

        const payment:
          SavingsLoanPayment =
          {
            ...payload,

            id: uid(
              "savings-payment",
            ),

            savingsLoanId,

            createdAt:
              new Date().toISOString(),
          };

        const totalPaid =
          loan.totalPaid +
          payload.amount;

        const status:
          SavingsLoanRecord["status"] =
          totalPaid >=
          loan.loanAmount
            ? "paid"
            : "active";

        const savingsLoans:
          SavingsLoanRecord[] =
          get().savingsLoans.map(
            (row) =>
              row.id ===
              savingsLoanId
                ? {
                    ...row,

                    totalPaid,

                    status,
                  }
                : row,
          );

        const savingsLoanPayments =
          [
            payment,
            ...get()
              .savingsLoanPayments,
          ];

        persist({
          savingsLoans,
          savingsLoanPayments,
        });

        set({
          savingsLoans,
          savingsLoanPayments,
        });

        return {
          ok: true,
        };
      },

      // ==================================================
      // PENGATURAN
      // ==================================================

      saveSettings: (
        payload,
      ) => {
        /*
         * Ambil users langsung dari LocalStorage,
         * bukan dari state Zustand.
         *
         * Ini mencegah password terbaru
         * tertimpa password lama ketika
         * pengaturan profil disimpan.
         */
        const currentUsers =
          storageApi.users();

        const users =
          currentUsers.map(
            (user) =>
              user.username ===
              DEMO_CREDENTIALS.username
                ? {
                    ...user,

                    name:
                      payload.adminName,

                    username:
                      payload.adminUsername,

                    email:
                      payload.adminEmail,
                  }
                : user,
          );

        persist({
          settings:
            payload,

          users,
        });

        const session:
          | Session
          | null =
          get().session
            ? {
                ...get().session!,

                name:
                  payload.adminName,

                username:
                  payload.adminUsername,

                email:
                  payload.adminEmail,
              }
            : null;

        persist({
          session,
        } as Partial<AppStore>);

        set({
          settings:
            payload,

          users,

          session,
        });
      },

      // ==================================================
      // NOTIFIKASI
      // ==================================================

      markNotificationRead: (
        id,
      ) => {
        const notifications =
          get().notifications.map(
            (row) =>
              row.id === id
                ? {
                    ...row,
                    read: true,
                  }
                : row,
          );

        persist({
          notifications,
        });

        set({
          notifications,
        });
      },

      markAllNotificationsRead:
        () => {
          const notifications =
            get().notifications.map(
              (row) => ({
                ...row,
                read: true,
              }),
            );

          persist({
            notifications,
          });

          set({
            notifications,
          });
        },

      // ==================================================
      // RESTORE DEMO
      // ==================================================

      restoreDemo: () => {
        const session =
          get().session;

        resetDemoData();

        if (session) {
          storageApi.saveSession(
            session,
          );
        }

        seedIfNeeded();

        const loans =
          storageApi
            .loans()
            .map((loan) => ({
              ...loan,

              status:
                resolveLoanStatus(
                  loan,
                ),
            }));

        storageApi.saveLoans(
          loans,
        );

        set({
          ready: true,

          session:
            storageApi.session(),

          users:
            storageApi.users(),

          income:
            storageApi.income(),

          expenses:
            storageApi.expenses(),

          bumdesTypes:
            storageApi.bumdesTypes(),

          items:
            storageApi.items(),

          loans,

          savingsLoans:
            storageApi.savingsLoans(),

          savingsLoanPayments:
            storageApi.savingsLoanPayments(),

          settings:
            storageApi.settings(),

          notifications:
            storageApi.notifications(),
        });
      },
    }),
  );