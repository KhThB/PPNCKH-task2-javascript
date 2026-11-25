//#region node_modules/.nitro/vite/services/ssr/assets/format-BXgGdvup.js
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
	return `${(bytes / 1048576).toFixed(2)} MB`;
}
function formatPct(value) {
	return `${value > 0 ? "−" : value < 0 ? "+" : ""}${Math.abs(value).toFixed(1)}%`;
}
function reductionPct(before, after) {
	if (before === 0) return 0;
	return (before - after) / before * 100;
}
//#endregion
export { formatPct as n, reductionPct as r, formatBytes as t };
