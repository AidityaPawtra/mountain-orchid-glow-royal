import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { E as Boxes, d as Package, f as PackageCheck, i as TriangleAlert, l as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as matchesQuery, g as withResolvedLoans, l as itemStats, r as useAppStore, u as loanStats, v as formatDate } from "./router-s55k0KN_.mjs";
import { t as Button } from "./button-Dj1skY-k.mjs";
import { t as Select } from "./select-hG9fNpwb.mjs";
import { t as PageHeader } from "./page-header-Bg2HBKvP.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-I40QyAx7.mjs";
import { t as EmptyState } from "./empty-state-CJQSdff9.mjs";
import { n as SearchBar, r as usePagination, t as Pagination } from "./use-pagination-3ZRIvwZQ.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C6VmI1Za.mjs";
import { t as StatCard } from "./stat-card-BICm6nQn.mjs";
import { n as LoanStatusBadge, t as LoanForm } from "./status-badge-o2VXfzZ9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/peminjaman-CNQE_upo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PeminjamanPage() {
	const navigate = useNavigate();
	const loans = useAppStore((s) => s.loans);
	const items = useAppStore((s) => s.items);
	const addLoan = useAppStore((s) => s.addLoan);
	const [query, setQuery] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const resolved = withResolvedLoans(loans);
	const stats = loanStats(resolved);
	const inventory = itemStats(items);
	const filtered = (0, import_react.useMemo)(() => {
		return resolved.filter((row) => status === "all" || row.status === status).filter((row) => matchesQuery([
			row.borrowerName,
			row.itemName,
			row.purpose,
			row.phone
		], query)).sort((a, b) => b.borrowDate.localeCompare(a.borrowDate) || b.createdAt.localeCompare(a.createdAt));
	}, [
		resolved,
		status,
		query
	]);
	const pager = usePagination(filtered);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Peminjaman Barang",
				description: "Kelola seluruh data peminjaman barang BUMDes.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Tambah Peminjaman"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Barang",
						value: String(inventory.total),
						hint: `${inventory.units} unit`,
						icon: Boxes
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Barang sedang dipinjam",
						value: String(inventory.borrowed),
						icon: Package,
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Barang tersedia",
						value: String(inventory.available),
						icon: PackageCheck,
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Peminjaman terlambat",
						value: String(stats.overdue),
						icon: TriangleAlert,
						tone: "danger"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-[1fr_200px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBar, {
					value: query,
					onChange: (v) => {
						setQuery(v);
						pager.setPage(1);
					},
					placeholder: "Cari peminjam, barang, atau keperluan"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: status,
					onChange: (e) => {
						setStatus(e.target.value);
						pager.setPage(1);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Semua status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "borrowed",
							children: "Dipinjam"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "returned",
							children: "Dikembalikan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "overdue",
							children: "Terlambat"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-card)]",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "Tidak ada data peminjaman",
						description: "Buat peminjaman baru untuk warga atau lembaga desa.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setOpen(true),
							children: "Tambah Peminjaman"
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-14",
						children: "No"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nama Peminjam" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Barang" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Jumlah" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal Pinjam" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Rencana Kembali" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Aksi"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: pager.slice.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "cursor-pointer",
					onClick: () => void navigate({
						to: "/peminjaman/$id",
						params: { id: row.id }
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "tabular-nums text-muted-foreground",
							children: (pager.page - 1) * pager.pageSize + index + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: row.borrowerName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: row.itemName }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "tabular-nums",
							children: row.quantity
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(row.borrowDate) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(row.returnDate) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanStatusBadge, { status: row.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: (event) => {
									event.stopPropagation();
									navigate({
										to: "/peminjaman/$id",
										params: { id: row.id }
									});
								},
								children: "Detail"
							})
						})
					]
				}, row.id)) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border px-4 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pagination, {
						page: pager.page,
						pageCount: pager.pageCount,
						onPageChange: pager.setPage,
						total: pager.total,
						pageSize: pager.pageSize
					})
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Tambah Peminjaman" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Stok barang akan berkurang otomatis setelah disimpan." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanForm, {
						items,
						submitLabel: "Simpan",
						onCancel: () => setOpen(false),
						onSubmit: (value) => {
							const result = addLoan(value);
							if (!result.ok) return result;
							setOpen(false);
							toast.success("Peminjaman berhasil dicatat.");
							return { ok: true };
						}
					})]
				})
			})
		]
	});
}
//#endregion
export { PeminjamanPage as component };
