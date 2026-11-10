/*
 * Peta ruangan: menggambar lantai, dinding, hiasan, dan benda dari data/ruangan.js (properti tata),
 * menyediakan kotak tabrakan, dan menggambar semua sprite berurutan dari atas ke bawah
 * supaya tokoh tampak berada di depan atau di belakang perabot.
 * Lantai dan dinding digambar sekali ke kanvas cadangan (resolusi layar) agar tidak ada celah antar-tile.
 */
(function (NQ) {
  var ruang = null, tata = null, idRuang = '';
  var benda = [];     // { id, a, x, y, w, h, dasar }
  var padat = [];     // kotak tabrakan { x, y, w, h }
  var kedip = 0, gelap = 0;
  var cadangan = null, rasioCadangan = 0;

  // Gambar ke kanvas cadangan dengan tepi dibulatkan ke piksel layar
  function tempel(c, r, k, x, y, w, h) {
    var img = NQ.aset.gambar(k);
    var x0 = Math.round(x * r), y0 = Math.round(y * r);
    var x1 = Math.round((x + (w || NQ.aset.lebar(k))) * r), y1 = Math.round((y + (h || NQ.aset.tinggi(k))) * r);
    if (!img) { c.fillStyle = '#ff00ff'; c.fillRect(x0, y0, x1 - x0, y1 - y0); return; }
    c.drawImage(img, x0, y0, x1 - x0, y1 - y0);
  }

  function buatCadangan() {
    var r = NQ.renderer.rasio();
    var L = ruang.lebar * 16, T = ruang.tinggi * 16, td = tata.tinggiDinding;
    cadangan = document.createElement('canvas');
    cadangan.width = Math.round(L * r); cadangan.height = Math.round(T * r);
    var c = cadangan.getContext('2d');
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    for (var ty = Math.floor(td / 16); ty < ruang.tinggi; ty++)
      for (var tx = 0; tx < ruang.lebar; tx++) tempel(c, r, tata.lantai[0], tx * 16, ty * 16, 16, 16);
    for (var x = 0; x < L; x += 16) tempel(c, r, tata.dinding, x, 0, 16, td);
    (tata.jendela || []).forEach(function (jx) { tempel(c, r, 'dinding-jendela', jx, 0); });
    (tata.pintu || []).forEach(function (p) { tempel(c, r, 'pintu-lorong', p.x, 0); });
    (tata.hiasan || []).forEach(function (h) { tempel(c, r, h.a, h.x, h.y); });
    var pk = tata.pintuKeluar;
    if (pk) {
      c.fillStyle = '#6b4a2f'; c.fillRect(Math.round(pk.x * r), Math.round(pk.y * r), Math.round(pk.w * r), Math.round(pk.h * r));
      c.fillStyle = '#8a6440'; c.fillRect(Math.round((pk.x + 2) * r), Math.round((pk.y + 2) * r), Math.round((pk.w - 4) * r), Math.round((pk.h - 4) * r));
    }
    rasioCadangan = r;
  }

  NQ.peta = {
    muat: function (id) {
      idRuang = id;
      ruang = NQ.data.ruangan[id];
      tata = ruang.tata;
      benda = []; padat = []; cadangan = null;
      var lebar = ruang.lebar * 16, tinggi = ruang.tinggi * 16;
      // Batas ruangan: dinding atas, kiri, kanan, bawah
      padat.push({ x: 0, y: 0, w: lebar, h: tata.tinggiDinding + 4 });
      padat.push({ x: -16, y: 0, w: 16, h: tinggi });
      padat.push({ x: lebar, y: 0, w: 16, h: tinggi });
      padat.push({ x: 0, y: tinggi, w: lebar, h: 16 });
      tata.benda.forEach(function (b) {
        var w = NQ.aset.lebar(b.a), h = NQ.aset.tinggi(b.a);
        benda.push({ id: b.id, a: b.a, x: b.x, y: b.dasar - h, w: w, h: h, dasar: b.dasar });
        var tp = Math.min(b.tinggiPadat || 14, h);
        if (b.padat !== false) padat.push({ x: b.x + 1, y: b.dasar - tp, w: w - 2, h: tp });
      });
    },
    id: function () { return idRuang; },
    lebar: function () { return ruang.lebar * 16; },
    tinggi: function () { return ruang.tinggi * 16; },
    tata: function () { return tata; },
    benda: function (id) {
      for (var i = 0; i < benda.length; i++) if (benda[i].id === id) return benda[i];
      return null;
    },
    tambahPadat: function (kotak) { padat.push(kotak); return kotak; },
    hapusPadat: function (kotak) { var i = padat.indexOf(kotak); if (i >= 0) padat.splice(i, 1); },

    // Apakah kotak (x, y, w, h) menabrak benda padat?
    tabrak: function (x, y, w, h) {
      for (var i = 0; i < padat.length; i++) {
        var p = padat[i];
        if (x < p.x + p.w && x + w > p.x && y < p.y + p.h && y + h > p.y) return true;
      }
      return false;
    },

    perbarui: function (dt) {
      // Lampu ruangan sesekali berkedip (Scene 2: jaringan sekolah kacau)
      kedip -= dt;
      if (kedip <= 0) { gelap = gelap > 0 ? 0 : (Math.random() < 0.5 ? 0.18 : 0); kedip = gelap > 0 ? 0.08 + Math.random() * 0.1 : 2 + Math.random() * 4; }
    },

    // Gambar ruangan. tambahan = sprite lain (tokoh) { dasar, gambar: function(ctx, ox, oy) }
    gambar: function (ctx, tambahan) {
      var ox = NQ.kamera.x, oy = NQ.kamera.y, r = NQ.renderer.rasio();
      var L = this.lebar(), T = this.tinggi();
      ctx.fillStyle = '#0b1026';
      ctx.fillRect(0, 0, NQ.config.lebarLayar, NQ.config.tinggiLayar);

      if (!cadangan || rasioCadangan !== r) buatCadangan();
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (cadangan.width > 0 && cadangan.height > 0) ctx.drawImage(cadangan, Math.round(ox * r), Math.round(oy * r));
      ctx.restore();

      // Benda dan tokoh diurutkan berdasarkan garis dasar
      var semua = benda.map(function (b) {
        return { dasar: b.dasar, gambar: function (c) { NQ.aset.utuh(c, b.a, ox + b.x, oy + b.y); } };
      }).concat(tambahan || []);
      semua.sort(function (a, b) { return a.dasar - b.dasar; });
      semua.forEach(function (s) { s.gambar(ctx, ox, oy); });

      // Tepi ruangan
      ctx.strokeStyle = '#1a1426'; ctx.lineWidth = 1;
      ctx.strokeRect(ox - 0.5, oy - 0.5, L + 1, T + 1);

      if (gelap > 0) { ctx.fillStyle = 'rgba(5,8,25,' + gelap + ')'; ctx.fillRect(ox, oy, L, T); }

      if (NQ.config.debug) {
        ctx.strokeStyle = 'rgba(255,0,0,0.7)'; ctx.lineWidth = 0.5;
        padat.forEach(function (p) { ctx.strokeRect(ox + p.x, oy + p.y, p.w, p.h); });
      }
    }
  };
})(window.NQ = window.NQ || {});
