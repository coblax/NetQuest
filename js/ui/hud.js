/*
 * Alat bantu antarmuka HTML (NQ.ui) dan HUD: energi, keping 0/4, dan pelacak tugas.
 */
(function (NQ) {
  var modal = []; // komponen yang menghentikan gerak dunia saat terbuka

  NQ.ui = {
    akar: function () { return document.getElementById('ui'); },
    el: function (tag, kelas, induk, html) {
      var e = document.createElement(tag);
      if (kelas) e.className = kelas;
      if (html !== undefined) e.innerHTML = html;
      (induk || this.akar()).appendChild(e);
      return e;
    },
    esc: function (s) {
      return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
    },
    daftarModal: function (komponen) { modal.push(komponen); },
    // Pesan singkat di tengah atas layar, hilang sendiri
    toast: function (html) {
      var t = NQ.ui.el('div', 'toast', null, html);
      setTimeout(function () { t.classList.add('pudar'); }, 1800);
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2400);
    },
    adaModal: function () {
      for (var i = 0; i < modal.length; i++) if (modal[i].aktif()) return true;
      return false;
    },

    // Navigasi keyboard umum untuk tombol di sebuah panel:
    // panah (atau WASD) memindah sorotan kuning, E / Enter menekan tombol yang disorot.
    // opsi.horizontal = false: kiri/kanan tidak dipakai (dipakai panel untuk hal lain).
    // Mengembalikan true bila tombol ditangani pada frame ini.
    navTombol: function (panel, opsi) {
      opsi = opsi || {};
      if (!panel || NQ.kotakDialog.aktif()) return false;
      var daftar = [].filter.call(panel.querySelectorAll('button'), function (b) {
        return !b.disabled && b.offsetParent !== null && getComputedStyle(b).visibility !== 'hidden';
      });
      if (!daftar.length) return false;
      var i = daftar.indexOf(panel._fokus);
      // panel digambar ulang: pulihkan sorotan pada urutan yang sama
      if (i < 0 && panel._fokusUrut !== undefined) {
        i = Math.min(panel._fokusUrut, daftar.length - 1);
        panel._fokus = daftar[i];
      }
      if (i >= 0 && !daftar[i].classList.contains('fokus')) daftar[i].classList.add('fokus');
      var maju = NQ.input.baruDitekan('bawah') || (opsi.horizontal !== false && NQ.input.baruDitekan('kanan'));
      var mundur = NQ.input.baruDitekan('atas') || (opsi.horizontal !== false && NQ.input.baruDitekan('kiri'));
      if (maju || mundur) {
        i = i < 0 ? (maju ? 0 : daftar.length - 1) : (i + (maju ? 1 : -1) + daftar.length) % daftar.length;
        if (panel._fokus) panel._fokus.classList.remove('fokus');
        panel._fokus = daftar[i]; panel._fokusUrut = i;
        daftar[i].classList.add('fokus');
        if (daftar[i].scrollIntoView) daftar[i].scrollIntoView({ block: 'nearest' });
        NQ.audio.efek('menu-pilih');
        return true;
      }
      if (i >= 0 && NQ.input.baruDitekan('periksa')) {
        var b = daftar[i];
        NQ.input.reset();
        b.click();
        return true;
      }
      return false;
    },
    // Hapus sorotan keyboard (misalnya saat panel dibuka ulang)
    hapusFokus: function (panel) {
      if (!panel) return;
      if (panel._fokus) panel._fokus.classList.remove('fokus');
      panel._fokus = null; panel._fokusUrut = undefined;
    }
  };

  var kiri, kanan, energiEl, kepingEl, judulEl, tugasEl;

  NQ.hud = {
    tampil: function () {
      if (!kiri) {
        kiri = NQ.ui.el('div', 'panel hud-kiri');
        var e = NQ.ui.el('div', '', kiri, '<span class="label">ENERGI</span>');
        energiEl = NQ.ui.el('span', 'energi', e);
        var k = NQ.ui.el('div', '', kiri, '<span class="label">KEPING</span>');
        kepingEl = NQ.ui.el('span', 'keping', k);
        kanan = NQ.ui.el('div', 'panel hud-kanan');
        judulEl = NQ.ui.el('div', 'judul', kanan);
        tugasEl = NQ.ui.el('div', 'tugas', kanan);
      }
      kiri.classList.remove('tersembunyi');
      kanan.classList.remove('tersembunyi');
      this.segarkan();
    },
    sembunyi: function () {
      if (kiri) { kiri.classList.add('tersembunyi'); kanan.classList.add('tersembunyi'); }
    },
    segarkan: function () {
      if (!kiri) return;
      var s = NQ.state, h = '';
      for (var i = 0; i < NQ.config.energiMaks; i++) h += '<i class="' + (i < s.energi ? '' : 'habis') + '"></i>';
      energiEl.innerHTML = h;
      h = '';
      for (i = 0; i < NQ.config.jumlahKeping; i++) h += '<i class="' + (i < s.keping ? 'ada' : '') + '"></i>';
      kepingEl.innerHTML = h;
      var info = NQ.progres.infoTahap();
      judulEl.textContent = info ? info.judul.toUpperCase() : '';
      tugasEl.textContent = s.tugas || '';
    }
  };
})(window.NQ = window.NQ || {});
