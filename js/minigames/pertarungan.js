/*
 * Klimaks: menu aksi keamanan dan perakit sandi kuat.
 * Bar Kekuatan Glitch dan animasi Glitch digambar oleh scene klimaks di canvas.
 *
 * NQ.minigame.pertarungan.buka({ daftar() -> [{ id, label, selesai }], pilih(id) })
 *   Panel menutup sendiri setelah aksi dipilih; scene membukanya lagi setelah dialog selesai.
 * NQ.minigame.pertarungan.sandi({ aturan, saatPasang(sandi, mode, hasil), saatBatal() })
 *   hasil = { panjang, huruf, angka, simbol, aman, kuat }
 */
(function (NQ) {
  NQ.minigame = NQ.minigame || {};

  var KEPING = [
    { judul: 'Kata acak', isi: ['Kucing', 'Pelangi', 'Lompat', 'Mangga', 'Roket', 'Hujan', 'Gitar', 'Biru'] },
    { judul: 'Angka', isi: ['7', '19', '42', '2026', '8'] },
    { judul: 'Simbol', isi: ['!', '#', '@', '*', '-', '_', '?'] },
    { judul: 'Mudah ditebak', isi: ['12345678', 'password', 'admin', 'smkcendekia'], umum: true }
  ];

  var panel, cfg = null, aktif = false, tombol = [], indeks = 0;
  var sp, sEl = {}, sCfg = null, sAktif = false, mode = 'WPA3-SAE';
  var sudahDaftar = false;

  function daftarkan() {
    if (sudahDaftar) return;
    sudahDaftar = true;
    NQ.ui.daftarModal({ aktif: function () { return aktif || sAktif; } });
  }

  // ---------- Menu aksi ----------
  function render() {
    panel.innerHTML = '';
    NQ.ui.el('h2', '', panel, 'MENU AKSI KEAMANAN');
    var isi = NQ.ui.el('div', 'daftar-aksi', panel);
    tombol = [];
    cfg.daftar().forEach(function (a) {
      var b = NQ.ui.el('button', 'tombol aksi' + (a.selesai ? ' selesai' : ''), isi,
        '<span class="cek">' + (a.selesai ? '&#10003;' : '') + '</span>' + NQ.ui.esc(a.label));
      b.disabled = !!a.selesai;
      b.addEventListener('click', function () {
        if (b.disabled || NQ.kotakDialog.aktif()) return;
        NQ.audio.efek('menu-pilih');
        NQ.minigame.pertarungan.tutup();
        cfg.pilih(a.id);
      });
      if (!a.selesai) tombol.push(b);
    });
    NQ.ui.el('div', 'kaki', panel, 'Pilih langkah keamanan yang tepat, satu per satu. Esc: menjauh dulu.');
    pilih(Math.min(indeks, tombol.length - 1));
  }

  function pilih(i) {
    if (!tombol.length) return;
    indeks = (i + tombol.length) % tombol.length;
    tombol.forEach(function (t, k) { t.classList.toggle('pilih', k === indeks); });
  }

  // ---------- Perakit sandi ----------
  function periksa(s, aturan) {
    aturan = aturan || { panjangMin: 12, dilarang: [] };
    var kecil = s.toLowerCase();
    var h = {
      panjang: s.length >= aturan.panjangMin,
      huruf: /[a-z]/i.test(s),
      angka: /[0-9]/.test(s),
      simbol: /[^a-z0-9]/i.test(s),
      aman: s.length > 0 && !(aturan.dilarang || []).some(function (d) { return kecil.indexOf(d) >= 0; })
    };
    h.kuat = h.panjang && h.huruf && h.angka && h.simbol && h.aman;
    return h;
  }

  function buatSandi() {
    sp = NQ.ui.el('div', 'panel perakit-sandi tersembunyi');
    NQ.ui.el('h2', '', sp, 'AMANKAN WI-FI SEKOLAH');
    var m = NQ.ui.el('div', 'baris-mode', sp, '<span class="lbl">Keamanan:</span>');
    sEl.mode = ['WPA2-PSK', 'WPA3-SAE'].map(function (nm) {
      var b = NQ.ui.el('button', 'tombol kecil mode', m, nm);
      b.addEventListener('click', function () { mode = nm; NQ.audio.efek('menu-pilih'); segarkanSandi(); });
      return b;
    });
    NQ.ui.el('span', 'catatan-mode', m, 'WPA3 lebih baru; WPA2 dipakai bila perangkat lama belum mendukung WPA3.');
    var kotak = NQ.ui.el('div', 'kotak-sandi', sp);
    sEl.input = NQ.ui.el('input', 'input-sandi', kotak);
    sEl.input.maxLength = 40; sEl.input.autocomplete = 'off'; sEl.input.spellcheck = false;
    sEl.input.placeholder = 'Klik kepingan di bawah atau ketik sendiri';
    sEl.input.addEventListener('input', segarkanSandi);
    sEl.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); pasang(); }
      if (e.key === 'Escape') { e.preventDefault(); batal(); }
    });
    sEl.panjang = NQ.ui.el('span', 'panjang', kotak);
    var kep = NQ.ui.el('div', 'kepingan', sp);
    KEPING.forEach(function (g) {
      var baris = NQ.ui.el('div', 'grup' + (g.umum ? ' umum' : ''), kep, '<span class="lbl">' + g.judul + '</span>');
      g.isi.forEach(function (t) {
        var b = NQ.ui.el('button', 'keping', baris, NQ.ui.esc(t));
        b.addEventListener('click', function () {
          if (sEl.input.value.length + t.length > 40) return;
          sEl.input.value += t; NQ.audio.efek('sandi-rakit'); segarkanSandi();
        });
      });
    });
    sEl.syarat = NQ.ui.el('div', 'syarat', sp);
    sEl.meter = NQ.ui.el('div', 'meter-sandi', sp);
    var bawah = NQ.ui.el('div', 'tombol-bawah', sp);
    [['Hapus 1', function () { sEl.input.value = sEl.input.value.slice(0, -1); segarkanSandi(); }],
     ['Kosongkan', function () { sEl.input.value = ''; segarkanSandi(); }],
     ['Pasang sandi', pasang],
     ['Batal', batal]].forEach(function (d) {
      var b = NQ.ui.el('button', 'tombol kecil', bawah, d[0]);
      b.addEventListener('click', function () { if (!NQ.kotakDialog.aktif()) d[1](); });
      if (d[0] === 'Pasang sandi') sEl.pasang = b;
    });
  }

  // Perkiraan kasar waktu menebak sandi oleh program penebak (10 miliar tebakan per detik).
  // Mengandung kata umum = langsung ditemukan dari daftar kata. Hasil: { teks, log10 detik }
  function waktuTebak(s, aturan) {
    if (!s) return null;
    var kecil = s.toLowerCase();
    if ((aturan && aturan.dilarang || []).some(function (d) { return kecil.indexOf(d) >= 0; })) return { teks: 'kurang dari 1 detik (kata umum ada di daftar tebakan)', lg: -1 };
    var n = (/[a-z]/.test(s) ? 26 : 0) + (/[A-Z]/.test(s) ? 26 : 0) + (/[0-9]/.test(s) ? 10 : 0) + (/[^a-z0-9]/i.test(s) ? 33 : 0);
    var lg = s.length * Math.log(n) / Math.LN10 - Math.log(2) / Math.LN10 - 10;
    var dtk = Math.pow(10, lg), teks;
    if (lg < 0) teks = 'kurang dari 1 detik';
    else if (dtk < 60) teks = Math.round(dtk) + ' detik';
    else if (dtk < 3600) teks = Math.round(dtk / 60) + ' menit';
    else if (dtk < 86400) teks = Math.round(dtk / 3600) + ' jam';
    else if (dtk < 31536000) teks = Math.round(dtk / 86400) + ' hari';
    else if (dtk < 31536000 * 1e6) teks = Math.round(dtk / 31536000).toLocaleString('id-ID') + ' tahun';
    else teks = 'lebih dari 1 juta tahun';
    return { teks: teks, lg: lg };
  }

  function segarkanSandi() {
    var s = sEl.input.value, h = periksa(s, sCfg && sCfg.aturan), min = (sCfg && sCfg.aturan && sCfg.aturan.panjangMin) || 12;
    sEl.mode.forEach(function (b) { b.classList.toggle('pilih', b.textContent === mode); });
    sEl.panjang.textContent = s.length + ' karakter';
    sEl.panjang.className = 'panjang' + (s.length >= min ? ' ok' : '');
    function baris(ok, t) { return '<span class="' + (ok ? 'ok' : 'belum') + '">' + (ok ? '&#10003; ' : '&#10007; ') + t + '</span>'; }
    var w = waktuTebak(s, sCfg && sCfg.aturan);
    if (!w) sEl.meter.innerHTML = '<span class="lbl">Perkiraan waktu menebak sandi:</span> <i>rakit sandi dulu</i>';
    else {
      var pct = Math.max(4, Math.min(100, (w.lg + 1) / 15 * 100));
      var warna = w.lg < 4.9 ? 'var(--merah)' : (w.lg < 9.5 ? 'var(--aksen)' : 'var(--hijau)');
      sEl.meter.innerHTML = '<span class="lbl">Perkiraan waktu menebak sandi:</span> <b style="color:' + warna + '">' + w.teks + '</b>' +
        '<div class="bar"><i style="width:' + pct + '%;background:' + warna + '"></i></div>' +
        '<div class="cat">Setiap karakter tambahan melipatgandakan jumlah tebakan. Campuran huruf, angka, dan simbol memperbanyak kemungkinan per karakter.</div>';
    }
    sEl.syarat.innerHTML = baris(h.panjang, 'Minimal ' + min + ' karakter') + baris(h.huruf, 'Ada huruf') + baris(h.angka, 'Ada angka') +
      baris(h.simbol, 'Ada simbol') + baris(h.aman, 'Bukan kata yang mudah ditebak');
  }

  function pasang() {
    var s = sEl.input.value;
    if (!s) { sEl.input.focus(); return; }
    var h = periksa(s, sCfg.aturan), cb = sCfg.saatPasang;
    tutupSandi();
    cb(s, mode, h);
  }
  function batal() { var cb = sCfg && sCfg.saatBatal; tutupSandi(); if (cb) cb(); }
  function tutupSandi() { sAktif = false; if (sp) sp.classList.add('tersembunyi'); NQ.input.reset(); }

  NQ.minigame.pertarungan = {
    buka: function (opsi) {
      daftarkan();
      if (!panel) panel = NQ.ui.el('div', 'panel menu-aksi tersembunyi');
      cfg = opsi; indeks = 0;
      render();
      aktif = true; panel.classList.remove('tersembunyi');
      NQ.input.reset();
    },
    tutup: function () { aktif = false; if (panel) panel.classList.add('tersembunyi'); NQ.input.reset(); },
    aktif: function () { return aktif || sAktif; },
    periksaSandi: periksa,

    sandi: function (opsi) {
      daftarkan();
      if (!sp) buatSandi();
      sCfg = opsi; mode = 'WPA3-SAE';
      sEl.input.value = '';
      segarkanSandi();
      sAktif = true; sp.classList.remove('tersembunyi');
      NQ.input.reset();
      setTimeout(function () { if (sAktif && !NQ.kotakDialog.aktif()) sEl.input.focus(); }, 60);
    },

    perbarui: function () {
      var dialog = NQ.kotakDialog.aktif();
      // Panel disembunyikan sementara saat dialog tampil supaya kotak dialog terbaca
      if (panel) panel.style.visibility = aktif && dialog ? 'hidden' : '';
      if (sp) sp.style.visibility = sAktif && dialog ? 'hidden' : '';
      if (dialog) return;
      if (aktif) {
        if (NQ.input.baruDitekan('atas')) pilih(indeks - 1);
        if (NQ.input.baruDitekan('bawah')) pilih(indeks + 1);
        if (NQ.input.baruDitekan('periksa') && tombol[indeks]) tombol[indeks].click();
        if (NQ.input.baruDitekan('batal')) this.tutup();
      } else if (sAktif && NQ.input.baruDitekan('batal')) batal();
    }
  };
})(window.NQ = window.NQ || {});
