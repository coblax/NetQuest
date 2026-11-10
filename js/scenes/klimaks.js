/*
 * Scene 12 · Klimaks · Gudang: konfrontasi dengan Glitch.
 * Gudang gelap; hanya lingkaran senter di sekitar Raka dan cahaya ungu Glitch yang terlihat.
 * Router tua SMK-Free menyala di atas meja. Saat Raka mendekat, Glitch muncul dan menu aksi keamanan terbuka.
 *
 * Urutan yang benar (bar Kekuatan Glitch 100 -> 0):
 *   1. Cabut router liar (putus jalur masuk)            -25
 *   2. Blokir MAC perangkat asing (usir penyusup)        -25   } urutan 2 dan 3 bebas,
 *   3. WPA2/WPA3 + sandi kuat (kunci jaringan)           -25   } asal setelah langkah 1
 *   4. Periksa ulang daftar perangkat (verifikasi)       -25 -> Glitch pecah
 * Salah: matikan semua jaringan, sembunyikan SSID, sandi lemah (energi -1);
 *        blokir/WPA sebelum mencabut router, periksa ulang terlalu awal (tidak mengurangi energi).
 * Jurnal: Gejala+Dugaan (Glitch muncul), Uji (router dicabut), Perbaikan (blokir+WPA), Verifikasi+Catat (periksa ulang).
 */
