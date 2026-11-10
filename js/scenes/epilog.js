/*
 * Scene 13 · Epilog · Ruang Kepala Sekolah: laporan teknisi, rekomendasi, dan sertifikat.
 * Alur: Raka berjalan ke meja Ibu Kepala Sekolah -> Laporan Teknisi (bintang tiap kasus dari Jurnal)
 * -> pilih rekomendasi pencegahan -> sertifikat Teknisi Jaringan Muda -> ucapan terima kasih semua pelapor
 * -> layar akhir (sertifikat + laporan, Cetak/PDF, Main Lagi).
 * Setelah tamat, ruangan tetap bisa dikunjungi: bicara dengan Ibu Kepala Sekolah membuka layar akhir lagi.
 */
(function (NQ) {
  var K = 'epilog';
  var BARIS = 196;
  var NPC = [
    { id: 'pak-bima', x: 40 }, { id: 'kak-dimas', x: 76 }, { id: 'bu-wati', x: 112 }, { id: 'pak-hasan', x: 148 },
    { id: 'bu-rina', x: 236 }, { id: 'pak-joko', x: 272 }, { id: 'pak-hendra', x: 308 }, { id: 'rara', x: 344 }
  ];
  var konfeti = [], tepuk = 0;

  function b(n) { return NQ.progres.bendera(n); }
  function tamat() { return NQ.progres.sudahSelesai(K); }

  // Ucapan tiap tokoh diambil dari baris 'sertifikat' di data/dialog.js
  function ucapan(id) {
    var t = NQ.data.tokoh[id], d = NQ.data.dialog.epilog;
    for (var i = 0; i < d.length; i++) if (d[i].tokoh === t.nama && (d[i].pemicu === 'sertifikat' || d[i].pemicu === 'laporan-tersusun' || d[i].pemicu === 'pilih-rekomendasi')) return d[i].teks;
    return 'Selamat, Raka!';
  }

  function hujanKonfeti() {
    var warna = ['#ffd23f', '#ff6b6b', '#5ee05e', '#4fa8ff', '#c56bff', '#ffffff'];
    for (var i = 0; i < 90; i++) konfeti.push({ x: Math.random() * 384, y: -Math.random() * 120, vy: 25 + Math.random() * 35,
      vx: (Math.random() - 0.5) * 20, w: warna[i % warna.length], r: Math.random() * 6 });
  }

  function layarAkhir(R) {
    NQ.minigame.laporan.buka({
      mode: 'akhir',
      lanjut: function () { R.tugas('Tamat! Main lagi untuk mengejar 3 bintang di semua kasus'); },
      mainLagi: function () { NQ.scene.ke('judul'); }
    });
  }

  function selesaikan(R) {
    var s = NQ.state;
    if (s.kasusSelesai.indexOf(K) < 0) s.kasusSelesai.push(K);
    R.tandai('tamat');
    s.tugas = 'Tamat! Main lagi untuk mengejar 3 bintang di semua kasus';
    NQ.simpan.simpan(); NQ.hud.segarkan();
  }

  function mulai(R) {
    if (R.sibuk) return;
    R.sibuk = true;
    NQ.pemain.hadap('atas');
    R.dialog('epilog-mulai', function () {
      R.dialog('laporan-buka', function () {
        R.sibuk = false;
        NQ.minigame.laporan.buka({ mode: 'tinjau', lanjut: function () {
          R.dialog('laporan-tersusun', function () {
            R.dialog('pilih-rekomendasi', function () {
              NQ.minigame.laporan.buka({ mode: 'rekomendasi', lanjut: function () {
                R.dialog('serahkan-sertifikat', function () {
                  NQ.pemain.pose('senang', 2.5);
                  NQ.minigame.laporan.sertifikat({ lanjut: function () {
                    selesaikan(R);
                    NQ.audio.efek('tepuk-tangan'); tepuk = 3; hujanKonfeti();
                    NQ.pemain.pose('senang', 3);
                    R.dialog('sertifikat', function () {
                      R.dialog('penutup', function () { layarAkhir(R); });
                    });
                  } });
                });
              } });
            });
          });
        } });
      });
    });
  }

  NQ.ruang.buat({
    id: 'epilog', ruangan: 'ruang-kepsek', kasus: K, musik: 'kemenangan',

    siapkan: function (R) {
      konfeti = []; tepuk = 0;
      R.tambahNPC({ id: 'ibu-kepsek', x: 132, dasar: 112, bicara: function () {
        if (tamat()) R.dialog('sudah-tamat', function () { layarAkhir(R); });
        else mulai(R);
      } });
      NPC.forEach(function (n) {
        R.tambahNPC({ id: n.id, x: n.x, dasar: BARIS, bicara: function () { R.bicara(n.id, ucapan(n.id)); } });
      });
      R.tugas(tamat() ? 'Tamat! Main lagi untuk mengejar 3 bintang di semua kasus' : 'Serahkan laporan teknisi kepada Ibu Kepala Sekolah');
    },

    saatMasuk: function (R) {
      if (tamat()) return;
      // Raka berjalan sendiri ke depan meja Ibu Kepala Sekolah
      NQ.pemain.jalanKe(176, 140, function () { mulai(R); });
    },

    perbarui: function (R, dt) {
      if (tepuk > 0) tepuk = Math.max(0, tepuk - dt);
      konfeti.forEach(function (k) { k.y += k.vy * dt; k.x += k.vx * dt; k.r += dt * 5; });
      konfeti = konfeti.filter(function (k) { return k.y < 250; });
    },

    pindai: function (R) {
      NQ.audio.efek('pindai-gelombang'); NQ.pingo.setMode('pindai');
      R.setelah(3, function () { NQ.pingo.setMode('melayang'); });
      R.bicara('pingo', 'Semua sinyal bersih dan bersandi. Tidak ada jejak Glitch lagi!');
      return true;
    },

    // Panah ke Ibu Kepala Sekolah selama laporan belum diserahkan
    tujuan: function () { return tamat() ? null : 'npc-ibu-kepsek'; },

    bolehKeluar: function () { return true; },

    sprite: function (R) {
      // tokoh melompat kecil saat tepuk tangan
      return [];
    },

    gambarAtas: function (R, c) {
      var ox = NQ.kamera.x, oy = NQ.kamera.y;
      // tulisan papan visi-misi
      c.fillStyle = '#5a3a20'; c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
      c.fillText('VISI', ox + 192, oy + 9);
      c.font = '4px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillStyle = '#3a2412';
      c.fillText('Lulusan kompeten, jujur,', ox + 192, oy + 18);
      c.fillText('dan siap kerja di era digital', ox + 192, oy + 23);
      c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillStyle = '#5a3a20'; c.fillText('MISI', ox + 192, oy + 31);
      // konfeti
      konfeti.forEach(function (k) {
        c.save(); c.translate(ox + k.x, oy + k.y); c.rotate(k.r); c.fillStyle = k.w; c.fillRect(-1.5, -0.8, 3, 1.6); c.restore();
      });
      if (tepuk > 0) {
        var t = performance.now() / 120;
        NPC.forEach(function (n, i) {
          if (Math.floor(t + i) % 2) return;
          c.fillStyle = '#ffd23f'; c.font = 'bold 6px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center';
          c.fillText('*', ox + n.x + 9, oy + BARIS - 50);
        });
      }
    }
  });
})(window.NQ = window.NQ || {});
