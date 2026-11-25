import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { imageAudit } from "@/data/image-audit";
import { findImage, LabImage, type LabVariant } from "@/components/magazine/LabImage";

const FILTERS = ["Tất cả", "Bắc", "Trung", "Nam"] as const;

export function MagazinePage({ variant }: { variant: LabVariant }) {
  const [region, setRegion] = useState<(typeof FILTERS)[number]>("Tất cả");
  const [openId, setOpenId] = useState<string | null>(null);
  const hero = findImage("hoian");
  const open = openId ? findImage(openId) : null;

  const avifPreload = useMemo(
    () => hero.versionB.avif.map((item) => `${item.path} ${item.width}w`).join(", "),
    [hero],
  );

  function visible(id: string) {
    if (region === "Tất cả") return true;
    return findImage(id).region === region;
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {variant === "b" ? (
        <link
          rel="preload"
          as="image"
          href={hero.versionB.avif[hero.versionB.avif.length - 1]?.path}
          imageSrcSet={avifPreload}
          imageSizes={hero.sizes}
          fetchPriority="high"
          type="image/avif"
        />
      ) : null}
      <script src="/lab/legacy.js" />

      <header className="sheet-wrap flex flex-col gap-6 px-5 py-6 md:px-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-lacquer">
              {variant === "a" ? "Phiên bản A · đối chứng" : "Phiên bản B · chỉ tối ưu hình ảnh"}
            </p>
            <h1 className="text-5xl leading-none tracking-tight">Phố & Biển</h1>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Tập san thí nghiệm số 01. Nội dung và mã JavaScript giống nhau ở cả hai bản. Khác nhau ở
            cách giao ảnh.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc địa danh">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRegion(item)}
              className={
                item === region
                  ? "min-h-11 border border-ink bg-ink px-4 text-sm text-paper"
                  : "min-h-11 border border-line bg-sheet px-4 text-sm text-ink"
              }
            >
              {item}
            </button>
          ))}
          <Link
            to="/"
            className="ml-auto inline-flex min-h-11 items-center text-sm text-muted underline decoration-line underline-offset-4"
          >
            Hồ sơ bàn giao
          </Link>
        </div>
      </header>

      {visible("hoian") ? (
        <article>
          <button type="button" className="frame frame-wide block w-full" onClick={() => setOpenId("hoian")}>
            <LabImage image={hero} variant={variant} />
          </button>
          <div className="sheet-wrap px-5 py-8 md:px-0">
            <p className="text-sm text-lacquer">Hội An · Trung</p>
            <h2 className="mt-2 max-w-3xl text-4xl leading-tight">{hero.title}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
              Ảnh này là ứng viên LCP: nó chiếm gần hết màn hình đầu tiên. Bản A giao một JPEG cạnh
              dài 2400 pixel cho mọi thiết bị. Bản B khai báo srcset, ưu tiên tải ảnh bìa và không
              gắn lazy cho riêng tấm này.
            </p>
          </div>
        </article>
      ) : null}

      <section className="sheet-wrap story-grid px-5 pb-12 md:px-0">
        {visible("sapa") ? (
          <article>
            <Figure id="sapa" variant={variant} onOpen={setOpenId} aspect="frame-photo" />
            <Caption id="sapa" />
          </article>
        ) : null}
        <div className="grid gap-8">
          {visible("halong") ? (
            <article>
              <Figure id="halong" variant={variant} onOpen={setOpenId} aspect="frame-photo" />
              <Caption id="halong" />
            </article>
          ) : null}
          {visible("hue") ? (
            <article>
              <Figure id="hue" variant={variant} onOpen={setOpenId} aspect="frame-photo" />
              <Caption id="hue" />
            </article>
          ) : null}
        </div>
      </section>

      <section className="sheet-wrap tile-grid px-5 pb-12 md:px-0">
        {(["hanoi", "mekong", "saigon"] as const).map((id) =>
          visible(id) ? (
            <article key={id}>
              <Figure id={id} variant={variant} onOpen={setOpenId} aspect="frame-photo" />
              <Caption id={id} />
            </article>
          ) : null,
        )}
      </section>

      {visible("phuquoc") ? (
        <article className="pb-16">
          <div className="sheet-wrap px-5 md:px-0">
            <button
              type="button"
              className="frame frame-wide block w-full"
              onClick={() => setOpenId("phuquoc")}
            >
              <LabImage image={findImage("phuquoc")} variant={variant} />
            </button>
            <div className="mt-6 max-w-2xl">
              <Caption id="phuquoc" />
              <p className="mt-4 leading-relaxed">
                Bốn phiên bản của đề tài phải giữ nguyên câu chữ và chức năng lọc, phóng ảnh. Bản D
                sau này lấy cách giao ảnh của bản B và phần JavaScript đã được thành viên 2 tối ưu.
                Đừng đo trang này sau khi đã bấm lọc — trạng thái mặc định mới là mốc.
              </p>
            </div>
          </div>
        </article>
      ) : null}

      <footer className="border-t border-line bg-sheet">
        <div className="sheet-wrap px-5 py-8 text-sm leading-relaxed text-muted md:px-0">
          <p className="font-medium text-ink">Nguồn ảnh</p>
          <ul className="mt-3 space-y-2">
            {imageAudit.images.map((image) => (
              <li key={image.id}>
                {image.place}: {image.source.artist}, {image.source.license}.{" "}
                <a className="underline" href={image.source.sourceUrl}>
                  {image.source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>

      {open ? (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={open.alt}
          onClick={() => setOpenId(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 z-10 min-h-11 border border-paper px-4 text-sm text-paper"
            onClick={() => setOpenId(null)}
          >
            Đóng
          </button>
          <img
            src={
              variant === "a"
                ? open.versionA.path
                : open.versionB.avif[open.versionB.avif.length - 1]?.path
            }
            alt={open.alt}
            className="lightbox-photo relative"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}

function Figure({
  id,
  variant,
  onOpen,
  aspect,
}: {
  id: string;
  variant: LabVariant;
  onOpen: (id: string) => void;
  aspect: string;
}) {
  return (
    <button type="button" className={`frame ${aspect} block w-full`} onClick={() => onOpen(id)}>
      <LabImage image={findImage(id)} variant={variant} />
    </button>
  );
}

function Caption({ id }: { id: string }) {
  const image = findImage(id);
  return (
    <div className="mt-3">
      <p className="text-sm text-lacquer">
        {image.place} · {image.region}
      </p>
      <h2 className="mt-1 text-2xl leading-snug">{image.title}</h2>
    </div>
  );
}
