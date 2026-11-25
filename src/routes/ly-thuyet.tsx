import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, Shell } from "@/components/dossier/Shell";

export const Route = createFileRoute("/ly-thuyet")({
  component: Theory,
  head: () => ({ meta: [{ title: "Cơ sở lý thuyết — Tối ưu hình ảnh" }] }),
});

function Theory() {
  return (
    <Shell>
      <PageIntro
        kicker="Phần lý thuyết của thành viên 1"
        title="Vì sao đụng vào ảnh trước khi đụng vào điểm tổng"
        lede="Phần này viết cho chương cơ sở lý thuyết của báo cáo. Số Almanac là tài liệu nền, không phải số đo của website thí nghiệm."
      />
      <div className="mt-8 max-w-3xl space-y-4 leading-relaxed">
        <p>
          Trên trang web thông thường, ảnh vẫn là nhóm nội dung nặng nhất tính theo byte. Web Almanac
          2024 của HTTP Archive, lấy số tháng 10/2024, ghi trang desktop trung vị 2.652 KB và trang
          mobile trung vị 2.311 KB. Trong đó ảnh khoảng 1.054 KB trên desktop và 900 KB trên mobile,
          lớn hơn JavaScript trung vị (khoảng 613 KB desktop trong cùng chương Page Weight). Một đề
          tài muốn tách “ảnh” và “JavaScript” là hợp lý: ảnh nghiêng về dung lượng và LCP, JavaScript
          nghiêng về thời gian thực thi và Total Blocking Time.
        </p>
        <p>
          Nén không chỉ là kéo thanh chất lượng. Cùng một cảnh, số pixel gửi đi và codec quyết định
          byte. Almanac 2024, chương Media, ước lượng trung vị mobile khoảng 2,0 bit mỗi pixel với
          JPEG, 1,4 với AVIF và 1,3 với WebP. WebP thường nhỏ hơn JPEG cùng kích thước cỡ một phần
          tư đến một phần ba trong các so sánh kinh điển; AVIF có thể nhỏ hơn nữa ở cùng cảm nhận,
          đổi lại mã hóa nặng hơn và cần ảnh dự phòng. Không kết luận “AVIF luôn thắng” nếu tệp AVIF
          vẫn để nguyên độ phân giải máy ảnh trong khi JPEG đã được thu nhỏ.
        </p>
        <p>
          Ảnh responsive là cách nói cho trình duyệt biết các bản cắt sẵn. <code>srcset</code> liệt kê
          bề rộng file, <code>sizes</code> ước lượng bề rộng hiển thị theo CSS, <code>picture</code>{" "}
          chọn định dạng. <code>sizes</code> sai — khai 100vw cho một ảnh chỉ rộng một phần ba cột —
          thì trình duyệt tải file quá to và mọi bảng “đã dùng srcset” trở thành hình thức. DPR làm
          số pixel cần thiết nhân đôi trên màn sắc nét, nên cùng một trang phải báo cáo ít nhất một
          mốc DPR 1 và một mốc DPR 2.
        </p>
        <p>
          <code>loading="lazy"</code> hoãn ảnh ngoài khung nhìn. Không gắn thuộc tính này
          lên ảnh có thể là LCP: trình duyệt phải layout xong mới chịu tải, đúng khoảng thời gian LCP
          đang bị tính. Ảnh bìa đi ngược lại: <code>fetchpriority="high"</code> và, khi markup
          cho phép, <code>preload</code> với cùng <code>imagesrcset</code> / <code>imagesizes</code>.
          Preload một URL khác với URL mà thẻ img sẽ chọn gây hai lượt tải.
        </p>
        <p>
          <code>width</code> và <code>height</code> cho trình duyệt giữ tỉ lệ trước khi có điểm ảnh,
          giảm Cumulative Layout Shift. Nếu CSS đã khóa khung bằng <code>aspect-ratio</code> thì phần
          CLS còn lại có thể nhỏ. Template thí nghiệm cố ý dùng chung khung crop cho bản A và B để
          việc nhìn chất lượng không bị lệch bố cục; vì thế không hứa một mức giảm CLS lớn.
        </p>
        <p>
          Với chỉ số càng thấp càng tốt, đề cương nhóm chốt: mức giảm (%) = (giá trị A − giá trị bản
          tối ưu) / giá trị A × 100%, khi A khác 0. Áp nhiều kỹ thuật một lúc thì kết quả là tác động
          của cả nhóm. Tách đóng góp từng kỹ thuật lên thời gian tải cần thêm lượt thử. Tách trên
          dung lượng tệp thì làm được ngay bằng cách xuất các biến thể trung gian, và phải gọi đúng
          tên là byte, không gọi là LCP.
        </p>
        <h2 className="pt-4 text-2xl">Tài liệu dẫn</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            HTTP Archive, “Page Weight”, Web Almanac 2024.{" "}
            <a className="underline" href="https://almanac.httparchive.org/en/2024/page-weight">
              almanac.httparchive.org/en/2024/page-weight
            </a>
          </li>
          <li>
            HTTP Archive, “Media”, Web Almanac 2024.{" "}
            <a className="underline" href="https://almanac.httparchive.org/en/2024/media">
              almanac.httparchive.org/en/2024/media
            </a>
          </li>
          <li>
            Chrome for Developers, “Optimize image priority”.{" "}
            <a
              className="underline"
              href="https://developer.chrome.com/docs/modern-web-guidance/guides/performance/optimize-image-priority"
            >
              developer.chrome.com
            </a>
          </li>
          <li>
            web.dev, “Preload responsive images”.{" "}
            <a className="underline" href="https://web.dev/articles/preload-responsive-images">
              web.dev/articles/preload-responsive-images
            </a>
          </li>
        </ol>
      </div>
    </Shell>
  );
}
