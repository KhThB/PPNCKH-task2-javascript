# Task 3 — Phiên bản D và phép đo chính thức A, B, C, D

Đề tài: *Đánh giá ảnh hưởng của tối ưu hình ảnh và JavaScript đến hiệu năng tải trang website.*
Nhánh: `task3-measurement` (đã gộp vào `main`).

**Kết luận ngắn.** Tối ưu hình ảnh quyết định gần như toàn bộ mức cải thiện. Trên cấu hình di động, LCP giảm từ 25,8 s xuống 2,8 s, byte trang giảm 85% và điểm Performance tăng từ 73 lên 95 (p = 0,008). Tối ưu JavaScript chỉ có tác động đo được lên FCP khi ảnh còn nặng: A→C giảm 527 ms (p = 0,008), còn B→D thì không (p = 0,84). Bản D kết hợp cả hai cho trung vị tốt nhất (LCP 2,43 s, điểm 97), nhưng chênh lệch với B không có ý nghĩa thống kê. Hai nhóm biện pháp **không cộng dồn**.

## 1. Thiết kế thí nghiệm

Thiết kế giai thừa 2 × 2. Mỗi phiên bản là một tổ hợp của hai yếu tố, mọi thứ khác giữ nguyên: câu chữ, bố cục, CSS, bộ lọc vùng, hộp xem ảnh, khung React/TanStack dùng chung.

| | JavaScript chưa tối ưu | JavaScript đã tối ưu |
| --- | --- | --- |
| **Ảnh chưa tối ưu** (JPEG 2400 px) | A `/lab/a` | C `/lab/c` |
| **Ảnh đã tối ưu** (AVIF/WebP, srcset, lazy) | B `/lab/b` | D `/lab/d` |

- Tác động chính của ảnh = ((B − A) + (D − C)) / 2
- Tác động chính của JavaScript = ((C − A) + (D − B)) / 2
- Tương tác = (D − C) − (B − A). Khác 0 nghĩa là tác động của yếu tố này phụ thuộc yếu tố kia.

## 2. Phiên bản D

`src/components/magazine/MagazinePageD.tsx` và route `src/routes/lab/d.tsx`.

- **JavaScript giống hệt C:** không gắn `legacy.js`, hộp xem ảnh `React.lazy` (dùng chung chunk `Lightbox`), dữ liệu ảnh gọn.
- **Ảnh giống hệt B:** `<picture>` AVIF/WebP với `srcset` + `sizes`, `width`/`height`, `loading="lazy"` cho ảnh dưới màn hình đầu, ảnh bìa `eager` + `fetchpriority="high"` + `decoding="sync"`, `<link rel="preload">` ảnh bìa AVIF, hộp xem ảnh dùng AVIF 2400 px.
- Dữ liệu `src/data/lab-images-b.ts` được sinh tự động từ `image-audit.ts` bằng `scripts/task2-derive-lab-data.mjs` (chạy `--check` để phát hiện lệch). Không sửa tệp nào của Task 1 và Task 2.
- D là tệp riêng, không sửa C, để số đo của C giữ nguyên. So mã nguồn C và D: chỉ khác thẻ preload, dòng nhãn, câu mô tả header, component ảnh và đường dẫn ảnh trong hộp xem ảnh.

Kiểm thử (`node scripts/task2-check-functional.mjs`): **50/50 mục đạt** trên A, B, C, D.

- Mặc định 8 ảnh; lọc Bắc 3, Trung 2, Nam 3, Tất cả 8.
- Mở đúng ảnh, đóng bằng nút và bằng nền, Console không lỗi.
- C, D không tải `legacy.js`; chunk Lightbox chỉ tải sau khi bấm.
- C tải đúng các URL ảnh của A; D tải đúng các URL ảnh của B.

Ảnh chụp toàn trang B và D (đã cuộn để ảnh lazy tải xong): khác biệt chỉ nằm trong vùng header — dòng nhãn và câu mô tả, 0,11% (1440 px) và 0,36% (390 px) số pixel. Ảnh: `artifacts/task3/screens`.

`npm run typecheck` và `npm run build:dev` đạt. `npm run lint` và `npm test` giữ nguyên các lỗi có sẵn từ commit mốc `c0cb6a3`, không có lỗi mới.

