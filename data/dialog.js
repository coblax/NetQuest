/*
 * Dialog semua tokoh. Format satu baris:
 *   { tokoh: 'Nama', potret: 'id-potret', pemicu: 'kapan muncul', teks: '...' }
 * Satu baris = satu kotak dialog (paling banyak dua baris pendek di layar).
 * Baris dengan pemicu yang sama ditampilkan berurutan sebagai satu percakapan.
 * Sumber: Naskah Lengkap bagian C ("Storyboard NetQuest - Naskah Lengkap.docx").
 *
 * id potret: c1-pak-bima, c2-kak-dimas, c3-bu-wati, c4-pak-hasan, c5-bu-rina,
 * c6-pak-joko, c7-pak-hendra, c8-rara, c9-ibu-kepsek, raka, pingo, glitch.
 * potret null = tanpa potret (teks sistem).
 */
window.NQ = window.NQ || {};
NQ.data = NQ.data || {};

NQ.data.dialog = {

  // ===== Scene 2–3 · Prolog: Kantor Kepala Lab =====
  prolog: [
    { tokoh: 'Kartu teknisi', potret: null, pemicu: 'mulai', teks: 'Selamat datang, Teknisi Muda! Tulis nama dan kelasmu di kartu ini.' },
    { tokoh: 'Pak Bima', potret: 'c1-pak-bima', pemicu: 'masuk-kantor', teks: 'Raka, pas sekali kamu datang. Tiga hari lagi lomba daring, jaringan sekolah malah kacau.' },
    { tokoh: 'Pak Bima', potret: 'c1-pak-bima', pemicu: 'masuk-kantor', teks: 'Bawa Tas Teknisi di mejaku itu. Ambil dengan tombol E.' },
    { tokoh: 'Pak Bima', potret: 'c1-pak-bima', pemicu: 'ambil-tas', teks: 'Robot kecil di rak itu Pingo. Dia bisa melihat yang tidak terlihat mata. Coba nyalakan.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'nyalakan-pingo', teks: 'Bip! Sistem menyala... Pingo siap memindai! Halo, Raka!' },
    { tokoh: 'Pak Bima', potret: 'c1-pak-bima', pemicu: 'buka-jurnal', teks: 'Teknisi tidak menebak. Catat gejalanya, buktikan dugaanmu, baru perbaiki.' },
    { tokoh: 'Pak Bima', potret: 'c1-pak-bima', pemicu: 'buka-jurnal', teks: 'Ada 6 langkah: gejala, dugaan, uji, perbaikan, verifikasi, catat. Jurnal ini akan mengingatkanmu.' },
    { tokoh: 'Pak Bima', potret: 'c1-pak-bima', pemicu: 'buka-jurnal', teks: 'Periksa dari bawah ke atas: kabel dan lampu dulu, baru alamat IP, baru layanan seperti DHCP dan DNS.' },
    { tokoh: 'Pak Bima', potret: 'c1-pak-bima', pemicu: 'buka-jurnal', teks: 'Satu lagi: jangan mencabut perangkat yang menyala kalau belum tahu fungsinya.' },
    { tokoh: 'Pak Bima', potret: 'c1-pak-bima', pemicu: 'pilih-lan-tester', teks: 'Bagus. Bu Wati melapor PC 07 di Lab Komputer 1 tidak bisa internet. Itu kasus pertamamu.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'keluar-kantor', teks: 'Ikuti tanda seru kuning di peta, ya. Tekan M kalau bingung arah!' }
  ],

  // ===== Scene 4 · Kasus 1: Lab Komputer 1 =====
  'kasus-1': [
    { tokoh: 'Bu Wati', potret: 'c3-bu-wati', pemicu: 'bicara-bu-wati', teks: 'Raka! PC 07 tidak bisa internet sejak pagi. Yang lain normal semua.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'periksa-monitor-pc07', teks: 'Ikon jaringannya silang merah. Itu gejalanya. Catat dulu!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'periksa-pc-normal', teks: 'PC sebelahnya lancar. Berarti masalahnya hanya di PC 07, bukan di seluruh lab.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'merunduk-kolong-meja', teks: 'Konektornya tidak terkunci, dan lampu NIC mati! Tapi kabelnya sendiri sehat atau tidak?' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'lan-tester-ok', teks: 'Delapan lampu menyala urut. Kabelnya sehat! Tinggal pasang konektornya dengan benar.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'konektor-klik', teks: 'Klik! Lampu NIC hijau. Ayo cek layar PC 07 lagi.' },
    { tokoh: 'Bu Wati', potret: 'c3-bu-wati', pemicu: 'verifikasi-berhasil', teks: 'Wah, sudah tersambung! Ternyata cuma konektor longgar, ya. Terima kasih, Raka.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'kasus-selesai', teks: 'Kasus selesai! Ingat: periksa yang paling sederhana dulu.' },
    // tambahan untuk interaksi di game
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'gejala-dulu', teks: 'Catat gejalanya dulu: lihat layar PC 07.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'dugaan-dulu', teks: 'Sebelum menguji, bandingkan dulu dengan PC lain. Apakah masalahnya hanya di PC 07?' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'pc-normal-lagi', teks: 'PC ini normal. Fokus pada PC 07, ya.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'kabel-sehat', teks: 'Kabelnya sehat, tidak perlu diganti. Cukup tancapkan konektornya sampai klik.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'monitor-normal', teks: 'Ikon jaringan sudah normal. Internet PC 07 kembali!' }
  ],

  // ===== Scene 5 · Kasus 2: Ruang Guru =====
  'kasus-2': [
    { tokoh: 'Pak Hasan', potret: 'c4-pak-hasan', pemicu: 'bicara-pak-hasan', teks: 'Tadi ada tikus lewat, lalu internet saya mati. Lihat kabel ini, digigit sampai putus!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'periksa-kabel-digigit', teks: 'Ujung kabelnya rusak. Kita potong bagian yang rusak lalu pasang konektor baru.' },
    { tokoh: 'Pak Hasan', potret: 'c4-pak-hasan', pemicu: 'dekati-kotak-alat', teks: 'Pakai alat di kotak itu. Konektornya tinggal tiga, hati-hati ya.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'buka-meja-crimping', teks: 'Lihat kartu T568B. Ujung kabel satunya juga T568B, jadi ini kabel straight.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'kabel-siap-crimp', teks: 'Ratakan ujungnya, dorong sampai mentok di ujung konektor, lalu crimp!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'lan-tester-ok', teks: 'Satu sampai delapan menyala berurutan. Sempurna!' },
    { tokoh: 'Pak Hasan', potret: 'c4-pak-hasan', pemicu: 'verifikasi-berhasil', teks: 'Internet saya kembali! Nanti saya minta pelindung kabel supaya tidak digigit lagi.' },
    // tambahan untuk interaksi di game
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'uji-kabel-digigit', teks: 'Terbukti: lampu 1, 2, 3, dan 6 tidak menyala. Jalurnya putus di ujung yang digigit.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'uji-kabel-digigit', teks: 'Kita perbaiki di meja kerja. Ambil dulu alat dari kotak Pak Hasan.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'alat-dulu', teks: 'Kita butuh tang crimping dan konektor dari kotak alat Pak Hasan.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'pasang-kabel', teks: 'Kabel baru siap. Aku pasangkan ke PC Pak Hasan, ya!' }
  ],

  // ===== Scene 6 · Kasus 3: Ruang Server =====
  'kasus-3': [
    { tokoh: 'Kak Dimas', potret: 'c2-kak-dimas', pemicu: 'bicara-kak-dimas', teks: 'Kamu Raka, ya? Pak Bima sudah cerita. Ini kartu aksesnya.' },
    { tokoh: 'Kak Dimas', potret: 'c2-kak-dimas', pemicu: 'bicara-kak-dimas', teks: 'Beberapa ruangan putus sejak semalam. Jangan cabut yang menyala, ya. Itu jalur ruangan lain.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'periksa-switch', teks: 'Lampu PWR menyala, berarti switch hidup. Lampu link menyala berarti kabel tersambung.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'periksa-switch', teks: 'Lampu yang berkedip berarti ada data lewat. Ayo cari port yang lampunya mati.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'pindai-aktif', teks: 'Lihat! Aliran data jadi cahaya biru. Satu kabel gelap. Kita telusuri ujungnya.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'temukan-port-7', teks: 'Kabelnya longgar di port 7. Pasang ulang sampai klik.' },
    { tokoh: 'Kak Dimas', potret: 'c2-kak-dimas', pemicu: 'verifikasi-berhasil', teks: 'Mantap! Lampu link port 7 hidup lagi. Lab Komputer 2 tersambung.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'lihat-kilau-ungu', teks: 'Ada jejak aneh... warnanya ungu. Ini bukan bagian perangkat jaringan.' },
    { tokoh: 'Glitch', potret: 'glitch', pemicu: 'glitch-kabur', teks: 'Hihihi... cepat juga kamu.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'ambil-keping', teks: 'Keping data ungu! Ada yang sengaja mengacau jaringan sekolah. Kita simpan di Tas.' },
    // tambahan untuk interaksi di game
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'pintu-terkunci', teks: 'Pintu Ruang Server butuh kartu akses. Kak Dimas yang memegangnya.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'pindai-dulu', teks: 'Kita belum tahu kabel mana yang gelap. Tekan Q untuk memindai dulu.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'switch-dulu', teks: 'Periksa dulu lampu di switch. Gejalanya harus dicatat sebelum memindai.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'babak1-selesai', teks: 'Babak 1 selesai! Kabel-kabel sudah beres, tapi jejak ungu ini masih misteri.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'babak1-selesai', teks: 'Bip bip! Ada panggilan masuk dari Pak Bima.' }
  ],

  // ===== Scene 7 · Kasus 4: Perpustakaan =====
  'kasus-4': [
    { tokoh: 'Pak Bima', potret: 'c1-pak-bima', pemicu: 'panggilan-pak-bima', teks: 'Kabel sudah beres, tapi beberapa ruangan masih bermasalah. Sekarang periksa alamatnya. Mulai dari perpustakaan.' },
    { tokoh: 'Bu Rina', potret: 'c5-bu-rina', pemicu: 'bicara-bu-rina', teks: 'Internet katalog putus-sambung sejak printer baru dipasang. Aneh, kan?' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'pindai-aktif', teks: 'Setiap perangkat punya nomor rumah, yaitu alamat IP. Lihat papan di atas PC dan printer!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'periksa-dua-perangkat', teks: 'Dua-duanya 192.168.10.20! Dua perangkat berebut satu nomor rumah. Itu IP bentrok.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'buka-papan-alamat', teks: 'Kompleks statis .2 sampai .99 untuk perangkat tetap seperti printer. Kompleks DHCP .100 sampai .200 dibagikan otomatis.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'printer-dipindah', teks: 'Printer pindah rumah. Petirnya hilang! Cek PC katalog lagi.' },
    { tokoh: 'Bu Rina', potret: 'c5-bu-rina', pemicu: 'verifikasi-berhasil', teks: 'Katalog lancar dan printer juga bisa mencetak. Terima kasih, Nak.' },
    // tambahan untuk interaksi di game
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'lihat-pc-katalog', teks: 'Ikon jaringannya muncul-hilang. Internet PC katalog putus-sambung. Itu gejalanya.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'gejala-dulu', teks: 'Lihat dulu layar PC katalog untuk mencatat gejalanya.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'pindai-dulu', teks: 'Kita belum tahu penyebabnya. Tekan Q untuk memindai nomor rumah setiap perangkat.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'lihat-ip', teks: 'Pengaturan IP-nya: 192.168.10.20, statis.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'uji-terbukti', teks: 'Terbukti! PC katalog dan printer sama-sama memakai 192.168.10.20. Printer harus pindah rumah.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'verifikasi-katalog', teks: 'Ikon jaringan PC katalog stabil. Printer juga mencetak halaman uji.' }
  ],

  // ===== Scene 8 · Kasus 5: Ruang TU =====
  'kasus-5': [
    { tokoh: 'Kak Dimas', potret: 'c2-kak-dimas', pemicu: 'terima-laptop', teks: 'Pegang laptop teknisi ini. Di laptop kamu bisa mengetik perintah jaringan sungguhan.' },
    { tokoh: 'Pak Joko', potret: 'c6-pak-joko', pemicu: 'bicara-pak-joko', teks: 'Semua komputer TU tidak bisa internet! Angka alamatnya aneh, depannya 169.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'ketik-ipconfig', teks: '169.254 itu alamat darurat. Komputer memberi alamat sendiri karena tidak ada jawaban dari server DHCP.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'periksa-lemari-router', teks: 'Kurir alamat tertahan! Layanan DHCP di router dimatikan seseorang.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'ambil-keping', teks: 'Keping ungu lagi. Pelakunya sama!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'dhcp-menyala', teks: 'Perhatikan kurirnya: Discover, Offer, Request, Acknowledge. Empat langkah.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'kurir-selesai', teks: 'Sekarang ketik ipconfig /renew supaya komputer meminta alamat baru.' },
    { tokoh: 'Pak Joko', potret: 'c6-pak-joko', pemicu: 'verifikasi-berhasil', teks: 'Alamatnya normal lagi, 192.168.10 sekian. Internet jalan!' },
    // tambahan untuk interaksi di game
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'ipconfig-dulu', teks: 'Ketik ipconfig di salah satu PC TU dulu untuk melihat alamatnya.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'lemari-dulu', teks: 'Periksa dulu lemari router di pojok kanan.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'dhcp-mati', teks: 'Terbukti: layanan DHCP berstatus MATI. Tidak ada yang membagikan alamat ke komputer TU.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'keping-dulu', teks: 'Masih ada keping ungu di sakelar dinding. Ambil dulu sebelum laporan ditutup!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'renew-ulang', teks: 'Sekarang server DHCP sudah menjawab. Ketik ipconfig /renew lagi.' }
  ],

  // ===== Scene 9 · Kasus 6: Ruang Multimedia =====
  'kasus-6': [
    { tokoh: 'Pak Hendra', potret: 'c7-pak-hendra', pemicu: 'bicara-pak-hendra', teks: 'Ping ke internet jalan, tapi situs sekolah tidak bisa dibuka. Saya bingung.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'ping-ip-berhasil', teks: 'Jalan ke internet terbuka. Sekarang coba ping ke nama situsnya.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'ping-domain-gagal', teks: 'IP lancar, nama gagal. Berarti buku teleponnya, DNS, yang bermasalah.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'nslookup-gagal', teks: 'Benar, nslookup juga gagal. Coba lihat DNS server dengan ipconfig /all.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'dns-asing-tampil', teks: '10.10.10.66 bukan DNS sekolah. Buku telepon jaringan ini dibelokkan ke alamat asing!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'dns-otomatis', teks: 'Sekarang ipconfig /flushdns untuk menghapus catatan lama, lalu ulangi nslookup.' },
    { tokoh: 'Pak Hendra', potret: 'c7-pak-hendra', pemicu: 'verifikasi-berhasil', teks: 'Situs sekolah terbuka! Jadi masalahnya di DNS, bukan di internetnya.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'buka-berkas-ungu', teks: 'Ada berkas aneh, keping_3.dat. Isinya pesan!' },
    { tokoh: 'Glitch', potret: 'glitch', pemicu: 'buka-berkas-ungu', teks: 'Aku masuk lewat Wi-Fi tanpa sandi... Cari saja kalau bisa. Hihihi.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'kasus-selesai', teks: 'Wi-Fi tanpa sandi? Kita harus memeriksa jaringan nirkabel sekolah!' },
    // tambahan untuk interaksi di game
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'uji-dulu', teks: 'Buktikan dulu dugaan kita: coba nslookup, lalu lihat DNS server dengan ipconfig /all.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'masih-gagal', teks: 'Masih gagal karena komputer mengingat jawaban lama. Hapus dulu dengan ipconfig /flushdns.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'flushdns-ok', teks: 'Catatan lama sudah dihapus. Sekarang ulangi ping ke nama situs sekolah.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'berkas-muncul', teks: 'Eh, ada berkas baru di laptop ini: keping_3.dat. Buka lewat tombol di terminal!' }
  ],

  // ===== Scene 10 · Kasus 7: Aula =====
  'kasus-7': [
    { tokoh: 'Pak Bima', potret: 'c1-pak-bima', pemicu: 'terima-wifi-analyzer', teks: 'Alat ini mengukur kekuatan sinyal dan kanal Wi-Fi. Rara sedang menunggumu di aula.' },
    { tokoh: 'Rara', potret: 'c8-rara', pemicu: 'bicara-rara', teks: 'Besok lomba daring di sini, tapi Wi-Fi-nya lemot sekali. Di kursi belakang malah hilang.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'analyzer-kursi-belakang', teks: 'Sinyal −78 dBm. Makin negatif, makin lemah. Ini terlalu lemah untuk lomba.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'pindai-aktif', teks: 'Gelombangnya terhalang beton, dan bertabrakan dengan AP tetangga di kanal 1 dan 6.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'troli-di-tengah', teks: 'Bagus! Zona mati mengecil. Sekarang pilih kanal yang tidak tumpang tindih.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'kanal-11', teks: 'Di 2,4 GHz, kanal 1, 6, dan 11 tidak saling tumpang tindih. Tetangga sudah memakai 1 dan 6.' },
    { tokoh: 'Rara', potret: 'c8-rara', pemicu: 'verifikasi-berhasil', teks: 'Sinyalnya penuh sampai kursi belakang! Terima kasih, Raka. Lombanya aman.' },
    // tambahan untuk interaksi di game
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'analyzer-dulu', teks: 'Ukur dulu sinyalnya dengan Wi-Fi analyzer dari Tas (T).' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'analyzer-uji', teks: 'Lihat grafik kanalnya: AP aula memakai kanal 6, sama dengan AP Kantor. Ditambah terhalang beton. Terbukti!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'cara-dorong', teks: 'Dorong troli dengan berjalan ke arahnya. Bawa ke area depan panggung, jauh dari beton.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'troli-belum', teks: 'Kanalnya sudah benar, tapi AP masih terhalang. Dorong troli ke depan panggung.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'sinyal-belum', teks: 'Kursi belakang masih lemah. Pastikan AP di depan panggung dan memakai kanal 11.' }
  ],

  // ===== Scene 11 · Kasus 8: Lab Komputer 2 dan Lorong Belakang =====
  'kasus-8': [
    { tokoh: 'Bu Wati', potret: 'c3-bu-wati', pemicu: 'bicara-bu-wati', teks: 'Kuota lab habis padahal jam pelajaran belum mulai. Sepertinya ada yang numpang.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'buka-pc-admin', teks: 'Ini daftar perangkat yang terhubung. Ada nama, alamat IP, dan alamat MAC.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'buka-pc-admin', teks: 'Alamat MAC itu nomor seri kartu jaringan. Setiap perangkat punya MAC sendiri.' },
    { tokoh: 'Bu Wati', potret: 'c3-bu-wati', pemicu: 'terima-inventaris', teks: 'Ini daftar inventaris lab, lengkap dengan alamat MAC tiap PC.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'mac-asing-ditemukan', teks: 'Dua MAC ini tidak ada di inventaris. Perangkat asing! Mereka masuk lewat jaringan SMK-Free.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'pakai-wifi-analyzer', teks: 'SMK-Free tidak ada dalam daftar jaringan resmi sekolah, dan tanpa sandi. Ini access point liar!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'dekati-lorong-belakang', teks: 'Sinyalnya makin kuat: −60... −50... Bip-bip makin cepat. Ke arah gudang!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'ambil-keping', teks: 'Keping keempat! Pintu gudang punya 4 lubang. Pas sekali.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'gudang-tanpa-senter', teks: 'Di dalam gelap sekali. Kita butuh senter dari lemari Lab Komputer 2.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'gembok-terbuka', teks: 'Gemboknya terbuka! Siap, Raka? Pingo di belakangmu... eh, di sampingmu.' },
    // tambahan untuk interaksi di game
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'daftar-dulu', teks: 'Buka dulu daftar perangkat di PC admin, meja guru di pojok kanan bawah.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'cari-sumber', teks: 'Kita sudah tahu ada perangkat asing. Sekarang cari sumber SMK-Free dengan Wi-Fi analyzer.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'pintu-belakang', teks: 'Sinyal SMK-Free paling kuat ke arah pintu belakang. Ayo lewat sana!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'senter-ambil', teks: 'Senter sudah di Tas. Tempat yang kita tuju pasti gelap.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'keping-kurang', teks: 'Gemboknya punya 4 lubang. Kita belum punya cukup keping.' }
  ],

  // ===== Scene 12 · Klimaks: Gudang =====
  klimaks: [
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'masuk-gudang', teks: 'Router tua itu masih menyala, dan kabelnya masih tersambung ke jaringan sekolah!' },
    { tokoh: 'Glitch', potret: 'glitch', pemicu: 'glitch-muncul', teks: 'Akhirnya kamu sampai! SMK-Free ini pintu terbukaku. Tanpa sandi, siapa saja boleh masuk!' },
    { tokoh: 'Glitch', potret: 'glitch', pemicu: 'glitch-muncul', teks: 'Dan kalau pun pintu ini kalian tutup, router utama kalian masih memakai sandi bawaan. Hihihi!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'menu-aksi', teks: 'Pakai langkah keamanan yang benar, satu per satu. Tutup pintunya dulu!' },
    { tokoh: 'Glitch', potret: 'glitch', pemicu: 'aksi-cabut-router', teks: 'Aaargh! Pintuku!' },
    { tokoh: 'Glitch', potret: 'glitch', pemicu: 'aksi-blokir-mac', teks: 'Teman-temanku tidak bisa masuk lagi!' },
    { tokoh: 'Glitch', potret: 'glitch', pemicu: 'aksi-wpa-sandi-kuat', teks: 'Sandi sepanjang itu? Aku tidak bisa menebaknya!' },
    { tokoh: 'Glitch', potret: 'glitch', pemicu: 'aksi-periksa-ulang', teks: 'Tidak ada lagi tempat bersembunyi... aku... pecah...' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'glitch-pecah', teks: 'Jaringan bersih! Semua perangkat di daftar sudah cocok dengan inventaris.' },
    // tambahan untuk interaksi di game
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'dekati-router', teks: 'Lampu router itu berkedip ungu... Hati-hati, Raka. Ada sesuatu di atasnya!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'buka-sandi', teks: 'Pilih keamanan WPA2 atau WPA3, lalu rakit sandi: minimal 12 karakter, campur huruf, angka, dan simbol.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'buka-sandi', teks: 'Jangan pakai kata yang mudah ditebak seperti nama sekolah atau 12345678.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'lanjut-aksi', teks: 'Bagus! Kekuatan Glitch turun. Pilih langkah keamanan berikutnya.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'gudang-terang', teks: 'Lampu gudang menyala lagi. Router liar sudah dicabut dan tidak ada penyusup tersisa.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'ke-kepsek', teks: 'Ibu Kepala Sekolah menunggu laporan kita. Ruangannya di ujung kanan Lorong Utama!' }
  ],

  // ===== Scene 13 · Epilog: Ruang Kepala Sekolah =====
  epilog: [
    { tokoh: 'Ibu Kepala Sekolah', potret: 'c9-ibu-kepsek', pemicu: 'epilog-mulai', teks: 'Jaringan kita siap untuk lomba. Ceritakan apa yang kamu temukan, Raka.' },
    { tokoh: 'Pak Bima', potret: 'c1-pak-bima', pemicu: 'laporan-tersusun', teks: 'Kamu tidak menebak. Kamu membuktikan. Itulah teknisi sungguhan.' },
    { tokoh: 'Kak Dimas', potret: 'c2-kak-dimas', pemicu: 'pilih-rekomendasi', teks: 'Tulis juga apa yang harus kami lakukan supaya kejadian ini tidak terulang.' },
    { tokoh: 'Bu Wati', potret: 'c3-bu-wati', pemicu: 'sertifikat', teks: 'Lab kita lancar lagi, dan tidak ada lagi yang menumpang. Terima kasih, Raka!' },
    { tokoh: 'Pak Hasan', potret: 'c4-pak-hasan', pemicu: 'sertifikat', teks: 'Kabel saya sekarang sudah berpelindung!' },
    { tokoh: 'Bu Rina', potret: 'c5-bu-rina', pemicu: 'sertifikat', teks: 'Katalog dan printer perpustakaan akur lagi. Terima kasih, Nak.' },
    { tokoh: 'Pak Joko', potret: 'c6-pak-joko', pemicu: 'sertifikat', teks: 'Semua komputer TU dapat alamat lagi. Saya tidak panik lagi!' },
    { tokoh: 'Pak Hendra', potret: 'c7-pak-hendra', pemicu: 'sertifikat', teks: 'Sekarang saya tahu bedanya masalah IP dan masalah DNS.' },
    { tokoh: 'Rara', potret: 'c8-rara', pemicu: 'sertifikat', teks: 'Wi-Fi aula siap untuk lomba. Doakan kami menang, ya!' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'penutup', teks: 'Bip! Laporan tersimpan. Mau main lagi dan mengejar 3 bintang di semua kasus?' },
    // tambahan untuk interaksi di game
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'laporan-buka', teks: 'Bip! Pingo sudah menyusun Laporan Teknisi dari Jurnal kita. Ini ringkasannya.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'rekomendasi-salah', teks: 'Hmm, saran itu justru membuat jaringan kurang aman atau tidak menyelesaikan masalah. Coba pilih yang lain.' },
    { tokoh: 'Pingo', potret: 'pingo', pemicu: 'rekomendasi-kurang', teks: 'Pilih minimal 3 rekomendasi yang tepat dulu, ya.' },
    { tokoh: 'Ibu Kepala Sekolah', potret: 'c9-ibu-kepsek', pemicu: 'serahkan-sertifikat', teks: 'Atas kerja kerasmu, sekolah memberikan sertifikat Teknisi Jaringan Muda. Selamat!' },
    { tokoh: 'Ibu Kepala Sekolah', potret: 'c9-ibu-kepsek', pemicu: 'sudah-tamat', teks: 'Terima kasih, Raka. Laporanmu akan kami pakai untuk merawat jaringan sekolah.' }
  ]
};
