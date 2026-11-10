/*
 * Energi, tindakan salah, pingsan, dan bintang kasus.
 * NQ.energi.salah(kasus, id, opsi, selesai): terapkan umpan balik dari data/umpan-balik.js.
 *   opsi.ganti   = { 'teks lama': 'teks baru' } untuk menyesuaikan ucapan (misalnya nomor pin)
 *   opsi.tanpaKonektor = true jika stok konektor sudah dikurangi oleh mini-game
 * NQ.kasus.selesai(kasus, opsi): hitung bintang, catat, tampilkan ringkasan, lanjut ke tahap berikut.
 */
(function (NQ) {
  function cari(kasus, id) {
    var d = NQ.data.umpanBalik[kasus] || [];
    for (var i = 0; i < d.length; i++) if (d[i].id === id) return d[i];
    return null;
  }

  function ganti(teks, peta) {
    if (!peta) return teks;
    for (var k in peta) teks = teks.split(k).join(peta[k]);
    return teks;
  }

  NQ.energi = {
    salah: function (kasus, id, opsi, selesai) {
      opsi = opsi || {};
      var d = cari(kasus, id), s = NQ.state;
      if (!d) { console.warn('Umpan balik tidak ada:', kasus, id); if (selesai) selesai(); return; }
      if (d.energi) {
        s.energi = Math.max(0, s.energi + d.energi);
        NQ.audio.efek('energi-turun');
        NQ.ui.toast('<span style="color:#ff6b6b">Energi &minus;1</span>');
      } else if (d.hitungSalah) NQ.audio.efek('salah');
      if (d.konektor && !opsi.tanpaKonektor) s.konektor = Math.max(0, (s.konektor || 0) + d.konektor);
      if (d.bintang) s.potongBintang[kasus] = (s.potongBintang[kasus] || 0) - d.bintang;
      if (d.hitungSalah) s.salah[kasus] = (s.salah[kasus] || 0) + 1;
      NQ.simpan.simpan();
      NQ.hud.segarkan();
      var baris = d.ucapan.map(function (u) { return { tokoh: u.tokoh, potret: u.potret, teks: ganti(u.teks, opsi.ganti) }; });
      NQ.dialog.tampilkan(baris, function () {
        var lanjut = function () {
          if (s.energi <= 0) NQ.energi.pingsan(selesai);
          else if (selesai) selesai();
        };
        // Kesalahan konsep penting: tampilkan kartu "Kenapa Salah?" bergambar (sekali per tindakan)
        var kunci = kasus + '/' + id;
        if (NQ.kartuKonsep && NQ.data.kenapaSalah && NQ.data.kenapaSalah[kunci]) NQ.kartuKonsep.salah(kunci, lanjut);
        else lanjut();
      });
    },

    // Energi habis: Raka pusing, lalu kembali ke pintu ruangan dengan energi penuh
    pingsan: function (selesai) {
      NQ.pemain.pose('pusing', 2.5);
      NQ.dialog.tampilkan(NQ.data.ucapanEnergiHabis, function () {
        NQ.state.energi = NQ.config.energiMaks;
        NQ.simpan.simpan();
        NQ.hud.segarkan();
        if (NQ.ruang && NQ.ruang.kePintu) NQ.ruang.kePintu();
        if (selesai) selesai();
      });
    }
  };

  NQ.kasus = {
    hitungBintang: function (kasus) {
      var s = NQ.state;
      var total = (s.petunjuk[kasus] || 0) + (s.salah[kasus] || 0);
      var b = total === 0 ? 3 : (total <= 2 ? 2 : 1);
      return Math.max(1, b - (s.potongBintang[kasus] || 0));
    },

    // opsi: { inti, berikut, tugas, judul, selesai }
    selesai: function (kasus, opsi) {
      var s = NQ.state, b = this.hitungBintang(kasus);
      s.bintang[kasus] = Math.max(s.bintang[kasus] || 0, b);
      if (s.kasusSelesai.indexOf(kasus) < 0) s.kasusSelesai.push(kasus);
      if (opsi.berikut) s.tahap = opsi.berikut;
      if (opsi.tugas) s.tugas = opsi.tugas;
      s.energi = NQ.config.energiMaks;
      NQ.simpan.simpan();
      NQ.hud.segarkan();
      NQ.audio.efek('kasus-selesai');
      var info = NQ.progres.infoTahap(kasus);
      var bintang = '';
      for (var i = 0; i < 3; i++) bintang += '<img src="assets/img/ikon/ui/' + (i < b ? 'bintang-nyala' : 'bintang-mati') + '.png" alt="">';
      // Garis waktu 6 langkah dari Jurnal siswa sendiri
      var j = s.jurnal[kasus] || {}, alur = '';
      NQ.data.langkahJurnal.forEach(function (l) {
        var t = j[l] || '-';
        if (t.length > 120) t = t.slice(0, 117) + '...';
        alur += '<div class="langkah-alur' + (j[l] ? '' : ' kosong') + '"><img src="' + NQ.data.aset.gambar['langkah-' + l.toLowerCase()] + '" alt="">' +
          '<div><b>' + l + '</b><span>' + NQ.ui.esc(t) + '</span></div></div>';
      });
      var konsep = '';
      for (var id in NQ.data.konsep) if (NQ.data.konsep[id].kasus === kasus && s.konsep && s.konsep[id] && s.konsep[id].selesai)
        konsep = '<div class="konsep-kasus">Kartu Konsep: <b>' + NQ.ui.esc(NQ.data.konsep[id].judul) + '</b> ' + (s.konsep[id].benarPertama ? '&#10003; dijawab benar pada percobaan pertama' : '(benar setelah ' + s.konsep[id].percobaan + ' kali mencoba)') + '</div>';
      var teks = '<div class="atas-ringkas"><div class="bintang-besar">' + bintang + '</div>' +
        '<div class="ringkas">Petunjuk dipakai: <b>' + (s.petunjuk[kasus] || 0) + '</b> &nbsp;&middot;&nbsp; Kesalahan: <b>' + (s.salah[kasus] || 0) + '</b></div></div>' +
        (j.Gejala ? '<div class="alur">' + alur + '</div>' : '') + konsep +
        '<div class="inti"><b>Ingat:</b> ' + NQ.ui.esc(opsi.inti || '') + '</div>';
      setTimeout(function () { NQ.audio.efek('bintang'); }, 900);
      NQ.menu.pesan((opsi.judul || (info ? info.judul : kasus)).toUpperCase() + ' SELESAI', teks, [
        { label: 'Lanjut', aksi: function () { NQ.menu.tutup(); if (opsi.selesai) opsi.selesai(); } }
      ]);
      var pn = document.querySelector('.panel.pesan');
      if (pn && j.Gejala) pn.classList.add('ringkasan-kasus');
    }
  };
})(window.NQ = window.NQ || {});
