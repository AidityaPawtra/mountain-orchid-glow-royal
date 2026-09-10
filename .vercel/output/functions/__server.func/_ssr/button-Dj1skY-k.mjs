import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as Slot, N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./router-s55k0KN_.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
			secondary: "bg-secondary text-secondary-foreground hover:bg-primary-soft",
			outline: "border border-border bg-card text-foreground hover:bg-muted shadow-sm",
			ghost: "text-foreground hover:bg-muted",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			navy: "bg-navy text-navy-fg hover:bg-navy/90",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-9 rounded-md px-3 text-[13px]",
			lg: "h-11 rounded-xl px-5",
			icon: "size-10",
			"icon-sm": "size-8 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
export { buttonVariants as n, Button as t };
