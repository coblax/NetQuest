/*
 * Umpan balik tindakan salah. Sumber: Naskah Lengkap bagian E.
 *
 * Format satu tindakan:
 *   {
 *     id:       kode tindakan, dipanggil dari scene (misalnya NQ.energi.salah('kasus-1', 'cabut-pc-lain')),
 *     tindakan: penjelasan tindakan salah (untuk guru dan pengembang),
 *     akibat:   apa yang terjadi di dunia game (efek visual atau suara),
 *     ucapan:   daftar kotak dialog yang muncul berurutan [{ tokoh, potret, teks }],
 *     energi:   perubahan energi (0 atau -1),
 *     konektor: perubahan stok konektor RJ45 (0 atau -1),
 *     bintang:  perubahan bintang kasus (0 atau -1),
 *     hitungSalah: true jika dihitung sebagai kesalahan untuk aturan bintang
 *   }
 *
 * Prinsip: tindakan salah selalu berakibat di dunia game dan diikuti penjelasan,
 * bukan tanda silang. Salah ketik perintah tidak pernah mengurangi energi.
 */
window.NQ = window.NQ || {};
NQ.data = NQ.data || {};

// Ucapan Pingo saat pemain mencoba Perbaikan sebelum langkah Uji (energi tidak berkurang).
NQ.data.ucapanTahanUji = 'Tunggu! Kita belum membuktikannya. Uji dulu dugaanmu.';

// Ucapan saat energi habis: Raka pingsan, kembali ke pintu ruangan kasus dengan energi penuh.
NQ.data.ucapanEnergiHabis = [
  { tokoh: 'Pingo', potret: 'pingo', teks: 'Raka! Kamu kelelahan. Kita istirahat sebentar di depan pintu, ya.' },
  { tokoh: 'Pingo', potret: 'pingo', teks: 'Tenang, Jurnal kita masih tersimpan. Kita lanjutkan dari langkah terakhir.' }
];

