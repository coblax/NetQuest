/*
 * Kartu Konsep: ilustrasi + apa / kenapa / bukti + satu soal cek paham.
 * Sumber: docs/audit-pedagogi-kartu-konsep.md. Gambar di assets/img/konsep/ (tanpa teks; label ditulis game).
 *
 * panel: [{ g: kunci aset, label: [[x, y, teks], ...] (x, y = 0..1 dari lebar/tinggi gambar), ket: keterangan }]
 * bukti: { kasus, langkah } -> isi Jurnal siswa yang ditampilkan sebagai bukti
 * soal: { tanya, pilihan: [{ t, benar, alasan }] }  (urutan pilihan diacak saat ditampilkan)
 */
window.NQ = window.NQ || {};
NQ.data = NQ.data || {};

// Lapisan pemeriksaan "dari bawah ke atas" dan warnanya
NQ.data.lapisan = {
  'Fisik':    { warna: '#ff9f43', ket: 'kabel, konektor, lampu, sinyal' },
  'Alamat':   { warna: '#4fa8ff', ket: 'alamat IP' },
  'Layanan':  { warna: '#c56bff', ket: 'DHCP dan DNS' },
  'Keamanan': { warna: '#ff6b6b', ket: 'siapa yang boleh masuk' },
  'Semua':    { warna: '#ffd23f', ket: 'cara berpikir teknisi' }
};

