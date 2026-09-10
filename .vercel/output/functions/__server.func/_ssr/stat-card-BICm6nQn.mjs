import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn } from "./router-s55k0KN_.mjs";
import { t as Card } from "./card-BzJc9zJP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stat-card-BICm6nQn.js
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ label, value, hint, icon: Icon, tone = "primary" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums",
					children: value
				}),
				hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: hint
				}) : null
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("flex size-11 items-center justify-center rounded-xl", {
					primary: "bg-primary-soft text-primary",
					danger: "bg-danger-soft text-danger",
					success: "bg-success-soft text-success",
					warning: "bg-warning-soft text-warning"
				}[tone]),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
			})]
		})
	});
}
//#endregion
export { StatCard as t };
