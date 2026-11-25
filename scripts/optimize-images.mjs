import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = "/workspace";
const mastersDir = path.join(root, "assets/masters");
const publicLab = path.join(root, "public/lab");
const outFile = path.join(root, "src/data/image-audit.ts");

const WIDTHS = [480, 800, 1200, 1600, 2400];
const JPEG_Q = 86;
const WEBP_Q = 82;
const AVIF_Q = 72;

/** slots describe the real magazine layout. cssPx must match `sizes`. */
const images = [
  {
    id: "hoian",
    slot: "hero",
    place: "Hội An",
    region: "Trung",
    title: "Đêm đèn lồng bên sông Hoài",
    alt: "Phố cổ Hội An lúc chạng vạng, đèn lồng vàng phản chiếu trên mặt đường đá",
    sizes: "100vw",
    cssPx: { desktop: 1440, mobile: 390 },
    role: "Ảnh bìa — ứng viên LCP",
    creditKey: "hoian",
  },
  {
    id: "sapa",
    slot: "feature",
    place: "Sa Pa",
    region: "Bắc",
    title: "Ruộng bậc thang sau mưa",
    alt: "Ruộng bậc thang Sa Pa trải lớp xanh trên sườn núi",
    sizes: "(min-width: 1200px) 46rem, 100vw",
    cssPx: { desktop: 736, mobile: 390 },
    role: "Ảnh truyện chính",
    creditKey: "sapa",
  },
  {
    id: "halong",
    slot: "card",
    place: "Hạ Long",
    region: "Bắc",
    title: "Vịnh, sớm và thuyền",
    alt: "Thuyền buồm gỗ trên vịnh Hạ Long lúc bình minh, xa là các đảo đá",
    sizes: "(min-width: 1200px) 22rem, 100vw",
    cssPx: { desktop: 352, mobile: 390 },
    role: "Thẻ truyện",
    creditKey: "halong",
  },
  {
    id: "hue",
    slot: "card",
    place: "Huế",
    region: "Trung",
    title: "Bún bò trên bàn gỗ",
    alt: "Tô bún bò Huế và rau thơm trên bàn gỗ, ánh sáng cửa sổ",
    sizes: "(min-width: 1200px) 22rem, 100vw",
    cssPx: { desktop: 352, mobile: 390 },
    role: "Thẻ truyện",
    creditKey: "hue",
  },
  {
    id: "hanoi",
    slot: "tile",
    place: "Hà Nội",
    region: "Bắc",
    title: "Phố cổ vừa mở hàng",
    alt: "Gánh hàng rong trên phố cổ Hà Nội buổi sáng",
    sizes: "(min-width: 1200px) 23rem, 100vw",
    cssPx: { desktop: 368, mobile: 390 },
    role: "Ô thư viện ảnh",
    creditKey: "hanoi",
  },
  {
    id: "mekong",
    slot: "tile",
    place: "Cần Thơ",
    region: "Nam",
    title: "Chợ nổi, sông còn sương",
    alt: "Ghe hàng hóa trên chợ nổi sông nước miền Tây",
    sizes: "(min-width: 1200px) 23rem, 100vw",
    cssPx: { desktop: 368, mobile: 390 },
    role: "Ô thư viện ảnh",
    creditKey: "mekong",
  },
  {
    id: "saigon",
    slot: "tile",
    place: "Sài Gòn",
    region: "Nam",
    title: "Phố đêm chưa nguội",
    alt: "Đường phố trung tâm Thành phố Hồ Chí Minh về đêm",
    sizes: "(min-width: 1200px) 23rem, 100vw",
    cssPx: { desktop: 368, mobile: 390 },
    role: "Ô thư viện ảnh",
    creditKey: "saigon",
  },
  {
    id: "phuquoc",
    slot: "close",
    place: "Phú Quốc",
    region: "Nam",
    title: "Bãi sáng, trước khi đông người",
    alt: "Bãi biển Phú Quốc buổi sáng, nước nông trong và thuyền gỗ neo xa",
    sizes: "(min-width: 1200px) 72rem, 100vw",
    cssPx: { desktop: 1152, mobile: 390 },
    role: "Ảnh khép bài",
    creditKey: "phuquoc",
  },
];

