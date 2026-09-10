import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as ArrowDownLeft, a as Trash2, l as Plus, u as Pencil } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as todayISO, S as parseAmount, T as INCOME_CATEGORIES, d as matchesQuery, h as totalIncome, r as useAppStore, s as filterByPeriod, v as formatDate, x as formatRupiah } from "./router-s55k0KN_.mjs";
import { t as Button } from "./button-Dj1skY-k.mjs";
import { t as Input } from "./input-D33JxPLf.mjs";
import { t as Field } from "./field-cs3tRSLg.mjs";
import { t as Select } from "./select-hG9fNpwb.mjs";
import { t as PageHeader } from "./page-header-Bg2HBKvP.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Sc37UT1t.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-I40QyAx7.mjs";
import { t as EmptyState } from "./empty-state-CJQSdff9.mjs";
import { n as SearchBar, r as usePagination, t as Pagination } from "./use-pagination-3ZRIvwZQ.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C6VmI1Za.mjs";
import { t as StatCard } from "./stat-card-BICm6nQn.mjs";
import { t as Textarea } from "./textarea-Br6N8YHr.mjs";
import { t as readProofFile } from "./file-DwLCodyO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/uang-masuk-CYVKcEnD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	date: todayISO(),
	source: "",
	category: "Penjualan",
	description: "",
	amount: 0,
	proof: null
};
function IncomeForm({ initial, submitLabel, onSubmit, onCancel }) {
	const [form, setForm] = (0, import_react.useState)(initial ?? EMPTY);
	const [amountText, setAmountText] = (0, import_react.useState)(initial?.amount ? String(initial.amount) : "");
	const [errors, setErrors] = (0, import_react.useState)({});
	function validate(next, rawAmount) {
		const nextErrors = {};
		if (!next.date) nextErrors.date = "Tanggal wajib diisi.";
		if (!next.source.trim()) nextErrors.source = "Sumber dana wajib diisi.";
		if (!next.category) nextErrors.category = "Kategori wajib dipilih.";
		if (!next.description.trim()) nextErrors.description = "Keterangan wajib diisi.";
		const amount = parseAmount(rawAmount);
		if (!rawAmount.trim()) nextErrors.amount = "Jumlah wajib diisi.";
		else if (!Number.isFinite(amount) || amount <= 0) nextErrors.amount = "Jumlah harus berupa angka lebih dari 0.";
		return {
			nextErrors,
			amount
		};
	}
	async function handleProof(file) {
		if (!file) {
			setForm((prev) => ({
				...prev,
				proof: null
			}));
			return;
		}
		const proof = await readProofFile(file);
		setForm((prev) => ({
			...prev,
			proof
		}));
	}
	function handleSubmit(event) {
		event.preventDefault();
		const { nextErrors, amount } = validate(form, amountText);
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;
		onSubmit({
			...form,
			amount,
			source: form.source.trim(),
			description: form.description.trim()
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tanggal",
					htmlFor: "inc-date",
					required: true,
					error: errors.date,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "inc-date",
						type: "date",
						value: form.date,
						onChange: (e) => setForm({
							...form,
							date: e.target.value
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Kategori",
					htmlFor: "inc-cat",
					required: true,
					error: errors.category,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "inc-cat",
						value: form.category,
						onChange: (e) => setForm({
							...form,
							category: e.target.value
						}),
						children: INCOME_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: cat,
							children: cat
						}, cat))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Sumber Dana",
				htmlFor: "inc-source",
				required: true,
				error: errors.source,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "inc-source",
					value: form.source,
					onChange: (e) => setForm({
						...form,
						source: e.target.value
					}),
					placeholder: "Contoh: Unit Usaha"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Jumlah",
				htmlFor: "inc-amount",
				required: true,
				error: errors.amount,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "inc-amount",
					inputMode: "numeric",
					value: amountText,
					onChange: (e) => setAmountText(e.target.value),
					placeholder: "500000"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Keterangan",
				htmlFor: "inc-desc",
				required: true,
				error: errors.description,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "inc-desc",
					value: form.description,
					onChange: (e) => setForm({
						...form,
						description: e.target.value
					}),
					placeholder: "Uraian pemasukan"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
				label: "Bukti Transaksi",
				htmlFor: "inc-proof",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "inc-proof",
					type: "file",
					accept: "image/*,.pdf",
					onChange: (e) => void handleProof(e.target.files?.[0])
				}), form.proof?.name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["Berkas: ", form.proof.name]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: onCancel,
					children: "Batal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: submitLabel
				})]
			})
		]
	});
}
function UangMasukPage() {
	const income = useAppStore((s) => s.income);
	const addIncome = useAppStore((s) => s.addIncome);
	const updateIncome = useAppStore((s) => s.updateIncome);
	const deleteIncome = useAppStore((s) => s.deleteIncome);
	const [query, setQuery] = (0, import_react.useState)("");
	const [period, setPeriod] = (0, import_react.useState)("all");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		return filterByPeriod(income, period).filter((row) => category === "all" || row.category === category).filter((row) => matchesQuery([
			row.source,
			row.category,
			row.description,
			formatRupiah(row.amount)
		], query)).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
	}, [
		income,
		period,
		category,
		query
	]);
	const pager = usePagination(filtered);
	function handleCreate(value) {
		addIncome(value);
		setOpen(false);
		toast.success("Uang masuk berhasil disimpan.");
	}
	function handleUpdate(value) {
		if (!editing) return;
		updateIncome(editing.id, value);
		setEditing(null);
		toast.success("Data pemasukan diperbarui.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Uang Masuk",
				description: "Kelola seluruh data pemasukan BUMDes.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Tambah Uang Masuk"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Total Pemasukan",
				value: formatRupiah(totalIncome(filtered)),
				hint: query || period !== "all" || category !== "all" ? "Mengikuti filter aktif" : "Seluruh data",
				icon: ArrowDownLeft
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-[1fr_180px_180px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBar, {
						value: query,
						onChange: (v) => {
							setQuery(v);
							pager.setPage(1);
						},
						placeholder: "Cari sumber, kategori, atau keterangan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: period,
						onChange: (e) => {
							setPeriod(e.target.value);
							pager.setPage(1);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Semua periode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "this-month",
								children: "Bulan ini"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "last-month",
								children: "Bulan lalu"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "this-year",
								children: "Tahun ini"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: category,
						onChange: (e) => {
							setCategory(e.target.value);
							pager.setPage(1);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Semua kategori"
						}), INCOME_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: cat,
							children: cat
						}, cat))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-card)]",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "Tidak ada data pemasukan",
						description: "Tambah transaksi uang masuk atau ubah filter pencarian.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setOpen(true),
							children: "Tambah Uang Masuk"
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-14",
						children: "No"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tanggal" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Sumber Dana" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Kategori" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Keterangan" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Jumlah"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Aksi"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: pager.slice.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "tabular-nums text-muted-foreground",
						children: (pager.page - 1) * pager.pageSize + index + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(row.date) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: row.source
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: row.category }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "max-w-[240px] truncate",
						children: row.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right font-semibold tabular-nums",
						children: formatRupiah(row.amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => setEditing(row),
							"aria-label": "Edit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => setDeleting(row),
							"aria-label": "Hapus",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-danger" })
						})]
					})
				] }, row.id)) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Tambah Uang Masuk" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Catat pemasukan baru ke kas BUMDes." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IncomeForm, {
					submitLabel: "Simpan",
					onSubmit: handleCreate,
					onCancel: () => setOpen(false)
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(editing),
				onOpenChange: (v) => !v && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Uang Masuk" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Perbarui data pemasukan yang dipilih." })] }), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IncomeForm, {
					initial: editing,
					submitLabel: "Simpan Perubahan",
					onSubmit: handleUpdate,
					onCancel: () => setEditing(null)
				}) : null] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: Boolean(deleting),
				onOpenChange: (v) => !v && setDeleting(null),
				title: "Hapus pemasukan?",
				description: "Data yang dihapus akan mengubah saldo BUMDes secara otomatis.",
				onConfirm: () => {
					if (deleting) {
						deleteIncome(deleting.id);
						toast.success("Data pemasukan dihapus.");
					}
					setDeleting(null);
				}
			})
		]
	});
}
//#endregion
export { UangMasukPage as component };
