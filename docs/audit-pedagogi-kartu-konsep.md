# Audit Pedagogi dan Rencana Kartu Konsep

NetQuest dipakai guru di kelas XI TKJ. Setiap konsep jaringan harus **terlihat** (ada ilustrasi) dan **beralasan** (ada "kenapa"), bukan sekadar satu kalimat Pingo.

Dokumen ini berisi:
1. Hasil audit: bagian mana yang masih "kalimat saja".
2. Rancangan tiga komponen baru. Logikanya dibuat di game, gambarnya dari ChatGPT.
3. Isi tiap Kartu Konsep: apa, kenapa, bukti, dan soal cek.
4. Daftar aset: nama file, lokasi, dan prompt siap pakai.

---

## 1. Hasil audit

| Bagian | Sekarang | Masalah pedagogis |
|---|---|---|
| Penjelasan konsep (dialog Pingo) | 1–2 kalimat per konsep, misalnya "DNS itu buku telepon". | Tidak ada gambar dan tidak ada alasan. Siswa bisa menyelesaikan kasus tanpa memahami konsepnya. |
| Momen bukti (langkah **Uji**) | Bukti muncul, misalnya LAN tester menyala atau `nslookup` gagal, lalu langsung lanjut. | Momen paling penting untuk belajar lewat begitu saja. Tidak ada jeda untuk menghubungkan bukti dengan konsep. |
| Tindakan salah (umpan balik) | Energi −1 dan satu kalimat. | Siswa tahu dirinya salah, tetapi tidak melihat **akibatnya** dan **kenapa** salah. |
| Ringkasan akhir kasus ("Ingat: …") | Satu paragraf teks. | Tidak memperlihatkan alur 6 langkah yang baru dikerjakan siswa. |
| Prinsip "periksa dari bawah ke atas" | Satu kalimat Pak Bima di Prolog. | Ini kerangka berpikir seluruh game, tetapi tidak pernah diperlihatkan atau diulang. |
| Sandi kuat (Klimaks) | Daftar syarat ✓/✗. | Siswa tidak melihat **seberapa jauh** lebih aman sandi panjang dibanding sandi pendek. |
| Penilaian untuk guru | Bintang (dari petunjuk dan kesalahan). | Guru tidak tahu konsep mana yang sudah dipahami siswa. |

Yang sudah baik dan dipertahankan:
- Animasi LAN tester.
- Papan Alamat (rumah bernomor).
- Kurir DHCP (DORA).
- Grafik kanal Wi-Fi.
- Mode Pindai.
- Tabel MAC dengan inventaris.

---

## 2. Tiga komponen baru (logika dibuat di game)

### A. Kartu Konsep
Panel bergambar yang muncul **tepat setelah bukti ditemukan**, yaitu saat langkah Uji atau momen "aha".

```
┌──────────────────────────────────────────────────────────┐
│ KARTU KONSEP · DNS = BUKU TELEPON        [Lapisan: Layanan]│
│ ┌─────────────────────┐  APA YANG TERJADI?                 │
│ │   ILUSTRASI (AI)    │  ...                               │
│ │  + label dari game  │  KENAPA?                           │
│ │                     │  ...                               │
│ └─────────────────────┘  BUKTINYA DI KASUS INI             │
│  [◀ panel 1/3 ▶]         ... (diambil dari Jurnal siswa)    │
│──────────────────────────────────────────────────────────│
│ CEK PAHAM: ping 8.8.8.8 berhasil, ping nama situs gagal…   │
│  ( ) A   ( ) B   ( ) C                                    │
└──────────────────────────────────────────────────────────┘
```
- **Label pada gambar ditulis oleh game**, bukan oleh AI, supaya ejaannya tepat dan tetap tajam.
- **Penanda lapisan** (Fisik, Alamat, atau Layanan) selalu tampil. Dengan begitu kerangka "dari bawah ke atas" terus diulang di setiap kasus.
- **Cek paham:** satu soal dengan 3 pilihan.
  - Jawaban salah memunculkan penjelasan *kenapa salah* dan siswa boleh mencoba lagi.
  - Tidak mengurangi energi, karena ini latihan mengingat, bukan hukuman.
  - Jawaban pertama siswa dicatat untuk guru.
