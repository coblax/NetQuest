/*
 * Scene 6 · Kasus 3 · Ruang Server: kabel port 7 longgar di patch panel; keping glitch pertama.
 * 6 langkah: Gejala dan Dugaan (lampu switch) -> Uji (Pindai Q: kabel gelap ke port 7)
 * -> Perbaikan (pasang ulang di patch panel) -> Verifikasi (Kak Dimas: Lab 2 tersambung) -> Catat.
 * Salah: mencabut kabel port yang menyala (alarm, energi -1), mematikan switch (energi -1).
 */
(function (NQ) {
  var K = 'kasus-3';
  var RAK = { x: 144, y: 96 };
  var KEPING = { x: 254, y: 92 };
  var VENTILASI = { x: 60, y: 22 };
  var RUANG_PORT = { 1: 'Kantor Kepala Lab', 2: 'Lab Komputer 1', 3: 'Ruang Guru', 4: 'Perpustakaan', 5: 'Ruang TU', 6: 'Ruang Multimedia', 7: 'Lab Komputer 2', 8: 'Aula' };
  var pindaiSampai = 0, alarmSampai = 0, portDicabut = 0;

  function b(n) { return NQ.progres.bendera(n); }
  function sekarang() { return performance.now() / 1000; }

  function tugas(R) {
    if (NQ.progres.sudahSelesai(K)) return;
    if (!R.sudah('Gejala')) R.tugas('Periksa lampu di rak switch');
    else if (!R.sudah('Uji')) R.tugas('Tekan Q untuk memindai kabel yang gelap');
    else if (!R.sudah('Perbaikan')) R.tugas('Pasang ulang kabel di port 7 patch panel');
    else if (!b('k3.keping')) R.tugas('Ada kilau ungu di balik rak kanan');
    else R.tugas('Selesaikan laporan kasus');
  }

  // ---------- Gambar perangkat (digambar kode supaya lampu dan nomor port tepat) ----------
  function badan(c, w, h, judul) {
    c.fillStyle = '#10162e'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#3a3f4f'; c.fillRect(6, 10, w - 12, h - 24);
    c.fillStyle = '#4b5164'; c.fillRect(6, 10, w - 12, 3);
    c.strokeStyle = '#151824'; c.lineWidth = 1; c.strokeRect(6.5, 10.5, w - 13, h - 25);
    c.fillStyle = '#c8cee0'; c.font = '4.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'left'; c.textBaseline = 'top';
    c.fillText(judul, 10, 14);
  }
  function posPort(i) { var bar = i < 12 ? 0 : 1, kol = i % 12; return { x: 36 + kol * 16.5, y: bar === 0 ? 34 : 56 }; }

  function gambarSwitch(c, t, R) {
    badan(c, 240, 90, 'SWITCH 24 PORT');
    // PWR
    c.fillStyle = '#5ee05e'; c.beginPath(); c.arc(20, 40, 2.4, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#c8cee0'; c.font = 'bold 4px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.fillText('PWR', 20, 45);
    for (var i = 0; i < 24; i++) {
      var p = posPort(i), mati = i === 6 && !R.sudah('Perbaikan');
      c.fillStyle = '#14161f'; c.fillRect(p.x - 5, p.y, 10, 8);
      c.fillStyle = '#2b2f3c'; c.fillRect(p.x - 3, p.y + 5, 6, 3);
      var link = !mati && (i < 8 || i % 3 !== 0);
      var kedip = link && Math.floor(t * 6 + i * 1.7) % 3 === 0;
      c.fillStyle = link ? '#5ee05e' : '#2a3a2a'; c.fillRect(p.x - 4.5, p.y - 3.5, 3, 2.2);
      c.fillStyle = kedip ? '#ffd23f' : '#4a4320'; c.fillRect(p.x + 1.5, p.y - 3.5, 3, 2.2);
      c.fillStyle = i === 6 ? '#ffd23f' : '#9aa2bc'; c.font = 'bold 4px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
      c.fillText(String(i + 1), p.x, p.y + 9.5);
    }
    c.fillStyle = '#c8cee0'; c.textAlign = 'left'; c.font = '4.2px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    c.fillText('Lampu kiri = link   Lampu kanan = aktivitas', 10, 80);
  }

  function gambarPatch(c, t, R) {
    badan(c, 240, 90, 'PATCH PANEL');
    var kedip = alarmSampai > sekarang() && Math.floor(t * 8) % 2 === 0;
    for (var i = 0; i < 24; i++) {
      var p = posPort(i), longgar = i === 6 && !R.sudah('Perbaikan'), lepas = portDicabut === i + 1;
      c.fillStyle = '#14161f'; c.fillRect(p.x - 5, p.y, 10, 8);
      if (!lepas) {
        var dy = longgar ? -4 : 0;
        c.fillStyle = longgar ? '#8fb6ff' : '#2f6fe0'; c.fillRect(p.x - 4, p.y + 1 + dy, 8, 6);
        c.fillStyle = '#d9e4ff'; c.fillRect(p.x - 3, p.y + 1 + dy, 6, 2);
        c.strokeStyle = longgar ? '#8fb6ff' : '#2f6fe0'; c.lineWidth = 2;
        c.beginPath(); c.moveTo(p.x, p.y + 7 + dy); c.lineTo(p.x + (longgar ? 3 : 0), p.y + 14); c.stroke();
      }
      c.fillStyle = i === 6 ? '#ffd23f' : '#9aa2bc'; c.font = 'bold 4px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'bottom';
      c.fillText(String(i + 1), p.x, p.y - 0.5);
    }
    if (kedip) { c.fillStyle = 'rgba(255,60,60,0.25)'; c.fillRect(0, 0, 240, 90); }
    c.fillStyle = '#c8cee0'; c.textAlign = 'left'; c.textBaseline = 'top'; c.font = '4.2px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    c.fillText('Klik port untuk memasang ulang kabelnya.', 10, 80);
  }

  function portDiKlik(x, y) {
    for (var i = 0; i < 24; i++) { var p = posPort(i); if (Math.abs(x - p.x) < 7 && y > p.y - 8 && y < p.y + 16) return i + 1; }
    return 0;
  }

  // ---------- Tindakan ----------
  function bukaSwitch(R) {
    NQ.dekat.buka({
      judul: 'RAK SWITCH · LAMPU INDIKATOR', w: 240, h: 90,
      gambar: function (c, t) { gambarSwitch(c, t, R); },
      keterangan: function () {
        return R.sudah('Perbaikan') ? 'Semua port yang dipakai menyala. Port 7 hidup lagi.' :
          'PWR menyala hijau. Port 7 (ke Lab Komputer 2) lampu link-nya <b>mati</b>.';
      },
      opsi: function () { return [{ label: 'Matikan switch', aksi: function () { R.salah('matikan-switch'); } }]; }
    });
    // setTimeout (bukan R.setelah) karena penjadwal ruangan berhenti selama panel terbuka
    if (!R.sudah('Gejala')) setTimeout(function () {
      R.dialog('periksa-switch', function () {
        R.jurnal('Gejala', 'Lab Komputer 2 putus. Di switch, lampu PWR menyala tetapi lampu link port 7 mati.');
        R.jurnal('Dugaan', 'Kabel port 7 longgar atau putus, atau perangkat ujungnya bermasalah.');
        tugas(R);
      });
    }, 700);
  }

  function bukaPatch(R) {
    if (R.sudah('Uji') && !R.sudah('Perbaikan') && !b('k3.port7')) { R.tandai('k3.port7'); R.dialog('temukan-port-7', function () { bukaPatch(R); }); return; }
    NQ.dekat.buka({
      judul: 'RAK SWITCH · PATCH PANEL', w: 240, h: 90,
      gambar: function (c, t) { gambarPatch(c, t, R); },
      klik: function (x, y) {
        var n = portDiKlik(x, y); if (!n) return;
        if (n === 7) {
          if (R.sudah('Perbaikan')) return;
          if (!R.sudah('Uji')) { R.dialog(R.sudah('Gejala') ? 'pindai-dulu' : 'switch-dulu'); return; }
          perbaiki(R);
        } else cabutPort(R, n);
      },
      keterangan: function () {
        return R.sudah('Perbaikan') ? 'Kabel port 7 sudah terpasang rapat.' :
          (R.sudah('Uji') ? 'Kabel port 7 tampak menyembul keluar: <b>longgar</b>.' : 'Semua kabel tampak terpasang. Mana yang bermasalah?');
      }
    });
  }

  function cabutPort(R, n) {
    portDicabut = n; alarmSampai = sekarang() + 1.4;
    NQ.audio.efek('alarm');
    var ruang = RUANG_PORT[n] || ('perangkat port ' + n);
    R.salah('cabut-port-menyala', { ganti: { 'jalur Ruang Guru': 'jalur ' + ruang } }, function () { portDicabut = 0; NQ.audio.efek('klik-konektor'); });
  }

  function perbaiki(R) {
    NQ.audio.efek('klik-konektor');
    R.jurnal('Perbaikan', 'Kabel port 7 di patch panel dipasang ulang sampai klik.');
    tugas(R);
    setTimeout(function () {
      R.dialog('verifikasi-berhasil', function () {
        R.jurnal('Verifikasi', 'Lampu link port 7 di switch menyala; Lab Komputer 2 tersambung lagi.');
        NQ.dekat.tutup();
        tugas(R);
      });
    }, 500);
  }

  function ambilKeping(R) {
    R.dialog('lihat-kilau-ungu', function () {
      R.sibuk = true;
      NQ.audio.musik('misteri');
      NQ.audio.efek('desis-glitch');
      R.animasi(1.4, 120, function (c, ox, oy, t) {
        var x = KEPING.x + (VENTILASI.x - KEPING.x) * t, y = KEPING.y - 10 + (VENTILASI.y - KEPING.y + 10) * t - Math.sin(t * Math.PI) * 20;
        NQ.aset.frame(c, 'glitch-kecil', t < 0.7 ? 1 : 2, 0, ox + x - 16, oy + y - 13);
      }, function () {
        R.sibuk = false;
        R.dialog('glitch-kabur', function () {
          R.tandai('k3.keping');
          NQ.state.keping = Math.max(NQ.state.keping, 1);
          NQ.progres.beriAlat('keping-glitch');
          NQ.audio.efek('ambil-barang');
          NQ.hud.segarkan();
          R.dialog('ambil-keping', function () {
            R.jurnal('Catat', 'Penyebab: kabel port 7 longgar di patch panel. Solusi: lacak dengan Pindai, pasang ulang sampai klik. Temuan: keping data ungu (keping 1/4).');
            NQ.kasus.selesai(K, {
              inti: 'Lampu PWR = switch hidup, link menyala = kabel terhubung, berkedip = ada data. Link mati berarti kabel, port, atau perangkat ujung bermasalah.',
              berikut: 'kasus-4', tugas: 'Bu Rina di Perpustakaan: internet katalog putus-sambung',
              selesai: function () {
                R.dialog('babak1-selesai', function () {
                  NQ.audio.musik('eksplorasi');
                  R.dialog('panggilan-pak-bima', function () { R.tandai('k4.panggilan'); }, 'kasus-4');
                });
              }
            });
          });
        });
      });
    });
  }

  // ---------- Mode Pindai: kabel sebagai aliran cahaya ----------
  var KABEL = [
    { ke: 'Ruang Guru', titik: [[138, 96], [138, 140], [0, 140]] },
    { ke: 'Lab Komputer 1', titik: [[142, 96], [142, 224]] },
    { ke: 'Lab Komputer 2 (port 7)', titik: [[146, 96], [146, 120], [288, 120]], port7: true },
    { ke: 'Kantor', titik: [[150, 96], [150, 176], [288, 176]] }
  ];
  function gambarPindai(R, c) {
    var sisa = pindaiSampai - sekarang(); if (sisa <= 0) return;
    var ox = NQ.kamera.x, oy = NQ.kamera.y, a = Math.min(1, sisa, (8 - sisa) * 3);
    c.save(); c.globalAlpha = a;
    c.fillStyle = 'rgba(5,12,40,0.45)'; c.fillRect(ox, oy, NQ.peta.lebar(), NQ.peta.tinggi());
    KABEL.forEach(function (k) {
      var gelap = k.port7 && !R.sudah('Perbaikan');
      c.strokeStyle = gelap ? '#ff6b6b' : 'rgba(110,200,255,0.9)'; c.lineWidth = 2;
      c.setLineDash(gelap ? [3, 2] : []);
      c.beginPath(); k.titik.forEach(function (p, i) { (i ? c.lineTo : c.moveTo).call(c, ox + p[0], oy + p[1]); }); c.stroke();
      c.setLineDash([]);
      var akhir = k.titik[k.titik.length - 1];
      c.fillStyle = gelap ? '#ff9f9f' : '#bfe8ff'; c.font = '5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      c.textAlign = akhir[0] <= 0 ? 'left' : (akhir[0] >= 288 ? 'right' : 'center'); c.textBaseline = 'bottom';
      c.fillText(k.ke + (gelap ? ' · gelap' : ''), ox + akhir[0] + (akhir[0] <= 0 ? 3 : (akhir[0] >= 288 ? -3 : 0)), oy + akhir[1] - (akhir[1] >= 224 ? 12 : 2));
      if (gelap) return;
      // titik cahaya bergerak
      var panjang = 0, seg = [];
      for (var i = 1; i < k.titik.length; i++) { var dx = k.titik[i][0] - k.titik[i - 1][0], dy = k.titik[i][1] - k.titik[i - 1][1], l = Math.sqrt(dx * dx + dy * dy); seg.push(l); panjang += l; }
      for (var n = 0; n < 4; n++) {
        var d = ((sekarang() * 60 + n * panjang / 4) % panjang), j = 0;
        while (j < seg.length - 1 && d > seg[j]) { d -= seg[j]; j++; }
        var p0 = k.titik[j], p1 = k.titik[j + 1], f = d / seg[j];
        c.fillStyle = '#e8fbff'; c.beginPath(); c.arc(ox + p0[0] + (p1[0] - p0[0]) * f, oy + p0[1] + (p1[1] - p0[1]) * f, 1.6, 0, Math.PI * 2); c.fill();
      }
    });
    if (!R.sudah('Perbaikan')) {
      c.strokeStyle = '#ffd23f'; c.lineWidth = 1;
      c.strokeRect(ox + RAK.x - 10, oy + RAK.y - 30, 20, 14);
      c.fillStyle = '#ffd23f'; c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'bottom';
      c.fillText('Port 7', ox + RAK.x, oy + RAK.y - 31);
    }
    c.restore();
  }

  NQ.ruang.buat({
    id: 'kasus-3', ruangan: 'ruang-server', kasus: K, musik: 'eksplorasi', ambien: 'dengung-server',

    siapkan: function (R) {
      pindaiSampai = 0; alarmSampai = 0; portDicabut = 0;
      R.objek({ id: 'rak-switch', x: RAK.x, y: RAK.y + 14, jarak: 18, kilauX: RAK.x, kilauY: RAK.y - 54,
        kotak: { x: RAK.x - 18, y: RAK.y - 48, w: 36, h: 48 },
        aksi: function () {
          NQ.menu.pilihan('Rak Switch', 'Rak ini berisi switch 24 port dan patch panel.', [
            { label: 'Lihat lampu switch', aksi: function () { bukaSwitch(R); } },
            { label: 'Buka patch panel', aksi: function () { bukaPatch(R); } }
          ]);
        } });
      R.objek({ id: 'keping', x: KEPING.x, y: 112, jarak: 18, kilauX: KEPING.x, kilauY: KEPING.y - 14,
        kotak: { x: KEPING.x - 12, y: KEPING.y - 14, w: 24, h: 20 },
        aktif: function () { return R.sudah('Verifikasi') && !b('k3.keping'); }, aksi: function () { ambilKeping(R); } });
      R.tambahNPC({ id: 'kak-dimas', x: 232, dasar: 168, bicara: function () {
        if (NQ.progres.sudahSelesai(K)) R.bicara('kak-dimas', 'Semua port normal. Hati-hati dengan jejak ungu itu, Raka.');
        else if (!R.sudah('Gejala')) R.bicara('kak-dimas', 'Mulai dari rak switch di tengah. Lihat lampunya.');
        else R.bicara('kak-dimas', 'Ingat, jangan cabut kabel yang lampunya menyala.');
      } });
      tugas(R);
    },

    saatMasuk: function (R) {
      if (!b('k3.masuk') && !NQ.progres.sudahSelesai(K)) {
        R.tandai('k3.masuk');
        NQ.audio.efek('kartu-akses');
        R.bicara('pingo', 'Dengung rak server... Ayo periksa lampu di rak switch yang di tengah.');
      }
    },

    pindai: function (R) {
      if (!R.sudah('Gejala') && !NQ.progres.sudahSelesai(K)) { R.dialog('switch-dulu'); return true; }
      pindaiSampai = sekarang() + 8;
      NQ.pingo.setMode('pindai');
      NQ.audio.efek('pindai-gelombang');
      R.setelah(8, function () { NQ.pingo.setMode('melayang'); });
      if (!R.sudah('Uji')) R.setelah(1.2, function () {
        R.dialog('pindai-aktif', function () {
          R.jurnal('Uji', 'Pindai: semua kabel mengalirkan data kecuali kabel port 7 ke Lab Komputer 2 (gelap).');
          tugas(R);
          NQ.kartuKonsep.tampil('k3-topologi');
          pindaiSampai = Math.max(pindaiSampai, sekarang() + 4);
        });
      });
      return true;
    },

    // Panah: rak switch -> tombol Pindai -> rak switch (patch panel) -> kilau keping ungu
    tujuan: function (R) {
      if (NQ.progres.sudahSelesai(K)) return undefined;
      if (!R.sudah('Gejala')) return 'rak-switch';
      if (!R.sudah('Uji')) return { tombol: 'pindai' };
      if (!R.sudah('Verifikasi')) return 'rak-switch';
      return b('k3.keping') ? null : 'keping';
    },

    sprite: function (R) {
      if (!R.sudah('Verifikasi') || b('k3.keping')) return [];
      return [{ dasar: 97, gambar: function (c, ox, oy) {
        var t = sekarang(), s = 0.8 + Math.sin(t * 5) * 0.2;
        c.save(); c.globalAlpha = 0.6 + Math.sin(t * 4) * 0.3;
        c.fillStyle = 'rgba(197,107,255,0.35)'; c.beginPath(); c.arc(ox + KEPING.x, oy + KEPING.y, 7 * s, 0, Math.PI * 2); c.fill();
        c.restore();
        NQ.aset.utuh(c, 'kilau', ox + KEPING.x - 6, oy + KEPING.y - 6);
      } }];
    },

    gambarAtas: function (R, c) { gambarPindai(R, c); }
  });
})(window.NQ = window.NQ || {});
