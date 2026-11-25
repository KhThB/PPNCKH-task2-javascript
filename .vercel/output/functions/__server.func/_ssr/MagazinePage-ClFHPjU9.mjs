import { i as __toESM } from "../_runtime.mjs";
import { t as imageAudit } from "./image-audit-BBKyeP_8.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MagazinePage-ClFHPjU9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LabImage({ image, variant }) {
	if (variant === "a") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: image.versionA.path,
		alt: image.alt
	});
	const avif = image.versionB.avif.map((item) => `${item.path} ${item.width}w`).join(", ");
	const webp = image.versionB.webp.map((item) => `${item.path} ${item.width}w`).join(", ");
	const hero = image.slot === "hero";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("picture", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
			type: "image/avif",
			srcSet: avif,
			sizes: image.sizes
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
			type: "image/webp",
			srcSet: webp,
			sizes: image.sizes
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: image.versionB.fallback.path,
			alt: image.alt,
			width: image.versionA.width,
			height: image.versionA.height,
			loading: hero ? "eager" : "lazy",
			fetchPriority: hero ? "high" : void 0,
			decoding: hero ? "sync" : "async"
		})
	] });
}
function findImage(id) {
	const image = imageAudit.images.find((item) => item.id === id);
	if (!image) throw new Error(`Missing image ${id}`);
	return image;
}
var FILTERS = [
	"Tất cả",
	"Bắc",
	"Trung",
	"Nam"
];
function MagazinePage({ variant }) {
	const [region, setRegion] = (0, import_react.useState)("Tất cả");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const hero = findImage("hoian");
	const open = openId ? findImage(openId) : null;
	const avifPreload = (0, import_react.useMemo)(() => hero.versionB.avif.map((item) => `${item.path} ${item.width}w`).join(", "), [hero]);
	function visible(id) {
		if (region === "Tất cả") return true;
		return findImage(id).region === region;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink",
		children: [
			variant === "b" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
				rel: "preload",
				as: "image",
				href: hero.versionB.avif[hero.versionB.avif.length - 1]?.path,
				imageSrcSet: avifPreload,
				imageSizes: hero.sizes,
				fetchPriority: "high",
				type: "image/avif"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { src: "/lab/legacy.js" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sheet-wrap flex flex-col gap-6 px-5 py-6 md:px-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-lacquer",
						children: variant === "a" ? "Phiên bản A · đối chứng" : "Phiên bản B · chỉ tối ưu hình ảnh"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-5xl leading-none tracking-tight",
						children: "Phố & Biển"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-sm text-sm leading-relaxed text-muted",
						children: "Tập san thí nghiệm số 01. Nội dung và mã JavaScript giống nhau ở cả hai bản. Khác nhau ở cách giao ảnh."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					role: "group",
					"aria-label": "Lọc địa danh",
					children: [FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setRegion(item),
						className: item === region ? "min-h-11 border border-ink bg-ink px-4 text-sm text-paper" : "min-h-11 border border-line bg-sheet px-4 text-sm text-ink",
						children: item
					}, item)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "ml-auto inline-flex min-h-11 items-center text-sm text-muted underline decoration-line underline-offset-4",
						children: "Hồ sơ bàn giao"
					})]
				})]
			}),
			visible("hoian") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "frame frame-wide block w-full",
				onClick: () => setOpenId("hoian"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabImage, {
					image: hero,
					variant
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sheet-wrap px-5 py-8 md:px-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-lacquer",
						children: "Hội An · Trung"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 max-w-3xl text-4xl leading-tight",
						children: hero.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-2xl text-lg leading-relaxed text-muted",
						children: "Ảnh này là ứng viên LCP: nó chiếm gần hết màn hình đầu tiên. Bản A giao một JPEG cạnh dài 2400 pixel cho mọi thiết bị. Bản B khai báo srcset, ưu tiên tải ảnh bìa và không gắn lazy cho riêng tấm này."
					})
				]
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "sheet-wrap story-grid px-5 pb-12 md:px-0",
				children: [visible("sapa") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Figure, {
					id: "sapa",
					variant,
					onOpen: setOpenId,
					aspect: "frame-photo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Caption, { id: "sapa" })] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8",
					children: [visible("halong") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Figure, {
						id: "halong",
						variant,
						onOpen: setOpenId,
						aspect: "frame-photo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Caption, { id: "halong" })] }) : null, visible("hue") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Figure, {
						id: "hue",
						variant,
						onOpen: setOpenId,
						aspect: "frame-photo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Caption, { id: "hue" })] }) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "sheet-wrap tile-grid px-5 pb-12 md:px-0",
				children: [
					"hanoi",
					"mekong",
					"saigon"
				].map((id) => visible(id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Figure, {
					id,
					variant,
					onOpen: setOpenId,
					aspect: "frame-photo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Caption, { id })] }, id) : null)
			}),
			visible("phuquoc") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "pb-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sheet-wrap px-5 md:px-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "frame frame-wide block w-full",
						onClick: () => setOpenId("phuquoc"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabImage, {
							image: findImage("phuquoc"),
							variant
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 max-w-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Caption, { id: "phuquoc" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 leading-relaxed",
							children: "Bốn phiên bản của đề tài phải giữ nguyên câu chữ và chức năng lọc, phóng ảnh. Bản D sau này lấy cách giao ảnh của bản B và phần JavaScript đã được thành viên 2 tối ưu. Đừng đo trang này sau khi đã bấm lọc — trạng thái mặc định mới là mốc."
						})]
					})]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-line bg-sheet",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sheet-wrap px-5 py-8 text-sm leading-relaxed text-muted md:px-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-ink",
						children: "Nguồn ảnh"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: imageAudit.images.map((image) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							image.place,
							": ",
							image.source.artist,
							", ",
							image.source.license,
							".",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "underline",
								href: image.source.sourceUrl,
								children: image.source.title
							})
						] }, image.id))
					})]
				})
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-20 flex items-center justify-center bg-ink/90 p-4",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": open.alt,
				onClick: () => setOpenId(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute top-4 right-4 z-10 min-h-11 border border-paper px-4 text-sm text-paper",
					onClick: () => setOpenId(null),
					children: "Đóng"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: variant === "a" ? open.versionA.path : open.versionB.avif[open.versionB.avif.length - 1]?.path,
					alt: open.alt,
					className: "lightbox-photo relative",
					onClick: (event) => event.stopPropagation()
				})]
			}) : null
		]
	});
}
function Figure({ id, variant, onOpen, aspect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: `frame ${aspect} block w-full`,
		onClick: () => onOpen(id),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabImage, {
			image: findImage(id),
			variant
		})
	});
}
function Caption({ id }) {
	const image = findImage(id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-lacquer",
			children: [
				image.place,
				" · ",
				image.region
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-1 text-2xl leading-snug",
			children: image.title
		})]
	});
}
//#endregion
export { MagazinePage as t };
