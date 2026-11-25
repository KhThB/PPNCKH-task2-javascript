# Task 2 — Phiên bản C: chỉ tối ưu JavaScript

Đề tài: *Đánh giá ảnh hưởng của tối ưu hình ảnh và JavaScript đến hiệu năng tải trang website.*
Người thực hiện: thành viên 2. Nhánh: `task2-javascript`.

## 1. Mục tiêu và nguyên tắc

Tạo phiên bản C tại `/lab/c` chỉ thay đổi JavaScript so với bản đối chứng A. Ảnh, câu chữ, thứ tự
khối, CSS, bộ lọc vùng miền, mở và đóng ảnh giữ nguyên, để chênh lệch A–C phản ánh tác động của
nhóm biện pháp tối ưu JavaScript.

Không sửa các tệp của Task 1: `/lab/a`, `/lab/b`, `public/lab/a`, `public/lab/b`,
`scripts/optimize-images.mjs`, `src/data/image-audit.ts`. `MagazinePage.tsx`, `LabImage.tsx` và
`public/lab/legacy.js` (A và B dùng) cũng giữ nguyên.

| Phiên bản | Ảnh | JavaScript | Ý nghĩa |
| --- | --- | --- | --- |
| A đối chứng | JPEG của A | Chưa tối ưu | Mốc so sánh |
| B (Task 1) | AVIF/WebP responsive | Giống A | Tác động của hình ảnh |
| **C (Task 2)** | **Giống A** | **Đã tối ưu** | **Tác động của JavaScript** |
| D (ghép sau) | Lấy từ B | Lấy từ C | Hiệu quả kết hợp |

## 2. Mốc A

- Commit mốc: `c0cb6a364adc8bb89674ad214e848536806d0a6a` (nhánh `main`, kết quả `git rev-parse HEAD` trước khi tạo nhánh).
- Số đo mốc tại đúng commit này: `artifacts/task2-js/raw/baseline-commit-c0cb6a3.json`.
- Node 22.23, Vite 8.2 (Rolldown), React 19.2, TanStack Start 1.168, Chrome 14x headless.

## 3. Hiện trạng JavaScript của A (trước tối ưu)

Trang `/lab/a` tải 5 tệp JavaScript (trạng thái mặc định, tắt cache, chặn font Google và script grok.com cho cả hai bản):

| Tệp | Vai trò | Resource size | Transferred |
| --- | --- | ---: | ---: |
| `index-*.js` | Khung React + TanStack Router/Start, dùng chung mọi trang | 435 079 B | 117 096 B |
| `image-audit-*.js` | Toàn bộ bảng số liệu Task 1 (byte, PSNR, ablation…) | 20 488 B | 3 799 B |
| `MagazinePage-*.js` | Trang tạp chí, bộ lọc, hộp xem ảnh | 6 421 B | 2 361 B |
| `/lab/legacy.js` | Mã legacy, không minify, chặn parser | 1 097 B | 761 B |
| `a-*.js` | Route `/lab/a` | 148 B | 387 B |
| **Tổng** | | **463 233 B** | **124 404 B** |

Phân tích:

1. `legacy.js` gắn bằng `<script src>` thường (không `defer`/`async`) ngay đầu `<body>`, nên trình duyệt phải dừng phân tích HTML để tải và chạy nó. Nội dung gồm `unusedRegions`, `unusedSlug`, `unusedTrack`, `unusedFlatten`; kết quả duy nhất là gán `window.__phoBienLegacy` và `window.__unusedTracks`. Tìm trong toàn bộ mã nguồn: không chỗ nào đọc hai biến này. Bộ lọc và hộp xem ảnh do React xử lý. → Tệp không cần cho giao diện.
2. Trang import `image-audit.ts` chỉ để lấy tên, vùng, alt, đường dẫn JPEG và nguồn ảnh (khoảng 2 KB thông tin) nhưng phải tải và parse cả 20 KB.
3. Hộp xem ảnh nằm sẵn trong bundle trang dù chỉ dùng khi người dùng bấm ảnh.
4. `useMemo` tính chuỗi srcset AVIF chạy cả ở bản A, nơi kết quả không được dùng.
5. `index-*.js` chiếm 94% byte JavaScript và ~72% trong đó chưa chạy khi tải trang. Đây là khung chung của toàn ứng dụng (cùng các trang hồ sơ, xác thực, cầu nối preview). Sửa nó sẽ làm đổi luôn A và B, nên **không thuộc phạm vi C** (xem mục Giới hạn).

## 4. Nhật ký kỹ thuật đã áp dụng

