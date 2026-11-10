/*
 * Input: keyboard (WASD/panah, E, T, Q, J, M, ?) dan sentuhan.
 * Sistem lain cukup bertanya: NQ.input.ditekan('periksa') atau NQ.input.baruDitekan('tas').
 * Saat siswa mengetik di kotak isian (nama, kelas, terminal), tombol tidak diteruskan ke game.
 */
(function (NQ) {
  var tahan = {};      // kode tombol yang sedang ditekan
  var baru = {};       // kode tombol yang baru ditekan pada frame ini
  var sentuh = {};     // aksi yang sedang ditekan lewat layar sentuh / tombol yang diklik
  var sentuhBaru = {}; // aksi sentuh yang baru ditekan pada frame ini
  var klik = null;     // klik/ketuk terakhir di canvas, dalam koordinat logis { x, y }
  var arah = null;     // posisi kursor di canvas (untuk efek hover)

  function keLogis(e) {
    var c = NQ.renderer.canvas(), r = c.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width * NQ.config.lebarLayar,
      y: (e.clientY - r.top) / r.height * NQ.config.tinggiLayar
    };
  }

  function sedangMengetik(e) {
    var t = e.target;
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }

  function cocok(aksi, kumpulan) {
    var daftar = NQ.config.tombol[aksi] || [];
    for (var i = 0; i < daftar.length; i++) {
      if (kumpulan[daftar[i]]) return true;
    }
    return false;
  }

  NQ.input = {
    mulai: function () {
      window.addEventListener('keydown', function (e) {
        if (sedangMengetik(e)) return;
        // Enter/Spasi tidak boleh "mengklik" tombol HTML yang terakhir diklik mouse;
        // pemilihan tombol dengan keyboard ditangani NQ.ui.navTombol dan menu.
        var fokus = document.activeElement;
        if ((e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space') && fokus && fokus.tagName === 'BUTTON') { e.preventDefault(); fokus.blur(); }
        if (!tahan[e.code]) baru[e.code] = true;
        tahan[e.code] = true;
        // Cegah halaman ikut bergulir saat menekan panah atau spasi.
        if (/^Arrow|^Space$/.test(e.code)) e.preventDefault();
      });
      window.addEventListener('keyup', function (e) { tahan[e.code] = false; });
      window.addEventListener('blur', function () { tahan = {}; sentuh = {}; });

      // Mouse dan ketukan langsung di area game
      var c = NQ.renderer.canvas();
      c.addEventListener('pointerdown', function (e) {
        if (e.button !== undefined && e.button !== 0) return;
        klik = keLogis(e);
      });
      c.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') arah = keLogis(e); });
      c.addEventListener('pointerleave', function () { arah = null; });

      // Jenis masukan yang dipakai menentukan kontrol di layar:
      // sentuhan -> joystick dan tombol besar; mouse -> bilah aksi di kanan (laptop layar sentuh bisa berganti).
      document.addEventListener('pointerdown', function (e) {
        if (!NQ.kontrolSentuh) return;
        if (e.pointerType === 'touch') NQ.kontrolSentuh.aktifkanSentuh();
        else if (e.pointerType === 'mouse') NQ.kontrolSentuh.aktifkanMouse();
      }, true);
      // Tekan lama di HP tidak memunculkan menu konteks atau seleksi teks
      document.getElementById('game').addEventListener('contextmenu', function (e) {
        if (!sedangMengetik(e)) e.preventDefault();
      });
    },
    // Ambil klik di canvas (sekali pakai). Mengembalikan { x, y } logis atau null.
    ambilKlik: function () { var k = klik; klik = null; return k; },
    adaKlik: function () { return !!klik; },
    kursor: function () { return arah; },
    setKursor: function (gaya) { NQ.renderer.canvas().style.cursor = gaya || 'default'; },
    ditekan: function (aksi) { return cocok(aksi, tahan) || !!sentuh[aksi]; },
    baruDitekan: function (aksi) { return cocok(aksi, baru) || !!sentuhBaru[aksi]; },
    // Dipanggil oleh ui/kontrol-sentuh.js
    setSentuh: function (aksi, nilai) {
      if (nilai && !sentuh[aksi]) sentuhBaru[aksi] = true;
      sentuh[aksi] = nilai;
    },
    // Dipanggil di akhir setiap frame.
    akhirFrame: function () { baru = {}; sentuhBaru = {}; klik = null; },
    // Lupakan tombol yang sedang ditahan (dipakai saat panel dibuka/ditutup).
    reset: function () { baru = {}; sentuhBaru = {}; klik = null; }
  };
})(window.NQ = window.NQ || {});
