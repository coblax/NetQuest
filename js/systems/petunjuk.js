/*
 * Petunjuk Pingo tiga tingkat (Arah, Cara, Jawaban) dari data/petunjuk.js.
 * Setiap tingkat yang dibuka dicatat di NQ.state.petunjuk[kasus] untuk aturan bintang.
 * Ada jeda (config.jedaPetunjukDetik) sebelum tingkat berikutnya boleh dibuka.
 */
(function (NQ) {
  var terakhir = -1e9; // waktu (detik) petunjuk terakhir dibuka
  var LABEL = ['Arah', 'Cara', 'Jawaban'];

  NQ.petunjuk = {
    minta: function (kasus, pembicara) {
      var daftar = NQ.data.petunjuk[kasus];
      if (!daftar) return;
      var sekarang = performance.now() / 1000;
      var sudah = NQ.state.petunjuk[kasus] || 0;
      var tokoh = pembicara || { tokoh: 'Pingo', potret: 'pingo' };

      if (sudah >= daftar.length) {
        NQ.dialog.tampilkan([{ tokoh: tokoh.tokoh, potret: tokoh.potret, teks: 'Petunjuk terakhir: ' + daftar[daftar.length - 1] }]);
        return;
      }
      var sisa = Math.ceil(NQ.config.jedaPetunjukDetik - (sekarang - terakhir));
      if (sudah > 0 && sisa > 0) {
        NQ.dialog.tampilkan([{ tokoh: tokoh.tokoh, potret: tokoh.potret,
          teks: 'Coba dulu sebentar, ya. Petunjuk berikutnya bisa dibuka ' + sisa + ' detik lagi.' }]);
        return;
      }
      terakhir = sekarang;
      NQ.state.petunjuk[kasus] = sudah + 1;
      NQ.simpan.simpan();
      NQ.dialog.tampilkan([{ tokoh: tokoh.tokoh, potret: tokoh.potret,
        teks: 'Petunjuk ' + (sudah + 1) + ' (' + LABEL[sudah] + '): ' + daftar[sudah] }]);
    }
  };
})(window.NQ = window.NQ || {});
