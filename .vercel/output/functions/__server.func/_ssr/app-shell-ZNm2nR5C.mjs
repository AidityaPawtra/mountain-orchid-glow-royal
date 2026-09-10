import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, d as useRouterState, v as Link, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as require_jsx_runtime, d as DialogContent, h as DialogTitle, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as ArrowDownLeft, D as Bell, E as Boxes, O as ArrowUpRight, T as ChevronDown, d as Package, g as LayoutDashboard, m as LogOut, n as Wallet, o as Settings, p as Menu, r as UserRound, s as Search, t as X, v as FileText } from "../_libs/lucide-react.mjs";
import { f as mergeTransactions, i as cn, r as useAppStore, y as formatDateTime } from "./router-s55k0KN_.mjs";
import { n as BrandMark, t as BrandLogo } from "./brand-logo-BEPFvUO6.mjs";
import { t as Button } from "./button-Dj1skY-k.mjs";
import { t as Input } from "./input-D33JxPLf.mjs";
import { a as Root2, i as Portal2, n as Item2, o as Separator2, r as Label2, s as Trigger, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-ZNm2nR5C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		label: "Keuangan",
		icon: Wallet,
		children: [{
			to: "/uang-masuk",
			label: "Uang Masuk",
			icon: ArrowDownLeft
		}, {
			to: "/uang-keluar",
			label: "Uang Keluar",
			icon: ArrowUpRight
		}]
	},
	{
		to: "/peminjaman",
		label: "Peminjaman Barang",
		icon: Package
	},
	{
		to: "/barang",
		label: "Data Barang",
		icon: Boxes
	},
	{
		to: "/laporan",
		label: "Laporan",
		icon: FileText
	},
	{
		to: "/pengaturan",
		label: "Pengaturan",
		icon: Settings
	}
];
function isActivePath(pathname, to) {
	if (!to) return false;
	return pathname === to || pathname.startsWith(`${to}/`);
}
function SidebarNav({ collapsed = false, onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const financeOpenDefault = pathname.startsWith("/uang-");
	const [open, setOpen] = (0, import_react.useState)(financeOpenDefault);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("border-b border-white/10 px-4 py-5", collapsed && "px-2"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, { collapsed })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 space-y-1 overflow-y-auto px-3 py-4",
				children: NAV.map((item) => {
					if (item.children) {
						const childActive = item.children.some((child) => isActivePath(pathname, child.to));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setOpen((v) => !v),
							className: cn("flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg", childActive && "text-sidebar-fg", collapsed && "justify-center px-0"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5 shrink-0" }), !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-left",
								children: item.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 transition-transform duration-200", open || childActive ? "rotate-0" : "-rotate-90") })] }) : null]
						}), !collapsed && (open || childActive) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 space-y-1 pl-4",
							children: item.children.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: child.to,
								onClick: onNavigate,
								className: cn("flex h-10 items-center gap-3 rounded-xl px-3 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg", isActivePath(pathname, child.to) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(child.icon, { className: "size-4" }), child.label]
							}, child.to))
						}) : null] }, item.label);
					}
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: onNavigate,
						title: collapsed ? item.label : void 0,
						className: cn("flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-fg", isActivePath(pathname, item.to) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground", collapsed && "justify-center px-0"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5 shrink-0" }), !collapsed ? item.label : null]
					}, item.to);
				})
			}),
			!collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-white/10 px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-wider text-sidebar-muted",
					children: "Sistem Administrasi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-sidebar-fg/80",
					children: "Keuangan & Inventaris BUMDes"
				})]
			}) : null
		]
	});
}
function DesktopSidebar({ collapsed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: cn("sticky top-0 hidden h-screen shrink-0 bg-sidebar text-sidebar-fg transition-[width] duration-200 lg:block", collapsed ? "w-[76px]" : "w-[260px]"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNav, { collapsed })
	});
}
function Avatar({ name, className }) {
	const initial = name.trim().charAt(0).toUpperCase() || "A";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex size-9 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary", className),
		children: initial
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
function DropdownMenuContent({ className, sideOffset = 8, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset,
		className: cn("z-50 min-w-48 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-[var(--shadow-card-hover)]", className),
		...props
	}) });
}
function DropdownMenuItem({ className, inset, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50", inset && "pl-8", className),
		...props
	});
}
function DropdownMenuLabel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
		className: cn("px-2.5 py-1.5 text-xs font-medium text-muted-foreground", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
		className: cn("-mx-1 my-1 h-px bg-border", className),
		...props
	});
}
var Sheet = Dialog;
var SheetPortal = DialogPortal;
function SheetOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
		className: cn("fixed inset-0 z-50 bg-navy/40", className),
		...props
	});
}
function SheetContent({ className, children, side = "left", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex h-full flex-col bg-sidebar text-sidebar-fg shadow-xl transition-transform duration-300 ease-out", side === "left" ? "left-0 top-0 w-[280px]" : "right-0 top-0 w-[280px]", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-3 top-3 rounded-md p-1 text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Tutup"
			})]
		})]
	})] });
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
		className: cn("text-base font-semibold", className),
		...props
	});
}
function Topbar({ onToggleCollapse }) {
	const navigate = useNavigate();
	const router = useRouter();
	const session = useAppStore((s) => s.session);
	const settings = useAppStore((s) => s.settings);
	const notifications = useAppStore((s) => s.notifications);
	const markRead = useAppStore((s) => s.markNotificationRead);
	const markAll = useAppStore((s) => s.markAllNotificationsRead);
	const logout = useAppStore((s) => s.logout);
	const income = useAppStore((s) => s.income);
	const expenses = useAppStore((s) => s.expenses);
	const loans = useAppStore((s) => s.loans);
	const items = useAppStore((s) => s.items);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const unread = notifications.filter((n) => !n.read).length;
	const name = session?.name || settings.adminName || "Admin";
	const results = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (q.length < 2) return [];
		const tx = mergeTransactions(income, expenses).filter((row) => [row.title, row.category].join(" ").toLowerCase().includes(q)).slice(0, 4).map((row) => ({
			id: row.id,
			label: `${row.type === "income" ? "Masuk" : "Keluar"} · ${row.title}`,
			to: row.type === "income" ? "/uang-masuk" : "/uang-keluar"
		}));
		const loanHits = loans.filter((row) => [
			row.borrowerName,
			row.itemName,
			row.purpose
		].join(" ").toLowerCase().includes(q)).slice(0, 3).map((row) => ({
			id: row.id,
			label: `Pinjam · ${row.borrowerName} — ${row.itemName}`,
			to: `/peminjaman/${row.id}`
		}));
		const itemHits = items.filter((row) => row.name.toLowerCase().includes(q)).slice(0, 3).map((row) => ({
			id: row.id,
			label: `Barang · ${row.name}`,
			to: "/barang"
		}));
		return [
			...tx,
			...loanHits,
			...itemHits
		].slice(0, 8);
	}, [
		query,
		income,
		expenses,
		loans,
		items
	]);
	function handleLogout() {
		logout();
		navigate({ to: "/login" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-16 items-center gap-3 px-4 lg:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					className: "lg:hidden",
					onClick: () => setMobileOpen(true),
					"aria-label": "Buka menu",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					className: "hidden lg:inline-flex",
					onClick: onToggleCollapse,
					"aria-label": "Ciutkan sidebar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1 max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: query,
							onChange: (event) => setQuery(event.target.value),
							placeholder: "Cari transaksi, barang, atau peminjam...",
							className: "h-10 bg-muted/70 pl-9"
						}),
						results.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute left-0 right-0 top-[calc(100%+6px)] z-40 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card-hover)]",
							children: results.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "block w-full px-3 py-2.5 text-left text-sm hover:bg-muted",
								onClick: () => {
									setQuery("");
									router.history.push(row.to);
								},
								children: row.label
							}, row.id))
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "ghost",
						size: "icon",
						className: "relative",
						"aria-label": "Notifikasi",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" }), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-1.5 top-1.5 size-2 rounded-full bg-danger" }) : null]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					className: "w-80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Notifikasi" }), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-xs text-primary",
								onClick: markAll,
								children: "Tandai dibaca"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
						notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-3 py-6 text-center text-sm text-muted-foreground",
							children: "Tidak ada notifikasi."
						}) : notifications.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							className: "flex-col items-start gap-1 py-2.5",
							onSelect: () => {
								markRead(item.id);
								if (item.href) router.history.push(item.href);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex w-full items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: item.title
									}), !item.read ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-primary" }) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: item.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: formatDateTime(item.time)
								})
							]
						}, item.id))
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden text-left sm:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-medium leading-tight",
								children: name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: "Admin"
							})]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					className: "w-52",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Akun" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onSelect: () => void navigate({ to: "/pengaturan" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-4" }), "Profil"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onSelect: () => void navigate({ to: "/pengaturan" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" }), "Pengaturan"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onSelect: handleLogout,
							className: "text-danger",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Keluar"]
						})
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			open: mobileOpen,
			onOpenChange: setMobileOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
				side: "left",
				className: "p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
					className: "sr-only",
					children: "Menu navigasi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNav, { onNavigate: () => setMobileOpen(false) })]
			})
		})]
	});
}
function SplashScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, { className: "size-12" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-navy",
				children: "BUMDes Desa Wengkal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Memuat data aplikasi..."
			})
		]
	});
}
function AppShell({ children }) {
	const ready = useAppStore((s) => s.ready);
	const session = useAppStore((s) => s.session);
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (ready && !session) navigate({ to: "/login" });
	}, [
		ready,
		session,
		navigate
	]);
	if (!ready || !session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopSidebar, { collapsed }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, { onToggleCollapse: () => setCollapsed((v) => !v) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 px-4 py-6 lg:px-8",
				children
			})]
		})]
	});
}
//#endregion
export { SplashScreen as n, AppShell as t };