## 3. Phương pháp đo

| Mục | Giá trị |
| --- | --- |
| Bản đo | Build `npm run build:dev` (đã minify), phục vụ bằng `vite preview` |
| Công cụ | Lighthouse 12.8.2, Chrome for Testing 153, headless |
| Throttling | Thực (`--throttling-method=devtools`), không dùng mô hình giả lập |
| Cấu hình di động | Mặc định Lighthouse: màn hình 412 × 823, CPU chậm 4×, mạng 4G chậm (RTT 150 ms, 1,6 Mbps) |
| Cấu hình desktop | `--preset=desktop`: 1350 × 940, không giới hạn CPU, RTT 40 ms, 10 Mbps |
| Số lượt | 5 vòng mỗi cấu hình, chạy xen kẽ A1 B1 C1 D1 A2 … để giảm sai lệch theo thời gian |
| Trạng thái trang | Mặc định, chưa bấm lọc; cache trống mỗi lượt |
| Tài nguyên ngoài | Font Google và script grok.com bị chặn như nhau cho mọi bản (máy đo không có Internet) |
| Máy | Linux, 2 vCPU, 7 GB RAM |
| Thống kê | Trung vị 5 lượt; khoảng min–max; Mann–Whitney U chính xác hai phía (n = 5 mỗi nhóm, p nhỏ nhất có thể = 0,0079) |

Tái lập: `bash scripts/task3-lighthouse.sh mobile 5`, `bash scripts/task3-lighthouse.sh desktop 5`, rồi `node scripts/task3-analyze.mjs`.

## 4. Dung lượng tải về (Lighthouse di động, trung vị)

| Phiên bản | Tổng byte truyền | Request | Ảnh | Request ảnh | JavaScript | Request JS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| A | 4 750 494 B | 18 | 4 607 055 B | 8 | 124 465 B | 5 |
| B | 729 020 B (−84,7%) | 18 | 581 496 B (−87,4%) | 8 | 124 465 B | 5 |
| C | 4 746 218 B (−0,1%) | 15 | 4 607 055 B | 8 | 120 280 B (−3,4%) | 2 |
| D | 725 344 B (−84,7%) | 15 | 581 496 B (−87,4%) | 8 | 120 889 B (−2,9%) | 2 |

Trên desktop, B và D chọn biến thể ảnh lớn hơn theo `sizes` nên ảnh là 683 479 B (−85,2% so với A).
Ảnh chiếm 97% byte của A. Vì vậy cắt 87% byte ảnh làm giảm 85% byte trang, còn cắt 3% byte JavaScript gần như không đổi tổng byte.

## 5. Kết quả thời gian

### 5.1 Di động (CPU 4×, 4G chậm) — trung vị [min–max] 5 lượt

| Chỉ số | A | B | C | D |
| --- | ---: | ---: | ---: | ---: |
| LCP (ms) | 25 797 [25 146–25 912] | 2 843 [1 993–2 888] | 26 013 [25 551–26 278] | **2 426** [2 014–2 841] |
| FCP (ms) | 1 905 [1 882–1 925] | 1 417 [1 381–1 524] | **1 378** [1 356–1 424] | 1 455 [1 400–1 536] |
| Speed Index (ms) | 2 994 [2 785–3 040] | 1 809 [1 525–1 894] | 2 793 [2 640–2 953] | **1 737** [1 577–1 822] |
| TBT (ms) | 26 [2–90] | **0** [0–21] | 8 [0–58] | 13 [0–26] |
| CLS | 0 | 0 | 0 | 0 |
| Điểm Performance | 73 | 95 | 74 | **97** |
| Script Evaluation (ms) | 294 | 218 | 220 | 250 |
| Main-thread work (ms) | 2 115 | 878 | 2 339 | 931 |

### 5.2 Desktop — trung vị [min–max] 5 lượt

