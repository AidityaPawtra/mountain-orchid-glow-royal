import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn } from "./router-s55k0KN_.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
//#endregion
export { Textarea as t };