| # | Biện pháp | Áp dụng ở C | Lý do | Cách xác nhận | Kết quả |
| --- | --- | --- | --- | --- | --- |
| 1 | Loại bỏ mã không dùng | C không gắn `/lab/legacy.js`. A, B giữ nguyên. | Không hành vi giao diện nào phụ thuộc; là script chặn parser. | Không có request `legacy.js`; `window.__phoBienLegacy` không tồn tại; checklist chức năng đạt. | −1 request, −1 097 B resource; bỏ một script chặn phân tích HTML |
| 2 | Tách tải theo nhu cầu | `Lightbox.tsx` là component riêng, nạp bằng `React.lazy` + `Suspense`; fallback là lớp nền tối (bấm vẫn đóng). | Hộp xem ảnh chỉ cần sau khi người dùng bấm ảnh. | `Lightbox-*.js` (536 B) không có trong Network trước khi bấm; xuất hiện sau khi bấm. | Ra khỏi đường tải ban đầu |
| 3 | Chỉ gửi dữ liệu giao diện cần | `src/data/lab-images-a.ts` sinh tự động từ `image-audit.ts` bằng `scripts/task2-derive-lab-data.mjs` (có `--check` để phát hiện lệch). | Bỏ 20 KB dữ liệu báo cáo khỏi trang thí nghiệm mà không sửa tệp của Task 1. | Không có request `image-audit-*.js`; nội dung, alt, nguồn ảnh trùng A. | −20 488 B resource |
| 4 | Bỏ tính toán thừa | Bỏ `useMemo` srcset AVIF và nhánh `variant === "b"` trong trang C. | Không dùng khi giao ảnh kiểu A. | Đọc mã, typecheck. | Nhỏ |
| 5 | Đóng gói, minify bằng Vite | Toàn bộ mã C nằm trong `src`, gộp thành một chunk route `c-*.js` (8 381 B, gzip 3 119 B), không thêm thư viện. | Bỏ 3 tệp riêng (route, trang, dữ liệu) và tệp legacy không minify. | So sánh thư mục build và Network. | 4 tệp riêng của trang → 1 tệp |
| 6 | Defer | Không cần: sau bước 1 không còn script ngoài React. | — | HTML của `/lab/c` không có `<script src>` đồng bộ nào của dự án. | — |
| 7 | Tách `imageVariant` / `jsVariant` | Trang C cố định `data-image-variant="a"`, `data-js-variant="optimized"`; ảnh đi qua `LabImageA` = đúng thẻ `<img src>` của A. | Tránh vô tình dùng ảnh B; giúp ghép D. | Kiểm thử: danh sách ảnh tải về của C trùng từng URL với A; so ảnh chụp màn hình. | Đạt |

Tệp đã thêm hoặc sửa:

| Tệp | Việc |
| --- | --- |
| `src/routes/lab/c.tsx` | Route `/lab/c` |
| `src/components/magazine/MagazinePageC.tsx` | Trang C (câu chữ, class, bố cục giống A) |
| `src/components/magazine/Lightbox.tsx` | Hộp xem ảnh tải động |
| `src/data/lab-images-a.ts` | Dữ liệu tối thiểu, sinh tự động |
| `src/routes/index.tsx` | Nút “Mở phiên bản C” và mục mô tả Task 2 |
| `src/routeTree.gen.ts` | Router plugin tự sinh khi thêm route |
| `scripts/task2-derive-lab-data.mjs` | Sinh/kiểm tra `lab-images-a.ts` |
| `scripts/task2-measure-js.mjs` | Đo request, size, coverage, thời gian script (Playwright + CDP) |
| `scripts/task2-check-functional.mjs` | Checklist chức năng A, B, C |
| `scripts/task2-summarize-lighthouse.mjs` | Tổng hợp 5 lượt Lighthouse |
| `docs/task2-js-audit.md`, `artifacts/task2-js/` | Tài liệu và bằng chứng đo |

Không sửa `MagazinePage.tsx` để A và B giữ nguyên từng byte của chunk trang. Hệ quả phụ duy nhất lên A, B: thêm route làm `index-*.js` tăng 234 B (resource) / 41 B (transferred) vì cây route nằm trong bundle chung; mức tăng như nhau ở A, B, C.

## 5. Phương pháp đo

