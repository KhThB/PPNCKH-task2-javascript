#!/usr/bin/env node
/**
 * Task 2 — checklist kiểm thử chức năng A, B, C (chạy trên bản build + `vite preview`).
 *
 *   node scripts/task2-check-functional.mjs --base http://127.0.0.1:4173 [--chrome <đường dẫn chrome>]
 *
 * Kiểm tra cho từng phiên bản: số ảnh mặc định, lọc Bắc / Trung / Nam / Tất cả, mở ảnh,
 * đóng bằng nút Đóng, đóng bằng bấm nền, lỗi Console. Riêng C: ảnh tải về trùng với A,
 * không có legacy.js, chunk Lightbox chưa tải trước khi bấm ảnh và chỉ tải sau khi bấm.
 * Thoát với mã 1 nếu có mục không đạt.
 */
import { chromium } from "playwright";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, all) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), all[i + 1]]);
    return acc;
  }, []),
);
const BASE = args.base ?? "http://127.0.0.1:4173";
const BLOCK = ["fonts.googleapis.com", "fonts.gstatic.com", "grok.com"];
const EXPECT = { "Tất cả": 8, Bắc: 3, Trung: 2, Nam: 3 };

const browser = await chromium.launch({ headless: true, executablePath: args.chrome || undefined });
const rows = [];
const imagesByVersion = {};

for (const version of ["a", "b", "c"]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.route(
    (url) => BLOCK.some((h) => url.hostname.endsWith(h)),
    (route) => route.abort(),
  );
  const page = await context.newPage();
  const scripts = [];
  const images = new Set();
  const errors = [];
  page.on("request", (req) => {
    const url = new URL(req.url());
    if (url.origin !== new URL(BASE).origin) return;
    if (req.resourceType() === "script") scripts.push(url.pathname);
    if (req.resourceType() === "image") images.add(url.pathname);
  });
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const loc = m.location()?.url ?? "";
    if (BLOCK.some((h) => loc.includes(h)) || /ERR_FAILED/.test(m.text())) return; // tài nguyên bên thứ ba bị chặn
    errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));

  const check = (name, ok, detail = "") => rows.push({ version, name, ok, detail });

  await page.goto(`${BASE}/lab/${version}`, { waitUntil: "networkidle" });
  const frames = page.locator("main, body").locator("button.frame img");
  check("Mặc định hiển thị 8 ảnh", (await frames.count()) === 8, String(await frames.count()));
  imagesByVersion[version] = [...images].sort();

  const legacy = await page.evaluate(() => typeof window.__phoBienLegacy !== "undefined");
  const legacyRequested = scripts.includes("/lab/legacy.js");
  if (version === "c") {
    check("Không tải legacy.js", !legacyRequested && !legacy);
    const lightboxBefore = scripts.some((s) => /\/Lightbox-[\w-]+\.js$/.test(s));
    check("Chunk Lightbox chưa tải trước khi bấm ảnh", !lightboxBefore, scripts.join(" "));
  } else {
    check("Vẫn tải legacy.js như mốc", legacyRequested && legacy);
  }

  for (const label of ["Bắc", "Trung", "Nam", "Tất cả"]) {
    await page
      .getByRole("group", { name: "Lọc địa danh" })
      .getByRole("button", { name: label, exact: true })
      .click();
    const n = await frames.count();
    check(`Lọc "${label}" còn ${EXPECT[label]} ảnh`, n === EXPECT[label], String(n));
  }

  // Mở ảnh bìa, đóng bằng nút Đóng
  await frames.first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
  const shown = await dialog.isVisible();
  const src = shown ? await dialog.locator("img").getAttribute("src") : null;
  const expectedSrc = version === "b" ? /^\/lab\/b\/hoian-/ : /^\/lab\/a\/hoian\.jpg$/;
  check("Bấm ảnh bìa mở hộp xem ảnh đúng ảnh", shown && expectedSrc.test(src ?? ""), String(src));
  if (version === "c") {
    const lightboxAfter = scripts.some((s) => /\/Lightbox-[\w-]+\.js$/.test(s));
    check("Chunk Lightbox tải sau khi bấm ảnh", lightboxAfter);
  }
  await dialog
    .getByRole("button", { name: "Đóng" })
    .click()
    .catch(() => {});
  check("Nút Đóng đóng hộp xem ảnh", (await dialog.count()) === 0);

  // Mở ảnh khác, đóng bằng bấm nền
  await frames.nth(3).click();
  await dialog.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
  const opened = await dialog.isVisible();
  await page.mouse.click(10, 450);
  check("Bấm nền đóng hộp xem ảnh", opened && (await dialog.count()) === 0);

  // Bấm vào chính ảnh trong hộp không được đóng
  await frames.nth(1).click();
  await dialog.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
  await dialog
    .locator("img")
    .click()
    .catch(() => {});
  check("Bấm vào ảnh trong hộp không đóng hộp", (await dialog.count()) === 1);

  check("Console không có lỗi", errors.length === 0, errors.join(" | "));
  await context.close();
}

const sameImages = JSON.stringify(imagesByVersion.a) === JSON.stringify(imagesByVersion.c);
rows.push({
  version: "c",
  name: "Ảnh tải về giống hệt A",
  ok: sameImages,
  detail: imagesByVersion.c.join(" "),
});
await browser.close();

let failed = 0;
for (const r of rows) {
  if (!r.ok) failed++;
  console.log(
    `${r.ok ? "ĐẠT " : "LỖI "} [${r.version.toUpperCase()}] ${r.name}${r.ok || !r.detail ? "" : ` — ${r.detail}`}`,
  );
}
console.log(`\n${rows.length - failed}/${rows.length} mục đạt`);
if (process.argv.includes("--json")) console.log(JSON.stringify(rows));
process.exit(failed ? 1 : 0);
