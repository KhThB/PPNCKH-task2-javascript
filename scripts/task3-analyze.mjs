#!/usr/bin/env node
/**
 * Task 3 — phân tích thiết kế giai thừa 2×2 (Ảnh: chưa/đã tối ưu × JavaScript: chưa/đã tối ưu)
 * trên số đo Lighthouse của A, B, C, D.
 *
 *   A = ảnh 0, JS 0   B = ảnh 1, JS 0   C = ảnh 0, JS 1   D = ảnh 1, JS 1
 *
 * Với mỗi chỉ số, dùng trung vị 5 lượt của từng bản:
 *   tác động chính của ảnh        = ((B − A) + (D − C)) / 2
 *   tác động chính của JavaScript = ((C − A) + (D − B)) / 2
 *   tương tác                     = (D − C) − (B − A)   (≠ 0: hai nhóm không cộng dồn)
 * Kiểm định Mann–Whitney U hai phía, chính xác (n = 5 mỗi nhóm), cho từng cặp so sánh.
 * Với 5 so với 5 lượt, p nhỏ nhất có thể là 0,0079.
 *
 *   node scripts/task3-analyze.mjs   → artifacts/task3/analysis.json và in bảng
 */
import { readFileSync, writeFileSync } from "node:fs";

const METRICS = ["LCP", "FCP", "SI", "TBT", "CLS", "score", "scriptEvaluation", "mainThread"];
const PAIRS = [
  ["a", "b", "Ảnh (JS chưa tối ưu)"],
  ["c", "d", "Ảnh (JS đã tối ưu)"],
  ["a", "c", "JavaScript (ảnh chưa tối ưu)"],
  ["b", "d", "JavaScript (ảnh đã tối ưu)"],
  ["a", "d", "Kết hợp"],
];

const median = (l) => {
  const s = [...l].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Mann–Whitney U chính xác hai phía bằng cách liệt kê mọi cách chia hạng (n nhỏ). */
function mannWhitney(x, y) {
  const all = [...x.map((v) => ({ v, g: 0 })), ...y.map((v) => ({ v, g: 1 }))].sort(
    (a, b) => a.v - b.v,
  );
  // hạng trung bình cho giá trị trùng
  const ranks = new Array(all.length);
  for (let i = 0; i < all.length;) {
    let j = i;
    while (j + 1 < all.length && all[j + 1].v === all[i].v) j++;
    for (let k = i; k <= j; k++) ranks[k] = (i + j) / 2 + 1;
    i = j + 1;
  }
  const n1 = x.length;
  const n2 = y.length;
  const r1 = all.reduce((s, item, i) => s + (item.g === 0 ? ranks[i] : 0), 0);
  const u1 = r1 - (n1 * (n1 + 1)) / 2;
  const mean = (n1 * n2) / 2;
  const obs = Math.abs(u1 - mean);
  // phân phối hoán vị: chọn n1 hạng trong toàn bộ hạng
  let extreme = 0;
  let total = 0;
  const idx = [];
  (function choose(start) {
    if (idx.length === n1) {
      total++;
      const r = idx.reduce((s, i) => s + ranks[i], 0);
      const u = r - (n1 * (n1 + 1)) / 2;
      if (Math.abs(u - mean) >= obs - 1e-9) extreme++;
      return;
    }
    for (let i = start; i < ranks.length; i++) {
      idx.push(i);
      choose(i + 1);
      idx.pop();
    }
  })(0);
  return { U: Math.min(u1, n1 * n2 - u1), p: extreme / total };
}

const result = {};
for (const profile of ["mobile", "desktop"]) {
  const { runs } = JSON.parse(
    readFileSync(`artifacts/task3/lighthouse-${profile}-summary.json`, "utf8"),
  );
  const by = (v, k) => runs.filter((r) => r.version === v).map((r) => r[k]);
  const out = {};
  for (const k of METRICS) {
    const med = Object.fromEntries(["a", "b", "c", "d"].map((v) => [v, median(by(v, k))]));
    const range = Object.fromEntries(
      ["a", "b", "c", "d"].map((v) => [v, [Math.min(...by(v, k)), Math.max(...by(v, k))]]),
    );
    const image = (med.b - med.a + (med.d - med.c)) / 2;
    const js = (med.c - med.a + (med.d - med.b)) / 2;
    const interaction = med.d - med.c - (med.b - med.a);
    const tests = PAIRS.map(([p, q, label]) => {
      const t = mannWhitney(by(p, k), by(q, k));
      return { pair: `${p.toUpperCase()}→${q.toUpperCase()}`, label, delta: med[q] - med[p], ...t };
    });
    out[k] = { median: med, range, effects: { image, js, interaction }, tests };
  }
  result[profile] = out;
}
writeFileSync("artifacts/task3/analysis.json", JSON.stringify(result, null, 2));

const f = (v) => (Math.abs(v) >= 100 ? Math.round(v) : Math.round(v * 10) / 10);
for (const [profile, out] of Object.entries(result)) {
  console.log(`\n=== ${profile}`);
  for (const [k, r] of Object.entries(out)) {
    console.log(
      `${k.padEnd(17)} A=${f(r.median.a)} B=${f(r.median.b)} C=${f(r.median.c)} D=${f(r.median.d)} | ` +
        `ảnh ${f(r.effects.image)}, JS ${f(r.effects.js)}, tương tác ${f(r.effects.interaction)} | ` +
        r.tests.map((t) => `${t.pair} Δ${f(t.delta)} p=${t.p.toFixed(3)}`).join("; "),
    );
  }
}
