/*
 * Titik mulai NetQuest: menyiapkan mesin, memuat aset, lalu menjalankan putaran game (game loop).
 * Urutan setiap frame: panel antarmuka dulu (dialog, Tas, Jurnal, menu), baru scene.
 * Selama ada panel terbuka, dunia game berhenti bergerak.
 */
(function (NQ) {
  var terakhir = 0;

  function putaran(sekarang) {
    var dt = Math.min(0.05, (sekarang - terakhir) / 1000); // batasi lompatan saat tab tidak aktif
    terakhir = sekarang;

    NQ.kotakDialog.perbarui(dt);
    NQ.tas.perbarui();
    NQ.jurnal.perbarui();
    NQ.menu.perbarui();
    NQ.dekat.perbarui(dt);
    NQ.petaSekolah.perbarui();
    NQ.minigame.crimping.perbarui();
    NQ.terminal.perbarui();
    NQ.minigame.pertarungan.perbarui();
    NQ.minigame.laporan.perbarui();
    NQ.kartuKonsep.perbarui();
    NQ.kontrolSentuh.perbarui();
    NQ.scene.perbarui(dt);
    NQ.scene.gambar(NQ.renderer.ctx());
    NQ.input.akhirFrame();

    requestAnimationFrame(putaran);
  }

  window.addEventListener('load', function () {
    NQ.renderer.mulai();
    NQ.input.mulai();
    NQ.kontrolSentuh.mulai();
    var simpanan = NQ.simpan.muat();
    if (simpanan && simpanan.pengaturan) NQ.state.pengaturan = simpanan.pengaturan;
    NQ.renderer.bersihkan('#0b1026');
    NQ.renderer.teks('Memuat...', NQ.config.lebarLayar / 2, 130, '#ffffff', 8, 'center');
    // Tunggu font pixel siap supaya teks di canvas tidak tergambar dengan font cadangan
    var fontSiap = (document.fonts && document.fonts.load)
      ? Promise.all([document.fonts.load('11px "Pixel"'), document.fonts.load('8px "Judul"')]).catch(function () {})
      : Promise.resolve();
    NQ.aset.muat(function () {
      fontSiap.then(function () {
        NQ.scene.ke('judul');
        requestAnimationFrame(function (t) { terakhir = t; requestAnimationFrame(putaran); });
      });
    });
  });
})(window.NQ = window.NQ || {});
