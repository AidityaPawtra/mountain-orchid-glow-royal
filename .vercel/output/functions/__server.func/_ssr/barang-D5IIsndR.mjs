import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as Trash2, l as Plus, u as Pencil } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as ITEM_CONDITIONS, E as ITEM_CATEGORIES, c as itemAvailability, d as matchesQuery, r as useAppStore } from "./router-s55k0KN_.mjs";
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
//#region node_modules/.nitro/vite/services/ssr/assets/barang-D5IIsndR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ItemForm({ initial, submitLabel, onSubmit, onCancel }) {
	const [form, setForm] = (0, import_react.useState)(initial ?? {
		name: "",
		category: "Perlengkapan",
		quantity: 1,
		borrowed: 0,
		condition: "Baik"
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	function handleSubmit(event) {
		event.preventDefault();
		const nextErrors = {};
		if (!form.name.trim()) nextErrors.name = "Nama barang wajib diisi.";
		if (!form.category) nextErrors.category = "Kategori wajib dipilih.";
		if (!Number.isFinite(form.quantity) || form.quantity <= 0) nextErrors.quantity = "Jumlah harus lebih dari 0.";
		if (form.quantity < form.borrowed) nextErrors.quantity = `Jumlah tidak boleh lebih kecil dari yang sedang dipinjam (${form.borrowed}).`;
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;
		onSubmit({
			...form,
			name: form.name.trim()
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nama Barang",
				htmlFor: "item-name",
				required: true,
				error: errors.name,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "item-name",
					value: form.name,
					onChange: (e) => setForm({
						...form,
						name: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Kategori",
					htmlFor: "item-cat",
					required: true,
					error: errors.category,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "item-cat",
						value: form.category,
						onChange: (e) => setForm({
							...form,
							category: e.target.value
						}),
						children: ITEM_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: cat,
							children: cat
						}, cat))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Kondisi",
					htmlFor: "item-cond",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "item-cond",
						value: form.condition,
						onChange: (e) => setForm({
							...form,
							condition: e.target.value
						}),
						children: ITEM_CONDITIONS.map((cond) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: cond,
							children: cond
						}, cond))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Jumlah Total",
				htmlFor: "item-qty",
				required: true,
				error: errors.quantity,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "item-qty",
					type: "number",
					min: 1,
					value: form.quantity,
					onChange: (e) => setForm({
						...form,
						quantity: Number(e.target.value)
					})
				})
			}),
			initial ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Sedang dipinjam: ",
					form.borrowed,
					" unit"
				]
			}) : null,
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
function BarangPage() {
	const items = useAppStore((s) => s.items);
	const addItem = useAppStore((s) => s.addItem);
	const updateItem = useAppStore((s) => s.updateItem);
	const deleteItem = useAppStore((s) => s.deleteItem);
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		return items.filter((row) => category === "all" || row.category === category).filter((row) => matchesQuery([
			row.name,
			row.category,
			row.condition
		], query));
	}, [
		items,
		category,
		query
	]);
	const pager = usePagination(filtered);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Data Barang",
				description: "Kelola inventaris barang yang dapat dipinjam warga desa.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Tambah Barang"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-[1fr_200px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBar, {
					value: query,
					onChange: (v) => {
						setQuery(v);
						pager.setPage(1);
					},
					placeholder: "Cari nama atau kategori barang"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: category,
					onChange: (e) => {
						setCategory(e.target.value);
						pager.setPage(1);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "Semua kategori"
					}), ITEM_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: cat,
						children: cat
					}, cat))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-card)]",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "Belum ada data barang",
						description: "Tambahkan inventaris agar peminjaman dapat dicatat.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setOpen(true),
							children: "Tambah Barang"
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-14",
						children: "No"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nama Barang" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Kategori" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Jumlah" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tersedia" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Dipinjam" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Kondisi" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Aksi"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: pager.slice.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "tabular-nums text-muted-foreground",
						children: (pager.page - 1) * pager.pageSize + index + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: row.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: row.category }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "tabular-nums",
						children: row.quantity
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "tabular-nums",
						children: itemAvailability(row)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "tabular-nums",
						children: row.borrowed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: row.condition }),
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
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Tambah Barang" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Masukkan data inventaris baru." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemForm, {
					submitLabel: "Simpan",
					onCancel: () => setOpen(false),
					onSubmit: (value) => {
						addItem(value);
						setOpen(false);
						toast.success("Barang berhasil ditambahkan.");
					}
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(editing),
				onOpenChange: (v) => !v && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Barang" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Perbarui data inventaris." })] }), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemForm, {
					initial: editing,
					submitLabel: "Simpan Perubahan",
					onCancel: () => setEditing(null),
					onSubmit: (value) => {
						updateItem(editing.id, value);
						setEditing(null);
						toast.success("Data barang diperbarui.");
					}
				}) : null] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: Boolean(deleting),
				onOpenChange: (v) => !v && setDeleting(null),
				title: "Hapus barang?",
				description: "Barang yang masih dipinjam tidak dapat dihapus.",
				onConfirm: () => {
					if (!deleting) return;
					const result = deleteItem(deleting.id);
					if (!result.ok) toast.error(result.message);
					else toast.success("Barang dihapus.");
					setDeleting(null);
				}
			})
		]
	});
}
//#endregion
export { BarangPage as component };
