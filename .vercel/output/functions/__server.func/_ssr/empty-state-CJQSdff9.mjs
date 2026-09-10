import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as Inbox } from "../_libs/lucide-react.mjs";
import { i as cn } from "./router-s55k0KN_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/empty-state-CJQSdff9.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-foreground",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted-foreground",
				children: description
			}) : null,
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2",
				children: action
			}) : null
		]
	});
}
//#endregion
export { EmptyState as t };