- **Buku Konsep:** semua kartu yang sudah terbuka bisa dibuka lagi dari Jurnal (tab baru), untuk diskusi kelas atau mengulang materi.

### B. Kartu "Kenapa Salah?"
Untuk kesalahan konsep yang penting (bukan semua kesalahan), dialog umpan balik diganti panel kecil berisi:
- ilustrasi akibat dari tindakan itu,
- **kenapa ini keliru**,
- **yang benar**.

Gambarnya memakai ulang panel dari Kartu Konsep yang sama. Contohnya, panel "kabel tidak mentok" dipakai di Kartu Konsep Kasus 2 sekaligus saat siswa salah melakukan crimping.

### C. Ringkasan Kasus bergambar
Teks "Ingat: …" di layar *Kasus Selesai* diganti **garis waktu 6 langkah**. Isinya:
- ikon tiap langkah,
- catatan Jurnal milik siswa sendiri,
- bintang,
- kalimat inti.

Siswa melihat bahwa ia benar-benar menjalani Gejala, Dugaan, Uji, Perbaikan, Verifikasi, lalu Catat.

### Untuk guru (tanpa aset baru)
- **Laporan Teknisi yang dicetak** mendapat bagian baru, *Pemahaman Konsep*. Isinya daftar 10 konsep: dijawab benar pada percobaan pertama atau tidak.
- **Meter kekuatan sandi** di Klimaks: game menghitung perkiraan waktu menebak sandi, misalnya "12345678: kurang dari 1 detik" dan "Kucing19!Roket#: lebih dari 1 juta tahun". Hasilnya ditampilkan sebagai bar, jadi alasan "kenapa harus panjang" terlihat langsung.

---

## 3. Isi Kartu Konsep

Momen tampil dipilih **tepat setelah bukti muncul**, supaya konsep langsung terhubung dengan pengalaman siswa.

### KK-0 · Periksa dari bawah ke atas (Prolog)
- **Momen:** setelah Pak Bima menjelaskan 6 langkah Jurnal.
- **Apa:** jaringan bekerja bertingkat.
  - **Fisik:** kabel, konektor, dan lampu.
  - **Alamat:** IP.
  - **Layanan:** DHCP dan DNS.
- **Kenapa:** lapisan atas bergantung pada lapisan bawah. Kalau kabel putus, DNS pasti ikut gagal. Memeriksa dari bawah menghemat waktu dan mencegah perbaikan yang tidak perlu.
- **Cek paham:** "Situs sekolah tidak terbuka dan lampu NIC mati. Apa yang diperiksa pertama?"
  - **Kabel dan konektor** ✓
  - Pengaturan DNS: keliru, karena tanpa link fisik DNS tidak mungkin bekerja.
  - Instal ulang browser: keliru, karena itu bukan masalah jaringan.

### KK-1 · Konektor RJ45 harus terkunci (Kasus 1)
- **Momen:** setelah LAN tester membuktikan kabelnya sehat (langkah Uji).
- **Apa:** konektor RJ45 punya tuas pengunci. Tanpa bunyi *klik*, pin belum menempel penuh dan NIC tidak mendeteksi link, sehingga lampunya mati.
- **Kenapa diuji dulu, baru diganti:** LAN tester membedakan **kabel rusak** dari **konektor longgar**. Kabel yang sehat tidak dibuang.
- **Bukti di kasus:** lampu 1–8 menyala berurutan, lampu NIC mati, lalu hijau setelah *klik*.
- **Cek paham:** "Lampu LAN tester 1–8 menyala urut, tetapi lampu NIC mati. Tindakan paling tepat?"
  - **Tancapkan konektor sampai klik** ✓
  - Ganti kabel baru: keliru, karena kabelnya sudah terbukti sehat.
  - Instal ulang driver: keliru, karena lampu NIC mati berarti link fisik tidak ada.
- **Kartu terkait** (digambar game dari sprite yang sudah ada, tanpa aset baru): *Masalah lokal atau menyeluruh?* Satu monitor merah di antara monitor hijau menunjukkan bahwa masalahnya hanya di satu PC.

