/*
 * Scene 4 · Kasus 1 · Lab Komputer 1: PC 07 tidak bisa internet karena konektor longgar.
 * 6 langkah: Gejala (lihat layar PC 07) -> Dugaan (bandingkan PC lain) -> Uji (LAN tester di belakang CPU)
 * -> Perbaikan (tancapkan konektor sampai klik) -> Verifikasi (lihat layar lagi) -> Catat (otomatis).
 * Salah: mencabut kabel PC lain (energi -1), mengganti kabel sebelum diuji (ditahan Pingo).
 */
(function (NQ) {
  var K = 'kasus-1';
  var MEJA_X = [48, 264], MEJA_DASAR = [128, 196, 264], OFFSET_PC = [20, 49, 79, 108];
  var PC07 = 7;
  var gangguan = {};   // nomor PC -> sisa detik layar silang karena kabelnya dicabut

  function b(n) { return NQ.progres.bendera(n); }
  function nomorPC(r, d, p) { return r * 8 + d * 4 + p + 1; }
  function nama(n) { return 'PC ' + (n < 10 ? '0' : '') + n; }
  function posPC(n) {
    var i = n - 1, r = Math.floor(i / 8), d = Math.floor((i % 8) / 4), p = i % 4;
    return { x: MEJA_X[d] + OFFSET_PC[p], dasar: MEJA_DASAR[r] };
  }

  function tugas(R) {
    if (NQ.progres.sudahSelesai(K)) return;
    if (!R.sudah('Gejala')) R.tugas('Lihat layar PC 07 (baris depan, meja kanan)');
    else if (!R.sudah('Dugaan')) R.tugas('Bandingkan dengan PC lain di sebelahnya');
    else if (!R.sudah('Uji')) R.tugas('Periksa belakang CPU PC 07 dan uji kabelnya');
    else if (!R.sudah('Perbaikan')) R.tugas('Tancapkan konektor PC 07 sampai klik');
    else R.tugas('Lihat lagi layar PC 07');
  }

  // ---------- PC 07 ----------
  // Close-up monitor PC 07 dari aset P17 (dua gambar identik, beda ikon status merah/hijau).
  // Ukuran gambar 200 x 150 logis; game menulis label "KABEL LAN" di bilah judul jendela.
  var MONITOR = { w: 180, h: 135 };
  function gambarMonitorPC(ctx, tersambung, t) {
    ctx.clearRect(0, 0, MONITOR.w, MONITOR.h);
    NQ.aset.utuh(ctx, tersambung ? 'layar-pc07-tersambung' : 'layar-pc07-putus', 0, 0, MONITOR.w, MONITOR.h);
    // label di bilah judul jendela (sebelah kanan garis-garis biru)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 4.6px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('KABEL LAN', MONITOR.w * 0.41, MONITOR.h * 0.228);
    // lencana status berdenyut agar perhatian siswa tertuju ke sana
    var p = 0.5 + Math.sin((t || 0) * 5) * 0.5;
    ctx.strokeStyle = tersambung ? 'rgba(94,224,94,' + (0.35 + p * 0.5) + ')' : 'rgba(255,90,90,' + (0.35 + p * 0.5) + ')';
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.arc(MONITOR.w * 0.585, MONITOR.h * 0.498, 9 + p * 1.5, 0, Math.PI * 2); ctx.stroke();
  }

  function lihatPC07(R) {
    var tuntas = NQ.progres.sudahSelesai(K);
    var tersambung = tuntas || R.sudah('Perbaikan');

    function catatGejala() {
      NQ.dekat.tutup();
      R.dialog('periksa-monitor-pc07', function () {
        R.jurnal('Gejala', 'PC 07 tidak bisa internet; ikon jaringan silang merah. PC lain normal.');
        tugas(R);
      });
    }

    function verifikasi() {
      NQ.dekat.tutup();
      R.dialog('monitor-normal', function () {
        R.jurnal('Verifikasi', 'Ikon jaringan PC 07 normal; internet tersambung.');
        R.dialog('verifikasi-berhasil', function () {
          R.jurnal('Catat', 'Penyebab: konektor RJ45 di CPU PC 07 longgar. Solusi: kabel diuji dengan LAN tester (sehat), konektor ditancapkan sampai klik. Pencegahan: periksa konektor terkunci saat merapikan meja.');
          R.dialog('kasus-selesai', function () {
            NQ.kasus.selesai(K, {
              inti: 'Periksa yang paling sederhana dulu: konektor terkunci, lampu link di NIC dan port switch, serta ikon jaringan di sistem operasi.',
              berikut: 'kasus-2', tugas: 'Pak Hasan di Ruang Guru melapor internetnya mati'
            });
          });
        });
      });
    }

    NQ.dekat.buka({
      judul: 'LAYAR PC 07 · ' + (tersambung ? 'TERSAMBUNG' : 'JARINGAN TERPUTUS'),
      w: MONITOR.w, h: MONITOR.h,
      gambar: function (ctx, t) { gambarMonitorPC(ctx, tersambung, t); },
      keterangan: function () {
        if (tuntas) return 'PC 07 sudah tersambung kembali.';
        if (tersambung) return 'Ikon jaringan kembali normal. Periksa apakah koneksi internet sudah pulih.';
        return 'Ikon silang merah menandakan PC belum terhubung. Ini gejala; penyebabnya perlu diperiksa.';
      },
      opsi: function () {
        if (tuntas) return [];
        if (tersambung) return [{ label: 'Verifikasi koneksi', nonaktif: R.sudah('Verifikasi'), aksi: verifikasi }];
        return [{ label: 'Catat gejala', nonaktif: R.sudah('Gejala'), aksi: catatGejala }];
      }
    });
  }

  // Layar PC lain memakai monitor P17 yang sama: ikon hijau bila normal, merah bila kabelnya baru dicabut.
  // Membandingkan dengan PC 07 (setelah Gejala) mencatat Dugaan: masalahnya lokal di PC 07.
  function lihatPCLain(R, n) {
    var tersambung = !gangguan[n];
    function bandingkan() {
      NQ.dekat.tutup();
      R.dialog('periksa-pc-normal', function () {
        R.jurnal('Dugaan', 'Masalah hanya di PC 07 (lokal), bukan seluruh lab. Kemungkinan kabel atau konektor PC 07.');
        tugas(R);
      });
    }
    NQ.dekat.buka({
      judul: 'LAYAR ' + nama(n) + ' · ' + (tersambung ? 'TERSAMBUNG' : 'JARINGAN TERPUTUS'),
      w: MONITOR.w, h: MONITOR.h,
      gambar: function (ctx, t) { gambarMonitorPC(ctx, tersambung, t); },
      keterangan: function () {
        if (!tersambung) return 'Ikon merah karena kabel LAN ' + nama(n) + ' baru saja dicabut. Jangan mengganggu PC yang sedang dipakai siswa.';
        if (!R.sudah('Gejala')) return nama(n) + ' tersambung normal. Lihat dulu layar PC 07 yang dilaporkan rusak.';
        if (R.sudah('Dugaan')) return nama(n) + ' tersambung normal. Fokus pada PC 07.';
        return nama(n) + ' tersambung normal, padahal berada di lab dan jaringan yang sama dengan PC 07. Apa artinya?';
      },
      opsi: function () {
        if (!tersambung || !R.sudah('Gejala') || R.sudah('Dugaan')) return [];
        return [{ label: 'Bandingkan dengan PC 07', aksi: bandingkan }];
      }
    });
  }

  function cabutPCLain(R, n) {
    gangguan[n] = 3;
    var pos = posPC(n);
    NQ.audio.efek('bip-error');
    R.animasi(3, pos.dasar + 10, function (c, ox, oy, t) {
      NQ.aset.utuh(c, 'siswa-kesal', ox + pos.x + 6, oy + pos.dasar + 10 - NQ.aset.tinggi('siswa-kesal'));
    });
    R.salah('cabut-pc-lain', { ganti: { 'PC itu': nama(n) } });
  }

  // ---------- Tampak dekat: belakang CPU PC 07 ----------
  var ujiMulai = null;
  function bukaCPU(R) {
    if (!b('k1.kolong')) {
      NQ.pemain.pose('merunduk', 1.2);
      R.tandai('k1.kolong');
      R.dialog('merunduk-kolong-meja', function () { bukaCPU(R); });
      return;
    }
    NQ.pemain.pose('merunduk', 0.8);
    ujiMulai = R.sudah('Uji') ? 0 : null;
    NQ.dekat.buka({
      judul: 'BELAKANG CPU · PC 07', w: 240, h: 100,
      gambar: function (c, t) {
        c.fillStyle = '#1b2240'; c.fillRect(0, 0, 240, 100);
        var nyala = R.sudah('Perbaikan');
        NQ.aset.utuh(c, nyala ? 'cpu-belakang-nyala' : 'cpu-belakang-mati', 6, 10);
        NQ.aset.utuh(c, nyala ? 'konektor-rapat' : 'konektor-setengah', 100, 22);
        c.font = '5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.fillStyle = '#ffd23f'; c.textAlign = 'left'; c.textBaseline = 'top';
        c.fillText(nyala ? 'NIC: hijau' : 'NIC: mati', 52, 92);
        c.fillText(nyala ? 'Konektor: terkunci' : 'Konektor: longgar', 100, 72);
        if (ujiMulai !== null) {
          var tt = ujiMulai === 0 ? t : performance.now() / 1000 - ujiMulai;
          NQ.gambarTester(c, 156, 17, [true, true, true, true, true, true, true, true], tt);
        }
      },
      keterangan: function () {
        if (R.sudah('Perbaikan')) return 'Konektor masuk sampai klik. Lampu NIC menyala hijau.';
        if (R.sudah('Uji')) return 'LAN tester: lampu 1 sampai 8 menyala berurutan. Kabel sehat.';
        return 'Konektor RJ45 tidak terkunci dan lampu NIC mati. Apakah kabelnya sendiri sehat?';
      },
      opsi: function () {
        return [
          { label: 'Uji kabel dengan LAN tester', nonaktif: R.sudah('Uji'), aksi: function () { ujiKabel(R); } },
          { label: 'Tancapkan konektor sampai klik', nonaktif: R.sudah('Perbaikan'), aksi: function () { tancap(R); } },
          { label: 'Ganti dengan kabel baru', nonaktif: R.sudah('Perbaikan'), aksi: function () {
            if (!R.sudah('Uji')) R.salah('ganti-tanpa-uji'); else R.dialog('kabel-sehat');
          } }
        ];
      }
    });
  }

  function ujiKabel(R) {
    if (!NQ.progres.punyaAlat('lan-tester')) { R.bicara('pingo', 'Kita butuh LAN tester dari Tas.'); return; }
    if (!R.sudah('Gejala')) { R.dialog('gejala-dulu'); return; }
    if (!R.sudah('Dugaan')) { R.dialog('dugaan-dulu'); return; }
    if (R.sudah('Uji')) return;
    NQ.pemain.pose('pakaiAlat', 2.4);
    NQ.audio.efek('lan-tester-ok');
    ujiMulai = performance.now() / 1000;
    setTimeout(function () {
      R.dialog('lan-tester-ok', function () {
        R.jurnal('Uji', 'LAN tester: lampu 1-8 menyala berurutan, kabel sehat. Konektor tidak terkunci, lampu NIC mati.');
        tugas(R);
        NQ.dekat.segarkan();
        NQ.kartuKonsep.tampil('k1-konektor');
      });
    }, 2300);
  }

  function tancap(R) {
    if (!R.sudah('Uji')) { R.tahanUji(); return; }
    NQ.audio.efek('klik-konektor');
    R.jurnal('Perbaikan', 'Konektor RJ45 ditancapkan ke port LAN sampai berbunyi klik; lampu NIC hijau.');
    tugas(R);
    R.dialog('konektor-klik', function () { NQ.dekat.segarkan(); });
  }

  NQ.ruang.buat({
    id: 'kasus-1', ruangan: 'lab-komputer-1', kasus: K, musik: 'eksplorasi',

    siapkan: function (R) {
      gangguan = {};
      for (var r = 0; r < 3; r++) for (var d = 0; d < 2; d++) for (var p = 0; p < 4; p++) (function (n) {
        var pos = posPC(n);
        R.objek({
          id: 'pc-' + n, x: pos.x, y: pos.dasar + 8, jarak: 16, kilauX: pos.x, kilauY: pos.dasar - 60,
          kotak: { x: pos.x - 11, y: pos.dasar - 56, w: 22, h: 26 },
          aksi: function () {
            if (n === PC07) {
              NQ.menu.pilihan('PC 07', 'Apa yang ingin kamu periksa?', [
                { label: 'Lihat layar PC 07', aksi: function () { lihatPC07(R); } },
                { label: 'Periksa belakang CPU (merunduk)', aksi: function () { bukaCPU(R); } }
              ]);
            } else {
              NQ.menu.pilihan(nama(n), 'Komputer ini dipakai siswa.', [
                { label: 'Lihat layar ' + nama(n), aksi: function () { lihatPCLain(R, n); } },
                { label: 'Cabut kabel LAN ' + nama(n), aksi: function () { cabutPCLain(R, n); } }
              ]);
            }
          },
          alat: n === PC07 ? { 'lan-tester': function () { bukaCPU(R); setTimeout(function () { if (NQ.dekat.aktif()) ujiKabel(R); }, 50); } } : null
        });
      })(nomorPC(r, d, p));

      R.tambahNPC({ id: 'bu-wati', x: 176, dasar: 300, bicara: function () {
        if (NQ.progres.sudahSelesai(K)) R.bicara('bu-wati', 'Terima kasih, Raka. Lab sudah normal lagi.');
        else R.bicara('bu-wati', 'PC 07 ada di baris depan, meja kanan, komputer ketiga.');
      } });
      tugas(R);
    },

    saatMasuk: function (R) {
      if (!b('k1.mulai') && !NQ.progres.sudahSelesai(K)) { R.tandai('k1.mulai'); R.dialog('bicara-bu-wati', function () { tugas(R); }); }
    },

    perbarui: function (R, dt) {
      for (var n in gangguan) { gangguan[n] -= dt; if (gangguan[n] <= 0) delete gangguan[n]; }
    },

    // Panah: PC 07 -> PC 06 di sebelahnya (pembanding) -> PC 07 lagi (belakang CPU, lalu layar)
    tujuan: function (R) {
      if (NQ.progres.sudahSelesai(K)) return undefined;
      if (R.sudah('Gejala') && !R.sudah('Dugaan')) return 'pc-6';
      return 'pc-' + PC07;
    },

    sprite: function (R) {
      var daftar = [];
      var selesai07 = R.sudah('Perbaikan');
      // Layar PC: PC 07 bersilang sampai diperbaiki; PC yang kabelnya dicabut bersilang sebentar
      var silang = Object.keys(gangguan).map(Number);
      if (!selesai07) silang.push(PC07);
      silang.forEach(function (n) {
        var pos = posPC(n);
        daftar.push({ dasar: pos.dasar + 0.5, gambar: function (c, ox, oy) {
          NQ.aset.frame(c, 'monitor', 1, 0, ox + pos.x - 9, oy + pos.dasar - 56);
        } });
      });
      var p7 = posPC(PC07);
      daftar.push({ dasar: 1000, gambar: function (c, ox, oy) {
        var x = ox + p7.x + 18, y = oy + p7.dasar - 62;
        c.fillStyle = '#ffd23f'; c.strokeStyle = '#1a1426'; c.lineWidth = 0.6;
        c.fillRect(x - 9, y, 18, 7); c.strokeRect(x - 9, y, 18, 7);
        c.fillStyle = '#1a1426'; c.font = 'bold 4.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('PC 07', x, y + 3.8);
      } });
      return daftar;
    }
  });
})(window.NQ = window.NQ || {});
