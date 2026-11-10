# Prompt Aset Babak 3 — Sinyal Liar (Kasus 7–8)

Babak 3 **hampir lengkap**. Hampir semua aset sudah ada mentah di folder TUGAS (Rara, perabot aula, troli access point, pintu gudang, gembok 0–4 keping, jejak kaki ungu, lantai karpet dan beton, dinding beton retak) dan akan dirapikan langsung. Tidak ada aset gambar yang wajib; dua di bawah ini **disarankan** supaya tampilan lebih hidup dan konsisten.

**Aturan untuk semua prompt gambar:** lampirkan sprite Raka dan Pak Bima sebagai acuan gaya, dan minta **latar transparan polos, tanpa cahaya, kabut, atau bayangan di luar objek**.

## Gambar (disarankan)

### P13 · Wi-Fi analyzer tampak dekat dan access point dinding
Dipakai di Kasus 7 (analisis sinyal sebelum dan sesudah) dan Kasus 8 (melacak sinyal panas-dingin ke gudang). Sejajar dengan LAN tester tampak dekat di P9.

> Gunakan gaya dari gambar terlampir. Buat sprite pixel art 16-bit dalam satu lembar, berjarak: (1) Wi-Fi analyzer genggam berwarna oranye tampak depan berukuran besar, dengan antena pendek di atas, empat tombol kecil di bawah, dan layar berupa **persegi panjang hitam kosong polos tanpa grafik dan tanpa tulisan** (layarnya akan diisi oleh game); (2) access point putih bundar yang terpasang di dinding, tampak depan, dalam dua versi: lampu hijau dan lampu merah; (3) router tua kusam berdebu berwarna abu-abu dengan dua antena dan lampu ungu, berlabel kosong (tanpa tulisan). Garis luar gelap, tanpa teks dan angka, latar transparan polos.

### P14 · Siswa panitia lomba di aula
Storyboard Kasus 7 menyebut "keramaian pelan". Aula besar (40 × 26 tile) akan terasa kosong tanpa orang.

> Gunakan gaya Raka dari gambar terlampir dan ukuran yang sama. Buat 4 siswa SMK Indonesia berseragam putih abu-abu sebagai panitia lomba, berjajar dan berjarak: (1) siswa laki-laki membawa kardus, menghadap samping; (2) siswi berhijab putih menata kursi, menghadap belakang; (3) siswa laki-laki memegang laptop, menghadap depan, ekspresi cemas; (4) siswi tanpa hijab berambut ikat memegang kabel rol, menghadap depan. Rambut semua siswa hitam, **tanpa topi** (agar tidak tertukar dengan Raka). Pixel art 16-bit, garis luar gelap, tanpa teks, latar transparan polos.

## Musik

Tidak ada musik baru untuk Babak 3. Tetap menunggu **M3 · Misteri** (`assets/audio/musik/misteri.mp3`), yang dipakai saat melacak SMK-Free ke gudang. Musik klimaks dan kemenangan baru dibutuhkan di Scene 12–13.

## Efek suara → dibuat sendiri oleh pengembang (sintesis 8-bit)

`keramaian` (suara latar aula), `roda-troli`, `sinyal-naik` (zona mati berubah hijau), `kanal-bentrok` (derau gangguan kanal), `analyzer-bip` (bip panas-dingin; kecepatan diatur game), `perangkat-asing` (peringatan MAC asing), `gembok-keping` (keping dipasang), `gembok-buka`, `senter-nyala`, `pindai-gelombang` (sonar Pingo).

## Digambar oleh game (tidak perlu prompt)

- Gelombang sinyal dan zona mati merah/hijau di mode Pindai
- Pilihan kanal 2,4 GHz (1, 6, 11) dan hasil analyzer (dBm, cakupan, kanal)
- Daftar perangkat terhubung dan inventaris MAC (memakai papan klip dari P9)
- Daftar SSID (SMK-Guru, SMK-Siswa, SMK-Free) dan bip panas-dingin
- Lampu redup Lorong Belakang dan lingkaran sorot senter
- Tulisan "LOMBA KOMPETENSI SISWA" pada spanduk panggung
- Raka mendorong troli AP: Raka berjalan dan troli ikut bergerak di depannya. Pose aksi "dorong" yang ada tidak dipakai, karena troli alat sudah menyatu di gambarnya.