### KK-2 · Crimping T568B yang benar (Kasus 2)
- **Momen:** setelah konektor baru lulus uji. Panelnya juga dipakai di Kartu "Kenapa Salah?" untuk kesalahan `tidak-mentok` dan `selubung-tidak-terjepit`.
- **Apa:** urutan 8 warna T568B, dan kedua ujung sama (kabel *straight*). Ujung kabel harus **mentok** di depan konektor, dan **selubung harus terjepit**.
- **Kenapa:** pin emas menusuk tembaga dari atas. Kabel yang tidak mentok membuat pin menusuk udara, sehingga jalurnya putus. Selubung yang tidak terjepit membuat kabel mudah tertarik lepas. Pasangan kabel dipilin untuk mengurangi gangguan.
- **Cek paham:** "Lampu 4 dan 5 tidak menyala, yang lain urut. Penyebab paling mungkin?"
  - **Kabel biru dan putih-biru tidak mentok** ✓
  - Seluruh urutan warna terbalik: keliru, karena hasilnya akan berbeda untuk banyak pin.
  - Kabelnya terlalu panjang: keliru.

### KK-3 · Patch panel, switch, dan lampu port (Kasus 3)
- **Momen:** setelah Pindai memperlihatkan satu kabel gelap.
- **Apa:** setiap ruangan tersambung lewat satu kabel ke satu port di patch panel, lalu ke switch.
  - Lampu PWR berarti switch hidup.
  - Lampu link berarti kabel tersambung.
  - Lampu berkedip berarti ada data lewat.
- **Kenapa jangan mencabut port yang menyala:** setiap port melayani ruangan yang sedang dipakai.
- **Cek paham:** "Lampu link port 7 mati, port lain menyala. Artinya?"
  - **Hanya jalur port 7 yang terputus** ✓
  - Switch mati: keliru, karena lampu PWR dan port lain menyala.
  - Internet sekolah putus: keliru, karena ruangan lain tetap normal.

### KK-4 · Satu IP untuk satu perangkat (Kasus 4)
- **Momen:** setelah terbukti PC katalog dan printer sama-sama memakai .20.
- **Apa:** dalam satu jaringan, setiap alamat IP hanya untuk satu perangkat.
- **Kenapa putus-sambung:** router mengirim balasan ke perangkat yang **terakhir mengaku** memakai nomor itu. Akibatnya kedua perangkat bergantian kehilangan data.
- **Cek paham:** "Printer baru perlu IP statis. Pilihan terbaik?"
  - **.35 di kompleks statis yang kosong** ✓
  - .150 di kompleks DHCP: keliru, karena nanti bisa dibagikan ke perangkat lain dan bentrok lagi.
  - .1: keliru, karena itu gerbang (gateway) router.

### KK-5 · DHCP dan alamat darurat 169.254 (Kasus 5)
- **Momen:** setelah panel router menunjukkan layanan DHCP mati.
- **Apa:** DHCP membagikan alamat secara otomatis lewat 4 langkah DORA. Jika tidak ada jawaban, komputer memasang **alamat darurat 169.254.x.x** (APIPA) yang tidak bisa dipakai ke internet.
- **Kenapa jangan mengisi IP manual di tiap PC:** sumber masalahnya ada di server DHCP. IP manual hanya menambal satu PC dan berisiko bentrok.
- **Cek paham:** "Semua PC di satu ruangan mendapat alamat 169.254.x.x. Apa yang diperiksa pertama?"
  - **Layanan DHCP di router** ✓
  - Kabel setiap PC: keliru, karena tidak mungkin semua kabel rusak bersamaan.
  - Pengaturan DNS: keliru, karena DNS berada di atas lapisan alamat.

### KK-6 · DNS = buku telepon (Kasus 6)
- **Momen:** setelah `ipconfig /all` menampilkan DNS asing 10.10.10.66.
- **Apa:** DNS menerjemahkan nama situs menjadi alamat IP. Komputer juga **menyimpan jawaban lama** (cache).
- **Kenapa ping ke IP berhasil tetapi ke nama gagal:** jalannya ada, tetapi buku teleponnya salah. Setelah DNS diperbaiki, cache lama harus dibuang dengan `ipconfig /flushdns`.
- **Cek paham:** "ping 8.8.8.8 berhasil, tetapi ping smkcendekia.sch.id gagal. Masalahnya di mana?"
  - **DNS** ✓
  - Kabel: keliru, karena ping ke IP berhasil.
  - DHCP: keliru, karena PC sudah punya IP yang benar.

