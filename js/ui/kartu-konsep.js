/*
 * Kartu Konsep (data/konsep.js): ilustrasi berlabel, apa / kenapa / bukti dari Jurnal, dan satu soal cek paham.
 *   NQ.kartuKonsep.tampil(id, selesai)   tampil sekali saat bukti ditemukan; tombol Lanjut aktif setelah jawaban benar
 *   NQ.kartuKonsep.buka(id, { ulang })   membuka lagi dari Buku Konsep (tidak mengubah nilai)
 *   NQ.kartuKonsep.salah(kunci, selesai) kartu "Kenapa Salah?" setelah tindakan salah tertentu (sekali per tindakan)
 *   NQ.kartuKonsep.buku()                Buku Konsep: semua kartu yang sudah terbuka
 * Nilai disimpan di NQ.state.konsep[id] = { benarPertama, percobaan } untuk Laporan Teknisi guru.
 */
(function (NQ) {
  var panel = null, aktif = false, cfg = null, panelKe = 0, sudahDaftar = false;

  function daftarkan() {
    if (sudahDaftar) return;
    sudahDaftar = true;
    NQ.ui.daftarModal({ aktif: function () { return aktif; } });
  }
  function catatan() { return (NQ.state.konsep = NQ.state.konsep || {}); }
  function src(kunci) { return NQ.data.aset.gambar[kunci]; }
  function namaKasus(id) { var k = NQ.progres.infoTahap(id); return k ? k.judul.split(' - ')[0] : id; }
  function acak(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function siapkanPanel(kelas) {
    daftarkan();
    if (!panel) panel = NQ.ui.el('div', 'panel tersembunyi');
    panel.className = 'panel ' + kelas;
    panel.innerHTML = '';
    aktif = true;
    NQ.input.reset();
    return panel;
  }

  function tutup() {
    aktif = false;
    if (panel) panel.className = 'panel tersembunyi';
    NQ.input.reset();
    var c = cfg; cfg = null;
    if (c && c.selesai) c.selesai();
  }

  function ilustrasi(induk, p) {
    var box = NQ.ui.el('div', 'ilustrasi', induk);
    var img = NQ.ui.el('img', '', box); img.src = src(p.g); img.alt = p.ket || '';
    (p.label || []).forEach(function (l) {
      var s = NQ.ui.el('span', 'tag', box, NQ.ui.esc(l[2]));
      s.style.left = (l[0] * 100) + '%'; s.style.top = (l[1] * 100) + '%';
    });
    return box;
  }

  function teksBukti(k) {
    if (!k.bukti) return '';
    var j = NQ.state.jurnal[k.bukti.kasus] || {};
    return j[k.bukti.langkah] ? '<b>' + k.bukti.langkah + ':</b> ' + NQ.ui.esc(j[k.bukti.langkah]) : '';
  }

  function render() {
    var k = NQ.data.konsep[cfg.id], lap = NQ.data.lapisan[k.lapisan] || NQ.data.lapisan['Semua'];
    var p = siapkanPanel('kartu-konsep');
    NQ.ui.el('div', 'kepala', p,
      '<span class="label-kartu">KARTU KONSEP</span><h2>' + NQ.ui.esc(k.judul) + '</h2>' +
      '<span class="lapisan" style="border-color:' + lap.warna + ';color:' + lap.warna + '">Lapisan ' + k.lapisan + ' · ' + lap.ket + '</span>');
    var isi = NQ.ui.el('div', 'isi', p);
    var kiri = NQ.ui.el('div', 'kiri', isi);
    var pn = k.panel[panelKe];
    ilustrasi(kiri, pn);
    var nav = NQ.ui.el('div', 'nav', kiri);
    if (k.panel.length > 1) {
      var bk = NQ.ui.el('button', 'tombol kecil', nav, '&#9664;'); bk.disabled = panelKe === 0;
      NQ.ui.el('span', 'hal', nav, 'Gambar ' + (panelKe + 1) + ' dari ' + k.panel.length);
      var bl = NQ.ui.el('button', 'tombol kecil', nav, '&#9654;'); bl.disabled = panelKe === k.panel.length - 1;
      bk.addEventListener('click', function () { if (panelKe > 0) { panelKe--; NQ.audio.efek('menu-pilih'); render(); } });
      bl.addEventListener('click', function () { if (panelKe < k.panel.length - 1) { panelKe++; NQ.audio.efek('menu-pilih'); render(); } });
    }
    NQ.ui.el('div', 'ket', kiri, NQ.ui.esc(pn.ket || ''));
    var kanan = NQ.ui.el('div', 'kanan', isi);
    NQ.ui.el('div', 'blok', kanan, '<b>Apa yang terjadi?</b><p>' + NQ.ui.esc(k.apa) + '</p>');
    NQ.ui.el('div', 'blok', kanan, '<b>Kenapa?</b><p>' + NQ.ui.esc(k.kenapa) + '</p>');
    var bukti = teksBukti(k);
    if (bukti) NQ.ui.el('div', 'blok bukti', kanan, '<b>Buktinya di Jurnalmu</b><p>' + bukti + '</p>');

    // Cek paham
    var cek = NQ.ui.el('div', 'cek', p);
    NQ.ui.el('div', 'tanya', cek, '<b>CEK PAHAM</b> ' + NQ.ui.esc(k.soal.tanya));
    var pil = NQ.ui.el('div', 'pilihan', cek);
    var umpan = NQ.ui.el('div', 'umpan', cek);
    var kaki = NQ.ui.el('div', 'kaki-kartu', p);
    if (!cfg.ulang && !(catatan()[cfg.id] && catatan()[cfg.id].selesai)) NQ.ui.el('span', 'syarat', kaki, 'Jawab dengan benar untuk melanjutkan.');
    var lanjut = NQ.ui.el('button', 'tombol kecil utama', kaki, cfg.ulang ? 'Tutup' : 'Lanjut');
    lanjut.disabled = !cfg.benar && !cfg.ulang && !(catatan()[cfg.id] && catatan()[cfg.id].selesai);
    lanjut.addEventListener('click', function () { if (!lanjut.disabled && !NQ.kotakDialog.aktif()) { NQ.audio.efek('menu-pilih'); tutup(); } });
    cfg.tombolLanjut = lanjut;

    cfg.urutan = cfg.urutan || acak(k.soal.pilihan);
    cfg.urutan.forEach(function (o) {
      var dipilih = cfg.dicoba && cfg.dicoba.indexOf(o) >= 0;
      var b = NQ.ui.el('button', 'opsi' + (dipilih ? (o.benar ? ' benar' : ' keliru') : ''), pil, NQ.ui.esc(o.t));
      b.disabled = !!cfg.benar || (dipilih && !o.benar);
      b.addEventListener('click', function () { if (!b.disabled && !NQ.kotakDialog.aktif()) jawab(o); });
    });
    if (cfg.terakhir) {
      umpan.className = 'umpan ' + (cfg.terakhir.benar ? 'benar' : 'keliru');
      umpan.innerHTML = (cfg.terakhir.benar ? '&#10003; Tepat. ' : '&#10007; Belum tepat. ') + NQ.ui.esc(cfg.terakhir.alasan);
    }
  }

  function jawab(o) {
    cfg.dicoba = cfg.dicoba || [];
    cfg.dicoba.push(o);
    cfg.terakhir = o;
    if (!cfg.ulang) {
      var c = catatan(), r = c[cfg.id] || (c[cfg.id] = { percobaan: 0 });
      if (!r.selesai) {
        r.percobaan++;
        if (r.benarPertama === undefined) r.benarPertama = !!o.benar;
        if (o.benar) r.selesai = true;
        NQ.simpan.simpan();
      }
    }
    if (o.benar) { cfg.benar = true; NQ.audio.efek('langkah-jurnal'); }
    else NQ.audio.efek('salah');
    render();
  }

  NQ.kartuKonsep = {
    aktif: function () { return aktif; },

    tampil: function (id, selesai) {
      var r = catatan()[id];
      if (!NQ.data.konsep[id] || (r && r.selesai)) { if (selesai) selesai(); return; }
      this.buka(id, { selesai: selesai });
    },

    buka: function (id, opsi) {
      opsi = opsi || {};
      cfg = { id: id, ulang: !!opsi.ulang, selesai: opsi.selesai };
      NQ.ui.hapusFokus(panel);
      panelKe = 0;
      NQ.audio.efek('kertas');
      render();
    },

    salah: function (kunci, selesai) {
      var d = NQ.data.kenapaSalah[kunci];
      NQ.state.konsepSalah = NQ.state.konsepSalah || {};
      if (!d || NQ.state.konsepSalah[kunci]) { if (selesai) selesai(); return; }
      NQ.state.konsepSalah[kunci] = true; NQ.simpan.simpan();
      cfg = { selesai: selesai };
      NQ.ui.hapusFokus(panel);
      var p = siapkanPanel('kartu-salah');
      NQ.ui.el('div', 'kepala', p, '<span class="label-kartu salah">KENAPA SALAH?</span>');
      var isi = NQ.ui.el('div', 'isi', p);
      ilustrasi(NQ.ui.el('div', 'kiri', isi), { g: d.g });
      var kanan = NQ.ui.el('div', 'kanan', isi);
      NQ.ui.el('div', 'blok keliru', kanan, '<b>&#10007; Kenapa keliru</b><p>' + NQ.ui.esc(d.keliru) + '</p>');
      NQ.ui.el('div', 'blok benar', kanan, '<b>&#10003; Yang benar</b><p>' + NQ.ui.esc(d.benar) + '</p>');
      var kaki = NQ.ui.el('div', 'kaki-kartu', p);
      var b = NQ.ui.el('button', 'tombol kecil utama', kaki, 'Mengerti');
      b.addEventListener('click', function () { if (!NQ.kotakDialog.aktif()) { NQ.audio.efek('menu-pilih'); tutup(); } });
      cfg.tombolLanjut = b; NQ.audio.efek('kertas');
    },

    buku: function (selesai) {
      cfg = { selesai: selesai };
      NQ.ui.hapusFokus(panel);
      var p = siapkanPanel('buku-konsep');
      NQ.ui.el('h2', '', p, 'BUKU KONSEP');
      var c = catatan(), ids = Object.keys(NQ.data.konsep);
      var terbuka = ids.filter(function (id) { return c[id] && c[id].selesai; }).length;
      NQ.ui.el('div', 'sub', p, terbuka + ' dari ' + ids.length + ' konsep sudah terbuka. Klik kartu untuk membaca ulang.');
      var grid = NQ.ui.el('div', 'grid-konsep', p);
      ids.forEach(function (id) {
        var k = NQ.data.konsep[id], r = c[id], buka = r && r.selesai;
        var b = NQ.ui.el('button', 'item' + (buka ? '' : ' terkunci'), grid,
          (buka ? '<img src="' + src(k.panel[0].g) + '" alt="">' : '<span class="kunci">?</span>') +
          '<span class="nm">' + (buka ? NQ.ui.esc(k.judul) : 'Terbuka di ' + NQ.ui.esc(namaKasus(k.kasus))) + '</span>' +
          (buka ? '<span class="nilai">' + (r.benarPertama ? '&#10003; benar pertama kali' : 'benar setelah ' + r.percobaan + ' kali') + '</span>' : ''));
        b.disabled = !buka;
        b.addEventListener('click', function () {
          if (!buka) return;
          NQ.audio.efek('menu-pilih');
          var balik = cfg && cfg.selesai;
          aktif = false;
          NQ.kartuKonsep.buka(id, { ulang: true, selesai: function () { NQ.kartuKonsep.buku(balik); } });
        });
      });
      var kaki = NQ.ui.el('div', 'kaki-kartu', p);
      var t = NQ.ui.el('button', 'tombol kecil', kaki, 'Tutup');
      t.addEventListener('click', function () { NQ.audio.efek('menu-pilih'); tutup(); });
      cfg.tombolLanjut = t; NQ.audio.efek('kertas');
    },

    perbarui: function () {
      if (!panel) return;
      // panel disembunyikan sementara saat kotak dialog tampil
      panel.style.visibility = aktif && NQ.kotakDialog.aktif() ? 'hidden' : '';
      if (!aktif || NQ.kotakDialog.aktif() || !cfg) return;
      // Keyboard: atas/bawah memilih tombol (jawaban, Lanjut), E menekan. Kiri/kanan di kartu = ganti gambar.
      var kartuIsi = cfg.id !== undefined && NQ.data.konsep[cfg.id];
      if (NQ.ui.navTombol(panel, { horizontal: !kartuIsi })) return;
      if (kartuIsi) {
        var n = NQ.data.konsep[cfg.id].panel.length;
        if (NQ.input.baruDitekan('kiri') && panelKe > 0) { panelKe--; render(); }
        if (NQ.input.baruDitekan('kanan') && panelKe < n - 1) { panelKe++; render(); }
      }
      if ((NQ.input.baruDitekan('batal') || NQ.input.baruDitekan('periksa')) && cfg.tombolLanjut && !cfg.tombolLanjut.disabled) tutup();
      else if (NQ.input.baruDitekan('batal') && panel.classList.contains('buku-konsep')) tutup();
    }
  };
})(window.NQ = window.NQ || {});
