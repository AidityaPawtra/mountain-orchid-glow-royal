import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as ArrowDownLeft, O as ArrowUpRight, d as Package, n as Wallet } from "../_libs/lucide-react.mjs";
import { a as cashflowByMonth, b as formatNumber, f as mergeTransactions, h as totalIncome, m as totalExpense, o as computeBalance, r as useAppStore, u as loanStats, v as formatDate, x as formatRupiah } from "./router-s55k0KN_.mjs";
import { t as PageHeader } from "./page-header-Bg2HBKvP.mjs";
import { t as EmptyState } from "./empty-state-CJQSdff9.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BzJc9zJP.mjs";
import { t as StatCard } from "./stat-card-BICm6nQn.mjs";
import { a as Bar, c as Legend, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as ComposedChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CgwGSv0m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DashboardPage() {
	const session = useAppStore((s) => s.session);
	const income = useAppStore((s) => s.income);
	const expenses = useAppStore((s) => s.expenses);
	const loans = useAppStore((s) => s.loans);
	const masuk = totalIncome(income);
	const keluar = totalExpense(expenses);
	const saldo = computeBalance(income, expenses);
	const stats = loanStats(loans);
	const chartData = (0, import_react.useMemo)(() => cashflowByMonth(income, expenses, 2026), [income, expenses]);
	const recent = mergeTransactions(income, expenses).slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Dashboard",
				description: `Selamat datang, ${session?.name || "Admin"}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Uang Masuk",
						value: formatRupiah(masuk),
						icon: ArrowDownLeft,
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Uang Keluar",
						value: formatRupiah(keluar),
						icon: ArrowUpRight,
						tone: "danger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Saldo BUMDes",
						value: formatRupiah(saldo),
						icon: Wallet,
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Peminjaman Aktif",
						value: formatNumber(stats.active),
						icon: Package,
						tone: "warning"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "p-5 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Grafik Arus Kas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Perbandingan uang masuk dan keluar per bulan (2026)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-80 p-5 pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
								data: chartData,
								barGap: 4,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--color-border)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "month",
										tick: {
											fontSize: 12,
											fill: "var(--color-muted-foreground)"
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tickFormatter: (value) => `${Math.round(Number(value) / 1e3)}k`,
										tick: {
											fontSize: 12,
											fill: "var(--color-muted-foreground)"
										},
										axisLine: false,
										tickLine: false,
										width: 48
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (value) => formatRupiah(Number(value ?? 0)),
										contentStyle: {
											borderRadius: 12,
											borderColor: "var(--color-border)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "masuk",
										name: "Uang Masuk",
										fill: "var(--color-primary)",
										radius: [
											6,
											6,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "keluar",
										name: "Uang Keluar",
										fill: "var(--color-danger)",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: "Peminjaman Barang"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Ringkasan status inventaris yang sedang beredar."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanStatRow, {
									label: "Aktif",
									value: stats.active,
									tone: "bg-warning-soft text-warning"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanStatRow, {
									label: "Selesai",
									value: stats.returned,
									tone: "bg-success-soft text-success"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanStatRow, {
									label: "Terlambat",
									value: stats.overdue,
									tone: "bg-danger-soft text-danger"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/peminjaman",
							className: "mt-6 inline-flex text-sm font-medium text-primary hover:underline",
							children: "Lihat semua peminjaman"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "p-5 pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Transaksi Terbaru" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 pb-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							title: "Belum ada transaksi",
							description: "Catat uang masuk atau keluar untuk melihat ringkasan di sini."
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: recent.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-4 px-5 py-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: row.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										formatDate(row.date),
										" · ",
										row.category
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: row.type === "income" ? "shrink-0 text-sm font-semibold tabular-nums text-success" : "shrink-0 text-sm font-semibold tabular-nums text-danger",
								children: [row.type === "income" ? "+" : "−", formatRupiah(row.amount)]
							})]
						}, `${row.type}-${row.id}`))
					})
				})]
			})
		]
	});
}
function LoanStatRow({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `rounded-full px-2.5 py-0.5 text-sm font-semibold tabular-nums ${tone}`,
			children: formatNumber(value)
		})]
	});
}
//#endregion
export { DashboardPage as component };