### KK-7 · Sinyal Wi-Fi: penghalang dan kanal (Kasus 7)
- **Momen:** setelah grafik kanal di Wi-Fi analyzer membuktikan bentrok.
- **Apa:** sinyal melemah karena jarak dan penghalang seperti beton dan pilar. AP di kanal yang sama atau bertumpuk saling mengganggu. Di 2,4 GHz hanya kanal **1, 6, dan 11** yang tidak tumpang tindih. Skala dBm digambar game: −50 sangat baik, −67 batas layak lomba, −80 sangat lemah.
- **Kenapa dua perbaikan:** ada dua penyebab, yaitu penghalang (diatasi dengan memindah AP) dan kanal (diatasi dengan memakai kanal 11).
- **Cek paham:** "AP tetangga memakai kanal 1 dan 6. Kanal terbaik untuk AP aula?"
  - **11** ✓
  - 3: keliru, karena tumpang tindih dengan kanal 1 dan 6.
  - 6: keliru, karena sama persis dengan AP tetangga.

### KK-8 · MAC address dan access point liar (Kasus 8)
- **Momen:**
  - Panel 1 tampil setelah dua MAC asing ditemukan.
  - Panel 2 tampil setelah Wi-Fi analyzer menemukan SMK-Free.
- **Apa:** MAC adalah nomor unik kartu jaringan. **Nama perangkat bisa diganti siapa saja**, sedangkan MAC tercatat di inventaris. Access point tanpa sandi ibarat pintu samping tanpa kunci.
- **Kenapa yang dicocokkan MAC, bukan nama:** penyusup sengaja memakai nama PC lab.
- **Cek paham:** "Perangkat bernama PC-L2-03 punya MAC yang tidak ada di inventaris. Kesimpulan?"
  - **Perangkat asing yang menyamar** ✓
  - PC-L2-03 rusak: keliru.
  - Inventarisnya pasti salah: keliru, karena inventaris adalah acuan resmi lab.

### KK-9 · Urutan mengamankan jaringan (Klimaks)
- **Momen:** saat menu aksi pertama kali dibuka (sebagai panduan) dan setelah Glitch pecah (sebagai ringkasan).
- **Apa:** urutannya ada 4 langkah.
  1. Tutup jalur masuk (cabut AP liar).
  2. Usir penyusup (blokir MAC).
  3. Kunci jaringan (WPA2/WPA3 dengan sandi kuat).
  4. Periksa ulang.
- **Kenapa berurutan:** kalau pintunya masih terbuka, penyusup yang diusir bisa masuk lagi. Periksa ulang adalah bukti bahwa jaringan sudah aman.
- **Cek paham:** "Langkah **pertama** saat menemukan access point liar?"
  - **Cabut AP liar** ✓
  - Periksa ulang daftar perangkat: keliru, karena penyusup masih ada.
  - Sembunyikan SSID: keliru, karena jaringan tersembunyi tetap bisa ditemukan.

---

## 4. Daftar aset untuk ChatGPT

### Aturan umum (berlaku untuk semua prompt)
- Lampirkan sprite **Raka** dan **Pak Bima** sebagai acuan gaya.
- **Tanpa teks, huruf, angka, atau logo apa pun.** Semua label ditulis oleh game.
- Ilustrasi konsep memakai **latar penuh (tidak transparan)** dengan bingkai panel tipis gelap, rasio tiap panel **3:2**. Satu lembar bisa berisi beberapa panel berjajar **kiri ke kanan** dengan jarak lebar.
- Ikon langkah memakai **latar transparan polos**.

### Nama dan lokasi file
Bapak cukup menyimpan **gambar mentah** di `assets/_sumber/`. Pemotongan dan pemasangan saya kerjakan, dan hasilnya masuk ke `assets/img/konsep/`.

