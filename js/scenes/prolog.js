/*
 * Scene 2–3 · Prolog: Kantor Kepala Lab.
 * Alur: Pak Bima menyambut -> ambil Tas di meja -> nyalakan Pingo di rak -> buka Jurnal (J)
 * -> buka Tas (T) dan pilih LAN tester -> tugas berubah ke Kasus 1 -> keluar lewat pintu bawah ke Lorong.
 * Penanda kejadian disimpan di NQ.state.bendera, jadi Lanjutkan memulihkan posisi cerita.
 */
(function (NQ) {
  var K = 'prolog';
  var POS_TAS = { x: 166, dasar: 102 };   // di atas meja, sisi kanan
  function b(n) { return NQ.progres.bendera(n); }

  function tugasSekarang() {
    if (!b('sambutan')) return 'Dengarkan Pak Bima';
    if (!b('tasDiambil')) return 'Ambil Tas Teknisi di meja Pak Bima (E)';
    if (!b('pingoMenyala')) return 'Nyalakan Pingo di rak kecil (E)';
    if (!b('jurnalDibuka') && !b('lanTesterDipilih')) return 'Buka Jurnal (J), lalu buka Tas (T) dan pilih LAN Tester';
    if (!b('jurnalDibuka')) return 'Buka Jurnal Teknisi (J)';
    if (!b('lanTesterDipilih')) return 'Buka Tas (T) dan pilih LAN Tester';
    return 'PC 07 di Lab Komputer 1 tidak bisa internet. Keluar lewat pintu bawah.';
  }
  function pemandu() { return b('pingoMenyala') ? 'pingo' : 'pak-bima'; }

  function cekSelesai(R) {
    if (b('jurnalDibuka') && b('lanTesterDipilih') && !b('tugasKasus1')) {
      R.dialog('pilih-lan-tester', function () { R.tandai('tugasKasus1'); R.tugas(tugasSekarang()); });
    } else R.tugas(tugasSekarang());
  }

  NQ.ruang.buat({
    id: 'prolog', ruangan: 'kantor-kepala-lab', kasus: K,
    musik: 'eksplorasi', ambien: 'dengung-server',

    siapkan: function (R, data) {
      if (data.dari === 'lorong') NQ.pemain.taruh(160, 196, 'atas');
      else if (b('prologSelesai')) NQ.pemain.taruh(160, 196, 'atas');
      var rak = NQ.peta.benda('rak-kecil');
      if (!b('pingoMenyala')) NQ.pingo.taruhMati(rak.x + rak.w / 2, rak.y + 3, rak.dasar + 1);

      R.tambahNPC({ id: 'pak-bima', x: 160, dasar: 100, berdiriY: 26, bicara: function () {
        var teks;
        if (!b('tasDiambil')) teks = 'Tas Teknisi ada di mejaku. Ambil dengan tombol E.';
        else if (!b('pingoMenyala')) teks = 'Nyalakan Pingo di rak kecil itu. Dia akan menemanimu.';
        else if (!b('jurnalDibuka')) teks = 'Coba buka Jurnal Teknisimu dengan tombol J.';
        else if (!b('lanTesterDipilih')) teks = 'Buka Tas dengan tombol T, lalu pilih LAN tester.';
        else teks = 'Ingat: periksa dari bawah ke atas. Kabel dan lampu dulu, baru alamat IP, baru layanan.';
        R.bicara('pak-bima', teks);
      } });

      R.objek({ id: 'tas', x: 184, y: 126, jarak: 22, kilauX: 177, kilauY: 70,
        kotak: { x: POS_TAS.x - 2, y: POS_TAS.dasar - 24, w: 27, h: 26 },
        aktif: function () { return b('sambutan') && !b('tasDiambil'); },
        aksi: function () {
          R.tandai('tasDiambil');
          NQ.progres.beriAlat('lan-tester');
          NQ.audio.efek('tas-dibuka');
          R.dialog('ambil-tas', function () { R.tugas(tugasSekarang()); });
        } });

      R.objek({ id: 'pingo', x: rak.x + rak.w / 2, y: rak.dasar + 10, jarak: 24,
        kilauX: rak.x + rak.w / 2, kilauY: rak.y - 18,
        kotak: { x: rak.x, y: rak.y - 22, w: rak.w, h: 32 },
        aktif: function () { return b('sambutan') && !b('pingoMenyala'); },
        aksi: function () {
          if (!b('tasDiambil')) { R.bicara('raka', 'Robot kecil ini sedang mati. Ambil Tas dulu seperti kata Pak Bima.'); return; }
          NQ.pingo.nyalakan();
          R.tandai('pingoMenyala');
          NQ.audio.efek('pingo-menyala');
          R.dialog('nyalakan-pingo', function () { R.tugas(tugasSekarang()); });
        } });
      R.tugas(tugasSekarang());
    },

    saatMasuk: function (R) {
      if (!b('sambutan')) R.dialog('masuk-kantor', function () { R.tandai('sambutan'); R.tugas(tugasSekarang()); });
    },

    sprite: function (R) {
      if (b('tasDiambil')) return [];
      return [{ dasar: 119, gambar: function (c, ox, oy) {
        var t = NQ.interaksi.terdekat();
        var kilau = (t && t.id === 'tas') || (b('sambutan') && Math.floor(performance.now() / 600) % 2 === 0);
        var info = NQ.data.aset.sheet['tas-teknisi'];
        NQ.aset.frame(c, 'tas-teknisi', kilau ? info.frame.berkilau : info.frame.biasa, 0, ox + POS_TAS.x, oy + POS_TAS.dasar - info.h);
      } }];
    },

    tombol: function (R, aksi) {
      if (aksi === 'tas' && !b('tasDiambil')) { R.bicara(pemandu(), 'Tas Teknisi masih di meja Pak Bima. Ambil dulu, ya.'); return true; }
      if (aksi === 'jurnal') {
        if (!b('tasDiambil')) { R.bicara(pemandu(), 'Jurnal Teknisi ada di dalam Tas. Ambil Tas dulu, ya.'); return true; }
        NQ.jurnal.saatTutup = function () {
          NQ.jurnal.saatTutup = null;
          if (b('pingoMenyala') && !b('jurnalDibuka')) { R.tandai('jurnalDibuka'); R.dialog('buka-jurnal', function () { NQ.kartuKonsep.tampil('lapisan', function () { cekSelesai(R); }); }); }
        };
        NQ.jurnal.buka();
        return true;
      }
      if (aksi === 'peta' && !b('prologSelesai')) { R.bicara(pemandu(), 'Peta sekolah bisa dipakai setelah kamu keluar dari kantor ini.'); return true; }
      if (aksi === 'petunjuk' && !b('tugasKasus1')) { NQ.petunjuk.minta(K, NQ.data.tokoh[pemandu()] && { tokoh: NQ.data.tokoh[pemandu()].nama, potret: NQ.data.tokoh[pemandu()].potret }); return true; }
      return false;
    },

    pakaiAlat: function (R, id) {
      if (id !== 'lan-tester') return false;
      if (!b('pingoMenyala')) { R.bicara('pak-bima', 'LAN tester sudah di tanganmu. Sekarang nyalakan dulu Pingo di rak itu.'); return true; }
      if (!b('lanTesterDipilih')) R.tandai('lanTesterDipilih');
      if (!b('jurnalDibuka')) { R.bicara('pingo', 'LAN tester siap dipakai! Sebelum berangkat, buka Jurnal (J) dulu, ya.'); R.tugas(tugasSekarang()); return true; }
      if (b('tugasKasus1')) { R.bicara('pingo', 'LAN tester siap. Kita pakai di Lab Komputer 1!'); return true; }
      cekSelesai(R);
      return true;
    },

    // Panah penunjuk: tas di meja -> Pingo di rak -> tombol Jurnal -> tombol Tas -> pintu keluar
    tujuan: function () {
      if (!b('sambutan')) return null;
      if (!b('tasDiambil')) return 'tas';
      if (!b('pingoMenyala')) return 'pingo';
      if (!b('jurnalDibuka')) return { tombol: 'jurnal' };
      if (!b('lanTesterDipilih')) return { tombol: 'tas' };
      return b('prologSelesai') ? null : 'keluar';
    },

    bolehKeluar: function () { return b('tugasKasus1'); },
    tolakKeluar: function (R) { R.bicara(pemandu(), 'Tunggu, tugas dari Pak Bima belum selesai: ' + tugasSekarang()); },
    saatKeluar: function (R, lanjut) {
      if (b('prologSelesai')) { lanjut(); return; }
      R.dialog('keluar-kantor', function () {
        R.tandai('prologSelesai');
        if (NQ.state.kasusSelesai.indexOf('prolog') < 0) NQ.state.kasusSelesai.push('prolog');
        NQ.progres.setTahap('kasus-1');
        R.tugas('PC 07 di Lab Komputer 1 tidak bisa internet');
        lanjut();
      });
    }
  });
})(window.NQ = window.NQ || {});
