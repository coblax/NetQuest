/*
 * Mesin ruangan umum. Setiap scene ruangan (Prolog, Lorong, Kasus 1-3, ...) dibuat dengan
 * NQ.ruang.buat(def). Mesin ini mengurus hal yang sama di semua ruangan: peta, Raka, Pingo,
 * NPC, objek yang bisa diperiksa, kamera, klik mouse, tombol T/J/Q/M/?, pintu keluar, HUD,
 * musik, dan penjadwal (tunda) untuk adegan singkat.
 *
 * def = {
 *   id: nama scene, ruangan: id di data/ruangan.js, kasus: id kasus ruangan ini (untuk petunjuk),
 *   musik, ambien,
 *   siapkan(R, data)     menambahkan NPC, objek, dan keadaan awal (dipanggil setiap masuk)
 *   saatMasuk(R, data)   dipanggil sebentar setelah masuk (misalnya dialog pertama)
 *   perbarui(R, dt, modal), sprite(R) -> [sprite], gambarAtas(R, ctx)
 *   tombol(R, aksi) -> true bila ditangani sendiri ('tas','jurnal','pindai','peta','petunjuk')
 *   pakaiAlat(R, id) -> true bila ditangani
 *   bolehKeluar(R) -> boolean, saatKeluar(R, lanjut)
 * }
 * Objek interaksi boleh punya alat: { 'lan-tester': fungsi } agar alat dari Tas bisa dipakai padanya.
 */