NQ.data.umpanBalik = {

  // ===== Kasus 1: Lab Komputer 1 =====
  'kasus-1': [
    { id: 'cabut-pc-lain', tindakan: 'Mencabut kabel PC lain yang normal',
      akibat: 'PC itu ikut putus; murid di kursinya mengeluh',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Ups! PC itu tadinya normal. Pasang lagi, lalu fokus pada PC 07.' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true },
    { id: 'ganti-tanpa-uji', tindakan: 'Langsung mengganti kabel tanpa diuji',
      akibat: 'Pingo menahan tangan Raka',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Kabelnya belum tentu rusak. Uji dulu dengan LAN tester.' }],
      energi: 0, konektor: 0, bintang: 0, hitungSalah: false }
  ],

  // ===== Kasus 2: Ruang Guru =====
  'kasus-2': [
    { id: 'urutan-salah', tindakan: 'Urutan warna kabel tidak sesuai T568B',
      akibat: 'Lampu pin yang tertukar tidak menyala urut di LAN tester; Pingo menunjuk pasangan yang tertukar',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Lampu 3 dan 6 tertukar. Cek lagi urutan putih-hijau dan hijau.' }],
      energi: 0, konektor: -1, bintang: 0, hitungSalah: true,
      catatan: 'Nomor pin di ucapan diganti sesuai pasangan yang benar-benar tertukar.' },
    { id: 'tidak-mentok', tindakan: 'Kabel tidak didorong sampai mentok di ujung konektor',
      akibat: 'Beberapa lampu pin mati di LAN tester',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Ada kabel kecil yang tidak menyentuh pin. Dorong sampai mentok di ujung konektor.' }],
      energi: 0, konektor: -1, bintang: 0, hitungSalah: true },
    { id: 'selubung-tidak-terjepit', tindakan: 'Selubung kabel tidak ikut masuk dan terjepit',
      akibat: 'Kabel mudah tercabut saat ditarik',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Selubung biru harus ikut masuk ke konektor supaya kuat.' }],
      energi: 0, konektor: -1, bintang: 0, hitungSalah: true },
    { id: 'konektor-habis', tindakan: 'Stok 3 konektor RJ45 habis',
      akibat: 'Pak Hasan memberi konektor tambahan',
      ucapan: [{ tokoh: 'Pak Hasan', potret: 'c4-pak-hasan', teks: 'Ini konektor cadangan terakhir saya. Pelan-pelan, ya.' }],
      energi: 0, konektor: 1, bintang: -1, hitungSalah: false }
  ],

  // ===== Kasus 3: Ruang Server =====
  'kasus-3': [
    { id: 'cabut-port-menyala', tindakan: 'Mencabut kabel di port yang lampunya menyala',
      akibat: 'Alarm berbunyi; ruangan lain putus beberapa detik',
      ucapan: [{ tokoh: 'Kak Dimas', potret: 'c2-kak-dimas', teks: 'Eh, itu jalur Ruang Guru! Pasang lagi. Cari yang lampunya mati.' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true },
    { id: 'matikan-switch', tindakan: 'Mematikan switch',
      akibat: 'Semua lampu switch padam; seluruh sekolah putus',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Jangan matikan perangkat yang sedang melayani banyak ruangan!' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true }
  ],

  // ===== Kasus 4: Perpustakaan =====
  'kasus-4': [
    { id: 'kavling-terisi', tindakan: 'Printer diberi kavling statis yang sudah terisi',
      akibat: 'Petir pindah ke perangkat lain yang memakai nomor itu',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Kavling itu sudah ada penghuninya. Cari kavling yang kosong.' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true },
    { id: 'kavling-dhcp', tindakan: 'Printer diberi kavling di kompleks DHCP (.100–.200)',
      akibat: 'Tidak ada petir sekarang, tetapi Pingo memutar ulang "masa depan": kurir memberikan nomor yang sama ke laptop siswa',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Suatu hari kurir DHCP bisa memberikan nomor ini ke perangkat lain. Printer harus di kompleks statis.' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true },
    { id: 'pakai-gateway', tindakan: 'Printer diberi alamat 192.168.10.1',
      akibat: 'Semua perangkat kehilangan jalan keluar ke internet',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Itu alamat gateway, pintu keluar jaringan! Jangan dipakai perangkat lain.' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true }
  ],

  // ===== Kasus 5: Ruang TU =====
  'kasus-5': [
    { id: 'matikan-router', tindakan: 'Mematikan router',
      akibat: 'Semua ruangan putus; alarm berbunyi',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Router melayani seluruh sekolah. Kita cukup menyalakan layanan DHCP-nya.' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true },
    { id: 'ip-statis-manual', tindakan: 'Mengisi IP statis satu per satu di PC TU',
      akibat: 'PC tersambung, tetapi tugas kasus belum selesai karena akar masalah belum diperbaiki',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Bisa jalan, tapi melelahkan dan rawan bentrok. Akar masalahnya ada di layanan DHCP.' }],
      energi: 0, konektor: 0, bintang: 0, hitungSalah: false },
    { id: 'pool-menimpa-statis', tindakan: 'Mengubah pool DHCP menjadi .2 sampai .200',
      akibat: 'Printer TU di .21 berkedip petir',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Pool tidak boleh menimpa kompleks statis. Kembalikan ke .100 sampai .200.' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true },
    { id: 'renew-sebelum-dhcp', tindakan: 'Mengetik ipconfig /renew sebelum layanan DHCP menyala',
      akibat: 'Terminal menampilkan gagal menghubungi server DHCP',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Belum ada yang menjawab. Nyalakan dulu layanan DHCP-nya.' }],
      energi: 0, konektor: 0, bintang: 0, hitungSalah: false }
  ],

  // ===== Kasus 6: Ruang Multimedia =====
  'kasus-6': [
    { id: 'ganti-ip-laptop', tindakan: 'Mengganti alamat IP laptop',
      akibat: 'Laptop kehilangan koneksi',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'ping 8.8.8.8 tadi berhasil, jadi IP-nya sudah benar. Kembalikan seperti semula.' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true },
    { id: 'salah-ketik', tindakan: 'Mengetik perintah yang tidak dikenal',
      akibat: 'Terminal menampilkan saran perintah yang paling mirip',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Mungkin maksudmu {saran}? Perintah salah tidak apa-apa, coba lagi.' }],
      energi: 0, konektor: 0, bintang: 0, hitungSalah: false,
      catatan: '{saran} diganti oleh terminal dengan perintah yang paling mirip. Berlaku juga di Kasus 5.',
      perintahDikenal: ['ipconfig', 'ipconfig /all', 'ipconfig /renew', 'ipconfig /release', 'ipconfig /flushdns', 'ping', 'nslookup', 'cls', 'help'] }
  ],

  // ===== Kasus 7: Aula =====
  'kasus-7': [
    { id: 'ap-terhalang', tindakan: 'Access point tetap di balik pilar atau dinding beton',
      akibat: 'Zona mati merah tidak berubah',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Gelombangnya masih terhalang beton. Cari tempat yang lebih terbuka.' }],
      energi: 0, konektor: 0, bintang: 0, hitungSalah: false },
    { id: 'kanal-dipakai-tetangga', tindakan: 'Memilih kanal 1 atau 6',
      akibat: 'Gelombang beradu dengan AP tetangga; Wi-Fi analyzer menunjukkan sinyal kacau',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Kanal itu sudah dipakai tetangga. Gelombangnya bertabrakan.' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true },
    { id: 'kanal-tumpang-tindih', tindakan: 'Memilih kanal 2–5 atau 7–10',
      akibat: 'Gelombang tumpang tindih dengan dua AP tetangga sekaligus',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Kanal di antara 1, 6, dan 11 malah tumpang tindih dengan dua kanal sekaligus.' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true }
  ],

  // ===== Kasus 8: Lab Komputer 2 dan Lorong Belakang =====
  'kasus-8': [
    { id: 'blokir-perangkat-inventaris', tindakan: 'Memblokir perangkat yang ada di inventaris',
      akibat: 'PC Lab 2 terputus; siswa protes',
      ucapan: [
        { tokoh: 'Bu Wati', potret: 'c3-bu-wati', teks: 'Lho, itu PC 05 milik lab!' },
        { tokoh: 'Pingo', potret: 'pingo', teks: 'Cocokkan MAC-nya dengan inventaris dulu.' }
      ],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true,
      catatan: 'Nomor PC di ucapan Bu Wati diganti sesuai perangkat yang diblokir.' },
    { id: 'gudang-tanpa-senter', tindakan: 'Masuk gudang tanpa senter',
      akibat: 'Layar gelap total; Raka mundur sendiri',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Terlalu gelap. Ambil senter dulu.' }],
      energi: 0, konektor: 0, bintang: 0, hitungSalah: false }
  ],

  // ===== Klimaks: Gudang =====
  klimaks: [
    { id: 'matikan-semua-jaringan', tindakan: 'Memilih aksi Matikan semua jaringan sekolah',
      akibat: 'Glitch tertawa; layar lomba di aula ikut padam',
      ucapan: [
        { tokoh: 'Glitch', potret: 'glitch', teks: 'Hihihi! Lombanya batal deh!' },
        { tokoh: 'Pingo', potret: 'pingo', teks: 'Itu bukan solusi. Hentikan pelakunya, bukan seluruh jaringan.' }
      ],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true },
    { id: 'sembunyikan-ssid', tindakan: 'Memilih aksi Sembunyikan nama Wi-Fi (SSID)',
      akibat: 'Glitch tetap terlihat dan kekuatannya tidak berkurang',
      ucapan: [{ tokoh: 'Glitch', potret: 'glitch', teks: 'Jaringan tersembunyi tetap bisa kutemukan!' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true },
    { id: 'sandi-lemah', tindakan: 'Merakit sandi lemah (kurang dari 12 karakter atau kata umum seperti 12345678)',
      akibat: 'Glitch membesar sedikit',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Sandi itu mudah ditebak. Gabungkan kata acak, angka, dan simbol sampai panjang.' }],
      energi: -1, konektor: 0, bintang: 0, hitungSalah: true,
      aturanSandiKuat: { panjangMin: 12, wajib: ['huruf', 'angka', 'simbol'], dilarang: ['12345678', 'password', 'smkcendekia', 'admin'] } },
    { id: 'pintu-masih-terbuka', tindakan: 'Memilih Blokir MAC atau WPA2/WPA3 sebelum mencabut router liar',
      akibat: 'Kekuatan Glitch tidak berkurang karena SMK-Free masih menyala',
      ucapan: [
        { tokoh: 'Glitch', potret: 'glitch', teks: 'Hihihi! Selama SMK-Free menyala, aku dan teman-temanku bisa masuk lagi lewat pintu itu!' },
        { tokoh: 'Pingo', potret: 'pingo', teks: 'Putus dulu jalur masuknya: cabut router liar SMK-Free.' }
      ],
      energi: 0, konektor: 0, bintang: 0, hitungSalah: true },
    { id: 'periksa-ulang-terlalu-awal', tindakan: 'Memilih Periksa ulang daftar perangkat sebelum aksi lain selesai',
      akibat: 'Daftar perangkat masih berisi perangkat asing; kekuatan Glitch tidak berkurang',
      ucapan: [{ tokoh: 'Pingo', potret: 'pingo', teks: 'Masih ada penyusup di daftar. Selesaikan aksi lainnya dulu, baru periksa ulang.' }],
      energi: 0, konektor: 0, bintang: 0, hitungSalah: false }
  ]
};
