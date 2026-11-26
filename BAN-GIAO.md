# Bàn giao cho thành viên 3 (đo chính thức)

Repository này chứa toàn bộ dự án PPNCKH (website thí nghiệm Phố & Biển) kèm phần Task 2.

| Phiên bản | Đường dẫn | Ảnh | JavaScript | Người làm |
| --- | --- | --- | --- | --- |
| A đối chứng | `/lab/a` | JPEG 2400 px | Chưa tối ưu | — |
| B | `/lab/b` | AVIF/WebP responsive, lazy | Giống A | Thành viên 1 |
| C | `/lab/c` | Giống A | Đã tối ưu | Thành viên 2 |
| D | (chưa có) | Lấy từ B | Lấy từ C (`MagazinePageC.tsx`) | Nhóm ghép |

- Nhánh `main`: đã gộp Task 2 (A, B, C đều có).
- Nhánh `task2-javascript`: nhánh làm việc gốc của Task 2, 3 commit tách theo ý nghĩa.
- Commit mốc A: `c0cb6a364adc8bb89674ad214e848536806d0a6a`.

## Chạy website

```powershell
npm install
npm run build:dev
.\node_modules\.bin\vite.cmd preview --host 127.0.0.1 --port 4173
```

Hoặc chế độ dev theo hướng dẫn sẵn có: `.\node_modules\.bin\vite.cmd dev --host 0.0.0.0 --port 8080`.
Nên đo trên bản build (preview), vì bản dev không minify và tải module rời.

## Quy tắc đo

- Đo ở trạng thái mặc định, **trước khi bấm bộ lọc vùng miền**.
- Chrome DevTools, Network bật *Disable cache*, 5 lượt mỗi phiên bản, cùng máy và cùng điều kiện mạng.
- Chỉ số: LCP, FCP, CLS, TBT, Speed Index; tổng byte ảnh và JavaScript; số request.
- Chạy xen kẽ A, B, C (A1, B1, C1, A2…) để giảm sai lệch do máy nóng hoặc mạng thay đổi.

## Công cụ có sẵn của Task 2

```powershell
# Checklist chức năng A, B, C (36 mục)
node scripts/task2-check-functional.mjs --chrome "C:\Program Files\Google\Chrome\Application\chrome.exe"
# Request, size, coverage JS — 5 lượt
node scripts/task2-measure-js.mjs --paths /lab/a,/lab/b,/lab/c --runs 5 --chrome "C:\Program Files\Google\Chrome\Application\chrome.exe"
# Lighthouse rồi tổng hợp trung vị (đặt tên tệp lab-<a|b|c>-run<n>.json)
npx lighthouse http://127.0.0.1:4173/lab/a --only-categories=performance --throttling-method=devtools --output=json --output-path=artifacts/task3/lab-a-run1.json
node scripts/task2-summarize-lighthouse.mjs artifacts/task3
```

## Tài liệu

- Task 1 (ảnh): các trang hồ sơ trong website (`/`, `/phuong-phap`, `/phan-tich`, `/nhat-ky`…) và nút “Tải biên bản Markdown”.
- Task 2 (JavaScript): `docs/task2-js-audit.md` — nhật ký kỹ thuật, bảng A–C, kiểm thử, giới hạn; bằng chứng đo trong `artifacts/task2-js`.

## Lưu ý từ Task 2

- Số đo của Task 2 là số trước/sau tham khảo; số chính thức của nhóm do thành viên 3 đo.
- Ở Lighthouse chế độ giả lập (mặc định), FCP của C có thể ra cao hơn A dù FCP quan sát thực bằng hoặc thấp hơn. Nên đo thêm bằng `--throttling-method=devtools` hoặc tab Performance.
- `npm run lint` (1 lỗi) và `npm test` (8 test lỗi) có sẵn từ commit mốc, không phải do Task 2.
- Môi trường đo của Task 2 không có Internet nên font Google bị chặn; khi đo thật số tuyệt đối sẽ khác.
