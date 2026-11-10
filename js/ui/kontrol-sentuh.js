/*
 * Kontrol tambahan selain keyboard:
 * - Bilah aksi (mouse): tombol Tas, Jurnal, Pindai, Peta, Petunjuk di sisi kanan layar game.
 * - Mode sentuh (HP/tablet): joystick dan tombol besar, muncul otomatis setelah layar disentuh.
 * Semua tombol mengirim aksi ke NQ.input.setSentuh(), sama seperti tombol keyboard.
 */
(function (NQ) {
  var wadahSentuh, bilah, joy, tuas, aktifId = null, pusat = { x: 0, y: 0 }, radius = 1;
  var modeSentuh = false, terlihat = false, disorot = null;

  var AKSI = [
    { aksi: 'tas', ikon: 'tombol-tas', label: 'Tas (T)' },
    { aksi: 'jurnal', ikon: 'tombol-jurnal', label: 'Jurnal (J)' },
    { aksi: 'pindai', ikon: 'tombol-pindai', label: 'Pindai (Q)' },
    { aksi: 'peta', ikon: 'tombol-peta', label: 'Peta (M)' },
    { aksi: 'petunjuk', ikon: null, label: 'Petunjuk (?)' }
  ];

  function arahJoystick(dx, dy) {
    var mati = 0.3;
    NQ.input.setSentuh('kiri', dx < -mati);
    NQ.input.setSentuh('kanan', dx > mati);
    NQ.input.setSentuh('atas', dy < -mati);
    NQ.input.setSentuh('bawah', dy > mati);
  }

  function geser(e) {
    var dx = (e.clientX - pusat.x) / radius, dy = (e.clientY - pusat.y) / radius;
    var pj = Math.sqrt(dx * dx + dy * dy);
    if (pj > 1) { dx /= pj; dy /= pj; }
    tuas.style.transform = 'translate(' + (dx * radius * 0.6) + 'px,' + (dy * radius * 0.6) + 'px)';
    arahJoystick(dx, dy);
  }

  function lepas() {
    aktifId = null;
    tuas.style.transform = '';
    arahJoystick(0, 0);
  }

  function tombol(induk, a) {
    var b = document.createElement('button');
    b.title = a.label;
    b.dataset.aksi = a.aksi;
    if (a.ikon) { var im = document.createElement('img'); im.src = 'assets/img/ikon/ui/' + a.ikon + '.png'; im.alt = a.label; b.appendChild(im); }
    else { b.className = 'teks'; b.innerHTML = '<span>?</span>'; }
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); NQ.input.setSentuh(a.aksi, true); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      b.addEventListener(ev, function () { NQ.input.setSentuh(a.aksi, false); });
    });
    induk.appendChild(b);
    return b;
  }

  function buatSentuh() {
    wadahSentuh = document.getElementById('kontrol-sentuh');
    joy = document.createElement('div'); joy.className = 'joystick';
    tuas = document.createElement('div'); tuas.className = 'tuas';
    joy.appendChild(tuas); wadahSentuh.appendChild(joy);
    joy.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      var r = joy.getBoundingClientRect();
      pusat = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; radius = r.width / 2;
      aktifId = e.pointerId; joy.setPointerCapture(e.pointerId); geser(e);
    });
    joy.addEventListener('pointermove', function (e) { if (e.pointerId === aktifId) geser(e); });
    joy.addEventListener('pointerup', lepas);
    joy.addEventListener('pointercancel', lepas);
    var aksi = document.createElement('div'); aksi.className = 'tombol-aksi'; wadahSentuh.appendChild(aksi);
    AKSI.forEach(function (a) { tombol(aksi, a); });
    tombol(aksi, { aksi: 'periksa', ikon: 'tombol-periksa', label: 'Periksa (E)' });
  }

  // HP/tablet: sekali sentuhan pertama, minta layar penuh dan kunci posisi mendatar (bila browser mengizinkan)
  var sudahPenuh = false;
  function layarPenuh() {
    if (sudahPenuh) return;
    // hanya bisa diminta saat pengguna benar-benar menyentuh layar (bukan saat halaman dimuat)
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    sudahPenuh = true;
    var el = document.documentElement, minta = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!minta || document.fullscreenElement || !window.matchMedia('(pointer: coarse)').matches) return;
    try {
      var p = minta.call(el, { navigationUI: 'hide' });
      var kunci = function () { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {}); };
      if (p && p.then) p.then(kunci).catch(function () {}); else kunci();
    } catch (e) { /* browser menolak: game tetap jalan tanpa layar penuh */ }
  }

  // Pesan "putar HP" saat layar sentuh dipegang tegak (game dirancang mendatar 16:9)
  function buatPesanPutar() {
    var d = document.createElement('div');
    d.id = 'putar-layar';
    d.innerHTML = '<div class="ikon-hp"></div><b>Putar HP ke posisi mendatar</b><span>NetQuest dimainkan dalam posisi landscape.</span>';
    document.body.appendChild(d);
  }

  function segarkan() {
    if (bilah) bilah.classList.toggle('tersembunyi', !terlihat || modeSentuh);
    if (wadahSentuh) wadahSentuh.hidden = !terlihat || !modeSentuh;
  }

  NQ.kontrolSentuh = {
    mulai: function () {
      bilah = NQ.ui.el('div', 'bilah-aksi tersembunyi');
      AKSI.forEach(function (a) { tombol(bilah, a); });
      buatPesanPutar();
      // Perangkat tanpa mouse (HP/tablet) langsung memakai mode sentuh
      if (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) this.aktifkanSentuh();
      segarkan();
    },
    aktifkanSentuh: function () {
      layarPenuh();
      if (modeSentuh) return;
      modeSentuh = true;
      if (!wadahSentuh) buatSentuh();
      var s = disorot; disorot = undefined; this.sorot(s);
      segarkan();
    },
    // Laptop layar sentuh: kembali ke bilah aksi mouse saat mouse dipakai lagi
    aktifkanMouse: function () {
      if (!modeSentuh) return;
      modeSentuh = false;
      if (aktifId !== null) lepas();
      segarkan();
    },
    modeSentuh: function () { return modeSentuh; },
    // Tampilkan hanya saat bermain (bukan di layar judul)
    tampil: function (ya) { terlihat = !!ya; segarkan(); },
    // Sorot satu tombol aksi (tas, jurnal, pindai, peta, petunjuk) dengan panah kuning; null = tidak ada
    sorot: function (aksi) {
      if (aksi === disorot) return;
      disorot = aksi;
      [bilah, wadahSentuh].forEach(function (w) {
        if (!w) return;
        [].forEach.call(w.querySelectorAll('button[data-aksi]'), function (b) { b.classList.toggle('sorot', b.dataset.aksi === aksi); });
      });
    },
    // Sembunyikan joystick dan tombol selama ada panel atau dialog terbuka supaya tidak menutupi tombol panel
    perbarui: function () {
      var tutupi = NQ.ui.adaModal() ? 'hidden' : '';
      if (wadahSentuh && wadahSentuh.style.visibility !== tutupi) wadahSentuh.style.visibility = tutupi;
      if (bilah && bilah.style.visibility !== tutupi) bilah.style.visibility = tutupi;
    }
  };
})(window.NQ = window.NQ || {});
