import { MONTH_LABELS, todayISO } from "@/lib/format";
import type {
  ExpenseRecord,
  IncomeRecord,
  InventoryItem,
  LoanRecord,
  LoanStatus,
  UnifiedTransaction,
} from "@/lib/types";

export function totalIncome(income: IncomeRecord[]) {
  return income.reduce((sum, row) => sum + row.amount, 0);
}

export function totalExpense(expenses: ExpenseRecord[]) {
  return expenses.reduce((sum, row) => sum + row.amount, 0);
}

export function computeBalance(income: IncomeRecord[], expenses: ExpenseRecord[]) {
  return totalIncome(income) - totalExpense(expenses);
}

export function resolveLoanStatus(loan: LoanRecord, today = todayISO()): LoanStatus {
  if (loan.status === "returned" || loan.actualReturnDate) return "returned";
  if (loan.returnDate < today) return "overdue";
  return "borrowed";
}

export function withResolvedLoans(loans: LoanRecord[], today = todayISO()): LoanRecord[] {
  return loans.map((loan) => ({ ...loan, status: resolveLoanStatus(loan, today) }));
}

export function loanStats(loans: LoanRecord[]) {
  const resolved = withResolvedLoans(loans);
  return {
    active: resolved.filter((l) => l.status !== "returned").length,
    returned: resolved.filter((l) => l.status === "returned").length,
    overdue: resolved.filter((l) => l.status === "overdue").length,
  };
}

export function itemAvailability(item: InventoryItem) {
  return Math.max(0, item.quantity - item.borrowed);
}

export function itemStats(items: InventoryItem[]) {
  return {
    total: items.length,
    units: items.reduce((sum, item) => sum + item.quantity, 0),
    borrowed: items.reduce((sum, item) => sum + item.borrowed, 0),
    available: items.reduce((sum, item) => sum + itemAvailability(item), 0),
  };
}

export function mergeTransactions(
  income: IncomeRecord[],
  expenses: ExpenseRecord[],
): UnifiedTransaction[] {
  const rows: UnifiedTransaction[] = [
    ...income.map((row) => ({
      id: row.id,
      type: "income" as const,
      date: row.date,
      title: row.source,
      category: row.category,
      amount: row.amount,
      createdAt: row.createdAt,
    })),
    ...expenses.map((row) => ({
      id: row.id,
      type: "expense" as const,
      date: row.date,
      title: row.purpose,
      category: row.category,
      amount: row.amount,
      createdAt: row.createdAt,
    })),
  ];
  return rows.sort((a, b) => {
    if (a.date === b.date) return b.createdAt.localeCompare(a.createdAt);
    return b.date.localeCompare(a.date);
  });
}

export function cashflowByMonth(
  income: IncomeRecord[],
  expenses: ExpenseRecord[],
  year: number,
) {
  return MONTH_LABELS.map((label, index) => {
    const month = String(index + 1).padStart(2, "0");
    const prefix = `${year}-${month}`;
    const masuk = income
      .filter((row) => row.date.startsWith(prefix))
      .reduce((sum, row) => sum + row.amount, 0);
    const keluar = expenses
      .filter((row) => row.date.startsWith(prefix))
      .reduce((sum, row) => sum + row.amount, 0);
    return { month: label, masuk, keluar };
  });
}

export function filterByPeriod<T extends { date: string }>(
  rows: T[],
  period: string,
  today = todayISO(),
) {
  if (period === "all") return rows;
  if (period === "this-month") return rows.filter((row) => row.date.startsWith(today.slice(0, 7)));
  if (period === "last-month") {
    const [y, m] = today.split("-").map(Number);
    const date = new Date(y, m - 2, 1);
    const prefix = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return rows.filter((row) => row.date.startsWith(prefix));
  }
  if (period === "this-year") return rows.filter((row) => row.date.startsWith(today.slice(0, 4)));
  return rows;
}

export function matchesQuery(values: Array<string | number>, query: string) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return values.some((value) => String(value).toLowerCase().includes(q));
}
