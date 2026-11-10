/*
 * Scene manager: mendaftarkan dan berpindah antar-scene.
 * Setiap scene adalah objek { masuk(data), perbarui(dt), gambar(ctx), keluar() }.
 * Scene didaftarkan dari folder js/scenes dengan NQ.scene.daftar('nama', objek).
 */
(function (NQ) {
  var semua = {};
  var aktif = null;
  var namaAktif = '';

  NQ.scene = {
    daftar: function (nama, scene) { semua[nama] = scene; },
    ke: function (nama, data) {
      if (!semua[nama]) { console.warn('Scene belum dibuat:', nama); return; }
      if (aktif && aktif.keluar) aktif.keluar();
      aktif = semua[nama];
      namaAktif = nama;
      if (aktif.masuk) aktif.masuk(data || {});
    },
    nama: function () { return namaAktif; },
    perbarui: function (dt) { if (aktif && aktif.perbarui) aktif.perbarui(dt); },
    gambar: function (ctx) { if (aktif && aktif.gambar) aktif.gambar(ctx); }
  };
})(window.NQ = window.NQ || {});
