import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createRootRoute, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { i as isValid, n as parseISO, r as format, t as id } from "../_libs/date-fns.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-s55k0KN_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var STORAGE_KEYS = {
	version: "bumdes-wengkal:version",
	users: "bumdes-wengkal:users",
	session: "bumdes-wengkal:session",
	income: "bumdes-wengkal:income",
	expenses: "bumdes-wengkal:expenses",
	items: "bumdes-wengkal:items",
	loans: "bumdes-wengkal:loans",
	settings: "bumdes-wengkal:settings",
	notifications: "bumdes-wengkal:notifications"
};
var INCOME_CATEGORIES = [
	"Penjualan",
	"Sewa",
	"Angsuran",
	"Bantuan",
	"Lainnya"
];
var EXPENSE_CATEGORIES = [
	"Operasional",
	"Pemeliharaan",
	"Kegiatan",
	"ATK",
	"Gaji",
	"Transport",
	"Lainnya"
];
var ITEM_CATEGORIES = [
	"Perlengkapan",
	"Elektronik",
	"Peralatan Dapur",
	"Lainnya"
];
var ITEM_CONDITIONS = [
	"Baik",
	"Rusak Ringan",
	"Rusak Berat"
];
var DEMO_CREDENTIALS = {
	username: "admin",
	password: "admin123",
	email: "admin@bumdeswengkal.id"
};
var defaultUsers = [{
	id: "user-admin",
	username: DEMO_CREDENTIALS.username,
	password: DEMO_CREDENTIALS.password,
	name: "Admin",
	email: DEMO_CREDENTIALS.email
}];
var defaultSettings = {
	bumdesName: "BUMDes Desa Wengkal",
	villageName: "Desa Wengkal",
	address: "Jl. Raya Wengkal No. 01, Kecamatan Wengkal",
	phone: "0812-3456-7890",
	email: "bumdes@desawengkal.id",
	adminName: "Admin",
	adminUsername: "admin",
	adminEmail: "admin@bumdeswengkal.id"
};
var defaultItems = [
	{
		id: "item-kursi",
		name: "Kursi",
		category: "Perlengkapan",
		quantity: 100,
		borrowed: 50,
		condition: "Baik"
	},
	{
		id: "item-tenda",
		name: "Tenda",
		category: "Perlengkapan",
		quantity: 10,
		borrowed: 2,
		condition: "Baik"
	},
	{
		id: "item-sound",
		name: "Sound System",
		category: "Elektronik",
		quantity: 3,
		borrowed: 1,
		condition: "Baik"
	},
	{
		id: "item-meja",
		name: "Meja Lipat",
		category: "Perlengkapan",
		quantity: 40,
		borrowed: 18,
		condition: "Baik"
	},
	{
		id: "item-karpet",
		name: "Karpet",
		category: "Perlengkapan",
		quantity: 15,
		borrowed: 5,
		condition: "Baik"
	},
	{
		id: "item-genset",
		name: "Genset",
		category: "Elektronik",
		quantity: 2,
		borrowed: 1,
		condition: "Baik"
	},
	{
		id: "item-proyektor",
		name: "Proyektor",
		category: "Elektronik",
		quantity: 4,
		borrowed: 1,
		condition: "Baik"
	},
	{
		id: "item-panci",
		name: "Panci Besar",
		category: "Peralatan Dapur",
		quantity: 20,
		borrowed: 0,
		condition: "Baik"
	},
	{
		id: "item-terpal",
		name: "Terpal",
		category: "Perlengkapan",
		quantity: 12,
		borrowed: 4,
		condition: "Baik"
	},
	{
		id: "item-mic",
		name: "Mic Wireless",
		category: "Elektronik",
		quantity: 8,
		borrowed: 2,
		condition: "Baik"
	},
	{
		id: "item-panggung",
		name: "Panggung Portable",
		category: "Perlengkapan",
		quantity: 2,
		borrowed: 1,
		condition: "Baik"
	},
	{
		id: "item-cooler",
		name: "Cooler Box",
		category: "Peralatan Dapur",
		quantity: 10,
		borrowed: 3,
		condition: "Baik"
	}
];
var defaultIncome = [
	{
		id: "inc-01",
		date: "2026-09-10",
		source: "Unit Usaha",
		category: "Penjualan",
		description: "Hasil penjualan produk",
		amount: 5e5,
		createdAt: "2026-09-10T09:20:00.000Z"
	},
	{
		id: "inc-02",
		date: "2026-09-09",
		source: "Sewa Lapangan",
		category: "Sewa",
		description: "Sewa lapangan desa",
		amount: 3e5,
		createdAt: "2026-09-09T14:10:00.000Z"
	},
	{
		id: "inc-03",
		date: "2026-09-08",
		source: "Simpan Pinjam",
		category: "Angsuran",
		description: "Angsuran anggota",
		amount: 75e4,
		createdAt: "2026-09-08T11:05:00.000Z"
	},
	{
		id: "inc-04",
		date: "2026-08-28",
		source: "Unit Usaha",
		category: "Penjualan",
		description: "Penjualan hasil bumi",
		amount: 12e5,
		createdAt: "2026-08-28T08:40:00.000Z"
	},
	{
		id: "inc-05",
		date: "2026-08-20",
		source: "PAD Desa",
		category: "Bantuan",
		description: "Penyertaan modal desa",
		amount: 1e6,
		createdAt: "2026-08-20T10:00:00.000Z"
	},
	{
		id: "inc-06",
		date: "2026-08-05",
		source: "Sewa Kios",
		category: "Sewa",
		description: "Sewa kios pasar desa",
		amount: 45e4,
		createdAt: "2026-08-05T13:25:00.000Z"
	},
	{
		id: "inc-07",
		date: "2026-07-22",
		source: "Simpan Pinjam",
		category: "Angsuran",
		description: "Angsuran pinjaman produktif",
		amount: 85e4,
		createdAt: "2026-07-22T09:15:00.000Z"
	},
	{
		id: "inc-08",
		date: "2026-07-10",
		source: "Unit Usaha",
		category: "Penjualan",
		description: "Penjualan pupuk dan benih",
		amount: 98e4,
		createdAt: "2026-07-10T15:45:00.000Z"
	},
	{
		id: "inc-09",
		date: "2026-06-30",
		source: "BUMDes",
		category: "Lainnya",
		description: "Pendapatan lain-lain",
		amount: 15e5,
		createdAt: "2026-06-30T16:00:00.000Z"
	},
	{
		id: "inc-10",
		date: "2026-06-12",
		source: "Sewa Lapangan",
		category: "Sewa",
		description: "Sewa lapangan untuk turnamen",
		amount: 4e5,
		createdAt: "2026-06-12T12:30:00.000Z"
	},
	{
		id: "inc-11",
		date: "2026-05-20",
		source: "Unit Usaha",
		category: "Penjualan",
		description: "Penjualan air minum isi ulang",
		amount: 11e5,
		createdAt: "2026-05-20T08:10:00.000Z"
	},
	{
		id: "inc-12",
		date: "2026-05-05",
		source: "Simpan Pinjam",
		category: "Angsuran",
		description: "Angsuran anggota kelompok tani",
		amount: 67e4,
		createdAt: "2026-05-05T10:50:00.000Z"
	},
	{
		id: "inc-13",
		date: "2026-04-18",
		source: "PAD Desa",
		category: "Bantuan",
		description: "Insentif unit usaha",
		amount: 8e5,
		createdAt: "2026-04-18T09:00:00.000Z"
	},
	{
		id: "inc-14",
		date: "2026-03-25",
		source: "Unit Usaha",
		category: "Penjualan",
		description: "Penjualan kerajinan warga",
		amount: 95e4,
		createdAt: "2026-03-25T14:20:00.000Z"
	},
	{
		id: "inc-15",
		date: "2026-02-14",
		source: "Sewa Kios",
		category: "Sewa",
		description: "Sewa kios bulan Februari",
		amount: 35e4,
		createdAt: "2026-02-14T11:40:00.000Z"
	},
	{
		id: "inc-16",
		date: "2026-01-20",
		source: "Unit Usaha",
		category: "Penjualan",
		description: "Penjualan awal tahun",
		amount: 7e5,
		createdAt: "2026-01-20T09:30:00.000Z"
	}
];
var defaultExpenses = [
	{
		id: "exp-01",
		date: "2026-09-10",
		category: "Operasional",
		purpose: "ATK",
		description: "Pembelian ATK",
		amount: 25e4,
		createdAt: "2026-09-10T10:15:00.000Z"
	},
	{
		id: "exp-02",
		date: "2026-09-08",
		category: "Pemeliharaan",
		purpose: "Perbaikan alat",
		description: "Perbaikan fasilitas",
		amount: 5e5,
		createdAt: "2026-09-08T13:40:00.000Z"
	},
	{
		id: "exp-03",
		date: "2026-09-05",
		category: "Kegiatan",
		purpose: "Acara desa",
		description: "Kegiatan masyarakat",
		amount: 75e4,
		createdAt: "2026-09-05T16:20:00.000Z"
	},
	{
		id: "exp-04",
		date: "2026-08-22",
		category: "Gaji",
		purpose: "Honor pengurus",
		description: "Honorarium pengurus bulan Agustus",
		amount: 4e5,
		createdAt: "2026-08-22T09:00:00.000Z"
	},
	{
		id: "exp-05",
		date: "2026-08-12",
		category: "Operasional",
		purpose: "Listrik",
		description: "Pembayaran listrik kantor BUMDes",
		amount: 3e5,
		createdAt: "2026-08-12T11:10:00.000Z"
	},
	{
		id: "exp-06",
		date: "2026-07-18",
		category: "Pemeliharaan",
		purpose: "Servis genset",
		description: "Servis berkala genset",
		amount: 35e4,
		createdAt: "2026-07-18T14:00:00.000Z"
	},
	{
		id: "exp-07",
		date: "2026-06-21",
		category: "Kegiatan",
		purpose: "Pelatihan",
		description: "Pelatihan pengelolaan unit usaha",
		amount: 6e5,
		createdAt: "2026-06-21T08:45:00.000Z"
	},
	{
		id: "exp-08",
		date: "2026-05-14",
		category: "ATK",
		purpose: "Alat tulis",
		description: "Pembelian kertas dan tinta printer",
		amount: 28e4,
		createdAt: "2026-05-14T10:25:00.000Z"
	},
	{
		id: "exp-09",
		date: "2026-04-09",
		category: "Transport",
		purpose: "Perjalanan dinas",
		description: "Transport rapat kecamatan",
		amount: 22e4,
		createdAt: "2026-04-09T07:50:00.000Z"
	},
	{
		id: "exp-10",
		date: "2026-03-16",
		category: "Operasional",
		purpose: "Konsumsi rapat",
		description: "Rapat evaluasi triwulan I",
		amount: 4e5,
		createdAt: "2026-03-16T12:00:00.000Z"
	},
	{
		id: "exp-11",
		date: "2026-02-08",
		category: "Pemeliharaan",
		purpose: "Pembersihan gudang",
		description: "Pembersihan dan penataan gudang barang",
		amount: 2e5,
		createdAt: "2026-02-08T15:30:00.000Z"
	}
];
var defaultLoans = [
	{
		id: "loan-01",
		borrowerName: "Karang Taruna",
		phone: "081234567801",
		itemId: "item-kursi",
		itemName: "Kursi",
		quantity: 50,
		borrowDate: "2026-09-10",
		returnDate: "2026-09-12",
		purpose: "Acara 17-an susulan",
		notes: "Dipakai di balai desa",
		status: "borrowed",
		createdAt: "2026-09-10T08:00:00.000Z"
	},
	{
		id: "loan-02",
		borrowerName: "Pak Budi",
		phone: "081234567802",
		itemId: "item-tenda",
		itemName: "Tenda",
		quantity: 2,
		borrowDate: "2026-09-08",
		returnDate: "2026-09-10",
		actualReturnDate: "2026-09-10",
		purpose: "Hajatan keluarga",
		notes: "Dikembalikan lengkap",
		status: "returned",
		createdAt: "2026-09-08T09:10:00.000Z"
	},
	{
		id: "loan-03",
		borrowerName: "PKK Desa",
		phone: "081234567803",
		itemId: "item-sound",
		itemName: "Sound System",
		quantity: 1,
		borrowDate: "2026-09-09",
		returnDate: "2026-09-11",
		purpose: "Pengajian rutin",
		notes: "Termasuk 2 mic",
		status: "borrowed",
		createdAt: "2026-09-09T10:00:00.000Z"
	},
	{
		id: "loan-04",
		borrowerName: "Pak Slamet",
		phone: "081234567804",
		itemId: "item-meja",
		itemName: "Meja Lipat",
		quantity: 10,
		borrowDate: "2026-09-09",
		returnDate: "2026-09-13",
		purpose: "Rapat RT",
		notes: "",
		status: "borrowed",
		createdAt: "2026-09-09T11:20:00.000Z"
	},
	{
		id: "loan-05",
		borrowerName: "Bu Ani",
		phone: "081234567805",
		itemId: "item-karpet",
		itemName: "Karpet",
		quantity: 5,
		borrowDate: "2026-09-08",
		returnDate: "2026-09-15",
		purpose: "Pengajian ibu-ibu",
		notes: "Warna hijau",
		status: "borrowed",
		createdAt: "2026-09-08T13:00:00.000Z"
	},
	{
		id: "loan-06",
		borrowerName: "Karang Taruna",
		phone: "081234567801",
		itemId: "item-mic",
		itemName: "Mic Wireless",
		quantity: 2,
		borrowDate: "2026-09-10",
		returnDate: "2026-09-12",
		purpose: "Hiburan rakyat",
		notes: "",
		status: "borrowed",
		createdAt: "2026-09-10T08:05:00.000Z"
	},
	{
		id: "loan-07",
		borrowerName: "RT 02",
		phone: "081234567807",
		itemId: "item-tenda",
		itemName: "Tenda",
		quantity: 2,
		borrowDate: "2026-09-07",
		returnDate: "2026-09-14",
		purpose: "Kerja bakti",
		notes: "Posko di lapangan",
		status: "borrowed",
		createdAt: "2026-09-07T07:40:00.000Z"
	},
	{
		id: "loan-08",
		borrowerName: "Masjid Al-Hidayah",
		phone: "081234567808",
		itemId: "item-proyektor",
		itemName: "Proyektor",
		quantity: 1,
		borrowDate: "2026-09-09",
		returnDate: "2026-09-16",
		purpose: "Kajian ramadhan susulan",
		notes: "Termasuk kabel HDMI",
		status: "borrowed",
		createdAt: "2026-09-09T16:10:00.000Z"
	},
	{
		id: "loan-09",
		borrowerName: "SD Wengkal",
		phone: "081234567809",
		itemId: "item-meja",
		itemName: "Meja Lipat",
		quantity: 8,
		borrowDate: "2026-09-06",
		returnDate: "2026-09-20",
		purpose: "Pentas seni sekolah",
		notes: "",
		status: "borrowed",
		createdAt: "2026-09-06T09:00:00.000Z"
	},
	{
		id: "loan-10",
		borrowerName: "Posyandu",
		phone: "081234567810",
		itemId: "item-cooler",
		itemName: "Cooler Box",
		quantity: 3,
		borrowDate: "2026-09-10",
		returnDate: "2026-09-11",
		purpose: "Imunisasi balita",
		notes: "Untuk vaksin",
		status: "borrowed",
		createdAt: "2026-09-10T07:15:00.000Z"
	},
	{
		id: "loan-11",
		borrowerName: "Gapoktan",
		phone: "081234567811",
		itemId: "item-terpal",
		itemName: "Terpal",
		quantity: 4,
		borrowDate: "2026-09-05",
		returnDate: "2026-09-12",
		purpose: "Jemur gabah",
		notes: "Ukuran 6x8",
		status: "borrowed",
		createdAt: "2026-09-05T06:50:00.000Z"
	},
	{
		id: "loan-12",
		borrowerName: "Remaja Masjid",
		phone: "081234567812",
		itemId: "item-panggung",
		itemName: "Panggung Portable",
		quantity: 1,
		borrowDate: "2026-09-08",
		returnDate: "2026-09-14",
		purpose: "Lomba adzan",
		notes: "",
		status: "borrowed",
		createdAt: "2026-09-08T15:00:00.000Z"
	},
	{
		id: "loan-13",
		borrowerName: "Pak Joko",
		phone: "081234567813",
		itemId: "item-genset",
		itemName: "Genset",
		quantity: 1,
		borrowDate: "2026-09-01",
		returnDate: "2026-09-05",
		purpose: "Acara hajatan",
		notes: "Belum dikembalikan",
		status: "overdue",
		createdAt: "2026-09-01T10:00:00.000Z"
	},
	{
		id: "loan-14",
		borrowerName: "PKK Desa",
		phone: "081234567803",
		itemId: "item-panci",
		itemName: "Panci Besar",
		quantity: 6,
		borrowDate: "2026-09-01",
		returnDate: "2026-09-03",
		actualReturnDate: "2026-09-03",
		purpose: "Masak bersama",
		notes: "",
		status: "returned",
		createdAt: "2026-09-01T08:20:00.000Z"
	},
	{
		id: "loan-15",
		borrowerName: "Karang Taruna",
		phone: "081234567801",
		itemId: "item-sound",
		itemName: "Sound System",
		quantity: 1,
		borrowDate: "2026-08-20",
		returnDate: "2026-08-22",
		actualReturnDate: "2026-08-22",
		purpose: "Turnamen voli",
		notes: "",
		status: "returned",
		createdAt: "2026-08-20T12:00:00.000Z"
	},
	{
		id: "loan-16",
		borrowerName: "Bu Rina",
		phone: "081234567816",
		itemId: "item-kursi",
		itemName: "Kursi",
		quantity: 20,
		borrowDate: "2026-08-15",
		returnDate: "2026-08-17",
		actualReturnDate: "2026-08-17",
		purpose: "Tahlilan",
		notes: "",
		status: "returned",
		createdAt: "2026-08-15T09:40:00.000Z"
	},
	{
		id: "loan-17",
		borrowerName: "RT 05",
		phone: "081234567817",
		itemId: "item-terpal",
		itemName: "Terpal",
		quantity: 2,
		borrowDate: "2026-08-10",
		returnDate: "2026-08-12",
		actualReturnDate: "2026-08-12",
		purpose: "Gotong royong",
		notes: "",
		status: "returned",
		createdAt: "2026-08-10T07:00:00.000Z"
	}
];
var defaultNotifications = [
	{
		id: "ntf-01",
		title: "Peminjaman terlambat",
		body: "Pak Joko belum mengembalikan Genset (jatuh tempo 05/09/2026).",
		time: "2026-09-10T07:00:00.000Z",
		read: false,
		href: "/peminjaman/loan-13"
	},
	{
		id: "ntf-02",
		title: "Jatuh tempo minggu ini",
		body: "Terdapat beberapa peminjaman yang akan berakhir dalam 3 hari ke depan.",
		time: "2026-09-10T06:30:00.000Z",
		read: false,
		href: "/peminjaman"
	},
	{
		id: "ntf-03",
		title: "Pemasukan tercatat",
		body: "Hasil penjualan produk sebesar Rp500.000 telah masuk kas BUMDes.",
		time: "2026-09-10T09:25:00.000Z",
		read: true,
		href: "/uang-masuk"
	}
];
function formatRupiah(value) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(value);
}
function formatNumber(value) {
	return new Intl.NumberFormat("id-ID").format(value);
}
function todayISO() {
	return format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
}
function formatDate(iso) {
	if (!iso) return "—";
	const parsed = parseISO(iso);
	if (!isValid(parsed)) return iso;
	return format(parsed, "dd/MM/yyyy");
}
function formatDateTime(iso) {
	if (!iso) return "—";
	const parsed = parseISO(iso);
	if (!isValid(parsed)) return iso;
	return format(parsed, "dd MMM yyyy, HH:mm", { locale: id });
}
var MONTH_LABELS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"Mei",
	"Jun",
	"Jul",
	"Agu",
	"Sep",
	"Okt",
	"Nov",
	"Des"
];
function parseAmount(raw) {
	const cleaned = raw.replace(/[^\d]/g, "");
	if (!cleaned) return NaN;
	return Number(cleaned);
}
function canUseStorage() {
	return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}