| Chỉ số | A | B | C | D |
| --- | ---: | ---: | ---: | ---: |
| LCP (ms) | 1 775 [215–2 004] | 631 [176–767] | 1 964 [220–2 294] | 659 [619–743] |
| FCP (ms) | 215 [184–255] | 181 [151–240] | 220 [174–473] | 186 [121–234] |
| Speed Index (ms) | 1 591 [1 165–1 655] | 536 [516–648] | 1 582 [1 205–1 834] | 547 [520–637] |
| TBT (ms) | 0 | 0 | 0 (1 lượt 26) | 0 |
| CLS | 0 | 0 | 0 | 0 |
| Điểm Performance | 91 | 100 | 90 | 100 |

Lưu ý desktop: ở 2/5 lượt của A, 1/5 của B và 1/5 của C, Lighthouse chọn đoạn văn ở header làm phần tử LCP thay vì ảnh bìa, nên LCP các lượt đó chỉ bằng FCP (175–255 ms). Đây là lý do khoảng min–max của LCP desktop rất rộng và kiểm định LCP desktop không có ý nghĩa. Speed Index không bị ảnh hưởng và cho thấy cùng xu hướng.

## 6. Phân tích 2 × 2 (di động)

| Chỉ số | Tác động ảnh | Tác động JS | Tương tác | A→B | C→D | A→C | B→D | A→D |
| --- | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| LCP (ms) | −23 271 | −100 | −633 | −22 955, p = 0,008 | −23 587, p = 0,008 | +216, p = 0,22 | −417, p = 0,55 | −23 371, p = 0,008 |
| FCP (ms) | −205 | −244 | +565 | −488, p = 0,008 | +77, p = 0,10 | −527, p = 0,008 | +38, p = 0,84 | −450, p = 0,008 |
| Speed Index (ms) | −1 120 | −136 | +129 | −1 185, p = 0,008 | −1 056, p = 0,008 | −201, p = 0,15 | −72, p = 0,89 | −1 257, p = 0,008 |
| TBT (ms) | −10 | −3 | +31 | −26, p = 0,10 | +5, p = 1,00 | −18, p = 0,55 | +13, p = 0,33 | −13, p = 0,55 |
| Điểm | +22,5 | +1,5 | +1 | +22, p = 0,008 | +23, p = 0,008 | +1, p = 0,008 | +2, p = 0,71 | +24, p = 0,008 |
| Script Evaluation (ms) | −23 | −21 | +106 | −77, p = 0,03 | +30, p = 0,22 | −74, p = 0,03 | +32, p = 0,55 | −45, p = 0,22 |

Số đầy đủ (cả desktop): `artifacts/task3/analysis.json`.

### Diễn giải

1. **Ảnh là yếu tố chi phối.** Tối ưu ảnh giảm LCP khoảng 23 s và Speed Index khoảng 1,1 s trên di động, ở cả hai mức JavaScript, mọi kiểm định p = 0,008 (mức nhỏ nhất có thể với 5 lượt). Lý do: A tải 4,6 MB ảnh qua đường 1,6 Mbps, và React còn tự chèn `preload` cho cả 8 ảnh, nên ảnh bìa (phần tử LCP) phải chia băng thông với 7 ảnh còn lại. B/D chỉ tải biến thể vừa khung hình và lazy các ảnh dưới màn hình đầu.
2. **JavaScript chỉ tác động lên FCP, và chỉ khi ảnh còn nặng.** A→C giảm FCP 527 ms (p = 0,008, 5 lượt hoàn toàn tách biệt), nhưng B→D không đổi (p = 0,84). Cách giải thích phù hợp với dữ liệu: `legacy.js` ở A là script chặn parser. Request của nó phải tranh băng thông với 4,6 MB ảnh đang preload, nên trình duyệt chờ lâu trước lần vẽ đầu tiên. Ở B, ảnh đã nhẹ nên script đó về nhanh; bỏ nó (D) không còn lợi thêm. Đây là **tương tác âm**: hai biện pháp cùng giải một nút thắt nên không cộng dồn.
3. **TBT không phân biệt được các bản.** Với khung React dùng chung (~435 KB, giữ nguyên ở cả 4 bản), TBT của mọi bản đều nhỏ (0–90 ms), dao động giữa các lượt lớn hơn chênh lệch giữa các bản, và không kiểm định nào có ý nghĩa. Thời gian Script Evaluation có giảm ở A→C (−74 ms, p = 0,03) nhưng không lặp lại ở B→D. Lần đo sơ bộ của Task 2 (TBT 110 → 52 ms) không được xác nhận ở phép đo chính thức này.
4. **CLS bằng 0 ở cả 4 bản.** Khung ảnh dùng `aspect-ratio` cố định nên ảnh không làm xô lệch bố cục, kể cả bản A không khai báo `width`/`height`.
5. **Bản D.** Trung vị tốt nhất ở LCP (2,43 s, dưới ngưỡng "tốt" 2,5 s của Core Web Vitals), Speed Index và điểm (97). B có LCP trung vị 2,84 s (vùng "cần cải thiện"). Tuy vậy chênh lệch B–D không có ý nghĩa thống kê ở chỉ số nào, nên không thể khẳng định D tốt hơn B.
6. **Desktop.** Trên máy không bị giới hạn CPU và mạng nhanh, chỉ còn tác động của ảnh lên Speed Index (−1 045 ms, p = 0,008) và điểm (+9,5). JavaScript không tạo khác biệt đo được.

