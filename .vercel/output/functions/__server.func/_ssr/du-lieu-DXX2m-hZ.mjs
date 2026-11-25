import { i as __toESM } from "../_runtime.mjs";
import { t as imageAudit } from "./image-audit-BBKyeP_8.mjs";
import { J as require_react, S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shell, t as PageIntro } from "./Shell-CMozzCez.mjs";
import { n as formatPct, r as reductionPct, t as formatBytes } from "./format-BXgGdvup.mjs";
import { a as Bar, c as Legend, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/du-lieu-DXX2m-hZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DataPage() {
	const [scenario, setScenario] = (0, import_react.useState)("desktop1");
	const current = imageAudit.totals[scenario];
	const ab = imageAudit.ablationTotals;
	const perImage = imageAudit.images.map((image) => {
		const slot = image.delivery[scenario];
		return {
			place: image.place,
			a: Math.round(slot.aBytes / 1024),
			b: Math.round(slot.avif.bytes / 1024)
		};
	});
	const ablation = [
		{
			name: "JPEG 2400",
			kb: Math.round(ab.controlJpeg2400 / 1024)
		},
		{
			name: "Chỉ WebP",
			kb: Math.round(ab.formatOnlyWebp / 1024)
		},
		{
			name: "Chỉ thu nhỏ",
			kb: Math.round(ab.resizeOnlyJpeg / 1024)
		},
		{
			name: "WebP đúng cỡ",
			kb: Math.round(ab.resizeAndWebp / 1024)
		},
		{
			name: "AVIF đúng cỡ",
			kb: Math.round(ab.resizeAndAvif / 1024)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "Số liệu phần ảnh",
			title: "Byte trước và sau, không quy về một điểm",
			lede: "Ước lượng theo sizes và DPR. Tổng là lúc cuộn hết trang. Mức giảm = (A − B) / A."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 flex flex-wrap gap-2",
			role: "group",
			"aria-label": "Kịch bản màn hình",
			children: imageAudit.scenarios.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setScenario(item.id),
				className: scenario === item.id ? "min-h-11 border border-ink bg-ink px-3 text-sm text-paper" : "min-h-11 border border-line px-3 text-sm",
				children: item.label
			}, item.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
					label: "Cả trang, bản A",
					value: formatBytes(current.allImages.a)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
					label: "Cả trang, AVIF",
					value: formatBytes(current.allImages.avif)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
					label: "Mức giảm AVIF",
					value: formatPct(current.allImages.avifReductionPct)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 h-80 border border-line bg-sheet p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data: perImage,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "#e3dcd0",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "place",
							stroke: "#6b645a",
							fontSize: 12
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							stroke: "#6b645a",
							fontSize: 12,
							unit: " KB"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "a",
							name: "Bản A (KB)",
							fill: "#1c1915"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "b",
							name: "AVIF (KB)",
							fill: "#8f2d1c"
						})
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 overflow-x-auto border border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "wide-table w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-sheet text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Ảnh"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Vai trò"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Nguồn"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Bản A"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "AVIF chọn"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "WebP chọn"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Giảm AVIF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "PSNR B"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "PSNR A cùng cỡ"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: imageAudit.images.map((image) => {
					const slot = image.delivery[scenario];
					const cut = reductionPct(slot.aBytes, slot.avif.bytes);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: image.place
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 text-muted",
								children: image.role
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-3 py-3",
								children: formatBytes(image.source.bytes)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-3 py-3",
								children: formatBytes(slot.aBytes)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "num px-3 py-3",
								children: [formatBytes(slot.avif.bytes), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [
										" · ",
										slot.avif.width,
										"px"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-3 py-3",
								children: formatBytes(slot.webp.bytes)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-3 py-3 text-lacquer",
								children: formatPct(cut)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "num px-3 py-3",
								children: [image.quality.psnrAvif, " dB"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "num px-3 py-3",
								children: [image.quality.psnrControl, " dB"]
							})
						]
					}, image.id);
				}) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-12 text-2xl",
			children: "Tách kỹ thuật trên dung lượng file"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-3xl leading-relaxed text-muted",
			children: "Mốc là máy tính DPR 1. “Chỉ WebP” giữ nguyên số pixel của bản A. “Chỉ thu nhỏ” vẫn là JPEG cùng chất lượng, nhưng đúng bề rộng mà bản B sẽ chọn. Không đổi các con số này thành mili-giây."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 h-72 border border-line bg-sheet p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data: ablation,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "#e3dcd0",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "name",
							stroke: "#6b645a",
							fontSize: 12
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							stroke: "#6b645a",
							fontSize: 12,
							unit: " KB"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "kb",
							name: "Tổng KB",
							fill: "#8f2d1c"
						})
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "num mt-4 max-w-3xl space-y-2 text-sm leading-relaxed",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["JPEG 2400: ", formatBytes(ab.controlJpeg2400)] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					"Chỉ đổi WebP: ",
					formatBytes(ab.formatOnlyWebp),
					" (",
					formatPct(reductionPct(ab.controlJpeg2400, ab.formatOnlyWebp)),
					")"
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					"Chỉ thu nhỏ JPEG: ",
					formatBytes(ab.resizeOnlyJpeg),
					" (",
					formatPct(reductionPct(ab.controlJpeg2400, ab.resizeOnlyJpeg)),
					")"
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					"Thu nhỏ và WebP: ",
					formatBytes(ab.resizeAndWebp),
					" (",
					formatPct(reductionPct(ab.controlJpeg2400, ab.resizeAndWebp)),
					")"
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					"Thu nhỏ và AVIF: ",
					formatBytes(ab.resizeAndAvif),
					" (",
					formatPct(reductionPct(ab.controlJpeg2400, ab.resizeAndAvif)),
					")"
				] })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProbeNote, {})
	] });
}
function Mini({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-line bg-sheet p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "num mt-2 font-serif text-3xl",
			children: value
		})]
	});
}
function ProbeNote() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-10 max-w-3xl leading-relaxed text-muted",
		children: "Chưa có trace mạng của trình duyệt. Bảng trên là byte file sẽ được chọn nếu sizes và DPR đúng như kịch bản. Thành viên 3 đối chiếu bằng cột Network, cache tắt."
	});
}
//#endregion
export { DataPage as component };
