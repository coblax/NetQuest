/*
 * Epilog: Laporan Teknisi dari Jurnal, pilihan rekomendasi, sertifikat, Cetak atau Simpan PDF (window.print).
 *
 * NQ.minigame.laporan.buka({ mode, lanjut(), mainLagi() })
 *   mode 'tinjau'      : tabel hasil 8 kasus + klimaks, tombol Lanjut
 *   mode 'rekomendasi' : pilih minimal 3 rekomendasi yang tepat (tidak boleh ada yang keliru)
 *   mode 'akhir'       : sertifikat + laporan + rekomendasi, tombol Cetak/PDF, Main Lagi, Tutup
 * NQ.minigame.laporan.sertifikat({ lanjut() })
 * NQ.minigame.laporan.cetak()
 */
(function (NQ) {
  NQ.minigame = NQ.minigame || {};

  var KASUS = ['kasus-1', 'kasus-2', 'kasus-3', 'kasus-4', 'kasus-5', 'kasus-6', 'kasus-7', 'kasus-8', 'klimaks'];
  var REKOM = [
    { t: 'Ganti sandi Wi-Fi secara berkala dan pakai WPA2/WPA3 dengan sandi kuat.', benar: true },
    { t: 'Bagikan sandi Wi-Fi ke semua tamu supaya tidak ada yang mengeluh.', benar: false },
    { t: 'Audit daftar perangkat terhubung tiap bulan dan cocokkan MAC dengan inventaris.', benar: true },
    { t: 'Matikan layanan DHCP selamanya agar tidak ada IP bentrok.', benar: false },
    { t: 'Lindungi kabel jaringan dengan pelindung dan cegah tikus masuk ruangan.', benar: true },
    { t: 'Larang pemasangan router atau access point tanpa izin teknisi sekolah.', benar: true },
    { t: 'Cukup sembunyikan nama Wi-Fi (SSID) tanpa mengganti sandi.', benar: false },
    { t: 'Beri printer dan server IP statis di luar rentang DHCP, lalu catat.', benar: true }
  ];

  var panel, aktif = false, cfg = null, pilihan = [], sudahDaftar = false;

  function cat() { return (NQ.state.catatan = NQ.state.catatan || {}); }
  function info(id) { return NQ.progres.infoTahap(id); }
  function namaLokasi(id) {
    if (id === 'klimaks') return 'Gudang (Glitch)';
    var k = info(id); return k && NQ.data.ruangan[k.ruangan] ? NQ.data.ruangan[k.ruangan].nama : id;
  }
  function totalBintang() { return KASUS.reduce(function (n, k) { return n + (NQ.state.bintang[k] || 0); }, 0); }
  function bintangSertifikat() { var r = totalBintang() / (KASUS.length * 3); return r >= 0.85 ? 3 : (r >= 0.6 ? 2 : 1); }
  function gbrBintang(n, kelas) {
    var h = '';
    for (var i = 0; i < 3; i++) h += '<img class="' + (kelas || 'bt') + '" src="assets/img/ui/' + (i < n ? 'bintang-emas' : 'bintang-abu') + '.png" alt="' + (i < n ? '*' : '-') + '">';
    return h;
  }
  function tanggal() {
    var b = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var d = new Date(); return d.getDate() + ' ' + b[d.getMonth()] + ' ' + d.getFullYear();
  }
  function rekomTerpilih() { return (cat().rekomendasi || []).map(function (i) { return REKOM[i].t; }); }

  function htmlTabel() {
    var h = '<table class="tabel-laporan"><tr><th>No.</th><th>Lokasi / Kasus</th><th>Hasil</th></tr>';
    KASUS.forEach(function (k, i) {
      h += '<tr><td>' + (i + 1) + '.</td><td>' + NQ.ui.esc(namaLokasi(k)) + '</td><td class="hasil">' + gbrBintang(NQ.state.bintang[k] || 0) + '</td></tr>';
    });
    return h + '</table><div class="total">Total: <b>' + totalBintang() + '</b> dari ' + (KASUS.length * 3) + ' bintang</div>';
  }

  function htmlSertifikat() {
    var s = NQ.state;
    return '<div class="sertifikat"><img class="latar" src="assets/img/ui/sertifikat.png" alt="">' +
      '<div class="pita">SERTIFIKAT</div>' +
      '<div class="isi"><div class="gelar">Teknisi Jaringan Muda</div><div class="kecil">diberikan kepada</div>' +
      '<div class="nama">' + NQ.ui.esc(s.nama || 'Siswa SMK Cendekia') + '</div>' +
      '<div class="kelas">' + NQ.ui.esc(s.kelas || '') + ' &middot; ' + totalBintang() + ' bintang</div>' +
      '<div class="bintang">' + gbrBintang(bintangSertifikat(), 'bs') + '</div>' +
      '<div class="tanggal">SMK Cendekia, ' + tanggal() + '</div></div></div>';
  }

  function kepala(p) {
    NQ.ui.el('div', 'kepala-laporan', p, '<img src="assets/img/ui/papan-klip.png" alt=""><div><h2>LAPORAN TEKNISI</h2><div class="sub">disusun dari Jurnal Praktik</div></div>');
  }

  function tombolBaris(p, daftar) {
    var bar = NQ.ui.el('div', 'tombol-bawah', p);
    daftar.forEach(function (d) {
      var b = NQ.ui.el('button', 'tombol kecil' + (d.kelas ? ' ' + d.kelas : ''), bar, d.label);
      b.addEventListener('click', function () { if (!NQ.kotakDialog.aktif()) { NQ.audio.efek('menu-pilih'); d.aksi(); } });
    });
  }

  function render() {
    var mode = cfg.mode;
    panel.className = 'panel laporan mode-' + mode;
    panel.innerHTML = '';
    if (mode === 'akhir') {
      var wadah = NQ.ui.el('div', 'dua', panel);
      NQ.ui.el('div', 'kiri', wadah, htmlSertifikat() + '<div class="spanduk">Jaringan Siap untuk Lomba!</div>');
      var kanan = NQ.ui.el('div', 'kanan', wadah);
      kepala(kanan);
      NQ.ui.el('div', '', kanan, htmlTabel());
      var r = rekomTerpilih();
      NQ.ui.el('div', 'rekom-akhir', kanan, '<b>Rekomendasi:</b>' + r.map(function (t) { return '<div>&#10003; ' + NQ.ui.esc(t) + '</div>'; }).join(''));
      tombolBaris(kanan, [
        { label: 'Cetak / PDF', kelas: 'utama', aksi: function () { NQ.minigame.laporan.cetak(); } },
        { label: 'Main Lagi', aksi: function () { tutup(); if (cfg.mainLagi) cfg.mainLagi(); } },
        { label: 'Tutup', aksi: function () { tutup(); if (cfg.lanjut) cfg.lanjut(); } }
      ]);
      return;
    }
    kepala(panel);
    if (mode === 'tinjau') {
      NQ.ui.el('div', '', panel, htmlTabel());
      tombolBaris(panel, [{ label: 'Lanjut', aksi: function () { tutup(); if (cfg.lanjut) cfg.lanjut(); } }]);
      return;
    }
    // rekomendasi
    NQ.ui.el('div', 'petunjuk-rekom', panel, 'Pilih rekomendasi agar kejadian ini tidak terulang (minimal 3):');
    var daftar = NQ.ui.el('div', 'daftar-rekom', panel);
    REKOM.forEach(function (r, i) {
      var b = NQ.ui.el('button', 'rekom' + (pilihan.indexOf(i) >= 0 ? ' dipilih' : ''), daftar,
        '<span class="kotak">' + (pilihan.indexOf(i) >= 0 ? '&#10003;' : '') + '</span>' + NQ.ui.esc(r.t));
      b.addEventListener('click', function () {
        if (NQ.kotakDialog.aktif()) return;
        var j = pilihan.indexOf(i);
        if (j >= 0) pilihan.splice(j, 1); else pilihan.push(i);
        NQ.audio.efek('menu-pilih'); render();
      });
    });
    tombolBaris(panel, [{ label: 'Simpan rekomendasi', kelas: 'utama', aksi: simpanRekom }]);
  }

  function simpanRekom() {
    var keliru = pilihan.filter(function (i) { return !REKOM[i].benar; });
    if (keliru.length) {
      NQ.audio.efek('salah');
      NQ.dialog.jalankan('epilog', 'rekomendasi-salah');
      return;
    }
    if (pilihan.length < 3) { NQ.dialog.jalankan('epilog', 'rekomendasi-kurang'); return; }
    cat().rekomendasi = pilihan.slice().sort(function (a, b) { return a - b; });
    NQ.simpan.simpan();
    NQ.audio.efek('langkah-jurnal');
    tutup();
    if (cfg.lanjut) cfg.lanjut();
  }

  function tutup() { aktif = false; if (panel) panel.classList.add('tersembunyi'); NQ.input.reset(); }

  function daftarkan() {
    if (sudahDaftar) return;
    sudahDaftar = true;
    NQ.ui.daftarModal({ aktif: function () { return aktif; } });
  }

  // ---------- Halaman cetak ----------
  function htmlCetak() {
    var s = NQ.state;
    var h = '<div class="halaman-cetak sert">' + htmlSertifikat() + '</div>';
    h += '<div class="halaman-cetak lap"><h1>Laporan Teknisi Jaringan</h1><div class="sub">NetQuest: Misteri Jaringan SMK Cendekia &middot; disusun dari Jurnal Praktik</div>' +
      '<table class="identitas"><tr><td>Nama</td><td>' + NQ.ui.esc(s.nama || '-') + '</td></tr><tr><td>Kelas</td><td>' + NQ.ui.esc(s.kelas || '-') + '</td></tr>' +
      '<tr><td>Tanggal</td><td>' + tanggal() + '</td></tr><tr><td>Total bintang</td><td>' + totalBintang() + ' dari ' + (KASUS.length * 3) + '</td></tr></table>' +
      '<table class="isi"><tr><th>No</th><th>Lokasi</th><th>Laporan awal</th><th>Penyebab dan solusi (Catat)</th><th>Bintang</th><th>Petunjuk / Salah</th></tr>';
    KASUS.forEach(function (k, i) {
      var inf = info(k) || {}, j = s.jurnal[k] || {}, n = s.bintang[k] || 0;
      h += '<tr><td>' + (i + 1) + '</td><td>' + NQ.ui.esc(namaLokasi(k)) + '</td><td>' + NQ.ui.esc(inf.tugas || '') + '</td><td>' + NQ.ui.esc(j.Catat || '-') +
        '</td><td class="bt">' + '&#9733;&#9733;&#9733;'.slice(0, n * 7) + '<span class="mati">' + '&#9733;&#9733;&#9733;'.slice(0, (3 - n) * 7) + '</span></td><td>' + (s.petunjuk[k] || 0) + ' / ' + (s.salah[k] || 0) + '</td></tr>';
    });
    // Pemahaman konsep: jawaban cek paham pada Kartu Konsep (untuk guru)
    var kc = s.konsep || {}, ids = Object.keys(NQ.data.konsep || {}), benar1 = 0;
    var bk = '<h2>Pemahaman Konsep (Cek Paham)</h2><table class="isi"><tr><th>No</th><th>Konsep</th><th>Kasus</th><th>Hasil</th></tr>';
    ids.forEach(function (id, i) {
      var k = NQ.data.konsep[id], r = kc[id], hasil;
      if (!r || !r.selesai) hasil = 'belum dijawab';
      else if (r.benarPertama) { hasil = 'benar pada percobaan pertama'; benar1++; }
      else hasil = 'benar setelah ' + r.percobaan + ' kali mencoba';
      bk += '<tr><td>' + (i + 1) + '</td><td>' + NQ.ui.esc(k.judul) + '</td><td>' + NQ.ui.esc(k.kasus === 'prolog' ? 'Prolog' : namaLokasi(k.kasus)) + '</td><td>' + hasil + '</td></tr>';
    });
    bk += '</table><div class="sub">Benar pada percobaan pertama: ' + benar1 + ' dari ' + ids.length + ' konsep.</div>';
    h += '</table>' + bk + '<h2>Rekomendasi</h2><ul>' + rekomTerpilih().map(function (t) { return '<li>' + NQ.ui.esc(t) + '</li>'; }).join('') + '</ul>' +
      '<div class="ttd"><div>Mengetahui,<br>Kepala Lab TKJ<div class="cap">LAB TKJ<br>SMK CENDEKIA</div>(Pak Bima)</div><div>Teknisi,<br><br><br><br><br>(' + NQ.ui.esc(s.nama || '..............') + ')</div></div></div>';
    return h;
  }

  NQ.minigame.laporan = {
    buka: function (opsi) {
      daftarkan();
      if (!panel) panel = NQ.ui.el('div', 'panel laporan tersembunyi');
      cfg = opsi || { mode: 'tinjau' };
      if (cfg.mode === 'rekomendasi') pilihan = (cat().rekomendasi || []).slice();
      render();
      aktif = true; panel.classList.remove('tersembunyi');
      NQ.audio.efek('kertas');
      NQ.input.reset();
    },
    tutup: tutup,
    aktif: function () { return aktif; },
    totalBintang: totalBintang,

    sertifikat: function (opsi) {
      daftarkan();
      if (!panel) panel = NQ.ui.el('div', 'panel laporan tersembunyi');
      cfg = { mode: 'sertifikat', lanjut: opsi && opsi.lanjut };
      panel.className = 'panel laporan mode-sertifikat';
      panel.innerHTML = htmlSertifikat();
      tombolBaris(panel, [{ label: 'Terima sertifikat', kelas: 'utama', aksi: function () { tutup(); if (cfg.lanjut) cfg.lanjut(); } }]);
      aktif = true; panel.classList.remove('tersembunyi');
      NQ.audio.efek('sertifikat');
      NQ.input.reset();
    },

    cetak: function () {
      var el = document.getElementById('cetak');
      if (!el) { el = document.createElement('div'); el.id = 'cetak'; document.body.appendChild(el); }
      el.innerHTML = htmlCetak();
      // beri waktu gambar sertifikat dimuat sebelum dialog cetak muncul
      setTimeout(function () { window.print(); }, 300);
    },

    perbarui: function () {
      if (panel) panel.style.visibility = aktif && NQ.kotakDialog.aktif() ? 'hidden' : '';
      if (aktif && NQ.ui.navTombol(panel)) return;
      if (aktif && !NQ.kotakDialog.aktif() && NQ.input.baruDitekan('periksa') && cfg && (cfg.mode === 'tinjau' || cfg.mode === 'sertifikat')) {
        tutup(); if (cfg.lanjut) cfg.lanjut();
      }
    }
  };
})(window.NQ = window.NQ || {});