(function (NQ) {
  var K = 'klimaks';
  var ROUTER = { x: 208, y: 96 }, GLITCH = { x: 208, y: 90 }, SKALA_GLITCH = 0.82;
  var MAC_ASING = ['A4-5E-60-C2-11-9F', 'F0-18-98-7B-3C-02'];
  var AKSI = [
    { id: 'cabut', label: 'Cabut router liar SMK-Free' },
    { id: 'wpa', label: 'Ganti keamanan Wi-Fi ke WPA2/WPA3 dengan sandi kuat' },
    { id: 'ssid', label: 'Sembunyikan nama Wi-Fi (SSID)' },
    { id: 'blokir', label: 'Blokir MAC perangkat asing' },
    { id: 'matikan', label: 'Matikan semua jaringan sekolah' },
    { id: 'periksa', label: 'Periksa ulang daftar perangkat' }
  ];

  // Efek tampilan (tidak disimpan)
  var fx = { muncul: 1, kena: 0, pecah: 0, padam: 0, tawa: 0, terang: 0, kuasa: 100, serpih: [] };
  var gelapC = null, mulaiSeq = false, kameraY = null;

  function b(n) { return NQ.progres.bendera(n); }
  function st() {
    var c = (NQ.state.catatan = NQ.state.catatan || {});
    if (!c.klimaks) c.klimaks = { kekuatan: 100, cabut: false, blokir: false, wpa: false };
    return c.klimaks;
  }
  function menang() { return b('klimaks.menang') || NQ.progres.sudahSelesai(K); }
  function keKepsek() { return NQ.state.tahap === 'epilog' && !NQ.progres.sudahSelesai('epilog'); }
  function jarakRouter() { var dx = NQ.pemain.x() - ROUTER.x, dy = NQ.pemain.y() - (ROUTER.y + 20); return Math.sqrt(dx * dx + dy * dy); }

  function tugas(R) {
    if (menang()) {
      if (keKepsek()) R.tugas('Temui Ibu Kepala Sekolah di ruangannya');
      else if (NQ.progres.sudahSelesai('epilog')) R.tugas('Tamat! Main lagi untuk mengejar 3 bintang di semua kasus');
      return;
    }
    if (!b('klimaks.muncul')) R.tugas('Dekati router tua di tengah gudang');
    else R.tugas('Hentikan Glitch dengan langkah keamanan yang tepat');
  }

  // Kekuatan Glitch turun (atau naik bila nilai negatif)
  function kena(jumlah) {
    var s = st();
    s.kekuatan = Math.max(0, Math.min(100, s.kekuatan - jumlah));
    NQ.simpan.simpan();
    if (jumlah > 0) { fx.kena = 0.6; NQ.audio.efek('aksi-tepat'); setTimeout(function () { NQ.audio.efek('kekuatan-turun'); }, 250); }
    else { fx.tawa = 1; NQ.audio.efek('glitch-tertawa'); }
  }

  // Aksi tepat: kekuatan turun ke 25% x jumlah langkah yang belum dikerjakan (penalti sandi lemah ikut terhapus)
  function kenaTepat() {
    var s = st(), sisa = 4 - ['cabut', 'blokir', 'wpa', 'periksa'].filter(function (k) { return s[k]; }).length;
    kena(Math.max(1, s.kekuatan - sisa * 25));
  }

  function bukaMenu(R) {
    if (menang() || !b('klimaks.muncul')) return;
    if (jarakRouter() > 90) { tugas(R); return; }
    var s = st();
    NQ.minigame.pertarungan.buka({
      daftar: function () {
        return AKSI.map(function (a) { return { id: a.id, label: a.label, selesai: !!s[a.id] }; });
      },
      pilih: function (id) { pilihAksi(R, id); }
    });
  }

  function lanjut(R) {
    // Setelah energi habis Raka dikembalikan ke pintu: menu tidak dibuka lagi sampai ia mendekat.
    setTimeout(function () { if (NQ.scene.nama() === 'klimaks' && !NQ.ui.adaModal()) bukaMenu(R); }, 250);
  }

  function pilihAksi(R, id) {
    var s = st();
    if (id === 'matikan') {
      fx.padam = 2.2; NQ.audio.efek('glitch-tertawa'); fx.tawa = 1;
      setTimeout(function () { R.salah('matikan-semua-jaringan', null, function () { lanjut(R); }); }, 700);
      return;
    }
    if (id === 'ssid') {
      NQ.audio.efek('glitch-tertawa'); fx.tawa = 1;
      R.salah('sembunyikan-ssid', null, function () { lanjut(R); });
      return;
    }
    if ((id === 'blokir' || id === 'wpa') && !s.cabut) {
      NQ.audio.efek('glitch-tertawa'); fx.tawa = 1;
      R.salah('pintu-masih-terbuka', null, function () { lanjut(R); });
      return;
    }
    if (id === 'periksa' && !(s.cabut && s.blokir && s.wpa)) {
      R.salah('periksa-ulang-terlalu-awal', null, function () { lanjut(R); });
      return;
    }
    if (id === 'cabut') {
      NQ.pemain.hadap('atas'); NQ.pemain.pose('merunduk', 1.2);
      NQ.audio.efek('cabut-router');
      s.cabut = true; kenaTepat();
      R.jurnal('Uji', 'Router liar SMK-Free dicabut dari stop kontak dan jaringan: SMK-Free hilang dari Wi-Fi analyzer, kekuatan Glitch turun.');
      R.dialog('aksi-cabut-router', function () { pujian(R); });
      return;
    }
    if (id === 'blokir') {
      NQ.pemain.pose('pakaiAlat', 1.2);
      NQ.audio.efek('blokir-mac');
      MAC_ASING.forEach(function (m, i) { setTimeout(function () { NQ.ui.toast('MAC <b>' + m + '</b> diblokir'); }, i * 900); });
      s.blokir = true; kenaTepat();
      R.dialog('aksi-blokir-mac', function () { cekPerbaikan(R); pujian(R); });
      return;
    }
    if (id === 'wpa') {
      var bukaSandi = function () {
        var aturan = cariAturan();
        NQ.minigame.pertarungan.sandi({
          aturan: aturan,
          saatBatal: function () { lanjut(R); },
          saatPasang: function (sandi, mode, h) {
            if (!h.kuat) {
              kena(-10);
              R.salah('sandi-lemah', null, function () { lanjut(R); });
              return;
            }
            NQ.pemain.pose('pakaiAlat', 1.2);
            NQ.audio.efek('kunci-wpa');
            s.wpa = true; s.modeWpa = mode; s.panjangSandi = sandi.length; kenaTepat();
            R.dialog('aksi-wpa-sandi-kuat', function () { cekPerbaikan(R); pujian(R); });
          }
        });
      };
      if (!b('klimaks.sandiInfo')) { R.tandai('klimaks.sandiInfo'); R.dialog('buka-sandi', bukaSandi); } else bukaSandi();
      return;
    }
    if (id === 'periksa') {
      NQ.pemain.pose('pakaiAlat', 1.2); NQ.audio.efek('analyzer-bip');
      var h = '<div class="cek-ulang">';
      for (var i = 1; i <= 12; i++) h += '<span>PC-L2-' + (i < 10 ? '0' : '') + i + ' <b>&#10003;</b></span>';
      h += '</div><div class="ringkas">12 perangkat terhubung &middot; 12 cocok inventaris &middot; 0 perangkat asing</div>';
      NQ.menu.pesan('PERIKSA ULANG DAFTAR PERANGKAT', h, [{ label: 'Lanjut', aksi: function () {
        NQ.menu.tutup();
        s.periksa = true; kenaTepat();
        R.dialog('aksi-periksa-ulang', function () { pecah(R); });
      } }]);
    }
  }

  function cariAturan() {
    var d = NQ.data.umpanBalik[K] || [];
    for (var i = 0; i < d.length; i++) if (d[i].aturanSandiKuat) return d[i].aturanSandiKuat;
    return { panjangMin: 12, dilarang: ['12345678', 'password', 'admin'] };
  }

  function pujian(R) {
    if (!b('klimaks.pujian')) { R.tandai('klimaks.pujian'); R.dialog('lanjut-aksi', function () { lanjut(R); }); }
    else lanjut(R);
  }

  function cekPerbaikan(R) {
    var s = st();
    if (s.blokir && s.wpa && !R.sudah('Perbaikan'))
      R.jurnal('Perbaikan', 'MAC ' + MAC_ASING.join(' dan ') + ' diblokir di router; Wi-Fi sekolah memakai ' + (s.modeWpa || 'WPA3-SAE') +
        ' dengan sandi baru ' + s.panjangSandi + ' karakter (huruf, angka, simbol).');
  }

  function pecah(R) {
    R.sibuk = true;
    fx.pecah = 0.001;
    NQ.audio.efek('glitch-pecah');
    // serpihan ungu beterbangan
    fx.serpih = [];
    for (var i = 0; i < 40; i++) fx.serpih.push({ x: GLITCH.x + (Math.random() - 0.5) * 50, y: GLITCH.y - 40 + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 90, vy: -20 - Math.random() * 60, s: 1 + Math.random() * 2.5, w: Math.random() < 0.3 ? '#4fe3ff' : '#c56bff' });
    setTimeout(function () {
      R.sibuk = false;
      R.tandai('klimaks.menang');
      R.jurnal('Verifikasi', 'Periksa ulang: 12 perangkat terhubung dan semuanya cocok dengan inventaris; SMK-Free tidak terdeteksi lagi.');
      R.jurnal('Catat', 'Penyebab: access point liar SMK-Free tanpa sandi di gudang dan router utama yang masih bersandi bawaan. ' +
        'Solusi berurutan: cabut AP liar, blokir MAC asing, WPA2/WPA3 dengan sandi kuat, lalu periksa ulang. Pencegahan: audit perangkat rutin dan ganti sandi berkala.');
      NQ.audio.musik('eksplorasi');
      R.dialog('glitch-pecah', function () {
        R.dialog('gudang-terang', function () { NQ.kartuKonsep.tampil('k9-amankan', function () {
          NQ.kasus.selesai(K, {
            judul: 'Klimaks - Gudang',
            inti: 'Amankan jaringan berurutan: putus jalur masuk penyusup, usir perangkat asing, kunci Wi-Fi dengan WPA2/WPA3 dan sandi kuat, lalu periksa ulang.',
            berikut: 'epilog', tugas: 'Temui Ibu Kepala Sekolah di ruangannya',
            selesai: function () {
              R.dialog('ke-kepsek', function () { NQ.scene.ke('lorong', { dari: 'ruang-kepsek' }); });
            }
          });
        }); });
      });
    }, 2300);
  }

  // Glitch muncul saat Raka mendekati router
  function munculkan(R) {
    if (mulaiSeq || b('klimaks.muncul')) return;
    mulaiSeq = true;
    NQ.pemain.batalJalan(); NQ.pemain.hadap('atas');
    R.dialog('dekati-router', function () {
      fx.muncul = 0.001;
      NQ.audio.efek('desis-glitch');
      NQ.audio.musik('klimaks');
      R.setelah(1.4, function () {
        R.tandai('klimaks.muncul');
        R.dialog('glitch-muncul', function () {
          R.jurnal('Gejala', 'Router tua SMK-Free di gudang masih menyala tanpa sandi dan kabelnya tersambung ke jaringan sekolah.');
          R.jurnal('Dugaan', 'Glitch masuk lewat access point liar tanpa sandi; router utama juga masih memakai sandi bawaan.');
          tugas(R);
          R.dialog('menu-aksi', function () { mulaiSeq = false; bukaMenu(R); });
        });
      });
    });
  }

  // ---------- Gambar ----------
  function lubang(g, x, y, r, kuat) {
    var gr = g.createRadialGradient(x, y, r * 0.15, x, y, r);
    gr.addColorStop(0, 'rgba(0,0,0,' + kuat + ')'); gr.addColorStop(0.55, 'rgba(0,0,0,' + (kuat * 0.85) + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }

  function gambarGelap(c, ox, oy) {
    var W = c.canvas.width, H = c.canvas.height, r = NQ.renderer.rasio();
    if (!gelapC) gelapC = document.createElement('canvas');
    if (gelapC.width !== W || gelapC.height !== H) { gelapC.width = W; gelapC.height = H; }
    var g = gelapC.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'source-over';
    g.clearRect(0, 0, W, H);
    var a = 0.94 - 0.78 * fx.terang;
    if (a <= 0.01) return;
    g.fillStyle = 'rgba(3,5,16,' + a + ')'; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'destination-out';
    // lingkaran senter di depan Raka
    var px = NQ.pemain.x(), py = NQ.pemain.y() - 18;
    var arah = NQ.pemain.arah(), dx = arah === 'kiri' ? -10 : arah === 'kanan' ? 10 : 0, dy = arah === 'atas' ? -12 : arah === 'bawah' ? 8 : 0;
    lubang(g, (ox + px) * r, (oy + py) * r, 58 * r, 1);
    lubang(g, (ox + px + dx * 3) * r, (oy + py + dy * 3) * r, 46 * r, 0.9);
    // cahaya router dan Glitch
    var s = st();
    if (!menang()) {
      var kedip = 0.75 + Math.sin(performance.now() / 260) * 0.1;
      lubang(g, (ox + GLITCH.x) * r, (oy + GLITCH.y - 26) * r, (b('klimaks.muncul') || fx.muncul < 1 ? 92 : (s.cabut ? 0 : 46)) * r, kedip);
    }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(gelapC, 0, 0); c.restore();
  }

  function gambarGlitch(c, ox, oy, dt) {
    var tampak = b('klimaks.muncul') || fx.muncul < 1;
    if (!tampak || (menang() && fx.pecah === 0)) return;
    var t = performance.now() / 1000, s = st();
    var k = fx.kuasa;
    var fr = k > 50 ? 0 : (k > 25 ? 1 : (k > 0 ? 2 : 3));
    var skala = 1, alfa = 1;
    if (fx.muncul < 1) { skala = 0.3 + 0.7 * fx.muncul; alfa = fx.muncul; }
    if (fx.pecah > 0) { fr = 3; alfa = Math.max(0, 1 - fx.pecah); skala = 1 + fx.pecah * 0.3; }
    var gx = ox + GLITCH.x + (fx.kena > 0 ? (Math.random() - 0.5) * 6 : 0) + (fx.tawa > 0 ? Math.sin(t * 40) * 1.5 : 0);
    var gy = oy + GLITCH.y + Math.sin(t * 2.2) * 2;
    var info = NQ.data.aset.sheet['glitch-besar'];
    // pendar ungu
    c.save();
    var pend = c.createRadialGradient(gx, gy - 40, 4, gx, gy - 40, 60);
    pend.addColorStop(0, 'rgba(197,107,255,' + (0.35 * alfa) + ')'); pend.addColorStop(1, 'rgba(197,107,255,0)');
    c.fillStyle = pend; c.fillRect(gx - 60, gy - 100, 120, 120);
    c.globalAlpha = alfa;
    c.translate(gx, gy); c.scale(skala * SKALA_GLITCH, skala * SKALA_GLITCH);
    NQ.aset.frame(c, 'glitch-besar', fr, 0, -info.w / 2, -info.h);
    if (fx.kena > 0.3) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.5; NQ.aset.frame(c, 'glitch-besar', fr, 0, -info.w / 2, -info.h); }
    c.restore();
  }

  function gambarSerpih(c, ox, oy) {
    fx.serpih.forEach(function (p) {
      c.fillStyle = p.w; c.globalAlpha = Math.max(0, 1 - fx.pecah);
      c.fillRect(ox + p.x, oy + p.y, p.s, p.s);
    });
    c.globalAlpha = 1;
  }

  function gambarBar(c) {
    if (!b('klimaks.muncul') || menang()) return;
    var x = 8, y = 32, w = 124;
    c.fillStyle = 'rgba(13,20,51,0.92)'; c.fillRect(x, y, w, 20);
    c.strokeStyle = '#f2f2f2'; c.lineWidth = 0.8; c.strokeRect(x + 0.5, y + 0.5, w - 1, 19);
    c.fillStyle = '#ff7ad9'; c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'left'; c.textBaseline = 'top';
    c.fillText('KEKUATAN GLITCH', x + 6, y + 3);
    c.textAlign = 'right'; c.fillStyle = '#ffffff'; c.fillText(Math.round(fx.kuasa) + '%', x + w - 6, y + 3);
    c.fillStyle = '#2a1840'; c.fillRect(x + 6, y + 11, w - 12, 5);
    var isi = (w - 12) * fx.kuasa / 100;
    c.fillStyle = fx.tawa > 0 ? '#ffffff' : '#ff3fd0'; c.fillRect(x + 6, y + 11, isi, 5);
    for (var i = 1; i < 12; i++) { c.fillStyle = 'rgba(13,20,51,0.5)'; c.fillRect(x + 6 + i * (w - 12) / 12, y + 11, 0.6, 5); }
  }

  NQ.ruang.buat({
    id: 'klimaks', ruangan: 'gudang', kasus: K, musik: 'misteri',

    siapkan: function (R) {
      var s = st();
      mulaiSeq = false; kameraY = null;
      fx.muncul = 1; fx.kena = 0; fx.pecah = 0; fx.padam = 0; fx.tawa = 0; fx.serpih = [];
      fx.kuasa = s.kekuatan; fx.terang = menang() ? 1 : 0;
      R.objek({ id: 'router-glitch', x: ROUTER.x, y: ROUTER.y + 30, jarak: 30, kilauX: ROUTER.x, kilauY: ROUTER.y - 34,
        kotak: { x: ROUTER.x - 40, y: 20, w: 80, h: 96 },
        aksi: function () {
          if (menang()) { R.bicara('pingo', 'Router liar sudah dicabut. Gudang ini aman sekarang.'); return; }
          if (!b('klimaks.muncul')) munculkan(R); else bukaMenu(R);
        } });
      tugas(R);
    },

    saatMasuk: function (R) {
      if (menang()) { if (keKepsek()) R.dialog('ke-kepsek'); return; }
      if (b('klimaks.muncul')) { NQ.audio.musik('klimaks'); R.bicara('pingo', 'Glitch masih di sana! Dekati router dan lanjutkan langkah keamanan.'); return; }
      if (!b('klimaks.masuk')) { R.tandai('klimaks.masuk'); R.dialog('masuk-gudang', function () { tugas(R); }); }
    },

    perbarui: function (R, dt, modal) {
      var s = st();
      if (fx.muncul < 1) fx.muncul = Math.min(1, fx.muncul + dt / 1.2);
      if (fx.kena > 0) fx.kena = Math.max(0, fx.kena - dt);
      if (fx.tawa > 0) fx.tawa = Math.max(0, fx.tawa - dt);
      if (fx.padam > 0) fx.padam = Math.max(0, fx.padam - dt);
      if (fx.pecah > 0) {
        fx.pecah = Math.min(1, fx.pecah + dt / 2);
        fx.serpih.forEach(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 60 * dt; });
      }
      if (menang() && fx.terang < 1 && !R.sibuk) fx.terang = Math.min(1, fx.terang + dt / 1.5);
      fx.kuasa += (s.kekuatan - fx.kuasa) * Math.min(1, dt * 3);
      if (Math.abs(fx.kuasa - s.kekuatan) < 0.3) fx.kuasa = s.kekuatan;
      if (!modal && !menang() && !b('klimaks.muncul') && b('klimaks.masuk') && jarakRouter() < 70) munculkan(R);
      // Saat berhadapan dengan Glitch, kamera bergeser ke atas supaya Glitch terlihat utuh
      var ingin = (b('klimaks.muncul') || fx.muncul < 1 || fx.pecah > 0) && NQ.pemain.y() < 210 ? 0 : null;
      if (ingin !== null) { kameraY = kameraY === null ? NQ.kamera.y : kameraY; kameraY += (ingin - kameraY) * Math.min(1, dt * 4); NQ.kamera.y = Math.round(kameraY * 4) / 4; }
      else kameraY = null;
    },

    pindai: function (R) {
      NQ.audio.efek('pindai-gelombang'); NQ.pingo.setMode('pindai');
      R.setelah(3, function () { NQ.pingo.setMode('melayang'); });
      if (menang()) R.bicara('pingo', 'Tidak ada lagi gelombang ungu. Jaringan bersih!');
      else R.bicara('pingo', st().cabut ? 'SMK-Free sudah padam, tapi Glitch masih bersembunyi di jaringan. Lanjutkan langkah keamanan!' : 'Gelombang ungu terkuat datang dari router tua di atas meja itu!');
      return true;
    },

    pakaiAlat: function (R, id) {
      if (id === 'wifi-analyzer') {
        NQ.pemain.pose('pakaiAlat', 1.2); NQ.audio.efek('analyzer-bip');
        R.bicara('pingo', st().cabut ? 'SMK-Free tidak terdeteksi lagi. Bagus!' : 'SMK-Free -28 dBm, terbuka tanpa sandi. Sumbernya router tua ini!');
        return true;
      }
      if (id === 'senter') { R.bicara('pingo', 'Senter sudah menyala. Lihat lingkaran cahaya di sekitarmu.'); return true; }
      return false;
    },

    // Panah: router tua (Glitch) sampai Glitch pecah; setelah menang, pintu keluar
    tujuan: function (R) {
      if (menang()) return keKepsek() ? 'keluar' : null;
      return 'router-glitch';
    },

    bolehKeluar: function () { return true; },
    saatKeluar: function (R) {
      NQ.minigame.pertarungan.tutup();
      NQ.scene.ke('lorong-belakang', { posisi: { x: 588, y: 70 }, arah: 'bawah' });
    },

    sprite: function (R) {
      var s = st();
      return [{ dasar: 113, gambar: function (c, ox, oy) {
        var w = NQ.aset.lebar('router-tua'), h = NQ.aset.tinggi('router-tua');
        var rx = ox + ROUTER.x - w / 2, ry = oy + ROUTER.y - h;
        // kabel dari router ke soket di dinding
        c.strokeStyle = '#1b1b24'; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(rx + w - 4, ry + h - 6);
        if (s.cabut) { c.quadraticCurveTo(rx + w + 14, ry + h + 2, rx + w + 18, ry + h + 12); }
        else c.quadraticCurveTo(rx + w + 20, ry + h - 10, ox + 238, oy + 46);
        c.stroke();
        c.fillStyle = '#3a3a48'; c.fillRect(ox + 234, oy + 40, 8, 7);
        c.save();
        if (s.cabut) c.globalAlpha = 0.75;
        NQ.aset.utuh(c, 'router-tua', rx, ry);
        c.restore();
        if (!s.cabut) {
          var t = performance.now() / 1000;
          for (var i = 0; i < 4; i++) { c.fillStyle = (Math.floor(t * 6 + i) % 3) ? '#c56bff' : '#4a2a5a'; c.fillRect(rx + 7 + i * 4, ry + h - 7, 2, 1.6); }
          // gelombang Wi-Fi ungu
          for (var g = 0; g < 3; g++) {
            var a = ((t * 0.8 + g / 3) % 1);
            c.strokeStyle = 'rgba(197,107,255,' + (1 - a) + ')'; c.lineWidth = 1;
            c.beginPath(); c.arc(ox + ROUTER.x, ry + 2, 4 + a * 14, Math.PI * 1.2, Math.PI * 1.8); c.stroke();
          }
        }
        // label SSID
        c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        var lw = 34, lx = ox + ROUTER.x - 30 - lw - 4, ly = oy + ROUTER.y - 4;
        c.fillStyle = 'rgba(10,10,18,0.9)'; c.fillRect(lx, ly, lw, 9);
        c.strokeStyle = s.cabut ? '#7d86b8' : '#ffd23f'; c.lineWidth = 0.6; c.strokeRect(lx + 0.3, ly + 0.3, lw - 0.6, 8.4);
        c.fillStyle = s.cabut ? '#7d86b8' : '#ffd23f'; c.fillText('SMK-Free', lx + lw / 2, ly + 4.8);
        if (s.cabut) { c.strokeStyle = '#ff6b6b'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(lx + 2, ly + 4.5); c.lineTo(lx + lw - 2, ly + 4.5); c.stroke(); }
      } }];
    },

    gambarAtas: function (R, c) {
      var ox = NQ.kamera.x, oy = NQ.kamera.y;
      gambarGelap(c, ox, oy);
      gambarGlitch(c, ox, oy);
      if (fx.pecah > 0) gambarSerpih(c, ox, oy);
      gambarBar(c);
      if (fx.padam > 0) {
        var a = Math.min(1, fx.padam) * 0.85;
        c.fillStyle = 'rgba(0,0,0,' + a + ')'; c.fillRect(0, 0, NQ.config.lebarLayar, NQ.config.tinggiLayar);
        c.fillStyle = 'rgba(255,107,107,' + Math.min(1, fx.padam) + ')'; c.font = 'bold 8px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('SEMUA JARINGAN SEKOLAH PADAM!', NQ.config.lebarLayar / 2, 120);
        c.font = '6px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillText('Layar lomba di aula ikut mati...', NQ.config.lebarLayar / 2, 134);
      }
    }
  });
})(window.NQ = window.NQ || {});
