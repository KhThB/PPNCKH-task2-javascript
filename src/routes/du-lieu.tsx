import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { imageAudit } from "@/data/image-audit";
import { formatBytes, formatPct, reductionPct } from "@/lib/format";
import { PageIntro, Shell } from "@/components/dossier/Shell";

export const Route = createFileRoute("/du-lieu")({
  component: DataPage,
  head: () => ({ meta: [{ title: "Bảng dung lượng ảnh" }] }),
});

type ScenarioId = "desktop1" | "desktop2" | "mobile2";

function DataPage() {
  const [scenario, setScenario] = useState<ScenarioId>("desktop1");
  const current = imageAudit.totals[scenario];
  const ab = imageAudit.ablationTotals;
  const perImage = imageAudit.images.map((image) => {
    const slot = image.delivery[scenario];
    return {
      place: image.place,
      a: Math.round(slot.aBytes / 1024),
      b: Math.round(slot.avif.bytes / 1024),
    };
  });
  const ablation = [
    { name: "JPEG 2400", kb: Math.round(ab.controlJpeg2400 / 1024) },
    { name: "Chỉ WebP", kb: Math.round(ab.formatOnlyWebp / 1024) },
    { name: "Chỉ thu nhỏ", kb: Math.round(ab.resizeOnlyJpeg / 1024) },
    { name: "WebP đúng cỡ", kb: Math.round(ab.resizeAndWebp / 1024) },
    { name: "AVIF đúng cỡ", kb: Math.round(ab.resizeAndAvif / 1024) },
  ];

  return (
    <Shell>
      <PageIntro
        kicker="Số liệu phần ảnh"
        title="Byte trước và sau, không quy về một điểm"
        lede="Ước lượng theo sizes và DPR. Tổng là lúc cuộn hết trang. Mức giảm = (A − B) / A."
      />

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Kịch bản màn hình">
        {imageAudit.scenarios.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setScenario(item.id)}
            className={
              scenario === item.id
                ? "min-h-11 border border-ink bg-ink px-3 text-sm text-paper"
                : "min-h-11 border border-line px-3 text-sm"
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Mini label="Cả trang, bản A" value={formatBytes(current.allImages.a)} />
        <Mini label="Cả trang, AVIF" value={formatBytes(current.allImages.avif)} />
        <Mini label="Mức giảm AVIF" value={formatPct(current.allImages.avifReductionPct)} />
      </div>

      <div className="mt-8 h-80 border border-line bg-sheet p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={perImage}>
            <CartesianGrid stroke="#e3dcd0" vertical={false} />
            <XAxis dataKey="place" stroke="#6b645a" fontSize={12} />
            <YAxis stroke="#6b645a" fontSize={12} unit=" KB" />
            <Tooltip />
            <Legend />
            <Bar dataKey="a" name="Bản A (KB)" fill="#1c1915" />
            <Bar dataKey="b" name="AVIF (KB)" fill="#8f2d1c" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 overflow-x-auto border border-line">
        <table className="wide-table w-full text-left text-sm">
          <thead className="bg-sheet text-muted">
            <tr>
              <th className="px-3 py-3 font-medium">Ảnh</th>
              <th className="px-3 py-3 font-medium">Vai trò</th>
              <th className="px-3 py-3 font-medium">Nguồn</th>
              <th className="px-3 py-3 font-medium">Bản A</th>
              <th className="px-3 py-3 font-medium">AVIF chọn</th>
              <th className="px-3 py-3 font-medium">WebP chọn</th>
              <th className="px-3 py-3 font-medium">Giảm AVIF</th>
              <th className="px-3 py-3 font-medium">PSNR B</th>
              <th className="px-3 py-3 font-medium">PSNR A cùng cỡ</th>
            </tr>
          </thead>
          <tbody>
            {imageAudit.images.map((image) => {
              const slot = image.delivery[scenario];
              const cut = reductionPct(slot.aBytes, slot.avif.bytes);
              return (
                <tr key={image.id} className="border-t border-line">
                  <td className="px-3 py-3">{image.place}</td>
                  <td className="px-3 py-3 text-muted">{image.role}</td>
                  <td className="num px-3 py-3">{formatBytes(image.source.bytes)}</td>
                  <td className="num px-3 py-3">{formatBytes(slot.aBytes)}</td>
                  <td className="num px-3 py-3">
                    {formatBytes(slot.avif.bytes)}
                    <span className="text-muted"> · {slot.avif.width}px</span>
                  </td>
                  <td className="num px-3 py-3">{formatBytes(slot.webp.bytes)}</td>
                  <td className="num px-3 py-3 text-lacquer">{formatPct(cut)}</td>
                  <td className="num px-3 py-3">{image.quality.psnrAvif} dB</td>
                  <td className="num px-3 py-3">{image.quality.psnrControl} dB</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-2xl">Tách kỹ thuật trên dung lượng file</h2>
      <p className="mt-3 max-w-3xl leading-relaxed text-muted">
        Mốc là máy tính DPR 1. “Chỉ WebP” giữ nguyên số pixel của bản A. “Chỉ thu nhỏ” vẫn là JPEG
        cùng chất lượng, nhưng đúng bề rộng mà bản B sẽ chọn. Không đổi các con số này thành mili-giây.
      </p>
      <div className="mt-6 h-72 border border-line bg-sheet p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ablation}>
            <CartesianGrid stroke="#e3dcd0" vertical={false} />
            <XAxis dataKey="name" stroke="#6b645a" fontSize={12} />
            <YAxis stroke="#6b645a" fontSize={12} unit=" KB" />
            <Tooltip />
            <Bar dataKey="kb" name="Tổng KB" fill="#8f2d1c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="num mt-4 max-w-3xl space-y-2 text-sm leading-relaxed">
        <li>JPEG 2400: {formatBytes(ab.controlJpeg2400)}</li>
        <li>
          Chỉ đổi WebP: {formatBytes(ab.formatOnlyWebp)} (
          {formatPct(reductionPct(ab.controlJpeg2400, ab.formatOnlyWebp))})
        </li>
        <li>
          Chỉ thu nhỏ JPEG: {formatBytes(ab.resizeOnlyJpeg)} (
          {formatPct(reductionPct(ab.controlJpeg2400, ab.resizeOnlyJpeg))})
        </li>
        <li>
          Thu nhỏ và WebP: {formatBytes(ab.resizeAndWebp)} (
          {formatPct(reductionPct(ab.controlJpeg2400, ab.resizeAndWebp))})
        </li>
        <li>
          Thu nhỏ và AVIF: {formatBytes(ab.resizeAndAvif)} (
          {formatPct(reductionPct(ab.controlJpeg2400, ab.resizeAndAvif))})
        </li>
      </ul>

      <p className="mt-10 max-w-3xl leading-relaxed text-muted">
        Đã mở hai trang bằng Chromium, cache tắt, một lượt mỗi kịch bản — chỉ để xem trình duyệt
        chọn file nào, không phải quy trình năm lần của thành viên 3. Bản B chọn đúng bậc trong bảng:
        máy tính DPR 1 lấy ảnh bìa 1600 px, truyện chính 800 px, thẻ và ô thư viện 480 px, ảnh khép
        1200 px; DPR 2 và điện thoại DPR 2 cũng khớp. Cả tám ảnh vẫn bị tải dù có lazy, vì kết nối
        này nhanh. Byte trong bảng là kích thước file, chưa phải số cột Network của máy đo chính thức.
      </p>
    </Shell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-sheet p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="num mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
