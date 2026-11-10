/*
 * Scene 1 · Layar Judul: latar G1 (gedung SMK saat senja), Raka dan Pingo di halaman,
 * judul NETQUEST, dan menu (Mulai Petualangan, Lanjutkan, Panduan, Pengaturan).
 */
(function (NQ) {
  var waktu = 0;

  function teksBayang(ctx, isi, x, y, ukuran, warna) {
    ctx.font = 'bold ' + ukuran + 'px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5; ctx.strokeStyle = '#1a1426';
    ctx.strokeText(isi, x, y + 0.6);
    ctx.strokeText(isi, x, y);
    ctx.fillStyle = warna;
    ctx.fillText(isi, x, y);
  }

  NQ.scene.daftar('judul', {
    masuk: function () {
      waktu = 0;
      NQ.hud.sembunyi();
      NQ.kontrolSentuh.tampil(false);
      NQ.input.setKursor('default');
      NQ.menu.bukaJudul();
      NQ.audio.musik('tema');
    },
    keluar: function () {
      NQ.menu.tutup();
      NQ.kontrolSentuh.tampil(true);
    },
    perbarui: function (dt) { waktu += dt; },
    gambar: function () {
      var r = NQ.renderer, ctx = r.ctx(), L = NQ.config.lebarLayar;
      if (NQ.aset.ada('g1-judul')) NQ.aset.utuh(ctx, 'g1-judul', 0, 0, L, NQ.config.tinggiLayar);
      else r.bersihkan('#1b1446');

      if (NQ.aset.ada('logo')) {
        var lw = NQ.aset.lebar('logo'), lh = NQ.aset.tinggi('logo');
        NQ.aset.utuh(ctx, 'logo', (L - lw) / 2, 4);
        teksBayang(ctx, 'Misteri Jaringan SMK Cendekia', L / 2, 4 + lh + 2, 11, '#ffffff');
      } else {
        teksBayang(ctx, 'NETQUEST', L / 2, 14, 34, '#ffd23f');
        teksBayang(ctx, 'Misteri Jaringan SMK Cendekia', L / 2, 52, 11, '#ffffff');
      }

      // Raka dan Pingo berdiri di halaman depan gerbang
      NQ.aset.frame(ctx, 'raka-jalan', 1, 0, 120, 252 - 52);
      var bob = Math.round(Math.sin(waktu * 3) * 2);
      NQ.aset.frame(ctx, 'pingo', 0, 0, 152, 252 - 36 + bob);

      var gagal = NQ.aset.gagal();
      if (gagal.length) r.teks('Aset gagal dimuat: ' + gagal.length, 4, 260, '#ff6b6b', 8);
    }
  });
})(window.NQ = window.NQ || {});
