import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { imageAudit } from "@/data/image-audit";
import { PageIntro, Shell } from "@/components/dossier/Shell";

export const Route = createFileRoute("/chat-luong")({
  component: Quality,
  head: () => ({ meta: [{ title: "Kiểm tra chất lượng ảnh" }] }),
});

function Quality() {
  const [showB, setShowB] = useState(true);

  return (
    <Shell>
      <PageIntro
        kicker="Kiểm tra bằng mắt"
        title="Cùng một khung crop"
        lede="Bản A là JPEG 2400 bị trình duyệt thu nhỏ. Bản B trong ô này là đúng file AVIF mà máy tính DPR 1 sẽ chọn, không phải file điện thoại. Bấm để đổi bản."
      />
      <button
        type="button"
        onClick={() => setShowB((value) => !value)}
        className="mt-6 min-h-11 border border-ink px-4 text-sm"
      >
        Đang xem {showB ? "bản B" : "bản A"} — bấm để đổi
      </button>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {imageAudit.images.map((image) => {
          const chosen = image.delivery.desktop1.avif;
          const src = showB ? chosen.path : image.versionA.path;
          return (
            <figure key={image.id}>
              <div className="frame frame-photo">
                <img src={src} alt={image.alt} />
              </div>
              <figcaption className="mt-3 text-sm leading-relaxed">
                <span className="font-medium text-ink">{image.place}</span>
                <span className="text-muted">
                  {" "}
                  · {showB ? `AVIF ${chosen.width}px` : `JPEG ${image.versionA.width}px`} · PSNR B{" "}
                  {image.quality.psnrAvif} dB · PSNR A cùng cỡ {image.quality.psnrControl} dB
                </span>
                <span className="mt-1 block text-muted">{image.alt}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Shell>
  );
}
