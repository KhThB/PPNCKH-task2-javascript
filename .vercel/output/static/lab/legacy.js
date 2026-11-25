/* legacy.js — mã trang tạp chí, CỐ Ý chưa tối ưu.
   Giống hệt trên phiên bản A và B. Thành viên 2 mới được đụng tệp này.
   Không minify, còn hàm không được gọi, không defer/async. */
(function () {
  var unusedRegions = [
    "Ha Noi", "Hai Phong", "Quang Ninh", "Lao Cai", "Hue", "Da Nang",
    "Quang Nam", "Can Tho", "An Giang", "Kien Giang", "Ho Chi Minh",
  ];

  function unusedSlug(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  function unusedTrack(name, payload) {
    var bucket = (window.__unusedTracks = window.__unusedTracks || []);
    bucket.push({ name: name, payload: payload, at: Date.now() });
    if (bucket.length > 200) bucket.shift();
  }

  function unusedFlatten(list) {
    var out = [];
    for (var i = 0; i < list.length; i++) out.push(unusedSlug(list[i]));
    return out;
  }

  unusedFlatten(unusedRegions);
  unusedTrack("boot", { regions: unusedRegions.length });

  window.__phoBienLegacy = {
    version: "unoptimized-1",
    regions: unusedRegions,
  };
})();
