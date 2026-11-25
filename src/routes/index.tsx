import { createFileRoute, Link } from "@tanstack/react-router";
import { imageAudit } from "@/data/image-audit";
import { buildReport } from "@/lib/build-report";
import { formatBytes, formatPct } from "@/lib/format";
import { useMemberName } from "@/lib/use-member-name";
import { PageIntro, Shell } from "@/components/dossier/Shell";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [{ title: "Phiếu bàn giao — Tối ưu hình ảnh" }],
  }),
});

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

  return (
    <Shell>
      <PageIntro
        kicker="Đề tài · hiệu năng tải trang"
        title="Phiếu bàn giao phần hình ảnh"
        lede="Thành viên 1 dựng phiên bản B: cùng nội dung, cùng JavaScript, chỉ đổi cách giao ảnh. Số dưới đây là dung lượng tệp đo từ file thật, không phải điểm Lighthouse."
      />

      <label className="mt-8 block max-w-xl">
        <span className="text-sm font-medium">Họ và tên thành viên 1</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Điền tên để in vào biên bản"
          className="mt-2 w-full border border-line bg-sheet px-3 py-3 text-base outline-none focus:border-ink"
        />
      </label>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Tổng ảnh, máy tính DPR 1"
          value={formatPct(desk.allImages.avifReductionPct)}
          note={`${formatBytes(desk.allImages.a)} → ${formatBytes(desk.allImages.avif)} AVIF`}
        />
        <Stat
          label="Ảnh bìa (ứng viên LCP)"
          value={formatPct(desk.hero.avifReductionPct)}
          note={`${formatBytes(desk.hero.a)} → ${formatBytes(desk.hero.avif)}`}
        />
        <Stat
          label="Điện thoại DPR 2, cả trang"
          value={formatPct(phone.allImages.avifReductionPct)}
          note={`${formatBytes(phone.allImages.a)} → ${formatBytes(phone.allImages.avif)}`}
        />
        <Stat
          label="PSNR trung bình AVIF"
          value={`${imageAudit.meanPsnr.avif} dB`}
          note={`WebP ${imageAudit.meanPsnr.webp} dB tại bề rộng hiển thị`}
        />
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/lab/a" className="inline-flex min-h-11 items-center bg-ink px-4 text-sm text-paper">
          Mở phiên bản A
        </Link>
        <Link to="/lab/b" className="inline-flex min-h-11 items-center bg-lacquer px-4 text-sm text-paper">
          Mở phiên bản B
        </Link>
        <Link to="/lab/c" className="inline-flex min-h-11 items-center bg-ink px-4 text-sm text-paper">
          Mở phiên bản C
        </Link>
        <button
          type="button"
          onClick={download}
          className="inline-flex min-h-11 items-center border border-ink px-4 text-sm"
        >
          Tải biên bản Markdown
        </button>
      </div>

      <section className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl">Đã có trong gói này</h2>
          <ul className="mt-4 space-y-3 leading-relaxed">
            <li>Mã bản B và bản đối chứng A, cùng trang Phố & Biển.</li>
            <li>Bảng byte từng ảnh, ba kịch bản màn hình, và bảng tách “chỉ thu nhỏ” với “chỉ đổi định dạng”.</li>
            <li>Nhật ký kỹ thuật, cơ sở lý thuyết, phương pháp, phân tích và giới hạn.</li>
            <li>PSNR cộng trang so khung để nhìn chất lượng, không chỉ nhìn số.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl">Chưa làm — đúng phần người khác</h2>
          <ul className="mt-4 space-y-3 leading-relaxed">
            <li>Không tối ưu JavaScript. Tệp legacy và khung React giống nhau ở A và B.</li>
            <li>Không đo 5 lần LCP, FCP, CLS, TBT. Thành viên 3 đo trên A và B rồi mới có số thời gian chính thức.</li>
            <li>Không ghép bản D. Bản D = ảnh của B + JavaScript sau khi thành viên 2 xong.</li>
          </ul>
        </div>
      </section>

      <section className="mt-12 border border-line bg-sheet p-6">
        <h2 className="text-2xl">Task 2 · Phiên bản C chỉ tối ưu JavaScript</h2>
        <p className="mt-3 max-w-3xl leading-relaxed">
          Bản C dùng đúng ảnh JPEG của bản A, giữ nguyên câu chữ, bộ lọc vùng và hộp xem ảnh. Chỉ
          phần JavaScript thay đổi: không tải tệp legacy.js, hộp xem ảnh là chunk riêng chỉ tải khi
          bấm ảnh, và trang không còn kéo theo bảng số liệu image-audit của Task 1. Khung React và
          TanStack dùng chung cho mọi phiên bản được giữ nguyên để so sánh A với C công bằng. Số liệu
          và nhật ký ở docs/task2-js-audit.md.
        </p>
      </section>

      <section className="mt-12 border border-line bg-sheet p-6">
        <h2 className="text-2xl">Nhờ nhóm trưởng</h2>
        <p className="mt-3 max-w-3xl leading-relaxed">
          Giữ nguyên mốc A khi thành viên 2 làm bản C, để hai tác động không trộn vào nhau. Khi ghép
          D, đừng để bước đóng gói mã biến ảnh bìa thành một file không còn srcset. Đo ở trạng thái
          mặc định của trang, chưa bấm lọc vùng miền. Mức giảm của cả trang sẽ nhỏ hơn mức giảm của
          riêng nhóm ảnh, vì HTML, CSS, font và JavaScript không nằm trong phần này.
        </p>
      </section>
    </Shell>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="border border-line bg-sheet p-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="num mt-2 font-serif text-3xl text-lacquer">{value}</dd>
      <p className="num mt-2 text-sm text-muted">{note}</p>
    </div>
  );
}
