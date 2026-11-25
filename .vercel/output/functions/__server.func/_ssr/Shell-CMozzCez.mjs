import { S as require_jsx_runtime, b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Shell-CMozzCez.js
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [
	{
		to: "/",
		label: "Phiếu bàn giao"
	},
	{
		to: "/ly-thuyet",
		label: "Cơ sở lý thuyết"
	},
	{
		to: "/phuong-phap",
		label: "Phương pháp"
	},
	{
		to: "/nhat-ky",
		label: "Nhật ký kỹ thuật"
	},
	{
		to: "/du-lieu",
		label: "Bảng dung lượng"
	},
	{
		to: "/phan-tich",
		label: "Phân tích"
	},
	{
		to: "/chat-luong",
		label: "Chất lượng ảnh"
	}
];
function Shell({ children }) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "no-print border-b border-line bg-sheet",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-serif text-xl",
						children: "Phố & Biển"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Thành viên 1 · Tối ưu hình ảnh"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-2 overflow-x-auto pb-1",
					"aria-label": "Hồ sơ",
					children: LINKS.map((link) => {
						const active = pathname === link.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							className: active ? "shrink-0 border border-ink bg-ink px-3 py-2 text-sm text-paper" : "shrink-0 border border-line px-3 py-2 text-sm text-ink",
							children: link.label
						}, link.to);
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12",
			children
		})]
	});
}
function PageIntro({ kicker, title, lede }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-lacquer",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl leading-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg leading-relaxed text-muted",
				children: lede
			})
		]
	});
}
//#endregion
export { Shell as n, PageIntro as t };