| Kode | Simpan gambar mentah sebagai | Panel | Hasil di game | Prioritas |
|---|---|---|---|---|
| KK-0 | `assets/_sumber/konsep-lapisan.png` | 1 | `assets/img/konsep/lapisan.png` | wajib |
| KK-1 | `assets/_sumber/konsep-k1-konektor.png` | 2 | `assets/img/konsep/k1-konektor-1.png`, `-2.png` | wajib |
| KK-2 | `assets/_sumber/konsep-k2-crimping.png` | 3 | `assets/img/konsep/k2-crimping-1.png` … `-3.png` | wajib |
| KK-3 | `assets/_sumber/konsep-k3-topologi.png` | 1 | `assets/img/konsep/k3-topologi.png` | wajib |
| KK-4 | `assets/_sumber/konsep-k4-ip.png` | 2 | `assets/img/konsep/k4-ip-1.png`, `-2.png` | wajib |
| KK-5 | `assets/_sumber/konsep-k5-dhcp.png` | 2 | `assets/img/konsep/k5-dhcp-1.png`, `-2.png` | wajib |
| KK-6 | `assets/_sumber/konsep-k6-dns.png` | 3 | `assets/img/konsep/k6-dns-1.png` … `-3.png` | wajib |
| KK-7 | `assets/_sumber/konsep-k7-sinyal.png` | 2 | `assets/img/konsep/k7-sinyal-1.png`, `-2.png` | wajib |
| KK-8 | `assets/_sumber/konsep-k8-mac.png` | 2 | `assets/img/konsep/k8-mac-1.png`, `-2.png` | wajib |
| KK-9 | `assets/_sumber/konsep-k9-amankan.png` | 4 | `assets/img/konsep/k9-amankan-1.png` … `-4.png` | wajib |
| KS-9 | `assets/_sumber/konsep-k9-salah.png` | 2 | `assets/img/konsep/k9-salah-1.png`, `-2.png` | disarankan |
| IK | `assets/_sumber/ikon-langkah-jurnal.png` | 6 ikon | `assets/img/ikon/langkah/gejala.png` … `catat.png` | wajib |

Kalau ChatGPT menolak membuat 3–4 panel sekaligus, buat **satu panel per gambar**. Simpan dengan akhiran nomor panel, misalnya `konsep-k6-dns-1.png`, `konsep-k6-dns-2.png`.

### Prompt

**KK-0 · simpan di `NetQuest/assets/_sumber/konsep-lapisan.png`**
> Gunakan gaya dari gambar terlampir. Buat ilustrasi pixel art 16-bit rasio 3:2 berlatar penuh: potongan melintang gedung sekolah tiga lantai seperti rumah boneka. Lantai dasar berisi rak switch, gulungan kabel LAN, dan lampu-lampu port hijau. Lantai dua berisi deretan rumah kecil berpapan nomor kosong dan kantor pos kecil. Lantai tiga berisi kurir berseragam membawa amplop dan buku telepon besar terbuka di atas meja. Tangga di sisi kanan menghubungkan ketiga lantai, dengan Raka memegang LAN tester berdiri di anak tangga paling bawah dan robot bulat kecil Pingo melayang di sampingnya. Tiap lantai diberi warna dinding berbeda (oranye, biru, ungu). Sisakan ruang kosong di sisi kiri setiap lantai untuk label. Garis luar gelap, tanpa teks, huruf, atau angka. Simpan hasilnya sebagai file PNG bernama `konsep-lapisan.png` di folder `NetQuest/assets/_sumber/`.

**KK-1 · simpan di `NetQuest/assets/_sumber/konsep-k1-konektor.png`**
> Gunakan gaya dari gambar terlampir. Buat dua panel pixel art 16-bit berjajar kiri-kanan, masing-masing rasio 3:2 berlatar biru gelap polos dengan bingkai tipis. Keduanya tampak samping, berupa potongan melintang yang diperbesar: port LAN di bagian belakang casing CPU dan konektor RJ45 bening dengan kabel biru. (1) Panel kiri: konektor baru masuk setengah, tuas pengunci plastik di atas konektor belum masuk ke celah port, ada jarak antara pin emas konektor dan pin port, lampu kecil di samping port padam abu-abu. (2) Panel kanan: konektor masuk penuh, tuas pengunci terkait di celah port, pin emas menempel rapat, lampu di samping port menyala hijau terang, dan ada tiga garis kejut kecil di dekat tuas sebagai tanda bunyi klik. Ukuran dan sudut pandang kedua panel sama persis. Garis luar gelap, tanpa teks, huruf, atau angka. Simpan hasilnya sebagai file PNG bernama `konsep-k1-konektor.png` di folder `NetQuest/assets/_sumber/`.