- Build: `npm run build:dev`, phục vụ bằng `vite preview` (bản build có minify), cùng máy, cùng phiên.
- Mỗi lượt: context trình duyệt mới, tắt cache, mở trang ở trạng thái mặc định (chưa bấm lọc), chặn `fonts.googleapis.com`, `fonts.gstatic.com`, `grok.com` cho mọi phiên bản (môi trường đo không ra được Internet; chặn giống nhau để công bằng).
- **Đo 1 — JavaScript và coverage** (`scripts/task2-measure-js.mjs`, 5 lượt/bản, 1440×900, không giả lập CPU): số request JS, transferred (`encodedDataLength`), resource size, coverage V8 lúc trang tải xong, `ScriptDuration` của CDP.
- **Đo 2 — Lighthouse 12, throttling thực (devtools)**, 5 lượt/bản, chạy xen kẽ A, C: mobile, CPU chậm 4×, mạng 4G chậm. Lấy TBT, FCP, LCP, CLS, Speed Index, thời gian *Script Evaluation* và *Script Parse & Compile* (mục *Main-thread work breakdown*).
- **Đo 3 — Lighthouse 12, throttling giả lập (simulate, mặc định)**, 5 lượt/bản, để đối chiếu.
- Báo cáo giá trị trung vị của 5 lượt; giữ đủ từng lượt trong `artifacts/task2-js`.

Đây là số liệu trước/sau của Task 2. Thành viên 3 vẫn đo chính thức cho cả nhóm bằng quy trình chung.

## 6. Kết quả A và C

### 6.1 JavaScript tải về (Đo 1, giống nhau ở cả 5 lượt)

| Chỉ số | A | C | Chênh lệch |
| --- | ---: | ---: | ---: |
| Số request JavaScript | 5 | 2 | −3 (−60%) |
| Transferred size (tổng JS) | 124 404 B | 120 215 B | −4 189 B (−3,4%) |
| Resource size (tổng JS) | 463 233 B | 443 460 B | −19 773 B (−4,3%) |
| JS riêng của trang — resource | 28 154 B (4 tệp) | 8 381 B (1 tệp) | **−70,2%** |
| JS riêng của trang — transferred | 7 308 B | 3 119 B | **−57,3%** |
| Khung chung `index-*.js` | 435 079 B | 435 079 B | 0 |
| Script chặn parser của dự án | 1 (`legacy.js`) | 0 | −1 |
| Chunk Lightbox trước khi bấm ảnh | có sẵn trong trang | không tải | 536 B tải khi bấm |

B cho số liệu JavaScript giống hệt A (5 request, 124 404 B / 463 233 B), xác nhận Task 1 không đụng JavaScript.

### 6.2 Mã không dùng (Coverage V8 lúc tải xong, Đo 1)

| | A | C |
| --- | ---: | ---: |
| Byte JS chưa chạy, toàn trang | 314 644 B (67,9%) | 315 916 B (71,2%) |
| — trong khung chung `index-*.js` | 313 245 B | 315 352 B |
| — trong mã riêng của trang | 1 342 B | 507 B |
| Lighthouse *Reduce unused JavaScript* (ước tính theo byte truyền) | 64 208 B | 65 379 B |

Cách đọc: coverage chỉ đếm byte **đã được thực thi**, không biết dữ liệu có được giao diện dùng hay không. Vì vậy `image-audit` (một object lớn được khởi tạo) và `legacy.js` (các hàm “unused” vẫn bị gọi khi khởi động) đều hiện là “đã dùng” ở A. Bỏ chúng làm tổng byte giảm nhưng không làm giảm số byte “chưa chạy”; tỷ lệ % còn tăng vì mẫu số nhỏ đi. Phần chưa chạy gần như toàn bộ nằm trong khung chung, giống nhau ở A và C. Kết luận đúng là: C đã bỏ hết mã và dữ liệu thừa **trong phạm vi trang**; phần còn lại thuộc khung ứng dụng.

### 6.3 Thời gian main thread và chỉ số tải trang

Lighthouse, throttling thực (devtools), trung vị 5 lượt:

| Chỉ số | A | C | Chênh lệch | Từng lượt A / C |
| --- | ---: | ---: | ---: | --- |
| TBT | 110 ms | 52 ms | −58 ms | 110, 129, 137, 109, 44 / 41, 52, 62, 20, 76 |
| Script Evaluation | 393 ms | 320 ms | −73 ms (−19%) | 383, 393, 445, 469, 321 / 307, 324, 342, 267, 320 |
| Script Parse & Compile | 12,2 ms | 10,7 ms | −1,5 ms | |
| FCP | 1 967 ms | 1 440 ms | −527 ms | 1912–2054 / 1403–1453 |
| Speed Index | 3 463 ms | 2 997 ms | −466 ms | |
| LCP | 27 224 ms | 26 438 ms | −2,9% (trong dao động) | |
| CLS | 0 | 0 | 0 | |
| Điểm Performance | 72 | 74 | +2 | |

