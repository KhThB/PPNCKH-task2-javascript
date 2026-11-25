import { createFileRoute } from "@tanstack/react-router";
import { imageAudit } from "@/data/image-audit";
import { PageIntro, Shell } from "@/components/dossier/Shell";

const ROWS = [
  ["1", "Chốt vật thí nghiệm: một trang, tám ảnh, nội dung dùng chung cho A–D", "A và B", "Thiết kế"],
  ["2", "Kiểm kê file Wikimedia: kích thước điểm ảnh và dung lượng nguồn", "Nguồn", "Khảo sát"],
  [
    "3",
    `Xuất mốc A: JPEG ${imageAudit.pipeline.jpegQuality}, cạnh dài ${imageAudit.pipeline.longEdgeControl}px, một file cho mọi vị trí`,
    "A",
    "Mốc đối chứng",
  ],
  [
    "4",
    `Xuất thang ${imageAudit.pipeline.widths.join("/")} px, WebP q${imageAudit.pipeline.webpQuality}, AVIF q${imageAudit.pipeline.avifQuality}, JPEG dự phòng`,
    "B",
    "Nén và đúng kích thước",
  ],
  ["5", "Gắn picture và sizes khớp lưới 46rem / 22rem / 23rem / 72rem", "B", "Responsive"],
  ["6", "Lazy trừ ảnh bìa; fetchpriority và preload AVIF cho ảnh bìa", "B", "Ưu tiên LCP"],
  ["7", "Thêm width và height ở bản B; khóa crop bằng khung dùng chung", "B", "CLS và so mắt"],
  ["8", "Giữ legacy.js, bộ lọc và hộp xem ảnh y nguyên", "A và B", "Không đụng JavaScript"],
  ["9", "Lập bảng byte ba kịch bản, phân rã kỹ thuật, PSNR", "Hồ sơ", "Kết quả phần ảnh"],
];

export const Route = createFileRoute("/nhat-ky")({
  component: Log,
  head: () => ({ meta: [{ title: "Nhật ký kỹ thuật — Tối ưu hình ảnh" }] }),
});

function Log() {
  return (
    <Shell>
      <PageIntro
        kicker="Nhật ký"
        title="Việc đã áp vào mã, theo thứ tự"
        lede="Mỗi dòng là một thay đổi có chủ đích. Người phụ trách cột kỹ thuật ảnh là thành viên 1. Không ghi ngày giả cho những tuần nhóm chưa chạy."
      />
      <div className="mt-8 overflow-x-auto border border-line">
        <table className="wide-table w-full text-left text-sm">
          <thead className="bg-sheet text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">Bước</th>
              <th className="px-3 py-3 font-medium">Việc</th>
              <th className="px-3 py-3 font-medium">Bản</th>
              <th className="px-3 py-3 font-medium">Kỹ thuật</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row[0]} className="border-t border-line align-top">
                {row.map((cell) => (
                  <td key={cell} className="px-3 py-3 leading-relaxed">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 max-w-3xl leading-relaxed text-muted">
        Pipeline ghi trong dữ liệu: {imageAudit.pipeline.tool}. Bản D sau này không cần xuất lại ảnh
        nếu lấy nguyên thư mục /lab/b và nhánh picture của bản B.
      </p>
    </Shell>
  );
}
