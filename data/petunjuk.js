/*
 * Petunjuk Pingo tiga tingkat: [Arah, Cara, Jawaban].
 * Setiap tingkat yang dibuka dihitung satu petunjuk untuk aturan bintang.
 * Sumber: Naskah Lengkap bagian D.
 */
window.NQ = window.NQ || {};
NQ.data = NQ.data || {};

NQ.data.petunjuk = {
  prolog: [
    'Coba periksa meja Pak Bima dan rak di pojok.',
    'Dekati benda yang berkilau lalu tekan E.',
    'Ambil Tas di meja, lalu periksa Pingo di rak untuk menyalakannya.'
  ],
  'kasus-1': [
    'Bandingkan PC 07 dengan PC lain. Lalu lihat ke bawah meja.',
    'Periksa belakang CPU. Pakai LAN tester untuk membuktikan kabelnya sehat atau tidak.',
    'Konektor di CPU PC 07 longgar. Uji kabel dengan LAN tester, lalu tancapkan sampai berbunyi klik.'
  ],
  'kasus-2': [
    'Lihat kartu T568B di meja kerja.',
    'Urutkan dari pin 1 di kiri. Kabel bergaris selalu mendahului kabel polos warnanya, kecuali biru.',
    'Putih-oranye, oranye, putih-hijau, biru, putih-biru, hijau, putih-cokelat, cokelat. Lalu crimp dan uji.'
  ],
  'kasus-3': [
    'Perhatikan lampu di switch. Mana port yang lampu link-nya mati?',
    'Tekan Q untuk Pindai. Ikuti kabel yang gelap.',
    'Kabel gelap berakhir di port 7 patch panel. Pasang ulang kabel di port 7.'
  ],
  'kasus-4': [
    'Pindai ruangan dan bandingkan nomor rumah PC katalog dan printer.',
    'Buka Papan Alamat. Perangkat tetap harus tinggal di kompleks statis.',
    'Pindahkan printer ke kavling kosong di kompleks statis, misalnya 192.168.10.30.'
  ],
  'kasus-5': [
    'Angka 169.254 artinya komputer tidak mendapat alamat. Siapa yang biasanya membagikan alamat?',
    'Periksa lemari router dan buka panel layanan DHCP.',
    'Nyalakan layanan DHCP, tunggu kurir selesai, lalu ketik ipconfig /renew.'
  ],
  'kasus-6': [
    'Internet lewat IP jalan, tapi nama situs tidak. Apa yang menerjemahkan nama menjadi IP?',
    'Ketik nslookup smkcendekia.sch.id, lalu ipconfig /all dan lihat baris DNS Servers.',
    'DNS diarahkan ke 10.10.10.66. Kembalikan DNS adaptor ke otomatis, ketik ipconfig /flushdns, lalu uji lagi.'
  ],
  'kasus-7': [
    'Lihat posisi access point. Apa yang menghalangi gelombangnya?',
    'Dorong troli menjauhi dinding beton dan pilar. Lalu pilih kanal yang tidak dipakai tetangga.',
    'Dorong AP ke tengah aula di depan panggung dan pilih kanal 11.'
  ],
  'kasus-8': [
    'Bandingkan daftar perangkat terhubung dengan daftar inventaris Bu Wati.',
    'Cocokkan alamat MAC satu per satu. Lalu pakai Wi-Fi analyzer dan ikuti sinyal yang makin kuat.',
    'Dua MAC asing terhubung lewat SMK-Free. Ikuti sinyalnya ke lorong belakang, ambil keping 4, pasang 4 keping di gembok gudang.'
  ],
  klimaks: [
    'Tutup dulu pintu masuk Glitch, baru kunci pintu-pintu lainnya.',
    'Urutannya: putus jalur masuk, usir penyusup, kunci jaringan, lalu periksa ulang.',
    'Cabut router liar, blokir MAC perangkat asing, aktifkan WPA2/WPA3 dengan sandi kuat, lalu periksa ulang daftar perangkat.'
  ]
};