**KK-2 · simpan di `NetQuest/assets/_sumber/konsep-k2-crimping.png`**
> Gunakan gaya dari gambar terlampir. Buat tiga panel pixel art 16-bit berjajar kiri-kanan, masing-masing rasio 3:2 berlatar biru gelap polos dengan bingkai tipis. Isinya tampak samping konektor RJ45 bening yang diperbesar dengan delapan kabel kecil berwarna (oranye, hijau, biru, cokelat, dan versi bergaris putihnya) serta selubung kabel abu-abu. Delapan pin emas berdiri tegak di bagian atas konektor, dan ada penjepit selubung berbentuk segitiga di bagian belakang. (1) Panel pertama, benar: kedelapan kabel lurus sampai menyentuh dinding depan konektor, pin emas menusuk masuk ke kabel, selubung abu-abu masuk ke dalam konektor dan ditekan penjepit. (2) Panel kedua, kabel tidak mentok: kabel berhenti di tengah konektor, pin emas di depan hanya menusuk udara kosong, ada percikan kecil merah tanda putus. (3) Panel ketiga, selubung tidak terjepit: kabel sampai depan, tetapi selubung abu-abu berhenti di luar konektor sehingga kabel-kabel kecil terbuka di bawah penjepit. Ukuran dan sudut pandang ketiga panel sama persis. Garis luar gelap, tanpa teks, huruf, atau angka. Simpan hasilnya sebagai file PNG bernama `konsep-k2-crimping.png` di folder `NetQuest/assets/_sumber/`.

**KK-3 · simpan di `NetQuest/assets/_sumber/konsep-k3-topologi.png`**
> Gunakan gaya dari gambar terlampir. Buat ilustrasi pixel art 16-bit rasio 3:2 berlatar penuh, tampak atas sedikit miring: di tengah ada rak server berisi patch panel (deretan colokan) di atas dan switch dengan lampu port hijau di bawahnya. Dari patch panel keluar enam kabel berwarna ke enam ruangan kecil berbentuk kotak beratap di sekelilingnya (lab komputer dengan meja PC, ruang guru dengan meja dan kursi, perpustakaan dengan rak buku, kantor tata usaha, ruang multimedia dengan kamera, aula dengan panggung). Lima kabel tampak menyala biru dengan titik-titik cahaya mengalir; satu kabel ke lab komputer di kanan atas gelap tanpa cahaya. Sisakan ruang kosong di atas setiap ruangan untuk label nama. Garis luar gelap, tanpa teks, huruf, atau angka. Simpan hasilnya sebagai file PNG bernama `konsep-k3-topologi.png` di folder `NetQuest/assets/_sumber/`.

**KK-4 · simpan di `NetQuest/assets/_sumber/konsep-k4-ip.png`**
> Gunakan gaya dari gambar terlampir dan kurir berseragam yang terlampir. Buat dua panel pixel art 16-bit berjajar kiri-kanan, masing-masing rasio 3:2 berlatar penuh. (1) Panel kiri: jalan kompleks perumahan; kurir bertopi membawa tumpukan paket berdiri kebingungan di antara dua rumah (satu berbentuk komputer meja, satu berbentuk printer) yang memasang papan nomor kosong berwarna sama persis, ada kilat kecil kuning di antara kedua rumah, dan satu paket jatuh di jalan. (2) Panel kanan: gerbang kompleks perumahan dengan pos satpam dan palang, semua kurir keluar-masuk lewat gerbang itu menuju kota di kejauhan. Garis luar gelap, tanpa teks, huruf, atau angka; papan nomor dibiarkan kosong. Simpan hasilnya sebagai file PNG bernama `konsep-k4-ip.png` di folder `NetQuest/assets/_sumber/`.

