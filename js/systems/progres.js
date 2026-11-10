/*
 * Status permainan (NQ.state): siapa pemainnya, tahap cerita, alat yang dimiliki, keping,
 * energi, bintang, petunjuk yang dipakai, isi Jurnal, dan tugas aktif.
 * Status ini yang disimpan oleh js/core/simpan.js.
 */
(function (NQ) {
  function statusBaru(nama, kelas) {
    return {
      versi: 1,
      nama: nama || '',
      kelas: kelas || '',
      tahap: 'prolog',          // id tahap di data/kasus.js
      kasusSelesai: [],
      bendera: {},              // penanda kejadian cerita, misalnya tasDiambil
      alat: [],                 // id alat di data/alat.js
      keping: 0,
      energi: NQ.config.energiMaks,
      bintang: {},              // { 'kasus-1': 3, ... }
      petunjuk: {},             // { 'kasus-1': 2 } = tingkat petunjuk yang sudah dibuka
      salah: {},                // { 'kasus-1': 1 } = jumlah kesalahan
      jurnal: {},               // { 'kasus-1': { Gejala: '...', ... } }
      konektor: 0,              // stok konektor RJ45 (Kasus 2)
      potongBintang: {},        // pengurangan bintang khusus, misalnya konektor cadangan
      konsep: {},               // Kartu Konsep: { id: { benarPertama, percobaan, selesai } } untuk laporan guru
      konsepSalah: {},          // kartu "Kenapa Salah?" yang sudah ditampilkan
      tugas: '',
      pengaturan: { musik: true, efek: true }
    };
  }

  NQ.state = statusBaru();

  NQ.progres = {
    baru: function (nama, kelas) {
      var lama = NQ.state.pengaturan;
      NQ.state = statusBaru(nama, kelas);
      if (lama) NQ.state.pengaturan = lama;
      NQ.simpan.simpan();
    },
    lanjutkan: function () {
      var s = NQ.simpan.muat();
      if (!s) return false;
      var dasar = statusBaru();
      for (var k in dasar) { if (!(k in s)) s[k] = dasar[k]; }
      NQ.state = s;
      return true;
    },
    bendera: function (nama) { return !!NQ.state.bendera[nama]; },
    tandai: function (nama) { NQ.state.bendera[nama] = true; NQ.simpan.simpan(); },
    punyaAlat: function (id) { return NQ.state.alat.indexOf(id) >= 0; },
    beriAlat: function (id) {
      if (!this.punyaAlat(id)) NQ.state.alat.push(id);
      NQ.simpan.simpan();
    },
    setTugas: function (teks) { NQ.state.tugas = teks; NQ.simpan.simpan(); },
    setTahap: function (id) { NQ.state.tahap = id; NQ.simpan.simpan(); },
    sudahSelesai: function (id) { return NQ.state.kasusSelesai.indexOf(id) >= 0; },

    // 'buka' | 'terkunci' | 'butuh-alat' | 'belum-dibangun'
    statusRuang: function (id) {
      var r = NQ.data.ruangan[id];
      if (!r) return 'belum-dibangun';
      if (r.terbukaSetelah && !this.sudahSelesai(r.terbukaSetelah)) return 'terkunci';
      if (!NQ.data.sceneRuang[id]) return 'belum-dibangun';
      if (r.butuhAlat && !this.punyaAlat(r.butuhAlat)) return 'butuh-alat';
      return 'buka';
    },

    // Ke mana tombol Lanjutkan membawa pemain
    tujuanLanjut: function () {
      if (!this.bendera('prologSelesai')) return { scene: 'prolog', data: {} };
      var info = this.infoTahap(), ruang = info && info.ruangan;
      if (ruang && this.statusRuang(ruang) === 'buka') return { scene: NQ.data.sceneRuang[ruang], data: { dari: 'lorong' } };
      return { scene: 'lorong', data: { dari: ruang && NQ.data.ruangan[ruang] ? ruang : 'kantor-kepala-lab' } };
    },

    infoTahap: function (id) {
      var k = NQ.data.kasus;
      for (var i = 0; i < k.length; i++) if (k[i].id === (id || NQ.state.tahap)) return k[i];
      return null;
    }
  };
})(window.NQ = window.NQ || {});
