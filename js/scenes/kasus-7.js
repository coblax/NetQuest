/*
 * Scene 10 · Kasus 7 · Aula: Wi-Fi lemot di kursi belakang menjelang lomba daring.
 * Kekuatan sinyal dihitung dari jarak AP dan penghalang beton (dinding dan pilar), jadi posisi troli benar-benar berpengaruh.
 * 6 langkah: Gejala (analyzer: kursi belakang -78 dBm) -> Dugaan (Pindai: zona mati, beton, kanal bentrok)
 * -> Uji (grafik kanal di analyzer) -> Perbaikan (dorong troli ke depan panggung + kanal 11)
 * -> Verifikasi (kursi belakang lebih kuat dari -67 dBm) -> Catat.
 * Salah: kanal 1 atau 6 (bentrok), kanal 2-5/7-10 (tumpang tindih) = energi -1.
 */
(function (NQ) {
  var K = 'kasus-7';
  var BELAKANG = { x: 400, y: 348 };                 // titik ukur "kursi belakang"
  var BETON = { x: 86, y: 230, w: 14, h: 186 };      // dinding beton tebal di kiri
  var ZONA = { x: 240, y: 142, w: 160, h: 56 };      // area depan panggung
  var TETANGGA = [{ nama: 'AP Lab 1', kanal: 1, x: 38, y: 40 }, { nama: 'AP Kantor', kanal: 6, x: 602, y: 40 }];
  var troli = null, prev = null, bunyi = 0, pindaiSampai = 0, objTroli = null;

  function b(n) { return NQ.progres.bendera(n); }
  function cat() { return (NQ.state.catatan = NQ.state.catatan || {}); }
  function kanal() { return cat().kanalAula || 6; }
  function sekarang() { return performance.now() / 1000; }

  // ---------- Model sinyal ----------
  function potong(ax, ay, bx, by, r) {
    // apakah segmen A-B memotong persegi r (uji beberapa titik sepanjang garis)
    for (var i = 1; i < 24; i++) {
      var t = i / 24, x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return true;
    }
    return false;
  }
  function penghalang() {
    var d = [BETON];
    ['pilar-1', 'pilar-2', 'pilar-3', 'pilar-4'].forEach(function (id) { var p = NQ.peta.benda(id); if (p) d.push({ x: p.x, y: p.y, w: p.w, h: p.h }); });
    return d;
  }
  function sinyal(px, py) {
    var dx = px - troli.x, dy = py - (troli.y - 14), meter = Math.max(1, Math.sqrt(dx * dx + dy * dy) / 16);
    var dbm = -36 - 22 * Math.log(meter) / Math.LN10;
    penghalang().forEach(function (r) { if (potong(troli.x, troli.y - 14, px, py, r)) dbm -= 12; });
    return Math.round(dbm);
  }
  function diZona() { return troli.x >= ZONA.x && troli.x <= ZONA.x + ZONA.w && troli.y >= ZONA.y && troli.y <= ZONA.y + ZONA.h; }
  function bentrok(k) { return TETANGGA.some(function (t) { return Math.abs(t.kanal - k) < 5; }); }

  function tugas(R) {
    if (NQ.progres.sudahSelesai(K)) return;
    if (!R.sudah('Gejala')) R.tugas('Ukur sinyal dengan Wi-Fi analyzer (Tas)');
    else if (!R.sudah('Dugaan')) R.tugas('Tekan Q untuk memindai gelombang Wi-Fi');
    else if (!R.sudah('Uji')) R.tugas('Lihat grafik kanal di Wi-Fi analyzer');
    else if (!R.sudah('Perbaikan')) R.tugas((diZona() ? 'AP sudah di depan panggung. ' : 'Dorong troli AP ke depan panggung. ') + (kanal() === 11 ? 'Kanal sudah 11.' : 'Atur kanal di troli.'));
    else R.tugas('Ukur lagi sinyal kursi belakang dengan analyzer');
  }

  function cekPerbaikan(R) {
    if (R.sudah('Perbaikan') || !R.sudah('Uji')) { tugas(R); return; }
    if (diZona() && kanal() === 11) {
      R.jurnal('Perbaikan', 'Troli AP didorong ke depan panggung, menjauhi dinding beton dan pilar; kanal diubah ke 11.');
    }
    tugas(R);
  }

  // ---------- Wi-Fi analyzer ----------
  function kurva(c, x0, y0, w, h, k, warna, tebal) {
    c.strokeStyle = warna; c.lineWidth = tebal || 0.8; c.beginPath();
    for (var i = 0; i <= 40; i++) {
      var ch = k - 2 + i / 10, xx = x0 + (ch - 0.5) / 13 * w, yy = y0 + h - Math.max(0, Math.cos((ch - k) / 2.2 * Math.PI / 2)) * h * 0.85;
      if (ch < 0.5 || ch > 13.5) continue;
      if (i === 0) c.moveTo(xx, yy); else c.lineTo(xx, yy);
    }
    c.stroke();
  }
  function gambarAnalyzer(c) {
    c.fillStyle = '#10162e'; c.fillRect(0, 0, 240, 130);
    NQ.aset.utuh(c, 'wifi-analyzer', 6, 10, 65, 110);
    var dbm = sinyal(BELAKANG.x, BELAKANG.y), k = kanal();
    // layar alat
    c.fillStyle = '#0b2a14'; c.fillRect(18, 46, 41, 38);
    c.fillStyle = '#9dffb0'; c.font = '4px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'left'; c.textBaseline = 'top';
    c.fillText('SMK-Aula', 20, 48); c.fillText('Kanal ' + k, 20, 55);
    c.font = 'bold 7px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillStyle = dbm >= -67 ? '#5ee05e' : (dbm >= -75 ? '#ffd23f' : '#ff6b6b');
    c.fillText(dbm + ' dBm', 20, 63);
    c.font = '4.2px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillStyle = '#9dffb0'; c.fillText('di kursi belakang', 20, 74);
    // grafik kanal 2,4 GHz
    var gx = 84, gy = 18, gw = 148, gh = 70;
    c.fillStyle = '#18213f'; c.fillRect(gx - 4, gy - 10, gw + 8, gh + 36);
    c.fillStyle = '#ffd23f'; c.font = 'bold 4.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillText('Kanal Wi-Fi 2,4 GHz', gx, gy - 8);
    c.strokeStyle = '#3a4a8a'; c.lineWidth = 0.5; c.beginPath(); c.moveTo(gx, gy + gh); c.lineTo(gx + gw, gy + gh); c.stroke();
    for (var ch = 1; ch <= 13; ch++) { c.fillStyle = (ch === 1 || ch === 6 || ch === 11) ? '#ffffff' : '#7d86b8'; c.font = '4.2px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.fillText(String(ch), gx + (ch - 0.5) / 13 * gw, gy + gh + 2); }
    kurva(c, gx, gy, gw, gh, 1, '#ff9f43', 0.8); kurva(c, gx, gy, gw, gh, 6, '#ff9f43', 0.8);
    kurva(c, gx, gy, gw, gh, k, bentrok(k) ? '#ff6b6b' : '#5ee05e', 1.6);
    c.textAlign = 'left'; c.font = '4.2px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    c.fillStyle = '#ff9f43'; c.fillText('Oranye: AP Lab 1 (kanal 1), AP Kantor (kanal 6)', gx, gy + gh + 9);
    c.fillStyle = bentrok(k) ? '#ff6b6b' : '#5ee05e'; c.fillText((bentrok(k) ? 'Merah' : 'Hijau') + ': AP Aula (kanal ' + k + ')' + (bentrok(k) ? ' - bertabrakan!' : ' - aman'), gx, gy + gh + 15);
    c.fillStyle = '#c8d4f0'; c.fillText('Batas layak lomba: lebih kuat dari -67 dBm', gx, gy + gh + 21);
  }

  function pakaiAnalyzer(R) {
    NQ.pemain.pose('pakaiAlat', 1.2);
    NQ.audio.efek('analyzer-bip');
    NQ.dekat.buka({ judul: 'WI-FI ANALYZER', w: 240, h: 130, gambar: gambarAnalyzer,
      keterangan: function () { return 'Makin negatif angka dBm, makin lemah sinyalnya. AP aula sekarang di ' + (diZona() ? 'depan panggung.' : 'pojok, di balik beton.'); } });
    var dbm = sinyal(BELAKANG.x, BELAKANG.y);
    setTimeout(function () {
      if (NQ.progres.sudahSelesai(K)) return;
      if (!R.sudah('Gejala')) R.dialog('analyzer-kursi-belakang', function () { R.jurnal('Gejala', 'Wi-Fi aula lemot; analyzer di kursi belakang: ' + dbm + ' dBm (lemah).'); tugas(R); });
      else if (R.sudah('Dugaan') && !R.sudah('Uji')) R.dialog('analyzer-uji', function () { R.jurnal('Uji', 'Analyzer: AP aula kanal 6 sama dengan AP Kantor (bentrok); sinyal kursi belakang ' + dbm + ' dBm karena terhalang beton.'); tugas(R); NQ.kartuKonsep.tampil('k7-sinyal'); });
      else if (R.sudah('Perbaikan') && !R.sudah('Verifikasi')) {
        if (dbm >= -67) R.dialog('verifikasi-berhasil', function () {
          R.jurnal('Verifikasi', 'Analyzer di kursi belakang: ' + dbm + ' dBm (baik), kanal 11 tanpa bentrok.');
          R.jurnal('Catat', 'Penyebab: AP di pojok terhalang dinding beton dan pilar, kanalnya bentrok dengan AP tetangga. Solusi: AP dipindah ke depan panggung, kanal 11. Pencegahan: survei sinyal sebelum acara.');
          NQ.kasus.selesai(K, {
            inti: 'Wi-Fi lemot bisa disebabkan jarak, penghalang seperti beton, terlalu banyak pengguna, atau kanal bertabrakan. Di 2,4 GHz, kanal 1, 6, dan 11 tidak saling tumpang tindih.',
            berikut: 'kasus-8', tugas: 'Bu Wati di Lab Komputer 2: kuota internet habis'
          });
        });
        else R.dialog('sinyal-belum');
      }
    }, 900);
  }

  function aturKanal(R) {
    if (!R.sudah('Uji')) { R.tahanUji(); return; }
    var pilih = function (k) {
      if (k === 1 || k === 6) { NQ.audio.efek('kanal-bentrok'); R.salah('kanal-dipakai-tetangga'); return; }
      if (k !== 11) { NQ.audio.efek('kanal-bentrok'); R.salah('kanal-tumpang-tindih'); return; }
      cat().kanalAula = 11; NQ.simpan.simpan();
      NQ.audio.efek('sinyal-naik');
      R.dialog('kanal-11', function () {
        // Kanal sudah benar tetapi AP masih di balik beton: umpan balik + kartu "Kenapa Salah?" bergambar
        if (!diZona()) R.salah('ap-terhalang', null, function () { cekPerbaikan(R); });
        else cekPerbaikan(R);
      });
    };
    NQ.menu.pilihan('Kanal Access Point', 'Kanal sekarang: ' + kanal() + '. Tetangga memakai kanal 1 dan 6.',
      [1, 3, 6, 11].map(function (k) { return { label: 'Kanal ' + k, aksi: function () { pilih(k); } }; }));
  }

  // ---------- Troli: penghalang yang bisa didorong ----------
  // Keyboard/joystick: berjalan menempel ke troli mendorongnya. Mouse: menu troli "Dorong ke ...".
  var padatTroli = null;
  function kotakTroli(x, y) { return { x: x - 11, y: y - 8, w: 22, h: 8 }; }
  function tabrakan(a, b2) { return a.x < b2.x + b2.w && a.x + a.w > b2.x && a.y < b2.y + b2.h && a.y + a.h > b2.y; }
  function bebasUntukTroli(x, y) {
    var k = kotakTroli(x, y), w = padatTroli.w; padatTroli.w = 0;          // abaikan troli itu sendiri
    var kena = NQ.peta.tabrak(k.x, k.y, k.w, k.h); padatTroli.w = w;
    var kaki = { x: NQ.pemain.x() - 7, y: NQ.pemain.y() - 6, w: 14, h: 6 };
    return !kena && !tabrakan(k, kaki);
  }
  function pindahTroli(R, x, y) {
    troli.x = x; troli.y = y;
    var k = kotakTroli(x, y); padatTroli.x = k.x; padatTroli.y = k.y;
    cat().troli = { x: x, y: y };
    if (diZona() && !b('k7.zona') && R.sudah('Uji')) {
      R.tandai('k7.zona'); NQ.simpan.simpan(); NQ.audio.efek('sinyal-naik');
      if (kanal() === 11) { NQ.ui.toast('AP sudah di depan panggung'); cekPerbaikan(R); }
      else R.dialog('troli-di-tengah', function () { cekPerbaikan(R); });
    }
    else tugas(R);
  }
  function dorong(R, dt) {
    var inp = NQ.input, dx = 0, dy = 0;
    if (inp.ditekan('kiri')) dx = -1; else if (inp.ditekan('kanan')) dx = 1;
    else if (inp.ditekan('atas')) dy = -1; else if (inp.ditekan('bawah')) dy = 1;
    if (!dx && !dy) return;
    var kaki = { x: NQ.pemain.x() - 7 + dx * 3, y: NQ.pemain.y() - 6 + dy * 3, w: 14, h: 6 };
    if (!tabrakan(kaki, kotakTroli(troli.x, troli.y))) return;
    var l = 60 * dt, nx = troli.x + dx * l, ny = troli.y + dy * l;
    if (!bebasUntukTroli(nx, ny)) return;
    pindahTroli(R, nx, ny);
    NQ.pemain.taruhSaja(NQ.pemain.x() + dx * l, NQ.pemain.y() + dy * l);
    bunyi -= dt; if (bunyi <= 0) { NQ.audio.efek('roda-troli'); bunyi = 0.9; }
  }
  // Dorong 32 piksel sekali klik (untuk mouse dan layar sentuh)
  function dorongLangkah(R, dx, dy) {
    var maju = 0;
    for (var i = 0; i < 32; i++) { if (!bebasUntukTroli(troli.x + dx * (maju + 1), troli.y + dy * (maju + 1))) break; maju++; }
    if (!maju) { R.bicara('pingo', 'Troli terhalang ke arah itu. Coba arah lain.'); return; }
    NQ.audio.efek('roda-troli');
    pindahTroli(R, troli.x + dx * maju, troli.y + dy * maju);
    // Raka berdiri di sisi berlawanan dari arah dorong
    var bx = troli.x - dx * 20, by = troli.y - dy * 14 + (dy === 0 ? 4 : 0);
    if (!NQ.peta.tabrak(bx - 7, by - 6, 14, 6)) NQ.pemain.taruh(bx, by, dx < 0 ? 'kiri' : dx > 0 ? 'kanan' : dy < 0 ? 'atas' : 'bawah');
  }

  // ---------- Mode Pindai ----------
  function gambarPindai(R, c) {
    var sisa = pindaiSampai - sekarang(); if (sisa <= 0) return;
    var ox = NQ.kamera.x, oy = NQ.kamera.y, a = Math.min(1, sisa, (8 - sisa) * 3);
    c.save(); c.globalAlpha = a;
    for (var y = 56; y < 416; y += 24) for (var x = 0; x < 640; x += 24) {
      var d = sinyal(x + 12, y + 12);
      c.fillStyle = d >= -67 ? 'rgba(94,224,94,0.18)' : (d >= -75 ? 'rgba(255,210,63,0.2)' : 'rgba(255,60,60,0.28)');
      c.fillRect(ox + x, oy + y, 24, 24);
    }
    var t = sekarang();
    for (var i = 0; i < 3; i++) {
      var r = ((t * 40 + i * 50) % 150);
      c.strokeStyle = 'rgba(110,200,255,' + (1 - r / 150) + ')'; c.lineWidth = 1.2;
      c.beginPath(); c.arc(ox + troli.x, oy + troli.y - 14, r, 0, Math.PI * 2); c.stroke();
      TETANGGA.forEach(function (tt) {
        c.strokeStyle = 'rgba(255,159,67,' + (0.7 - r / 220) + ')'; c.lineWidth = 0.8;
        c.beginPath(); c.arc(ox + tt.x, oy + tt.y, r * 0.8, 0, Math.PI); c.stroke();
      });
    }
    c.strokeStyle = '#ffd23f'; c.setLineDash([3, 2]); c.lineWidth = 0.8;
    c.strokeRect(ox + ZONA.x, oy + ZONA.y - 20, ZONA.w, ZONA.h + 20); c.setLineDash([]);
    c.fillStyle = '#ffd23f'; c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'bottom';
    c.fillText('posisi terbuka', ox + ZONA.x + ZONA.w / 2, oy + ZONA.y - 21);
    c.fillStyle = '#ff9f9f'; c.fillText('ZONA MATI', ox + 360, oy + 400);
    c.restore();
  }

  NQ.ruang.buat({
    id: 'kasus-7', ruangan: 'aula', kasus: K, musik: 'eksplorasi', ambien: 'keramaian',

    siapkan: function (R) {
      var t = cat().troli || { x: 48, y: 384 };
      troli = { x: t.x, y: t.y }; prev = null; pindaiSampai = 0;
      padatTroli = NQ.peta.tambahPadat(kotakTroli(troli.x, troli.y));
      NQ.peta.tambahPadat({ x: BETON.x, y: BETON.y + BETON.h - 186, w: BETON.w, h: 186 });
      objTroli = R.objek({ id: 'troli', x: troli.x, y: troli.y + 10, jarak: 24, kilauX: troli.x, kilauY: troli.y - 34,
        kotak: { x: 0, y: 0, w: 0, h: 0 },
        aksi: function () {
          NQ.menu.pilihan('Access Point di Troli', 'Kanal sekarang: ' + kanal() + '.', [
            { label: 'Atur kanal Wi-Fi', aksi: function () { aturKanal(R); } },
            { label: 'Dorong ke kanan', aksi: function () { dorongLangkah(R, 1, 0); } },
            { label: 'Dorong ke kiri', aksi: function () { dorongLangkah(R, -1, 0); } },
            { label: 'Dorong ke atas', aksi: function () { dorongLangkah(R, 0, -1); } },
            { label: 'Dorong ke bawah', aksi: function () { dorongLangkah(R, 0, 1); } },
            { label: 'Cara mendorong troli', aksi: function () { R.dialog('cara-dorong'); } }
          ]);
        },
        alat: { 'wifi-analyzer': function () { pakaiAnalyzer(R); } } });
      R.tambahNPC({ id: 'rara', x: 560, dasar: 184, bicara: function () {
        if (NQ.progres.sudahSelesai(K)) R.bicara('rara', 'Wi-Fi aula siap untuk lomba. Doakan kami menang, ya!');
        else R.bicara('rara', 'Kursi belakang yang paling parah. Peserta lomba duduk di sana besok.');
      } });
      [['panitia-1', 572, 270, 'Kardus berisi kabel rol sudah saya taruh di belakang.'],
       ['panitia-2', 180, 374, 'Kursi belakang ini dipakai peserta. Semoga sinyalnya kuat.'],
       ['panitia-3', 460, 392, 'Laptop panitia sering putus kalau dibawa ke belakang.'],
       ['panitia-4', 600, 336, 'Kabel rol sudah siap. Kita tinggal menunggu Wi-Fi beres.']].forEach(function (p) {
        R.tambahNPC({ id: 'panitia', aset: p[0], x: p[1], dasar: p[2], bicara: function () { NQ.dialog.tampilkan([{ tokoh: 'Panitia', potret: null, teks: p[3] }]); } });
      });
      tugas(R);
    },

    saatMasuk: function (R) {
      if (NQ.progres.sudahSelesai(K) || b('k7.mulai')) return;
      R.tandai('k7.mulai');
      R.dialog('terima-wifi-analyzer', function () {
        NQ.progres.beriAlat('wifi-analyzer');
        NQ.audio.efek('ambil-barang');
        NQ.ui.toast('Wi-Fi Analyzer masuk ke Tas');
        R.dialog('bicara-rara', function () { tugas(R); });
      });
    },

    perbarui: function (R, dt, modal) {
      if (!modal) dorong(R, dt);
      // titik interaksi troli ikut berpindah
      objTroli.x = troli.x; objTroli.y = troli.y + 10; objTroli.kilauX = troli.x; objTroli.kilauY = troli.y - 34;
      objTroli.kotak = { x: troli.x - 13, y: troli.y - 30, w: 26, h: 31 };
    },

    pakaiAlat: function (R, id) { if (id === 'wifi-analyzer') { pakaiAnalyzer(R); return true; } return false; },

    // Panah: tombol Tas (analyzer) -> tombol Pindai -> tombol Tas -> troli lalu titik depan panggung -> tombol Tas
    tujuan: function (R) {
      if (NQ.progres.sudahSelesai(K)) return undefined;
      if (!R.sudah('Gejala')) return { tombol: 'tas' };
      if (!R.sudah('Dugaan')) return { tombol: 'pindai' };
      if (!R.sudah('Uji')) return { tombol: 'tas' };
      if (!R.sudah('Perbaikan')) {
        if (diZona()) return 'troli';
        var dx = NQ.pemain.x() - troli.x, dy = NQ.pemain.y() - troli.y;
        // Raka sudah di dekat troli: tunjukkan tempat tujuan dorongan di depan panggung
        return Math.sqrt(dx * dx + dy * dy) < 46 ? { x: ZONA.x + ZONA.w / 2, y: ZONA.y + ZONA.h / 2 } : 'troli';
      }
      return { tombol: 'tas' };
    },

    pindai: function (R) {
      if (!R.sudah('Gejala') && !NQ.progres.sudahSelesai(K)) { R.dialog('analyzer-dulu'); return true; }
      pindaiSampai = sekarang() + 8;
      NQ.pingo.setMode('pindai'); NQ.audio.efek('pindai-gelombang');
      R.setelah(8, function () { NQ.pingo.setMode('melayang'); });
      if (!R.sudah('Dugaan')) R.setelah(1.4, function () {
        R.dialog('pindai-aktif', function () {
          R.jurnal('Dugaan', 'Sinyal AP terhalang dinding beton dan pilar, dan kanalnya bertabrakan dengan AP tetangga (kanal 1 dan 6).');
          tugas(R);
          pindaiSampai = Math.max(pindaiSampai, sekarang() + 4);
        });
      });
      return true;
    },

    sprite: function (R) {
      return [
        { dasar: troli.y, gambar: function (c, ox, oy) {
          NQ.aset.utuh(c, R.sudah('Perbaikan') ? 'troli-ap-hijau' : 'troli-ap-merah', ox + troli.x - 12, oy + troli.y - 29);
        } },
        { dasar: 416, gambar: function (c, ox, oy) {
          // dinding beton tebal di kiri
          c.fillStyle = '#7d7f86'; c.fillRect(ox + BETON.x, oy + BETON.y, BETON.w, BETON.h);
          c.fillStyle = '#9a9ca3'; c.fillRect(ox + BETON.x, oy + BETON.y, BETON.w, 3);
          c.strokeStyle = '#4a4c52'; c.lineWidth = 0.6; c.strokeRect(ox + BETON.x + 0.3, oy + BETON.y + 0.3, BETON.w - 0.6, BETON.h - 0.6);
          c.beginPath(); c.moveTo(ox + BETON.x + 3, oy + BETON.y + 40); c.lineTo(ox + BETON.x + 8, oy + BETON.y + 52); c.lineTo(ox + BETON.x + 5, oy + BETON.y + 66); c.stroke();
        } },
        { dasar: 1000, gambar: function (c, ox, oy) {
          c.font = 'bold 4.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
          TETANGGA.forEach(function (tt) { c.fillStyle = '#ffd23f'; c.fillText(tt.nama + ' · Kanal ' + tt.kanal, ox + tt.x, oy + 8); });
          c.fillStyle = '#ffffff'; c.font = 'bold 6px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
          c.fillText('LOMBA KOMPETENSI SISWA', ox + 320, oy + 60);
        } }
      ];
    },

    gambarAtas: function (R, c) {
      gambarPindai(R, c);
    }
  });

})(window.NQ = window.NQ || {});
