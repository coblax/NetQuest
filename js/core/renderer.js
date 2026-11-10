/*
 * Renderer HD: semua kode game menggambar dalam koordinat logis 480 x 270,
 * tetapi canvas memakai resolusi asli layar (termasuk devicePixelRatio),
 * sehingga gambar HD dan teks tampil tajam di laptop, proyektor, maupun HP.
 */
(function (NQ) {
  var canvas, ctx, rasio = 1, lebarTampil = 480;

  function sesuaikanUkuran() {
    var L = NQ.config.lebarLayar, T = NQ.config.tinggiLayar;
    var s = Math.min(window.innerWidth / L, window.innerHeight / T);
    var cw = Math.floor(L * s), ch = Math.floor(T * s);
    var dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    rasio = canvas.width / L;
    lebarTampil = cw;
    aturKonteks();

    var ui = document.getElementById('ui');
    ui.style.left = Math.round((window.innerWidth - cw) / 2) + 'px';
    ui.style.top = Math.round((window.innerHeight - ch) / 2) + 'px';
    ui.style.width = cw + 'px';
    ui.style.height = ch + 'px';
    // 1em di lapisan UI = 8 piksel logis, jadi teks dan bingkai ikut membesar bersama layar.
    ui.style.fontSize = (8 * cw / L) + 'px';
  }

  function aturKonteks() {
    ctx.setTransform(rasio, 0, 0, rasio, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

  NQ.renderer = {
    mulai: function () {
      canvas = document.getElementById('layar');
      ctx = canvas.getContext('2d');
      window.addEventListener('resize', sesuaikanUkuran);
      // HP: ukuran dihitung ulang saat diputar, saat bilah browser muncul/hilang, dan saat masuk layar penuh
      window.addEventListener('orientationchange', function () { setTimeout(sesuaikanUkuran, 250); });
      document.addEventListener('fullscreenchange', function () { setTimeout(sesuaikanUkuran, 100); });
      if (window.visualViewport) window.visualViewport.addEventListener('resize', sesuaikanUkuran);
      sesuaikanUkuran();
    },
    canvas: function () { return canvas; },
    ctx: function () { return ctx; },
    rasio: function () { return rasio; },          // piksel layar per piksel logis
    lebarTampil: function () { return lebarTampil; },
    aturKonteks: aturKonteks,
    bersihkan: function (warna) {
      ctx.fillStyle = warna || '#000';
      ctx.fillRect(0, 0, NQ.config.lebarLayar, NQ.config.tinggiLayar);
    },
    teks: function (isi, x, y, warna, ukuran, rata) {
      ctx.fillStyle = warna || '#fff';
      ctx.font = (ukuran || 8) + 'px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = rata || 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(isi, x, y);
    }
  };
})(window.NQ = window.NQ || {});
