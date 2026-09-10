import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as ArrowDownLeft, O as ArrowUpRight, S as Download, c as Printer, n as Wallet, y as FileSpreadsheet } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as MONTH_LABELS, h as totalIncome, i as cn, m as totalExpense, o as computeBalance, r as useAppStore, v as formatDate, x as formatRupiah } from "./router-s55k0KN_.mjs";
import { t as Button } from "./button-Dj1skY-k.mjs";
import { t as Select } from "./select-hG9fNpwb.mjs";
import { t as PageHeader } from "./page-header-Bg2HBKvP.mjs";
import { t as EmptyState } from "./empty-state-CJQSdff9.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C6VmI1Za.mjs";
import { t as Card } from "./card-BzJc9zJP.mjs";
import { t as StatCard } from "./stat-card-BICm6nQn.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/laporan-BnbILnNm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-11 items-center rounded-xl bg-muted p-1 text-muted-foreground", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex items-center justify-center rounded-lg px-4 py-1.5 text-sm font-medium transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-4 outline-none", className),
		...props
	});
}
function downloadBlob(filename, content, mime) {
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
function csvEscape(value) {
	const text = String(value);
	if (/[",\n]/.test(text)) return `"${text.replace(/"/g, "\"\"")}"`;
	return text;
}
function exportTransactionsCsv(income, expenses, filename = "laporan-keuangan-bumdes.csv") {
	downloadBlob(filename, `\uFEFF${[[
		"Jenis",
		"Tanggal",
		"Kategori",
		"Uraian",
		"Jumlah"
	], ...[...income.map((row) => [
		"Pemasukan",
		formatDate(row.date),
		row.category,
		`${row.source} — ${row.description}`,
		row.amount
	]), ...expenses.map((row) => [
		"Pengeluaran",
		formatDate(row.date),
		row.category,
		`${row.purpose} — ${row.description}`,
		row.amount
	])]].map((line) => line.map(csvEscape).join(",")).join("\n")}`, "text/csv;charset=utf-8;");
}
function printReport(title, html) {
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
function reportHtml(params) {
	const incomeRows = params.income.map((row) => `<tr><td>Pemasukan</td><td>${formatDate(row.date)}</td><td>${row.category}</td><td>${row.source} — ${row.description}</td><td class="right">${formatRupiah(row.amount)}</td></tr>`).join("");
	const expenseRows = params.expenses.map((row) => `<tr><td>Pengeluaran</td><td>${formatDate(row.date)}</td><td>${row.category}</td><td>${row.purpose} — ${row.description}</td><td class="right">${formatRupiah(row.amount)}</td></tr>`).join("");
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
function LaporanPage() {
	const income = useAppStore((s) => s.income);
	const expenses = useAppStore((s) => s.expenses);
	const settings = useAppStore((s) => s.settings);
	const [year, setYear] = (0, import_react.useState)("2026");
	const [month, setMonth] = (0, import_react.useState)("all");
	const [kind, setKind] = (0, import_react.useState)("all");
	const filteredIncome = (0, import_react.useMemo)(() => {
		return income.filter((row) => {
			if (!row.date.startsWith(year)) return false;
			if (month !== "all" && !row.date.startsWith(`${year}-${month}`)) return false;
			return true;
		});
	}, [
		income,
		year,
		month
	]);
	const filteredExpenses = (0, import_react.useMemo)(() => {
		return expenses.filter((row) => {
			if (!row.date.startsWith(year)) return false;
			if (month !== "all" && !row.date.startsWith(`${year}-${month}`)) return false;
			return true;
		});
	}, [
		expenses,
		year,
		month
	]);
	const showIncome = kind !== "expense";
	const showExpense = kind !== "income";
	const masuk = totalIncome(filteredIncome);
	const keluar = totalExpense(filteredExpenses);
	const saldo = computeBalance(filteredIncome, filteredExpenses);
	const periodLabel = month === "all" ? `Tahun ${year}` : `${MONTH_LABELS[Number(month) - 1]} ${year}`;
	function handleExcel() {
		exportTransactionsCsv(showIncome ? filteredIncome : [], showExpense ? filteredExpenses : [], `laporan-bumdes-${year}${month !== "all" ? `-${month}` : ""}.csv`);
		toast.success("Berkas Excel (CSV) diunduh.");
	}
	function handlePdf() {
		if (!printReport("Laporan Keuangan BUMDes", reportHtml({
			title: `Laporan Keuangan ${settings.bumdesName}`,
			periodLabel,
			masuk,
			keluar,
			saldo,
			income: showIncome ? filteredIncome : [],
			expenses: showExpense ? filteredExpenses : []
		}))) {
			toast.error("Popup diblokir. Izinkan jendela baru untuk mencetak PDF.");
			return;
		}
		toast.success("Siapkan cetak / simpan sebagai PDF.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Laporan Keuangan",
				description: "Ringkasan pemasukan, pengeluaran, dan saldo berdasarkan periode.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: handlePdf,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Export PDF"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: handleExcel,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4" }), "Export Excel"]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: month,
						onChange: (e) => setMonth(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Semua bulan"
						}), MONTH_LABELS.map((label, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: String(index + 1).padStart(2, "0"),
							children: label
						}, label))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: year,
						onChange: (e) => setYear(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "2026",
							children: "2026"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "2025",
							children: "2025"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: kind,
						onChange: (e) => setKind(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Semua transaksi"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "income",
								children: "Pemasukan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "expense",
								children: "Pengeluaran"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Uang Masuk",
						value: formatRupiah(masuk),
						icon: ArrowDownLeft
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Uang Keluar",
						value: formatRupiah(keluar),
						icon: ArrowUpRight,
						tone: "danger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Saldo",
						value: formatRupiah(saldo),
						icon: Wallet,
						tone: "success"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "pemasukan",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "pemasukan",
							children: "Pemasukan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "pengeluaran",
							children: "Pengeluaran"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "pemasukan",
							children: filteredIncome.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "Tidak ada pemasukan",
								description: `Tidak ada data untuk ${periodLabel}.`
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Sumber Dana" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Kategori" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Keterangan" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Jumlah"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredIncome.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(row.date) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-medium",
									children: row.source
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: row.category }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: row.description }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right tabular-nums",
									children: formatRupiah(row.amount)
								})
							] }, row.id)) })] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "pengeluaran",
							children: filteredExpenses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								title: "Tidak ada pengeluaran",
								description: `Tidak ada data untuk ${periodLabel}.`
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Kategori" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Keperluan" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Keterangan" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Jumlah"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredExpenses.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(row.date) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: row.category }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-medium",
									children: row.purpose
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: row.description }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right tabular-nums",
									children: formatRupiah(row.amount)
								})
							] }, row.id)) })] })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Export Excel mengunduh CSV yang dapat dibuka di Microsoft Excel. Export PDF membuka pratinjau cetak."]
			})
		]
	});
}
//#endregion
export { LaporanPage as component };
