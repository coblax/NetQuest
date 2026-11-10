# Prompt Aset untuk Layar Judul dan Prolog

Aset di bawah ini belum ada. Aset lain untuk Prolog sudah dirapikan di `assets/img`.

**Aturan untuk semua prompt gambar (ChatGPT):**
- Lampirkan `Raka/Pixel Art Student Sprite Sheet.png` dan mockup scene terkait sebagai acuan gaya.
- Minta **latar transparan polos, tanpa cahaya, kabut, atau bayangan di luar objek**. Lembar dengan latar berkabut paling sulit dibersihkan.
- Setelah gambar jadi, simpan ke `assets/_sumber/`. Hasilnya akan dipotong dan diperkecil ke grid 16 px.

## Gambar

### P1 · Latar layar judul (G1) → `assets/img/latar/g1-layar-judul.png`
Lampirkan mockup Scene 1.

> Buat ilustrasi latar layar judul game pixel art 16-bit, rasio 16:9, gaya seperti gambar terlampir. Gedung SMK dua lantai bergaya Indonesia dengan atap genteng merah dan jendela-jendela kuning menyala, tiang bendera merah putih, gerbang sekolah terbuka, halaman paving, pepohonan di belakang, langit senja ungu-oranye dengan bintang. Di atap ada antena yang memercikkan cahaya ungu, dengan siluet kecil makhluk ungu di dekatnya. Bagian bawah gambar setinggi seperlima layar berupa halaman paving yang kosong untuk tempat tokoh berdiri. Sisakan ruang kosong di bagian atas untuk judul dan di kanan bawah untuk menu. Jangan gambar tokoh manusia atau robot. Garis luar gelap, palet terbatas, tanpa anti-aliasing, tanpa teks.

### P2 · Logo NETQUEST (opsional) → `assets/img/latar/logo-netquest.png`
Lewati jika judul cukup ditulis dengan font pixel.

> Buat logo judul game bertuliskan "NETQUEST" dalam huruf pixel art 16-bit tebal berwarna kuning keemasan dengan garis luar gelap dan bayangan ungu tua di bawahnya. Tambahkan ikon sinyal Wi-Fi kecil berwarna biru muda menggantikan titik di atas huruf atau di sudut kanan atas logo. Latar transparan polos tanpa cahaya di luar huruf, tanpa teks lain.

### P3 · Tas Teknisi di meja → `assets/img/objek/tas-teknisi.png`
Dibutuhkan di Scene 2 ("ambil Tas di meja Pak Bima").

> Gunakan gaya dan warna tas Raka dari gambar terlampir. Buat sprite objek pixel art 16-bit tampak atas sedikit miring: tas teknisi selempang berwarna oranye dengan tali cokelat dan gesper logam, dalam 2 versi: (1) tergeletak tertutup di atas meja, (2) versi berkilau kuning tipis di tepinya sebagai tanda bisa diambil. Ukuran kira-kira setengah tinggi kursi kantor. Garis luar gelap, tanpa teks, latar transparan polos tanpa bayangan di luar objek.

### P4 · Perabot Lorong Utama (D10) → `assets/img/perabot/lorong/`
Lorong penghubung semua ruangan.

> Buat sprite perabot pixel art 16-bit tampak atas untuk lorong sekolah, gaya seperti gambar terlampir: deretan loker siswa biru (2 variasi: tertutup dan satu pintu terbuka), papan nama kosong yang dipasang di atas pintu (tanpa tulisan), papan pengumuman gabus dengan kertas tertempel, bangku kayu panjang, tempat sampah, jendela lebar ke arah halaman, dan tanaman dalam pot besar. Ukuran mengikuti grid 16 piksel. Garis luar gelap, tanpa teks, latar transparan polos tanpa cahaya atau bayangan di luar objek. Susun berjarak agar tidak saling menempel.

### P5 · Glitch kecil latar transparan (untuk Kasus 3, boleh sekalian)
Lembar Glitch yang ada berlatar ungu berkabut dan tidak bisa dibersihkan.

> Gunakan Glitch dari gambar terlampir. Buat ulang versi kecil Glitch (seukuran robot Pingo) dalam 3 pose berjajar: melayang menyeringai, berbalik kabur, dan berkedip menghilang setengah transparan berupa kotak-kotak piksel. Pixel art 16-bit, garis luar gelap, tanpa teks. Latar transparan polos: jangan ada cahaya, kabut, atau garis-garis glitch di luar tubuhnya.

### P6 · Bingkai UI (opsional)
Bisa dibuat dengan CSS. Pakai prompt ini jika ingin bingkai bergambar.

> Buat set bingkai antarmuka game pixel art 16-bit berwarna biru tua dengan garis tepi putih dan sudut membulat bertingkat: (1) kotak dialog panjang dengan kotak potret persegi di kiri, (2) panel kecil untuk HUD, (3) kartu identitas teknisi dengan foto kosong, garis nama, dan garis kelas tanpa tulisan, (4) tombol menu dalam keadaan biasa dan dipilih (bertepi kuning). Bagian dalam bingkai polos agar bisa diisi teks oleh game. Tanpa teks, latar transparan.

## Musik (Gemini) → `assets/audio/musik/`

### M1 · Tema layar judul → `tema.mp3`
> Buat musik chiptune 8-bit untuk layar judul game petualangan misteri di sekolah. Tempo sedang, pembuka misterius dengan bunyi bip seperti sinyal jaringan, lalu melodi ceria dan bersemangat. Tanpa vokal, 60 sampai 90 detik, bisa diulang tanpa jeda.

### M2 · Eksplorasi → `eksplorasi.mp3`
> Buat musik chiptune 8-bit untuk menjelajah sekolah dalam game petualangan misteri. Tempo santai-sedang, sedikit penasaran tapi tetap ceria, tidak mengganggu saat membaca dialog. Tanpa vokal, 60 sampai 90 detik, bisa diulang tanpa jeda.

## Efek suara → `assets/audio/sfx/`

Jika Gemini tidak bisa membuat efek pendek, pakai generator efek 8-bit gratis seperti jsfxr (sfxr.me), lalu ekspor ke `.wav` atau `.mp3`.

| Nama file | Deskripsi untuk prompt atau generator |
|---|---|
| `bip-pingo.mp3` | Bip robot kecil yang ceria, dua nada naik, 0,3 detik |
| `pingo-menyala.mp3` | Suara robot menyala: dengung pendek naik lalu bip, 1 detik |
| `dengung-server.mp3` | Dengung kipas server yang halus dan rata, bisa diulang, 3 detik |
| `langkah.mp3` | Langkah sepatu di lantai keramik, satu langkah pendek, 0,15 detik |
| `tas-dibuka.mp3` | Resleting tas dibuka cepat, 0,4 detik |
| `kertas.mp3` | Halaman buku dibalik, 0,3 detik |
| `menu-pilih.mp3` | Klik menu 8-bit pendek, 0,1 detik |
| `teks-blip.mp3` | Blip sangat pendek untuk efek ketik dialog, 0,05 detik |

## Font → `assets/fonts/`

Unduh dari Google Fonts (lisensi OFL, bebas dipakai dan dibagikan):
- **Pixelify Sans** untuk dialog dan teks panjang (lebih mudah dibaca).
- **Press Start 2P** untuk judul dan tombol (opsional).

Simpan file `.ttf` di `assets/fonts/`, lalu aktifkan `@font-face` di `css/style.css`. Font harus disimpan di folder agar game tetap jalan offline.
