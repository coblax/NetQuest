/*
 * Tas Teknisi (T): 8 slot alat. Alat yang belum dimiliki tampil sebagai siluet.
 * Panah/WASD memilih slot, E memakai alat, T atau Esc menutup.
 * Scene memasang NQ.tas.saatPakai = function (idAlat) { ... } untuk bereaksi.
 */
(function (NQ) {
  var panel, grid, info, slot = [], urutan, indeks = 0, aktif = false, sudahDaftar = false;

  function buat() {
    urutan = NQ.data.aset.sheet['ikon-alat'].urutan;
    panel = NQ.ui.el('div', 'panel tas tersembunyi');
    NQ.ui.el('h2', '', panel, 'TAS TEKNISI');
    grid = NQ.ui.el('div', 'grid', panel);
    urutan.forEach(function (id, i) {
      var s = NQ.ui.el('div', 'slot', grid);
      var im = NQ.ui.el('img', '', s);
      im.src = 'assets/img/ikon/alat/' + id + '.png';
      im.alt = NQ.data.alat[id].nama;
      s.addEventListener('click', function () {
        if (indeks === i && NQ.progres.punyaAlat(id)) pakai(); else pilih(i);
      });
      slot.push(s);
    });
    info = NQ.ui.el('div', 'info', panel);
    var kaki = NQ.ui.el('div', 'kaki', panel, 'Klik alat untuk memilih, klik lagi untuk memakai. Keyboard: Panah, E, T.');
    var tutup = NQ.ui.el('button', 'tombol kecil', kaki, 'Tutup');
    tutup.style.marginTop = '0.5em';
    tutup.addEventListener('click', function () { NQ.tas.tutup(); });
    if (!sudahDaftar) { NQ.ui.daftarModal(NQ.tas); sudahDaftar = true; }
  }

  function pilih(i) {
    indeks = (i + urutan.length) % urutan.length;
    slot.forEach(function (s, k) { s.classList.toggle('pilih', k === indeks); });
    var id = urutan[indeks], a = NQ.data.alat[id];
    if (NQ.progres.punyaAlat(id)) {
      info.innerHTML = '<b>' + NQ.ui.esc(a.nama) + '</b>' + NQ.ui.esc(a.info) +
        '<div class="kaki">Tekan E atau ketuk lagi untuk memakai.</div>';
    } else {
      info.innerHTML = '<b>???</b><span class="belum">Alat gelap terbuka nanti.</span>';
    }
  }

  function pakai() {
    var id = urutan[indeks];
    if (!NQ.progres.punyaAlat(id)) return;
    NQ.audio.efek('menu-pilih');
    NQ.state.alatAktif = id;
    var cb = NQ.tas.saatPakai;
    NQ.tas.tutup();
    if (cb) cb(id);
  }

  NQ.tas = {
    saatPakai: null,
    buka: function () {
      if (!panel) buat();
      urutan.forEach(function (id, i) { slot[i].classList.toggle('belum', !NQ.progres.punyaAlat(id)); });
      aktif = true;
      panel.classList.remove('tersembunyi');
      NQ.audio.efek('tas-dibuka');
      var awal = urutan.indexOf(NQ.state.alatAktif);
      pilih(awal >= 0 ? awal : 0);
      NQ.input.reset();
    },
    tutup: function () {
      aktif = false;
      if (panel) panel.classList.add('tersembunyi');
      NQ.input.reset();
      if (NQ.tas.saatTutup) NQ.tas.saatTutup();
    },
    aktif: function () { return aktif; },
    perbarui: function () {
      if (!aktif) return;
      var inp = NQ.input;
      if (inp.baruDitekan('kiri')) pilih(indeks - 1);
      if (inp.baruDitekan('kanan')) pilih(indeks + 1);
      if (inp.baruDitekan('atas')) pilih(indeks - 4);
      if (inp.baruDitekan('bawah')) pilih(indeks + 4);
      if (inp.baruDitekan('periksa')) pakai();
      else if (inp.baruDitekan('tas') || inp.baruDitekan('batal') || inp.ambilKlik()) this.tutup(); // klik di luar panel = tutup
    }
  };
})(window.NQ = window.NQ || {});
