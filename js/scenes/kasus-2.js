/*
 * Scene 5 · Kasus 2 · Ruang Guru: kabel LAN Pak Hasan digigit tikus.
 * 6 langkah: Gejala dan Dugaan (periksa kabel) -> Uji (LAN tester: pin 1, 2, 3, 6 mati)
 * -> Perbaikan (meja crimping, urutan T568B) -> Verifikasi (LAN tester 1-8 urut, internet kembali) -> Catat.
 * Salah: urutan kabel, kabel tidak mentok, selubung tidak terjepit (konektor berkurang); konektor habis (bintang -1).
 */
(function (NQ) {
  var K = 'kasus-2';
  var KABEL = { x: 296, y: 146 };
  var RUSAK = [false, false, false, true, true, false, true, true];

  function b(n) { return NQ.progres.bendera(n); }

  function tugas(R) {
    if (NQ.progres.sudahSelesai(K)) return;
    if (!R.sudah('Gejala')) R.tugas('Periksa kabel di meja Pak Hasan');
    else if (!R.sudah('Uji')) R.tugas('Uji kabel Pak Hasan dengan LAN tester');
    else if (!NQ.progres.punyaAlat('crimping-tool')) R.tugas('Ambil alat di kotak alat (meja kerja kiri bawah)');
    else if (!R.sudah('Perbaikan')) R.tugas('Pasang konektor baru di meja kerja crimping (T568B)');
    else R.tugas('Pastikan internet Pak Hasan kembali');
  }

  function periksaKabel(R) {
    if (R.sudah('Perbaikan')) { R.bicara('pingo', 'Kabel Pak Hasan sudah memakai konektor baru.'); return; }
    R.dialog('periksa-kabel-digigit', function () {
      R.jurnal('Gejala', 'Internet Pak Hasan mati setelah ada tikus lewat; ujung kabel LAN terlihat bekas gigitan.');
      R.jurnal('Dugaan', 'Jalur kabel putus di ujung yang digigit, dekat konektor.');
      tugas(R);
    });
  }

  function ujiKabel(R) {
    if (!R.sudah('Gejala')) { R.bicara('pingo', 'Periksa dulu kabelnya, lalu catat gejalanya.'); return; }
    var mulai = R.sudah('Uji') ? null : performance.now() / 1000;
    NQ.pemain.pose('pakaiAlat', 2.4);
    NQ.dekat.buka({
      judul: 'LAN TESTER · KABEL PAK HASAN', w: 150, h: 80,
      gambar: function (c, t) {
        c.fillStyle = '#1b2240'; c.fillRect(0, 0, 150, 80);
        NQ.aset.utuh(c, 'kabel-digigit', 4, 30, 36, 30);
        NQ.gambarTester(c, 48, 7, RUSAK, mulai === null ? t : performance.now() / 1000 - mulai);
      },
      keterangan: function () { return 'Unit kiri = induk, unit kanan = remote. Lampu remote yang mati menunjukkan jalur yang putus.'; }
    });
    if (R.sudah('Uji')) return;
    NQ.audio.efek('lan-tester-salah');
    setTimeout(function () {
      R.dialog('uji-kabel-digigit', function () {
        R.jurnal('Uji', 'LAN tester: lampu remote pin 1, 2, 3, dan 6 tidak menyala. Jalur putus di ujung kabel.');
        tugas(R);
        NQ.kartuKonsep.tampil('k2-crimping');
      });
    }, 2600);
  }

  function ambilAlat(R) {
    if (NQ.progres.punyaAlat('crimping-tool')) { R.bicara('pingo', 'Tang crimping dan konektor sudah ada di Tas.'); return; }
    R.dialog('dekati-kotak-alat', function () {
      NQ.progres.beriAlat('crimping-tool');
      NQ.progres.beriAlat('konektor-rj45');
      NQ.state.konektor = NQ.data.alat['konektor-rj45'].jumlah || 3;
      NQ.simpan.simpan();
      NQ.audio.efek('ambil-barang');
      NQ.ui.toast('Crimping Tool dan 3 Konektor RJ45 masuk ke Tas');
      tugas(R);
    });
  }

  function mejaCrimping(R) {
    if (R.sudah('Perbaikan')) { R.bicara('pingo', 'Kabelnya sudah selesai di-crimp.'); return; }
    if (!NQ.progres.punyaAlat('crimping-tool')) { R.dialog('alat-dulu'); return; }
    if (!R.sudah('Uji')) { R.tahanUji(); return; }
    var buka = function () {
      NQ.minigame.crimping.buka({
        salah: function (id, opsi, selesai) { R.salah(id, opsi, selesai); },
        konektorHabis: function (selesai) { R.salah('konektor-habis', {}, selesai); },
        saatBerhasil: function () {
          setTimeout(function () {
            NQ.minigame.crimping.tutup();
            R.dialog('lan-tester-ok', function () {
              R.jurnal('Perbaikan', 'Ujung rusak dipotong, 8 kabel disusun T568B, didorong sampai mentok, lalu di-crimp.');
              R.dialog('pasang-kabel', function () {
                R.jurnal('Verifikasi', 'LAN tester: lampu 1-8 menyala berurutan; internet Pak Hasan kembali.');
                R.dialog('verifikasi-berhasil', function () {
                  R.jurnal('Catat', 'Penyebab: kabel digigit tikus sehingga pin 1, 2, 3, 6 putus. Solusi: crimp ulang dengan konektor baru standar T568B. Pencegahan: pasang pelindung kabel.');
                  NQ.kasus.selesai(K, {
                    inti: 'Urutan T568B: putih-oranye, oranye, putih-hijau, biru, putih-biru, hijau, putih-cokelat, cokelat. Kabel straight memakai standar yang sama di kedua ujung.',
                    berikut: 'kasus-3', tugas: 'Kak Dimas menunggu di depan Ruang Server'
                  });
                });
              });
            });
          }, 1800);
        }
      });
    };
    if (!b('k2.mejaDibuka')) { R.tandai('k2.mejaDibuka'); R.dialog('buka-meja-crimping', buka); }
    else buka();
  }

  NQ.ruang.buat({
    id: 'kasus-2', ruangan: 'ruang-guru', kasus: K, musik: 'eksplorasi',

    siapkan: function (R) {
      R.tambahNPC({ id: 'pak-hasan', x: 360, dasar: 170, bicara: function () {
        if (NQ.progres.sudahSelesai(K)) R.bicara('pak-hasan', 'Internet saya lancar lagi. Terima kasih, Raka!');
        else if (!R.sudah('Uji')) R.bicara('pak-hasan', 'Kabelnya ada di meja saya. Coba periksa.');
        else R.bicara('pak-hasan', 'Alat crimping ada di kotak alat di meja kerja kiri bawah.');
      } });
      R.objek({ id: 'kabel', x: 308, y: 184, jarak: 18, kilauX: KABEL.x + 10, kilauY: KABEL.y - 8,
        kotak: { x: KABEL.x - 4, y: KABEL.y - 4, w: 28, h: 24 },
        aksi: function () {
          NQ.menu.pilihan('Kabel LAN Pak Hasan', 'Ujung kabelnya tampak bekas gigitan.', [
            { label: 'Periksa kabel', aksi: function () { periksaKabel(R); } },
            { label: 'Uji dengan LAN tester', aksi: function () { ujiKabel(R); } }
          ]);
        },
        alat: { 'lan-tester': function () { ujiKabel(R); } } });
      R.objek({ id: 'kotak-alat', x: 40, y: 246, jarak: 18, kilauX: 35, kilauY: 186,
        kotak: { x: 20, y: 190, w: 30, h: 22 }, aksi: function () { ambilAlat(R); } });
      R.objek({ id: 'meja-crimping', x: 96, y: 246, jarak: 18, kilauX: 96, kilauY: 186,
        kotak: { x: 56, y: 194, w: 70, h: 40 }, aksi: function () { mejaCrimping(R); },
        alat: { 'crimping-tool': function () { mejaCrimping(R); }, 'konektor-rj45': function () { mejaCrimping(R); } } });
      tugas(R);
    },

    saatMasuk: function (R) {
      if (b('k2.mulai') || NQ.progres.sudahSelesai(K)) return;
      R.tandai('k2.mulai');
      R.sibuk = true;
      NQ.audio.efek('cicit-tikus');
      R.animasi(1.2, 200, function (c, ox, oy, t) {
        var x = 300 + (344 - 300) * t, y = 150 + (48 - 150) * t;
        NQ.aset.frame(c, 'tikus', Math.floor(t * 10) % 2, 0, ox + x - 8, oy + y - 10);
      }, function () {
        R.sibuk = false;
        R.dialog('bicara-pak-hasan', function () { tugas(R); });
      });
    },

    // Panah: kabel di meja Pak Hasan -> kotak alat -> meja kerja crimping
    tujuan: function (R) {
      if (NQ.progres.sudahSelesai(K)) return undefined;
      if (!R.sudah('Gejala') || !R.sudah('Uji')) return 'kabel';
      if (!NQ.progres.punyaAlat('crimping-tool')) return 'kotak-alat';
      return 'meja-crimping';
    },

    sprite: function (R) {
      var d = [];
      if (!R.sudah('Perbaikan')) d.push({ dasar: 173, gambar: function (c, ox, oy) { NQ.aset.utuh(c, 'kabel-digigit', ox + KABEL.x, oy + KABEL.y); } });
      if (!NQ.progres.punyaAlat('crimping-tool')) d.push({ dasar: 237, gambar: function (c, ox, oy) { NQ.aset.utuh(c, 'kotak-alat', ox + 24, oy + 196); } });
      return d;
    }
  });
})(window.NQ = window.NQ || {});
