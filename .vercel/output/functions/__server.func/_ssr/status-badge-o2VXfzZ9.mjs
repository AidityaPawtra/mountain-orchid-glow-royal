import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { C as todayISO, c as itemAvailability, i as cn } from "./router-s55k0KN_.mjs";
import { t as Button } from "./button-Dj1skY-k.mjs";
import { t as Input } from "./input-D33JxPLf.mjs";
import { t as Field } from "./field-cs3tRSLg.mjs";
import { t as Select } from "./select-hG9fNpwb.mjs";
import { t as Textarea } from "./textarea-Br6N8YHr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-o2VXfzZ9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoanForm({ items, initial, submitLabel, onSubmit, onCancel }) {
	const [form, setForm] = (0, import_react.useState)({
		borrowerName: initial?.borrowerName ?? "",
		phone: initial?.phone ?? "",
		itemId: initial?.itemId ?? items[0]?.id ?? "",
		quantity: initial?.quantity ?? 1,
		borrowDate: initial?.borrowDate ?? todayISO(),
		returnDate: initial?.returnDate ?? todayISO(),
		purpose: initial?.purpose ?? "",
		notes: initial?.notes ?? ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [formError, setFormError] = (0, import_react.useState)("");
	const selected = items.find((item) => item.id === form.itemId);
	const available = (0, import_react.useMemo)(() => {
		if (!selected) return 0;
		const restored = initial?.itemId === selected.id ? initial.quantity ?? 0 : 0;
		return itemAvailability(selected) + restored;
	}, [selected, initial]);
	function handleSubmit(event) {
		event.preventDefault();
		const nextErrors = {};
		if (!form.borrowerName.trim()) nextErrors.borrowerName = "Nama peminjam wajib diisi.";
		if (!form.phone.trim()) nextErrors.phone = "Nomor HP wajib diisi.";
		if (!form.itemId) nextErrors.itemId = "Barang wajib dipilih.";
		if (!form.purpose.trim()) nextErrors.purpose = "Keperluan wajib diisi.";
		if (!form.borrowDate) nextErrors.borrowDate = "Tanggal pinjam wajib diisi.";
		if (!form.returnDate) nextErrors.returnDate = "Rencana kembali wajib diisi.";
		if (form.returnDate && form.borrowDate && form.returnDate < form.borrowDate) nextErrors.returnDate = "Tanggal kembali tidak boleh lebih awal dari tanggal pinjam.";
		if (!Number.isFinite(form.quantity) || form.quantity <= 0) nextErrors.quantity = "Jumlah harus lebih dari 0.";
		else if (form.quantity > available) nextErrors.quantity = `Jumlah tidak boleh melebihi stok tersedia (${available}).`;
		setErrors(nextErrors);
		setFormError("");
		if (Object.keys(nextErrors).length) return;
		const result = onSubmit({
			...form,
			borrowerName: form.borrowerName.trim(),
			phone: form.phone.trim(),
			purpose: form.purpose.trim(),
			notes: form.notes.trim()
		});
		if (!result.ok) setFormError(result.message);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "grid gap-4",
		children: [
			formError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger",
				children: formError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Nama Peminjam",
					htmlFor: "loan-name",
					required: true,
					error: errors.borrowerName,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "loan-name",
						value: form.borrowerName,
						onChange: (e) => setForm({
							...form,
							borrowerName: e.target.value
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "No. HP",
					htmlFor: "loan-phone",
					required: true,
					error: errors.phone,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "loan-phone",
						value: form.phone,
						onChange: (e) => setForm({
							...form,
							phone: e.target.value
						}),
						placeholder: "08xxxxxxxxxx"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Barang",
					htmlFor: "loan-item",
					required: true,
					error: errors.itemId,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						id: "loan-item",
						value: form.itemId,
						onChange: (e) => setForm({
							...form,
							itemId: e.target.value,
							quantity: 1
						}),
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.id,
							children: item.name
						}, item.id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
					label: "Jumlah",
					htmlFor: "loan-qty",
					required: true,
					error: errors.quantity,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "loan-qty",
						type: "number",
						min: 1,
						max: available,
						value: form.quantity,
						onChange: (e) => setForm({
							...form,
							quantity: Number(e.target.value)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: ["Stok tersedia: ", available]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tanggal Pinjam",
					htmlFor: "loan-from",
					required: true,
					error: errors.borrowDate,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "loan-from",
						type: "date",
						value: form.borrowDate,
						onChange: (e) => setForm({
							...form,
							borrowDate: e.target.value
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Rencana Kembali",
					htmlFor: "loan-to",
					required: true,
					error: errors.returnDate,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "loan-to",
						type: "date",
						value: form.returnDate,
						onChange: (e) => setForm({
							...form,
							returnDate: e.target.value
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Keperluan",
				htmlFor: "loan-purpose",
				required: true,
				error: errors.purpose,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "loan-purpose",
					value: form.purpose,
					onChange: (e) => setForm({
						...form,
						purpose: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Catatan",
				htmlFor: "loan-notes",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "loan-notes",
					value: form.notes,
					onChange: (e) => setForm({
						...form,
						notes: e.target.value
					})
				})
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
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "bg-primary-soft text-primary",
		navy: "bg-navy/10 text-navy",
		success: "bg-success-soft text-success",
		warning: "bg-warning-soft text-warning",
		danger: "bg-danger-soft text-danger",
		muted: "bg-muted text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var LABEL = {
	borrowed: "Dipinjam",
	returned: "Dikembalikan",
	overdue: "Terlambat"
};
var VARIANT = {
	borrowed: "warning",
	returned: "success",
	overdue: "danger"
};
function LoanStatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: VARIANT[status],
		children: LABEL[status]
	});
}
//#endregion
export { LoanStatusBadge as n, LoanForm as t };
