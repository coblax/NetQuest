/*
 * Raka: gerak 4 arah (keyboard/joystick) atau klik-untuk-berjalan (mouse/ketuk),
 * animasi jalan 3 frame (urutan 0-1-2-1), dan kotak kaki untuk tabrakan.
 * Posisi (x, y) adalah titik tengah kaki Raka di dalam ruangan.
 * Klik-untuk-berjalan memakai pencarian jalan A* pada kisi 8 px, lalu jalurnya diluruskan.
 */
(function (NQ) {
  var KECEPATAN = 72;            // piksel logis per detik
  var KAKI = { w: 14, h: 6 };    // kotak tabrakan di kaki
  var KISI = 8;
  var p = { x: 0, y: 0, arah: 'atas', gerak: false, waktu: 0 };
  var jejak = [];                // posisi terakhir untuk diikuti Pingo
  var jalur = null, saatTiba = null, cekTiba = null, macet = 0;

  function bebas(x, y) { return !NQ.peta.tabrak(x - KAKI.w / 2, y - KAKI.h, KAKI.w, KAKI.h); }

  // Garis lurus antara dua titik bebas tabrakan?
  function terlihat(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, n = Math.ceil(Math.sqrt(dx * dx + dy * dy) / 3);
    for (var i = 1; i <= n; i++) if (!bebas(a.x + dx * i / n, a.y + dy * i / n)) return false;
    return true;
  }

  function cariJalur(tx, ty) {
    var kol = Math.ceil(NQ.peta.lebar() / KISI), bar = Math.ceil(NQ.peta.tinggi() / KISI);
    function pusat(c, r) { return { x: c * KISI + KISI / 2, y: r * KISI + KISI / 2 + 2 }; }
    function lolos(c, r) { if (c < 0 || r < 0 || c >= kol || r >= bar) return false; var q = pusat(c, r); return bebas(q.x, q.y); }
    var mulai = { c: Math.floor(p.x / KISI), r: Math.floor((p.y - 2) / KISI) };
    // Tujuan: sel bebas terdekat dari titik yang diklik
    var tc = Math.floor(tx / KISI), tr = Math.floor((ty - 2) / KISI), tujuan = null;
    for (var rad = 0; rad < 8 && !tujuan; rad++)
      for (var dr = -rad; dr <= rad && !tujuan; dr++)
        for (var dc = -rad; dc <= rad && !tujuan; dc++)
          if (Math.max(Math.abs(dr), Math.abs(dc)) === rad && lolos(tc + dc, tr + dr)) tujuan = { c: tc + dc, r: tr + dr };
    if (!tujuan) return null;

    var kunci = function (c, r) { return r * kol + c; };
    var buka = [{ c: mulai.c, r: mulai.r, g: 0, f: 0 }], asal = {}, gNilai = {};
    gNilai[kunci(mulai.c, mulai.r)] = 0;
    var arahGerak = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    var ketemu = false, langkah = 0;
    while (buka.length && langkah++ < 4000) {
      var bi = 0; for (var i = 1; i < buka.length; i++) if (buka[i].f < buka[bi].f) bi = i;
      var n = buka.splice(bi, 1)[0];
      if (n.c === tujuan.c && n.r === tujuan.r) { ketemu = true; break; }
      for (var k = 0; k < 8; k++) {
        var nc = n.c + arahGerak[k][0], nr = n.r + arahGerak[k][1];
        if (!lolos(nc, nr)) continue;
        if (k >= 4 && (!lolos(n.c + arahGerak[k][0], n.r) || !lolos(n.c, n.r + arahGerak[k][1]))) continue;
        var g = n.g + (k >= 4 ? 1.414 : 1), kk = kunci(nc, nr);
        if (gNilai[kk] !== undefined && gNilai[kk] <= g) continue;
        gNilai[kk] = g; asal[kk] = kunci(n.c, n.r);
        buka.push({ c: nc, r: nr, g: g, f: g + Math.abs(nc - tujuan.c) + Math.abs(nr - tujuan.r) });
      }
    }
    if (!ketemu) return null;

    var titik = [], cur = kunci(tujuan.c, tujuan.r), awal = kunci(mulai.c, mulai.r);
    while (cur !== undefined && cur !== awal) { titik.unshift(pusat(cur % kol, Math.floor(cur / kol))); cur = asal[cur]; }
    if (bebas(tx, ty)) titik.push({ x: tx, y: ty });
    // Luruskan jalur: lompati titik yang bisa dicapai dengan garis lurus
    var hasil = [], dari = { x: p.x, y: p.y }, idx = 0;
    while (idx < titik.length) {
      var jauh = idx;
      for (var j = titik.length - 1; j > idx; j--) if (terlihat(dari, titik[j])) { jauh = j; break; }
      hasil.push(titik[jauh]); dari = titik[jauh]; idx = jauh + 1;
    }
    return hasil;
  }

  function selesaiJalan(berhasil) {
    var cb = saatTiba;
    jalur = null; saatTiba = null; cekTiba = null; macet = 0;
    if (berhasil && cb) cb();
  }

  NQ.pemain = {
    taruh: function (x, y, arah) {
      p.x = x; p.y = y; p.arah = arah || 'bawah'; p.gerak = false;
      jalur = null; saatTiba = null; cekTiba = null;
      jejak = [];
      for (var i = 0; i < 30; i++) jejak.push({ x: x, y: y });
    },
    // Pindahkan posisi tanpa membatalkan jalan atau jejak (dipakai saat mendorong benda)
    taruhSaja: function (x, y) { p.x = x; p.y = y; },
    x: function () { return p.x; },
    y: function () { return p.y; },
    arah: function () { return p.arah; },
    hadap: function (a) { p.arah = a; },
    // Pose aksi sementara: 'merunduk', 'pakaiAlat', 'dorong', 'pusing', 'senang'
    pose: function (nama, detik) { p.pose = nama; p.poseSisa = detik || 0.8; },
    jejak: function () { return jejak; },

    // Berjalan ke titik (x, y). tiba(): dipanggil saat sampai. sudahDekat(): boleh berhenti lebih awal.
    jalanKe: function (x, y, tiba, sudahDekat) {
      var j = cariJalur(x, y);
      if (!j) return false;
      jalur = j; saatTiba = tiba || null; cekTiba = sudahDekat || null; macet = 0;
      if (cekTiba && cekTiba()) selesaiJalan(true);
      return true;
    },
    sedangBerjalan: function () { return !!jalur; },
    tujuanJalan: function () { return jalur && jalur.length ? jalur[jalur.length - 1] : null; },
    batalJalan: function () { selesaiJalan(false); },

    perbarui: function (dt, bolehGerak) {
      if (p.poseSisa > 0) { p.poseSisa -= dt; if (p.poseSisa <= 0) p.pose = null; }
      var dx = 0, dy = 0, inp = NQ.input;
      if (bolehGerak) {
        if (inp.ditekan('kiri')) dx -= 1;
        if (inp.ditekan('kanan')) dx += 1;
        if (inp.ditekan('atas')) dy -= 1;
        if (inp.ditekan('bawah')) dy += 1;
      }
      var pakaiJalur = false;
      if (dx !== 0 || dy !== 0) { if (jalur) selesaiJalan(false); }
      else if (jalur && bolehGerak) {
        if (cekTiba && cekTiba()) { selesaiJalan(true); p.gerak = false; p.waktu = 0; return; }
        var wp = jalur[0];
        var jx = wp.x - p.x, jy = wp.y - p.y, jarak = Math.sqrt(jx * jx + jy * jy);
        if (jarak < 1.2) {
          jalur.shift();
          if (!jalur.length) { selesaiJalan(true); p.gerak = false; p.waktu = 0; return; }
          wp = jalur[0]; jx = wp.x - p.x; jy = wp.y - p.y; jarak = Math.sqrt(jx * jx + jy * jy);
        }
        dx = jx / jarak; dy = jy / jarak; pakaiJalur = true;
      }

      p.gerak = dx !== 0 || dy !== 0;
      if (!p.gerak) { p.waktu = 0; return; }

      if (Math.abs(dx) > Math.abs(dy)) p.arah = dx < 0 ? 'kiri' : 'kanan';
      else p.arah = dy < 0 ? 'atas' : 'bawah';

      var pj = Math.sqrt(dx * dx + dy * dy);
      var langkah = KECEPATAN * dt;
      if (pakaiJalur) {
        var sisa = Math.sqrt(Math.pow(jalur[0].x - p.x, 2) + Math.pow(jalur[0].y - p.y, 2));
        langkah = Math.min(langkah, sisa);
      }
      var lx = dx / pj * langkah, ly = dy / pj * langkah;
      var x0 = p.x, y0 = p.y;
      var peta = NQ.peta;
      if (!peta.tabrak(p.x + lx - KAKI.w / 2, p.y - KAKI.h, KAKI.w, KAKI.h)) p.x += lx;
      if (!peta.tabrak(p.x - KAKI.w / 2, p.y + ly - KAKI.h, KAKI.w, KAKI.h)) p.y += ly;

      // Tersangkut di sudut (misalnya bahu NPC): coba bergeser tegak lurus supaya bisa lewat
      if (pakaiJalur && Math.abs(p.x - x0) + Math.abs(p.y - y0) < langkah * 0.3) {
        var geser = [[0, ly >= 0 ? 1 : -1], [lx >= 0 ? 1 : -1, 0], [0, ly >= 0 ? -1 : 1], [lx >= 0 ? -1 : 1, 0]];
        for (var g = 0; g < geser.length; g++) {
          var gx = geser[g][0] * langkah, gy = geser[g][1] * langkah;
          if (!peta.tabrak(p.x + gx - KAKI.w / 2, p.y + gy - KAKI.h, KAKI.w, KAKI.h)) { p.x += gx; p.y += gy; break; }
        }
      }

      // Jalur tersumbat (misalnya terhalang Pingo/NPC): hentikan
      if (pakaiJalur) {
        macet = (Math.abs(p.x - x0) + Math.abs(p.y - y0) < 0.05) ? macet + dt : 0;
        if (macet > 0.3) selesaiJalan(!!(cekTiba && cekTiba()));
      }

      var sebelum = p.waktu;
      p.waktu += dt;
      // bunyi langkah dua kali per siklus jalan
      if (Math.floor(p.waktu / 0.25) !== Math.floor(sebelum / 0.25)) NQ.audio.efek('langkah');
      var akhir = jejak[jejak.length - 1];
      if (Math.abs(akhir.x - p.x) + Math.abs(akhir.y - p.y) > 1.5) {
        jejak.push({ x: p.x, y: p.y });
        if (jejak.length > 60) jejak.shift();
      }
    },

    sprite: function () {
      var info = NQ.data.aset.sheet['raka-jalan'];
      var kolom = info.frameDiam;
      if (p.gerak) kolom = info.urutanJalan[Math.floor(p.waktu * 8) % info.urutanJalan.length];
      var baris = info.baris[p.arah];
      return {
        dasar: p.y,
        gambar: function (ctx, ox, oy) {
          // bayangan lonjong di kaki
          ctx.fillStyle = 'rgba(20,16,40,0.22)';
          ctx.beginPath(); ctx.ellipse(ox + p.x, oy + p.y - 1, 8, 2.5, 0, 0, Math.PI * 2); ctx.fill();
          if (p.pose && !p.gerak) {
            var ia = NQ.data.aset.sheet['raka-aksi'];
            NQ.aset.frame(ctx, 'raka-aksi', ia.frame[p.pose] || 0, 0, ox + p.x - ia.w / 2, oy + p.y - ia.h + 1);
            return;
          }
          NQ.aset.frame(ctx, 'raka-jalan', kolom, baris, ox + p.x - info.w / 2, oy + p.y - info.h + 1);
        }
      };
    }
  };
})(window.NQ = window.NQ || {});
