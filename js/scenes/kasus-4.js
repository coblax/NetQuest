/*
 * Scene 7 · Kasus 4 · Perpustakaan: PC katalog dan printer baru memakai IP yang sama (192.168.10.20).
 * 6 langkah: Gejala (layar PC katalog putus-sambung) -> Dugaan (Pindai: dua perangkat satu nomor rumah)
 * -> Uji (lihat pengaturan IP keduanya) -> Perbaikan (Papan Alamat: printer ke kavling statis kosong)
 * -> Verifikasi (PC katalog stabil, printer mencetak) -> Catat.
 * Salah: kavling terisi, kavling di kompleks DHCP, alamat gateway .1 (energi -1).
 */
(function (NQ) {
  var K = 'kasus-4';
  var PC = { x: 124, atas: 222 }, PRN = { x: 174, y: 224 };
  var STATIS = { 2: 'Switch', 10: 'Server', 20: 'PC Katalog', 21: 'Printer TU' };
  var DHCP_TERPAKAI = [101, 104, 107, 112, 118, 123, 131, 140, 152, 166];
  var pindaiSampai = 0;

  function b(n) { return NQ.progres.bendera(n); }
  function catatan() { return (NQ.state.catatan = NQ.state.catatan || {}); }
  function ipPrinter() { return catatan().printerIP || 20; }
  function sekarang() { return performance.now() / 1000; }

  function tugas(R) {
    if (NQ.progres.sudahSelesai(K)) return;
    if (!R.sudah('Gejala')) R.tugas('Lihat layar PC katalog di meja sirkulasi');
    else if (!R.sudah('Dugaan')) R.tugas('Tekan Q untuk memindai nomor rumah perangkat');
    else if (!R.sudah('Uji')) R.tugas('Lihat pengaturan IP PC katalog dan printer');
    else if (!R.sudah('Perbaikan')) R.tugas('Pindahkan printer ke kavling statis kosong (Papan Alamat)');
    else R.tugas('Cek lagi PC katalog');
  }

  // ---------- PC katalog dan printer ----------
  function layarKatalog(R) {
    if (NQ.progres.sudahSelesai(K)) { R.bicara('pingo', 'PC katalog tersambung stabil.'); return; }
    if (!R.sudah('Perbaikan')) {
      R.dialog('lihat-pc-katalog', function () {
        R.jurnal('Gejala', 'Internet PC katalog putus-sambung sejak printer baru dipasang.');
        tugas(R);
      });
      return;
    }
    NQ.audio.efek('printer-cetak');
    R.dialog('verifikasi-katalog', function () {
      R.jurnal('Verifikasi', 'PC katalog tersambung stabil; printer mencetak halaman uji.');
      R.dialog('verifikasi-berhasil', function () {
        R.jurnal('Catat', 'Penyebab: printer baru diberi IP statis 192.168.10.20 yang sudah dipakai PC katalog (IP bentrok). Solusi: printer dipindah ke 192.168.10.' + ipPrinter() + ' di kompleks statis. Pencegahan: catat daftar IP statis.');
        NQ.kasus.selesai(K, {
          inti: 'Dalam satu jaringan, satu alamat IP hanya untuk satu perangkat. IP statis untuk printer dan server diberikan di luar pool DHCP agar tidak bentrok.',
          berikut: 'kasus-5', tugas: 'Pak Joko di Ruang TU: semua komputer tidak bisa internet'
        });
      });
    });
  }

  function lihatIP(R, siapa) {
    if (!R.sudah('Gejala')) { R.dialog('gejala-dulu'); return; }
    if (!R.sudah('Dugaan')) { R.dialog('pindai-dulu'); return; }
    var ip = siapa === 'printer' ? ipPrinter() : 20;
    R.bicara('pingo', 'Pengaturan IP ' + (siapa === 'printer' ? 'printer' : 'PC katalog') + ': 192.168.10.' + ip + ' (statis).', function () {
      R.tandai('k4.ip-' + siapa);
      if (b('k4.ip-printer') && b('k4.ip-katalog') && !R.sudah('Uji')) {
        R.dialog('uji-terbukti', function () {
          R.jurnal('Uji', 'Pengaturan IP: PC katalog dan printer sama-sama 192.168.10.20 (IP bentrok).');
          tugas(R);
          NQ.kartuKonsep.tampil('k4-ip');
        });
      }
    });
  }

  // ---------- Papan Alamat ----------
  var SEL = { sx: 8, sy: 40, sw: 13, sh: 15, skol: 14, dx: 206, dy: 40, dw: 11, dh: 17, dkol: 17 };
  function selStatis(n) { var i = n - 2; return { x: SEL.sx + (i % SEL.skol) * SEL.sw, y: SEL.sy + Math.floor(i / SEL.skol) * SEL.sh, w: SEL.sw, h: SEL.sh }; }
  function selDHCP(n) { var i = n - 100; return { x: SEL.dx + (i % SEL.dkol) * SEL.dw, y: SEL.dy + Math.floor(i / SEL.dkol) * SEL.dh, w: SEL.dw, h: SEL.dh }; }
  var GATEWAY = { x: 8, y: 18, w: 70, h: 14 };

  function gambarPapan(c, t) {
    c.fillStyle = '#20402a'; c.fillRect(0, 0, 400, 168);
    c.fillStyle = '#ffffff'; c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'left'; c.textBaseline = 'top';
    c.fillText('KOMPLEKS STATIS .2 – .99  (perangkat tetap)', 86, 22);
    c.fillText('KOMPLEKS DHCP .100 – .200  (dibagikan otomatis)', SEL.dx, 22);
    // Gateway
    c.fillStyle = '#5a3a20'; c.fillRect(GATEWAY.x, GATEWAY.y, GATEWAY.w, GATEWAY.h);
    c.fillStyle = '#ffd23f'; c.font = '4.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillText('.1 Gateway (router)', GATEWAY.x + 3, GATEWAY.y + 4);
    var ip = ipPrinter();
    for (var n = 2; n <= 99; n++) {
      var s = selStatis(n), isi = STATIS[n] && !(n === 20 && false);
      var printerDi = n === ip;
      c.strokeStyle = 'rgba(255,210,63,0.6)'; c.lineWidth = 0.4; c.setLineDash([1, 1]);
      c.strokeRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1); c.setLineDash([]);
      if (STATIS[n] || printerDi) NQ.aset.frame(c, 'rumah', printerDi && n !== 20 ? 3 : (n === 20 ? 1 : 0), 0, s.x + 0.5, s.y);
      if (n === 20 && ip === 20) {
        var k = Math.floor(t * 6) % 2;
        NQ.aset.utuh(c, 'petir', s.x + 4 + k, s.y - 2, 6, 9);
      }
      c.fillStyle = '#e6f0e0'; c.font = 'bold 4px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'bottom';
      c.fillText('.' + n, s.x + s.w / 2, s.y + s.h);
      c.textAlign = 'left'; c.textBaseline = 'top';
    }
    for (n = 100; n <= 200; n++) {
      s = selDHCP(n);
      c.strokeStyle = 'rgba(159,232,255,0.5)'; c.lineWidth = 0.4; c.setLineDash([1, 1]);
      c.strokeRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1); c.setLineDash([]);
      if (DHCP_TERPAKAI.indexOf(n) >= 0) NQ.aset.frame(c, 'rumah', 2, 0, s.x, s.y + 1, 0);
      c.fillStyle = '#d8ecff'; c.font = 'bold 3.6px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'bottom';
      c.fillText('.' + n, s.x + s.w / 2, s.y + s.h);
    }
    c.textAlign = 'left'; c.textBaseline = 'top'; c.fillStyle = '#ffd23f'; c.font = '4.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    c.fillText('Merah = PC Katalog (.20)   Hijau = printer   Biru = perangkat lain   Oranye = dipinjam lewat DHCP', 8, 156);
  }

  function klikPapan(R, x, y) {
    var n = 0;
    if (x >= GATEWAY.x && x <= GATEWAY.x + GATEWAY.w && y >= GATEWAY.y && y <= GATEWAY.y + GATEWAY.h) n = 1;
    for (var k = 2; k <= 99 && !n; k++) { var s = selStatis(k); if (x >= s.x && x < s.x + s.w && y >= s.y && y < s.y + s.h) n = k; }
    for (k = 100; k <= 200 && !n; k++) { s = selDHCP(k); if (x >= s.x && x < s.x + s.w && y >= s.y && y < s.y + s.h) n = k; }
    if (!n || R.sudah('Perbaikan')) return;
    if (n === 1) { R.salah('pakai-gateway'); return; }
    if (n >= 100) { R.salah('kavling-dhcp', { ganti: { 'nomor ini': '192.168.10.' + n } }); return; }
    if (n === 20) { R.bicara('pingo', 'Printer memang sedang di .20, bersama PC katalog. Itulah masalahnya. Pilih kavling lain.'); return; }
    if (STATIS[n]) { R.salah('kavling-terisi', { ganti: { 'Kavling itu': 'Kavling .' + n + ' (' + STATIS[n] + ')' } }); return; }
    catatan().printerIP = n;
    NQ.simpan.simpan();
    NQ.audio.efek('kurir-antar');
    R.jurnal('Perbaikan', 'Alamat statis printer diubah dari 192.168.10.20 ke 192.168.10.' + n + ' (kompleks statis, kavling kosong).');
    tugas(R);
    R.dialog('printer-dipindah', function () { NQ.dekat.segarkan(); });
  }

  function bukaPapan(R) {
    if (!R.sudah('Uji')) { if (!R.sudah('Gejala')) R.dialog('gejala-dulu'); else if (!R.sudah('Dugaan')) R.dialog('pindai-dulu'); else R.tahanUji(); return; }
    var buka = function () {
      NQ.dekat.buka({
        judul: 'PAPAN ALAMAT · 192.168.10.x', w: 400, h: 168,
        gambar: gambarPapan, klik: function (x, y) { klikPapan(R, x, y); },
        keterangan: function () {
          return R.sudah('Perbaikan') ? 'Printer sekarang di 192.168.10.' + ipPrinter() + '. Petirnya hilang.' :
            'Klik kavling baru untuk printer. Ingat: printer adalah perangkat tetap.';
        }
      });
    };
    if (!b('k4.papan')) { R.tandai('k4.papan'); R.dialog('buka-papan-alamat', buka); } else buka();
  }

  // ---------- Mode Pindai: papan nomor rumah ----------
  function papanNomor(c, x, y, teks, bentrok) {
    c.font = 'bold 4.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    var w = c.measureText(teks).width + 8;
    c.fillStyle = bentrok ? '#5a1a1a' : '#1d3557'; c.strokeStyle = bentrok ? '#ff6b6b' : '#9fe8ff'; c.lineWidth = 0.6;
    c.fillRect(x - w / 2, y - 7, w, 8); c.strokeRect(x - w / 2, y - 7, w, 8);
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(teks, x, y - 2.8);
  }
  function gambarPindai(R, c) {
    var sisa = pindaiSampai - sekarang(); if (sisa <= 0) return;
    var ox = NQ.kamera.x, oy = NQ.kamera.y, ip = ipPrinter();
    c.save(); c.globalAlpha = Math.min(1, sisa, (8 - sisa) * 3);
    c.fillStyle = 'rgba(5,12,40,0.35)'; c.fillRect(ox, oy, NQ.peta.lebar(), NQ.peta.tinggi());
    var bentrok = ip === 20;
    papanNomor(c, ox + PC.x - 6, oy + PC.atas - 2, '192.168.10.20', bentrok);
    papanNomor(c, ox + PRN.x + 8, oy + PRN.y - 10, '192.168.10.' + ip, bentrok);
    if (bentrok) { var k = Math.floor(sekarang() * 8) % 2; NQ.aset.utuh(c, 'petir', ox + 146 + k, oy + 206, 7, 11); }
    c.restore();
  }

  NQ.ruang.buat({
    id: 'kasus-4', ruangan: 'perpustakaan', kasus: K, musik: 'eksplorasi',

    siapkan: function (R) {
      pindaiSampai = 0;
      R.tambahNPC({ id: 'bu-rina', x: 56, dasar: 226, berdiriY: 50, bicara: function () {
        if (NQ.progres.sudahSelesai(K)) R.bicara('bu-rina', 'Katalog dan printer akur lagi. Terima kasih, Nak.');
        else R.bicara('bu-rina', 'PC katalog ada di sebelah meja saya, printer barunya di meja kecil itu.');
      } });
      R.objek({ id: 'pc-katalog', x: PC.x, y: 274, jarak: 18, kilauX: PC.x, kilauY: PC.atas - 6,
        kotak: { x: 104, y: PC.atas, w: 40, h: 40 },
        aksi: function () {
          NQ.menu.pilihan('PC Katalog', 'Komputer katalog perpustakaan.', [
            { label: 'Lihat layar PC katalog', aksi: function () { layarKatalog(R); } },
            { label: 'Lihat pengaturan IP', aksi: function () { lihatIP(R, 'katalog'); } }
          ]);
        } });
      R.objek({ id: 'printer', x: PRN.x, y: 274, jarak: 18, kilauX: PRN.x, kilauY: PRN.y - 8,
        kotak: { x: PRN.x - 14, y: PRN.y - 4, w: 28, h: 26 },
        aksi: function () {
          NQ.menu.pilihan('Printer baru', 'Printer laser yang baru dipasang.', [
            { label: 'Lihat pengaturan IP printer', aksi: function () { lihatIP(R, 'printer'); } },
            { label: 'Pindahkan alamat printer (Papan Alamat)', aksi: function () { bukaPapan(R); } }
          ]);
        } });
      tugas(R);
    },

    // Panah: PC katalog -> tombol Pindai -> IP PC katalog dan printer -> printer (Papan Alamat) -> PC katalog
    tujuan: function (R) {
      if (NQ.progres.sudahSelesai(K)) return undefined;
      if (!R.sudah('Gejala')) return 'pc-katalog';
      if (!R.sudah('Dugaan')) return { tombol: 'pindai' };
      if (!R.sudah('Uji')) return b('k4.ip-katalog') ? 'printer' : 'pc-katalog';
      if (!R.sudah('Perbaikan')) return 'printer';
      return 'pc-katalog';
    },

    saatMasuk: function (R) {
      if (NQ.progres.sudahSelesai(K) || b('k4.mulai')) return;
      var mulai = function () { R.tandai('k4.mulai'); R.dialog('bicara-bu-rina', function () { tugas(R); }); };
      if (!b('k4.panggilan')) R.dialog('panggilan-pak-bima', function () { R.tandai('k4.panggilan'); mulai(); });
      else mulai();
    },

    pindai: function (R) {
      if (!R.sudah('Gejala') && !NQ.progres.sudahSelesai(K)) { R.dialog('gejala-dulu'); return true; }
      pindaiSampai = sekarang() + 8;
      NQ.pingo.setMode('pindai'); NQ.audio.efek('pindai-gelombang');
      if (ipPrinter() === 20) setTimeout(function () { NQ.audio.efek('petir-kecil'); }, 600);
      R.setelah(8, function () { NQ.pingo.setMode('melayang'); });
      if (!R.sudah('Dugaan')) R.setelah(1.2, function () {
        R.dialog('pindai-aktif', function () {
          R.dialog('periksa-dua-perangkat', function () {
            R.jurnal('Dugaan', 'PC katalog dan printer memakai nomor rumah yang sama: IP bentrok.');
            tugas(R);
            pindaiSampai = Math.max(pindaiSampai, sekarang() + 4);
          });
        });
      });
      return true;
    },

    sprite: function () {
      return [{ dasar: 263, gambar: function (c, ox, oy) { NQ.aset.utuh(c, 'printer', ox + PRN.x - 12, oy + PRN.y - 2); } }];
    },

    gambarAtas: function (R, c) { gambarPindai(R, c); }
  });
})(window.NQ = window.NQ || {});
