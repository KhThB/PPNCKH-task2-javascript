import { i as __toESM } from "../_runtime.mjs";
import { t as imageAudit } from "./image-audit-BBKyeP_8.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shell, t as PageIntro } from "./Shell-CMozzCez.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-luong-Cnswh1Sx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Quality() {
	const [showB, setShowB] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "Kiểm tra bằng mắt",
			title: "Cùng một khung crop",
			lede: "Bản A là JPEG 2400 bị trình duyệt thu nhỏ. Bản B trong ô này là đúng file AVIF mà máy tính DPR 1 sẽ chọn, không phải file điện thoại. Bấm để đổi bản."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setShowB((value) => !value),
			className: "mt-6 min-h-11 border border-ink px-4 text-sm",
			children: [
				"Đang xem ",
				showB ? "bản B" : "bản A",
				" — bấm để đổi"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-8 md:grid-cols-2",
			children: imageAudit.images.map((image) => {
				const chosen = image.delivery.desktop1.avif;
				const src = showB ? chosen.path : image.versionA.path;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "frame frame-photo",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: image.alt
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
					className: "mt-3 text-sm leading-relaxed",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-ink",
							children: image.place
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								" ",
								"· ",
								showB ? `AVIF ${chosen.width}px` : `JPEG ${image.versionA.width}px`,
								" · PSNR B",
								" ",
								image.quality.psnrAvif,
								" dB · PSNR A cùng cỡ ",
								image.quality.psnrControl,
								" dB"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-muted",
							children: image.alt
						})
					]
				})] }, image.id);
			})
		})
	] });
}
//#endregion
export { Quality as component };
