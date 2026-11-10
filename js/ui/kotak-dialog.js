/*
 * Kotak dialog HTML: potret, nama tokoh, dan teks dengan efek ketik.
 * E / Enter / ketuk: selesaikan ketikan, lalu lanjut ke baris berikutnya.
 */
(function (NQ) {
  var POTRET = {
    'pingo': 'pingo-potret', 'raka': 'raka-potret',
    'c1-pak-bima': 'c1-pak-bima-potret'
  };
  var kotak, potretEl, imgEl, namaEl, teksEl, lanjutEl;
  var antre = [], selesaiCb = null, teksPenuh = '', tampil = 0, waktu = 0, aktif = false, jeda = false;

  function buat() {
    kotak = NQ.ui.el('div', 'panel dialog tersembunyi');
    potretEl = NQ.ui.el('div', 'potret', kotak);
    imgEl = NQ.ui.el('img', '', potretEl);
    var isi = NQ.ui.el('div', 'isi', kotak);
    namaEl = NQ.ui.el('div', 'nama', isi);
    teksEl = NQ.ui.el('div', 'teks', isi);
    lanjutEl = NQ.ui.el('div', 'lanjut', kotak, '&#9660;');
    kotak.addEventListener('click', function () { maju(); });
  }

  function barisBerikut() {
    var b = antre.shift();
    if (!b) { tutup(); return; }
    var kunci = POTRET[b.potret] || (b.potret ? b.potret + '-potret' : null);
    var src = kunci && NQ.data.aset.gambar[kunci];
    if (src) { imgEl.src = src; potretEl.classList.remove('tersembunyi'); }
    else potretEl.classList.add('tersembunyi');
    namaEl.textContent = b.tokoh || '';
    teksPenuh = b.teks; tampil = 0; waktu = 0;
    if (b.potret === 'pingo') NQ.audio.efek('bip-pingo');
    teksEl.textContent = '';
    lanjutEl.classList.add('tersembunyi');
  }

  function maju() {
    if (!aktif) return;
    if (tampil < teksPenuh.length) { tampil = teksPenuh.length; teksEl.textContent = teksPenuh; lanjutEl.classList.remove('tersembunyi'); return; }
    NQ.audio.efek('menu-pilih');
    barisBerikut();
  }

  function tutup() {
    aktif = false;
    kotak.classList.add('tersembunyi');
    NQ.input.reset();
    var cb = selesaiCb; selesaiCb = null;
    if (cb) cb();
  }

  NQ.kotakDialog = {
    buka: function (baris, selesai) {
      if (!kotak) buat();
      antre = baris.slice(); selesaiCb = selesai || null;
      aktif = true; jeda = true;
      kotak.classList.remove('tersembunyi');
      barisBerikut();
    },
    aktif: function () { return aktif; },
    perbarui: function (dt) {
      if (!aktif) return;
      if (jeda) { jeda = false; return; } // abaikan tombol yang membuka dialog ini
      if (tampil < teksPenuh.length) {
        waktu += dt;
        var n = Math.min(teksPenuh.length, Math.floor(waktu * 45));
        if (n !== tampil) {
          tampil = n; teksEl.textContent = teksPenuh.slice(0, n);
          if (n % 3 === 0) NQ.audio.efek('teks-blip');
        }
        if (tampil >= teksPenuh.length) lanjutEl.classList.remove('tersembunyi');
      }
      // E / Enter, atau klik di mana saja pada layar game, melanjutkan dialog
      if (NQ.input.baruDitekan('periksa') || NQ.input.ambilKlik()) maju();
    },
    maju: function () { maju(); }
  };

  NQ.ui.daftarModal(NQ.kotakDialog);
})(window.NQ = window.NQ || {});
