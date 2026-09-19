import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useAppStore } from "./router-s55k0KN_.mjs";
import { t as Button } from "./button-Dj1skY-k.mjs";
import { t as Input } from "./input-D33JxPLf.mjs";
import { t as Field } from "./field-cs3tRSLg.mjs";
import { t as PageHeader } from "./page-header-Bg2HBKvP.mjs";
import { t as ConfirmDialog } from "./confirm-dialog-Sc37UT1t.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-BzJc9zJP.mjs";
import { t as Textarea } from "./textarea-Br6N8YHr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profil-lrDsSHtr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const settings = useAppStore((s) => s.settings);
	const saveSettings = useAppStore((s) => s.saveSettings);
	const restoreDemo = useAppStore((s) => s.restoreDemo);
	const [form, setForm] = (0, import_react.useState)(settings);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [resetOpen, setResetOpen] = (0, import_react.useState)(false);
	function handleSubmit(event) {
		event.preventDefault();
		const nextErrors = {};
		if (!form.bumdesName.trim()) nextErrors.bumdesName = "Nama BUMDes wajib diisi.";
		if (!form.villageName.trim()) nextErrors.villageName = "Nama desa wajib diisi.";
		if (!form.adminName.trim()) nextErrors.adminName = "Nama admin wajib diisi.";
		if (!form.adminUsername.trim()) nextErrors.adminUsername = "Username wajib diisi.";
		if (!form.adminEmail.trim()) nextErrors.adminEmail = "Email admin wajib diisi.";
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;
		saveSettings({
			...form,
			bumdesName: form.bumdesName.trim(),
			villageName: form.villageName.trim(),
			address: form.address.trim(),
			phone: form.phone.trim(),
			email: form.email.trim(),
			adminName: form.adminName.trim(),
			adminUsername: form.adminUsername.trim(),
			adminEmail: form.adminEmail.trim()
		});
		toast.success("Perubahan profile disimpan.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Profile",
				description: "Kelola profile BUMDes dan akun administrator."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "grid gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Profil BUMDes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Identitas lembaga yang tampil pada laporan dan halaman login." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nama BUMDes",
								htmlFor: "set-bumdes",
								required: true,
								error: errors.bumdesName,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "set-bumdes",
									value: form.bumdesName,
									onChange: (e) => setForm({
										...form,
										bumdesName: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nama Desa",
								htmlFor: "set-desa",
								required: true,
								error: errors.villageName,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "set-desa",
									value: form.villageName,
									onChange: (e) => setForm({
										...form,
										villageName: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Alamat",
								htmlFor: "set-alamat",
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "set-alamat",
									value: form.address,
									onChange: (e) => setForm({
										...form,
										address: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nomor Telepon",
								htmlFor: "set-tel",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "set-tel",
									value: form.phone,
									onChange: (e) => setForm({
										...form,
										phone: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								htmlFor: "set-email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "set-email",
									type: "email",
									value: form.email,
									onChange: (e) => setForm({
										...form,
										email: e.target.value
									})
								})
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Profil Admin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Nama dan akun yang digunakan untuk masuk ke sistem." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nama",
								htmlFor: "adm-name",
								required: true,
								error: errors.adminName,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "adm-name",
									value: form.adminName,
									onChange: (e) => setForm({
										...form,
										adminName: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Username",
								htmlFor: "adm-user",
								required: true,
								error: errors.adminUsername,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "adm-user",
									value: form.adminUsername,
									onChange: (e) => setForm({
										...form,
										adminUsername: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								htmlFor: "adm-email",
								required: true,
								error: errors.adminEmail,
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "adm-email",
									type: "email",
									value: form.adminEmail,
									onChange: (e) => setForm({
										...form,
										adminEmail: e.target.value
									})
								})
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setResetOpen(true),
							children: "Pulihkan data contoh"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Simpan Perubahan"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: resetOpen,
				onOpenChange: setResetOpen,
				title: "Pulihkan data contoh?",
				description: "Semua transaksi, barang, dan peminjaman akan dikembalikan ke data awal. Profil saat ini tidak diubah.",
				confirmLabel: "Pulihkan",
				destructive: true,
				onConfirm: () => {
					restoreDemo();
					toast.success("Data contoh dipulihkan.");
				}
			})
		]
	});
}
//#endregion
export { ProfilePage as component };