NQ.data.konsep = {
  'lapisan': {
    kasus: 'prolog', judul: 'Periksa dari bawah ke atas', lapisan: 'Semua',
    panel: [{ g: 'konsep-lapisan', ket: 'Jaringan seperti gedung bertingkat: lantai atas berdiri di atas lantai bawah.',
      label: [[0.2, 0.25, '3 · LAYANAN'], [0.2, 0.31, 'DHCP, DNS'], [0.2, 0.53, '2 · ALAMAT'], [0.2, 0.59, 'alamat IP'],
              [0.2, 0.8, '1 · FISIK'], [0.2, 0.86, 'kabel, lampu'], [0.85, 0.97, 'mulai dari bawah']] }],
    apa: 'Jaringan bekerja bertingkat. Lantai 1 fisik: kabel, konektor, lampu. Lantai 2 alamat: IP. Lantai 3 layanan: DHCP dan DNS.',
    kenapa: 'Lantai atas bergantung pada lantai bawah. Kalau kabel putus, DNS pasti ikut gagal. Memeriksa dari bawah menghemat waktu dan mencegah perbaikan yang tidak perlu.',
    soal: { tanya: 'Situs sekolah tidak terbuka dan lampu NIC mati. Apa yang diperiksa pertama?', pilihan: [
      { t: 'Kabel dan konektor', benar: true, alasan: 'Lampu NIC mati berarti lantai 1 (fisik) bermasalah. Mulai dari sana.' },
      { t: 'Pengaturan DNS', alasan: 'DNS ada di lantai 3. Tanpa link fisik, DNS tidak mungkin bekerja, jadi memeriksanya dulu membuang waktu.' },
      { t: 'Instal ulang browser', alasan: 'Browser bukan bagian jaringan. Lampu NIC yang mati menunjukkan masalah fisik.' }] }
  },

  'k1-konektor': {
    kasus: 'kasus-1', judul: 'Konektor RJ45 harus terkunci', lapisan: 'Fisik',
    panel: [
      { g: 'konsep-k1-konektor-1', ket: 'Konektor baru masuk setengah: tuas belum terkait, pin belum menempel.',
        label: [[0.25, 0.16, 'lampu NIC mati'], [0.68, 0.14, 'tuas belum terkunci']] },
      { g: 'konsep-k1-konektor-2', ket: 'Konektor masuk penuh sampai klik: tuas terkait, lampu NIC hijau.',
        label: [[0.26, 0.16, 'lampu NIC hijau'], [0.72, 0.12, 'klik!']] }],
    apa: 'Konektor RJ45 punya tuas pengunci. Tanpa bunyi klik, pin belum menempel penuh sehingga kartu jaringan (NIC) tidak mendeteksi link dan lampunya mati.',
    kenapa: 'LAN tester dipakai dulu untuk membedakan kabel rusak dari konektor longgar. Karena kabelnya terbukti sehat, kita cukup menancapkan ulang, tidak perlu membuang kabel.',
    bukti: { kasus: 'kasus-1', langkah: 'Uji' },
    soal: { tanya: 'Lampu LAN tester 1–8 menyala berurutan, tetapi lampu NIC mati. Tindakan paling tepat?', pilihan: [
      { t: 'Tancapkan konektor sampai klik', benar: true, alasan: 'Kabelnya sehat; yang bermasalah sambungan konektor ke port.' },
      { t: 'Ganti dengan kabel baru', alasan: 'LAN tester sudah membuktikan kabelnya sehat. Mengganti kabel membuang barang yang tidak rusak.' },
      { t: 'Instal ulang driver jaringan', alasan: 'Lampu NIC mati berarti link fisik tidak ada. Driver ada di atas lapisan fisik.' }] }
  },

  'k2-crimping': {
    kasus: 'kasus-2', judul: 'Crimping: pin harus menusuk tembaga', lapisan: 'Fisik',
    panel: [
      { g: 'konsep-k2-crimping-1', ket: 'Benar: 8 kabel mentok di ujung, pin emas menusuk tiap kabel, selubung terjepit.',
        label: [[0.72, 0.13, 'pin menusuk kabel'], [0.28, 0.86, 'selubung terjepit'], [0.82, 0.9, 'mentok di ujung']] },
      { g: 'konsep-k2-crimping-2', ket: 'Kabel tidak mentok: pin di depan hanya menusuk udara, jalurnya putus.',
        label: [[0.72, 0.13, 'pin menusuk udara'], [0.74, 0.9, 'jalur putus']] },
      { g: 'konsep-k2-crimping-3', ket: 'Selubung tidak terjepit: kabel kecil terbuka dan mudah tertarik lepas.',
        label: [[0.24, 0.86, 'selubung di luar penjepit']] }],
    apa: 'Saat di-crimp, delapan pin emas ditekan turun dan menusuk tembaga di dalam kabel. Urutan warna T568B harus sama di kedua ujung (kabel straight).',
    kenapa: 'Kabel yang tidak mentok membuat pin menusuk udara, jadi jalurnya putus. Selubung yang tidak terjepit membuat kabel mudah tertarik lepas. Gigitan tikus memutus kabel di pin 1, 2, 3, dan 6, karena itu lampunya mati.',
    bukti: { kasus: 'kasus-2', langkah: 'Uji' },
    soal: { tanya: 'Setelah crimping, lampu 4 dan 5 tidak menyala, yang lain menyala urut. Penyebab paling mungkin?', pilihan: [
      { t: 'Kabel biru dan putih-biru tidak mentok', benar: true, alasan: 'Pin 4 dan 5 adalah biru dan putih-biru. Hanya dua jalur itu yang tidak tersentuh pin.' },
      { t: 'Seluruh urutan warna terbalik', alasan: 'Jika urutan terbalik, hasil LAN tester berubah di banyak pin, bukan hanya dua.' },
      { t: 'Kabelnya terlalu panjang', alasan: 'Panjang kabel (di bawah 100 m) tidak membuat dua pin tertentu putus.' }] }
  },

  'k3-topologi': {
    kasus: 'kasus-3', judul: 'Patch panel, switch, dan lampu port', lapisan: 'Fisik',
    panel: [{ g: 'konsep-k3-topologi', ket: 'Setiap ruangan tersambung lewat satu kabel ke satu port. Satu kabel gelap = satu ruangan putus.',
      label: [[0.166, 0.083, 'Ruang TU'], [0.5, 0.035, 'Perpustakaan'], [0.837, 0.086, 'Lab Komputer 2'], [0.168, 0.617, 'Ruang Guru'],
              [0.5, 0.69, 'Aula'], [0.832, 0.617, 'Multimedia'], [0.5, 0.34, 'patch panel + switch'], [0.72, 0.41, 'port 7: gelap']] }],
    apa: 'Kabel tiap ruangan masuk ke port di patch panel, lalu diteruskan ke switch. Lampu PWR = switch hidup, lampu link = kabel tersambung, lampu berkedip = ada data lewat.',
    kenapa: 'Karena satu port melayani satu ruangan, port yang lampunya menyala tidak boleh dicabut: ruangan lain sedang memakainya. Cari port yang lampunya mati.',
    bukti: { kasus: 'kasus-3', langkah: 'Uji' },
    soal: { tanya: 'Lampu link port 7 mati, sedangkan port lain menyala. Artinya?', pilihan: [
      { t: 'Hanya jalur port 7 yang terputus', benar: true, alasan: 'Port lain menyala, jadi switch hidup. Masalahnya hanya di kabel port 7.' },
      { t: 'Switch mati', alasan: 'Kalau switch mati, lampu PWR dan semua port ikut padam.' },
      { t: 'Internet sekolah putus', alasan: 'Ruangan lain tetap normal, jadi masalahnya bukan di internet sekolah.' }] }
  },

  'k4-ip': {
    kasus: 'kasus-4', judul: 'Satu alamat IP untuk satu perangkat', lapisan: 'Alamat',
    panel: [
      { g: 'konsep-k4-ip-1', ket: 'Dua rumah memasang nomor yang sama. Kurir bingung, paket kadang salah alamat.',
        label: [[0.231, 0.164, '192.168.10.20'], [0.777, 0.164, '192.168.10.20']] },
      { g: 'konsep-k4-ip-2', ket: 'Alamat .1 adalah gerbang (gateway): jalan keluar semua data ke internet.',
        label: [[0.518, 0.22, 'Gateway 192.168.10.1']] }],
    apa: 'Dalam satu jaringan, setiap alamat IP hanya boleh dipakai satu perangkat, seperti nomor rumah di satu kompleks.',
    kenapa: 'Router mengirim balasan ke perangkat yang terakhir mengaku memakai nomor itu. Akibatnya PC katalog dan printer bergantian kehilangan data: internetnya putus-sambung.',
    bukti: { kasus: 'kasus-4', langkah: 'Uji' },
    soal: { tanya: 'Printer baru perlu IP statis. Pilihan terbaik?', pilihan: [
      { t: '192.168.10.35 (kompleks statis, kosong)', benar: true, alasan: 'Kompleks statis untuk perangkat tetap, dan nomor ini belum dipakai.' },
      { t: '192.168.10.150 (kompleks DHCP)', alasan: 'Nomor di kompleks DHCP bisa dibagikan ke perangkat lain, lalu bentrok lagi.' },
      { t: '192.168.10.1', alasan: '.1 adalah gateway (router). Memakainya membuat seluruh jaringan kacau.' }] }
  },

  'k5-dhcp': {
    kasus: 'kasus-5', judul: 'DHCP dan alamat darurat 169.254', lapisan: 'Layanan',
    panel: [
      { g: 'konsep-k5-dhcp-1', ket: 'DHCP menyala: kurir membagikan nomor resmi lewat 4 langkah DORA.',
        label: [[0.235, 0.173, 'Server DHCP'], [0.507, 0.7, '.101'], [0.678, 0.7, '.102'], [0.847, 0.7, '.103']] },
      { g: 'konsep-k5-dhcp-2', ket: 'DHCP mati: komputer memasang nomor darurat sendiri. Jalannya buntu, tidak bisa ke internet.',
        label: [[0.236, 0.173, 'DHCP MATI'], [0.63, 0.84, '169.254.x.x (darurat)']] }],
    apa: 'DHCP membagikan alamat IP otomatis lewat Discover, Offer, Request, Acknowledge. Jika tidak ada jawaban, komputer memasang alamat darurat 169.254.x.x (APIPA) yang tidak bisa ke internet.',
    kenapa: 'Semua PC TU mendapat 169.254 sekaligus, jadi sumbernya satu: server DHCP. Mengisi IP manual di tiap PC hanya menambal dan berisiko bentrok.',
    bukti: { kasus: 'kasus-5', langkah: 'Uji' },
    soal: { tanya: 'Semua PC di satu ruangan mendapat alamat 169.254.x.x. Apa yang diperiksa pertama?', pilihan: [
      { t: 'Layanan DHCP di router', benar: true, alasan: 'Semua PC gagal mendapat alamat bersamaan, jadi pembagi alamatnya yang bermasalah.' },
      { t: 'Kabel setiap PC satu per satu', alasan: 'Tidak mungkin semua kabel rusak bersamaan. Cari penyebab yang dipakai bersama.' },
      { t: 'Pengaturan DNS', alasan: 'DNS ada di atas lapisan alamat. Tanpa IP yang benar, DNS belum bisa dipakai.' }] }
  },

  'k6-dns': {
    kasus: 'kasus-6', judul: 'DNS = buku telepon jaringan', lapisan: 'Layanan',
    panel: [
      { g: 'konsep-k6-dns-1', ket: 'Normal: nama situs dicari di buku telepon (DNS), lalu diarahkan ke alamat IP yang benar.',
        label: [[0.667, 0.2, 'smkcendekia.sch.id'], [0.5, 0.95, 'DNS: nama → IP']] },
      { g: 'konsep-k6-dns-2', ket: 'Dibelokkan: DNS diganti 10.10.10.66 milik Glitch, jadi nama situs diarahkan ke tempat asing.',
        label: [[0.38, 0.62, 'DNS 10.10.10.66'], [0.84, 0.18, 'alamat asing']] },
      { g: 'konsep-k6-dns-3', ket: 'Setelah DNS dibetulkan, catatan lama (cache) dibuang dengan ipconfig /flushdns.',
        label: [[0.72, 0.56, 'ipconfig /flushdns']] }],
    apa: 'DNS menerjemahkan nama situs menjadi alamat IP. Komputer juga menyimpan jawaban lama (cache) supaya lebih cepat.',
    kenapa: 'ping ke 8.8.8.8 berhasil, berarti jalannya ada. ping ke nama situs gagal, berarti buku teleponnya yang salah. Setelah diperbaiki, cache lama harus dibuang agar komputer tidak memakai jawaban keliru.',
    bukti: { kasus: 'kasus-6', langkah: 'Uji' },
    soal: { tanya: 'ping 8.8.8.8 berhasil, tetapi ping smkcendekia.sch.id gagal. Masalahnya di mana?', pilihan: [
      { t: 'DNS', benar: true, alasan: 'Jalan ke IP terbuka; yang gagal hanya menerjemahkan nama ke IP.' },
      { t: 'Kabel', alasan: 'Kalau kabel bermasalah, ping ke 8.8.8.8 juga gagal.' },
      { t: 'DHCP', alasan: 'Laptop sudah punya alamat IP yang benar, jadi DHCP berjalan.' }] }
  },

  'k7-sinyal': {
    kasus: 'kasus-7', judul: 'Sinyal Wi-Fi: penghalang dan kanal', lapisan: 'Fisik',
    panel: [
      { g: 'konsep-k7-sinyal-1', ket: 'AP di pojok di balik beton: gelombang terpotong, kursi belakang jadi zona mati.',
        label: [[0.12, 0.26, 'dinding beton'], [0.13, 0.76, 'AP'], [0.35, 0.95, 'zona mati (−78 dBm)']] },
      { g: 'konsep-k7-sinyal-2', ket: 'AP di depan panggung: gelombang menyebar rata sampai kursi belakang.',
        label: [[0.55, 0.36, 'AP kanal 11'], [0.5, 0.96, 'kursi belakang di atas −67 dBm']] }],
    apa: 'Sinyal Wi-Fi melemah oleh jarak dan penghalang seperti beton dan pilar. AP di kanal yang sama atau bertumpuk saling mengganggu. Di 2,4 GHz hanya kanal 1, 6, dan 11 yang tidak tumpang tindih.',
    kenapa: 'Ada dua penyebab, jadi ada dua perbaikan: AP dipindah menjauhi beton, dan kanal diganti ke 11 karena tetangga memakai 1 dan 6. Ukuran dBm: −50 sangat baik, −67 batas layak lomba, −80 sangat lemah.',
    bukti: { kasus: 'kasus-7', langkah: 'Uji' },
    soal: { tanya: 'AP tetangga memakai kanal 1 dan 6. Kanal terbaik untuk AP aula?', pilihan: [
      { t: 'Kanal 11', benar: true, alasan: 'Kanal 11 tidak tumpang tindih dengan 1 maupun 6.' },
      { t: 'Kanal 3', alasan: 'Kanal 3 menumpuk dengan kanal 1 dan 6 sekaligus.' },
      { t: 'Kanal 6', alasan: 'Sama persis dengan AP tetangga, jadi tetap bertabrakan.' }] }
  },

  'k8-mac': {
    kasus: 'kasus-8', judul: 'MAC address dan access point liar', lapisan: 'Keamanan',
    panel: [
      { g: 'konsep-k8-mac-1', ket: 'Nama perangkat bisa dipalsukan, tetapi label MAC di kartu jaringannya tetap berbeda.',
        label: [[0.31, 0.36, 'MAC terdaftar'], [0.48, 0.52, 'MAC asing'], [0.84, 0.52, 'MAC asing']] },
      { g: 'konsep-k8-mac-2', ket: 'Pintu depan dikunci, tetapi access point liar tanpa sandi menjadi pintu samping yang terbuka.',
        label: [[0.26, 0.2, 'Wi-Fi sekolah: bersandi'], [0.78, 0.2, 'SMK-Free: tanpa sandi']] }],
    apa: 'MAC address adalah nomor unik kartu jaringan. Nama perangkat bisa diganti siapa saja, sedangkan MAC tercatat di inventaris lab.',
    kenapa: 'Penyusup sengaja memakai nama PC lab agar tidak dicurigai, jadi yang dicocokkan harus MAC. Mereka masuk lewat access point tanpa sandi, seperti pintu samping yang tidak dikunci.',
    bukti: { kasus: 'kasus-8', langkah: 'Uji' },
    soal: { tanya: 'Perangkat bernama PC-L2-03 punya MAC yang tidak ada di inventaris. Kesimpulan?', pilihan: [
      { t: 'Perangkat asing yang menyamar', benar: true, alasan: 'Namanya meniru PC lab, tetapi MAC-nya tidak terdaftar.' },
      { t: 'PC-L2-03 rusak', alasan: 'PC yang rusak tetap memakai MAC aslinya yang terdaftar.' },
      { t: 'Inventarisnya pasti salah', alasan: 'Inventaris adalah acuan resmi lab; perangkat yang tidak tercatat harus dicurigai.' }] }
  },

  'k9-amankan': {
    kasus: 'klimaks', judul: 'Urutan mengamankan jaringan', lapisan: 'Keamanan',
    panel: [
      { g: 'konsep-k9-amankan-1', ket: 'Tutup jalur masuk: cabut access point liar.', label: [[0.5, 0.08, '1 · Cabut AP liar']] },
      { g: 'konsep-k9-amankan-2', ket: 'Usir penyusup: blokir MAC perangkat asing.', label: [[0.5, 0.08, '2 · Blokir MAC asing']] },
      { g: 'konsep-k9-amankan-3', ket: 'Kunci jaringan: WPA2/WPA3 dengan sandi panjang.', label: [[0.5, 0.08, '3 · WPA2/WPA3 + sandi kuat']] },
      { g: 'konsep-k9-amankan-4', ket: 'Buktikan: periksa ulang daftar perangkat dengan inventaris.', label: [[0.5, 0.08, '4 · Periksa ulang']] }],
    apa: 'Mengamankan jaringan ada urutannya: tutup jalur masuk, usir penyusup, kunci jaringan, lalu periksa ulang.',
    kenapa: 'Kalau pintu masih terbuka, penyusup yang diusir bisa masuk lagi. Sandi panjang dengan huruf, angka, dan simbol butuh waktu sangat lama untuk ditebak. Periksa ulang adalah bukti bahwa jaringan benar-benar bersih.',
    bukti: { kasus: 'klimaks', langkah: 'Perbaikan' },
    soal: { tanya: 'Kamu menemukan access point liar tanpa sandi. Langkah PERTAMA?', pilihan: [
      { t: 'Cabut access point liar', benar: true, alasan: 'Selama pintunya terbuka, penyusup bisa terus masuk.' },
      { t: 'Periksa ulang daftar perangkat', alasan: 'Periksa ulang dilakukan terakhir, setelah penyusup diusir dan jaringan dikunci.' },
      { t: 'Sembunyikan nama Wi-Fi (SSID)', alasan: 'Jaringan tersembunyi tetap bisa ditemukan dengan Wi-Fi analyzer.' }] }
  }
};

