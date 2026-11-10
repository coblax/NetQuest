/*
 * Data ruangan: ukuran peta (tile 16 px), urutan terbuka, objek kunci, dan tata letak.
 * Sumber: Naskah Lengkap bagian A dan B.
 * terbukaSetelah: id tahap di data/kasus.js yang harus selesai dulu (null = terbuka sejak awal).
 * tata: tata letak dalam piksel logis.
 *   benda: { id, a: aset, x, dasar (garis bawah sprite), tinggiPadat (opsional, default 14), padat:false }
 *   pintuKeluar: area keset di bawah; menginjaknya = keluar ke Lorong Utama.
 */
window.NQ = window.NQ || {};
NQ.data = NQ.data || {};

NQ.data.ruangan = {
  'lorong-utama': {
    nama: 'Lorong Utama', lebar: 60, tinggi: 12, lantai: 'keramik-putih',
    terbukaSetelah: null,
    objek: ['pintu-semua-ruangan', 'loker-siswa', 'papan-pengumuman'],
    tata: {
      lantai: ['lantai-keramik-putih-1'], dinding: 'dinding-putih', tinggiDinding: 48,
      jendela: [], hiasan: [
        { a: 'papan-pengumuman', x: 160, y: 8 },
        { a: 'papan-pengumuman', x: 544, y: 8 },
        { a: 'jam-dinding', x: 452, y: 10 },
        { a: 'papan-pengumuman', x: 832, y: 8 }
      ],
      benda: [
        { id: 'loker-1', a: 'loker-tertutup', x: 64, dasar: 56, tinggiPadat: 8 },
        { id: 'loker-2', a: 'loker-terbuka', x: 258, dasar: 56, tinggiPadat: 8 },
        { id: 'loker-3', a: 'loker-tertutup', x: 354, dasar: 56, tinggiPadat: 8 },
        { id: 'loker-4', a: 'loker-tertutup', x: 642, dasar: 56, tinggiPadat: 8 },
        { id: 'loker-5', a: 'loker-terbuka', x: 738, dasar: 56, tinggiPadat: 8 },
        { id: 'tanaman-a', a: 'tanaman-besar', x: 4, dasar: 190 },
        { id: 'bangku-1', a: 'bangku', x: 150, dasar: 188 },
        { id: 'sampah-1', a: 'tempat-sampah', x: 300, dasar: 188 },
        { id: 'bangku-2', a: 'bangku', x: 480, dasar: 188 },
        { id: 'sampah-2', a: 'tempat-sampah', x: 640, dasar: 188 },
        { id: 'bangku-3', a: 'bangku', x: 760, dasar: 188 },
        { id: 'tanaman-b', a: 'tanaman-besar', x: 924, dasar: 190 }
      ],
      // Pintu di dinding atas, urut dari kiri. x = tepi kiri pintu (lebar 38).
      pintu: [
        { ruang: 'kantor-kepala-lab', x: 18 },
        { ruang: 'lab-komputer-1', x: 114 },
        { ruang: 'ruang-guru', x: 210 },
        { ruang: 'ruang-server', x: 306 },
        { ruang: 'perpustakaan', x: 402 },
        { ruang: 'ruang-tu', x: 498 },
        { ruang: 'ruang-multimedia', x: 594 },
        { ruang: 'aula', x: 690 },
        { ruang: 'lab-komputer-2', x: 786 },
        { ruang: 'ruang-kepsek', x: 882 }
      ],
      mulai: { x: 37, y: 70 }
    }
  },
  'kantor-kepala-lab': {
    nama: 'Kantor Kepala Lab', lebar: 20, tinggi: 14, lantai: 'keramik-putih',
    terbukaSetelah: null,
    objek: ['meja-pak-bima', 'tas-teknisi', 'pingo-mati', 'rak-server-kecil', 'rak-buku'],
    tata: {
      lantai: ['lantai-keramik-putih-1', 'lantai-keramik-putih-2'],
      dinding: 'dinding-putih',
      tinggiDinding: 48,
      jendela: [32, 240],
      hiasan: [
        { a: 'papan-tulis', x: 136, y: 8 },
        { a: 'jam-dinding', x: 200, y: 12 },
        { a: 'ac', x: 276, y: 6 }
      ],
      benda: [
        { id: 'rak-buku',  a: 'rak-buku-besar',  x: 6,   dasar: 62 },
        { id: 'lemari',    a: 'lemari-arsip',    x: 76,  dasar: 62 },
        { id: 'rak-kecil', a: 'rak-buku-kecil',  x: 206, dasar: 62 },
        { id: 'server-1',  a: 'rak-server-1',    x: 244, dasar: 64 },
        { id: 'server-2',  a: 'rak-server-2',    x: 280, dasar: 64 },
        { id: 'meja',      a: 'meja-kepala-lab', x: 128, dasar: 118 },
        { id: 'dispenser', a: 'dispenser',       x: 296, dasar: 132 },
        { id: 'tanaman-1', a: 'tanaman',         x: 6,   dasar: 216 },
        { id: 'tanaman-2', a: 'tanaman',         x: 290, dasar: 216 }
      ],
      pintuKeluar: { x: 140, y: 212, w: 40, h: 12 },
      mulai: { x: 160, y: 204 }
    }
  },
  'lab-komputer-1': {
    nama: 'Lab Komputer 1', lebar: 30, tinggi: 20, lantai: 'keramik-putih',
    terbukaSetelah: 'prolog',
    objek: ['pc-01..pc-24', 'pc-07', 'meja-guru', 'lemari'],
    // PC dinomori per baris dari kiri: baris 1 = PC 01-08, baris 2 = 09-16, baris 3 = 17-24.
    // PC 07 = baris 1, meja kanan, komputer ke-3.
    tata: {
      lantai: ['lantai-keramik-putih-1'], dinding: 'dinding-putih', tinggiDinding: 48,
      jendela: [24, 424],
      hiasan: [
        { a: 'papan-tulis', x: 216, y: 8 },
        { a: 'jam-dinding', x: 300, y: 12 },
        { a: 'ac', x: 120, y: 6 }
      ],
      benda: [
        { id: 'lemari-kaca', a: 'lemari-kaca', x: 360, dasar: 62, tinggiPadat: 10 },
        { id: 'rak-map', a: 'rak-map', x: 400, dasar: 62, tinggiPadat: 10 },
        { id: 'meja-1a', a: 'meja-4pc', x: 48,  dasar: 128, tinggiPadat: 34 },
        { id: 'meja-1b', a: 'meja-4pc', x: 264, dasar: 128, tinggiPadat: 34 },
        { id: 'meja-2a', a: 'meja-4pc', x: 48,  dasar: 196, tinggiPadat: 34 },
        { id: 'meja-2b', a: 'meja-4pc', x: 264, dasar: 196, tinggiPadat: 34 },
        { id: 'meja-3a', a: 'meja-4pc', x: 48,  dasar: 264, tinggiPadat: 34 },
        { id: 'meja-3b', a: 'meja-4pc', x: 264, dasar: 264, tinggiPadat: 34 },
        { id: 'meja-guru', a: 'meja-guru-pc', x: 396, dasar: 306, tinggiPadat: 20 },
        { id: 'tanaman-1', a: 'tanaman-pot', x: 6, dasar: 318 },
        { id: 'tanaman-2', a: 'tanaman-pot', x: 452, dasar: 120 }
      ],
      pintuKeluar: { x: 220, y: 308, w: 40, h: 12 },
      mulai: { x: 240, y: 300 }
    }
  },
  'ruang-guru': {
    nama: 'Ruang Guru', lebar: 24, tinggi: 16, lantai: 'keramik-putih',
    terbukaSetelah: 'kasus-1',
    objek: ['meja-pak-hasan', 'lubang-tikus', 'kotak-alat', 'meja-crimping'],
    tata: {
      lantai: ['lantai-keramik-putih-1'], dinding: 'dinding-krem', tinggiDinding: 48,
      jendela: [40, 200],
      hiasan: [
        { a: 'jam-dinding', x: 150, y: 12 },
        { a: 'lubang-tikus', x: 336, y: 40 }
      ],
      benda: [
        { id: 'lemari-laci', a: 'lemari-laci', x: 8, dasar: 62, tinggiPadat: 10 },
        { id: 'rak-map', a: 'rak-map', x: 270, dasar: 62, tinggiPadat: 10 },
        { id: 'meja-1', a: 'meja-guru-buku', x: 40, dasar: 112, tinggiPadat: 22 },
        { id: 'meja-2', a: 'meja-guru-buku', x: 150, dasar: 112, tinggiPadat: 22 },
        { id: 'meja-3', a: 'meja-guru-buku', x: 40, dasar: 172, tinggiPadat: 22 },
        { id: 'meja-4', a: 'meja-guru-buku', x: 150, dasar: 172, tinggiPadat: 22 },
        { id: 'meja-hasan', a: 'meja-guru-pc', x: 272, dasar: 172, tinggiPadat: 22 },
        { id: 'meja-crimping', a: 'meja-panjang', x: 16, dasar: 236, tinggiPadat: 18 },
        { id: 'dispenser', a: 'dispenser', x: 356, dasar: 230 },
        { id: 'tanaman-1', a: 'tanaman-pot', x: 270, dasar: 250 }
      ],
      pintuKeluar: { x: 172, y: 244, w: 40, h: 12 },
      mulai: { x: 192, y: 236 }
    }
  },
  'ruang-server': {
    nama: 'Ruang Server', lebar: 18, tinggi: 14, lantai: 'keramik-gelap',
    terbukaSetelah: 'kasus-2', butuhAlat: 'kartu-akses',
    objek: ['rak-server', 'switch-24-port', 'patch-panel', 'ac', 'pemadam-api'],
    tata: {
      lantai: ['lantai-keramik-gelap-1'], dinding: 'dinding-putih', tinggiDinding: 48,
      jendela: [],
      hiasan: [
        { a: 'ac', x: 196, y: 6 },
        { a: 'ventilasi', x: 52, y: 14 }
      ],
      benda: [
        { id: 'server-1', a: 'rak-server-1', x: 8, dasar: 96, tinggiPadat: 20 },
        { id: 'server-2', a: 'rak-server-2', x: 48, dasar: 96, tinggiPadat: 20 },
        { id: 'rak-switch', a: 'rak-switch', x: 126, dasar: 96, tinggiPadat: 20 },
        { id: 'server-3', a: 'rak-server-1', x: 196, dasar: 96, tinggiPadat: 20 },
        { id: 'rak-kosong', a: 'rak-kosong', x: 236, dasar: 96, tinggiPadat: 20 },
        { id: 'pemadam', a: 'pemadam', x: 6, dasar: 210 },
        { id: 'gulungan', a: 'gulungan-kabel', x: 40, dasar: 206 },
        { id: 'kipas', a: 'kipas', x: 260, dasar: 200 }
      ],
      pintuKeluar: { x: 124, y: 212, w: 40, h: 12 },
      mulai: { x: 144, y: 204 }
    }
  },
  'perpustakaan': {
    nama: 'Perpustakaan', lebar: 28, tinggi: 20, lantai: 'kayu',
    terbukaSetelah: 'kasus-3',
    objek: ['rak-buku', 'meja-sirkulasi', 'pc-katalog', 'printer-baru'],
    tata: {
      lantai: ['lantai-kayu-1'], dinding: 'dinding-krem', tinggiDinding: 48,
      jendela: [104, 312],
      hiasan: [{ a: 'jam-dinding', x: 216, y: 12 }],
      benda: [
        { id: 'rak-a1', a: 'rak-tinggi', x: 8, dasar: 64, tinggiPadat: 10 },
        { id: 'rak-a2', a: 'rak-lemari', x: 66, dasar: 64, tinggiPadat: 10 },
        { id: 'rak-a3', a: 'rak-tinggi', x: 150, dasar: 64, tinggiPadat: 10 },
        { id: 'rak-a4', a: 'rak-lemari', x: 250, dasar: 64, tinggiPadat: 10 },
        { id: 'rak-a5', a: 'rak-tinggi', x: 384, dasar: 64, tinggiPadat: 10 },
        { id: 'rak-b1', a: 'rak-tinggi', x: 236, dasar: 136, tinggiPadat: 16 },
        { id: 'rak-b2', a: 'rak-tinggi', x: 300, dasar: 136, tinggiPadat: 16 },
        { id: 'rak-b3', a: 'rak-lemari', x: 364, dasar: 136, tinggiPadat: 16 },
        { id: 'rak-c1', a: 'rak-tinggi', x: 236, dasar: 206, tinggiPadat: 16 },
        { id: 'rak-c2', a: 'rak-lemari', x: 300, dasar: 206, tinggiPadat: 16 },
        { id: 'rak-c3', a: 'rak-tinggi', x: 364, dasar: 206, tinggiPadat: 16 },
        { id: 'meja-baca-1', a: 'meja-baca', x: 40, dasar: 150, tinggiPadat: 24 },
        { id: 'meja-baca-2', a: 'meja-baca', x: 120, dasar: 150, tinggiPadat: 24 },
        { id: 'troli', a: 'troli-buku', x: 404, dasar: 270 },
        { id: 'sirkulasi', a: 'meja-sirkulasi', x: 20, dasar: 262, tinggiPadat: 18 },
        { id: 'pc-katalog', a: 'pc-katalog', x: 104, dasar: 262, tinggiPadat: 18 },
        { id: 'meja-printer', a: 'meja-baca', x: 150, dasar: 262, tinggiPadat: 18 }
      ],
      pintuKeluar: { x: 204, y: 308, w: 40, h: 12 },
      mulai: { x: 224, y: 300 }
    }
  },
  'ruang-tu': {
    nama: 'Ruang TU', lebar: 22, tinggi: 14, lantai: 'keramik-putih',
    terbukaSetelah: 'kasus-4',
    objek: ['pc-tu-1..6', 'lemari-router', 'meja-pak-joko', 'lemari-arsip'],
    tata: {
      lantai: ['lantai-keramik-putih-1'], dinding: 'dinding-putih', tinggiDinding: 48,
      jendela: [40, 168],
      hiasan: [{ a: 'jam-dinding', x: 120, y: 12 }, { a: 'sakelar', x: 330, y: 26 }],
      benda: [
        { id: 'lemari-arsip', a: 'lemari-arsip', x: 8, dasar: 64, tinggiPadat: 10 },
        { id: 'lemari-besi', a: 'lemari-besi', x: 230, dasar: 64, tinggiPadat: 10 },
        { id: 'meja-1', a: 'meja-guru-pc', x: 24, dasar: 118, tinggiPadat: 22 },
        { id: 'meja-2', a: 'meja-guru-pc', x: 116, dasar: 118, tinggiPadat: 22 },
        { id: 'meja-3', a: 'meja-guru-pc', x: 208, dasar: 118, tinggiPadat: 22 },
        { id: 'meja-4', a: 'meja-guru-pc', x: 24, dasar: 178, tinggiPadat: 22 },
        { id: 'meja-5', a: 'meja-guru-pc', x: 116, dasar: 178, tinggiPadat: 22 },
        { id: 'meja-6', a: 'meja-guru-pc', x: 208, dasar: 178, tinggiPadat: 22 },
        { id: 'tanaman', a: 'tanaman-pot', x: 318, dasar: 216 }
      ],
      pintuKeluar: { x: 156, y: 212, w: 40, h: 12 },
      mulai: { x: 176, y: 204 }
    }
  },
  'ruang-multimedia': {
    nama: 'Ruang Multimedia', lebar: 22, tinggi: 16, lantai: 'keramik-putih',
    terbukaSetelah: 'kasus-5',
    objek: ['meja-editing', 'laptop-multimedia', 'rak-kamera', 'layar-hijau', 'meja-pak-hendra'],
    tata: {
      lantai: ['lantai-keramik-gelap-1'], dinding: 'dinding-krem', tinggiDinding: 48,
      jendela: [],
      hiasan: [{ a: 'poster', x: 70, y: 6 }, { a: 'speaker', x: 152, y: 18 }, { a: 'ac', x: 290, y: 6 }],
      benda: [
        { id: 'rak-kamera', a: 'rak-kamera', x: 8, dasar: 72, tinggiPadat: 10 },
        { id: 'lemari-aksesori', a: 'lemari-aksesori', x: 300, dasar: 72, tinggiPadat: 10 },
        { id: 'meja-editing', a: 'meja-editing', x: 140, dasar: 130, tinggiPadat: 24 },
        { id: 'kursi-editing', a: 'kursi-editing', x: 170, dasar: 150, tinggiPadat: 6 },
        { id: 'tripod', a: 'tripod', x: 40, dasar: 150 },
        { id: 'layar-hijau', a: 'layar-hijau', x: 252, dasar: 170, tinggiPadat: 10 },
        { id: 'softbox', a: 'softbox', x: 214, dasar: 196 },
        { id: 'tanaman', a: 'tanaman-pot', x: 8, dasar: 250 }
      ],
      pintuKeluar: { x: 156, y: 244, w: 40, h: 12 },
      mulai: { x: 176, y: 236 }
    }
  },
  'aula': {
    nama: 'Aula', lebar: 40, tinggi: 26, lantai: 'karpet-marun',
    terbukaSetelah: 'kasus-6',
    objek: ['panggung', 'kursi-lipat', 'pilar-beton', 'dinding-beton', 'troli-ap'],
    tata: {
      lantai: ['lantai-karpet'], dinding: 'dinding-putih', tinggiDinding: 48,
      jendela: [96, 512],
      hiasan: [{ a: 'ap-dinding-hijau', x: 30, y: 24 }, { a: 'ap-dinding-hijau', x: 594, y: 24 }],
      benda: [
        { id: 'panggung', a: 'panggung', x: 224, dasar: 140, tinggiPadat: 40 },
        { id: 'bendera', a: 'bendera', x: 170, dasar: 138, tinggiPadat: 6 },
        { id: 'speaker-1', a: 'speaker-berdiri', x: 202, dasar: 140, tinggiPadat: 6 },
        { id: 'speaker-2', a: 'speaker-berdiri', x: 422, dasar: 140, tinggiPadat: 6 },
        { id: 'podium', a: 'podium', x: 440, dasar: 138, tinggiPadat: 8 },
        { id: 'pilar-1', a: 'pilar', x: 150, dasar: 222, tinggiPadat: 12 },
        { id: 'pilar-2', a: 'pilar', x: 150, dasar: 340, tinggiPadat: 12 },
        { id: 'pilar-3', a: 'pilar', x: 500, dasar: 222, tinggiPadat: 12 },
        { id: 'pilar-4', a: 'pilar', x: 500, dasar: 340, tinggiPadat: 12 },
        { id: 'kursi-11', a: 'kursi-deret-5', x: 216, dasar: 222, tinggiPadat: 8 },
        { id: 'kursi-12', a: 'kursi-deret-5', x: 290, dasar: 222, tinggiPadat: 8 },
        { id: 'kursi-13', a: 'kursi-deret-5', x: 364, dasar: 222, tinggiPadat: 8 },
        { id: 'kursi-21', a: 'kursi-deret-5', x: 216, dasar: 254, tinggiPadat: 8 },
        { id: 'kursi-22', a: 'kursi-deret-5', x: 290, dasar: 254, tinggiPadat: 8 },
        { id: 'kursi-23', a: 'kursi-deret-5', x: 364, dasar: 254, tinggiPadat: 8 },
        { id: 'kursi-31', a: 'kursi-deret-5', x: 216, dasar: 286, tinggiPadat: 8 },
        { id: 'kursi-32', a: 'kursi-deret-5', x: 290, dasar: 286, tinggiPadat: 8 },
        { id: 'kursi-33', a: 'kursi-deret-5', x: 364, dasar: 286, tinggiPadat: 8 },
        { id: 'kursi-41', a: 'kursi-deret-5', x: 216, dasar: 318, tinggiPadat: 8 },
        { id: 'kursi-42', a: 'kursi-deret-5', x: 290, dasar: 318, tinggiPadat: 8 },
        { id: 'kursi-43', a: 'kursi-deret-5', x: 364, dasar: 318, tinggiPadat: 8 },
        { id: 'kursi-51', a: 'kursi-deret-5', x: 216, dasar: 350, tinggiPadat: 8 },
        { id: 'kursi-52', a: 'kursi-deret-5', x: 290, dasar: 350, tinggiPadat: 8 },
        { id: 'kursi-53', a: 'kursi-deret-5', x: 364, dasar: 350, tinggiPadat: 8 },
        { id: 'tanaman-1', a: 'tanaman-aula', x: 610, dasar: 410 },
        { id: 'tanaman-2', a: 'tanaman-aula', x: 610, dasar: 120 }
      ],
      pintuKeluar: { x: 300, y: 404, w: 40, h: 12 },
      mulai: { x: 320, y: 396 }
    }
  },
  'lab-komputer-2': {
    nama: 'Lab Komputer 2', lebar: 30, tinggi: 20, lantai: 'keramik-putih',
    terbukaSetelah: 'kasus-7',
    objek: ['pc-admin', 'lemari-senter', 'pintu-belakang'],
    tata: {
      lantai: ['lantai-keramik-putih-1'], dinding: 'dinding-putih', tinggiDinding: 48,
      jendela: [24, 300],
      hiasan: [{ a: 'papan-tulis', x: 200, y: 8 }, { a: 'jam-dinding', x: 120, y: 12 }, { a: 'pintu-lorong', x: 420, y: 0 }],
      benda: [
        { id: 'lemari-kaca', a: 'lemari-kaca', x: 360, dasar: 62, tinggiPadat: 10 },
        { id: 'meja-1a', a: 'meja-4pc', x: 48, dasar: 128, tinggiPadat: 34 },
        { id: 'meja-1b', a: 'meja-4pc', x: 264, dasar: 128, tinggiPadat: 34 },
        { id: 'meja-2a', a: 'meja-4pc', x: 48, dasar: 196, tinggiPadat: 34 },
        { id: 'meja-admin', a: 'meja-guru-pc', x: 396, dasar: 306, tinggiPadat: 20 },
        { id: 'lemari-laci', a: 'lemari-laci', x: 452, dasar: 200, tinggiPadat: 10 },
        { id: 'tanaman-1', a: 'tanaman-pot', x: 6, dasar: 318 }
      ],
      pintuKeluar: { x: 220, y: 308, w: 40, h: 12 },
      mulai: { x: 240, y: 300 }
    }
  },
  'lorong-belakang': {
    nama: 'Lorong Belakang', lebar: 40, tinggi: 8, lantai: 'beton',
    terbukaSetelah: 'kasus-7',
    objek: ['jejak-kaki-ungu', 'pintu-gudang-gembok'],
    tata: {
      lantai: ['lantai-beton'], dinding: 'dinding-beton', tinggiDinding: 48,
      jendela: [], hiasan: [], benda: [
        { id: 'kardus', a: 'kotak-alat', x: 200, dasar: 60, tinggiPadat: 6 },
        { id: 'gulungan', a: 'gulungan-kabel', x: 420, dasar: 58, tinggiPadat: 4 }
      ],
      pintuKeluar: { x: 12, y: 116, w: 40, h: 12 },
      mulai: { x: 36, y: 104 }
    }
  },
  'gudang': {
    nama: 'Gudang', lebar: 26, tinggi: 18, lantai: 'beton', gelap: true, radiusSenter: 4,
    terbukaSetelah: 'kasus-8', butuhAlat: 'senter', butuhKeping: 4,
    objek: ['kardus', 'rak-tua', 'router-smk-free', 'kabel-lama'],
    tata: {
      lantai: ['lantai-beton'], dinding: 'dinding-beton', tinggiDinding: 48,
      jendela: [], hiasan: [{ a: 'sarang-laba', x: 150, y: 4 }],
      benda: [
        { id: 'rak-1', a: 'rak-isi', x: 14, dasar: 72, tinggiPadat: 12 },
        { id: 'rak-2', a: 'rak-sarang', x: 78, dasar: 72, tinggiPadat: 12 },
        { id: 'rak-alat', a: 'rak-alat', x: 250, dasar: 70, tinggiPadat: 12 },
        { id: 'lemari', a: 'lemari-besi-tua', x: 318, dasar: 70, tinggiPadat: 10 },
        { id: 'rak-3', a: 'rak-gudang-kosong', x: 360, dasar: 72, tinggiPadat: 12 },
        { id: 'meja-router', a: 'meja-tua', x: 178, dasar: 112, tinggiPadat: 12 },
        { id: 'pemadam', a: 'pemadam-gudang', x: 140, dasar: 70, tinggiPadat: 6 },
        { id: 'kardus-tumpuk', a: 'tumpukan-kardus', x: 10, dasar: 150, tinggiPadat: 12 },
        { id: 'kardus-buka', a: 'kardus-terbuka', x: 92, dasar: 176, tinggiPadat: 10 },
        { id: 'kardus-1', a: 'kardus', x: 18, dasar: 204, tinggiPadat: 10 },
        { id: 'peti', a: 'peti-kayu', x: 52, dasar: 236, tinggiPadat: 10 },
        { id: 'kain', a: 'kain-penutup', x: 8, dasar: 276, tinggiPadat: 12 },
        { id: 'tangga', a: 'tangga', x: 362, dasar: 150, tinggiPadat: 8 },
        { id: 'monitor', a: 'tumpukan-monitor', x: 366, dasar: 214, tinggiPadat: 12 },
        { id: 'gulungan', a: 'gulungan-merah', x: 300, dasar: 168, tinggiPadat: 8 },
        { id: 'pc-tua', a: 'pc-tua', x: 300, dasar: 272, tinggiPadat: 10 },
        { id: 'palet', a: 'palet', x: 104, dasar: 274, tinggiPadat: 8 }
      ],
      pintuKeluar: { x: 188, y: 276, w: 40, h: 12 },
      mulai: { x: 208, y: 266 }
    }
  },
  'ruang-kepsek': {
    nama: 'Ruang Kepala Sekolah', lebar: 24, tinggi: 15, lantai: 'kayu',
    terbukaSetelah: 'klimaks',
    objek: ['meja-kepsek', 'sofa', 'lemari-piala', 'bendera'],
    tata: {
      lantai: ['lantai-kayu-1'], dinding: 'dinding-krem', tinggiDinding: 48,
      jendela: [],
      hiasan: [
        { a: 'papan-visi', x: 148, y: -6 },
        { a: 'jam-bulat', x: 104, y: 10 },
        { a: 'karpet', x: 136, y: 120 }
      ],
      benda: [
        { id: 'lemari-piala', a: 'lemari-piala', x: 6, dasar: 72, tinggiPadat: 10 },
        { id: 'bendera', a: 'bendera-kepsek', x: 76, dasar: 66, tinggiPadat: 6 },
        { id: 'kursi-kepsek', a: 'kursi-kepsek', x: 181, dasar: 82, tinggiPadat: 8 },
        { id: 'meja-kepsek', a: 'meja-kepsek', x: 150, dasar: 112, tinggiPadat: 16 },
        { id: 'sofa', a: 'sofa-panjang', x: 262, dasar: 84, tinggiPadat: 12 },
        { id: 'tanaman-1', a: 'tanaman-keramik', x: 346, dasar: 82, tinggiPadat: 8 },
        { id: 'sofa-kiri', a: 'kursi-sofa-kiri', x: 236, dasar: 128, tinggiPadat: 12 },
        { id: 'meja-kaca', a: 'meja-kaca', x: 270, dasar: 122, tinggiPadat: 10 },
        { id: 'sofa-kanan', a: 'kursi-sofa-kanan', x: 316, dasar: 128, tinggiPadat: 12 },
        { id: 'tanaman-2', a: 'tanaman-keramik', x: 4, dasar: 236, tinggiPadat: 8 }
      ],
      pintuKeluar: { x: 172, y: 228, w: 40, h: 12 },
      mulai: { x: 192, y: 220 }
    }
  }
};

