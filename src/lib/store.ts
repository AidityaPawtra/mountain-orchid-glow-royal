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
    payload: Omit<IncomeRecord, "id" | "createdAt">,
  ) => void;

  updateIncome: (
    id: string,
    payload: Omit<IncomeRecord, "id" | "createdAt">,
  ) => void;

  deleteIncome: (id: string) => void;

  // ====================================================
  // PENGELUARAN
  // ====================================================

  addExpense: (
    payload: Omit<ExpenseRecord, "id" | "createdAt">,
  ) => void;

  updateExpense: (
    id: string,
    payload: Omit<ExpenseRecord, "id" | "createdAt">,
  ) => void;

  deleteExpense: (id: string) => void;

  // ====================================================
  // JENIS BUMDes
  // ====================================================

  addBumdesType: (
    payload: Omit<BumdesType, "id" | "createdAt">,
  ) => void;

  updateBumdesType: (
    id: string,
    payload: Omit<BumdesType, "id" | "createdAt">,
  ) => void;

  deleteBumdesType: (id: string) => void;

  // ====================================================
  // BARANG
  // ====================================================

  addItem: (
    payload: Omit<InventoryItem, "id" | "borrowed"> & {
      borrowed?: number;
    },
  ) => void;

  updateItem: (
    id: string,
    payload: Omit<InventoryItem, "id">,
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

  deleteSavingsLoan: (id: string) => void;

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

      settings: defaultSettings,

      notifications: [],

      // ==================================================
      // HYDRATE
      // ==================================================

      hydrate: () => {
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

        const users =
          get().users.length
            ? get().users
            : storageApi.users();

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
            userId: user.id,
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
        const row: IncomeRecord =
          {
            ...payload,

            id: uid("inc"),

            createdAt:
              new Date().toISOString(),
          };

        const income = [
          row,
          ...get().income,
        ];

        persist({
          income,
        });

        set({
          income,
        });
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
        const row: ExpenseRecord =
          {
            ...payload,

            id: uid("exp"),

            createdAt:
              new Date().toISOString(),
          };

        const expenses = [
          row,
          ...get().expenses,
        ];

        persist({
          expenses,
        });

        set({
          expenses,
        });
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
        const bumdesType: BumdesType =
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
        const item: InventoryItem =
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

        const loan: LoanRecord =
          {
            ...payload,

            id: uid("loan"),

            itemName:
              item.name,

            status:
              resolveLoanStatus({
                ...payload,

                id: "tmp",

                itemName:
                  item.name,

                status:
                  "borrowed",

                createdAt: "",
              }),

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
                      resolveLoanStatus({
                        ...row,

                        ...payload,

                        itemName:
                          nextItem.name,
                      }),
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
        const record: SavingsLoanRecord =
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

        const payment: SavingsLoanPayment =
          {
            ...payload,

            id: uid(
              "savings-payment",
            ),

            savingsLoanId,

            createdAt:
              new Date().toISOString(),
          };

        // ================================================
        // HITUNG TOTAL PEMBAYARAN BARU
        // ================================================

        const totalPaid =
          loan.totalPaid +
          payload.amount;

        // ================================================
        // TENTUKAN STATUS PINJAMAN
        // ================================================

        const status:
          SavingsLoanRecord["status"] =
          totalPaid >=
          loan.loanAmount
            ? "paid"
            : "active";

        // ================================================
        // UPDATE DATA PINJAMAN
        // ================================================

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

        // ================================================
        // TAMBAHKAN RIWAYAT PEMBAYARAN
        // ================================================

        const savingsLoanPayments = [
          payment,
          ...get()
            .savingsLoanPayments,
        ];

        // ================================================
        // SIMPAN KE LOCAL STORAGE
        // ================================================

        persist({
          savingsLoans,
          savingsLoanPayments,
        });

        // ================================================
        // UPDATE ZUSTAND STATE
        // ================================================

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
        const users =
          get().users.map(
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