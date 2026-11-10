/*
 * Panel "tampak dekat": melihat objek dari dekat (belakang CPU, switch, patch panel, LAN tester).
 * NQ.dekat.buka({
 *   judul, w, h,                 ukuran gambar dalam piksel logis
 *   gambar(ctx, waktu),          menggambar isi (koordinat logis)
 *   klik(x, y),                  opsional: klik pada gambar
 *   opsi() -> [{ label, aksi, nonaktif }],   tombol tindakan
 *   keterangan() -> teks,        opsional: teks di bawah gambar
 *   tutup()                      opsional: dipanggil saat panel ditutup
 * })
 * Juga berisi NQ.gambarTester untuk menggambar LAN tester (unit induk + remote, lampu pin 1-8).
 */
(function (NQ) {
  var panel, judulEl, kanvas, ctx, ketEl, tombolEl, cfg = null, waktu = 0, sudahDaftar = false;

  function buat() {
    panel = NQ.ui.el('div', 'panel dekat tersembunyi');
    judulEl = NQ.ui.el('h2', '', panel);
    kanvas = NQ.ui.el('canvas', 'kanvas-dekat', panel);
    ctx = kanvas.getContext('2d');
    ketEl = NQ.ui.el('div', 'ket-dekat', panel);
    tombolEl = NQ.ui.el('div', 'tombol-dekat', panel);
    kanvas.addEventListener('pointerdown', function (e) {
      if (!cfg || !cfg.klik || NQ.kotakDialog.aktif()) return;
      var r = kanvas.getBoundingClientRect();
      cfg.klik((e.clientX - r.left) / r.width * cfg.w, (e.clientY - r.top) / r.height * cfg.h);
      NQ.dekat.segarkan();
    });
    if (!sudahDaftar) { NQ.ui.daftarModal(NQ.dekat); sudahDaftar = true; }
  }

  function ukur() {
    var r = NQ.renderer.rasio();
    kanvas.style.width = (cfg.w / 8) + 'em';
    kanvas.style.height = (cfg.h / 8) + 'em';
    kanvas.width = Math.round(cfg.w * r);
    kanvas.height = Math.round(cfg.h * r);
    ctx.setTransform(r, 0, 0, r, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  }

  NQ.dekat = {
    buka: function (c) {
      if (!panel) buat();
      cfg = c; waktu = 0;
      NQ.ui.hapusFokus(panel);
      judulEl.textContent = c.judul || '';
      panel.classList.remove('tersembunyi');
      ukur();
      this.segarkan();
      NQ.input.reset();
    },
    tutup: function () {
      if (!cfg) return;
      var c = cfg; cfg = null;
      panel.classList.add('tersembunyi');
      NQ.input.reset();
      if (c.tutup) c.tutup();
    },
    aktif: function () { return !!cfg; },
    segarkan: function () {
      if (!cfg) return;
      ketEl.innerHTML = cfg.keterangan ? cfg.keterangan() : '';
      tombolEl.innerHTML = '';
      // opsi boleh berupa fungsi yang mengembalikan daftar, atau langsung daftar tombol
      var opsi = typeof cfg.opsi === 'function' ? cfg.opsi() : (cfg.opsi || []);
      var daftar = opsi.concat([{ label: 'Tutup', aksi: function () { NQ.dekat.tutup(); } }]);
      daftar.forEach(function (d) {
        var b = NQ.ui.el('button', 'tombol kecil', tombolEl, d.label);
        b.disabled = !!d.nonaktif;
        b.addEventListener('click', function () {
          if (b.disabled || NQ.kotakDialog.aktif()) return;
          NQ.audio.efek('menu-pilih');
          d.aksi();
          NQ.dekat.segarkan();
        });
      });
    },
    perbarui: function (dt) {
      if (!cfg) return;
      waktu += dt;
      var r = NQ.renderer.rasio();
      if (kanvas.width !== Math.round(cfg.w * r)) ukur();
      ctx.clearRect(0, 0, cfg.w, cfg.h);
      cfg.gambar(ctx, waktu);
      // panel lain di atasnya (Kartu Konsep, pesan) yang memegang keyboard
      if (NQ.kartuKonsep.aktif() || NQ.menu.aktif()) return;
      if (NQ.ui.navTombol(panel)) return;
      if (!NQ.kotakDialog.aktif() && NQ.input.baruDitekan('batal')) this.tutup();
    }
  };

  // ---------- LAN tester ----------
  // hasil: array 8 boolean (pin menyala di remote). mulai: waktu tes dimulai (detik); lampu menyala bergiliran.
  NQ.gambarTester = function (c, x, y, hasil, t) {
    var wI = NQ.aset.lebar('tester-induk'), hI = NQ.aset.tinggi('tester-induk');
    var wR = NQ.aset.lebar('tester-remote'), hR = NQ.aset.tinggi('tester-remote');
    NQ.aset.utuh(c, 'tester-induk', x, y);
    NQ.aset.utuh(c, 'tester-remote', x + wI + 6, y + (hI - hR));
    var aktifPin = t === null || t === undefined ? -1 : Math.floor(t / 0.25) % 9; // 0..7 pin, 8 = jeda
    function lampu(ox, oy, w, h, remote) {
      // layar unit: kira-kira 19%-80% lebar, 26%-61% tinggi
      var sx = ox + w * 0.21, sy = oy + h * 0.28, sw = w * 0.58, sh = h * 0.31;
      for (var i = 0; i < 8; i++) {
        var kol = i % 4, bar = Math.floor(i / 4);
        var cx = sx + sw * (kol + 0.5) / 4, cy = sy + sh * (bar === 0 ? 0.32 : 0.78);
        var nyala = aktifPin === i && (!remote || !hasil || hasil[i]);
        var rusak = remote && hasil && !hasil[i] && aktifPin === i;
        c.fillStyle = nyala ? '#5ee05e' : (rusak ? '#ff4d4d' : '#24402a');
        c.beginPath(); c.arc(cx, cy, Math.min(sw / 10, 2.6), 0, Math.PI * 2); c.fill();
        if (nyala) { c.fillStyle = 'rgba(94,224,94,0.35)'; c.beginPath(); c.arc(cx, cy, Math.min(sw / 6, 4.2), 0, Math.PI * 2); c.fill(); }
        c.fillStyle = '#d6dcf0'; c.font = 'bold 3.6px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(String(i + 1), cx, cy + (bar === 0 ? -3.6 : 3.6));
      }
    }
    lampu(x, y, wI, hI, false);
    lampu(x + wI + 6, y + (hI - hR), wR, hR, true);
    return { w: wI + 6 + wR, h: hI };
  };
})(window.NQ = window.NQ || {});
