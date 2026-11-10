/*
 * Musik (berulang), suara latar (berulang, misalnya dengung server), dan efek suara
 * memakai elemen Audio (aman untuk file://).
 * Jika file belum terdaftar di data/aset.js, panggilan diabaikan tanpa error.
 * Browser baru mengizinkan suara setelah pemain menekan tombol atau layar sekali;
 * suara yang tertahan diputar ulang pada interaksi pertama.
 */
(function (NQ) {
  var musikAktif = null, namaMusik = '';
  var ambienAktif = null, namaAmbien = '';
  var cacheSfx = {};

  function pengaturan() { return (NQ.state && NQ.state.pengaturan) || { musik: true, efek: true }; }
  function vol(nama, dasar) { var v = NQ.data.aset.volume || {}; return v[nama] !== undefined ? v[nama] : dasar; }
  function putar(a) { var p = a.play(); if (p && p.catch) p.catch(function () { /* menunggu interaksi pertama */ }); }

  // Coba lagi musik dan suara latar setelah interaksi pertama (aturan autoplay browser)
  function bukaKunci() {
    if (musikAktif && musikAktif.paused) putar(musikAktif);
    if (ambienAktif && ambienAktif.paused) putar(ambienAktif);
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, bukaKunci); });

  NQ.audio = {
    musik: function (nama) {
      if (nama === namaMusik && musikAktif) return;
      this.hentikanMusik();
      namaMusik = nama;
      var src = NQ.data.aset.musik[nama];
      if (!src || !pengaturan().musik) return;
      musikAktif = new Audio(src);
      musikAktif.loop = true;
      musikAktif.volume = 0.45;
      putar(musikAktif);
    },
    hentikanMusik: function () {
      if (musikAktif) { musikAktif.pause(); musikAktif = null; }
      namaMusik = '';
    },
    ambien: function (nama) {
      if (nama === namaAmbien && ambienAktif) return;
      this.hentikanAmbien();
      namaAmbien = nama;
      var src = NQ.data.aset.sfx[nama];
      if (!src || !pengaturan().efek) return;
      ambienAktif = new Audio(src);
      ambienAktif.loop = true;
      ambienAktif.volume = vol(nama, 0.3);
      putar(ambienAktif);
    },
    hentikanAmbien: function () {
      if (ambienAktif) { ambienAktif.pause(); ambienAktif = null; }
      namaAmbien = '';
    },
    efek: function (nama) {
      var src = NQ.data.aset.sfx[nama];
      if (!src || !pengaturan().efek) return;
      var a = cacheSfx[nama] || (cacheSfx[nama] = new Audio(src));
      a.volume = vol(nama, 0.6);
      try { a.currentTime = 0; putar(a); } catch (e) { /* abaikan */ }
    },
    // Dipanggil saat pengaturan musik/efek diubah.
    segarkan: function () {
      var m = namaMusik, b = namaAmbien;
      namaMusik = ''; namaAmbien = '';
      if (m) this.musik(m); else this.hentikanMusik();
      if (b) this.ambien(b); else this.hentikanAmbien();
    }
  };
})(window.NQ = window.NQ || {});
