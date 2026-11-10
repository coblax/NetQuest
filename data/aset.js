/*
 * Daftar aset yang dimuat oleh js/core/aset-loader.js.
 * Kunci = nama yang dipakai di kode; nilai = path relatif dari index.html.
 * Aset yang belum ada cukup tidak ditulis; game memakai kotak warna pengganti.
 *
 * Skala acuan: 1 tile = 16 px, Raka berdiri = 48 px, Pak Bima = 52 px, Pingo = 30 px.
 */
window.NQ = window.NQ || {};
NQ.data = NQ.data || {};

NQ.data.aset = {
  gambar: {
    // ----- Latar -----
    'g1-judul':     'assets/img/latar/g1-layar-judul.jpg',
    'logo':         'assets/img/latar/logo-netquest.png',

    // ----- Karakter -----
    'raka-jalan':   'assets/img/karakter/raka/raka-jalan.png',
    'raka-aksi':    'assets/img/karakter/raka/raka-aksi.png',
    'raka-potret':  'assets/img/karakter/raka/raka-potret.png',
    'pingo':        'assets/img/karakter/pingo/pingo.png',
    'pingo-potret': 'assets/img/karakter/pingo/pingo-potret.png',
    'glitch-kecil': 'assets/img/karakter/glitch/glitch-kecil.png',

    // ----- NPC -----
    'c1-pak-bima':        'assets/img/npc/c1-pak-bima.png',
    'c1-pak-bima-potret': 'assets/img/npc/c1-pak-bima-potret.png',

    // ----- Tile (16 px; dinding dan pintu setinggi 48 px) -----
    'lantai-keramik-putih-1': 'assets/img/tile/lantai-keramik-putih-1.png',
    'lantai-keramik-putih-2': 'assets/img/tile/lantai-keramik-putih-2.png',
    'lantai-keramik-gelap-1': 'assets/img/tile/lantai-keramik-gelap-1.png',
    'lantai-kayu-1':          'assets/img/tile/lantai-kayu-1.png',
    'dinding-putih':          'assets/img/tile/dinding-putih.png',
    'dinding-jendela':        'assets/img/tile/dinding-jendela.png',
    'dinding-krem':           'assets/img/tile/dinding-krem.png',

    // ----- Perabot Kantor Kepala Lab -----
    'papan-tulis':     'assets/img/perabot/kantor/papan-tulis.png',
    'jam-dinding':     'assets/img/perabot/kantor/jam-dinding.png',
    'ventilasi':       'assets/img/perabot/kantor/ventilasi.png',
    'ac':              'assets/img/perabot/kantor/ac.png',
    'meja-kepala-lab': 'assets/img/perabot/kantor/meja-kepala-lab.png',
    'lemari-arsip':    'assets/img/perabot/kantor/lemari-arsip.png',
    'lemari-besi':     'assets/img/perabot/kantor/lemari-besi.png',
    'dispenser':       'assets/img/perabot/kantor/dispenser.png',
    'tanaman':         'assets/img/perabot/kantor/tanaman.png',
    'rak-buku-besar':  'assets/img/perabot/kantor/rak-buku-besar.png',
    'rak-buku-kecil':  'assets/img/perabot/kantor/rak-buku-kecil.png',
    'rak-server-1':    'assets/img/perabot/server/rak-server-1.png',
    'rak-server-2':    'assets/img/perabot/server/rak-server-2.png',

    // ----- Perabot Lorong Utama (D10) -----
    'loker-tertutup':    'assets/img/perabot/lorong/loker-tertutup.png',
    'loker-terbuka':     'assets/img/perabot/lorong/loker-terbuka.png',
    'pintu-lorong':      'assets/img/perabot/lorong/pintu-lorong.png',
    'papan-pengumuman':  'assets/img/perabot/lorong/papan-pengumuman.png',
    'bangku':            'assets/img/perabot/lorong/bangku.png',
    'tempat-sampah':     'assets/img/perabot/lorong/tempat-sampah.png',
    'tanaman-besar':     'assets/img/perabot/lorong/tanaman-besar.png',

    // ----- Ikon alat (32 px) -----
    'ikon-alat': 'assets/img/ikon/f1-alat.png',

    // ----- Objek cerita -----
    'tas-teknisi': 'assets/img/objek/tas-teknisi.png',

    // ===== Babak 1 =====
    'g2-peta':            'assets/img/latar/g2-peta-sekolah.jpg',
    // NPC
    'c2-kak-dimas':        'assets/img/npc/c2-kak-dimas.png',
    'c2-kak-dimas-potret': 'assets/img/npc/c2-kak-dimas-potret.png',
    'c3-bu-wati':          'assets/img/npc/c3-bu-wati.png',
    'c3-bu-wati-potret':   'assets/img/npc/c3-bu-wati-potret.png',
    'c4-pak-hasan':        'assets/img/npc/c4-pak-hasan.png',
    'c4-pak-hasan-potret': 'assets/img/npc/c4-pak-hasan-potret.png',
    'siswa-kesal':         'assets/img/npc/siswa-kesal.png',
    // Lab dan ruang guru
    'meja-4pc':        'assets/img/perabot/lab/meja-4pc.png',
    'meja-panjang':    'assets/img/perabot/lab/meja-panjang.png',
    'monitor':         'assets/img/perabot/lab/monitor.png',
    'meja-guru-buku':  'assets/img/perabot/lab/meja-guru-buku.png',
    'meja-guru-pc':    'assets/img/perabot/lab/meja-guru-pc.png',
    'lemari-laci':     'assets/img/perabot/lab/lemari-laci.png',
    'lemari-kaca':     'assets/img/perabot/lab/lemari-kaca.png',
    'rak-map':         'assets/img/perabot/lab/rak-map.png',
    'kotak-alat':      'assets/img/perabot/lab/kotak-alat.png',
    'tanaman-pot':     'assets/img/perabot/lab/tanaman-pot.png',
    // Ruang server
    'rak-switch':      'assets/img/perabot/server/rak-switch.png',
    'rak-kosong':      'assets/img/perabot/server/rak-kosong.png',
    'kipas':           'assets/img/perabot/server/kipas.png',
    'pemadam':         'assets/img/perabot/server/pemadam.png',
    'gulungan-kabel':  'assets/img/perabot/server/gulungan-kabel.png',
    // Objek
    'kabel-digigit':   'assets/img/objek/kabel-digigit.png',
    'kilau':           'assets/img/objek/kilau.png',
    'tikus':           'assets/img/objek/tikus.png',
    'lubang-tikus':    'assets/img/objek/lubang-tikus.png',
    // Tampak dekat
    'cpu-belakang-mati':  'assets/img/dekat/cpu-belakang-mati.png',
    'cpu-belakang-nyala': 'assets/img/dekat/cpu-belakang-nyala.png',
    'konektor-setengah':  'assets/img/dekat/konektor-setengah.png',
    'konektor-rapat':     'assets/img/dekat/konektor-rapat.png',
    'tester-induk':       'assets/img/dekat/tester-induk.png',
    'tester-remote':      'assets/img/dekat/tester-remote.png',

    // ===== Babak 2 =====
    'c5-bu-rina':          'assets/img/npc/c5-bu-rina.png',
    'c5-bu-rina-potret':   'assets/img/npc/c5-bu-rina-potret.png',
    'c6-pak-joko':         'assets/img/npc/c6-pak-joko.png',
    'c6-pak-joko-potret':  'assets/img/npc/c6-pak-joko-potret.png',
    'c7-pak-hendra':       'assets/img/npc/c7-pak-hendra.png',
    'c7-pak-hendra-potret':'assets/img/npc/c7-pak-hendra-potret.png',
    'kurir':               'assets/img/karakter/kurir.png',
    // Perpustakaan
    'rak-tinggi':      'assets/img/perabot/perpus/rak-tinggi.png',
    'rak-lemari':      'assets/img/perabot/perpus/rak-lemari.png',
    'troli-buku':      'assets/img/perabot/perpus/troli-buku.png',
    'meja-baca':       'assets/img/perabot/perpus/meja-baca.png',
    'meja-sirkulasi':  'assets/img/perabot/perpus/meja-sirkulasi.png',
    'pc-katalog':      'assets/img/perabot/perpus/pc-katalog.png',
    // Perangkat dan objek
    'printer':           'assets/img/objek/printer.png',
    'router-hijau':      'assets/img/objek/router-hijau.png',
    'lemari-router':     'assets/img/objek/lemari-router.png',
    'lemari-router-buka':'assets/img/objek/lemari-router-buka.png',
    'laptop-terminal':   'assets/img/objek/laptop-terminal.png',
    'rumah':             'assets/img/objek/rumah.png',
    'petir':             'assets/img/objek/petir.png',
    'sakelar':           'assets/img/objek/sakelar.png',
    'layar-pc07-putus':      'assets/img/dekat/layar-pc07-putus.png',       // P17: layar PC 07, ikon LAN merah
    'layar-pc07-tersambung': 'assets/img/dekat/layar-pc07-tersambung.png',  // P17: layar PC 07, ikon LAN hijau
    'jendela-pengaturan':'assets/img/dekat/jendela-pengaturan.png',
    // Ruang Multimedia
    'meja-editing':     'assets/img/perabot/multimedia/meja-editing.png',
    'kursi-editing':    'assets/img/perabot/multimedia/kursi-editing.png',
    'rak-kamera':       'assets/img/perabot/multimedia/rak-kamera.png',
    'tripod':           'assets/img/perabot/multimedia/tripod.png',
    'layar-hijau':      'assets/img/perabot/multimedia/layar-hijau.png',
    'softbox':          'assets/img/perabot/multimedia/softbox.png',
    'speaker':          'assets/img/perabot/multimedia/speaker.png',
    'lemari-aksesori':  'assets/img/perabot/multimedia/lemari-aksesori.png',
    'poster':           'assets/img/perabot/multimedia/poster.png',

    // ===== Babak 3 =====
    'c8-rara':          'assets/img/npc/c8-rara.png',
    'c8-rara-potret':   'assets/img/npc/c8-rara-potret.png',
    'panitia-1':        'assets/img/npc/panitia-1.png',
    'panitia-2':        'assets/img/npc/panitia-2.png',
    'panitia-3':        'assets/img/npc/panitia-3.png',
    'panitia-4':        'assets/img/npc/panitia-4.png',
    'panggung':         'assets/img/perabot/aula/panggung.png',
    'podium':           'assets/img/perabot/aula/podium.png',
    'bendera':          'assets/img/perabot/aula/bendera.png',
    'speaker-berdiri':  'assets/img/perabot/aula/speaker-berdiri.png',
    'kursi-lipat':      'assets/img/perabot/aula/kursi-lipat.png',
    'kursi-deret-5':    'assets/img/perabot/aula/kursi-deret-5.png',
    'pilar':            'assets/img/perabot/aula/pilar.png',
    'tanaman-aula':     'assets/img/perabot/aula/tanaman-aula.png',
    'lantai-karpet':    'assets/img/tile/lantai-karpet.png',
    'lantai-beton':     'assets/img/tile/lantai-beton.png',
    'dinding-beton':    'assets/img/tile/dinding-beton.png',
    'troli-ap-hijau':   'assets/img/objek/troli-ap-hijau.png',
    'troli-ap-merah':   'assets/img/objek/troli-ap-merah.png',
    'gembok':           'assets/img/objek/gembok.png',
    'pintu-gudang':     'assets/img/objek/pintu-gudang.png',
    'pintu-gudang-buka':'assets/img/objek/pintu-gudang-buka.png',
    'jejak-ungu':       'assets/img/objek/jejak-ungu.png',
    'wifi-analyzer':    'assets/img/dekat/wifi-analyzer.png',
    'ap-dinding-hijau': 'assets/img/objek/ap-dinding-hijau.png',
    'router-tua':       'assets/img/objek/router-tua.png',

    // ===== Klimaks: Gudang =====
    'glitch-besar':     'assets/img/karakter/glitch/glitch-besar.png',
    'glitch-potret':    'assets/img/karakter/glitch/glitch-potret.png',
    'kardus':           'assets/img/perabot/gudang/kardus.png',
    'kardus-terbuka':   'assets/img/perabot/gudang/kardus-terbuka.png',
    'tumpukan-kardus':  'assets/img/perabot/gudang/tumpukan-kardus.png',
    'rak-gudang-kosong':'assets/img/perabot/gudang/rak-kosong.png',
    'rak-isi':          'assets/img/perabot/gudang/rak-isi.png',
    'rak-sarang':       'assets/img/perabot/gudang/rak-sarang.png',
    'meja-tua':         'assets/img/perabot/gudang/meja-tua.png',
    'tumpukan-monitor': 'assets/img/perabot/gudang/tumpukan-monitor.png',
    'pc-tua':           'assets/img/perabot/gudang/pc-tua.png',
    'sarang-laba':      'assets/img/perabot/gudang/sarang-laba.png',
    'lemari-besi-tua':  'assets/img/perabot/gudang/lemari-besi.png',
    'rak-alat':         'assets/img/perabot/gudang/rak-alat.png',
    'gulungan-merah':   'assets/img/perabot/gudang/gulungan-merah.png',
    'tangga':           'assets/img/perabot/gudang/tangga.png',
    'kain-penutup':     'assets/img/perabot/gudang/kain-penutup.png',
    'peti-kayu':        'assets/img/perabot/gudang/peti-kayu.png',
    'palet':            'assets/img/perabot/gudang/palet.png',
    'pemadam-gudang':   'assets/img/perabot/gudang/pemadam.png',

    // ===== Epilog: Ruang Kepala Sekolah =====
    'c9-ibu-kepsek':        'assets/img/npc/c9-ibu-kepsek.png',
    'c9-ibu-kepsek-potret': 'assets/img/npc/c9-ibu-kepsek-potret.png',
    'meja-kepsek':      'assets/img/perabot/kepsek/meja-kepsek.png',
    'kursi-kepsek':     'assets/img/perabot/kepsek/kursi-kepsek.png',
    'sofa-panjang':     'assets/img/perabot/kepsek/sofa-panjang.png',
    'kursi-sofa-kiri':  'assets/img/perabot/kepsek/kursi-sofa-kiri.png',
    'kursi-sofa-kanan': 'assets/img/perabot/kepsek/kursi-sofa-kanan.png',
    'meja-kaca':        'assets/img/perabot/kepsek/meja-kaca.png',
    'lemari-piala':     'assets/img/perabot/kepsek/lemari-piala.png',
    'bendera-kepsek':   'assets/img/perabot/kepsek/bendera.png',
    'papan-visi':       'assets/img/perabot/kepsek/papan-visi.png',
    'jam-bulat':        'assets/img/perabot/kepsek/jam-bulat.png',
    'tanaman-keramik':  'assets/img/perabot/kepsek/tanaman-keramik.png',
    'karpet':           'assets/img/perabot/kepsek/karpet.png',
    // Sertifikat, papan klip, stempel, dan bintang besar dipakai di HTML Epilog; didaftarkan agar dimuat lebih dulu.
    'ui-sertifikat':    'assets/img/ui/sertifikat.png',
    'ui-papan-klip':    'assets/img/ui/papan-klip.png',
    'ui-bintang-emas':  'assets/img/ui/bintang-emas.png',
    'ui-bintang-perak': 'assets/img/ui/bintang-perak.png',
    'ui-bintang-abu':   'assets/img/ui/bintang-abu.png',

    // ===== Kartu Konsep (data/konsep.js) =====
    'konsep-lapisan':       'assets/img/konsep/lapisan.jpg',
    'konsep-k1-konektor-1': 'assets/img/konsep/k1-konektor-1.jpg',
    'konsep-k1-konektor-2': 'assets/img/konsep/k1-konektor-2.jpg',
    'konsep-k2-crimping-1': 'assets/img/konsep/k2-crimping-1.jpg',
    'konsep-k2-crimping-2': 'assets/img/konsep/k2-crimping-2.jpg',
    'konsep-k2-crimping-3': 'assets/img/konsep/k2-crimping-3.jpg',
    'konsep-k3-topologi':   'assets/img/konsep/k3-topologi.jpg',
    'konsep-k4-ip-1':       'assets/img/konsep/k4-ip-1.jpg',
    'konsep-k4-ip-2':       'assets/img/konsep/k4-ip-2.jpg',
    'konsep-k5-dhcp-1':     'assets/img/konsep/k5-dhcp-1.jpg',
    'konsep-k5-dhcp-2':     'assets/img/konsep/k5-dhcp-2.jpg',
    'konsep-k6-dns-1':      'assets/img/konsep/k6-dns-1.jpg',
    'konsep-k6-dns-2':      'assets/img/konsep/k6-dns-2.jpg',
    'konsep-k6-dns-3':      'assets/img/konsep/k6-dns-3.jpg',
    'konsep-k7-sinyal-1':   'assets/img/konsep/k7-sinyal-1.jpg',
    'konsep-k7-sinyal-2':   'assets/img/konsep/k7-sinyal-2.jpg',
    'konsep-k8-mac-1':      'assets/img/konsep/k8-mac-1.jpg',
    'konsep-k8-mac-2':      'assets/img/konsep/k8-mac-2.jpg',
    'konsep-k9-amankan-1':  'assets/img/konsep/k9-amankan-1.jpg',
    'konsep-k9-amankan-2':  'assets/img/konsep/k9-amankan-2.jpg',
    'konsep-k9-amankan-3':  'assets/img/konsep/k9-amankan-3.jpg',
    'konsep-k9-amankan-4':  'assets/img/konsep/k9-amankan-4.jpg',
    // Ikon 6 langkah Jurnal (ringkasan kasus dan Jurnal)
    'langkah-gejala':     'assets/img/ikon/langkah/gejala.png',
    'langkah-dugaan':     'assets/img/ikon/langkah/dugaan.png',
    'langkah-uji':        'assets/img/ikon/langkah/uji.png',
    'langkah-perbaikan':  'assets/img/ikon/langkah/perbaikan.png',
    'langkah-verifikasi': 'assets/img/ikon/langkah/verifikasi.png',
    'langkah-catat':      'assets/img/ikon/langkah/catat.png'
  },

  // Bingkai antarmuka (aset P6) dipakai lewat CSS border-image di css/style.css:
  // assets/img/ui/bingkai-dialog.png, bingkai-panel.png, bingkai-tombol.png,
  // bingkai-tombol-pilih.png, bingkai-hud.png, kartu-teknisi.png

  // Ikon antarmuka (16 px) dan tombol sentuh (32 px) dipakai langsung di HTML lewat <img>.
  ikonUI: 'assets/img/ikon/ui/',

  // Susunan frame lembar sprite.
  sheet: {
    'raka-jalan': { w: 32, h: 52, kolom: 3, baris: { bawah: 0, atas: 1, kiri: 2, kanan: 3 },
                    urutanJalan: [0, 1, 2, 1], frameDiam: 1 },
    'raka-aksi':  { w: 52, h: 52, frame: { merunduk: 0, pakaiAlat: 1, dorong: 2, pusing: 3, senang: 4 } },
    'pingo':      { w: 28, h: 32, frame: { melayang: 0, mati: 1, pindai: 2 },
                    catatan: 'Gerak naik-turun dibuat dengan kode (geser y 1-2 px), bukan frame terpisah.' },
    'tas-teknisi': { w: 23, h: 22, frame: { biasa: 0, berkilau: 1 } },
    'monitor':     { w: 18, h: 18, frame: { normal: 0, silang: 1, mati: 2 } },
    'tikus':       { w: 16, h: 10, frame: { lari1: 0, lari2: 1 } },
    'kurir':       { w: 24, h: 24, frame: { jalan1: 0, jalan2: 1, menunggu: 2, mengetuk: 3 } },
    'rumah':       { w: 14, h: 14, frame: { biru: 0, merah: 1, oranye: 2, hijau: 3 } },
    'gembok':      { w: 16, h: 16, frame: { k0: 0, k1: 1, k2: 2, k3: 3, k4: 4 } },
    'glitch-kecil': { w: 33, h: 26, frame: { seringai: 0, kabur: 1, menghilang: 2 },
                      catatan: 'Frame menghilang sudah setengah transparan.' },
    'glitch-besar': { w: 100, h: 88, frame: { utuh: 0, retak: 1, pecah: 2, hancur: 3 } },
    'ikon-alat':  { w: 32, h: 32, urutan: ['lan-tester', 'crimping-tool', 'konektor-rj45', 'kartu-akses',
                                           'laptop', 'wifi-analyzer', 'senter', 'keping-glitch'] }
  },

  musik: {
    'tema':       'assets/audio/musik/tema.m4a',        // layar judul
    'eksplorasi': 'assets/audio/musik/eksplorasi.m4a',  // Prolog dan saat menjelajah
    'misteri':    'assets/audio/musik/misteri.m4a',     // jejak Glitch ditemukan (Kasus 3, 5, 6, 8)
    'klimaks':    'assets/audio/musik/klimaks.m4a',     // pertarungan dengan Glitch di gudang
    'kemenangan': 'assets/audio/musik/kemenangan.m4a'   // Epilog: laporan dan sertifikat
  },
  // Efek suara 8-bit (WAV, dibuat dengan sintesis). volume = 0..1
  sfx: {
    'bip-pingo':      'assets/audio/sfx/bip-pingo.wav',
    'pingo-menyala':  'assets/audio/sfx/pingo-menyala.wav',
    'dengung-server': 'assets/audio/sfx/dengung-server.wav',   // suara latar berulang
    'langkah':        'assets/audio/sfx/langkah.wav',
    'tas-dibuka':     'assets/audio/sfx/tas-dibuka.wav',
    'kertas':         'assets/audio/sfx/kertas.wav',
    'menu-pilih':     'assets/audio/sfx/menu-pilih.wav',
    'teks-blip':      'assets/audio/sfx/teks-blip.wav',

    // Babak 1 dan umum
    'klik-konektor':    'assets/audio/sfx/klik-konektor.wav',     // konektor masuk sampai klik
    'potong-kabel':     'assets/audio/sfx/potong-kabel.wav',
    'crimp':            'assets/audio/sfx/crimp.wav',
    'lan-tester-ok':    'assets/audio/sfx/lan-tester-ok.wav',     // 8 bip naik, pin 1 sampai 8
    'lan-tester-salah': 'assets/audio/sfx/lan-tester-salah.wav',
    'cicit-tikus':      'assets/audio/sfx/cicit-tikus.wav',
    'kartu-akses':      'assets/audio/sfx/kartu-akses.wav',
    'pintu-buka':       'assets/audio/sfx/pintu-buka.wav',
    'alarm':            'assets/audio/sfx/alarm.wav',
    'desis-glitch':     'assets/audio/sfx/desis-glitch.wav',
    'ambil-barang':     'assets/audio/sfx/ambil-barang.wav',      // alat atau keping diterima
    'langkah-jurnal':   'assets/audio/sfx/langkah-jurnal.wav',    // kotak Jurnal tercentang
    'salah':            'assets/audio/sfx/salah.wav',
    'energi-turun':     'assets/audio/sfx/energi-turun.wav',
    'bintang':          'assets/audio/sfx/bintang.wav',
    'kasus-selesai':    'assets/audio/sfx/kasus-selesai.wav',

    // Babak 2 (Kasus 4-6)
    'petir-kecil':      'assets/audio/sfx/petir-kecil.wav',       // IP bentrok
    'bip-error':        'assets/audio/sfx/bip-error.wav',         // PC gagal tersambung
    'ketuk-lemari':     'assets/audio/sfx/ketuk-lemari.wav',      // kurir DHCP tertahan
    'ketik':            'assets/audio/sfx/ketik.wav',             // mengetik di terminal
    'terminal-ok':      'assets/audio/sfx/terminal-ok.wav',
    'terminal-gagal':   'assets/audio/sfx/terminal-gagal.wav',
    'sakelar':          'assets/audio/sfx/sakelar.wav',           // layanan DHCP dinyalakan
    'kurir-langkah':    'assets/audio/sfx/kurir-langkah.wav',
    'kurir-antar':      'assets/audio/sfx/kurir-antar.wav',       // alamat IP diterima
    'printer-cetak':    'assets/audio/sfx/printer-cetak.wav',

    // Babak 3 (Kasus 7-8)
    'keramaian':        'assets/audio/sfx/keramaian.wav',         // suara latar aula, berulang
    'roda-troli':       'assets/audio/sfx/roda-troli.wav',        // berulang selama troli didorong
    'sinyal-naik':      'assets/audio/sfx/sinyal-naik.wav',       // zona mati berubah hijau
    'kanal-bentrok':    'assets/audio/sfx/kanal-bentrok.wav',
    'analyzer-bip':     'assets/audio/sfx/analyzer-bip.wav',      // game mengatur cepat-lambat bip
    'perangkat-asing':  'assets/audio/sfx/perangkat-asing.wav',
    'gembok-keping':    'assets/audio/sfx/gembok-keping.wav',
    'gembok-buka':      'assets/audio/sfx/gembok-buka.wav',
    'senter-nyala':     'assets/audio/sfx/senter-nyala.wav',
    'pindai-gelombang': 'assets/audio/sfx/pindai-gelombang.wav',  // sonar mode Pindai

    // Klimaks dan Epilog (Scene 12-13)
    'aksi-tepat':       'assets/audio/sfx/aksi-tepat.wav',        // aksi keamanan mengenai Glitch
    'glitch-tertawa':   'assets/audio/sfx/glitch-tertawa.wav',    // aksi keliru
    'glitch-pecah':     'assets/audio/sfx/glitch-pecah.wav',
    'kekuatan-turun':   'assets/audio/sfx/kekuatan-turun.wav',    // bar Kekuatan Glitch berkurang
    'cabut-router':     'assets/audio/sfx/cabut-router.wav',
    'blokir-mac':       'assets/audio/sfx/blokir-mac.wav',
    'kunci-wpa':        'assets/audio/sfx/kunci-wpa.wav',
    'sandi-rakit':      'assets/audio/sfx/sandi-rakit.wav',       // kepingan sandi dipasang
    'tepuk-tangan':     'assets/audio/sfx/tepuk-tangan.wav',
    'sertifikat':       'assets/audio/sfx/sertifikat.wav'
  },
  volume: { 'langkah': 0.35, 'teks-blip': 0.3, 'dengung-server': 0.35, 'alarm': 0.45, 'cicit-tikus': 0.5,
            'keramaian': 0.3, 'roda-troli': 0.35, 'analyzer-bip': 0.4 }
};