## 7. Trả lời câu hỏi nghiên cứu

| Câu hỏi | Kết quả |
| --- | --- |
| Tối ưu ảnh có cải thiện hiệu năng tải trang không? | **Có, rất lớn.** Di động: LCP −90%, Speed Index −40%, byte −85%, điểm 73 → 95. Có ý nghĩa thống kê. |
| Tối ưu JavaScript có cải thiện hiệu năng tải trang không? | **Có nhưng nhỏ và có điều kiện.** Giảm 3 request JS, mã riêng của trang −70%. FCP −0,5 s khi ảnh còn nặng; không cải thiện LCP, TBT, CLS ở mức đo được. |
| Kết hợp hai nhóm có tốt nhất không? | D tốt nhất theo trung vị nhưng **không khác B có ý nghĩa**. Tác động không cộng dồn; gần như toàn bộ lợi ích đến từ ảnh. |
| Ưu tiên nào cho trang nhiều ảnh như Phố & Biển? | Tối ưu ảnh trước. Tối ưu JavaScript ở phạm vi trang là bước rẻ, nên làm, nhưng muốn giảm thêm chi phí JS phải động đến khung ứng dụng chung. |

## 8. Giới hạn và đe dọa tính hợp lệ

- 5 lượt mỗi bản trên một máy ảo 2 vCPU; các chỉ số nhỏ (TBT, Script Evaluation) nhạy với nhiễu. Kiểm định Mann–Whitney với n = 5 có lực thấp: "không có ý nghĩa" không có nghĩa là "không có tác động".
- Đo trong phòng thí nghiệm (lab data), không có dữ liệu người dùng thật (field data, INP).
- Máy đo không ra được Internet: font Google và script bên thứ ba bị chặn cho mọi bản. Số tuyệt đối khi triển khai thật sẽ khác.
- Phạm vi tối ưu JavaScript cố ý không chạm khung React/TanStack dùng chung (94% byte JS). Kết luận "JavaScript tác động nhỏ" chỉ đúng cho phần JavaScript ở phạm vi trang.
- LCP desktop có lượt Lighthouse chọn đoạn văn làm phần tử LCP (mục 5.2).
- Một trang duy nhất với 8 ảnh lớn; trang ít ảnh, nhiều tương tác có thể cho kết quả ngược lại.

## 9. Bằng chứng trong `artifacts/task3`

| Tệp | Nội dung |
| --- | --- |
| `lighthouse-mobile/*.json.gz`, `lighthouse-mobile-summary.json` | 20 báo cáo Lighthouse di động và bảng tổng hợp |
| `lighthouse-desktop/*.json.gz`, `lighthouse-desktop-summary.json` | 20 báo cáo Lighthouse desktop và bảng tổng hợp |
| `analysis.json` | Trung vị, min–max, tác động 2 × 2, kiểm định cho mọi chỉ số |
| `bytes-summary.json` | Byte ảnh, JS, tổng, số request, phần tử LCP |
| `raw/measure-*.json` | Đo bổ sung bằng Playwright + CDP (1440 × 900): byte, coverage JS |
| `screens/*.jpg` | Ảnh chụp toàn trang B và D |
