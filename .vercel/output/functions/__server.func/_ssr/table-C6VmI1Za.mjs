import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn } from "./router-s55k0KN_.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Table({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative w-full overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
			className: cn("w-full min-w-[720px] caption-bottom text-sm", className),
			...props
		})
	});
}
function TableHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
		className: cn("bg-muted/70", className),
		...props
	});
}
function TableBody({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
		className: cn("[&_tr:last-child]:border-0", className),
		...props
	});
}
function TableRow({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
		className: cn("border-b border-border transition-colors hover:bg-muted/50", className),
		...props
	});
}
function TableHead({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: cn("h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground", className),
		...props
	});
}
function TableCell({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: cn("px-4 py-3 align-middle text-foreground", className),
		...props
	});
}
//#endregion
export { TableHeader as a, TableHead as i, TableBody as n, TableRow as o, TableCell as r, Table as t };
