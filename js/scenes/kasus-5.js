/*
 * Scene 8 · Kasus 5 · Ruang TU: layanan DHCP di router dimatikan, semua PC mendapat 169.254.x.x (APIPA).
 * 6 langkah: Gejala (ipconfig di PC TU) -> Dugaan (lemari router: kurir tertahan) -> Uji (panel router: DHCP MATI)
 * -> Perbaikan (nyalakan DHCP, kurir DORA berjalan) -> Verifikasi (ipconfig /renew: 192.168.10.1xx) -> Catat.
 * Keping glitch 2 menempel di sakelar dinding.
 * Salah: matikan router, pool menimpa kompleks statis (energi -1); IP statis manual, renew sebelum DHCP (ditegur).
 */
(function (NQ) {
  var K = 'kasus-5';
  var LEMARI = { x: 288, dasar: 76 }, KURIR = { x: 272, dasar: 96 }, SAKELAR = { x: 335, y: 31 };
  var jar = null, doraMulai = null;

  function b(n) { return NQ.progres.bendera(n); }
  function sekarang() { return performance.now() / 1000; }

  function tugas(R) {
    if (NQ.progres.sudahSelesai(K)) return;
    if (!R.sudah('Gejala')) R.tugas('Buka terminal di PC TU dan ketik ipconfig');
    else if (!R.sudah('Dugaan')) R.tugas('Periksa lemari router di pojok kanan');
    else if (!R.sudah('Uji')) R.tugas('Buka panel router di lemari');
    else if (!R.sudah('Perbaikan')) R.tugas('Nyalakan layanan DHCP di panel router');
    else if (!R.sudah('Verifikasi')) R.tugas('Ketik ipconfig /renew di PC TU');
    else if (!b('k5.keping')) R.tugas('Ambil keping ungu di sakelar dinding');
    else R.tugas('Selesaikan laporan');
  }

  function cekSelesai(R) {
    if (!R.sudah('Verifikasi') || !b('k5.keping') || NQ.progres.sudahSelesai(K)) { tugas(R); return; }
    R.jurnal('Catat', 'Penyebab: layanan DHCP di router dimatikan (ditemukan keping glitch 2), sehingga PC memakai alamat darurat 169.254.x.x. Solusi: DHCP dinyalakan, PC menjalankan ipconfig /renew. Pencegahan: kunci lemari router dan ganti sandi panel router.');
    NQ.kasus.selesai(K, {
      inti: 'DHCP membagikan IP lewat 4 tahap: Discover, Offer, Request, Acknowledge. IP 169.254.x.x (APIPA) muncul saat komputer tidak mendapat jawaban dari server DHCP.',
      berikut: 'kasus-6', tugas: 'Pak Hendra di Ruang Multimedia: situs sekolah tidak bisa dibuka'
    });
  }

  // ---------- Terminal PC TU ----------
  function bukaTerminal(R, nomor) {
    if (!NQ.progres.punyaAlat('laptop')) { R.bicara('pingo', 'Kita butuh laptop teknisi dari Kak Dimas untuk mengetik perintah.'); return; }
    NQ.terminal.buka({
      host: 'PC-TU-0' + nomor, jaringan: jar,
      saatPerintah: function (ev) {
        if ((ev === 'ipconfig' || ev === 'ipconfig-all') && jar.apipa && !R.sudah('Gejala')) {
          R.dialog('ketik-ipconfig', function () {
            R.jurnal('Gejala', 'Semua PC TU tidak bisa internet; ipconfig menunjukkan alamat 169.254.x.x (APIPA) tanpa gateway.');
            tugas(R);
          });
        } else if (ev === 'renew-gagal') {
          if (R.sudah('Gejala')) R.salah('renew-sebelum-dhcp');
        } else if (ev === 'renew-ok' && !R.sudah('Verifikasi')) {
          R.tandai('k5.renew');
          R.dialog('verifikasi-berhasil', function () {
            R.jurnal('Verifikasi', 'ipconfig /renew berhasil: PC TU mendapat 192.168.10.123 dari kompleks DHCP; internet jalan.');
            cekSelesai(R);
          });
        }
      }
    });
  }

  // ---------- Lemari dan panel router ----------
  function periksaLemari(R) {
    if (!R.sudah('Gejala')) { R.dialog('ipconfig-dulu'); return; }
    if (!R.sudah('Dugaan')) {
      NQ.audio.efek('ketuk-lemari');
      R.dialog('periksa-lemari-router', function () {
        R.jurnal('Dugaan', 'Layanan DHCP di router tidak berjalan, sehingga tidak ada yang membagikan alamat IP.');
        R.tandai('k5.lemariBuka');
        tugas(R);
      });
      return;
    }
    NQ.menu.pilihan('Lemari Router', 'Router utama sekolah ada di dalam lemari ini.', [
      { label: 'Buka panel router', aksi: function () { bukaPanel(R); } }
    ]);
  }

  var LANGKAH = [
    { nama: '1. DISCOVER', ket: 'Komputer mencari server DHCP', arah: 1 },
    { nama: '2. OFFER', ket: 'Router menawarkan alamat IP', arah: -1 },
    { nama: '3. REQUEST', ket: 'Komputer meminta alamat itu', arah: 1 },
    { nama: '4. ACK', ket: 'Router menyetujui dan memberi IP', arah: -1 }
  ];

  function gambarPanel(c, t) {
    var nyala = b('k5.dhcp');
    c.fillStyle = '#10162e'; c.fillRect(0, 0, 300, 170);
    c.fillStyle = '#1d2a55'; c.fillRect(6, 6, 288, 74);
    c.fillStyle = '#ffd23f'; c.font = 'bold 6px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'left'; c.textBaseline = 'top';
    c.fillText('PANEL ROUTER  192.168.10.1', 12, 10);
    c.fillStyle = '#fff'; c.font = '5.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    c.fillText('Layanan DHCP', 12, 24);
    c.fillStyle = nyala ? '#2e9e4a' : '#a83232'; c.fillRect(210, 22, 40, 10);
    c.fillStyle = '#fff'; c.fillRect(nyala ? 238 : 212, 23, 10, 8);
    c.fillStyle = nyala ? '#5ee05e' : '#ff6b6b'; c.font = 'bold 5.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillText(nyala ? 'NYALA' : 'MATI', 256, 24);
    c.fillStyle = '#c8d4f0'; c.font = '5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    c.fillText('Pool IP  :  192.168.10.100  –  192.168.10.200', 12, 40);
    c.fillText('Gateway  :  192.168.10.1', 12, 52);
    c.fillText('DNS        :  8.8.8.8', 12, 64);
    // DORA
    c.fillStyle = '#ffd23f'; c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillText('KURIR ALAMAT (DHCP) · 4 LANGKAH', 12, 86);
    NQ.aset.frame(c, 'monitor', 0, 0, 14, 104);
    NQ.aset.utuh(c, 'router-hijau', 252, 106, 26, 22);
    c.fillStyle = '#9fa8d0'; c.font = '4px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center';
    c.fillText('PC TU', 23, 124); c.fillText('Router', 265, 129);
    var aktifL = -1, kx = 40, kf = 2;
    if (doraMulai !== null) {
      var dt = sekarang() - doraMulai, i = Math.min(3, Math.floor(dt / 1.3)), f = Math.min(1, (dt % 1.3) / 1.1);
      if (dt >= 5.2) { i = 4; f = 1; }
      aktifL = i;
      if (i < 4) { var L = LANGKAH[i]; kx = L.arah === 1 ? 40 + 190 * f : 230 - 190 * f; kf = Math.floor(dt * 6) % 2; }
      else { kx = 40; kf = 2; }
    }
    if (nyala || doraMulai !== null) NQ.aset.frame(c, 'kurir', kf, 0, kx, 104);
    for (var k = 0; k < 4; k++) {
      var bx = 10 + k * 71;
      c.fillStyle = k === aktifL ? '#2e4a8e' : '#18213f'; c.fillRect(bx, 136, 67, 26);
      c.strokeStyle = k === aktifL ? '#ffd23f' : '#3a4a8a'; c.lineWidth = 0.6; c.strokeRect(bx, 136, 67, 26);
      c.fillStyle = k === aktifL ? '#ffd23f' : '#c8d4f0'; c.font = 'bold 4.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'left';
      c.fillText(LANGKAH[k].nama, bx + 3, 139);
      c.fillStyle = '#c8d4f0'; c.font = '4px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillText(LANGKAH[k].ket, bx + 3, 148);
    }
    if (aktifL === 4) { c.fillStyle = '#5ee05e'; c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.fillText('Alamat 192.168.10.123 diterima!', 150, 92); }
  }

  function bukaPanel(R) {
    if (!R.sudah('Uji')) setTimeout(function () {
      R.dialog('dhcp-mati', function () { R.jurnal('Uji', 'Panel router: Layanan DHCP berstatus MATI; pool .100 – .200 benar.'); tugas(R); NQ.dekat.segarkan(); NQ.kartuKonsep.tampil('k5-dhcp'); });
    }, 500);
    NQ.dekat.buka({
      judul: 'LEMARI ROUTER · PANEL', w: 300, h: 170, gambar: gambarPanel,
      keterangan: function () { return b('k5.dhcp') ? 'Layanan DHCP menyala. Kurir siap membagikan alamat.' : 'Layanan DHCP mati. Komputer TU tidak mendapat alamat.'; },
      opsi: function () {
        return [
          { label: 'Nyalakan layanan DHCP', nonaktif: b('k5.dhcp'), aksi: function () { nyalakan(R); } },
          { label: 'Ubah pool menjadi .2 – .200', aksi: function () { NQ.audio.efek('petir-kecil'); R.salah('pool-menimpa-statis'); } },
          { label: 'Matikan router', aksi: function () { NQ.audio.efek('alarm'); R.salah('matikan-router'); } }
        ];
      },
      tutup: function () { doraMulai = null; }
    });
  }

  function nyalakan(R) {
    if (!R.sudah('Uji')) { R.tahanUji(); return; }
    R.tandai('k5.dhcp'); jar.dhcpAktif = true;
    NQ.audio.efek('sakelar');
    R.dialog('dhcp-menyala', function () {
      doraMulai = sekarang();
      for (var i = 0; i < 4; i++) (function (k) { setTimeout(function () { NQ.audio.efek('kurir-langkah'); }, k * 1300 + 100); })(i);
      setTimeout(function () {
        NQ.audio.efek('kurir-antar');
        R.dialog('kurir-selesai', function () {
          R.jurnal('Perbaikan', 'Layanan DHCP dinyalakan; kurir menjalankan DORA (Discover, Offer, Request, Acknowledge).');
          tugas(R);
          NQ.dekat.segarkan();
        });
      }, 5400);
    });
  }

  function ambilKeping(R) {
    R.dialog('ambil-keping', function () {
      R.tandai('k5.keping');
      NQ.state.keping = Math.max(NQ.state.keping, 2);
      NQ.audio.efek('ambil-barang'); NQ.hud.segarkan();
      if (!R.sudah('Verifikasi')) tugas(R); else cekSelesai(R);
    });
  }

  NQ.ruang.buat({
    id: 'kasus-5', ruangan: 'ruang-tu', kasus: K, musik: 'eksplorasi',

    siapkan: function (R) {
      doraMulai = null;
      jar = { ip: b('k5.renew') ? '192.168.10.123' : '169.254.37.112', apipa: !b('k5.renew'), mask: '255.255.255.0',
        gateway: '192.168.10.1', dns: '8.8.8.8', mac: '3C-52-82-1A-07-B4', dhcpAktif: b('k5.dhcp'),
        ipDhcp: '192.168.10.123', cacheNegatif: false, dnsBenar: function () { return true; } };
      NQ.peta.tambahPadat({ x: LEMARI.x, y: LEMARI.dasar - 10, w: 26, h: 10 });

      [[24, 118], [116, 118], [208, 118], [24, 178], [116, 178], [208, 178]].forEach(function (m, i) {
        R.objek({ id: 'pc-tu-' + (i + 1), x: m[0] + 30, y: m[1] + 10, jarak: 18, kilauX: m[0] + 18, kilauY: m[1] - 44,
          kotak: { x: m[0], y: m[1] - 38, w: 50, h: 30 },
          aksi: function () {
            NQ.menu.pilihan('PC-TU-0' + (i + 1), 'Komputer staf tata usaha.', [
              { label: 'Buka terminal', aksi: function () { bukaTerminal(R, i + 1); } },
              { label: 'Atur IP statis manual', aksi: function () { R.salah('ip-statis-manual'); } }
            ]);
          },
          alat: { 'laptop': function () { bukaTerminal(R, i + 1); } } });
      });
      R.objek({ id: 'lemari-router', x: LEMARI.x + 12, y: LEMARI.dasar + 14, jarak: 20, kilauX: LEMARI.x + 12, kilauY: LEMARI.dasar - 50,
        kotak: { x: LEMARI.x - 2, y: LEMARI.dasar - 46, w: 30, h: 46 }, aksi: function () { periksaLemari(R); } });
      R.objek({ id: 'sakelar', x: SAKELAR.x, y: 66, jarak: 18, kilauX: SAKELAR.x, kilauY: SAKELAR.y - 10,
        kotak: { x: SAKELAR.x - 8, y: SAKELAR.y - 8, w: 16, h: 16 },
        aktif: function () { return R.sudah('Dugaan') && !b('k5.keping'); }, aksi: function () { ambilKeping(R); } });

      R.tambahNPC({ id: 'pak-joko', x: 306, dasar: 152, bicara: function () {
        if (NQ.progres.sudahSelesai(K)) R.bicara('pak-joko', 'Semua komputer TU dapat alamat lagi. Saya tidak panik lagi!');
        else R.bicara('pak-joko', 'Coba lihat komputer mana saja. Semuanya sama, angkanya 169 sekian.');
      } });
      R.tambahNPC({ id: 'kak-dimas', x: 120, dasar: 206, padat: false,
        aktif: function () { return !NQ.progres.sudahSelesai(K); },
        bicara: function () { R.bicara('kak-dimas', 'Pakai laptop itu untuk mengetik ipconfig di komputer TU.'); } });
      tugas(R);
    },

    saatMasuk: function (R) {
      if (NQ.progres.sudahSelesai(K) || b('k5.mulai')) return;
      R.tandai('k5.mulai');
      R.dialog('terima-laptop', function () {
        NQ.progres.beriAlat('laptop');
        NQ.audio.efek('ambil-barang');
        NQ.ui.toast('Laptop Teknisi masuk ke Tas');
        R.dialog('bicara-pak-joko', function () { tugas(R); });
      });
    },

    // Panah: PC TU (terminal) -> lemari router (periksa, panel, DHCP) -> PC TU (renew) -> keping di sakelar
    tujuan: function (R) {
      if (NQ.progres.sudahSelesai(K)) return undefined;
      if (!R.sudah('Gejala')) return 'pc-tu-1';
      if (!R.sudah('Perbaikan')) return 'lemari-router';
      if (!R.sudah('Verifikasi')) return 'pc-tu-1';
      return b('k5.keping') ? null : 'sakelar';
    },

    perbarui: function (R, dt) {
      if (!b('k5.dhcp') && Math.floor(sekarang() / 3) !== R._ketuk) { R._ketuk = Math.floor(sekarang() / 3); if (R._ketuk % 3 === 0) NQ.audio.efek('ketuk-lemari'); }
    },

    pindai: function (R) {
      NQ.audio.efek('pindai-gelombang');
      NQ.pingo.setMode('pindai');
      R._pindai = sekarang() + 7;
      R.setelah(7, function () { NQ.pingo.setMode('melayang'); });
      if (!R.sudah('Gejala')) R.setelah(0.8, function () { R.bicara('pingo', 'Semua komputer memasang papan nomor 169.254. Itu alamat darurat! Buka terminal untuk memastikan.'); });
      return true;
    },

    sprite: function (R) {
      var d = [];
      var buka = b('k5.lemariBuka');
      d.push({ dasar: LEMARI.dasar, gambar: function (c, ox, oy) { NQ.aset.utuh(c, buka ? 'lemari-router-buka' : 'lemari-router', ox + LEMARI.x, oy + LEMARI.dasar - 44); } });
      if (!b('k5.dhcp')) d.push({ dasar: KURIR.dasar, gambar: function (c, ox, oy) {
        var f = Math.floor(sekarang() * 2) % 2 === 0 ? 2 : 3;
        NQ.aset.frame(c, 'kurir', f, 0, ox + KURIR.x - 12, oy + KURIR.dasar - 24);
        c.fillStyle = '#fff'; c.strokeStyle = '#1a1426'; c.lineWidth = 0.6;
        c.beginPath(); c.arc(ox + KURIR.x + 8, oy + KURIR.dasar - 30, 4, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = '#6b3fd0'; c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('?', ox + KURIR.x + 8, oy + KURIR.dasar - 29.6);
      } });
      if (R.sudah('Dugaan') && !b('k5.keping')) d.push({ dasar: 999, gambar: function (c, ox, oy) {
        var t = sekarang();
        c.save(); c.globalAlpha = 0.6 + Math.sin(t * 4) * 0.3;
        c.fillStyle = 'rgba(197,107,255,0.5)'; c.beginPath(); c.arc(ox + SAKELAR.x, oy + SAKELAR.y, 6, 0, Math.PI * 2); c.fill(); c.restore();
        NQ.aset.utuh(c, 'kilau', ox + SAKELAR.x - 5, oy + SAKELAR.y - 5, 10, 10);
      } });
      return d;
    },

    gambarAtas: function (R, c) {
      var sisa = (R._pindai || 0) - sekarang(); if (sisa <= 0) return;
      var ox = NQ.kamera.x, oy = NQ.kamera.y, ok = b('k5.renew');
      c.save(); c.globalAlpha = Math.min(1, sisa);
      c.fillStyle = 'rgba(5,12,40,0.35)'; c.fillRect(ox, oy, NQ.peta.lebar(), NQ.peta.tinggi());
      [[24, 118], [116, 118], [208, 118], [24, 178], [116, 178], [208, 178]].forEach(function (m, i) {
        var teks = ok ? '192.168.10.1' + (23 + i) : '169.254.x.x';
        c.font = 'bold 4.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        var w = c.measureText(teks).width + 8, x = ox + m[0] + 18, y = oy + m[1] - 46;
        var kedip = !ok && Math.floor(sekarang() * 3 + i) % 2 === 0;
        c.fillStyle = ok ? '#1d3557' : (kedip ? '#7a1f1f' : '#5a1a1a'); c.strokeStyle = ok ? '#9fe8ff' : '#ff6b6b'; c.lineWidth = 0.6;
        c.fillRect(x - w / 2, y, w, 8); c.strokeRect(x - w / 2, y, w, 8);
        c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(teks, x, y + 4.2);
      });
      c.restore();
    }
  });
})(window.NQ = window.NQ || {});
