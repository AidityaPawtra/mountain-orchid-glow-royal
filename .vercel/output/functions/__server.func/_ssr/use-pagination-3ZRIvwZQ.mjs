import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as ChevronRight, s as Search, w as ChevronLeft } from "../_libs/lucide-react.mjs";
import { i as cn } from "./router-s55k0KN_.mjs";
import { t as Button } from "./button-Dj1skY-k.mjs";
import { t as Input } from "./input-D33JxPLf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-pagination-3ZRIvwZQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Pagination({ page, pageCount, onPageChange, total, pageSize }) {
	if (total === 0) return null;
	const start = (page - 1) * pageSize + 1;
	const end = Math.min(page * pageSize, total);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [
				"Menampilkan ",
				start,
				"–",
				end,
				" dari ",
				total,
				" data"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					disabled: page <= 1,
					onClick: () => onPageChange(page - 1),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Sebelumnya"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-16 text-center text-sm tabular-nums text-muted-foreground",
					children: [
						page,
						" / ",
						pageCount
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					disabled: page >= pageCount,
					onClick: () => onPageChange(page + 1),
					children: ["Berikutnya", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
				})
			]
		})]
	});
}
function SearchBar({ value, onChange, placeholder = "Cari...", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (event) => onChange(event.target.value),
			placeholder,
			className: "pl-9"
		})]
	});
}
function usePagination(items, pageSize = 8) {
	const [page, setPage] = (0, import_react.useState)(1);
	const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
	const safePage = Math.min(page, pageCount);
	return {
		page: safePage,
		setPage,
		pageCount,
		slice: (0, import_react.useMemo)(() => {
			const start = (safePage - 1) * pageSize;
			return items.slice(start, start + pageSize);
		}, [
			items,
			safePage,
			pageSize
		]),
		pageSize,
		total: items.length
	};
}
//#endregion
export { SearchBar as n, usePagination as r, Pagination as t };