// Ruangan yang sudah dibangun -> nama scene di js/scenes
NQ.data.sceneRuang = {
  'lorong-utama': 'lorong',
  'kantor-kepala-lab': 'prolog',
  'lab-komputer-1': 'kasus-1',
  'ruang-guru': 'kasus-2',
  'ruang-server': 'kasus-3',
  'perpustakaan': 'kasus-4',
  'ruang-tu': 'kasus-5',
  'ruang-multimedia': 'kasus-6',
  'aula': 'kasus-7',
  'lab-komputer-2': 'kasus-8',
  'lorong-belakang': 'lorong-belakang',
  'gudang': 'klimaks',
  'ruang-kepsek': 'epilog'
};

// Posisi gedung pada gambar peta sekolah (G2), dalam persen lebar dan tinggi gambar.
NQ.data.posisiPeta = {
  'lab-komputer-1':    { x: 18, y: 21 },
  'lab-komputer-2':    { x: 39, y: 21 },
  'perpustakaan':      { x: 61, y: 21 },
  'gudang':            { x: 82, y: 21 },
  'ruang-server':      { x: 18, y: 43 },
  'ruang-guru':        { x: 37, y: 43 },
  'aula':              { x: 59, y: 41 },
  'ruang-multimedia':  { x: 82, y: 43 },
  'ruang-tu':          { x: 19, y: 71 },
  'kantor-kepala-lab': { x: 44, y: 67 },
  'ruang-kepsek':      { x: 81, y: 71 }
};

