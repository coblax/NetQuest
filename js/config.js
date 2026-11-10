/*
 * Pengaturan umum NetQuest.
 * Semua file memakai satu namespace global: window.NQ
 */
window.NQ = window.NQ || {};

NQ.config = {
  judul: 'NetQuest: Misteri Jaringan SMK Cendekia',
  versi: '0.1.0',

  // Layar dasar 480 x 270 piksel (30 x 17 tile), diperbesar pixel-perfect.
  lebarLayar: 480,
  tinggiLayar: 270,
  ukuranTile: 16,
  // Aset gambar dibuat 4x lebih detail dari ukuran logis (HD). Semua koordinat game tetap logis.
  hd: 4,

  // Aturan permainan (lihat storyboard bagian Aturan Permainan).
  energiMaks: 5,
  konektorRJ45Awal: 3,
  jumlahKeping: 4,
  jedaPetunjukDetik: 20,

  // Kunci penyimpanan di localStorage.
  kunciSimpan: 'netquest-simpan-v1',

  // Kode mode guru (ubah sebelum dibagikan ke siswa).
  kodeGuru: 'TKJ-GURU',

  // Tombol keyboard.
  tombol: {
    atas: ['KeyW', 'ArrowUp'],
    bawah: ['KeyS', 'ArrowDown'],
    kiri: ['KeyA', 'ArrowLeft'],
    kanan: ['KeyD', 'ArrowRight'],
    periksa: ['KeyE', 'Enter'],
    tas: ['KeyT'],
    pindai: ['KeyQ'],
    jurnal: ['KeyJ'],
    peta: ['KeyM'],
    petunjuk: ['Slash'],
    buku: ['KeyB'],          // Buku Konsep (saat Jurnal terbuka)
    batal: ['Escape']
  },

  debug: false
};
