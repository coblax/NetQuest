/*
 * Menu judul (Mulai Petualangan, Lanjutkan, Panduan, Pengaturan), kartu teknisi (nama dan kelas),
 * halaman Panduan dan Info, halaman Pengaturan, dan kotak pesan umum.
 * Navigasi: panah atas/bawah atau W/S, lalu E/Enter. Esc untuk kembali. Bisa juga diklik/ketuk.
 */
(function (NQ) {
  var halaman = null;      // elemen panel yang sedang tampil
  var tombol = [];         // tombol yang bisa dipilih dengan keyboard
  var indeks = 0;
  var kembali = null;      // fungsi saat Esc ditekan

  function bersihkan() {
    if (halaman) halaman.parentNode.removeChild(halaman);
    halaman = null; tombol = []; indeks = 0; kembali = null;
    NQ.input.reset();
  }

  function pilih(i) {
    if (!tombol.length) return;
    indeks = (i + tombol.length) % tombol.length;
    tombol.forEach(function (t, k) { t.classList.toggle('pilih', k === indeks); });
  }

  function tambahTombol(induk, label, aksi, nonaktif) {
    var b = NQ.ui.el('button', 'tombol', induk, label);
    b.disabled = !!nonaktif;
    b.addEventListener('click', function () { if (!b.disabled) { NQ.audio.efek('menu-pilih'); aksi(); } });
    if (!nonaktif) tombol.push(b);
    return b;
  }

  function panel(kelas, judul) {
    bersihkan();
    halaman = NQ.ui.el('div', 'panel ' + kelas);
    if (judul) NQ.ui.el('h2', '', halaman, judul);
    return halaman;
  }

  NQ.menu = {
    aktif: function () { return !!halaman; },

    bukaJudul: function () {
      var p = panel('menu-judul');
      var adaSimpan = NQ.simpan.ada();
      tambahTombol(p, 'Mulai Petualangan', function () { NQ.menu.kartu(); });
      tambahTombol(p, 'Lanjutkan', function () {
        if (NQ.progres.lanjutkan()) { bersihkan(); var tj = NQ.progres.tujuanLanjut(); NQ.scene.ke(tj.scene, tj.data); }
      }, !adaSimpan);
      tambahTombol(p, 'Panduan', function () { NQ.menu.panduan(); });
      tambahTombol(p, 'Pengaturan', function () { NQ.menu.pengaturan(); });
      pilih(0);
    },

    kartu: function () {
      var p = panel('kartu', 'KARTU TEKNISI');
      p.dataset.modal = '1';
      var sambut = NQ.data.dialog.prolog.filter(function (b) { return b.pemicu === 'mulai'; })[0];
      NQ.ui.el('p', '', p, NQ.ui.esc(sambut ? sambut.teks : 'Tulis nama dan kelasmu.'));
      // Kartu identitas (aset P6): foto Raka di kiri, isian nama dan kelas di dua baris kanan
      var kartu = NQ.ui.el('div', 'idcard', p);
      var foto = NQ.ui.el('img', 'foto', kartu); foto.src = NQ.data.aset.gambar['raka-potret']; foto.alt = '';
      var nama = NQ.ui.el('input', 'nama', kartu); nama.maxLength = 24; nama.autocomplete = 'off'; nama.placeholder = 'Nama siswa';
      var kelas = NQ.ui.el('input', 'kelas', kartu); kelas.maxLength = 16; kelas.autocomplete = 'off'; kelas.placeholder = 'Kelas, mis. XI TKJ 1';
      var galat = NQ.ui.el('div', 'galat', p);
      var baris = NQ.ui.el('div', '', p);
      function mulai() {
        if (!nama.value.trim() || !kelas.value.trim()) { galat.textContent = 'Nama dan kelas wajib diisi.'; return; }
        if (NQ.simpan.ada() && !window.confirm('Progres lama akan diganti dengan permainan baru. Lanjutkan?')) return;
        NQ.progres.baru(nama.value.trim(), kelas.value.trim());
        bersihkan();
        NQ.scene.ke('prolog');
      }
      var bMulai = tambahTombol(baris, 'Mulai', mulai); bMulai.classList.add('kecil');
      var bBatal = tambahTombol(baris, 'Kembali', function () { NQ.menu.bukaJudul(); }); bBatal.classList.add('kecil');
      [nama, kelas].forEach(function (inp) {
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); if (inp === nama) kelas.focus(); else mulai(); }
          if (e.key === 'Escape') NQ.menu.bukaJudul();
        });
      });
      tombol = []; // fokus pada kotak isian
      kembali = function () { NQ.menu.bukaJudul(); };
      setTimeout(function () { nama.focus(); }, 30);
    },

    panduan: function () {
      var p = panel('halaman', 'PANDUAN');
      p.dataset.modal = '1';
      NQ.ui.el('div', '', p,
        '<h3>Kontrol keyboard</h3><table>' +
        '<tr><td>WASD / Panah</td><td>Berjalan</td></tr>' +
        '<tr><td>E / Enter</td><td>Periksa objek, lanjutkan dialog</td></tr>' +
        '<tr><td>T</td><td>Buka Tas Teknisi</td></tr>' +
        '<tr><td>J</td><td>Buka Jurnal Teknisi</td></tr>' +
        '<tr><td>Q</td><td>Pindai bersama Pingo</td></tr>' +
        '<tr><td>M</td><td>Peta sekolah</td></tr>' +
        '<tr><td>/ (tanda ?)</td><td>Minta petunjuk Pingo (mengurangi bintang)</td></tr>' +
        '<tr><td>Panah + E</td><td>Di panel: pilih tombol (sorotan kuning), lalu tekan</td></tr>' +
        '<tr><td>B</td><td>Buku Konsep (saat Jurnal terbuka)</td></tr>' +
        '<tr><td>Esc</td><td>Tutup panel</td></tr></table>' +
        '<h3>Mouse</h3><p>Klik lantai untuk berjalan, klik benda atau tokoh untuk memeriksa. Tombol Tas, Jurnal, Pindai, Peta, dan Petunjuk ada di kanan layar.</p>' +
        '<h3>Layar sentuh (HP/tablet)</h3><p>Pegang HP mendatar. Ketuk lantai untuk berjalan atau geser joystick di kiri. Ketuk benda untuk memeriksa, atau pakai tombol Periksa di kanan bersama Tas, Pindai, Jurnal, Peta, dan Petunjuk. Ketuk kotak dialog untuk melanjutkan.</p>' +
        '<h3>Cara bermain</h3><p>Selidiki gangguan jaringan di setiap ruangan. Catat gejala, buktikan dugaan, baru perbaiki. Jurnal terisi saat kamu melakukan setiap langkah.</p>' +
        '<h3>Info dan kredit</h3><p>NetQuest: Misteri Jaringan SMK Cendekia. Dibuat oleh Indar Bismoko, S.Pd., M.Pd. Gambar: ChatGPT. Musik: Gemini. Sekolah, tokoh, dan kasus bersifat fiktif.</p>');
      var b = NQ.ui.el('div', 'kaki', p);
      tambahTombol(b, 'Kembali', function () { NQ.menu.bukaJudul(); }).classList.add('kecil');
      kembali = function () { NQ.menu.bukaJudul(); };
      pilih(0);
    },

    pengaturan: function () {
      var p = panel('halaman', 'PENGATURAN');
      p.dataset.modal = '1';
      var s = NQ.state.pengaturan;
      var bm = tambahTombol(p, '', function () { s.musik = !s.musik; NQ.simpan.simpan(); NQ.audio.segarkan(); label(); });
      var be = tambahTombol(p, '', function () { s.efek = !s.efek; NQ.simpan.simpan(); label(); });
      tambahTombol(p, 'Hapus progres permainan', function () {
        if (window.confirm('Hapus semua progres? Tindakan ini tidak bisa dibatalkan.')) { NQ.simpan.hapus(); NQ.menu.bukaJudul(); }
      }, !NQ.simpan.ada());
      tambahTombol(p, 'Kembali', function () { NQ.menu.bukaJudul(); });
      function label() { bm.textContent = 'Musik: ' + (s.musik ? 'NYALA' : 'MATI'); be.textContent = 'Efek suara: ' + (s.efek ? 'NYALA' : 'MATI'); }
      label();
      kembali = function () { NQ.menu.bukaJudul(); };
      pilih(0);
    },

    // Kotak pesan: judul, teks, dan daftar tombol [{ label, aksi }]
    pesan: function (judul, teks, daftar) {
      var p = panel('pesan', judul);
      p.dataset.modal = '1';
      if (teks) NQ.ui.el('div', 'isi-pesan', p, teks);
      (daftar || [{ label: 'OK', aksi: function () { NQ.menu.tutup(); } }]).forEach(function (d) {
        tambahTombol(p, d.label, d.aksi, d.nonaktif);
      });
      kembali = function () { NQ.menu.tutup(); };
      pilih(0);
    },

    // Pilihan tindakan pada objek: daftar [{ label, aksi, nonaktif }]; panel tertutup sebelum aksi dijalankan.
    pilihan: function (judul, teks, daftar) {
      var opsi = daftar.map(function (d) {
        return { label: d.label, nonaktif: d.nonaktif, aksi: function () { NQ.menu.tutup(); d.aksi(); } };
      });
      opsi.push({ label: 'Batal', aksi: function () { NQ.menu.tutup(); } });
      this.pesan(judul, teks, opsi);
      halaman.classList.add('pilihan');
    },

    tutup: function () { bersihkan(); },

    perbarui: function () {
      if (!halaman) return;
      if (NQ.input.baruDitekan('atas')) pilih(indeks - 1);
      if (NQ.input.baruDitekan('bawah')) pilih(indeks + 1);
      if (NQ.input.baruDitekan('periksa') && tombol[indeks]) tombol[indeks].click();
      if (NQ.input.baruDitekan('batal') && kembali) kembali();
    }
  };

  NQ.ui.daftarModal({ aktif: function () { return !!halaman && halaman.dataset.modal === '1'; } });
})(window.NQ = window.NQ || {});
