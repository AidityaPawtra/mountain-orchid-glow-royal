import { formatDate, formatRupiah } from "@/lib/format";
import type { ExpenseRecord, IncomeRecord } from "@/lib/types";

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value: string | number) {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function exportTransactionsCsv(
  income: IncomeRecord[],
  expenses: ExpenseRecord[],
  filename = "laporan-keuangan-bumdes.csv",
) {
  const header = ["Jenis", "Tanggal", "Kategori", "Uraian", "Jumlah"];
  const rows = [
    ...income.map((row) => [
      "Pemasukan",
      formatDate(row.date),
      row.category,
      `${row.source} — ${row.description}`,
      row.amount,
    ]),
    ...expenses.map((row) => [
      "Pengeluaran",
      formatDate(row.date),
      row.category,
      `${row.purpose} — ${row.description}`,
      row.amount,
    ]),
  ];
  const csv = [header, ...rows]
    .map((line) => line.map(csvEscape).join(","))
    .join("\n");
  downloadBlob(filename, `\uFEFF${csv}`, "text/csv;charset=utf-8;");
}

export function printReport(title: string, html: string) {
  const popup = window.open("", "_blank", "width=900,height=700");
  if (!popup) return false;
  popup.document.write(`<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <style>
      body { font-family: "Plus Jakarta Sans", Arial, sans-serif; color: #0f172a; padding: 32px; }
      h1 { font-size: 20px; margin: 0 0 8px; }
      p { color: #64748b; margin: 0 0 20px; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
      th { background: #f5f8fc; }
      .right { text-align: right; }
      .summary { display: flex; gap: 16px; margin-bottom: 20px; }
      .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; flex: 1; }
    </style>
  </head>
  <body>${html}</body>
</html>`);
  popup.document.close();
  popup.focus();
  popup.print();
  return true;
}

export function reportHtml(params: {
  title: string;
  periodLabel: string;
  masuk: number;
  keluar: number;
  saldo: number;
  income: IncomeRecord[];
  expenses: ExpenseRecord[];
}) {
  const incomeRows = params.income
    .map(
      (row) =>
        `<tr><td>Pemasukan</td><td>${formatDate(row.date)}</td><td>${row.category}</td><td>${row.source} — ${row.description}</td><td class="right">${formatRupiah(row.amount)}</td></tr>`,
    )
    .join("");
  const expenseRows = params.expenses
    .map(
      (row) =>
        `<tr><td>Pengeluaran</td><td>${formatDate(row.date)}</td><td>${row.category}</td><td>${row.purpose} — ${row.description}</td><td class="right">${formatRupiah(row.amount)}</td></tr>`,
    )
    .join("");
  return `
    <h1>${params.title}</h1>
    <p>${params.periodLabel}</p>
    <div class="summary">
      <div class="card">Uang Masuk<br><strong>${formatRupiah(params.masuk)}</strong></div>
      <div class="card">Uang Keluar<br><strong>${formatRupiah(params.keluar)}</strong></div>
      <div class="card">Saldo<br><strong>${formatRupiah(params.saldo)}</strong></div>
    </div>
    <table>
      <thead><tr><th>Jenis</th><th>Tanggal</th><th>Kategori</th><th>Uraian</th><th>Jumlah</th></tr></thead>
      <tbody>${incomeRows}${expenseRows}</tbody>
    </table>
  `;
}
