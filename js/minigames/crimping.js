/*
 * Kasus 2: meja kerja crimping. Pemain memotong ujung kabel, mengupas selubung,
 * menyusun 8 kabel ke pin 1-8 sesuai T568B, meratakan dan mendorong sampai mentok, lalu crimp
 * dan menguji dengan LAN tester. Stok konektor terbatas (state.konektor).
 *
 * NQ.minigame.crimping.buka({ saatBerhasil(), salah(id, opsi, selesai), konektorHabis(selesai) })
 */
(function (NQ) {
  var T568B = ['putih-oranye', 'oranye', 'putih-hijau', 'biru', 'putih-biru', 'hijau', 'putih-cokelat', 'cokelat'];
  var WARNA = { oranye: '#f08a24', hijau: '#2fae4a', biru: '#2f6fe0', cokelat: '#7a4a24' };

  var panel, el = {}, cfg, st, aktif = false, sudahDaftar = false, ujiMulai = null, hasil = null;

  function gayaKabel(nama) {
    var bergaris = nama.indexOf('putih-') === 0, w = WARNA[nama.replace('putih-', '')];
    return bergaris ? 'repeating-linear-gradient(160deg,#f4f4f4 0 0.35em,' + w + ' 0.35em 0.7em)' : w;
  }

  function acak(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function reset(potongUlang) {
    st = { dipotong: !potongUlang && st ? st.dipotong : false, kupas: null, slot: [null, null, null, null, null, null, null, null],
           kolam: acak(T568B), rata: false, dicrimp: false, gagal: false };
    hasil = null; ujiMulai = null;
  }

  function buat() {
    panel = NQ.ui.el('div', 'panel crimping tersembunyi');
    var kepala = NQ.ui.el('div', 'kepala', panel);
    NQ.ui.el('h2', '', kepala, 'MEJA KERJA CRIMPING');
    el.stok = NQ.ui.el('div', 'stok', kepala);
    var isi = NQ.ui.el('div', 'isi', panel);

    // Kiri: kartu T568B
    var kartu = NQ.ui.el('div', 'kartu-t568b', isi);
    NQ.ui.el('div', 'judul-kartu', kartu, 'T568B');
    T568B.forEach(function (n, i) {
      NQ.ui.el('div', 'baris', kartu, '<span class="no">' + (i + 1) + '</span><span class="garis" style="background:' + gayaKabel(n) + '"></span><span class="nm">' + n + '</span>');
    });

    // Tengah: konektor dan kabel
    var tengah = NQ.ui.el('div', 'tengah', isi);
    NQ.ui.el('div', 'label', tengah, 'Konektor RJ45 (pin 1 di kiri, pengait menghadap bawah)');
    el.slot = NQ.ui.el('div', 'slot-wadah', tengah);
    NQ.ui.el('div', 'label', tengah, 'Kabel (klik untuk memasukkan ke pin berikutnya, klik pin untuk melepas)');
    el.kolam = NQ.ui.el('div', 'kolam', tengah);
    el.status = NQ.ui.el('div', 'status', tengah);

    // Kanan: langkah dan LAN tester
    var kanan = NQ.ui.el('div', 'kanan', isi);
    el.langkah = NQ.ui.el('div', 'langkah', kanan);
    el.tester = NQ.ui.el('canvas', 'kanvas-tester', kanan);
    if (!sudahDaftar) { NQ.ui.daftarModal(NQ.minigame.crimping); sudahDaftar = true; }
  }

  function tombol(induk, label, aktifkan, aksi, kelas) {
    var b = NQ.ui.el('button', 'tombol kecil ' + (kelas || ''), induk, label);
    b.disabled = !aktifkan;
    b.addEventListener('click', function () { if (b.disabled || NQ.kotakDialog.aktif()) return; NQ.audio.efek('menu-pilih'); aksi(); render(); });
    return b;
  }

  function render() {
    el.stok.innerHTML = 'Konektor tersisa: <b>' + (NQ.state.konektor || 0) + '</b>';
    el.slot.innerHTML = '';
    st.slot.forEach(function (n, i) {
      var s = NQ.ui.el('button', 'slot' + (n ? ' isi' : ''), el.slot, '<span class="no">' + (i + 1) + '</span>');
      if (n) { s.style.background = gayaKabel(n); s.title = n; }
      s.addEventListener('click', function () {
        if (!n || st.dicrimp || NQ.kotakDialog.aktif()) return;
        st.slot[i] = null; st.kolam.push(n); render();
      });
    });
    el.kolam.innerHTML = '';
    st.kolam.forEach(function (n, k) {
      var w = NQ.ui.el('button', 'kabel', el.kolam, '<span class="garis" style="background:' + gayaKabel(n) + '"></span><span class="nm">' + n + '</span>');
      w.addEventListener('click', function () {
        if (NQ.kotakDialog.aktif()) return;
        if (!st.dipotong || !st.kupas) { status('Potong ujung kabel dan kupas selubungnya dulu.'); return; }
        var i = st.slot.indexOf(null); if (i < 0) return;
        st.slot[i] = n; st.kolam.splice(k, 1); render();
      });
    });

    el.langkah.innerHTML = '';
    NQ.ui.el('div', 'judul-langkah', el.langkah, 'Langkah');
    tombol(el.langkah, st.gagal ? '1. Potong konektor yang gagal' : '1. Potong ujung kabel yang rusak', !st.dipotong, function () {
      st.dipotong = true; NQ.audio.efek('potong-kabel');
      if (st.gagal) { var stok = NQ.state.konektor; reset(false); st.dipotong = true; }
      status('Ujung kabel sudah rata dipotong.');
    });
    var kupas = NQ.ui.el('div', 'baris-tombol', el.langkah);
    NQ.ui.el('span', 'mini', kupas, '2. Kupas selubung:');
    tombol(kupas, '± 1,5 cm', st.dipotong && !st.kupas, function () { st.kupas = 'pendek'; status('Selubung dikupas sekitar 1,5 cm.'); }, st.kupas === 'pendek' ? 'dipilih' : '');
    tombol(kupas, '± 4 cm', st.dipotong && !st.kupas, function () { st.kupas = 'panjang'; status('Selubung dikupas sekitar 4 cm.'); }, st.kupas === 'panjang' ? 'dipilih' : '');
    NQ.ui.el('div', 'mini', el.langkah, '3. Susun 8 kabel ke pin 1-8');
    tombol(el.langkah, '4. Ratakan dan dorong sampai mentok', st.slot.indexOf(null) < 0 && !st.rata && !st.dicrimp, function () {
      st.rata = true; status('Ujung kabel rata dan menyentuh ujung konektor.');
    }, st.rata ? 'dipilih' : '');
    tombol(el.langkah, '5. Crimp', st.slot.indexOf(null) < 0 && !st.dicrimp, crimp);
    tombol(el.langkah, '6. Uji dengan LAN tester', st.dicrimp && !hasil, uji);
    var bawah = NQ.ui.el('div', 'baris-tombol', el.langkah);
    tombol(bawah, 'Tutup', true, function () { NQ.minigame.crimping.tutup(); });
  }

  function status(t) { el.status.textContent = t || ''; }

  function crimp() {
    if ((NQ.state.konektor || 0) <= 0) {
      cfg.konektorHabis(function () { render(); });
      return;
    }
    NQ.state.konektor -= 1; NQ.simpan.simpan();
    st.dicrimp = true;
    NQ.audio.efek('crimp');
    status('Konektor sudah dijepit. Uji dengan LAN tester.');
  }

  function uji() {
    var benar = st.slot.map(function (n, i) { return n === T568B[i]; });
    var urutOk = benar.every(Boolean);
    hasil = benar.slice();
    if (urutOk && !st.rata) { hasil[6] = false; hasil[7] = false; }
    ujiMulai = performance.now() / 1000;
    var semua = hasil.every(Boolean);
    NQ.audio.efek(semua ? 'lan-tester-ok' : 'lan-tester-salah');
    setTimeout(function () {
      if (!urutOk) {
        var salahPin = [], tukar = null;
        benar.forEach(function (ok, i) { if (!ok) salahPin.push(i); });
        for (var a = 0; a < 8 && !tukar; a++) for (var b2 = a + 1; b2 < 8; b2++)
          if (st.slot[a] === T568B[b2] && st.slot[b2] === T568B[a]) { tukar = [a, b2]; break; }
        var ganti = tukar
          ? { 'Lampu 3 dan 6': 'Lampu ' + (tukar[0] + 1) + ' dan ' + (tukar[1] + 1), 'putih-hijau dan hijau': T568B[tukar[0]] + ' dan ' + T568B[tukar[1]] }
          : { 'Lampu 3 dan 6 tertukar.': 'Lampu ' + salahPin.map(function (x) { return x + 1; }).join(', ') + ' tidak menyala urut.', 'Cek lagi urutan putih-hijau dan hijau.': 'Cocokkan lagi dengan kartu T568B.' };
        gagal('urutan-salah', { ganti: ganti });
      } else if (!st.rata) gagal('tidak-mentok');
      else if (st.kupas === 'panjang') gagal('selubung-tidak-terjepit');
      else { status('Lampu 1 sampai 8 menyala berurutan di kedua unit. Berhasil!'); render(); cfg.saatBerhasil(); }
    }, 2400);
  }

  function gagal(id, opsi) {
    opsi = opsi || {}; opsi.tanpaKonektor = true;
    st.gagal = true; st.dipotong = false;
    status('Konektor ini gagal. Potong dan ulangi dengan konektor baru.');
    render();
    cfg.salah(id, opsi, function () { render(); });
  }

  function gambarTester() {
    var r = NQ.renderer.rasio(), w = 84, h = 68, c = el.tester.getContext('2d');
    if (el.tester.width !== Math.round(w * r)) {
      el.tester.width = Math.round(w * r); el.tester.height = Math.round(h * r);
      el.tester.style.width = (w / 8) + 'em'; el.tester.style.height = (h / 8) + 'em';
    }
    c.setTransform(r, 0, 0, r, 0, 0); c.imageSmoothingEnabled = true;
    c.clearRect(0, 0, w, h);
    NQ.gambarTester(c, 1, 1, hasil, ujiMulai === null ? null : performance.now() / 1000 - ujiMulai);
  }

  NQ.minigame = NQ.minigame || {};
  NQ.minigame.crimping = {
    buka: function (c) {
      cfg = c;
      if (!panel) buat();
      if (!st || hasilSelesai()) reset(true);
      NQ.ui.hapusFokus(panel);
      aktif = true;
      panel.classList.remove('tersembunyi');
      render(); status('Ikuti langkah 1 sampai 6. Lihat kartu T568B di kiri.');
      NQ.input.reset();
    },
    tutup: function () { aktif = false; if (panel) panel.classList.add('tersembunyi'); NQ.input.reset(); },
    aktif: function () { return aktif; },
    perbarui: function () {
      if (!aktif) return;
      gambarTester();
      if (NQ.kartuKonsep.aktif()) return;
      if (NQ.ui.navTombol(panel)) return;   // panah memilih kabel/slot/tombol, E menekan
      if (!NQ.kotakDialog.aktif() && NQ.input.baruDitekan('batal')) this.tutup();
    }
  };
  function hasilSelesai() { return hasil && hasil.every(Boolean) && st.rata && st.kupas === 'pendek'; }
})(window.NQ = window.NQ || {});
