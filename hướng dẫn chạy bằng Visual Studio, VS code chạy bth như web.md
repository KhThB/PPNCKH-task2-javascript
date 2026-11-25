# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY WEBSITE TRÊN VISUAL STUDIO

## 1. Môi trường cần thiết

Trước khi chạy dự án, cần chuẩn bị:

- Visual Studio 2022 hoặc phiên bản tương thích.
- Node.js (khuyến nghị phiên bản LTS).
- npm (được cài kèm Node.js).
- Google Chrome hoặc trình duyệt tương tự.
- Source code của dự án.

**Kiểm tra Node.js và npm:**

Mở Terminal trong Visual Studio và chạy:

```powershell
node -v
npm -v
```

Nếu xuất hiện số phiên bản nghĩa là đã nhận diện thành công.

Nếu không nhận diện được, cần kiểm tra cài đặt Node.js và biến môi trường PATH.

## 2. Mở dự án

1. Mở Visual Studio.
2. Chọn Open a Local Folder.
3. Chọn thư mục chứa source code dự án.
4. Mở Terminal bằng menu View → Terminal.
5. Di chuyển đến thư mục gốc dự án (nơi chứa file `package.json`).

Ví dụ:

```powershell
cd "C:\Users\Asus\Downloads\evopRVZY4uu4poln-grok-workspace"
```

## 3. Cài đặt thư viện

Tại Terminal, chạy:

```powershell
npm install
```

Chờ quá trình cài đặt hoàn tất.

Khi xuất hiện thông báo `up to date` và Terminal trở về dấu nhắc lệnh, có thể tiếp tục bước tiếp theo.

Lưu ý: Nếu xuất hiện cảnh báo vulnerabilities, không tự ý chạy `npm audit fix --force` vì có thể gây xung đột phiên bản thư viện.

## 4. Khởi chạy website

### Cách chạy đã kiểm chứng thành công

Trong quá trình thiết lập, lệnh `npm run dev` gặp lỗi:

```text
[with-app-env] failed to run vite: spawn vite ENOENT
```

Tuy nhiên, Vite đã được cài đặt và hoạt động bình thường.

Để chạy website, sử dụng lệnh trực tiếp:

```powershell
.\node_modules\.bin\vite.cmd dev --host 0.0.0.0 --port 8080
```

Khi thành công, Terminal hiển thị:

```text
VITE v8.3.4 ready

Local: http://localhost:8080/
```

Mở trình duyệt và truy cập:

http://localhost:8080/

**Lưu ý:** Giữ Terminal hoạt động trong suốt quá trình sử dụng website. Muốn dừng server, nhấn `Ctrl + C`.

## 5. Các lỗi đã gặp và cách xử lý

| Lỗi | Nguyên nhân / Cách xử lý |
|---|---|
| `npm is not recognized` | Kiểm tra Node.js và cấu hình PATH |
| `spawn vite ENOENT` | Script không tìm thấy Vite; chạy Vite trực tiếp bằng đường dẫn trong `node_modules` |
| `EBUSY: resource busy or locked` | File Watcher không truy cập được file trong thư mục `.vs` do file bị khóa |
| npm vulnerabilities | Cảnh báo bảo mật thư viện, cần kiểm tra riêng trước khi nâng cấp |

## 6. Thông tin môi trường đã kiểm tra

| Thành phần | Phiên bản / Trạng thái |
|---|---|
| Node.js | 26.13.1 |
| npm | 11.20.0 |
| Vite | 8.3.4 |
| Hệ điều hành | Windows |
| Cổng chạy website | 8080 |
| Trạng thái Vite | Đã chạy thành công |

## 7. Lưu ý khi bàn giao cho thành viên khác

- Mỗi thành viên cần cài Node.js trên máy cá nhân.
- Cần chạy `npm install` sau khi lấy source code.
- Phải mở Terminal tại đúng thư mục chứa `package.json`.
- Không xóa thư mục `node_modules` khi chưa cần thiết.
- Không tự ý thay đổi phiên bản thư viện hoặc chạy lệnh nâng cấp hàng loạt.
- Nếu có lỗi, cần gửi nội dung Terminal để xác định nguyên nhân.

**Lưu ý kỹ thuật:** Hiện tại đã xác nhận Vite chạy trực tiếp thành công. Lệnh `npm run dev` vẫn cần được kiểm tra và sửa script `scripts/with-app-env.mjs` trước khi xem là phương thức khởi chạy chính thức.

---

**Kết luận:** Website đã khởi chạy thành công trên máy Windows thông qua Visual Studio và Vite tại địa chỉ `http://localhost:8080/`. Đây là quy trình chạy Frontend đã được kiểm chứng; Backend và kết nối cơ sở dữ liệu cần được kiểm tra riêng.
