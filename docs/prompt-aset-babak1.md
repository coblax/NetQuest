# Prompt Aset Babak 1 — Kabel yang Membisu (Kasus 1–3)

Hanya aset yang **belum ada**. Aset mentah lain (Kak Dimas, Pak Hasan, perabot lab/ruang guru/ruang server, objek E1–E4, tikus) sudah ada di folder TUGAS dan akan dirapikan langsung.

**Aturan untuk semua prompt gambar:** lampirkan sprite Raka dan Pak Bima sebagai acuan gaya, dan minta **latar transparan polos, tanpa cahaya, kabut, atau bayangan di luar objek**.

## Gambar

### P7 · Bu Wati, guru lab (C3) — wajib
Dipakai di Kasus 1, Kasus 8, dan Epilog. Lampirkan gambar Pak Bima (C1) sebagai acuan ukuran dan gaya.

> Gunakan gaya, ukuran, dan proporsi Pak Bima dari gambar terlampir. Buat NPC Bu Wati, guru lab komputer: perempuan Indonesia sekitar 35 tahun, berhijab biru muda, blus abu-abu muda lengan panjang, rok panjang biru tua, sepatu hitam, memegang map. Tampilkan 2 gambar berjajar dengan jarak lebar: (1) sprite berdiri seluruh badan menghadap depan, (2) potret wajah dari dada ke atas dengan ekspresi cemas. Pixel art 16-bit, garis luar gelap, tanpa teks, latar transparan polos tanpa cahaya atau bayangan di luar tokoh.

### P8 · Peta sekolah (G2) — wajib
Dipakai saat menekan M. Lampirkan latar layar judul (G1) sebagai acuan warna.

> Buat peta sekolah pixel art 16-bit tampak atas, rasio 16:9, gaya seperti gambar terlampir: kompleks SMK dengan 11 ruangan berbentuk kotak yang jelas batasnya, dihubungkan lorong beratap: Kantor Kepala Lab, Lab Komputer 1, Lab Komputer 2, Ruang Guru, Ruang Server, Perpustakaan, Ruang TU, Ruang Multimedia, Aula (paling besar), Ruang Kepala Sekolah, dan Gudang tua di pojok kanan belakang yang tampak gelap dan berdebu. Lapangan upacara dengan tiang bendera di tengah, taman, dan gerbang depan di bawah. Atap setiap ruangan berwarna berbeda agar mudah dibedakan. Tanpa teks dan tanpa angka, karena nama ruangan ditambahkan oleh game.

### P9 · Objek tambahan Babak 1 — wajib
> Gunakan gaya dari gambar terlampir. Buat sprite objek pixel art 16-bit, disusun berjarak dalam satu lembar: (1) lubang tikus kecil berbentuk lengkung gelap di dasar dinding putih, tampak depan; (2) tiga siswa SMK Indonesia berseragam putih abu-abu yang duduk di kursi menghadap meja komputer, dilihat dari belakang agak atas (satu laki-laki, satu perempuan berhijab putih, satu laki-laki berkacamata); (3) satu siswa berdiri menghadap depan dengan ekspresi kesal; (4) LAN tester tampak dekat berukuran besar terdiri dari dua bagian, unit induk dan unit remote, masing-masing dengan panel lampu berupa **persegi panjang gelap kosong tanpa lampu** dan satu port RJ45 di atas; (5) kartu panduan T568B kosong berbingkai merah di atas papan klip, tanpa garis warna dan tanpa tulisan. Garis luar gelap, tanpa teks dan angka, latar transparan polos.

Catatan: lampu LAN tester (pin 1–8) dan 8 kabel warna T568B akan **digambar oleh game**, bukan dari gambar AI. Pada aset lama jumlah lampunya salah (2 × 6), dan kabel putih-cokelat sulit dibedakan dari putih-oranye. Dengan digambar oleh game, urutan dan warnanya pasti tepat, dan bisa diberi nomor untuk siswa buta warna.