**KK-5 · simpan di `NetQuest/assets/_sumber/konsep-k5-dhcp.png`**
> Gunakan gaya dari gambar terlampir dan kurir berseragam yang terlampir. Buat dua panel pixel art 16-bit berjajar kiri-kanan, masing-masing rasio 3:2 berlatar penuh. (1) Panel kiri, DHCP menyala: kurir berlari dari loket kantor pos yang buka membawa papan nomor rumah resmi berwarna biru untuk diberikan ke deretan komputer yang tersenyum. (2) Panel kanan, DHCP mati: loket kantor pos tertutup rapat dan terkunci gembok ungu, kurir tertidur di dalam; deretan komputer di luar yang kebingungan memasang papan nomor darurat dari kardus cokelat yang miring, dan jalan di depan mereka buntu dengan pagar. Garis luar gelap, tanpa teks, huruf, atau angka; papan nomor dibiarkan kosong. Simpan hasilnya sebagai file PNG bernama `konsep-k5-dhcp.png` di folder `NetQuest/assets/_sumber/`.

**KK-6 · simpan di `NetQuest/assets/_sumber/konsep-k6-dns.png`**
> Gunakan gaya dari gambar terlampir. Buat tiga panel pixel art 16-bit berjajar kiri-kanan, masing-masing rasio 3:2 berlatar penuh. (1) Raka membuka buku telepon besar di depan laptop; dari halaman buku keluar garis panah kuning bercahaya menuju gedung sekolah yang terang di kejauhan. (2) Buku telepon yang sama, tetapi satu halamannya ditempeli kertas ungu dengan bekas tangan kecil ungu; panah kuning berbelok menuju gang buntu yang gelap dengan siluet monster kecil ungu bermata kuning. (3) Raka mencabut catatan tempel kuning lama dari layar laptop dan membuangnya ke tempat sampah kecil, sementara panah kuning kembali lurus menuju gedung sekolah. Garis luar gelap, tanpa teks, huruf, atau angka. Simpan hasilnya sebagai file PNG bernama `konsep-k6-dns.png` di folder `NetQuest/assets/_sumber/`.

**KK-7 · simpan di `NetQuest/assets/_sumber/konsep-k7-sinyal.png`**
> Gunakan gaya dari gambar terlampir. Buat dua panel pixel art 16-bit berjajar kiri-kanan, masing-masing rasio 3:2, tampak atas sebuah aula sekolah dengan panggung merah di atas, deretan kursi biru di tengah dan belakang, dua pilar, dan dinding beton tebal abu-abu di sisi kiri. (1) Panel kiri: access point di troli berada di pojok kiri bawah di balik dinding beton; gelombang sinyal berupa lingkaran hijau tertahan dan terpotong oleh dinding dan pilar, kursi belakang diwarnai merah gelap sebagai zona mati. (2) Panel kanan: access point di troli berada di depan panggung di tengah; gelombang hijau menyebar rata sampai kursi paling belakang, tidak ada zona merah. Tata letak aula kedua panel sama persis. Garis luar gelap, tanpa teks, huruf, atau angka. Simpan hasilnya sebagai file PNG bernama `konsep-k7-sinyal.png` di folder `NetQuest/assets/_sumber/`.

**KK-8 · simpan di `NetQuest/assets/_sumber/konsep-k8-mac.png`**
> Gunakan gaya dari gambar terlampir dan monster kecil ungu yang terlampir. Buat dua panel pixel art 16-bit berjajar kiri-kanan, masing-masing rasio 3:2 berlatar penuh. (1) Panel kiri: deretan komputer lab dengan kartu jaringan kecil di samping masing-masing, setiap kartu memiliki stiker label biru yang sama bentuknya; di antara mereka ada dua laptop asing yang memakai topeng papan nama palsu seperti komputer lab, tetapi stiker kartu jaringan mereka berwarna ungu dan sedikit terlihat dari balik topeng; Pingo menyorotkan senter ke stiker ungu itu. (2) Panel kanan: dinding belakang sekolah; pintu depan sekolah tertutup dengan gembok besar, sedangkan pintu samping gudang terbuka lebar tanpa gembok, di dalamnya router tua memancarkan gelombang Wi-Fi ungu ke luar, dan dua siluet ungu menyelinap masuk lewat pintu samping itu. Garis luar gelap, tanpa teks, huruf, atau angka. Simpan hasilnya sebagai file PNG bernama `konsep-k8-mac.png` di folder `NetQuest/assets/_sumber/`.

