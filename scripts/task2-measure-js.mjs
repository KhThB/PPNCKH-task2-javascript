#!/usr/bin/env node
/**
 * Task 2 — đo JavaScript của các phiên bản thí nghiệm (A, B, C) bằng Chromium + CDP.
 *
 * Cách dùng (sau khi đã build và chạy `vite preview`):
 *   node scripts/task2-measure-js.mjs --base http://127.0.0.1:4173 --runs 5 --out artifacts/task2-js/raw
 *   node scripts/task2-measure-js.mjs --paths /lab/a,/lab/c --chrome "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
 *
 * Mỗi lượt: context mới, tắt cache, tải trang ở trạng thái mặc định (chưa bấm lọc),
 * chờ mạng yên, rồi ghi:
 *   - số request JavaScript, transferred (encodedDataLength) và resource size (byte giải nén)
 *   - JS coverage (byte dùng / không dùng) tính đến lúc trang tải xong
 *   - ScriptDuration, TaskDuration của CDP Performance.getMetrics
 *   - Long task > 50 ms (cách tính TBT ở phía trình duyệt, không giả lập CPU)
 * Không chạm vào tệp nào của dự án; chỉ ghi JSON vào thư mục --out.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, all) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), all[i + 1]]);
    return acc;
  }, []),
);
const BASE = args.base ?? "http://127.0.0.1:4173";
const RUNS = Number(args.runs ?? 5);
const PATHS = (args.paths ?? "/lab/a,/lab/b,/lab/c,/lab/d").split(",");
const OUT = args.out ?? "artifacts/task2-js/raw";
const CHROME = args.chrome; // để trống thì dùng Chromium của Playwright
// Tài nguyên bên thứ ba bị chặn để mọi phiên bản đo trong cùng điều kiện mạng.
const BLOCK = (args.block ?? "fonts.googleapis.com,fonts.gstatic.com,grok.com")
  .split(",")
  .filter(Boolean);

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: CHROME || undefined,
  args: ["--no-first-run", "--disable-extensions"],
});

const results = [];
for (const path of PATHS) {
  for (let run = 1; run <= RUNS; run++) {
    results.push(await measure(path, run));
    const r = results.at(-1);
    console.log(
      `${path} #${run}: js=${r.js.requests} req, ${r.js.transferred} B transferred, ${r.js.resource} B resource, ` +
        `unused=${r.coverage.unusedBytes} B (${r.coverage.unusedPct}%), script=${r.metrics.ScriptDuration} ms, ` +
        `longTasks=${r.longTasks.count}, tbtLike=${r.longTasks.blockingMs} ms`,
    );
  }
}
await browser.close();

writeFileSync(
  join(OUT, `measure-${Date.now()}.json`),
  JSON.stringify({ base: BASE, runs: RUNS, results }, null, 2),
);
console.log("\nTrung vị theo phiên bản:");
for (const path of PATHS) {
  const rows = results.filter((r) => r.path === path);
  const med = (pick) => median(rows.map(pick));
  console.log(
    `${path}: req=${med((r) => r.js.requests)}, transferred=${med((r) => r.js.transferred)} B, ` +
      `resource=${med((r) => r.js.resource)} B, unused=${med((r) => r.coverage.unusedBytes)} B, ` +
      `script=${med((r) => r.metrics.ScriptDuration)} ms, img=${med((r) => r.images.requests)} req / ` +
      `${med((r) => r.images.transferred)} B, page=${med((r) => r.page.transferred)} B`,
  );
}

async function measure(path, run) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.route(
    (url) => BLOCK.some((host) => url.hostname.endsWith(host)),
    (route) => route.abort(),
  );
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Performance.enable");

  const requests = new Map();
  cdp.on("Network.responseReceived", (e) => {
    requests.set(e.requestId, { url: e.response.url, type: e.type, mime: e.response.mimeType });
  });
  cdp.on("Network.loadingFinished", (e) => {
    const r = requests.get(e.requestId);
    if (r) r.transferred = e.encodedDataLength;
  });
  cdp.on("Network.dataReceived", (e) => {
    const r = requests.get(e.requestId);
    if (r) r.resource = (r.resource ?? 0) + e.dataLength;
  });

  await page.addInitScript(() => {
    window.__longTasks = [];
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          window.__longTasks.push({ start: entry.startTime, duration: entry.duration });
      }).observe({ type: "longtask", buffered: true });
    } catch {
      /* trình duyệt không hỗ trợ longtask */
    }
  });

  await page.coverage.startJSCoverage({ resetOnNavigation: false, reportAnonymousScripts: false });
  const consoleErrors = [];
  page.on("console", (msg) => msg.type() === "error" && consoleErrors.push(msg.text()));
  page.on("pageerror", (err) => consoleErrors.push(String(err)));

  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  const coverage = await page.coverage.stopJSCoverage();
  const metricsRaw = await cdp.send("Performance.getMetrics");
  const metrics = Object.fromEntries(metricsRaw.metrics.map((m) => [m.name, m.value]));
  const nav = await page.evaluate(() => {
    const n = performance.getEntriesByType("navigation")[0];
    const paint = Object.fromEntries(
      performance.getEntriesByType("paint").map((p) => [p.name, p.startTime]),
    );
    return {
      domContentLoaded: n?.domContentLoadedEventEnd,
      load: n?.loadEventEnd,
      fcp: paint["first-contentful-paint"],
      longTasks: window.__longTasks,
      legacyGlobal: typeof window.__phoBienLegacy !== "undefined",
    };
  });

  const jsRequests = [...requests.values()].filter(
    (r) => r.type === "Script" || /javascript/.test(r.mime ?? ""),
  );
  const imgRequests = [...requests.values()].filter((r) => r.type === "Image");
  const allRequests = [...requests.values()];
  const own = coverage.filter((c) => c.url.startsWith(BASE));
  let total = 0;
  let used = 0;
  const perFile = [];
  for (const entry of own) {
    const len = entry.source?.length ?? 0;
    // Dùng thuật toán của Puppeteer: lấy hàm ngoài cùng làm nền rồi trừ khoảng count = 0.
    const usedBytes = usedFromV8(entry, len);
    total += len;
    used += usedBytes;
    perFile.push({
      url: entry.url.replace(BASE, ""),
      total: len,
      used: usedBytes,
      unused: len - usedBytes,
    });
  }

  await context.close();
  const blockingMs = (nav.longTasks ?? []).reduce((s, t) => s + Math.max(0, t.duration - 50), 0);
  return {
    path,
    run,
    js: {
      requests: jsRequests.length,
      transferred: sum(jsRequests.map((r) => r.transferred ?? 0)),
      resource: sum(jsRequests.map((r) => r.resource ?? 0)),
      files: jsRequests.map((r) => ({
        url: r.url.replace(BASE, ""),
        transferred: r.transferred,
        resource: r.resource,
      })),
    },
    images: {
      requests: imgRequests.length,
      transferred: sum(imgRequests.map((r) => r.transferred ?? 0)),
      files: imgRequests.map((r) => ({ url: r.url.replace(BASE, ""), transferred: r.transferred })),
    },
    page: {
      requests: allRequests.length,
      transferred: sum(allRequests.map((r) => r.transferred ?? 0)),
    },
    coverage: {
      totalBytes: total,
      usedBytes: used,
      unusedBytes: total - used,
      unusedPct: total ? Math.round(((total - used) / total) * 1000) / 10 : 0,
      perFile,
    },
    metrics: {
      ScriptDuration: round(metrics.ScriptDuration * 1000),
      TaskDuration: round(metrics.TaskDuration * 1000),
      JSHeapUsedSize: metrics.JSHeapUsedSize,
    },
    paint: {
      fcp: round(nav.fcp),
      domContentLoaded: round(nav.domContentLoaded),
      load: round(nav.load),
    },
    longTasks: { count: nav.longTasks?.length ?? 0, blockingMs: round(blockingMs) },
    legacyGlobal: nav.legacyGlobal,
    consoleErrors,
  };
}

/** Byte đã chạy theo dữ liệu block coverage của V8. */
function usedFromV8(entry, len) {
  const marks = new Uint8Array(len);
  const fns = entry.functions ?? [];
  // Khoảng có count > 0 đánh 1, count = 0 đánh 0, theo thứ tự lồng nhau (ngoài trước, trong sau).
  const ranges = fns.flatMap((f) => f.ranges);
  ranges.sort((a, b) => b.endOffset - b.startOffset - (a.endOffset - a.startOffset));
  for (const r of ranges)
    marks.fill(r.count > 0 ? 1 : 0, r.startOffset, Math.min(r.endOffset, len));
  let used = 0;
  for (let i = 0; i < len; i++) used += marks[i];
  return used;
}

function sum(list) {
  return list.reduce((s, v) => s + v, 0);
}
function median(list) {
  const s = [...list].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : round((s[m - 1] + s[m]) / 2);
}
function round(v) {
  return v == null ? v : Math.round(v * 10) / 10;
}
