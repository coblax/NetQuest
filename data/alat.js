/*
 * Alat di Tas Teknisi. didapat = tahap di data/kasus.js saat alat diberikan.
 * ikon = urutan ikon di assets/img/ikon/f1-alat.png (0-7).
 * Ikon satuan juga tersedia untuk HTML: assets/img/ikon/alat/<id>.png
 */
window.NQ = window.NQ || {};
NQ.data = NQ.data || {};

NQ.data.alat = {
  'lan-tester':    { nama: 'LAN Tester',    ikon: 0, didapat: 'prolog',  dari: 'Pak Bima',
                     info: 'Menguji 8 jalur kabel UTP. Pilih alat, lalu arahkan ke kabel yang dicurigai.' },
  'crimping-tool': { nama: 'Crimping Tool', ikon: 1, didapat: 'kasus-2', dari: 'Pak Hasan',
                     info: 'Menjepit konektor RJ45 ke ujung kabel UTP.' },
  'konektor-rj45': { nama: 'Konektor RJ45', ikon: 2, didapat: 'kasus-2', dari: 'Pak Hasan', jumlah: 3,
                     info: 'Konektor bening untuk kabel UTP. Persediaan terbatas.' },
  'kartu-akses':   { nama: 'Kartu Akses',   ikon: 3, didapat: 'kasus-3', dari: 'Kak Dimas',
                     info: 'Membuka pintu Ruang Server.' },
  'laptop':        { nama: 'Laptop Teknisi', ikon: 4, didapat: 'kasus-5', dari: 'Kak Dimas',
                     info: 'Terminal untuk mengetik ipconfig, ping, dan nslookup.' },
  'wifi-analyzer': { nama: 'Wi-Fi Analyzer', ikon: 5, didapat: 'kasus-7', dari: 'Pak Bima',
                     info: 'Mengukur kekuatan sinyal (dBm) dan kanal Wi-Fi.' },
  'senter':        { nama: 'Senter',        ikon: 6, didapat: 'kasus-8', dari: 'lemari Lab Komputer 2',
                     info: 'Menerangi ruangan gelap.' },
  'keping-glitch': { nama: 'Keping Glitch', ikon: 7, didapat: 'kasus-3', dari: 'ditemukan',
                     info: 'Keping data ungu. Empat keping membuka pintu gudang.' }
};
