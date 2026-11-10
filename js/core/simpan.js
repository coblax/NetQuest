/*
 * Simpan dan muat progres di localStorage (nama, kelas, tahap, alat, Jurnal, keping, bintang,
 * petunjuk, pengaturan). Selalu dibungkus try/catch: di jendela privat localStorage bisa ditolak.
 */
(function (NQ) {
  function kunci() { return NQ.config.kunciSimpan; }

  NQ.simpan = {
    simpan: function () {
      try { localStorage.setItem(kunci(), JSON.stringify(NQ.state)); return true; }
      catch (e) { console.warn('Progres tidak bisa disimpan:', e); return false; }
    },
    muat: function () {
      try {
        var isi = localStorage.getItem(kunci());
        return isi ? JSON.parse(isi) : null;
      } catch (e) { return null; }
    },
    ada: function () { return !!this.muat(); },
    hapus: function () {
      try { localStorage.removeItem(kunci()); } catch (e) { /* abaikan */ }
    }
  };
})(window.NQ = window.NQ || {});
