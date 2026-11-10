/*
 * Jurnal Teknisi (J): 6 kotak langkah per kasus (Gejala, Dugaan, Uji, Perbaikan, Verifikasi, Catat).
 * Kotak terisi otomatis lewat NQ.jurnal.isi(kasus, langkah, teks) saat siswa melakukan langkahnya.
 * Sebelum ada kasus aktif (Prolog), Jurnal menampilkan penjelasan keenam langkah.
 */
(function (NQ) {
  var panel, isiEl, aktif = false, sudahDaftar = false;

  var PENJELASAN = {
    Gejala: 'Apa yang dilaporkan dan apa yang terlihat?',
    Dugaan: 'Apa kemungkinan penyebabnya?',
    Uji: 'Buktikan dugaan dengan alat atau perintah.',
    Perbaikan: 'Lakukan perbaikan yang sudah terbukti perlu.',
    Verifikasi: 'Periksa lagi: apakah masalahnya sudah hilang?',
    Catat: 'Tulis penyebab dan solusinya untuk laporan.'
  };

  function buat() {
    panel = NQ.ui.el('div', 'panel jurnal tersembunyi');
    NQ.ui.el('h2', '', panel, 'JURNAL TEKNISI');
    isiEl = NQ.ui.el('div', '', panel);
    var kaki = NQ.ui.el('div', 'kaki kaki-jurnal', panel);
    NQ.ui.el('span', '', kaki, 'Klik di mana saja atau tekan J untuk menutup.');
    // Buku Konsep: membaca ulang Kartu Konsep yang sudah terbuka
    var bb = NQ.ui.el('button', 'tombol kecil buku', kaki, 'Buku Konsep (B)');
    bb.addEventListener('click', function (e) {
      e.stopPropagation();
      NQ.audio.efek('menu-pilih');
      NQ.jurnal.tutup();
      NQ.kartuKonsep.buku();
    });
    panel.addEventListener('click', function () { NQ.jurnal.tutup(); });
    if (!sudahDaftar) { NQ.ui.daftarModal(NQ.jurnal); sudahDaftar = true; }
  }

  function render() {
    var tahap = NQ.state.tahap;
    var info = NQ.progres.infoTahap(tahap);
    var kasusAktif = info && info.babak >= 1 && info.babak <= 4;
    var catatan = NQ.state.jurnal[tahap] || {};
    var h = '';
    if (kasusAktif) h += '<div class="kasus">' + NQ.ui.esc(info.judul) + ': ' + NQ.ui.esc(info.tugas) + '</div>';
    else h += '<div class="kasus">Belum ada kasus aktif. Di setiap kasus kamu akan mengisi 6 langkah ini:</div>';
    NQ.data.langkahJurnal.forEach(function (l) {
      var isi = kasusAktif ? catatan[l] : null;
      h += '<div class="langkah' + (isi ? ' isi' : '') + '"><div class="kotak">' + (isi ? '&#10003;' : '') + '</div>' +
           '<img class="ikon-langkah" src="' + NQ.data.aset.gambar['langkah-' + l.toLowerCase()] + '" alt="">' +
           '<div><b>' + l + '</b><br><span class="ket">' + NQ.ui.esc(isi || (kasusAktif ? '...' : PENJELASAN[l])) + '</span></div></div>';
    });
    isiEl.innerHTML = h;
  }

  NQ.jurnal = {
    buka: function () {
      if (!panel) buat();
      render();
      aktif = true;
      panel.classList.remove('tersembunyi');
      NQ.audio.efek('kertas');
      NQ.input.reset();
    },
    tutup: function () {
      aktif = false;
      if (panel) panel.classList.add('tersembunyi');
      NQ.input.reset();
      if (NQ.jurnal.saatTutup) NQ.jurnal.saatTutup();
    },
    aktif: function () { return aktif; },
    isi: function (kasus, langkah, teks) {
      NQ.state.jurnal[kasus] = NQ.state.jurnal[kasus] || {};
      var baru = !NQ.state.jurnal[kasus][langkah];
      NQ.state.jurnal[kasus][langkah] = teks;
      NQ.simpan.simpan();
      if (baru) {
        NQ.audio.efek('langkah-jurnal');
        NQ.ui.toast('&#10003; Jurnal: <b>' + langkah + '</b> tercatat');
      }
    },
    sudah: function (kasus, langkah) { return !!(NQ.state.jurnal[kasus] && NQ.state.jurnal[kasus][langkah]); },
    perbarui: function () {
      if (!aktif) return;
      if (NQ.input.baruDitekan('buku')) { this.tutup(); NQ.kartuKonsep.buku(); return; }
      if (NQ.input.baruDitekan('jurnal') || NQ.input.baruDitekan('batal') || NQ.input.baruDitekan('periksa') || NQ.input.ambilKlik()) this.tutup();
    }
  };
})(window.NQ = window.NQ || {});
