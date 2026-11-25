/* Trang Phố & Biển cho bản C — chỉ tối ưu JavaScript.
 *
 * Giữ nguyên so với bản A: câu chữ, thứ tự khối, class CSS, bộ lọc vùng, cách mở và đóng ảnh,
 * và ẢNH (JPEG 2400 px của A, cùng thẻ <img src> như LabImage variant "a").
 *
 * Khác bản A, chỉ ở phần JavaScript:
 *   1. Không gắn /lab/legacy.js (tệp không minify, không phục vụ hành vi nào của giao diện).
 *   2. Hộp xem ảnh là chunk riêng, React.lazy — chỉ tải khi người dùng bấm ảnh.
 *   3. Không import src/data/image-audit.ts (~20 KB bảng số liệu của Task 1); dùng
 *      src/data/lab-images-a.ts chỉ chứa các trường giao diện cần (sinh tự động từ image-audit).
 *   4. Bỏ phép tính srcset AVIF (useMemo) mà bản A tính rồi không dùng.
 * Mọi mã ở đây nằm trong src nên được Vite đóng gói và minify khi build.
 *
 * imageVariant và jsVariant được tách rõ: bản C cố định imageVariant = "a". Bản D sau này giữ
 * jsVariant "optimized" của trang này và thay phần giao ảnh bằng cách của bản B.
 */
import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { labImagesA, type LabImageA } from "@/data/lab-images-a";

const Lightbox = lazy(() => import("@/components/magazine/Lightbox"));

const FILTERS = ["Tất cả", "Bắc", "Trung", "Nam"] as const;
const IMAGE_VARIANT = "a";
const JS_VARIANT = "optimized";

const byId = new Map(labImagesA.map((image) => [image.id, image]));

function findImage(id: string): LabImageA {
  const image = byId.get(id);
  if (!image) throw new Error(`Missing image ${id}`);
  return image;
}

/** Ảnh giao theo cách của bản A: một JPEG cho mọi kích thước, không srcset, không lazy. */
function LabImageA({ image }: { image: LabImageA }) {
  return <img src={image.src} alt={image.alt} />;
}

export function MagazinePageC() {
  const [region, setRegion] = useState<(typeof FILTERS)[number]>("Tất cả");
  const [openId, setOpenId] = useState<string | null>(null);
  const hero = findImage("hoian");
  const open = openId ? findImage(openId) : null;

  function visible(id: string) {
    if (region === "Tất cả") return true;
    return findImage(id).region === region;
  }

  return (
    <div
      className="min-h-screen bg-paper text-ink"
      data-image-variant={IMAGE_VARIANT}
      data-js-variant={JS_VARIANT}
    >
      <header className="sheet-wrap flex flex-col gap-6 px-5 py-6 md:px-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-lacquer">Phiên bản C · chỉ tối ưu JavaScript</p>
            <h1 className="text-5xl leading-none tracking-tight">Phố & Biển</h1>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Tập san thí nghiệm số 01. Nội dung và ảnh giống hệt bản A. Khác nhau ở phần mã
            JavaScript.
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
          <button
            type="button"
            className="frame frame-wide block w-full"
            onClick={() => setOpenId("hoian")}
          >
            <LabImageA image={hero} />
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
            <Figure id="sapa" onOpen={setOpenId} aspect="frame-photo" />
            <Caption id="sapa" />
          </article>
        ) : null}
        <div className="grid gap-8">
          {visible("halong") ? (
            <article>
              <Figure id="halong" onOpen={setOpenId} aspect="frame-photo" />
              <Caption id="halong" />
            </article>
          ) : null}
          {visible("hue") ? (
            <article>
              <Figure id="hue" onOpen={setOpenId} aspect="frame-photo" />
              <Caption id="hue" />
            </article>
          ) : null}
        </div>
      </section>

      <section className="sheet-wrap tile-grid px-5 pb-12 md:px-0">
        {(["hanoi", "mekong", "saigon"] as const).map((id) =>
          visible(id) ? (
            <article key={id}>
              <Figure id={id} onOpen={setOpenId} aspect="frame-photo" />
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
              <LabImageA image={findImage("phuquoc")} />
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
            {labImagesA.map((image) => (
              <li key={image.id}>
                {image.place}: {image.credit.artist}, {image.credit.license}.{" "}
                <a className="underline" href={image.credit.sourceUrl}>
                  {image.credit.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>

      {open ? (
        <Suspense
          fallback={
            <div
              className="fixed inset-0 z-20 bg-ink/90"
              aria-hidden="true"
              onClick={() => setOpenId(null)}
            />
          }
        >
          <Lightbox src={open.src} alt={open.alt} onClose={() => setOpenId(null)} />
        </Suspense>
      ) : null}
    </div>
  );
}

function Figure({
  id,
  onOpen,
  aspect,
}: {
  id: string;
  onOpen: (id: string) => void;
  aspect: string;
}) {
  return (
    <button type="button" className={`frame ${aspect} block w-full`} onClick={() => onOpen(id)}>
      <LabImageA image={findImage(id)} />
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
