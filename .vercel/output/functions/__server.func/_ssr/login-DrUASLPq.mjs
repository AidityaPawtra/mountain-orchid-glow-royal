import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { b as Eye, h as LockKeyhole, r as UserRound, x as EyeOff } from "../_libs/lucide-react.mjs";
import { r as useAppStore } from "./router-s55k0KN_.mjs";
import { t as BrandLogo } from "./brand-logo-BEPFvUO6.mjs";
import { t as Button } from "./button-Dj1skY-k.mjs";
import { t as Input } from "./input-D33JxPLf.mjs";
import { t as Field } from "./field-cs3tRSLg.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-I40QyAx7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DrUASLPq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const ready = useAppStore((s) => s.ready);
	const session = useAppStore((s) => s.session);
	const login = useAppStore((s) => s.login);
	const settings = useAppStore((s) => s.settings);
	const [identifier, setIdentifier] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [fieldErrors, setFieldErrors] = (0, import_react.useState)({});
	const [forgotOpen, setForgotOpen] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	if (ready && session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/dashboard" });
	function handleSubmit(event) {
		event.preventDefault();
		const nextErrors = {};
		if (!identifier.trim()) nextErrors.identifier = "Email atau username wajib diisi.";
		if (!password) nextErrors.password = "Kata sandi wajib diisi.";
		setFieldErrors(nextErrors);
		setError("");
		if (Object.keys(nextErrors).length) return;
		setSubmitting(true);
		const result = login(identifier, password);
		setSubmitting(false);
		if (!result.ok) {
			setError(result.message);
			return;
		}
		navigate({ to: "/dashboard" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative hidden overflow-hidden lg:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/login-village.jpg",
						alt: "Suasana Desa Wengkal",
						className: "absolute inset-0 size-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-navy/20" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 p-10 text-navy-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium uppercase tracking-[0.18em] text-navy-muted",
							children: "Badan Usaha Milik Desa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 max-w-md text-3xl font-semibold tracking-tight",
							children: "Mengelola kas dan inventaris desa dengan tertib dan transparan."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex items-center justify-center bg-background px-5 py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-[400px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, { light: true }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-10 text-3xl font-semibold tracking-tight text-navy",
							children: "Selamat Datang"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: [
								"Silakan login untuk melanjutkan ke sistem ",
								settings.bumdesName,
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "mt-8 grid gap-4",
							children: [
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger",
									children: error
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Email atau Username",
									htmlFor: "login-id",
									required: true,
									error: fieldErrors.identifier,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "login-id",
											className: "pl-9",
											autoComplete: "username",
											value: identifier,
											onChange: (e) => setIdentifier(e.target.value),
											placeholder: "admin"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Password",
									htmlFor: "login-pass",
									required: true,
									error: fieldErrors.password,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "login-pass",
												className: "pl-9 pr-10",
												type: showPassword ? "text" : "password",
												autoComplete: "current-password",
												value: password,
												onChange: (e) => setPassword(e.target.value),
												placeholder: "••••••••"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground",
												onClick: () => setShowPassword((v) => !v),
												"aria-label": showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi",
												children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-sm font-medium text-primary hover:underline",
										onClick: () => setForgotOpen(true),
										children: "Lupa password?"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-11 w-full",
									disabled: submitting,
									children: "Login"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-center text-xs text-muted-foreground",
									children: [
										"Akun demo: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: "admin"
										}),
										" /",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: "admin123"
										})
									]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: forgotOpen,
				onOpenChange: setForgotOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Lupa password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Untuk mereset kata sandi, hubungi ketua BUMDes Desa Wengkal di ",
					settings.phone,
					" atau ",
					settings.email,
					"."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: () => setForgotOpen(false),
					children: "Mengerti"
				}) })] })
			})
		]
	});
}
//#endregion
export { LoginPage as component };
