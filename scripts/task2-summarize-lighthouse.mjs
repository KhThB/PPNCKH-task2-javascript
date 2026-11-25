#!/usr/bin/env node
/**
 * Task 2 — tổng hợp các tệp Lighthouse JSON (artifacts/task2-js/lighthouse/lab-<v>-run<n>.json)
 * (có thể nén .json.gz) thành bảng trung vị và từng lượt. Ghi <thư mục>-summary.json.
 *   node scripts/task2-summarize-lighthouse.mjs [thư mục]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { join } from "node:path";

const dir = (process.argv[2] ?? "artifacts/task2-js/lighthouse").replace(/\/$/, "");
const files = readdirSync(dir)
  .filter((f) => /^lab-\w+-run\d+\.json(\.gz)?$/.test(f))
  .sort();
const runs = files.map((f) => {
  const buf = readFileSync(join(dir, f));
  const lhr = JSON.parse((f.endsWith(".gz") ? gunzipSync(buf) : buf).toString("utf8"));
  const a = lhr.audits;
  const boot = a["bootup-time"]?.details?.items ?? [];
  const own = boot.filter((i) => /\/(assets|lab)\//.test(i.url));
  const sumBy = (list, key) => list.reduce((s, i) => s + (i[key] ?? 0), 0);
  const breakdown = Object.fromEntries(
    (a["mainthread-work-breakdown"]?.details?.items ?? []).map((i) => [i.group, i.duration]),
  );
  const net = a["network-requests"]?.details?.items ?? [];
  const js = net.filter((i) => i.resourceType === "Script" && !/grok\.com/.test(i.url));
  return {
    file: f,
    version: f.split("-")[1],
    score: Math.round((lhr.categories.performance.score ?? 0) * 100),
    FCP: a["first-contentful-paint"].numericValue,
    LCP: a["largest-contentful-paint"].numericValue,
    TBT: a["total-blocking-time"].numericValue,
    CLS: a["cumulative-layout-shift"].numericValue,
    SI: a["speed-index"].numericValue,
    jsRequests: js.length,
    jsTransfer: sumBy(js, "transferSize"),
    jsResource: sumBy(js, "resourceSize"),
    scriptEvaluation: breakdown.scriptEvaluation ?? 0,
    scriptParseCompile: breakdown.scriptParseCompile ?? 0,
    bootupOwnScripting: sumBy(own, "scripting"),
    bootupOwnParse: sumBy(own, "scriptParseCompile"),
    mainThread: a["mainthread-work-breakdown"].numericValue,
    unusedJsBytes: a["unused-javascript"]?.details?.overallSavingsBytes ?? 0,
  };
});

const keys = Object.keys(runs[0]).filter((k) => typeof runs[0][k] === "number");
const median = (l) => {
  const s = [...l].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const versions = [...new Set(runs.map((r) => r.version))];
const medians = Object.fromEntries(
  versions.map((v) => [
    v,
    Object.fromEntries(
      keys.map((k) => [k, median(runs.filter((r) => r.version === v).map((r) => r[k]))]),
    ),
  ]),
);
writeFileSync(`${dir}-summary.json`, JSON.stringify({ runs, medians }, null, 2));
console.table(
  runs.map(({ file, ...r }) => ({
    file,
    ...Object.fromEntries(
      Object.entries(r).map(([k, v]) => [
        k,
        typeof v === "number" ? Math.round(v * 1000) / 1000 : v,
      ]),
    ),
  })),
);
console.table(medians);
