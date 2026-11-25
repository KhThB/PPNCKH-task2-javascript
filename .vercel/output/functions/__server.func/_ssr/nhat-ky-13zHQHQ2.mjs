import { t as imageAudit } from "./image-audit-BBKyeP_8.mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shell, t as PageIntro } from "./Shell-CMozzCez.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nhat-ky-13zHQHQ2.js
var import_jsx_runtime = require_jsx_runtime();
var ROWS = [
	[
		"1",
		"Chốt vật thí nghiệm: một trang, tám ảnh, nội dung dùng chung cho A–D",
		"A và B",
		"Thiết kế"
	],
	[
		"2",
		"Kiểm kê file Wikimedia: kích thước điểm ảnh và dung lượng nguồn",
		"Nguồn",
		"Khảo sát"
	],
	[
		"3",
		`Xuất mốc A: JPEG ${imageAudit.pipeline.jpegQuality}, cạnh dài ${imageAudit.pipeline.longEdgeControl}px, một file cho mọi vị trí`,
		"A",
		"Mốc đối chứng"
	],
	[
		"4",
		`Xuất thang ${imageAudit.pipeline.widths.join("/")} px, WebP q${imageAudit.pipeline.webpQuality}, AVIF q${imageAudit.pipeline.avifQuality}, JPEG dự phòng`,
		"B",
		"Nén và đúng kích thước"
	],
	[
		"5",
		"Gắn picture và sizes khớp lưới 46rem / 22rem / 23rem / 72rem",
		"B",
		"Responsive"
	],
	[
		"6",
		"Lazy trừ ảnh bìa; fetchpriority và preload AVIF cho ảnh bìa",
		"B",
		"Ưu tiên LCP"
	],
	[
		"7",
		"Thêm width và height ở bản B; khóa crop bằng khung dùng chung",
		"B",
		"CLS và so mắt"
	],
	[
		"8",
		"Giữ legacy.js, bộ lọc và hộp xem ảnh y nguyên",
		"A và B",
		"Không đụng JavaScript"
	],
	[
		"9",
		"Lập bảng byte ba kịch bản, phân rã kỹ thuật, PSNR",
		"Hồ sơ",
		"Kết quả phần ảnh"
	]
];
function Log() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "Nhật ký",
			title: "Việc đã áp vào mã, theo thứ tự",
			lede: "Mỗi dòng là một thay đổi có chủ đích. Người phụ trách cột kỹ thuật ảnh là thành viên 1. Không ghi ngày giả cho những tuần nhóm chưa chạy."
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
							children: "Bước"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Việc"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Bản"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-medium",
							children: "Kỹ thuật"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: ROWS.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-t border-line align-top",
					children: row.map((cell) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-3 leading-relaxed",
						children: cell
					}, cell))
				}, row[0])) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-6 max-w-3xl leading-relaxed text-muted",
			children: [
				"Pipeline ghi trong dữ liệu: ",
				imageAudit.pipeline.tool,
				". Bản D sau này không cần xuất lại ảnh nếu lấy nguyên thư mục /lab/b và nhánh picture của bản B."
			]
		})
	] });
}
//#endregion
export { Log as component };