(function (NQ) {
  var aktifR = null;

  function tokoh(id) { return NQ.data.tokoh[id] || { nama: id, potret: null }; }

  function buatR(def) {
    var R = {
      def: def, npc: [], tunda: [], anim: [], data: {},
      bendera: function (n) { return NQ.progres.bendera(n); },
      tandai: function (n) { NQ.progres.tandai(n); },
      // Bicara satu baris atau lebih: R.bicara('pingo', 'teks', selesai)
      bicara: function (siapa, teks, selesai) {
        var t = tokoh(siapa), daftar = [].concat(teks);
        NQ.dialog.tampilkan(daftar.map(function (x) { return { tokoh: t.nama, potret: t.potret, teks: x }; }), selesai);
      },
      dialog: function (pemicu, selesai, kasus) { NQ.dialog.jalankan(kasus || def.kasus, pemicu, selesai); },
      jurnal: function (langkah, teks) { NQ.jurnal.isi(def.kasus, langkah, teks); },
      sudah: function (langkah) { return NQ.jurnal.sudah(def.kasus, langkah); },
      tugas: function (teks) { NQ.progres.setTugas(teks); NQ.hud.segarkan(); },
      salah: function (id, opsi, selesai) { NQ.energi.salah(def.kasus, id, opsi, selesai); },
      tahanUji: function () { R.bicara('pingo', NQ.data.ucapanTahanUji); },
      // Jadwalkan fungsi setelah beberapa detik (berhenti selama ada panel terbuka)
      setelah: function (detik, fn) { R.tunda.push({ sisa: detik, fn: fn }); },
      // Animasi sederhana: gambar(ctx, ox, oy, t 0..1) selama durasi detik
      animasi: function (durasi, dasar, gambar, selesai) { R.anim.push({ durasi: durasi, t: 0, dasar: dasar, gambar: gambar, selesai: selesai }); },
      // NPC: { id: kunci tokoh, x (tengah), dasar, aktif(), bicara(), padat }
      tambahNPC: function (n) {
        var t = tokoh(n.id), a = n.aset || t.aset;
        var w = NQ.aset.lebar(a), h = NQ.aset.tinggi(a);
        n.aset = a; n.w = w; n.h = h;
        if (n.padat !== false) n.kotakPadat = NQ.peta.tambahPadat({ x: n.x - 8, y: n.dasar - 6, w: 16, h: 6 });
        R.npc.push(n);
        if (n.bicara) NQ.interaksi.tambah({
          id: 'npc-' + n.id, x: n.x + (n.berdiriX || 0), y: n.dasar + (n.berdiriY || 14), jarak: n.jarak || 22,
          kilauX: n.x, kilauY: n.dasar - h - 6,
          kotak: { x: n.x - w / 2 - 2, y: n.dasar - h, w: w + 4, h: h },
          aktif: function () { return !n.aktif || n.aktif(); }, aksi: n.bicara
        });
        return n;
      },
      objek: function (t) { NQ.interaksi.tambah(t); return t; }
    };
    return R;
  }

  function spritesNPC(R) {
    return R.npc.filter(function (n) { return !n.aktif || n.aktif(); }).map(function (n) {
      return { dasar: n.dasar, gambar: function (c, ox, oy) {
        c.fillStyle = 'rgba(20,16,40,0.2)';
        c.beginPath(); c.ellipse(ox + n.x, oy + n.dasar - 1, 8, 2.5, 0, 0, Math.PI * 2); c.fill();
        NQ.aset.utuh(c, n.aset, ox + n.x - n.w / 2, oy + n.dasar - n.h);
      } };
    });
  }

  // ---------- Panah penunjuk tujuan ----------
  // def.tujuan(R) mengembalikan: id objek interaksi ('tas', 'pc-7', 'npc-bu-wati'),
  // 'keluar' (pintu keluar ruangan), { tombol: 'tas' | 'jurnal' | 'pindai' | 'peta' } (tombol aksi di layar),
  // { x, y } titik di ruangan, atau null bila tidak ada yang perlu ditunjuk.
  // Bila scene tidak menentukan dan kasus ruangan ini sudah selesai, panah menunjuk pintu keluar.
  function cariTujuan(R) {
    var def = R.def, t = def.tujuan ? def.tujuan(R) : undefined;
    if (t === undefined) t = def.kasus && NQ.progres.sudahSelesai(def.kasus) && !NQ.progres.bendera('tamat') ? 'keluar' : null;
    if (!t) return null;
    if (t.tombol) return { tombol: t.tombol };
    if (t === 'keluar') {
      var pk = NQ.peta.tata().pintuKeluar;
      if (!pk || (def.bolehKeluar && !def.bolehKeluar(R))) return null;
      return { x: pk.x + pk.w / 2, y: pk.y - 3 };
    }
    if (typeof t === 'string') {
      var o = NQ.interaksi.cari(t);
      if (!o) return null;
      if (NQ.interaksi.terdekat() === o) return null;   // penanda E sudah tampil di atasnya
      // Ujung panah tepat di atas area objek yang bisa diklik (kotak), atau di atas titik kilau
      var kx = o.kilauX !== undefined ? o.kilauX : o.x, ky = (o.kilauY !== undefined ? o.kilauY : o.y - 40) - 6, k = o.kotak;
      if (k && k.w > 0) { kx = k.x + k.w / 2; ky = Math.max(ky, k.y - 2); }
      return { x: kx, y: ky };
    }
    return t;
  }

  function gambarPanah(ctx, tj) {
    if (!tj || tj.tombol || NQ.kotakDialog.aktif()) return;
    var L = NQ.config.lebarLayar, T = NQ.config.tinggiLayar;
    var x = NQ.kamera.x + tj.x, y = NQ.kamera.y + tj.y, t = performance.now() / 1000;
    var minX = 14, maxX = L - 14, minY = 40, maxY = T - 14;
    ctx.save();
    if (x >= minX && x <= maxX && y >= minY - 20 && y <= maxY) {
      // panah kuning memantul di atas tujuan, ujungnya menunjuk ke bawah
      var b = Math.abs(Math.sin(t * 4)) * 3;
      ctx.translate(x, y - b);
    } else {
      // tujuan di luar layar: panah menempel di tepi dan menunjuk ke arah tujuan
      var cx = Math.max(minX, Math.min(maxX, x)), cy = Math.max(minY, Math.min(maxY, y));
      var sudut = Math.atan2(y - cy, x - cx), d = Math.sin(t * 5) * 2;
      ctx.translate(cx + Math.cos(sudut) * d, cy + Math.sin(sudut) * d);
      ctx.rotate(sudut - Math.PI / 2);
    }
    ctx.fillStyle = '#1a1426';
    ctx.beginPath(); ctx.moveTo(-7, -9); ctx.lineTo(7, -9); ctx.lineTo(0, 0.8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd23f';
    ctx.beginPath(); ctx.moveTo(-5.5, -8); ctx.lineTo(5.5, -8); ctx.lineTo(0, -1); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function keluarRuang(R) {
    var lanjut = function () { NQ.scene.ke('lorong', { dari: R.def.ruangan }); };
    if (R.def.saatKeluar) R.def.saatKeluar(R, lanjut); else lanjut();
  }

  function tombolBawaan(R, aksi) {
    var def = R.def;
    if (def.tombol && def.tombol(R, aksi)) return;
    if (aksi === 'tas') {
      if (!NQ.state.alat.length) { R.bicara('pingo', 'Tas Teknisi masih kosong.'); return; }
      NQ.tas.saatPakai = function (id) { pakaiAlat(R, id); };
      NQ.tas.buka();
    } else if (aksi === 'jurnal') NQ.jurnal.buka();
    else if (aksi === 'pindai') {
      if (!NQ.pingo.menyala()) { R.bicara('raka', 'Pingo belum menyala. Belum ada yang bisa memindai.'); return; }
      if (def.pindai && def.pindai(R)) return;
      NQ.audio.efek('pindai-gelombang');
      NQ.pingo.setMode('pindai');
      R.bicara('pingo', 'Bip! Tidak ada jejak aneh di ruangan ini.', function () { NQ.pingo.setMode('melayang'); });
    } else if (aksi === 'peta') NQ.petaSekolah.buka();
    else if (aksi === 'petunjuk') {
      if (def.kasus && NQ.state.tahap === def.kasus && !NQ.progres.sudahSelesai(def.kasus)) NQ.petunjuk.minta(def.kasus);
      else R.bicara('pingo', 'Tugas kita sekarang: ' + (NQ.state.tugas || '-') + '. Buka peta (M) untuk melihat arah.');
    }
  }

  function pakaiAlat(R, id) {
    NQ.tas.saatPakai = null;
    var t = NQ.interaksi.terdekat();
    if (t && t.alat && t.alat[id]) { t.alat[id](); return; }
    if (R.def.pakaiAlat && R.def.pakaiAlat(R, id)) return;
    R.bicara('pingo', 'Dekati objek yang ingin diperiksa dulu, lalu pakai ' + NQ.data.alat[id].nama + '.');
  }

  NQ.ruang = {
    idRuang: function () { return aktifR ? aktifR.def.ruangan : ''; },
    R: function () { return aktifR; },
    // Kembali ke pintu masuk ruangan (dipakai saat energi habis)
    kePintu: function () {
      if (!aktifR) return;
      var m = NQ.peta.tata().mulai;
      NQ.pemain.taruh(m.x, m.y, 'atas');
      if (NQ.pingo.menyala()) NQ.pingo.nyalakan();
    },

    buat: function (def) {
      var R = null;
      NQ.scene.daftar(def.id, {
        masuk: function (data) {
          R = buatR(def); aktifR = R; R.data = data || {};
          NQ.peta.muat(def.ruangan);
          NQ.interaksi.bersihkan();
          var tata = NQ.peta.tata();
          var pos = R.data.posisi || tata.mulai;
          NQ.pemain.taruh(pos.x, pos.y, R.data.arah || 'atas');
          NQ.pingo.setMode('melayang');
          if (NQ.progres.bendera('pingoMenyala')) NQ.pingo.nyalakan();
          if (def.siapkan) def.siapkan(R, R.data);
          NQ.hud.tampil();
          NQ.kontrolSentuh.tampil(true);
          NQ.audio.musik(def.musik || 'eksplorasi');
          if (def.ambien) NQ.audio.ambien(def.ambien); else NQ.audio.hentikanAmbien();
          if (def.saatMasuk) R.setelah(0.45, function () { def.saatMasuk(R, R.data); });
          NQ.hud.segarkan();
        },
        keluar: function () {
          NQ.hud.sembunyi(); NQ.audio.hentikanAmbien(); NQ.menu.tutup();
          NQ.kontrolSentuh.sorot(null);
          if (NQ.dekat.aktif()) NQ.dekat.tutup();
          if (NQ.terminal && NQ.terminal.aktif()) NQ.terminal.tutup();
        },
        perbarui: function (dt) {
          var modal = NQ.ui.adaModal() || !!R.sibuk;
          NQ.peta.perbarui(dt);
          NQ.pemain.perbarui(dt, !modal);
          NQ.pingo.perbarui(dt);
          NQ.interaksi.perbarui(dt, !modal);
          NQ.kamera.atur(NQ.peta.lebar(), NQ.peta.tinggi(), NQ.pemain.x(), NQ.pemain.y());
          R.anim = R.anim.filter(function (a) {
            a.t += dt / a.durasi;
            if (a.t >= 1) { if (a.selesai) a.selesai(); return false; }
            return true;
          });
          if (!NQ.ui.adaModal()) {
            var siap = R.tunda.filter(function (j) { j.sisa -= dt; return j.sisa <= 0; });
            R.tunda = R.tunda.filter(function (j) { return j.sisa > 0; });
            siap.forEach(function (j) { j.fn(); });
          }
          if (def.perbarui) def.perbarui(R, dt, modal);
          R.tujuan = cariTujuan(R);
          NQ.kontrolSentuh.sorot(R.tujuan && R.tujuan.tombol && !NQ.ui.adaModal() ? R.tujuan.tombol : null);
          if (modal || NQ.ui.adaModal()) return;

          // Mouse / ketuk
          var klik = NQ.input.ambilKlik();
          if (klik) {
            var wx = klik.x - NQ.kamera.x, wy = klik.y - NQ.kamera.y;
            var objek = NQ.interaksi.diKlik(wx, wy);
            if (objek) NQ.interaksi.pergiDanPeriksa(objek);
            else if (wx >= 0 && wy >= 0 && wx <= NQ.peta.lebar() && wy <= NQ.peta.tinggi())
              NQ.pemain.jalanKe(wx, Math.min(wy + 4, NQ.peta.tinggi() - 2));
          }
          var aksi = ['tas', 'jurnal', 'pindai', 'peta', 'petunjuk'];
          for (var i = 0; i < aksi.length; i++) if (NQ.input.baruDitekan(aksi[i])) { tombolBawaan(R, aksi[i]); break; }

          // Pintu keluar
          var pk = NQ.peta.tata().pintuKeluar;
          if (pk && NQ.pemain.x() > pk.x && NQ.pemain.x() < pk.x + pk.w && NQ.pemain.y() > pk.y + 2) {
            if (!def.bolehKeluar || def.bolehKeluar(R)) {
              NQ.pemain.taruh(NQ.pemain.x(), pk.y - 4, 'atas');
              keluarRuang(R);
            } else {
              NQ.pemain.taruh(NQ.pemain.x(), pk.y - 4, 'atas');
              if (def.tolakKeluar) def.tolakKeluar(R);
            }
          }
        },
        gambar: function (ctx) {
          var tambahan = [NQ.pemain.sprite(), NQ.pingo.sprite()].concat(spritesNPC(R));
          if (def.sprite) tambahan = tambahan.concat(def.sprite(R) || []);
          R.anim.forEach(function (a) { tambahan.push({ dasar: a.dasar, gambar: function (c, ox, oy) { a.gambar(c, ox, oy, a.t); } }); });
          var tj = NQ.pemain.tujuanJalan();
          if (tj) tambahan.push({ dasar: -1, gambar: function (c, ox, oy) {
            var t = (performance.now() / 600) % 1;
            c.strokeStyle = 'rgba(159,232,255,' + (1 - t) + ')'; c.lineWidth = 1;
            c.beginPath(); c.ellipse(ox + tj.x, oy + tj.y - 1, 4 + t * 4, 1.5 + t * 1.5, 0, 0, Math.PI * 2); c.stroke();
          } });
          var pk = NQ.peta.tata().pintuKeluar;
          if (pk && (!def.bolehKeluar || def.bolehKeluar(R)) && def.panahKeluar && def.panahKeluar(R)) tambahan.push({ dasar: 999, gambar: function (c, ox, oy) {
            var t = Math.floor(performance.now() / 300) % 2;
            c.fillStyle = '#ffd23f';
            var x = ox + pk.x + pk.w / 2, y = oy + pk.y - 10 + t * 2;
            c.beginPath(); c.moveTo(x - 5, y); c.lineTo(x + 5, y); c.lineTo(x, y + 6); c.closePath(); c.fill();
          } });
          NQ.peta.gambar(ctx, tambahan);
          if (def.gambarAtas) def.gambarAtas(R, ctx);
          NQ.interaksi.gambar(ctx);
          gambarPanah(ctx, R.tujuan);
        }
      });
    }
  };
})(window.NQ = window.NQ || {});
