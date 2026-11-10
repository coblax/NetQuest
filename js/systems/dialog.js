/*
 * Menjalankan dialog dari data/dialog.js.
 * NQ.dialog.jalankan('prolog', 'masuk-kantor', selesai) menampilkan semua baris dengan pemicu itu
 * berurutan, lalu memanggil selesai(). NQ.dialog.tampilkan([...baris], selesai) untuk baris bebas.
 */
(function (NQ) {
  NQ.dialog = {
    baris: function (kasus, pemicu) {
      return (NQ.data.dialog[kasus] || []).filter(function (b) { return b.pemicu === pemicu; });
    },
    jalankan: function (kasus, pemicu, selesai) {
      var b = this.baris(kasus, pemicu);
      if (!b.length) { console.warn('Dialog tidak ditemukan:', kasus, pemicu); if (selesai) selesai(); return; }
      this.tampilkan(b, selesai);
    },
    tampilkan: function (baris, selesai) {
      NQ.kotakDialog.buka(baris.map(function (b) {
        return { tokoh: b.tokoh, potret: b.potret, teks: NQ.dialog.isiNama(b.teks) };
      }), selesai);
    },
    // Ganti {nama} dengan nama pemain dari kartu teknisi.
    isiNama: function (teks) { return String(teks).replace(/\{nama\}/g, NQ.state.nama || 'Raka'); }
  };
})(window.NQ = window.NQ || {});