// Tokoh: nama di kotak dialog, potret, dan sprite.
NQ.data.tokoh = {
  'pingo':      { nama: 'Pingo', potret: 'pingo' },
  'raka':       { nama: 'Raka', potret: 'raka' },
  'pak-bima':   { nama: 'Pak Bima', potret: 'c1-pak-bima', aset: 'c1-pak-bima' },
  'kak-dimas':  { nama: 'Kak Dimas', potret: 'c2-kak-dimas', aset: 'c2-kak-dimas' },
  'bu-wati':    { nama: 'Bu Wati', potret: 'c3-bu-wati', aset: 'c3-bu-wati' },
  'pak-hasan':  { nama: 'Pak Hasan', potret: 'c4-pak-hasan', aset: 'c4-pak-hasan' },
  'bu-rina':    { nama: 'Bu Rina', potret: 'c5-bu-rina', aset: 'c5-bu-rina' },
  'pak-joko':   { nama: 'Pak Joko', potret: 'c6-pak-joko', aset: 'c6-pak-joko' },
  'pak-hendra': { nama: 'Pak Hendra', potret: 'c7-pak-hendra', aset: 'c7-pak-hendra' },
  'rara':       { nama: 'Rara', potret: 'c8-rara', aset: 'c8-rara' },
  'panitia':    { nama: 'Panitia', potret: null, aset: 'panitia-1' },
  'siswa':      { nama: 'Siswa', potret: null, aset: 'siswa-kesal' },
  'glitch':     { nama: 'Glitch', potret: 'glitch' },
  'ibu-kepsek': { nama: 'Ibu Kepala Sekolah', potret: 'c9-ibu-kepsek', aset: 'c9-ibu-kepsek' }
};
