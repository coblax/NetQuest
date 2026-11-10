/*
 * Objek yang bisa diperiksa. Scene mendaftarkan titik interaksi:
 *   { id, x, y, jarak, kilauX, kilauY, kotak: {x, y, w, h}, aktif: function() -> boolean, aksi: function() }
 * (x, y) = tempat Raka berdiri untuk memeriksa; kotak = area objek yang bisa diklik.
 * Keyboard: dekati objek lalu tekan E. Mouse/ketuk: klik objek, Raka berjalan ke sana lalu memeriksanya.
 */
(function (NQ) {
  var titik = [];
  var terdekat = null, disorot = null;
  var waktu = 0;

  function aktif(t) { return !t.aktif || t.aktif(); }
  function jarakKe(t) { var dx = t.x - NQ.pemain.x(), dy = t.y - NQ.pemain.y(); return Math.sqrt(dx * dx + dy * dy); }
  function kena(t, x, y) {
    var k = t.kotak;
    if (k) return x >= k.x && x <= k.x + k.w && y >= k.y && y <= k.y + k.h;
    var kx = t.kilauX !== undefined ? t.kilauX : t.x, ky = t.kilauY !== undefined ? t.kilauY : t.y - 40;
    return Math.abs(x - kx) < 12 && Math.abs(y - ky - 12) < 16;
  }
  function hadapKe(t) {
    var kx = t.kilauX !== undefined ? t.kilauX : t.x, ky = t.kilauY !== undefined ? t.kilauY : t.y - 40;
    var dx = kx - NQ.pemain.x(), dy = ky - NQ.pemain.y();
    NQ.pemain.hadap(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'kiri' : 'kanan') : (dy < 0 ? 'atas' : 'bawah'));
  }
  function periksa(t) {
    if (!aktif(t)) return;
    hadapKe(t);
    NQ.audio.efek('menu-pilih');
    t.aksi();
  }

  function penanda(ctx, t, terang) {
    var ox = NQ.kamera.x, oy = NQ.kamera.y;
    var x = ox + (t.kilauX !== undefined ? t.kilauX : t.x);
    var y = oy + (t.kilauY !== undefined ? t.kilauY : t.y - 40) + Math.sin(waktu * 5) * 1.5;
    ctx.save();
    ctx.globalAlpha = terang ? 1 : 0.75;
    ctx.fillStyle = '#1a1426';
    ctx.beginPath(); ctx.arc(x, y, 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd23f';
    ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a1426';
    ctx.font = 'bold 7px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('E', x, y + 0.4);
    ctx.restore();
  }

  NQ.interaksi = {
    bersihkan: function () { titik = []; terdekat = null; disorot = null; },
    tambah: function (t) { titik.push(t); },
    terdekat: function () { return terdekat; },
    // Objek aktif dengan id tertentu (dipakai panah penunjuk tujuan)
    cari: function (id) {
      for (var i = 0; i < titik.length; i++) if (titik[i].id === id && aktif(titik[i])) return titik[i];
      return null;
    },
    disorot: function () { return disorot; },

    // Objek yang diklik di koordinat ruangan (wx, wy), atau null
    diKlik: function (wx, wy) {
      for (var i = 0; i < titik.length; i++) if (aktif(titik[i]) && kena(titik[i], wx, wy)) return titik[i];
      return null;
    },

    // Berjalan ke objek lalu memeriksanya (dipakai saat objek diklik)
    pergiDanPeriksa: function (t) {
      var dekat = function () { return jarakKe(t) < (t.jarak || 26) - 4; };
      if (dekat()) { periksa(t); return; }
      var ok = NQ.pemain.jalanKe(t.x, t.y, function () { if (dekat()) periksa(t); }, dekat);
      if (!ok && jarakKe(t) < (t.jarak || 26) + 6) periksa(t);
    },

    perbarui: function (dt, boleh) {
      waktu += dt;
      terdekat = null; disorot = null;
      if (!boleh) { NQ.input.setKursor('default'); return; }
      var px = NQ.pemain.x(), py = NQ.pemain.y(), best = 1e9;
      titik.forEach(function (t) {
        if (!aktif(t)) return;
        var d = Math.sqrt((t.x - px) * (t.x - px) + (t.y - py) * (t.y - py));
        if (d < (t.jarak || 26) && d < best) { best = d; terdekat = t; }
      });
      var k = NQ.input.kursor();
      if (k) disorot = this.diKlik(k.x - NQ.kamera.x, k.y - NQ.kamera.y);
      NQ.input.setKursor(disorot ? 'pointer' : 'default');
      if (terdekat && NQ.input.baruDitekan('periksa')) periksa(terdekat);
    },

    // Penanda E di atas objek terdekat, dan di atas objek yang disorot kursor
    gambar: function (ctx) {
      if (terdekat) penanda(ctx, terdekat, true);
      if (disorot && disorot !== terdekat) penanda(ctx, disorot, false);
    }
  };
})(window.NQ = window.NQ || {});
