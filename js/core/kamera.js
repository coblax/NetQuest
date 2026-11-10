/*
 * Kamera: menentukan geseran gambar ruangan di layar.
 * Ruangan yang lebih kecil dari layar diletakkan di tengah; ruangan besar mengikuti Raka.
 */
(function (NQ) {
  var ATAS_HUD = 22; // ruang untuk HUD di bagian atas layar

  NQ.kamera = {
    x: 0, y: 0,
    atur: function (lebarRuang, tinggiRuang, fokusX, fokusY) {
      var L = NQ.config.lebarLayar, T = NQ.config.tinggiLayar - ATAS_HUD;
      if (lebarRuang <= L) this.x = Math.floor((L - lebarRuang) / 2);
      else this.x = -Math.round(Math.max(0, Math.min(lebarRuang - L, fokusX - L / 2)));
      if (tinggiRuang <= T) this.y = ATAS_HUD + Math.floor((T - tinggiRuang) / 2);
      else this.y = ATAS_HUD - Math.round(Math.max(0, Math.min(tinggiRuang - T, fokusY - T / 2)));
    }
  };
})(window.NQ = window.NQ || {});
