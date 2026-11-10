# NetQuest: Misteri Jaringan SMK Cendekia

Game adventure misteri pixel art untuk TKJ kelas XI (Fase F). Dibuat oleh Indar Bismoko, S.Pd., M.Pd.

## Cara menjalankan

Klik dua kali `index.html`. Game terbuka di Chrome atau Edge, tanpa server dan tanpa internet.
Untuk dibagikan ke siswa, salin seluruh folder `NetQuest` (boleh dalam bentuk ZIP).

## Struktur folder

```
NetQuest/
├── index.html              Titik masuk. Memuat semua script secara berurutan.
├── README.md
├── css/
│   └── style.css           Tata letak layar, canvas pixel-perfect, lapisan UI.
├── js/
│   ├── config.js           Pengaturan: ukuran layar, energi, tombol, kode guru.
│   ├── main.js             Game loop dan titik mulai.
│   ├── core/               Mesin game (tidak tahu isi cerita).
│   │   ├── aset-loader.js    Memuat gambar dan audio.
│   │   ├── input.js          Keyboard dan sentuhan.
│   │   ├── kamera.js         Kamera mengikuti pemain.
│   │   ├── renderer.js       Canvas 480 x 270 diperbesar tanpa buram.
│   │   ├── audio.js          Musik dan efek suara.
│   │   ├── simpan.js         Simpan/muat progres di localStorage.
│   │   └── scene-manager.js  Pindah antar-scene.
│   ├── systems/            Mekanik inti permainan.
│   │   ├── peta.js           Tile, perabot, tabrakan, pintu.
│   │   ├── pemain.js         Raka.
│   │   ├── pingo.js          Pingo yang mengikuti Raka.
│   │   ├── interaksi.js      Objek berkilau dan tombol Periksa (E).
│   │   ├── dialog.js         Menjalankan dialog dari data.
│   │   ├── tas.js            Tas Teknisi (T).
│   │   ├── jurnal.js         Jurnal 6 langkah (J).
│   │   ├── pindai.js         Mode Pindai (Q).
│   │   ├── petunjuk.js       Petunjuk 3 tingkat (?).
│   │   ├── energi-bintang.js Energi, akibat salah, bintang.
│   │   └── progres.js        Ruangan/alat terbuka, keping, mode guru.
│   ├── ui/                 Tampilan antarmuka.
│   │   ├── hud.js            Energi, keping, tugas aktif.
│   │   ├── menu.js           Menu judul, kartu teknisi, peta (M), pengaturan.
│   │   ├── kotak-dialog.js   Kotak dialog dengan potret.
│   │   └── kontrol-sentuh.js Joystick dan tombol untuk HP.
│   ├── minigames/          Layar tampak dekat per kasus.
│   │   ├── crimping.js       Kasus 2
│   │   ├── papan-alamat.js   Kasus 4
│   │   ├── panel-router.js   Kasus 5
│   │   ├── terminal.js       Kasus 5 dan 6
│   │   ├── wifi.js           Kasus 7 dan 8
│   │   ├── daftar-perangkat.js Kasus 8
│   │   ├── pertarungan.js    Klimaks
│   │   └── laporan.js        Epilog
│   └── scenes/             Alur cerita per scene storyboard.
│       ├── judul.js          Scene 1
│       ├── prolog.js         Scene 2 dan 3
│       ├── kasus-1.js ... kasus-8.js   Scene 4 sampai 11
│       ├── klimaks.js        Scene 12
│       └── epilog.js         Scene 13
├── data/                   Isi naskah. Guru cukup mengubah folder ini untuk mengganti teks.
│   ├── aset.js               Daftar file gambar dan audio.
│   ├── ruangan.js            Ukuran peta, urutan terbuka, objek kunci (lengkap).
│   ├── alat.js               Alat di Tas dan kapan didapat (lengkap).
│   ├── jaringan.js           192.168.10.0/24, pool DHCP, DNS, kanal (lengkap).
│   ├── kasus.js              Urutan tahap cerita dan langkah Jurnal (lengkap).
│   ├── dialog.js             Dialog (Prolog lengkap; kasus lain menyusul).
│   ├── petunjuk.js           Petunjuk 3 tingkat (lengkap).
│   └── umpan-balik.js        Tindakan salah (Kasus 1 contoh; lainnya menyusul).
├── assets/
│   ├── img/
│   │   ├── karakter/raka, pingo, glitch
│   │   ├── npc/              C1 sampai C9
│   │   ├── tile/             D1 dan D2
│   │   ├── perabot/          D3 sampai D7 (+ multimedia, kepsek, lorong)
│   │   ├── objek/            E1, E2, E5, E6
│   │   ├── tampak-dekat/     E3 dan E4
│   │   ├── ikon/             F1 dan F2
│   │   ├── ui/               Bingkai dialog, panel, joystick
│   │   └── latar/            G1 dan G2
│   ├── audio/
│   │   ├── musik/
│   │   └── sfx/
│   ├── fonts/
│   └── _sumber/            Gambar mentah sebelum dirapikan (tidak dimuat game).
└── docs/                   Storyboard dan naskah untuk rujukan (tidak dimuat game).
```

Setiap folder aset berisi `_isi.txt` yang menyebutkan file apa yang diharapkan dan nama filenya.

## Aturan teknis

1. **Tanpa server.** Game dibuka dari `file://`, jadi:
   - Jangan pakai `<script type="module">`, `import`, atau `fetch()`. Chrome memblokirnya di `file://`.
   - Data disimpan sebagai file `.js` yang mengisi `NQ.data`, bukan file `.json`.
   - Audio memakai `new Audio()`, bukan Web Audio `decodeAudioData` dari `fetch`.
   - Jangan membaca piksel canvas (`getImageData`) dari gambar, karena canvas dianggap "tercemar" di `file://`.
2. **Satu namespace.** Semua kode memakai `window.NQ`. Urutan `<script>` di `index.html` menentukan urutan pemuatan.
3. **Nama file aset** memakai huruf kecil dan tanda hubung, tanpa spasi atau titik tengah: `c1-pak-bima.png`, bukan `C1 · Pak Bima, Kepala Lab.png`.
4. **Pixel art.** Sprite digambar pada grid 16 px dan layar dasar 480 x 270. Canvas memakai `imageSmoothingEnabled = false` dan CSS `image-rendering: pixelated`.
5. **Teks panjang** (dialog, Jurnal, terminal, laporan) ditampilkan dengan HTML di `#ui` di atas canvas, supaya tajam dan mudah dibaca di HP.
6. **Penyimpanan** memakai `localStorage` dengan kunci `netquest-simpan-v1`, selalu di dalam `try/catch`.
