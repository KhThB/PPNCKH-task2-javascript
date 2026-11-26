#!/usr/bin/env bash
# Task 3 — đo chính thức A, B, C, D bằng Lighthouse, 5 vòng xen kẽ (A1 B1 C1 D1 A2 …).
#   bash scripts/task3-lighthouse.sh [mobile|desktop] [số vòng] [base url]
# Cần: bản build đang chạy (vite preview), Lighthouse 12 (npx lighthouse), CHROME_PATH nếu Chrome không ở chỗ mặc định.
# Throttling thực (devtools). Mobile: CPU chậm 4×, mạng 4G chậm (150 ms RTT, 1,6 Mbps). Desktop: preset desktop.
set -euo pipefail
PROFILE="${1:-mobile}"; RUNS="${2:-5}"; BASE="${3:-http://127.0.0.1:4173}"
OUT="artifacts/task3/lighthouse-${PROFILE}"; mkdir -p "$OUT"
LH="${LIGHTHOUSE:-npx --yes lighthouse@12}"
EXTRA=(); [ "$PROFILE" = "desktop" ] && EXTRA+=(--preset=desktop)
for i in $(seq 1 "$RUNS"); do
  for v in a b c d; do
    $LH "$BASE/lab/$v" --quiet --only-categories=performance --throttling-method=devtools \
      "${EXTRA[@]}" --output=json --output-path="$OUT/lab-$v-run$i.json" \
      --chrome-flags="--headless=new --no-sandbox" \
      --blocked-url-patterns="*fonts.googleapis.com*" --blocked-url-patterns="*fonts.gstatic.com*" \
      --blocked-url-patterns="*grok.com*"
    echo "$PROFILE vòng $i: /lab/$v xong"
  done
done
gzip -f -9 "$OUT"/*.json
node scripts/task2-summarize-lighthouse.mjs "$OUT"
