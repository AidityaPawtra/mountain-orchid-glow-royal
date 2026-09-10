import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn } from "./router-s55k0KN_.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-sm font-medium leading-none text-foreground", className),
		...props
	});
}
function Field({ label, htmlFor, error, required, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col gap-1.5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				htmlFor,
				children: [label, required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-0.5 text-danger",
					children: "*"
				}) : null]
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-danger",
				children: error
			}) : null
		]
	});
}
//#endregion
export { Field as t };
