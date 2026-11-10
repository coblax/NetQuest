/*
 * Peta sekolah (tombol M): gambar G2 dengan nama ruangan, penanda tugas aktif (!),
 * posisi pemain, dan ruangan terkunci. Klik ruangan yang terbuka untuk langsung pergi ke sana.
 */
(function (NQ) {
  var panel, wadah, statusEl, aktif = false, sudahDaftar = false;

  function buat() {
    panel = NQ.ui.el('div', 'panel peta-sekolah tersembunyi');
    NQ.ui.el('h2', '', panel, 'PETA SEKOLAH');
    wadah = NQ.ui.el('div', 'peta-gambar', panel);
    statusEl = NQ.ui.el('div', 'kaki', panel);
    var b = NQ.ui.el('button', 'tombol kecil', panel, 'Tutup (M)');
    b.addEventListener('click', function () { NQ.petaSekolah.tutup(); });
    if (!sudahDaftar) { NQ.ui.daftarModal(NQ.petaSekolah); sudahDaftar = true; }
  }

  function render() {
    wadah.innerHTML = '<img src="' + NQ.data.aset.gambar['g2-peta'] + '" alt="Peta sekolah">';
    var info = NQ.progres.infoTahap(), tujuan = info && info.ruangan;
    var sini = NQ.ruang && NQ.ruang.idRuang ? NQ.ruang.idRuang() : '';
    Object.keys(NQ.data.posisiPeta).forEach(function (id) {
      var pos = NQ.data.posisiPeta[id], r = NQ.data.ruangan[id], st = NQ.progres.statusRuang(id);
      var el = NQ.ui.el('button', 'label-ruang ' + st + (id === 'gudang' ? ' gelap' : ''), wadah);
      el.style.left = pos.x + '%'; el.style.top = pos.y + '%';
      var html = NQ.ui.esc(r.nama);
      if (st === 'terkunci' || st === 'belum-dibangun') html = '&#128274; ' + html;
      if (id === tujuan) html = '<span class="seru">!</span> ' + html;
      if (id === sini) html += '<span class="sini">kamu di sini</span>';
      el.innerHTML = html;
      el.addEventListener('click', function () { pergi(id); });
    });
    statusEl.textContent = info ? ('Tugas: ' + (NQ.state.tugas || info.tugas)) : '';
  }

  function pergi(id) {
    var st = NQ.progres.statusRuang(id), r = NQ.data.ruangan[id];
    if (st === 'buka') {
      NQ.petaSekolah.tutup();
      if (NQ.ruang.idRuang() !== id) NQ.scene.ke(NQ.data.sceneRuang[id], { dari: 'lorong' });
      return;
    }
    if (st === 'butuh-alat') statusEl.textContent = r.nama + ': pintunya butuh ' + NQ.data.alat[r.butuhAlat].nama + '. Cari di Lorong Utama.';
    else if (st === 'terkunci') statusEl.textContent = r.nama + ': belum ada laporan gangguan dari ruangan ini.';
    else statusEl.textContent = r.nama + ': ruangan ini dibuka pada babak berikutnya.';
  }

  NQ.petaSekolah = {
    buka: function () {
      if (!panel) buat();
      NQ.ui.hapusFokus(panel);
      render();
      aktif = true;
      panel.classList.remove('tersembunyi');
      NQ.audio.efek('kertas');
      NQ.input.reset();
    },
    tutup: function () {
      aktif = false;
      if (panel) panel.classList.add('tersembunyi');
      NQ.input.reset();
    },
    aktif: function () { return aktif; },
    perbarui: function () {
      if (!aktif || NQ.kotakDialog.aktif()) return;
      if (NQ.ui.navTombol(panel)) return;   // panah memilih ruangan, E pergi ke sana
      if (NQ.input.baruDitekan('peta') || NQ.input.baruDitekan('batal')) this.tutup();
    }
  };
})(window.NQ = window.NQ || {});
