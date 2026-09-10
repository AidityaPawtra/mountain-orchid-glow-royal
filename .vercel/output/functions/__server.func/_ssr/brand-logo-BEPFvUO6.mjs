import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn } from "./router-s55k0KN_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-logo-BEPFvUO6.js
var import_jsx_runtime = require_jsx_runtime();
function BrandMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-9 shrink-0", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				fill: "currentColor",
				className: "text-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#F5F8FC",
				d: "M16 6.5l10 8H6z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "9",
				y: "14",
				width: "14",
				height: "11",
				fill: "#F5F8FC"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "13.5",
				y: "18",
				width: "5",
				height: "7",
				fill: "#0B63CE"
			})
		]
	});
}
function BrandLogo({ collapsed = false, light = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-3", collapsed && "justify-center"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, { className: light ? "text-primary" : "text-primary" }), !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("truncate text-sm font-semibold leading-tight", light ? "text-navy" : "text-sidebar-fg"),
				children: "BUMDes Wengkal"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("truncate text-xs", light ? "text-muted-foreground" : "text-sidebar-muted"),
				children: "Desa Wengkal"
			})]
		}) : null]
	});
}
//#endregion
export { BrandMark as n, BrandLogo as t };
