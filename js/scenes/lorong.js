/*
 * Lorong Utama: penghubung semua ruangan. Pintu di dinding atas, papan nama di atas pintu,
 * gembok kecil untuk ruangan yang belum terbuka, dan tanda seru di pintu tugas aktif.
 * Kak Dimas menunggu di depan Ruang Server saat Kasus 3 dimulai (memberi kartu akses).
 */
(function (NQ) {
  function b(n) { return NQ.progres.bendera(n); }
  function pintuRuang(id) {
    var p = NQ.data.ruangan['lorong-utama'].tata.pintu;
    for (var i = 0; i < p.length; i++) if (p[i].ruang === id) return p[i];
    return null;
  }

  function masukPintu(R, p) {
    var st = NQ.progres.statusRuang(p.ruang), r = NQ.data.ruangan[p.ruang];
    if (st === 'buka') { NQ.audio.efek('pintu-buka'); NQ.scene.ke(NQ.data.sceneRuang[p.ruang], { dari: 'lorong' }); return; }
    if (st === 'butuh-alat') { R.dialog('pintu-terkunci', null, 'kasus-3'); return; }
    if (st === 'terkunci') { R.bicara('pingo', 'Belum ada laporan gangguan dari ' + r.nama + '. Kita selesaikan tugas yang aktif dulu, ya.'); return; }
    R.bicara('pingo', r.nama + ' dibuka pada babak berikutnya. Untuk sekarang, kita kembali ke ruangan yang sudah terbuka.');
  }

  NQ.ruang.buat({
    id: 'lorong', ruangan: 'lorong-utama', musik: 'eksplorasi',

    siapkan: function (R, data) {
      var tata = NQ.peta.tata();
      var asal = data.dari && pintuRuang(data.dari);
      if (asal) NQ.pemain.taruh(asal.x + 19, 66, 'bawah');
      tata.pintu.forEach(function (p) {
        R.objek({ id: 'pintu-' + p.ruang, x: p.x + 19, y: 62, jarak: 20, kilauX: p.x + 19, kilauY: 22,
          kotak: { x: p.x, y: 0, w: 38, h: 50 }, aksi: function () { masukPintu(R, p); } });
      });
      // Kak Dimas di depan Ruang Server (Kasus 3, sebelum kartu akses diberikan)
      var ps = pintuRuang('ruang-server');
      R.tambahNPC({ id: 'kak-dimas', x: ps.x + 60, dasar: 84, padat: false,
        aktif: function () { return NQ.state.tahap === 'kasus-3' && !NQ.progres.punyaAlat('kartu-akses'); },
        bicara: function () {
          R.dialog('bicara-kak-dimas', function () {
            NQ.progres.beriAlat('kartu-akses');
            NQ.audio.efek('ambil-barang');
            NQ.ui.toast('Kartu Akses masuk ke Tas');
            R.tugas('Masuk Ruang Server dengan kartu akses');
          }, 'kasus-3');
        } });
    },

    saatMasuk: function (R, data) {
      if (data.dari === 'kantor-kepala-lab' && !b('lorongPertama')) {
        R.tandai('lorongPertama');
        R.bicara('pingo', ['Ini Lorong Utama. Semua ruangan ada di sini.', 'Pintu bertanda seru kuning adalah tugas kita. Klik pintunya atau tekan M untuk peta.']);
      }
    },

    // Panah ke pintu ruangan tugas aktif (Kak Dimas dulu bila kartu akses belum ada)
    tujuan: function () {
      if (b('tamat')) return null;
      var tahap = NQ.state.tahap;
      if (tahap === 'kasus-3' && !NQ.progres.punyaAlat('kartu-akses')) return 'npc-kak-dimas';
      var info = NQ.progres.infoTahap(), ruang = info && info.ruangan;
      if (ruang === 'gudang') ruang = 'lab-komputer-2';     // gudang dicapai lewat pintu belakang Lab Komputer 2
      return ruang && pintuRuang(ruang) ? 'pintu-' + ruang : null;
    },

    gambarAtas: function (R, ctx) {
      var ox = NQ.kamera.x, oy = NQ.kamera.y;
      var info = NQ.progres.infoTahap(), tujuan = info && info.ruangan;
      NQ.peta.tata().pintu.forEach(function (p) {
        var r = NQ.data.ruangan[p.ruang], st = NQ.progres.statusRuang(p.ruang);
        var x = ox + p.x + 19, y = oy + 3;
        // papan nama
        ctx.font = 'bold 4.2px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        var w = Math.max(30, ctx.measureText(r.nama).width + 6);
        ctx.fillStyle = '#f3e3c3'; ctx.strokeStyle = '#5a3a20'; ctx.lineWidth = 0.6;
        ctx.fillRect(x - w / 2, y, w, 7); ctx.strokeRect(x - w / 2, y, w, 7);
        ctx.fillStyle = '#3a2412'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(r.nama, x, y + 3.8);
        if (st === 'terkunci' || st === 'belum-dibangun' || st === 'butuh-alat') {
          // gembok kecil di daun pintu
          ctx.fillStyle = st === 'butuh-alat' ? '#ff6b6b' : '#c9b06a';
          ctx.fillRect(x - 3, oy + 28, 6, 5);
          ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(x, oy + 28, 2.2, Math.PI, 0); ctx.stroke();
        }
        if (p.ruang === tujuan) {
          var t = Math.sin(performance.now() / 200) * 1.5;
          ctx.fillStyle = '#1a1426'; ctx.beginPath(); ctx.arc(x + 15, oy + 18 + t, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x + 15, oy + 18 + t, 4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#1a1426'; ctx.font = 'bold 7px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; ctx.fillText('!', x + 15, oy + 18.5 + t);
        }
      });
    }
  });
})(window.NQ = window.NQ || {});
