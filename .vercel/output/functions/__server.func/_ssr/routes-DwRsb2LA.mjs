import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useAppStore } from "./router-s55k0KN_.mjs";
import { n as SplashScreen } from "./app-shell-ZNm2nR5C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DwRsb2LA.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const ready = useAppStore((s) => s.ready);
	const session = useAppStore((s) => s.session);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: session ? "/dashboard" : "/login" });
}
//#endregion
export { Home as component };
