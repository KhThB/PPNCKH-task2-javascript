import { i as __toESM } from "../_runtime.mjs";
import { t as imageAudit } from "./image-audit-BBKyeP_8.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Shell, t as PageIntro } from "./Shell-CMozzCez.mjs";
import { n as formatPct, t as formatBytes } from "./format-BXgGdvup.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DArNxyXf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function buildReport(memberName) {
	const name = memberName.trim() || "................................................................";
	const desk = imageAudit.totals.desktop1;
	const desk2 = imageAudit.totals.desktop2;
	const phone = imageAudit.totals.mobile2;
	const ab = imageAudit.ablationTotals;
	const lines = [];
	lines.push(`# Phần thành viên 1 — Tối ưu hình ảnh`);
	lines.push("");
	lines.push(`**Đề tài:** Đánh giá ảnh hưởng của tối ưu hình ảnh và JavaScript đến hiệu năng tải trang website`);
	lines.push("");
	lines.push(`**Họ và tên:** ${name}`);
	lines.push("");
	lines.push(`**Vai trò:** Thành viên 1, phụ trách tối ưu hình ảnh (phiên bản B).`);
	lines.push("");
	lines.push(`**Website thí nghiệm:** ${imageAudit.subject} — trang tạp chí một màn, tám ảnh, cùng nội dung và cùng JavaScript ở bản A và bản B.`);
	lines.push("");
	lines.push(`## 1. Tóm tắt bàn giao`);
	lines.push("");
	lines.push(`- Mã phiên bản B nằm ở trang \`/lab/b\`. Bản đối chứng A ở \`/lab/a\`. Khác biệt duy nhất là component giao ảnh.`);
	lines.push(`- Mốc A không phải file máy ảnh gốc (vài MB đến hơn 8 MB). Mốc A là JPEG cạnh dài 2400 px, chất lượng ${imageAudit.pipeline.jpegQuality}, mozjpeg — kiểu xuất “đưa lên web” nhưng chưa responsive. Dùng file máy ảnh thô làm mốc sẽ phóng đại mức giảm.`);
	lines.push(`- Máy tính 1440 CSS px, DPR 1, trình duyệt chọn AVIF: tổng ảnh cả trang ${formatBytes(desk.allImages.a)} → ${formatBytes(desk.allImages.avif)} (${formatPct(desk.allImages.avifReductionPct)}). Ảnh bìa (LCP) ${formatBytes(desk.hero.a)} → ${formatBytes(desk.hero.avif)} (${formatPct(desk.hero.avifReductionPct)}).`);
	lines.push(`- Cùng máy tính nhưng DPR 2: tổng ảnh ${formatBytes(desk2.allImages.a)} → ${formatBytes(desk2.allImages.avif)} (${formatPct(desk2.allImages.avifReductionPct)}). Mức giảm nhỏ hơn vì trình duyệt xin tệp rộng hơn.`);
	lines.push(`- Điện thoại 390 CSS px, DPR 2: tổng ảnh ${formatBytes(phone.allImages.a)} → ${formatBytes(phone.allImages.avif)} (${formatPct(phone.allImages.avifReductionPct)}).`);
	lines.push(`- PSNR trung bình so với ảnh gốc, tại bề rộng ứng viên DPR 1: AVIF ${imageAudit.meanPsnr.avif} dB, WebP ${imageAudit.meanPsnr.webp} dB. JPEG bản A khi bị thu về cùng bề rộng đạt ${imageAudit.meanPsnr.control} dB. Bản A được hưởng việc thu nhỏ từ file lớn, nên PSNR của A không phải là PSNR của file 2400 px nhìn gần.`);
	lines.push(`- Chưa đo LCP, FCP, CLS, TBT theo quy trình 5 lần. Đó là phần thành viên 3. Không lấy số thời gian ở hồ sơ này làm kết quả chính thức.`);
	lines.push("");
	lines.push(`## 2. Cơ sở lý thuyết`);
	lines.push("");
	lines.push(`Hình ảnh vẫn là nhóm byte lớn trên trang phổ thông. Web Almanac 2024 (HTTP Archive, số tháng 10/2024) ghi trang desktop trung vị nặng 2.652 KB, trong đó ảnh khoảng 1.054 KB; mobile trung vị 2.311 KB trang và khoảng 900 KB ảnh. Trang càng lệch về ảnh thì tối ưu ảnh càng có cửa làm đổi LCP và tổng dung lượng tải, trong khi JavaScript nghiêng về TBT và thời gian thực thi. Vì vậy đề tài tách bản B (chỉ ảnh) và bản C (chỉ JavaScript).`);
	lines.push("");
	lines.push(`Định dạng hiện đại giảm bit trên mỗi điểm ảnh. Cùng chương Media của Almanac 2024, trung vị mobile khoảng 2,0 bit/pixel với JPEG, 1,4 với AVIF và 1,3 với WebP. WebP và AVIF không tự nhiên “nhẹ hơn mọi JPEG”: một JPEG đã thu nhỏ đúng kích thước hiển thị có thể nhẹ hơn một AVIF còn để nguyên kích thước máy ảnh. Phải nói cả hai việc: số pixel và cách nén.`);
	lines.push("");
	lines.push(`Ảnh responsive (\`srcset\` + \`sizes\` + \`<picture>\`) để trình duyệt chọn một tệp gần với số pixel thật sự được vẽ, có tính DPR. \`sizes\` sai thì trình duyệt chọn sai và bảng byte trở thành ước lượng đẹp trên giấy. Ảnh dưới nếp gấp dùng \`loading="lazy"\`. Ảnh ứng viên LCP không được lazy: thuộc tính này trì hoãn yêu cầu cho đến khi trình duyệt tính layout. Với ảnh bìa, thêm \`fetchpriority="high"\` và \`preload\` đúng \`imagesrcset\` để yêu cầu xuất hiện sớm, cùng kiểu với phần tử \`<img>\` — preload lệch URL sẽ tải hai lần.`);
	lines.push("");
	lines.push(`\`width\` và \`height\` giúp trình duyệt giữ tỉ lệ trước khi tệp về, giảm nguy cơ CLS. Trên template này cả hai bản đã có khung \`aspect-ratio\` dùng chung để so chất lượng hiển thị cho công bằng, nên CLS có thể lệch ít. Thành viên 3 vẫn nên đo, và không kết luận “tối ưu ảnh luôn sửa CLS” từ riêng template này.`);
	lines.push("");
	lines.push(`Công thức của nhóm, với chỉ số càng thấp càng tốt và mốc A khác 0: mức giảm (%) = (A − bản tối ưu) / A × 100%.`);
	lines.push("");
	lines.push(`Khi nhiều kỹ thuật đi cùng nhau, con số của bản B là tác động của cả nhóm biện pháp ảnh, không phải của từng kỹ thuật. Muốn tách đóng góp lên LCP phải đo thêm từng bước. Hồ sơ này chỉ tách được trên dung lượng tệp (JPEG gốc trang, chỉ đổi WebP, chỉ thu nhỏ JPEG, thu nhỏ kèm AVIF/WebP).`);
	lines.push("");
	lines.push(`## 3. Phương pháp`);
	lines.push("");
	lines.push(`Đối tượng là một trang tạp chí dựng cho thí nghiệm, không phải một website thương mại có sẵn. Trang có tám ảnh chụp (Hội An, Sa Pa, Hạ Long, Huế, Hà Nội, Cần Thơ, Sài Gòn, Phú Quốc), chữ và chức năng lọc vùng miền, hộp xem ảnh. Ảnh lấy từ Wikimedia Commons, ghi tác giả và giấy phép ở chân trang.`);
	lines.push("");
	lines.push(`Ảnh gốc khảo sát là file Commons, từ khoảng 1,7 MB đến hơn 8 MB, cạnh dài từ 2766 đến 5184 px. Đó là hiện trạng “tải từ máy ảnh / thư viện”, chưa phải hiện trạng một trang web tối thiểu biết xuất JPEG. Phiên bản A cố ý dừng ở bước xuất web thô: cạnh dài 2400 px, JPEG chất lượng ${imageAudit.pipeline.jpegQuality}, một URL cho mọi chỗ nhúng, không \`srcset\`, không \`width/height\`, không lazy, không ưu tiên ảnh bìa. Phiên bản B giữ nguyên crop hiển thị và nội dung, đổi cách giao file.`);
	lines.push("");
	lines.push(`Thang kích thước bản B: ${imageAudit.pipeline.widths.join(", ")} px. WebP chất lượng ${imageAudit.pipeline.webpQuality}. AVIF chất lượng ${imageAudit.pipeline.avifQuality}. JPEG dự phòng rộng nhất 1200 px, chất lượng 78, cho trình duyệt không dùng được source hiện đại. \`sizes\` viết khớp lưới thật của trang ở ngưỡng 1200 px (cột 46rem, 22rem, 23rem, ảnh khép 72rem; dưới ngưỡng đó ảnh đầy chiều rộng cửa sổ).`);
	lines.push("");
	lines.push(`Ba kịch bản ước lượng byte, giả định trình duyệt hỗ trợ AVIF và tôn trọng \`sizes\`: máy tính 1440 CSS px DPR 1, cùng máy DPR 2, điện thoại 390 CSS px DPR 2. Byte báo cáo là tổng khi người đọc cuộn hết trang. Lazy loading không được cộng vào con số này, vì ngưỡng tải sớm của Chrome đổi theo mạng; trên mạng nhanh, ảnh dưới nếp gấp vẫn có thể bị tải. Lazy vẫn là kỹ thuật đúng và được gắn cho mọi ảnh trừ ảnh bìa. Cận dưới của lần tải đầu, nếu trình duyệt chỉ lấy ảnh trong khung nhìn, là byte của riêng ảnh bìa — ghi như một cận, không phải trace mạng.`);
	lines.push("");
	lines.push(`Chất lượng: PSNR giữa ảnh gốc thu nhỏ và file AVIF/WebP tại đúng bề rộng ứng viên của máy tính DPR 1, cộng với xem bằng mắt trong cùng khung crop. Ngưỡng tham khảo: trên khoảng 40 dB là rất sát; 32–40 dB thường chấp nhận được với ảnh báo. PSNR không thay cho mắt.`);
	lines.push("");
	lines.push(`Những thứ cố ý không đổi, để bản B chỉ phản ánh ảnh: câu chữ, thứ tự khối, lọc vùng, hộp xem ảnh, CSS khung, và tệp \`/lab/legacy.js\` (không minify, còn hàm không dùng). Khung React của ứng dụng cũng giống nhau. Chênh LCP giữa A và B vì vậy không được diễn giải thành kết quả JavaScript.`);
	lines.push("");
	lines.push(`## 4. Nhật ký kỹ thuật`);
	lines.push("");
	lines.push(`| Bước | Việc | Phiên bản | Kỹ thuật | Người |`);
	lines.push(`| --- | --- | --- | --- | --- |`);
	lines.push(`| 1 | Chọn trang tạp chí 8 ảnh làm vật thí nghiệm, chốt nội dung dùng chung | A và B | Thiết kế thí nghiệm | Thành viên 1, để cả nhóm dùng |`);
	lines.push(`| 2 | Khảo sát byte và kích thước file nguồn Wikimedia | Nguồn | Kiểm kê | Thành viên 1 |`);
	lines.push(`| 3 | Xuất JPEG 2400 px, q${imageAudit.pipeline.jpegQuality}, một file mọi slot | A | Mốc đối chứng có chủ đích | Thành viên 1 |`);
	lines.push(`| 4 | Xuất AVIF/WebP theo thang bề rộng, JPEG dự phòng | B | Nén và đúng kích thước | Thành viên 1 |`);
	lines.push(`| 5 | \`picture\` + \`sizes\` khớp lưới | B | Ảnh responsive | Thành viên 1 |`);
	lines.push(`| 6 | Lazy mọi ảnh trừ bìa; \`fetchpriority=high\` và preload AVIF cho bìa | B | Ưu tiên LCP | Thành viên 1 |`);
	lines.push(`| 7 | \`width\`/\`height\` trên ảnh B; khung crop dùng chung | B | Giảm rủi ro CLS, giữ so sánh công bằng | Thành viên 1 |`);
	lines.push(`| 8 | Giữ \`legacy.js\` và hành vi lọc, phóng ảnh | A và B | Không đụng JavaScript | Thành viên 1 |`);
	lines.push(`| 9 | Tính byte theo ba kịch bản DPR, phân rã kỹ thuật trên file, PSNR | Hồ sơ | Đo dung lượng, không đo thay thành viên 3 | Thành viên 1 |`);
	lines.push("");
	lines.push(`## 5. Bảng dung lượng`);
	lines.push("");
	lines.push(`Công thức: mức giảm = (byte A − byte bản B) / byte A × 100%.`);
	lines.push("");
	lines.push(`### 5.1. Từng ảnh, máy tính DPR 1, ứng viên AVIF`);
	lines.push("");
	lines.push(`| Ảnh | Vai trò | Nguồn | Bản A | AVIF | WebP | Giảm AVIF | PSNR AVIF | PSNR của A cùng cỡ |`);
	lines.push(`| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |`);
	for (const image of imageAudit.images) {
		const d = image.delivery.desktop1;
		const cut = (d.aBytes - d.avif.bytes) / d.aBytes * 100;
		lines.push(`| ${image.place} | ${image.role} | ${formatBytes(image.source.bytes)} | ${formatBytes(d.aBytes)} | ${formatBytes(d.avif.bytes)} (${d.avif.width}px) | ${formatBytes(d.webp.bytes)} | ${formatPct(cut)} | ${image.quality.psnrAvif} dB | ${image.quality.psnrControl} dB |`);
	}
	lines.push(`| **Cả trang** | | | **${formatBytes(desk.allImages.a)}** | **${formatBytes(desk.allImages.avif)}** | **${formatBytes(desk.allImages.webp)}** | **${formatPct(desk.allImages.avifReductionPct)}** | **${imageAudit.meanPsnr.avif} dB** | **${imageAudit.meanPsnr.control} dB** |`);
	lines.push("");
	lines.push(`### 5.2. Ba kịch bản, tổng ảnh cả trang`);
	lines.push("");
	lines.push(`| Kịch bản | Bản A | AVIF | Giảm AVIF | WebP | Giảm WebP | Ảnh bìa A → AVIF |`);
	lines.push(`| --- | ---: | ---: | ---: | ---: | ---: | --- |`);
	for (const key of [
		"desktop1",
		"desktop2",
		"mobile2"
	]) {
		const row = imageAudit.totals[key];
		lines.push(`| ${row.label} | ${formatBytes(row.allImages.a)} | ${formatBytes(row.allImages.avif)} | ${formatPct(row.allImages.avifReductionPct)} | ${formatBytes(row.allImages.webp)} | ${formatPct(row.allImages.webpReductionPct)} | ${formatBytes(row.hero.a)} → ${formatBytes(row.hero.avif)} (${formatPct(row.hero.avifReductionPct)}) |`);
	}
	lines.push("");
	lines.push(`### 5.3. Phân rã dung lượng tệp tại bề rộng máy tính DPR 1`);
	lines.push("");
	lines.push(`Đây là byte cộng lại của tám ảnh, không phải thời gian tải.`);
	lines.push("");
	lines.push(`| Cách làm | Tổng byte | Giảm so với A |`);
	lines.push(`| --- | ---: | ---: |`);
	lines.push(`| A — JPEG 2400 px | ${formatBytes(ab.controlJpeg2400)} | mốc |`);
	lines.push(`| Chỉ đổi định dạng (WebP, giữ số pixel của A) | ${formatBytes(ab.formatOnlyWebp)} | ${formatPct((ab.controlJpeg2400 - ab.formatOnlyWebp) / ab.controlJpeg2400 * 100)} |`);
	lines.push(`| Chỉ thu nhỏ (JPEG cùng chất lượng, đúng bề rộng ứng viên) | ${formatBytes(ab.resizeOnlyJpeg)} | ${formatPct((ab.controlJpeg2400 - ab.resizeOnlyJpeg) / ab.controlJpeg2400 * 100)} |`);
	lines.push(`| Thu nhỏ + WebP | ${formatBytes(ab.resizeAndWebp)} | ${formatPct((ab.controlJpeg2400 - ab.resizeAndWebp) / ab.controlJpeg2400 * 100)} |`);
	lines.push(`| Thu nhỏ + AVIF (file bản B sẽ gửi nếu có AVIF) | ${formatBytes(ab.resizeAndAvif)} | ${formatPct((ab.controlJpeg2400 - ab.resizeAndAvif) / ab.controlJpeg2400 * 100)} |`);
	lines.push("");
	lines.push(`## 6. Phân tích`);
	lines.push("");
	lines.push(`Trên cả ba kịch bản, bản B nhẹ hơn bản A. Mức giảm không phải một con số: DPR 2 trên máy tính xin ảnh rộng hơn nên phần được hưởng từ việc thu nhỏ ít lại, phần còn lại chủ yếu là định dạng. Điện thoại DPR 2 vẫn giảm mạnh vì bề rộng CSS nhỏ, ứng viên nằm ở bậc 480 hoặc 800 thay vì 2400. Ảnh bìa là tệp đáng kể nhất với LCP; các ảnh thẻ và ô thư viện ở bản A bị bắt tải nguyên JPEG 2400 dù chỉ vẽ vài trăm pixel.`);
	lines.push("");
	lines.push(`Bảng phân rã cho thấy thu nhỏ và đổi định dạng đều có phần. Làm một trong hai đã giảm byte; làm cả hai giảm hơn từng cách riêng. Không suy ra rằng mỗi cách đóng góp từng ấy mili-giây LCP. Muốn câu đó, thành viên 3 cần thêm lượt đo đổi từng kỹ thuật, đúng như phạm vi kết luận trong đề cương.`);
	lines.push("");
	const lowest = [...imageAudit.images].sort((a, b) => a.quality.psnrAvif - b.quality.psnrAvif)[0];
	lines.push(`PSNR trung bình của AVIF là ${imageAudit.meanPsnr.avif} dB, của WebP là ${imageAudit.meanPsnr.webp} dB, trong khi JPEG bản A thu về cùng bề rộng đạt ${imageAudit.meanPsnr.control} dB. Chênh này có thật: bản A nén ở 2400 px rồi để trình duyệt thu nhỏ, lỗi nén bị làm mờ; bản B nén đúng cỡ hiển thị nên mỗi lỗi nằm ngay trên bề mặt nhìn. Thấp nhất so với ảnh gốc là ${lowest.place} ở ${lowest.quality.psnrAvif} dB (bản A cùng cỡ: ${lowest.quality.psnrControl} dB). Nhìn ở trang chất lượng trước khi viết câu “mắt thường không thấy khác”. Không dùng mốc 40 dB như điều kiện đạt: ảnh ruộng và phố nhiều chi tiết hiếm khi còn mức đó sau một lần nén hợp lý.`);
	lines.push("");
	lines.push(`Kỳ vọng khi đo thời gian, không phải số đã đo: LCP nên nhích theo hướng có lợi chủ yếu vì ảnh bìa nhẹ hơn và được ưu tiên, không phải vì điểm Lighthouse tổng. FCP có thể đổi ít hơn LCP nếu chữ hiện trước ảnh. CLS có thể gần nhau vì khung crop dùng chung. TBT và thời gian thực thi JavaScript không nên được gán cho thành viên 1: mã script không đổi. Tổng dung lượng tải xuống sẽ giảm chủ yếu ở nhóm ảnh; phần HTML, CSS, font và JavaScript gần như giữ nguyên nên mức giảm của cả trang sẽ thấp hơn mức giảm của riêng nhóm ảnh. Khi viết kết luận, tách hai mẫu số này.`);
	lines.push("");
	lines.push(`Hạn chế: một trang; ảnh chủ yếu là ảnh chụp, không có biểu tượng trong suốt nên không đại diện cho bài toán PNG; ước lượng byte giả định \`sizes\` được trình duyệt hiểu đúng; AVIF chất lượng ${imageAudit.pipeline.avifQuality} và WebP ${imageAudit.pipeline.webpQuality} là một điểm trên thang, không phải điểm tối ưu duy nhất; sandbox này không thay mạng và máy đã chốt của cả nhóm.`);
	lines.push("");
	lines.push(`## 7. Kiểm tra chất lượng hiển thị`);
	lines.push("");
	lines.push(`Cùng tỉ lệ khung, \`object-fit: cover\`, cùng câu chữ. Việc cần nhìn: mặt người và biển hiệu không bị bệt màu, đường cong đèn lồng và gợn nước không thành vệt, đồ ăn không bị loang mảng. Phóng ảnh trong hộp xem dùng file rộng nhất của từng bản. Alt tiếng Việt có trên mọi ảnh.`);
	lines.push("");
	lines.push(`## 8. Việc nhờ nhóm trưởng điều phối`);
	lines.push("");
	lines.push(`- Thành viên 2 tối ưu JavaScript trên phần dùng chung, không thay file trong \`/lab/a\` và không sửa nhánh ảnh của bản A. Bản C = ảnh chưa tối ưu + JS đã tối ưu.`);
	lines.push(`- Bản D = nhánh ảnh của bản B + JS đã tối ưu. Khi tích hợp, giữ \`sizes\` và preload; đừng để bundler đổi ảnh bìa thành import không còn \`srcset\`.`);
	lines.push(`- Thành viên 3 đo \`/lab/a\` và \`/lab/b\` ở trạng thái mặc định (chưa bấm lọc), cache tắt, ít nhất 5 lần, luân phiên. Chỉ số: LCP, FCP, CLS, TBT, tổng byte tải xuống, byte ảnh, thời gian thực thi JS. Báo trung vị và độ biến động. So B với A theo công thức của nhóm. Đừng thay bảng này bằng một điểm hiệu năng tổng hợp.`);
	lines.push(`- Trước khi nộp, cả nhóm đối chiếu lại số trong bảng với file thật. Nếu quy trình đo chính thức khác ba kịch bản DPR ở trên, ghi rõ kịch bản nào là số của báo cáo.`);
	lines.push("");
	lines.push(`## 9. Tài liệu`);
	lines.push("");
	lines.push(`1. HTTP Archive. “Page Weight.” *Web Almanac 2024*. https://almanac.httparchive.org/en/2024/page-weight`);
	lines.push(`2. HTTP Archive. “Media.” *Web Almanac 2024*. https://almanac.httparchive.org/en/2024/media`);
	lines.push(`3. Chrome for Developers. “Optimize image priority.” https://developer.chrome.com/docs/modern-web-guidance/guides/performance/optimize-image-priority`);
	lines.push(`4. web.dev. “Preload responsive images.” https://web.dev/articles/preload-responsive-images`);
	lines.push(`5. Đề cương phân công của nhóm, mục thiết kế thực nghiệm và công thức mức giảm.`);
	lines.push("");
	lines.push(`Ảnh Wikimedia Commons được liệt kê cùng tác giả và giấy phép ở chân hai trang thí nghiệm.`);
	lines.push("");
	return lines.join("\n");
}
var KEY = "tv1-member-name";
function useMemberName() {
	const [name, setName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setName(window.localStorage.getItem(KEY) ?? "");
	}, []);
	function update(next) {
		setName(next);
		window.localStorage.setItem(KEY, next);
	}
	return [name, update];
}
function Home() {
	const [name, setName] = useMemberName();
	const desk = imageAudit.totals.desktop1;
	const phone = imageAudit.totals.mobile2;
	function download() {
		const blob = new Blob([buildReport(name)], { type: "text/markdown;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "thanh-vien-1-toi-uu-hinh-anh.md";
		link.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageIntro, {
			kicker: "Đề tài · hiệu năng tải trang",
			title: "Phiếu bàn giao phần hình ảnh",
			lede: "Thành viên 1 dựng phiên bản B: cùng nội dung, cùng JavaScript, chỉ đổi cách giao ảnh. Số dưới đây là dung lượng tệp đo từ file thật, không phải điểm Lighthouse."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-8 block max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: "Họ và tên thành viên 1"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: name,
				onChange: (event) => setName(event.target.value),
				placeholder: "Điền tên để in vào biên bản",
				className: "mt-2 w-full border border-line bg-sheet px-3 py-3 text-base outline-none focus:border-ink"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Tổng ảnh, máy tính DPR 1",
					value: formatPct(desk.allImages.avifReductionPct),
					note: `${formatBytes(desk.allImages.a)} → ${formatBytes(desk.allImages.avif)} AVIF`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Ảnh bìa (ứng viên LCP)",
					value: formatPct(desk.hero.avifReductionPct),
					note: `${formatBytes(desk.hero.a)} → ${formatBytes(desk.hero.avif)}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Điện thoại DPR 2, cả trang",
					value: formatPct(phone.allImages.avifReductionPct),
					note: `${formatBytes(phone.allImages.a)} → ${formatBytes(phone.allImages.avif)}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "PSNR trung bình AVIF",
					value: `${imageAudit.meanPsnr.avif} dB`,
					note: `WebP ${imageAudit.meanPsnr.webp} dB tại bề rộng hiển thị`
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 flex flex-wrap gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/lab/a",
					className: "inline-flex min-h-11 items-center bg-ink px-4 text-sm text-paper",
					children: "Mở phiên bản A"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/lab/b",
					className: "inline-flex min-h-11 items-center bg-lacquer px-4 text-sm text-paper",
					children: "Mở phiên bản B"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: download,
					className: "inline-flex min-h-11 items-center border border-ink px-4 text-sm",
					children: "Tải biên bản Markdown"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12 grid gap-10 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl",
				children: "Đã có trong gói này"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 space-y-3 leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Mã bản B và bản đối chứng A, cùng trang Phố & Biển." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Bảng byte từng ảnh, ba kịch bản màn hình, và bảng tách “chỉ thu nhỏ” với “chỉ đổi định dạng”." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Nhật ký kỹ thuật, cơ sở lý thuyết, phương pháp, phân tích và giới hạn." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "PSNR cộng trang so khung để nhìn chất lượng, không chỉ nhìn số." })
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl",
				children: "Chưa làm — đúng phần người khác"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 space-y-3 leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Không tối ưu JavaScript. Tệp legacy và khung React giống nhau ở A và B." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Không đo 5 lần LCP, FCP, CLS, TBT. Thành viên 3 đo trên A và B rồi mới có số thời gian chính thức." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Không ghép bản D. Bản D = ảnh của B + JavaScript sau khi thành viên 2 xong." })
				]
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12 border border-line bg-sheet p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl",
				children: "Nhờ nhóm trưởng"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-3xl leading-relaxed",
				children: "Giữ nguyên mốc A khi thành viên 2 làm bản C, để hai tác động không trộn vào nhau. Khi ghép D, đừng để bước đóng gói mã biến ảnh bìa thành một file không còn srcset. Đo ở trạng thái mặc định của trang, chưa bấm lọc vùng miền. Mức giảm của cả trang sẽ nhỏ hơn mức giảm của riêng nhóm ảnh, vì HTML, CSS, font và JavaScript không nằm trong phần này."
			})]
		})
	] });
}
function Stat({ label, value, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-line bg-sheet p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-sm text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "num mt-2 font-serif text-3xl text-lacquer",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "num mt-2 text-sm text-muted",
				children: note
			})
		]
	});
}
//#endregion
export { Home as component };
