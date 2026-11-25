import { t as imageAudit } from "./image-audit-BBKyeP_8.mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shell, t as PageIntro } from "./Shell-CMozzCez.mjs";
import { n as formatPct, r as reductionPct, t as formatBytes } from "./format-BXgGdvup.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/phan-tich-D0vpIv07.js
var import_jsx_runtime = require_jsx_runtime();
function Analysis() {
	const desk = imageAudit.totals.desktop1;
	const desk2 = imageAudit.totals.desktop2;
	const phone = imageAudit.totals.mobile2;
	const ab = imageAudit.ablationTotals;
	const weakest = [...imageAudit.images].sort((a, b) => a.quality.psnrAvif - b.quality.psnrAvif)[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
		kicker: "Phân tích của thành viên 1",
		title: "Ảnh nhẹ đi rõ. Thời gian tải chưa được kết luận.",
		lede: "Phần này chỉ nói những gì byte và PSNR nâng được. Câu về LCP, FCP, CLS, TBT để trống cho số đo của thành viên 3."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 max-w-3xl space-y-4 leading-relaxed",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Ở máy tính 1440 CSS px, DPR 1, tổng ảnh cả trang từ ",
				formatBytes(desk.allImages.a),
				" xuống",
				" ",
				formatBytes(desk.allImages.avif),
				" nếu trình duyệt lấy AVIF, mức giảm",
				" ",
				formatPct(desk.allImages.avifReductionPct),
				". WebP giảm",
				" ",
				formatPct(desk.allImages.webpReductionPct),
				". Ảnh bìa, thứ nhiều khả năng thành LCP, từ",
				" ",
				formatBytes(desk.hero.a),
				" xuống ",
				formatBytes(desk.hero.avif),
				" (",
				formatPct(desk.hero.avifReductionPct),
				"), bề rộng file ",
				desk.hero.avifWidth,
				" px."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"DPR 2 trên cùng bề rộng CSS làm mức giảm cả trang còn",
				" ",
				formatPct(desk2.allImages.avifReductionPct),
				" (",
				formatBytes(desk2.allImages.a),
				" xuống",
				" ",
				formatBytes(desk2.allImages.avif),
				"). Điện thoại 390 px DPR 2 giảm",
				" ",
				formatPct(phone.allImages.avifReductionPct),
				". Viết một mức giảm duy nhất sẽ che mất việc màn sắc nét xin nhiều pixel hơn. Báo cáo nên có cả ba dòng, rồi dòng nào trùng môi trường đo của nhóm thì lấy dòng đó đối chiếu với thành viên 3."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Tách trên file, vẫn ở bậc pixel của máy tính DPR 1: chỉ đổi sang WebP mà giữ số pixel của bản A giảm ",
				formatPct(reductionPct(ab.controlJpeg2400, ab.formatOnlyWebp)),
				"; chỉ thu nhỏ JPEG giảm ",
				formatPct(reductionPct(ab.controlJpeg2400, ab.resizeOnlyJpeg)),
				"; thu nhỏ rồi nén AVIF giảm ",
				formatPct(reductionPct(ab.controlJpeg2400, ab.resizeAndAvif)),
				". Thu nhỏ và đổi định dạng đều có phần, làm cả hai thì byte thấp hơn từng cách. Đây chưa phải đóng góp lên đồng hồ LCP. Đề cương nói đúng: muốn tách từng kỹ thuật trên thời gian tải thì phải có thêm lượt thử."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"PSNR trung bình của AVIF là ",
				imageAudit.meanPsnr.avif,
				" dB và của WebP là",
				" ",
				imageAudit.meanPsnr.webp,
				" dB. JPEG bản A, khi thu về cùng bề rộng, đạt",
				" ",
				imageAudit.meanPsnr.control,
				" dB. Khoảng cách này không phải lỗi đo: bản A nén ở 2400 px rồi để trình duyệt thu nhỏ, nên lỗi nén bị làm mờ trước khi vào mắt; bản B nén đúng số pixel sẽ vẽ. Thấp nhất là ",
				weakest.place,
				" ở ",
				weakest.quality.psnrAvif,
				" dB, trong khi bản A cùng cỡ của ảnh đó là ",
				weakest.quality.psnrControl,
				" dB. Nhìn trang chất lượng trước khi viết rằng hai bản không khác. Không lấy 40 dB làm điều kiện đạt với ảnh nhiều chi tiết."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Kỳ vọng có căn cứ, chưa phải kết quả: LCP có lý do để giảm vì ứng viên là ảnh bìa và ảnh đó nhẹ hơn, lại được ưu tiên. FCP có thể ít đổi hơn nếu chữ của tiêu đề vẽ trước. CLS có thể sát nhau vì khung crop chung. TBT không thuộc giải thích của phần ảnh. Tổng byte cả trang sẽ giảm ít hơn tổng byte ảnh, vì script, font và CSS đứng yên — kết luận cần tách hai mẫu số." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Hạn chế của riêng phần này: một thể loại trang, toàn ảnh chụp, một cặp chất lượng AVIF",
				" ",
				imageAudit.pipeline.avifQuality,
				" và WebP ",
				imageAudit.pipeline.webpQuality,
				", ước lượng sizes chưa thay cho cột Network của máy đo chính thức. File nguồn Commons nặng hơn mốc A nhiều; khoản đó là khảo sát, không cộng vào mức giảm báo cáo."
			] })
		]
	})] });
}
//#endregion
export { Analysis as component };