Lighthouse, throttling giả lập (simulate), trung vị 5 lượt: TBT 101 → 54 ms; Script Evaluation 349 → 315 ms; LCP 15 564 → 14 598 ms; **FCP 1 905 → 3 109 ms (ngược chiều)**; điểm 72 → 69. Giá trị FCP *quan sát* (chưa giả lập) trong chính các lượt đó: A 273–411 ms, C 250–374 ms, tức không chậm hơn. Chênh lệch FCP ở chế độ simulate là do mô hình Lantern ước lượng lại đồ thị tài nguyên, không phải do trang C vẽ chậm hơn.

Đo 1 (desktop, không giả lập CPU): `ScriptDuration` trung vị A 99,1 ms, B 81,2 ms, C 80,7 ms; FCP A 172–1556 ms, C 196–232 ms. Máy mạnh nên chênh lệch nhỏ và nhiễu.

## 7. Kết quả kiểm thử

`node scripts/task2-check-functional.mjs` — **36/36 mục đạt** trên A, B, C:

- Mặc định 8 ảnh; lọc Bắc 3, Trung 2, Nam 3, Tất cả 8 (A, B, C).
- Bấm ảnh mở hộp xem đúng ảnh; nút Đóng và bấm nền đều đóng; bấm vào ảnh trong hộp không đóng.
- A, B vẫn tải `legacy.js` như mốc; C không tải.
- C: chunk Lightbox không tải trước khi bấm ảnh, tải sau khi bấm.
- C tải về đúng 8 URL ảnh như A (`/lab/a/*.jpg`); HTML của C preload cùng 8 ảnh như A.
- Console không có lỗi (trừ request bên thứ ba bị chặn có chủ đích).
- So ảnh chụp toàn trang A và C (1440 px và 390 px): khác biệt chỉ nằm trong vùng header — dòng nhãn “Phiên bản C” và câu mô tả (0,09% và 0,29% số pixel). Ảnh: `artifacts/task2-js/screens`.

Kiểm tra kỹ thuật:

| Lệnh | Kết quả |
| --- | --- |
| `npm run typecheck` | Đạt |
| `npm run build:dev` | Đạt |
| `npm run lint` | 1 lỗi + 1 cảnh báo, **có sẵn từ commit mốc** (`src/lib/app-data/client.server.ts`, `LabImage.tsx`); tệp mới của Task 2 không có lỗi |
| `npm test` | 189 đạt / 8 lỗi, **giống hệt commit mốc** (test grok-pwa của nền tảng, không liên quan) |
| `node scripts/task2-derive-lab-data.mjs --check` | Đạt |

## 8. Phân tích

1. **Dung lượng.** Trong phạm vi trang, nhóm biện pháp giảm 70% byte JavaScript và 3 request. So với cả trang, mức giảm chỉ 3–4% vì 94% byte nằm ở khung React/TanStack dùng chung, không thay đổi. Đây là điều đã dự liệu trong thiết kế thí nghiệm: giữ khung chung để so sánh công bằng.
2. **Main thread.** TBT và Script Evaluation giảm ở cả hai chế độ Lighthouse (TBT khoảng −50%, evaluate khoảng −10 đến −19%). Mức giảm vượt quá phần byte bỏ đi, nên có thể có phần đóng góp từ việc không còn script đồng bộ chen vào giữa lúc phân tích HTML và hydrate. Tuy vậy, TBT ở cả hai bản nhỏ (dưới 150 ms) và các lượt chồng lấn một phần (A thấp nhất 44 ms, C cao nhất 76 ms). Kết luận ở mức: *có xu hướng giảm rõ, cần thành viên 3 xác nhận bằng phép đo chính thức.*
3. **FCP.** Với throttling thực, FCP của C ổn định hơn và thấp hơn A khoảng 0,5 s, 5 lượt không chồng lấn. Giải thích hợp lý nhất: A có `legacy.js` chặn parser ở đầu `<body>`; trên mạng chậm, trình duyệt phải chờ thêm một vòng tải trước khi vẽ. Nhưng chế độ simulate cho kết quả ngược chiều, và trên máy không giới hạn thì gần như bằng nhau. Theo nguyên tắc của kế hoạch, **không kết luận chắc chắn rằng tối ưu JavaScript cải thiện FCP**; chỉ ghi nhận là có dấu hiệu trong điều kiện mạng chậm.
4. **LCP, CLS.** LCP do ảnh JPEG 2 400 px quyết định (≈2,4 MB ảnh trên 4G chậm), C không đổi ảnh nên LCP thay đổi trong biên dao động. CLS bằng 0 ở cả hai. Muốn cải thiện LCP cần bản B/D.
5. **Tương tác.** Lần bấm ảnh đầu tiên ở C cần tải thêm 536 B (một request). Trên mạng chậm có thể thấy lớp nền tối trước khi ảnh hiện; các lần sau dùng chunk đã có trong bộ nhớ.