**KK-9 · simpan di `NetQuest/assets/_sumber/konsep-k9-amankan.png`**
> Gunakan gaya dari gambar terlampir dan monster kecil ungu yang terlampir. Buat empat panel pixel art 16-bit berjajar kiri-kanan seperti komik, masing-masing rasio 3:2 berlatar penuh, menggambarkan rumah sekolah yang diamankan Raka. (1) Raka menutup dan menyegel pintu samping gudang tempat router tua berada, kabel router dicabut dan menjuntai. (2) Raka menunjuk keluar sementara dua monster kecil ungu berlari keluar pagar. (3) Raka memasang gembok besar berwarna emas dengan kunci yang sangat panjang dan rumit di pintu utama. (4) Raka memegang papan klip daftar tamu dan memberi tanda centang hijau satu per satu, Pingo tersenyum di sampingnya. Tokoh dan rumah konsisten di keempat panel. Garis luar gelap, tanpa teks, huruf, atau angka. Simpan hasilnya sebagai file PNG bernama `konsep-k9-amankan.png` di folder `NetQuest/assets/_sumber/`.

**KS-9 · simpan di `NetQuest/assets/_sumber/konsep-k9-salah.png`** (disarankan)
> Gunakan gaya dari gambar terlampir dan monster kecil ungu yang terlampir. Buat dua panel pixel art 16-bit berjajar kiri-kanan, masing-masing rasio 3:2 berlatar penuh. (1) Aula sekolah gelap total: layar lomba di panggung mati, lampu padam, peserta lomba di kursi tampak kecewa, sementara monster kecil ungu tertawa di pojok. (2) Router kecil bersembunyi di balik semak-semak dengan papan nama tertutup daun, tetapi monster kecil ungu tetap menemukannya dengan teropong yang memancarkan gelombang. Garis luar gelap, tanpa teks, huruf, atau angka. Simpan hasilnya sebagai file PNG bernama `konsep-k9-salah.png` di folder `NetQuest/assets/_sumber/`.

**IK · simpan di `NetQuest/assets/_sumber/ikon-langkah-jurnal.png`**
> Gunakan gaya dari gambar terlampir. Buat enam ikon pixel art 16-bit berukuran sama, berjajar dalam satu baris dengan jarak lebar, latar transparan polos: (1) kaca pembesar di atas layar komputer bersilang merah (Gejala), (2) bola lampu kuning dengan tanda tanya (Dugaan), (3) LAN tester kecil dengan lampu-lampu hijau (Uji), (4) kunci pas dan obeng bersilang (Perbaikan), (5) perisai hijau dengan tanda centang (Verifikasi), (6) buku catatan terbuka dengan pensil (Catat). Garis luar gelap, warna tegas, tanpa teks, latar transparan polos tanpa cahaya atau bayangan di luar ikon. Simpan hasilnya sebagai file PNG bernama `ikon-langkah-jurnal.png` di folder `NetQuest/assets/_sumber/`.

---

## 5. Yang dibuat oleh game (tanpa aset baru)

| Komponen | Isi |
|---|---|
| Label di ilustrasi | Nama lapisan, nama ruangan, "Port 7", nomor IP, nomor kanal, "klik!", dan lain-lain. Posisinya diatur setelah gambar diterima. |
| Penanda lapisan | Fisik, Alamat, atau Layanan di setiap Kartu Konsep. |
| Skala dBm dan grafik kanal | Sudah ada. Ditampilkan ulang di KK-7. |
| Meter kekuatan sandi | Perkiraan waktu menebak sandi, dihitung dari panjang dan jenis karakter. |
| Kartu "masalah lokal" (Kasus 1) | Disusun dari sprite monitor yang sudah ada. |
| Garis waktu 6 langkah | Ringkasan kasus dari isi Jurnal siswa. |
| Buku Konsep | Tab baru di Jurnal. |
| Bagian *Pemahaman Konsep* | Di Laporan Teknisi yang dicetak: hasil cek paham per konsep. |
