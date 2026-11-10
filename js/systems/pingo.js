/*
 * Pingo: robot pendamping. Saat mati, diam di tempat (misalnya di rak).
 * Saat menyala, melayang mengikuti jejak Raka sambil bergerak naik-turun.
 */
(function (NQ) {
  var s = { x: 0, y: 0, menyala: false, waktu: 0, mode: 'melayang', dasarMati: 0 };

  NQ.pingo = {
    // (x, y) = titik bawah tengah sprite; dasar = urutan gambar (misalnya sedikit di depan rak)
    taruhMati: function (x, y, dasar) { s.x = x; s.y = y; s.dasarMati = dasar || y; s.menyala = false; s.mode = 'melayang'; },
    nyalakan: function () {
      s.menyala = true;
      // muncul di samping Raka
      s.x = NQ.pemain.x() + 18; s.y = NQ.pemain.y() + 2;
    },
    menyala: function () { return s.menyala; },
    setMode: function (m) { s.mode = m; },  // 'melayang' atau 'pindai'

    perbarui: function (dt) {
      s.waktu += dt;
      if (!s.menyala) return;
      var j = NQ.pemain.jejak();
      var t = j[Math.max(0, j.length - 14)];
      // tetap sedikit di samping, bukan tepat di belakang
      var tx = t.x + 14, ty = t.y + 4;
      s.x += (tx - s.x) * Math.min(1, dt * 5);
      s.y += (ty - s.y) * Math.min(1, dt * 5);
    },

    sprite: function () {
      var info = NQ.data.aset.sheet.pingo;
      var bob = s.menyala ? Math.round(Math.sin(s.waktu * 3) * 2) : 0;
      var frame = !s.menyala ? info.frame.mati : (s.mode === 'pindai' ? info.frame.pindai : info.frame.melayang);
      return {
        dasar: s.menyala ? s.y : s.dasarMati,
        gambar: function (ctx, ox, oy) {
          NQ.aset.frame(ctx, 'pingo', frame, 0, ox + s.x - info.w / 2, oy + s.y - info.h + bob);
        }
      };
    }
  };
})(window.NQ = window.NQ || {});