const extraCredits = {
  hoian: {
    title: "Hội An, Ancient Town, 2020-01 CN-11.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:H%E1%BB%99i_An,_Ancient_Town,_2020-01_CN-11.jpg",
    artist: "Steffen Schmitz",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  halong: {
    title: "Asia Cruise Junk in Halong bay.JPG",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Asia_Cruise_Junk_in_Halong_bay.JPG",
    artist: "Arianos",
    license: "Public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/File:Asia_Cruise_Junk_in_Halong_bay.JPG",
  },
};

function pick(variants, target) {
  const sorted = [...variants].sort((a, b) => a.width - b.width);
  return sorted.find((v) => v.width >= target) ?? sorted[sorted.length - 1];
}

function psnr(ref, cmp) {
  const n = Math.min(ref.length, cmp.length);
  let mse = 0;
  for (let i = 0; i < n; i++) {
    const d = ref[i] - cmp[i];
    mse += d * d;
  }
  mse /= n;
  if (mse === 0) return 99;
  return 10 * Math.log10((255 * 255) / mse);
}

async function rawPair(master, encoded) {
  const meta = await sharp(encoded).metadata();
  const ref = await sharp(master)
    .rotate()
    .resize(meta.width, meta.height, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer();
  const cmp = await sharp(encoded).removeAlpha().raw().toBuffer();
  return psnr(ref, cmp);
}

const credits = {
  ...extraCredits,
  ...JSON.parse(fs.readFileSync(path.join(mastersDir, "credits.json"), "utf8")),
};

fs.rmSync(path.join(publicLab, "a"), { recursive: true, force: true });
fs.rmSync(path.join(publicLab, "b"), { recursive: true, force: true });
fs.mkdirSync(path.join(publicLab, "a"), { recursive: true });
fs.mkdirSync(path.join(publicLab, "b"), { recursive: true });

const scenarios = [
  { id: "desktop1", label: "Máy tính 1440 × 900, DPR 1", dpr: 1, viewport: "desktop" },
  { id: "desktop2", label: "Máy tính 1440 × 900, DPR 2", dpr: 2, viewport: "desktop" },
  { id: "mobile2", label: "Điện thoại 390 × 844, DPR 2", dpr: 2, viewport: "mobile" },
];

const records = [];

for (const image of images) {
  const masterPath = path.join(mastersDir, `${image.id}.jpg`);
  const credit = credits[image.creditKey];
  if (!credit) throw new Error("missing credit " + image.id);
  const sourceBytes = fs.statSync(masterPath).size;
  const oriented = sharp(masterPath).rotate();
  const meta = await oriented.metadata();

  const aName = `${image.id}.jpg`;
  const aPath = path.join(publicLab, "a", aName);
  await sharp(masterPath)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: JPEG_Q, mozjpeg: true })
    .toFile(aPath);
  const aMeta = await sharp(aPath).metadata();
  const aBytes = fs.statSync(aPath).size;

  const webp = [];
  const avif = [];
  for (const width of WIDTHS) {
    if (width > aMeta.width) continue;
    const webpName = `${image.id}-${width}.webp`;
    const avifName = `${image.id}-${width}.avif`;
    const webpPath = path.join(publicLab, "b", webpName);
    const avifPath = path.join(publicLab, "b", avifName);
    await sharp(masterPath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_Q, effort: 4 })
      .toFile(webpPath);
    await sharp(masterPath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: AVIF_Q, effort: 4 })
      .toFile(avifPath);
    const wMeta = await sharp(webpPath).metadata();
    webp.push({
      width: wMeta.width,
      height: wMeta.height,
      bytes: fs.statSync(webpPath).size,
      path: `/lab/b/${webpName}`,
    });
    const aV = await sharp(avifPath).metadata();
    avif.push({
      width: aV.width,
      height: aV.height,
      bytes: fs.statSync(avifPath).size,
      path: `/lab/b/${avifName}`,
    });
    process.stdout.write(`  ${image.id} ${width}\n`);
  }

  const fallbackName = `${image.id}-fallback.jpg`;
  const fallbackWidth = Math.min(1200, aMeta.width);
  const fallbackPath = path.join(publicLab, "b", fallbackName);
  await sharp(masterPath)
    .rotate()
    .resize({ width: fallbackWidth, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(fallbackPath);

  const delivery = {};
  const ablation = {};
  for (const scenario of scenarios) {
    const css = image.cssPx[scenario.viewport];
    const target = Math.ceil(css * scenario.dpr);
    const chosenAvif = pick(avif, target);
    const chosenWebp = pick(webp, target);
    delivery[scenario.id] = {
      cssPx: css,
      targetPx: target,
      aBytes,
      avif: { width: chosenAvif.width, bytes: chosenAvif.bytes, path: chosenAvif.path },
      webp: { width: chosenWebp.width, bytes: chosenWebp.bytes, path: chosenWebp.path },
    };
  }

  const desk = delivery.desktop1;
  const jpegOnly = await sharp(masterPath)
    .rotate()
    .resize({ width: desk.avif.width, withoutEnlargement: true })
    .jpeg({ quality: JPEG_Q, mozjpeg: true })
    .toBuffer();
  const webpFull = await sharp(masterPath)
    .rotate()
    .resize({ width: aMeta.width, height: aMeta.height, fit: "fill" })
    .webp({ quality: WEBP_Q, effort: 4 })
    .toBuffer();
  const avifBuf = fs.readFileSync(path.join(root, "public", desk.avif.path.slice(1)));
  const webpBuf = fs.readFileSync(path.join(root, "public", desk.webp.path.slice(1)));
  const psnrAvif = await rawPair(masterPath, avifBuf);
  const psnrWebp = await rawPair(masterPath, webpBuf);
  const ref = await sharp(masterPath)
    .rotate()
    .resize({ width: desk.avif.width })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const controlRaw = await sharp(aPath)
    .resize(ref.info.width, ref.info.height, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer();
  const psnrControl = psnr(ref.data, controlRaw);

  ablation.desktop1 = {
    controlJpeg2400: aBytes,
    formatOnlyWebp: webpFull.length,
    resizeOnlyJpeg: jpegOnly.length,
    resizeAndAvif: desk.avif.bytes,
    resizeAndWebp: desk.webp.bytes,
    pickedWidth: desk.avif.width,
  };

  records.push({
    id: image.id,
    slot: image.slot,
    place: image.place,
    region: image.region,
    title: image.title,
    alt: image.alt,
    sizes: image.sizes,
    role: image.role,
    source: {
      bytes: sourceBytes,
      width: meta.width,
      height: meta.height,
      title: credit.title,
      artist: credit.artist,
      license: credit.license,
      licenseUrl: credit.licenseUrl,
      sourceUrl: credit.sourceUrl,
    },
    versionA: {
      path: `/lab/a/${aName}`,
      bytes: aBytes,
      width: aMeta.width,
      height: aMeta.height,
      format: "image/jpeg",
      quality: JPEG_Q,
    },
    versionB: {
      avif,
      webp,
      fallback: {
        path: `/lab/b/${fallbackName}`,
        bytes: fs.statSync(fallbackPath).size,
        width: fallbackWidth,
      },
    },
    delivery,
    ablation: ablation.desktop1,
    quality: {
      psnrAvif: Math.round(psnrAvif * 10) / 10,
      psnrWebp: Math.round(psnrWebp * 10) / 10,
      psnrControl: Math.round(psnrControl * 10) / 10,
      comparedWidth: desk.avif.width,
      note: "PSNR so với ảnh gốc đã thu về đúng bề rộng ứng viên máy tính DPR 1. psnrControl là JPEG bản A bị thu về cùng bề rộng — mốc chất lượng hiển thị, vì thu nhỏ file lớn che bớt lỗi nén.",
    },
  });
  console.log(
    image.id,
    "A",
    aBytes,
    "AVIF@desk",
    desk.avif.bytes,
    "PSNR",
    records.at(-1).quality.psnrAvif,
  );
}

function sum(list, fn) {
  return list.reduce((s, item) => s + fn(item), 0);
}

const totals = {};
for (const scenario of scenarios) {
  const a = sum(records, (r) => r.delivery[scenario.id].aBytes);
  const avif = sum(records, (r) => r.delivery[scenario.id].avif.bytes);
  const webp = sum(records, (r) => r.delivery[scenario.id].webp.bytes);
  const hero = records[0].delivery[scenario.id];
  totals[scenario.id] = {
    label: scenario.label,
    allImages: {
      a,
      avif,
      webp,
      avifReductionPct: a === 0 ? 0 : ((a - avif) / a) * 100,
      webpReductionPct: a === 0 ? 0 : ((a - webp) / a) * 100,
    },
    hero: {
      a: hero.aBytes,
      avif: hero.avif.bytes,
      webp: hero.webp.bytes,
      avifWidth: hero.avif.width,
      webpWidth: hero.webp.width,
      avifReductionPct: ((hero.aBytes - hero.avif.bytes) / hero.aBytes) * 100,
    },
  };
}

const ablationTotals = {
  controlJpeg2400: sum(records, (r) => r.ablation.controlJpeg2400),
  formatOnlyWebp: sum(records, (r) => r.ablation.formatOnlyWebp),
  resizeOnlyJpeg: sum(records, (r) => r.ablation.resizeOnlyJpeg),
  resizeAndWebp: sum(records, (r) => r.ablation.resizeAndWebp),
  resizeAndAvif: sum(records, (r) => r.ablation.resizeAndAvif),
};

const audit = {
  subject: "Phố & Biển",
  versionA: "Đối chứng — JPEG cạnh dài 2400px, chất lượng 86, một tệp cho mọi kích thước hiển thị",
  versionB: "Chỉ tối ưu hình ảnh — AVIF/WebP responsive, JPEG dự phòng, lazy trừ ảnh LCP, fetchpriority, width/height",
  pipeline: {
    tool: "sharp (libvips)",
    jpegQuality: JPEG_Q,
    webpQuality: WEBP_Q,
    avifQuality: AVIF_Q,
    widths: WIDTHS,
    longEdgeControl: 2400,
  },
  scenarios,
  images: records,
  totals,
  ablationTotals,
  meanPsnr: {
    avif: Math.round((sum(records, (r) => r.quality.psnrAvif) / records.length) * 10) / 10,
    webp: Math.round((sum(records, (r) => r.quality.psnrWebp) / records.length) * 10) / 10,
    control: Math.round((sum(records, (r) => r.quality.psnrControl) / records.length) * 10) / 10,
  },
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
const ts = `/* Generated by scripts/optimize-images.mjs. Do not edit by hand. */\nexport const imageAudit = ${JSON.stringify(audit, null, 2)} as const;\n`;
fs.writeFileSync(outFile, ts);
console.log("wrote", outFile);
console.log(JSON.stringify(totals, null, 2));
