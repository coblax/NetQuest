/*
 * Daftar tahap cerita, urutan, ruangan, pelapor, dan keping.
 * Urutan array = urutan permainan. Setiap kasus memakai 6 langkah Jurnal yang sama.
 */
window.NQ = window.NQ || {};
NQ.data = NQ.data || {};

NQ.data.langkahJurnal = ['Gejala', 'Dugaan', 'Uji', 'Perbaikan', 'Verifikasi', 'Catat'];

NQ.data.kasus = [
  { id: 'prolog',  babak: 0, judul: 'Prolog',                     ruangan: 'kantor-kepala-lab', pelapor: 'Pak Bima',  keping: false, tugas: 'Ambil Tas Teknisi dan nyalakan Pingo' },
  { id: 'kasus-1', babak: 1, judul: 'Kasus 1 - Lab Komputer 1',   ruangan: 'lab-komputer-1',    pelapor: 'Bu Wati',   keping: false, tugas: 'PC 07 tidak bisa internet' },
  { id: 'kasus-2', babak: 1, judul: 'Kasus 2 - Ruang Guru',       ruangan: 'ruang-guru',        pelapor: 'Pak Hasan', keping: false, tugas: 'Kabel digigit tikus' },
  { id: 'kasus-3', babak: 1, judul: 'Kasus 3 - Ruang Server',     ruangan: 'ruang-server',      pelapor: 'Kak Dimas', keping: true,  tugas: 'Lacak kabel yang gelap' },
  { id: 'kasus-4', babak: 2, judul: 'Kasus 4 - Perpustakaan',     ruangan: 'perpustakaan',      pelapor: 'Bu Rina',   keping: false, tugas: 'Katalog putus-sambung' },
  { id: 'kasus-5', babak: 2, judul: 'Kasus 5 - Ruang TU',         ruangan: 'ruang-tu',          pelapor: 'Pak Joko',  keping: true,  tugas: 'Semua PC TU tidak dapat alamat' },
  { id: 'kasus-6', babak: 2, judul: 'Kasus 6 - Ruang Multimedia', ruangan: 'ruang-multimedia',  pelapor: 'Pak Hendra', keping: true, tugas: 'Situs sekolah tidak terbuka' },
  { id: 'kasus-7', babak: 3, judul: 'Kasus 7 - Aula',             ruangan: 'aula',              pelapor: 'Rara',      keping: false, tugas: 'Wi-Fi aula lemot' },
  { id: 'kasus-8', babak: 3, judul: 'Kasus 8 - Lab Komputer 2',   ruangan: 'lab-komputer-2',    pelapor: 'Bu Wati',   keping: true,  tugas: 'Ada yang menumpang jaringan' },
  { id: 'klimaks', babak: 4, judul: 'Klimaks - Gudang',           ruangan: 'gudang',            pelapor: null,        keping: false, tugas: 'Hentikan Glitch' },
  { id: 'epilog',  babak: 5, judul: 'Epilog',                     ruangan: 'ruang-kepsek',      pelapor: 'Ibu Kepala Sekolah', keping: false, tugas: 'Serahkan laporan teknisi' }
];
