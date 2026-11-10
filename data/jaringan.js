/*
 * Jaringan contoh SMK Cendekia: 192.168.10.0/24.
 * Dipakai oleh Papan Alamat, panel router, terminal, dan daftar perangkat.
 */
window.NQ = window.NQ || {};
NQ.data = NQ.data || {};

NQ.data.jaringan = {
  network: '192.168.10.0',
  prefix: 24,
  netmask: '255.255.255.0',
  gateway: '192.168.10.1',
  dnsSekolah: '8.8.8.8',
  kompleksStatis: { awal: 2, akhir: 99 },
  kompleksDHCP: { awal: 100, akhir: 200 },
  domainSekolah: 'smkcendekia.sch.id',

  // Kasus 4: kavling statis yang sudah terisi sebelum printer dipindah.
  statisTerisi: {
    2: 'Switch Utama',
    10: 'Server Lokal',
    20: 'PC Katalog',
    21: 'Printer TU'
  },
  ipBentrok: '192.168.10.20',       // PC Katalog dan printer baru
  jawabanContohPrinter: '192.168.10.30',

  // Kasus 6: DNS yang dibelokkan Glitch.
  dnsAsing: '10.10.10.66',

  // Kasus 7: access point tetangga di 2,4 GHz.
  apTetangga: [
    { nama: 'AP Lab 1', kanal: 1 },
    { nama: 'AP Kantor', kanal: 6 }
  ],
  kanalBenar: 11,
  sinyal: { sebelum: -78, sesudah: -45 },

  // Kasus 8: jaringan Wi-Fi yang terdeteksi.
  ssid: [
    { nama: 'SMK-Guru', aman: true, resmi: true },
    { nama: 'SMK-Siswa', aman: true, resmi: true },
    { nama: 'SMK-Free', aman: false, resmi: false }
  ]
  // Daftar perangkat dan inventaris MAC Lab Komputer 2 diisi di sini nanti.
};