function readJSON(key, fallback) {
	if (!canUseStorage()) return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function writeJSON(key, value) {
	if (!canUseStorage()) return;
	window.localStorage.setItem(key, JSON.stringify(value));
}
function removeKey(key) {
	if (!canUseStorage()) return;
	window.localStorage.removeItem(key);
}
function seedIfNeeded() {
	if (!canUseStorage()) return;
	if (window.localStorage.getItem(STORAGE_KEYS.version) === "1" && window.localStorage.getItem(STORAGE_KEYS.income)) return;
	writeJSON(STORAGE_KEYS.users, defaultUsers);
	writeJSON(STORAGE_KEYS.income, defaultIncome);
	writeJSON(STORAGE_KEYS.expenses, defaultExpenses);
	writeJSON(STORAGE_KEYS.items, defaultItems);
	writeJSON(STORAGE_KEYS.loans, defaultLoans);
	writeJSON(STORAGE_KEYS.settings, defaultSettings);
	writeJSON(STORAGE_KEYS.notifications, defaultNotifications);
	window.localStorage.setItem(STORAGE_KEYS.version, "1");
}
function resetDemoData() {
	if (!canUseStorage()) return;
	removeKey(STORAGE_KEYS.session);
	writeJSON(STORAGE_KEYS.users, defaultUsers);
	writeJSON(STORAGE_KEYS.income, defaultIncome);
	writeJSON(STORAGE_KEYS.expenses, defaultExpenses);
	writeJSON(STORAGE_KEYS.items, defaultItems);
	writeJSON(STORAGE_KEYS.loans, defaultLoans);
	writeJSON(STORAGE_KEYS.settings, defaultSettings);
	writeJSON(STORAGE_KEYS.notifications, defaultNotifications);
	window.localStorage.setItem(STORAGE_KEYS.version, "1");
}
var storageApi = {
	users: () => readJSON(STORAGE_KEYS.users, defaultUsers),
	saveUsers: (value) => writeJSON(STORAGE_KEYS.users, value),
	session: () => readJSON(STORAGE_KEYS.session, null),
	saveSession: (value) => {
		if (value) writeJSON(STORAGE_KEYS.session, value);
		else removeKey(STORAGE_KEYS.session);
	},
	income: () => readJSON(STORAGE_KEYS.income, defaultIncome),
	saveIncome: (value) => writeJSON(STORAGE_KEYS.income, value),
	expenses: () => readJSON(STORAGE_KEYS.expenses, defaultExpenses),
	saveExpenses: (value) => writeJSON(STORAGE_KEYS.expenses, value),
	items: () => readJSON(STORAGE_KEYS.items, defaultItems),
	saveItems: (value) => writeJSON(STORAGE_KEYS.items, value),
	loans: () => readJSON(STORAGE_KEYS.loans, defaultLoans),
	saveLoans: (value) => writeJSON(STORAGE_KEYS.loans, value),
	settings: () => readJSON(STORAGE_KEYS.settings, defaultSettings),
	saveSettings: (value) => writeJSON(STORAGE_KEYS.settings, value),
	notifications: () => readJSON(STORAGE_KEYS.notifications, defaultNotifications),
	saveNotifications: (value) => writeJSON(STORAGE_KEYS.notifications, value)
};
function totalIncome(income) {
	return income.reduce((sum, row) => sum + row.amount, 0);
}
function totalExpense(expenses) {
	return expenses.reduce((sum, row) => sum + row.amount, 0);
}
function computeBalance(income, expenses) {
	return totalIncome(income) - totalExpense(expenses);
}
function resolveLoanStatus(loan, today = todayISO()) {
	if (loan.status === "returned" || loan.actualReturnDate) return "returned";
	if (loan.returnDate < today) return "overdue";
	return "borrowed";
}
function withResolvedLoans(loans, today = todayISO()) {
	return loans.map((loan) => ({
		...loan,
		status: resolveLoanStatus(loan, today)
	}));
}
function loanStats(loans) {
	const resolved = withResolvedLoans(loans);
	return {
		active: resolved.filter((l) => l.status !== "returned").length,
		returned: resolved.filter((l) => l.status === "returned").length,
		overdue: resolved.filter((l) => l.status === "overdue").length
	};
}
function itemAvailability(item) {
	return Math.max(0, item.quantity - item.borrowed);
}
function itemStats(items) {
	return {
		total: items.length,
		units: items.reduce((sum, item) => sum + item.quantity, 0),
		borrowed: items.reduce((sum, item) => sum + item.borrowed, 0),
		available: items.reduce((sum, item) => sum + itemAvailability(item), 0)
	};
}
function mergeTransactions(income, expenses) {
	return [...income.map((row) => ({
		id: row.id,
		type: "income",
		date: row.date,
		title: row.source,
		category: row.category,
		amount: row.amount,
		createdAt: row.createdAt
	})), ...expenses.map((row) => ({
		id: row.id,
		type: "expense",
		date: row.date,
		title: row.purpose,
		category: row.category,
		amount: row.amount,
		createdAt: row.createdAt
	}))].sort((a, b) => {
		if (a.date === b.date) return b.createdAt.localeCompare(a.createdAt);
		return b.date.localeCompare(a.date);
	});
}
function cashflowByMonth(income, expenses, year) {
	return MONTH_LABELS.map((label, index) => {
		const prefix = `${year}-${String(index + 1).padStart(2, "0")}`;
		return {
			month: label,
			masuk: income.filter((row) => row.date.startsWith(prefix)).reduce((sum, row) => sum + row.amount, 0),
			keluar: expenses.filter((row) => row.date.startsWith(prefix)).reduce((sum, row) => sum + row.amount, 0)
		};
	});
}
function filterByPeriod(rows, period, today = todayISO()) {
	if (period === "all") return rows;
	if (period === "this-month") return rows.filter((row) => row.date.startsWith(today.slice(0, 7)));
	if (period === "last-month") {
		const [y, m] = today.split("-").map(Number);
		const date = new Date(y, m - 2, 1);
		const prefix = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
		return rows.filter((row) => row.date.startsWith(prefix));
	}
	if (period === "this-year") return rows.filter((row) => row.date.startsWith(today.slice(0, 4)));
	return rows;
}
function matchesQuery(values, query) {
	if (!query.trim()) return true;
	const q = query.trim().toLowerCase();
	return values.some((value) => String(value).toLowerCase().includes(q));
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function persist(partial) {
	if (partial.income) storageApi.saveIncome(partial.income);
	if (partial.expenses) storageApi.saveExpenses(partial.expenses);
	if (partial.items) storageApi.saveItems(partial.items);
	if (partial.loans) storageApi.saveLoans(partial.loans);
	if (partial.settings) storageApi.saveSettings(partial.settings);
	if (partial.notifications) storageApi.saveNotifications(partial.notifications);
	if (partial.users) storageApi.saveUsers(partial.users);
	if ("session" in partial) storageApi.saveSession(partial.session ?? null);
}
var useAppStore = create((set, get) => ({
	ready: false,
	session: null,
	users: [],
	income: [],
	expenses: [],
	items: [],
	loans: [],
	settings: defaultSettings,
	notifications: [],
	hydrate: () => {
		seedIfNeeded();
		const loans = storageApi.loans().map((loan) => ({
			...loan,
			status: resolveLoanStatus(loan)
		}));
		storageApi.saveLoans(loans);
		set({
			ready: true,
			session: storageApi.session(),
			users: storageApi.users(),
			income: storageApi.income(),
			expenses: storageApi.expenses(),
			items: storageApi.items(),
			loans,
			settings: storageApi.settings(),
			notifications: storageApi.notifications()
		});
	},
	login: (identifier, password) => {
		const id = identifier.trim().toLowerCase();
		const user = (get().users.length ? get().users : storageApi.users()).find((row) => row.username.toLowerCase() === id || row.email.toLowerCase() === id);
		if (!user || user.password !== password) return {
			ok: false,
			message: "Username atau kata sandi tidak sesuai."
		};
		const session = {
			userId: user.id,
			username: user.username,
			name: user.name,
			email: user.email
		};
		persist({ session });
		set({ session });
		return { ok: true };
	},
	logout: () => {
		persist({ session: null });
		set({ session: null });
	},
	addIncome: (payload) => {
		const income = [{
			...payload,
			id: uid("inc"),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...get().income];
		persist({ income });
		set({ income });
	},
	updateIncome: (id, payload) => {
		const income = get().income.map((row) => row.id === id ? {
			...row,
			...payload
		} : row);
		persist({ income });
		set({ income });
	},
	deleteIncome: (id) => {
		const income = get().income.filter((row) => row.id !== id);
		persist({ income });
		set({ income });
	},
	addExpense: (payload) => {
		const expenses = [{
			...payload,
			id: uid("exp"),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...get().expenses];
		persist({ expenses });
		set({ expenses });
	},
	updateExpense: (id, payload) => {
		const expenses = get().expenses.map((row) => row.id === id ? {
			...row,
			...payload
		} : row);
		persist({ expenses });
		set({ expenses });
	},
	deleteExpense: (id) => {
		const expenses = get().expenses.filter((row) => row.id !== id);
		persist({ expenses });
		set({ expenses });
	},
	addItem: (payload) => {
		const items = [{
			id: uid("item"),
			name: payload.name,
			category: payload.category,
			quantity: payload.quantity,
			borrowed: payload.borrowed ?? 0,
			condition: payload.condition
		}, ...get().items];
		persist({ items });
		set({ items });
	},
	updateItem: (id, payload) => {
		if (!get().items.find((row) => row.id === id)) return;
		const borrowed = Math.min(payload.borrowed, payload.quantity);
		const items = get().items.map((row) => row.id === id ? {
			...row,
			...payload,
			borrowed
		} : row);
		persist({ items });
		set({ items });
	},
	deleteItem: (id) => {
		const item = get().items.find((row) => row.id === id);
		if (!item) return {
			ok: false,
			message: "Barang tidak ditemukan."
		};
		if (item.borrowed > 0) return {
			ok: false,
			message: "Barang tidak dapat dihapus karena masih ada yang dipinjam."
		};
		const items = get().items.filter((row) => row.id !== id);
		persist({ items });
		set({ items });
		return { ok: true };
	},
	addLoan: (payload) => {
		const item = get().items.find((row) => row.id === payload.itemId);
		if (!item) return {
			ok: false,
			message: "Barang tidak ditemukan."
		};
		const available = item.quantity - item.borrowed;
		if (payload.quantity > available) return {
			ok: false,
			message: `Jumlah melebihi stok tersedia (${available}).`
		};
		if (payload.returnDate < payload.borrowDate) return {
			ok: false,
			message: "Tanggal kembali tidak boleh lebih awal dari tanggal pinjam."
		};
		const loan = {
			...payload,
			id: uid("loan"),
			itemName: item.name,
			status: resolveLoanStatus({
				...payload,
				id: "tmp",
				itemName: item.name,
				status: "borrowed",
				createdAt: ""
			}),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const loans = [loan, ...get().loans];
		const items = get().items.map((row) => row.id === item.id ? {
			...row,
			borrowed: row.borrowed + payload.quantity
		} : row);
		persist({
			loans,
			items
		});
		set({
			loans,
			items
		});
		return {
			ok: true,
			id: loan.id
		};
	},
	updateLoan: (id, payload) => {
		const loan = get().loans.find((row) => row.id === id);
		if (!loan) return {
			ok: false,
			message: "Data peminjaman tidak ditemukan."
		};
		if (loan.status === "returned") return {
			ok: false,
			message: "Peminjaman yang sudah dikembalikan tidak dapat diubah."
		};
		const nextItem = get().items.find((row) => row.id === payload.itemId);
		if (!nextItem) return {
			ok: false,
			message: "Barang tidak ditemukan."
		};
		if (payload.returnDate < payload.borrowDate) return {
			ok: false,
			message: "Tanggal kembali tidak boleh lebih awal dari tanggal pinjam."
		};
		let items = get().items.map((row) => {
			if (row.id === loan.itemId) return {
				...row,
				borrowed: Math.max(0, row.borrowed - loan.quantity)
			};
			return row;
		});
		const target = items.find((row) => row.id === payload.itemId);
		if (!target) return {
			ok: false,
			message: "Barang tidak ditemukan."
		};
		const available = target.quantity - target.borrowed;
		if (payload.quantity > available) return {
			ok: false,
			message: `Jumlah melebihi stok tersedia (${available}).`
		};
		items = items.map((row) => row.id === payload.itemId ? {
			...row,
			borrowed: row.borrowed + payload.quantity
		} : row);
		const loans = get().loans.map((row) => row.id === id ? {
			...row,
			...payload,
			itemName: nextItem.name,
			status: resolveLoanStatus({
				...row,
				...payload,
				itemName: nextItem.name
			})
		} : row);
		persist({
			loans,
			items
		});
		set({
			loans,
			items
		});
		return { ok: true };
	},
	returnLoan: (id) => {
		const loan = get().loans.find((row) => row.id === id);
		if (!loan) return {
			ok: false,
			message: "Data peminjaman tidak ditemukan."
		};
		if (loan.status === "returned") return { ok: true };
		const loans = get().loans.map((row) => row.id === id ? {
			...row,
			status: "returned",
			actualReturnDate: todayISO()
		} : row);
		const items = get().items.map((row) => row.id === loan.itemId ? {
			...row,
			borrowed: Math.max(0, row.borrowed - loan.quantity)
		} : row);
		persist({
			loans,
			items
		});
		set({
			loans,
			items
		});
		return { ok: true };
	},
	deleteLoan: (id) => {
		const loan = get().loans.find((row) => row.id === id);
		if (!loan) return;
		const loans = get().loans.filter((row) => row.id !== id);
		const items = loan.status === "returned" ? get().items : get().items.map((row) => row.id === loan.itemId ? {
			...row,
			borrowed: Math.max(0, row.borrowed - loan.quantity)
		} : row);
		persist({
			loans,
			items
		});
		set({
			loans,
			items
		});
	},
	saveSettings: (payload) => {
		const users = get().users.map((user) => user.username === DEMO_CREDENTIALS.username ? {
			...user,
			name: payload.adminName,
			username: payload.adminUsername,
			email: payload.adminEmail
		} : user);
		persist({
			settings: payload,
			users
		});
		const session = get().session ? {
			...get().session,
			name: payload.adminName,
			username: payload.adminUsername,
			email: payload.adminEmail
		} : null;
		persist({ session });
		set({
			settings: payload,
			users,
			session
		});
	},
	markNotificationRead: (id) => {
		const notifications = get().notifications.map((row) => row.id === id ? {
			...row,
			read: true
		} : row);
		persist({ notifications });
		set({ notifications });
	},
	markAllNotificationsRead: () => {
		const notifications = get().notifications.map((row) => ({
			...row,
			read: true
		}));
		persist({ notifications });
		set({ notifications });
	},
	restoreDemo: () => {
		const session = get().session;
		resetDemoData();
		if (session) storageApi.saveSession(session);
		seedIfNeeded();
		const loans = storageApi.loans().map((loan) => ({
			...loan,
			status: resolveLoanStatus(loan)
		}));
		storageApi.saveLoans(loans);
		set({
			ready: true,
			session: storageApi.session(),
			users: storageApi.users(),
			income: storageApi.income(),
			expenses: storageApi.expenses(),
			items: storageApi.items(),
			loans,
			settings: storageApi.settings(),
			notifications: storageApi.notifications()
		});
	}
}));
function StoreHydrator({ children }) {
	const hydrate = useAppStore((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	return children;
}
function Toaster$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		position: "top-right",
		toastOptions: { classNames: { toast: "font-sans rounded-xl border border-border shadow-[var(--shadow-card)]" } }
	});
}
var styles_default = "/assets/styles-BgvEgmTJ.css";
var APP_NAME = "BUMDes Desa Wengkal";
var Route$11 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0B3A67"
			},
			{
				name: "description",
				content: "Sistem pengelolaan keuangan dan peminjaman barang BUMDes Desa Wengkal"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/jpeg",
				href: "/logo.jpg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "id",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-screen bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreHydrator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$10 = () => import("./routes-DwRsb2LA.mjs");
var Route$10 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("../_app-D5rmddOy.mjs");
var Route$9 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./login-DrUASLPq.mjs");
var Route$8 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./barang-D5IIsndR.mjs");
var Route$7 = createFileRoute("/_app/barang")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./dashboard-CgwGSv0m.mjs");
var Route$6 = createFileRoute("/_app/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./laporan-BnbILnNm.mjs");
var Route$5 = createFileRoute("/_app/laporan")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./peminjaman-CNQE_upo.mjs");
var Route$4 = createFileRoute("/_app/peminjaman")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./profil-lrDsSHtr.mjs");
var Route$3 = createFileRoute("/_app/profil")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./uang-keluar-DW90pkmF.mjs");
var Route$2 = createFileRoute("/_app/uang-keluar")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./uang-masuk-CYVKcEnD.mjs");
var Route$1 = createFileRoute("/_app/uang-masuk")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./peminjaman._id-CO-yt1xg.mjs");
var Route = createFileRoute("/_app/peminjaman/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var AppRoute = Route$9.update({
	id: "/_app",
	getParentRoute: () => Route$11
});
var LoginRoute = Route$8.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$11
});
var AppBarangRoute = Route$7.update({
	id: "/barang",
	path: "/barang",
	getParentRoute: () => AppRoute
});
var AppDashboardRoute = Route$6.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppRoute
});
var AppLaporanRoute = Route$5.update({
	id: "/laporan",
	path: "/laporan",
	getParentRoute: () => AppRoute
});
var AppPeminjamanRoute = Route$4.update({
	id: "/peminjaman",
	path: "/peminjaman",
	getParentRoute: () => AppRoute
});
var AppProfileRoute = Route$3.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AppRoute
});
var AppUangKeluarRoute = Route$2.update({
	id: "/uang-keluar",
	path: "/uang-keluar",
	getParentRoute: () => AppRoute
});
var AppUangMasukRoute = Route$1.update({
	id: "/uang-masuk",
	path: "/uang-masuk",
	getParentRoute: () => AppRoute
});
var AppPeminjamanRouteChildren = { AppPeminjamanIdRoute: Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AppPeminjamanRoute
}) };
var AppRouteChildren = {
	AppBarangRoute,
	AppDashboardRoute,
	AppLaporanRoute,
	AppPeminjamanRoute: AppPeminjamanRoute._addFileChildren(AppPeminjamanRouteChildren),
	AppProfileRoute,
	AppUangKeluarRoute,
	AppUangMasukRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	LoginRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { todayISO as C, ITEM_CONDITIONS as D, ITEM_CATEGORIES as E, parseAmount as S, INCOME_CATEGORIES as T, MONTH_LABELS as _, cashflowByMonth as a, formatNumber as b, itemAvailability as c, matchesQuery as d, mergeTransactions as f, withResolvedLoans as g, totalIncome as h, cn as i, itemStats as l, totalExpense as m, Route as n, computeBalance as o, resolveLoanStatus as p, useAppStore as r, filterByPeriod as s, router_exports as t, loanStats as u, formatDate as v, EXPENSE_CATEGORIES as w, formatRupiah as x, formatDateTime as y };