### P17 · Layar PC 07 tampak dekat (Kasus 1) — disarankan
Dipakai saat siswa memilih "Lihat layar PC 07" (langkah Gejala dan Verifikasi). Lampirkan sprite monitor kecil di lab dan bingkai UI (P6) sebagai acuan warna.

> Gunakan gaya dari gambar terlampir. Buat aset pixel art 16-bit tampak dekat berupa **dua monitor LCD kantor yang identik**, berjajar kiri-kanan dengan jarak lebar dalam satu lembar. Monitor tampak lurus dari depan, bezel hitam kebiruan tebal dengan garis tepi terang, kaki dan alas monitor kecil, lampu daya kecil di bezel bawah kanan, layar rasio 16:9. Isi layar adalah desktop komputer sekolah bergaya sederhana: latar biru dengan pola blok, tiga ikon desktop di kiri atas (komputer, folder kuning, globe internet), taskbar gelap di bawah dengan tombol mulai di kiri dan jam kecil di kanan, serta satu jendela pemberitahuan di tengah layar dengan bilah judul biru dan **area isi kosong polos**. Perbedaan kedua monitor hanya pada status jaringan: (1) monitor kiri menunjukkan koneksi terputus — ikon colokan kabel LAN di taskbar dan di jendela memakai **lencana merah dengan tanda silang putih**, lampu daya bezel merah; (2) monitor kanan menunjukkan koneksi pulih — ikon yang sama memakai **lencana hijau dengan tanda centang**, lampu daya hijau. Ikon jaringan berupa colokan kabel LAN (RJ45), **bukan** ikon Wi-Fi. Garis luar gelap, warna tegas, tanpa teks, huruf, angka, atau logo merek apa pun, latar transparan polos tanpa cahaya atau bayangan di luar monitor.

Catatan: tulisan seperti "KABEL LAN", "Tidak tersambung", "Terhubung", dan jam akan **ditulis oleh game** di area kosong itu. Jadi tulisannya selalu tepat dan tetap terbaca di layar kecil.

**Nama dan letak file:**
| Tahap | File | Keterangan |
|---|---|---|
| Gambar mentah dari ChatGPT | `assets/_sumber/p17-layar-pc07.png` | Satu lembar berisi dua monitor, PNG transparan |
| Hasil potong (terputus) | `assets/img/dekat/layar-pc07-putus.png` | Monitor kiri saja, dipotong rapat, lebar 600 px (HD 4×, 150 px logis) |
| Hasil potong (tersambung) | `assets/img/dekat/layar-pc07-tersambung.png` | Monitor kanan saja, ukuran persis sama dengan yang terputus |

Daftarkan di `data/aset.js` bagian `gambar` dengan kunci `'layar-pc07-putus'` dan `'layar-pc07-tersambung'`. Lalu di `js/scenes/kasus-1.js`, fungsi `gambarMonitorPC(ctx, tersambung)` cukup menggambar salah satunya dengan `NQ.aset.utuh(...)`, kemudian menulis teks status di atas area jendela yang kosong.

## Musik (Gemini) → `assets/audio/musik/`

### M3 · Misteri → `misteri.mp3` — wajib
Dipakai di Ruang Server (Kasus 3) saat jejak ungu ditemukan, dan nanti di Babak 2–3.

> Buat musik chiptune 8-bit bernuansa misteri untuk game petualangan detektif di sekolah. Tempo lambat-sedang, nada minor, ada bunyi bip pelan seperti sinyal jaringan dan sedikit efek "glitch" sesekali, tetap ramah untuk remaja dan tidak menyeramkan. Tanpa vokal, 60 sampai 90 detik, bisa diulang tanpa jeda.

## Efek suara → dibuat sendiri oleh pengembang (sintesis 8-bit)

`klik-konektor`, `potong-kabel`, `crimp`, `lan-tester-ok`, `lan-tester-salah`, `cicit-tikus`, `kartu-akses`, `pintu-buka`, `alarm`, `desis-glitch`, `ambil-barang`, `langkah-jurnal`, `salah`, `energi-turun`, `bintang`, `kasus-selesai`.
