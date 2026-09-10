import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as Trash2, k as ArrowLeft, u as Pencil } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route, p as resolveLoanStatus, r as useAppStore, v as formatDate } from "./router-s55k0KN_.mjs";
import { t as Button } from "./button-Dj1skY-k.mjs";
import { t as PageHeader } from "./page-header-Bg2HBKvP.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Sc37UT1t.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-I40QyAx7.mjs";
import { t as Card } from "./card-BzJc9zJP.mjs";
import { n as LoanStatusBadge, t as LoanForm } from "./status-badge-o2VXfzZ9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/peminjaman._id-CO-yt1xg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoanDetailPage() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const loan = useAppStore((s) => s.loans.find((row) => row.id === id));
	const items = useAppStore((s) => s.items);
	const returnLoan = useAppStore((s) => s.returnLoan);
	const updateLoan = useAppStore((s) => s.updateLoan);
	const deleteLoan = useAppStore((s) => s.deleteLoan);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	if (!loan) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/peminjaman",
			className: "inline-flex items-center gap-2 text-sm text-primary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Kembali"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-8 text-center text-sm text-muted-foreground",
			children: "Data peminjaman tidak ditemukan."
		})]
	});
	const status = resolveLoanStatus(loan);
	const canReturn = status !== "returned";
	function handleReturn() {
		const result = returnLoan(loan.id);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		toast.success("Barang ditandai sudah dikembalikan. Stok bertambah otomatis.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Detail Peminjaman",
				description: "Informasi lengkap peminjaman barang BUMDes.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => void navigate({ to: "/peminjaman" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Kembali"]
						}),
						canReturn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => setEditing(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Edit"]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "destructive",
							onClick: () => setDeleting(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Hapus"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: loan.borrowerName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanStatusBadge, { status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Nama Peminjam",
								value: loan.borrowerName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "No. HP",
								value: loan.phone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Barang",
								value: loan.itemName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Jumlah",
								value: String(loan.quantity)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Tanggal Pinjam",
								value: formatDate(loan.borrowDate)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Rencana Kembali",
								value: formatDate(loan.returnDate)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Keperluan",
								value: loan.purpose
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Catatan",
								value: loan.notes || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Status",
								value: status === "borrowed" ? "Dipinjam" : status === "overdue" ? "Terlambat" : "Dikembalikan"
							}),
							loan.actualReturnDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Tanggal Dikembalikan",
								value: formatDate(loan.actualReturnDate)
							}) : null
						]
					}),
					canReturn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 border-t border-border pt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleReturn,
							children: "Tandai Sudah Dikembalikan"
						})
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editing,
				onOpenChange: setEditing,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Peminjaman" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Perubahan jumlah akan menyesuaikan stok barang." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanForm, {
						items,
						initial: loan,
						submitLabel: "Simpan Perubahan",
						onCancel: () => setEditing(false),
						onSubmit: (value) => {
							const result = updateLoan(loan.id, value);
							if (!result.ok) return result;
							setEditing(false);
							toast.success("Data peminjaman diperbarui.");
							return { ok: true };
						}
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: deleting,
				onOpenChange: setDeleting,
				title: "Hapus peminjaman?",
				description: "Jika barang masih dipinjam, stok akan dikembalikan ke inventaris.",
				onConfirm: () => {
					deleteLoan(loan.id);
					toast.success("Data peminjaman dihapus.");
					navigate({ to: "/peminjaman" });
				}
			})
		]
	});
}
function Info({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 text-sm font-medium text-foreground",
		children: value
	})] });
}
//#endregion
export { LoanDetailPage as component };
