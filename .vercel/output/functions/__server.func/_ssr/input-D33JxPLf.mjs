import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn } from "./router-s55k0KN_.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-sm transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium", className),
		...props
	});
}
//#endregion
export { Input as t };