## 9. Giới hạn

- Khung chung `index-*.js` (435 KB, ~72% chưa chạy lúc tải) chưa tối ưu vì sẽ làm đổi A và B. Hướng tiếp theo nếu nhóm muốn: bỏ `AuthProvider` và cầu nối preview khỏi route `/lab/*`, hoặc render trang thí nghiệm tĩnh không hydrate — nên làm như một biến thể riêng, có mốc riêng.
- Đo trong môi trường không có Internet: font Google và script grok.com bị chặn cho mọi bản. Số tuyệt đối sẽ khác khi chạy thật; chênh lệch A–C vẫn so sánh được.
- 5 lượt mỗi bản, một máy. Các chỉ số thời gian nhỏ (TBT, parse) nhạy với nhiễu.
- Nhiều biện pháp được áp dụng cùng lúc, nên kết quả là **tác động của nhóm biện pháp tối ưu JavaScript**, không quy kết cho riêng một kỹ thuật.
- Không chụp được bảng Coverage của DevTools trong môi trường headless; số liệu coverage lấy từ V8 qua Playwright (cùng nguồn dữ liệu với bảng Coverage) và lưu trong JSON.

## 10. Kết luận

Phiên bản C giữ nguyên ảnh, nội dung và chức năng của A, đồng thời bỏ toàn bộ JavaScript và dữ liệu thừa ở phạm vi trang: từ 5 xuống 2 request JS, mã riêng của trang giảm 70% (28,2 KB → 8,4 KB), không còn script chặn parser, và hộp xem ảnh chỉ tải khi cần. Trong điều kiện mạng và CPU bị giới hạn, TBT và thời gian thực thi script có xu hướng giảm. FCP giảm khi dùng throttling thực nhưng không nhất quán giữa các phương pháp đo, nên chưa đủ cơ sở kết luận. LCP không đổi đáng kể, đúng với giả thuyết rằng LCP của trang này do ảnh quyết định. Vì khung ứng dụng chung chiếm 94% byte JavaScript và được giữ cố định, tác động của Task 2 lên toàn trang là có thật nhưng nhỏ.

## 11. Tái lập phép đo

```powershell
npm install
npm run build:dev
.\node_modules\.bin\vite.cmd preview --host 127.0.0.1 --port 4173
# cửa sổ khác
node scripts/task2-check-functional.mjs --chrome "C:\Program Files\Google\Chrome\Application\chrome.exe"
node scripts/task2-measure-js.mjs --paths /lab/a,/lab/c --runs 5 --chrome "C:\Program Files\Google\Chrome\Application\chrome.exe"
npx lighthouse http://127.0.0.1:4173/lab/c --only-categories=performance --throttling-method=devtools --output=json --output-path=artifacts/task2-js/lighthouse-devtools/lab-c-run1.json
node scripts/task2-summarize-lighthouse.mjs artifacts/task2-js/lighthouse-devtools
```

Đo thủ công bằng DevTools (theo kế hoạch): Network bật *Disable cache*, lọc JS; Coverage bấm tải lại; Performance ghi lần tải trang. Chỉ đo khi trang ở trạng thái mặc định.

## 12. Bằng chứng trong `artifacts/task2-js`

| Tệp | Nội dung |
| --- | --- |
| `raw/baseline-commit-c0cb6a3.json` | A, B tại commit mốc, 5 lượt |
| `raw/after-abc-5runs.json` | A, B, C sau khi có C, 5 lượt, kèm coverage từng tệp |
| `lighthouse-devtools/*.json.gz`, `lighthouse-devtools-summary.json` | 10 báo cáo Lighthouse, throttling thực |
| `lighthouse/*.json.gz`, `lighthouse-summary.json` | 10 báo cáo Lighthouse, throttling giả lập |
| `har/lab-a.har`, `har/lab-c.har` | HAR lần tải mặc định |
| `screens/*.jpg` | Ảnh chụp toàn trang A, C và hộp xem ảnh của C |
