/*
 * Scene 11 · Kasus 8 · Lab Komputer 2 dan Lorong Belakang: ada perangkat asing yang menumpang lewat SMK-Free.
 * 6 langkah: Gejala (kuota habis, daftar perangkat lebih banyak dari jumlah PC) -> Dugaan (ada perangkat asing)
 * -> Uji (cocokkan MAC dengan inventaris: 2 MAC asing) -> Perbaikan (lacak sinyal SMK-Free ke gudang)
 * -> Verifikasi (4 keping dipasang, gembok terbuka, sinyal terkuat di gudang) -> Catat.
 * Salah: menandai perangkat yang ada di inventaris (energi -1); masuk gudang tanpa senter (ditolak).
 */
(function (NQ) {
  var K = 'kasus-8';
  var PREFIX = 'D8-BB-C1-4E-2A-';
  var ASING = [{ nama: 'PC-L2-03', ip: '192.168.10.131', mac: 'A4-5E-60-C2-11-9F' }, { nama: 'PC-L2-09', ip: '192.168.10.147', mac: 'F0-18-98-7B-3C-02' }];

  function b(n) { return NQ.progres.bendera(n); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hex(n) { return ('0' + n.toString(16).toUpperCase()).slice(-2); }
  function inventaris() { var d = []; for (var i = 1; i <= 12; i++) d.push({ nama: 'PC-L2-' + pad(i), ip: '192.168.10.1' + pad(i), mac: PREFIX + hex(i * 7 + 16) }); return d; }
  function daftarTerhubung() {
    var d = inventaris().slice();
    d.splice(3, 0, { nama: ASING[0].nama, ip: ASING[0].ip, mac: ASING[0].mac, asing: true });
    d.splice(10, 0, { nama: ASING[1].nama, ip: ASING[1].ip, mac: ASING[1].mac, asing: true });
    return d;
  }
  function cat() { return (NQ.state.catatan = NQ.state.catatan || {}); }

  function tugas(R) {
    if (NQ.progres.sudahSelesai(K)) return;
    if (!R.sudah('Gejala') || !R.sudah('Uji')) R.tugas(R.sudah('Gejala') ? 'Cocokkan MAC di daftar perangkat dengan inventaris' : 'Buka daftar perangkat di PC admin (meja guru)');
    else if (!b('k8.smkfree')) R.tugas('Cari sumber jaringan asing dengan Wi-Fi analyzer');
    else if (!b('k8.senter')) R.tugas('Ambil senter di lemari laci, lalu lewat pintu belakang');
    else R.tugas('Ikuti sinyal SMK-Free lewat pintu belakang');
  }

  // ---------- Panel daftar perangkat ----------
  var panel, aktif = false, sudahDaftar = false, Rref = null;
  function bukaDaftar(R) {
    Rref = R;
    if (!panel) {
      panel = NQ.ui.el('div', 'panel daftar-perangkat tersembunyi');
      if (!sudahDaftar) { NQ.ui.daftarModal({ aktif: function () { return aktif; } }); sudahDaftar = true; }
    }
    NQ.ui.hapusFokus(panel);
    render();
    aktif = true; panel.classList.remove('tersembunyi'); NQ.input.reset();
    if (!R.sudah('Gejala')) setTimeout(function () {
      R.dialog('buka-pc-admin', function () {
        R.jurnal('Gejala', 'Kuota lab habis; router mencatat 14 perangkat terhubung, padahal Lab Komputer 2 hanya punya 12 PC.');
        R.jurnal('Dugaan', 'Ada perangkat asing yang menumpang jaringan lab.');
        R.dialog('terima-inventaris', function () { R.tandai('k8.inventaris'); render(); tugas(R); });
      });
    }, 500);
  }
  function tutupDaftar() { aktif = false; if (panel) panel.classList.add('tersembunyi'); NQ.input.reset(); }
  function render() {
    var R = Rref, tanda = cat().tandaAsing || [];
    var h = '<h2>DAFTAR PERANGKAT TERHUBUNG · ROUTER LAB 2</h2><div class="dua-kolom"><div class="kolom-daftar"><table><tr><th>No</th><th>Nama</th><th>IP</th><th>Alamat MAC</th><th></th></tr>';
    daftarTerhubung().forEach(function (d, i) {
      var t = tanda.indexOf(d.mac) >= 0;
      h += '<tr class="' + (t ? 'ditandai' : '') + '"><td>' + (i + 1) + '</td><td>' + d.nama + '</td><td>' + d.ip + '</td><td class="mac">' + d.mac + '</td><td>' +
        (t ? '<span class="asing">ASING</span>' : '<button class="tombol kecil tandai" data-mac="' + d.mac + '" data-nama="' + d.nama + '">Tandai asing</button>') + '</td></tr>';
    });
    h += '</table></div>';
    if (b('k8.inventaris')) {
      h += '<div class="kolom-inventaris"><div class="judul-inv">INVENTARIS LAB 2</div>';
      inventaris().forEach(function (d) { h += '<div class="baris-inv"><span>' + d.nama + '</span><span class="mac">' + d.mac + '</span></div>'; });
      h += '</div>';
    }
    h += '</div><div class="kaki">Bandingkan alamat MAC, bukan hanya nama. Nama perangkat bisa dipalsukan.</div>';
    panel.innerHTML = h;
    var tutup = NQ.ui.el('button', 'tombol kecil', panel, 'Tutup');
    tutup.addEventListener('click', tutupDaftar);
    [].forEach.call(panel.querySelectorAll('button.tandai'), function (btn) {
      btn.addEventListener('click', function () { if (!NQ.kotakDialog.aktif()) tandai(R, btn.getAttribute('data-mac'), btn.getAttribute('data-nama')); });
    });
  }
  function tandai(R, mac, nama) {
    if (!b('k8.inventaris')) { R.bicara('pingo', 'Kita butuh daftar inventaris dari Bu Wati untuk membandingkan.'); return; }
    var asing = ASING.some(function (a) { return a.mac === mac; });
    if (!asing) { R.salah('blokir-perangkat-inventaris', { ganti: { 'PC 05': nama } }); return; }
    var t = cat().tandaAsing = cat().tandaAsing || [];
    if (t.indexOf(mac) < 0) t.push(mac);
    NQ.simpan.simpan(); NQ.audio.efek('perangkat-asing'); render();
    if (t.length >= 2 && !R.sudah('Uji')) R.dialog('mac-asing-ditemukan', function () {
      R.jurnal('Uji', 'MAC A4-5E-60-C2-11-9F dan F0-18-98-7B-3C-02 tidak ada di inventaris: dua perangkat asing memakai nama palsu PC-L2-03 dan PC-L2-09.');
      tugas(R);
      NQ.kartuKonsep.tampil('k8-mac');
    });
  }

  // ---------- Wi-Fi analyzer daftar SSID ----------
  function gambarSSID(c, dbmFree) {
    c.fillStyle = '#10162e'; c.fillRect(0, 0, 200, 110);
    NQ.aset.utuh(c, 'wifi-analyzer', 6, 0, 65, 110);
    var daftar = [['SMK-Guru', true, -58], ['SMK-Siswa', true, -61], ['SMK-Free', false, dbmFree]];
    c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillStyle = '#ffd23f'; c.textAlign = 'left'; c.textBaseline = 'top';
    c.fillText('Jaringan Wi-Fi terdeteksi', 80, 12);
    daftar.forEach(function (d, i) {
      var y = 26 + i * 22, bebas = !d[1];
      c.fillStyle = bebas ? '#4a1d5a' : '#18213f'; c.fillRect(78, y - 3, 116, 18);
      c.fillStyle = bebas ? '#e7b6ff' : '#ffffff'; c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      c.fillText(d[0] + (bebas ? '  TERBUKA!' : '  (bersandi)'), 82, y);
      c.font = '4.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillStyle = '#9dffb0'; c.fillText(d[2] + ' dBm', 82, y + 7);
    });
  }

  NQ.ruang.buat({
    id: 'kasus-8', ruangan: 'lab-komputer-2', kasus: K, musik: 'misteri',

    siapkan: function (R) {
      R.objek({ id: 'pc-admin', x: 432, y: 316, jarak: 18, kilauX: 420, kilauY: 262,
        kotak: { x: 396, y: 268, w: 72, h: 38 }, aksi: function () { bukaDaftar(R); } });
      R.objek({ id: 'lemari-senter', x: 465, y: 212, jarak: 18, kilauX: 465, kilauY: 160,
        kotak: { x: 450, y: 164, w: 22, h: 36 },
        aktif: function () { return !b('k8.senter'); },
        aksi: function () { R.tandai('k8.senter'); NQ.progres.beriAlat('senter'); NQ.audio.efek('ambil-barang'); R.dialog('senter-ambil', function () { tugas(R); }); } });
      R.objek({ id: 'pintu-belakang', x: 439, y: 62, jarak: 18, kilauX: 439, kilauY: 22,
        kotak: { x: 420, y: 0, w: 38, h: 50 },
        aksi: function () {
          if (!b('k8.smkfree') && !NQ.progres.sudahSelesai(K)) { R.bicara('pingo', 'Pintu belakang menuju lorong ke gudang. Kita belum punya alasan ke sana.'); return; }
          NQ.audio.efek('pintu-buka');
          NQ.scene.ke('lorong-belakang', {});
        } });
      R.tambahNPC({ id: 'bu-wati', x: 300, dasar: 290, bicara: function () {
        if (NQ.progres.sudahSelesai(K)) R.bicara('bu-wati', 'Lab kita aman. Hati-hati di gudang, Raka.');
        else R.bicara('bu-wati', 'Daftar perangkat ada di PC admin, di meja guru pojok kanan.');
      } });
      tugas(R);
    },

    saatMasuk: function (R) {
      if (NQ.progres.sudahSelesai(K) || b('k8.mulai')) return;
      R.tandai('k8.mulai');
      R.dialog('bicara-bu-wati', function () { tugas(R); });
    },

    pakaiAlat: function (R, id) {
      if (id !== 'wifi-analyzer') return false;
      NQ.pemain.pose('pakaiAlat', 1.2); NQ.audio.efek('analyzer-bip');
      NQ.dekat.buka({ judul: 'WI-FI ANALYZER · LAB KOMPUTER 2', w: 200, h: 110, gambar: function (c) { gambarSSID(c, -72); },
        keterangan: function () { return 'SMK-Free tidak ada di daftar jaringan resmi sekolah dan tidak bersandi.'; } });
      if (!R.sudah('Uji')) { setTimeout(function () { R.dialog('daftar-dulu'); }, 700); return true; }
      if (!b('k8.smkfree')) setTimeout(function () {
        R.dialog('pakai-wifi-analyzer', function () { R.tandai('k8.smkfree'); R.dialog('pintu-belakang', function () { NQ.dekat.tutup(); tugas(R); }); });
      }, 700);
      return true;
    },

    // Panah: PC admin (daftar perangkat) -> tombol Tas (analyzer) -> lemari senter -> pintu belakang
    tujuan: function (R) {
      if (NQ.progres.sudahSelesai(K)) return NQ.progres.sudahSelesai('klimaks') ? 'keluar' : 'pintu-belakang';
      if (!R.sudah('Gejala') || !R.sudah('Uji')) return 'pc-admin';
      if (!b('k8.smkfree')) return { tombol: 'tas' };
      if (!b('k8.senter')) return 'lemari-senter';
      return 'pintu-belakang';
    },

    // Keyboard di daftar perangkat: panah memilih tombol "Tandai asing", E menekan, Esc menutup
    perbarui: function () {
      if (!aktif || NQ.kotakDialog.aktif() || NQ.kartuKonsep.aktif()) return;
      if (NQ.ui.navTombol(panel)) return;
      if (NQ.input.baruDitekan('batal')) tutupDaftar();
    },

    pindai: function (R) {
      NQ.audio.efek('pindai-gelombang'); NQ.pingo.setMode('pindai');
      R.setelah(3, function () { NQ.pingo.setMode('melayang'); });
      R.bicara('pingo', b('k8.smkfree') ? 'Gelombang SMK-Free datang dari arah pintu belakang!' : 'Ada gelombang Wi-Fi asing di sini. Cek daftar perangkat dan Wi-Fi analyzer.');
      return true;
    }
  });

  // ================= Lorong Belakang =================
  var PINTU = { x: 556, y: 9, w: 64, h: 39 }, KEPING = { x: 330, y: 96 };
  var bipSisa = 0, pasang = null;

  function jarakGudang() { var dx = NQ.pemain.x() - (PINTU.x + 32), dy = NQ.pemain.y() - 60; return Math.sqrt(dx * dx + dy * dy); }
  function dbmFree() { return Math.round(-30 - 34 * Math.min(1, jarakGudang() / 560)); }

  function selesaikan(R) {
    if (NQ.progres.sudahSelesai(K)) return;
    NQ.jurnal.isi(K, 'Verifikasi', 'Analyzer: SMK-Free -30 dBm tepat di depan gudang; 4 keping dipasang dan gembok terbuka.');
    NQ.jurnal.isi(K, 'Catat', 'Penyebab: access point liar SMK-Free tanpa sandi di gudang dipakai 2 perangkat asing (MAC tidak terdaftar). Solusi berikutnya: cabut AP liar, blokir MAC asing, amankan Wi-Fi. Pencegahan: audit daftar perangkat rutin.');
    NQ.kasus.selesai(K, {
      inti: 'Perangkat yang tidak ada di inventaris harus dicurigai. Access point liar tanpa sandi menjadi pintu masuk penyusup ke jaringan sekolah.',
      berikut: 'klimaks', tugas: 'Masuk gudang dan hentikan Glitch',
      selesai: function () { masukGudang(R); }
    });
  }

  function masukGudang(R) {
    if (!NQ.progres.punyaAlat('senter')) { NQ.energi.salah(K, 'gudang-tanpa-senter'); return; }
    NQ.audio.efek('pintu-buka'); NQ.audio.efek('senter-nyala');
    NQ.scene.ke('klimaks', {});
  }

  function bukaGembok(R) {
    if (b('k8.gembok')) { masukGudang(R); return; }
    if (NQ.state.keping < 4) { R.dialog('keping-kurang', null, K); return; }
    R.sibuk = true;
    pasang = { mulai: performance.now() / 1000 };
    for (var i = 0; i < 4; i++) (function (k) { setTimeout(function () { NQ.audio.efek('gembok-keping'); }, 300 + k * 550); })(i);
    setTimeout(function () {
      NQ.audio.efek('gembok-buka');
      R.tandai('k8.gembok'); R.sibuk = false; pasang = null;
      R.dialog('gembok-terbuka', function () { selesaikan(R); }, K);
    }, 2700);
  }

  NQ.ruang.buat({
    id: 'lorong-belakang', ruangan: 'lorong-belakang', kasus: K, musik: 'misteri',

    siapkan: function (R) {
      bipSisa = 0; pasang = null;
      R.objek({ id: 'keping-4', x: KEPING.x, y: KEPING.y + 12, jarak: 18, kilauX: KEPING.x, kilauY: KEPING.y - 14,
        kotak: { x: KEPING.x - 10, y: KEPING.y - 12, w: 20, h: 18 },
        aktif: function () { return !b('k8.keping'); },
        aksi: function () {
          R.tandai('k8.keping'); NQ.state.keping = Math.max(NQ.state.keping, 4);
          NQ.audio.efek('ambil-barang'); NQ.hud.segarkan();
          R.dialog('ambil-keping', null, K);
        } });
      R.objek({ id: 'pintu-gudang', x: PINTU.x + 32, y: 62, jarak: 22, kilauX: PINTU.x + 32, kilauY: 4,
        kotak: { x: PINTU.x, y: PINTU.y, w: PINTU.w, h: PINTU.h + 4 }, aksi: function () { bukaGembok(R); } });
    },

    saatMasuk: function (R) {
      if (!b('k8.lorong') && !NQ.progres.sudahSelesai(K)) { R.tandai('k8.lorong'); R.dialog('dekati-lorong-belakang', null, K); }
    },

    perbarui: function (R, dt) {
      if (NQ.progres.sudahSelesai(K) || !b('k8.smkfree')) return;
      // bip panas-dingin: makin dekat gudang makin cepat
      bipSisa -= dt;
      if (bipSisa <= 0) { NQ.audio.efek('analyzer-bip'); bipSisa = 0.15 + 1.1 * Math.min(1, jarakGudang() / 560); }
      if (!NQ.jurnal.sudah(K, 'Perbaikan') && jarakGudang() < 70) {
        NQ.jurnal.isi(K, 'Perbaikan', 'Sinyal SMK-Free dilacak dengan Wi-Fi analyzer (panas-dingin) dari Lab Komputer 2 ke gudang tua.');
        NQ.progres.setTugas(NQ.state.keping >= 4 ? 'Pasang 4 keping di gembok pintu gudang' : 'Ambil keping ungu di jejak kaki, lalu buka gembok'); NQ.hud.segarkan();
      }
    },

    pakaiAlat: function (R, id) {
      if (id !== 'wifi-analyzer') return false;
      R.bicara('pingo', 'SMK-Free ' + dbmFree() + ' dBm. ' + (jarakGudang() < 120 ? 'Sangat kuat! Sumbernya di balik pintu ini.' : 'Makin ke kanan, makin kuat.'));
      return true;
    },

    // Panah: keping ungu di jejak kaki -> pintu gudang
    tujuan: function () {
      if (NQ.progres.sudahSelesai('klimaks')) return 'keluar';
      if (!b('k8.keping')) return 'keping-4';
      return 'pintu-gudang';
    },

    bolehKeluar: function () { return true; },
    saatKeluar: function (R) { NQ.scene.ke('kasus-8', { posisi: { x: 439, y: 74 }, arah: 'bawah' }); },

    sprite: function (R) {
      var d = [];
      // jejak kaki ungu menuju gudang
      for (var x = 80; x < 560; x += 44) (function (xx, i) {
        d.push({ dasar: 0, gambar: function (c, ox, oy) {
          c.save(); c.globalAlpha = 0.55 + Math.sin(performance.now() / 300 + i) * 0.25;
          NQ.aset.utuh(c, 'jejak-ungu', ox + xx, oy + 88 + (i % 2) * 8); c.restore();
        } });
      })(x, x / 44);
      d.push({ dasar: 49, gambar: function (c, ox, oy) {
        if (b('k8.gembok')) { NQ.aset.utuh(c, 'pintu-gudang-buka', ox + PINTU.x - 4, oy + PINTU.y + 8); return; }
        NQ.aset.utuh(c, 'pintu-gudang', ox + PINTU.x, oy + PINTU.y);
        var fr = Math.min(4, Math.max(0, NQ.state.keping - (pasang ? 0 : 0)));
        if (pasang) fr = Math.min(4, Math.floor((performance.now() / 1000 - pasang.mulai) / 0.55));
        else fr = 0;
        NQ.aset.frame(c, 'gembok', fr, 0, ox + PINTU.x + 24, oy + PINTU.y + 12);
      } });
      if (!b('k8.keping')) d.push({ dasar: KEPING.y, gambar: function (c, ox, oy) {
        var t = performance.now() / 1000;
        c.save(); c.globalAlpha = 0.6 + Math.sin(t * 4) * 0.3;
        c.fillStyle = 'rgba(197,107,255,0.4)'; c.beginPath(); c.arc(ox + KEPING.x, oy + KEPING.y, 7, 0, Math.PI * 2); c.fill(); c.restore();
        NQ.aset.utuh(c, 'kilau', ox + KEPING.x - 6, oy + KEPING.y - 6);
      } });
      return d;
    },

    gambarAtas: function (R, c) {
      var ox = NQ.kamera.x, oy = NQ.kamera.y;
      // lorong redup
      var g = c.createLinearGradient(ox, 0, ox + 640, 0);
      g.addColorStop(0, 'rgba(5,8,25,0.15)'); g.addColorStop(1, 'rgba(40,0,60,0.35)');
      c.fillStyle = g; c.fillRect(ox, oy, 640, 128);
      if (b('k8.smkfree') && !NQ.progres.sudahSelesai(K)) {
        var d = dbmFree();
        c.fillStyle = 'rgba(13,20,51,0.9)'; c.fillRect(8, 30, 92, 18);
        c.strokeStyle = '#c56bff'; c.lineWidth = 0.6; c.strokeRect(8.5, 30.5, 91, 17);
        c.fillStyle = '#e7b6ff'; c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'left'; c.textBaseline = 'top';
        c.fillText('SMK-Free  ' + d + ' dBm', 12, 33);
        var bar = Math.round((d + 64) / 34 * 5);
        for (var i = 0; i < 5; i++) { c.fillStyle = i < bar ? '#c56bff' : '#3a2a4a'; c.fillRect(12 + i * 6, 41, 4, 4); }
      }
    }
  });
})(window.NQ = window.NQ || {});
