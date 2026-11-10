/*
 * Scene 9 · Kasus 6 · Ruang Multimedia: DNS laptop dibelokkan ke alamat asing 10.10.10.66.
 * 6 langkah: Gejala dan Dugaan (ping 8.8.8.8 berhasil, ping nama situs gagal -> masalah DNS)
 * -> Uji (nslookup gagal, ipconfig /all: DNS 10.10.10.66) -> Perbaikan (DNS adaptor otomatis)
 * -> Verifikasi (ipconfig /flushdns lalu ping nama situs berhasil) -> Catat. Keping 3: berkas ungu di laptop.
 * Salah: mengganti alamat IP laptop (energi -1); salah ketik perintah (diberi saran).
 */
(function (NQ) {
  var K = 'kasus-6';
  var LAPTOP = { x: 146, y: 84 };
  var jar = null;

  function b(n) { return NQ.progres.bendera(n); }

  function tugas(R) {
    if (NQ.progres.sudahSelesai(K)) return;
    if (!R.sudah('Gejala')) R.tugas('Buka terminal laptop: ping 8.8.8.8, lalu ping smkcendekia.sch.id');
    else if (!R.sudah('Uji')) R.tugas('Buktikan: nslookup, lalu ipconfig /all');
    else if (!R.sudah('Perbaikan')) R.tugas('Kembalikan DNS di pengaturan jaringan laptop');
    else if (!R.sudah('Verifikasi')) R.tugas('ipconfig /flushdns, lalu ping smkcendekia.sch.id');
    else if (!b('k6.keping')) R.tugas('Buka berkas keping_3.dat di laptop');
    else R.tugas('Selesaikan laporan');
  }

  function saatPerintah(R, ev) {
    if (ev === 'ping-ip-ok' && !b('k6.pingip')) { R.tandai('k6.pingip'); R.dialog('ping-ip-berhasil'); }
    else if (ev === 'ping-domain-gagal') {
      if (!R.sudah('Gejala')) R.dialog('ping-domain-gagal', function () {
        R.jurnal('Gejala', 'ping 8.8.8.8 berhasil, tetapi ping smkcendekia.sch.id gagal: situs sekolah tidak bisa dibuka.');
        R.jurnal('Dugaan', 'Internet lewat IP lancar; penerjemah nama ke IP (DNS) bermasalah.');
        tugas(R);
      });
      else if (R.sudah('Perbaikan') && !R.sudah('Verifikasi')) R.dialog('masih-gagal');
    } else if (ev === 'nslookup-gagal' && R.sudah('Gejala') && !b('k6.nslookup')) { R.tandai('k6.nslookup'); R.dialog('nslookup-gagal'); }
    else if (ev === 'ipconfig-all' && R.sudah('Gejala') && !R.sudah('Uji')) {
      R.dialog('dns-asing-tampil', function () {
        R.jurnal('Uji', 'nslookup gagal; ipconfig /all menunjukkan DNS Servers 10.10.10.66, bukan DNS sekolah.');
        tugas(R);
        NQ.kartuKonsep.tampil('k6-dns');
        NQ.terminal.segarkanOpsi();
      });
    } else if (ev === 'flushdns' && R.sudah('Perbaikan') && !b('k6.flush')) { R.tandai('k6.flush'); R.dialog('flushdns-ok'); }
    else if (ev === 'ping-domain-ok' && R.sudah('Perbaikan') && !R.sudah('Verifikasi')) {
      R.dialog('verifikasi-berhasil', function () {
        R.jurnal('Verifikasi', 'Setelah ipconfig /flushdns, ping dan nslookup smkcendekia.sch.id berhasil; situs sekolah terbuka.');
        tugas(R);
        NQ.audio.efek('desis-glitch');
        R.dialog('berkas-muncul', function () { NQ.terminal.segarkanOpsi(); });
      });
    }
  }

  function bukaTerminal(R) {
    NQ.terminal.buka({
      host: 'PC-MM-03', jaringan: jar,
      saatPerintah: function (ev) { saatPerintah(R, ev); },
      opsi: function () {
        var o = [{ label: 'Pengaturan jaringan (adaptor)', aksi: function () { bukaPengaturan(R); } }];
        if (R.sudah('Verifikasi') && !b('k6.keping')) o.push({ label: 'Buka berkas keping_3.dat', aksi: function () { NQ.terminal.tutup(); bukaBerkas(R); } });
        return o;
      }
    });
  }

  function gambarPengaturan(c) {
    c.fillStyle = '#10162e'; c.fillRect(0, 0, 220, 130);
    NQ.aset.utuh(c, 'jendela-pengaturan', 30, 4);
    c.fillStyle = '#1a1a1a'; c.font = 'bold 5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'; c.textAlign = 'left'; c.textBaseline = 'top';
    c.fillText('Properti IPv4 · Ethernet', 38, 10);
    c.font = '4.5px "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    c.fillText('Alamat IP: otomatis (192.168.10.142)', 64, 46);
    var otomatis = b('k6.dns');
    c.fillStyle = otomatis ? '#1a5a2a' : '#7a1f1f';
    c.fillText(otomatis ? 'DNS: otomatis (8.8.8.8)' : 'DNS manual: 10.10.10.66', 64, 79);
    c.fillStyle = '#1a1426';
    c.beginPath(); c.arc(43.5, 48.5, 2.2, 0, Math.PI * 2); c.fill();
    if (otomatis) { c.beginPath(); c.arc(43.5, 81.5, 2.2, 0, Math.PI * 2); c.fill(); }
  }

  function bukaPengaturan(R) {
    NQ.dekat.buka({
      judul: 'PENGATURAN JARINGAN LAPTOP', w: 220, h: 130, gambar: gambarPengaturan,
      keterangan: function () { return b('k6.dns') ? 'DNS kembali otomatis dari router sekolah.' : 'Seseorang mengisi DNS secara manual dengan alamat asing.'; },
      opsi: function () {
        return [
          { label: 'Dapatkan alamat DNS otomatis', nonaktif: b('k6.dns'), aksi: function () { perbaikiDNS(R); } },
          { label: 'Isi DNS manual: 8.8.8.8', nonaktif: b('k6.dns'), aksi: function () { perbaikiDNS(R); } },
          { label: 'Ubah alamat IP laptop', aksi: function () { R.salah('ganti-ip-laptop'); } }
        ];
      }
    });
  }

  function perbaikiDNS(R) {
    if (!R.sudah('Uji')) { if (!R.sudah('Gejala')) R.bicara('pingo', 'Kita belum tahu masalahnya. Coba ping dulu di terminal.'); else R.dialog('uji-dulu'); return; }
    R.tandai('k6.dns'); jar.dns = '8.8.8.8';
    NQ.audio.efek('sakelar');
    R.jurnal('Perbaikan', 'DNS adaptor laptop dikembalikan ke otomatis (8.8.8.8 dari router sekolah).');
    tugas(R);
    R.dialog('dns-otomatis', function () { NQ.dekat.tutup(); });
  }

  function bukaBerkas(R) {
    NQ.audio.musik('misteri'); NQ.audio.efek('desis-glitch');
    R.dialog('buka-berkas-ungu', function () {
      R.tandai('k6.keping');
      NQ.state.keping = Math.max(NQ.state.keping, 3);
      NQ.audio.efek('ambil-barang'); NQ.hud.segarkan();
      R.dialog('kasus-selesai', function () {
        R.jurnal('Catat', 'Penyebab: DNS laptop diisi manual ke 10.10.10.66 (alamat asing, ditemukan keping glitch 3). Solusi: DNS dikembalikan otomatis, cache dihapus dengan ipconfig /flushdns. Pencegahan: batasi hak admin di laptop.');
        NQ.kasus.selesai(K, {
          inti: 'DNS menerjemahkan nama domain menjadi alamat IP. Jika ping ke IP berhasil tetapi ping ke nama domain gagal, masalahnya ada di DNS.',
          berikut: 'kasus-7', tugas: 'Wi-Fi aula lemot: temui Rara di Aula',
          selesai: function () {
            NQ.audio.musik('eksplorasi');
            R.bicara('pingo', ['Babak 2 selesai! Tiga keping sudah kita kumpulkan.', 'Glitch masuk lewat Wi-Fi tanpa sandi. Babak 3 dimulai: Rara melapor Wi-Fi di Aula lemot!']);
          }
        });
      });
    });
  }

  NQ.ruang.buat({
    id: 'kasus-6', ruangan: 'ruang-multimedia', kasus: K, musik: 'eksplorasi',

    siapkan: function (R) {
      jar = { ip: '192.168.10.142', apipa: false, mask: '255.255.255.0', gateway: '192.168.10.1',
        dns: b('k6.dns') ? '8.8.8.8' : '10.10.10.66', mac: '00-1B-44-11-3A-B7', dhcpAktif: true, ipDhcp: '192.168.10.142',
        cacheNegatif: false, dnsBenar: function () { return jar.dns === '8.8.8.8'; } };
      R.objek({ id: 'laptop', x: 154, y: 140, jarak: 18, kilauX: LAPTOP.x + 11, kilauY: LAPTOP.y - 6,
        kotak: { x: LAPTOP.x - 4, y: LAPTOP.y - 4, w: 30, h: 26 },
        aksi: function () { bukaTerminal(R); },
        alat: { 'laptop': function () { bukaTerminal(R); } } });
      R.tambahNPC({ id: 'pak-hendra', x: 110, dasar: 196, bicara: function () {
        if (NQ.progres.sudahSelesai(K)) R.bicara('pak-hendra', 'Sekarang saya tahu bedanya masalah IP dan masalah DNS.');
        else R.bicara('pak-hendra', 'Laptopnya di meja editing. Silakan pakai terminalnya.');
      } });
      tugas(R);
    },

    saatMasuk: function (R) {
      if (NQ.progres.sudahSelesai(K) || b('k6.mulai')) return;
      R.tandai('k6.mulai');
      R.dialog('bicara-pak-hendra', function () { tugas(R); });
    },

    pindai: function (R) {
      NQ.audio.efek('pindai-gelombang'); NQ.pingo.setMode('pindai');
      R.setelah(3, function () { NQ.pingo.setMode('melayang'); });
      R.bicara('pingo', R.sudah('Uji') && !R.sudah('Perbaikan') ?
        'Buku telepon jaringan laptop ini menunjuk ke 10.10.10.66, alamat asing. Harus dikembalikan!' :
        'Pindai: laptop memakai alamat 192.168.10.142. Coba periksa lewat terminal.');
      return true;
    },

    // Semua langkah Kasus 6 dikerjakan di laptop meja editing
    tujuan: function (R) {
      if (NQ.progres.sudahSelesai(K)) return undefined;
      return 'laptop';
    },

    sprite: function () {
      return [{ dasar: 131, gambar: function (c, ox, oy) { NQ.aset.utuh(c, 'laptop-terminal', ox + LAPTOP.x, oy + LAPTOP.y); } }];
    }
  });
})(window.NQ = window.NQ || {});