// Kartu "Kenapa Salah?": tampil sekali setelah umpan balik tindakan salah tertentu.
// kunci 'kasus/id-umpan-balik' -> { g: gambar, keliru, benar }
NQ.data.kenapaSalah = {
  'kasus-1/ganti-tanpa-uji': { g: 'konsep-k1-konektor-1',
    keliru: 'Mengganti kabel sebelum diuji bisa membuang kabel yang sebenarnya sehat. Lampu NIC mati juga bisa karena konektor belum terkunci.',
    benar: 'Uji dulu dengan LAN tester. Jika lampu 1–8 menyala urut, kabel sehat: cukup tancapkan konektor sampai klik.' },
  'kasus-2/urutan-salah': { g: 'konsep-k2-crimping-1',
    keliru: 'Warna yang tertukar membuat pin terhubung ke pasangan kabel yang salah, sehingga data tidak sampai atau terganggu.',
    benar: 'Ikuti kartu T568B: putih-oranye, oranye, putih-hijau, biru, putih-biru, hijau, putih-cokelat, cokelat.' },
  'kasus-2/tidak-mentok': { g: 'konsep-k2-crimping-2',
    keliru: 'Kabel yang tidak mentok membuat pin emas menusuk udara. Jalurnya putus walaupun warnanya benar.',
    benar: 'Ratakan ujung kabel, lalu dorong sampai kedelapan kabel menyentuh ujung depan konektor.' },
  'kasus-2/selubung-tidak-terjepit': { g: 'konsep-k2-crimping-3',
    keliru: 'Tanpa selubung di bawah penjepit, kabel kecil yang menahan tarikan. Lama-lama kabel lepas dari pin.',
    benar: 'Kupas secukupnya (sekitar 1,5 cm) agar selubung ikut masuk dan terjepit saat di-crimp.' },
  'kasus-3/cabut-port-menyala': { g: 'konsep-k3-topologi',
    keliru: 'Port yang lampunya menyala sedang melayani satu ruangan. Mencabutnya memutus orang yang sedang bekerja.',
    benar: 'Cari port yang lampu link-nya mati, lalu telusuri kabelnya.' },
  'kasus-4/kavling-terisi': { g: 'konsep-k4-ip-1',
    keliru: 'Nomor itu sudah dipakai perangkat lain. Dua perangkat dengan nomor sama akan bentrok lagi.',
    benar: 'Pilih nomor kosong di kompleks statis (.2–.99) dan catat di daftar IP statis.' },
  'kasus-4/kavling-dhcp': { g: 'konsep-k4-ip-1',
    keliru: 'Nomor di kompleks DHCP bisa dibagikan otomatis ke perangkat lain, lalu bentrok dengan printer.',
    benar: 'Perangkat tetap seperti printer memakai nomor di kompleks statis (.2–.99).' },
  'kasus-4/pakai-gateway': { g: 'konsep-k4-ip-2',
    keliru: '.1 adalah gateway, gerbang semua data ke internet. Memakainya membuat seluruh jaringan kehilangan jalan keluar.',
    benar: 'Jangan pernah memberi perangkat lain alamat gateway. Pilih nomor kosong di kompleks statis.' },
  'kasus-5/ip-statis-manual': { g: 'konsep-k5-dhcp-2',
    keliru: 'Mengisi IP satu per satu hanya menambal gejala. Penyebabnya tetap ada: layanan DHCP mati.',
    benar: 'Periksa dan nyalakan layanan DHCP di router, lalu ipconfig /renew di setiap PC.' },
  'kasus-5/renew-sebelum-dhcp': { g: 'konsep-k5-dhcp-2',
    keliru: 'ipconfig /renew meminta alamat ke DHCP. Selama loket DHCP tutup, permintaannya tidak dijawab.',
    benar: 'Nyalakan layanan DHCP dulu, baru ipconfig /renew.' },
  'kasus-5/pool-menimpa-statis': { g: 'konsep-k4-ip-1',
    keliru: 'Pool .2–.200 menimpa kompleks statis, sehingga DHCP bisa membagikan nomor yang sudah dipakai printer atau server.',
    benar: 'Biarkan pool DHCP .100–.200 dan kompleks statis .2–.99 terpisah.' },
  'kasus-7/ap-terhalang': { g: 'konsep-k7-sinyal-1',
    keliru: 'Beton dan pilar menyerap sinyal, sehingga kursi belakang tetap menjadi zona mati.',
    benar: 'Pindahkan AP ke depan panggung, jauh dari dinding beton.' },
  'kasus-8/blokir-perangkat-inventaris': { g: 'konsep-k8-mac-1',
    keliru: 'Perangkat itu tercatat di inventaris. Memblokirnya memutus PC lab yang sah.',
    benar: 'Cocokkan MAC, bukan nama. Blokir hanya MAC yang tidak ada di inventaris.' },
  'klimaks/pintu-masih-terbuka': { g: 'konsep-k9-amankan-1',
    keliru: 'Selama access point liar menyala, penyusup yang diusir bisa masuk lagi lewat pintu itu.',
    benar: 'Cabut access point liar dulu, baru blokir MAC asing dan kunci Wi-Fi.' },
  'klimaks/sandi-lemah': { g: 'konsep-k9-amankan-3',
    keliru: 'Sandi pendek atau kata umum ditebak dalam hitungan detik oleh program penebak sandi.',
    benar: 'Gabungkan kata acak, angka, dan simbol sampai minimal 12 karakter.' }
};
