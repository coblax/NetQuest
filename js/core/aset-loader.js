/*
 * Memuat gambar dari data/aset.js memakai new Image() (aman untuk file://).
 * Gambar disimpan HD (config.hd kali ukuran logis); fungsi gambar di sini
 * otomatis mengecilkannya ke ukuran logis sehingga kode game tidak perlu tahu.
 * Aset yang gagal dimuat diganti kotak warna supaya game tetap jalan.
 */
(function (NQ) {
  var gambar = {};
  var gagal = [];

  function hd() { return NQ.config.hd || 1; }

  NQ.aset = {
    muat: function (selesai) {
      var daftar = NQ.data.aset.gambar;
      var kunci = Object.keys(daftar);
      var sisa = kunci.length;
      if (sisa === 0) { selesai(); return; }
      kunci.forEach(function (k) {
        var img = new Image();
        img.onload = function () { gambar[k] = img; if (--sisa === 0) selesai(); };
        img.onerror = function () { gagal.push(k); console.warn('Aset gagal dimuat:', daftar[k]); if (--sisa === 0) selesai(); };
        img.src = daftar[k];
      });
    },
    ada: function (k) { return !!gambar[k]; },
    gambar: function (k) { return gambar[k]; },
    gagal: function () { return gagal.slice(); },
    // Ukuran logis gambar utuh
    lebar: function (k) { return gambar[k] ? gambar[k].width / hd() : 16; },
    tinggi: function (k) { return gambar[k] ? gambar[k].height / hd() : 16; },

    // Gambar satu frame dari lembar sprite (w, h di data/aset.js dalam piksel logis).
    frame: function (ctx, k, kolom, baris, x, y) {
      var info = NQ.data.aset.sheet[k] || {};
      var img = gambar[k], s = hd();
      var w = info.w || (img ? img.width / s : 16), h = info.h || (img ? img.height / s : 16);
      if (!img) { ctx.fillStyle = '#ff00ff'; ctx.fillRect(x, y, w, h); return; }
      ctx.drawImage(img, kolom * w * s, baris * h * s, w * s, h * s, x, y, w, h);
    },

    // Gambar satu gambar utuh (tile, perabot, latar) pada ukuran logisnya.
    utuh: function (ctx, k, x, y, w, h) {
      var img = gambar[k];
      if (!img) { ctx.fillStyle = '#ff00ff'; ctx.fillRect(x, y, w || 16, h || 16); return; }
      ctx.drawImage(img, x, y, w || img.width / hd(), h || img.height / hd());
    }
  };
})(window.NQ = window.NQ || {});
