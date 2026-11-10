/*
 * Terminal di laptop atau PC (Kasus 5 dan 6). Siswa mengetik perintah sungguhan:
 * ipconfig, ipconfig /all, ipconfig /renew, ipconfig /release, ipconfig /flushdns, ping, nslookup, cls, help.
 * Keluaran meniru Windows. Perintah yang tidak dikenal diberi saran, bukan hukuman.
 *
 * NQ.terminal.buka({
 *   judul, host,
 *   jaringan: { ip, mask, gateway, dns, mac, apipa, dhcpAktif, ipDhcp, dnsBenar(), cacheNegatif },
 *   saatPerintah(peristiwa, perintah),   peristiwa: 'ipconfig', 'ipconfig-all', 'renew-ok', 'renew-gagal',
 *        'flushdns', 'ping-ip-ok', 'ping-ip-gagal', 'ping-domain-ok', 'ping-domain-gagal',
 *        'nslookup-ok', 'nslookup-gagal', 'salah-ketik'
 *   opsi: [{ label, aksi }]   tombol tambahan (misalnya membuka pengaturan jaringan)
 * })
 */
(function (NQ) {
  var PERINTAH = ['ipconfig', 'ipconfig /all', 'ipconfig /renew', 'ipconfig /release', 'ipconfig /flushdns', 'ping', 'nslookup', 'cls', 'help'];
  var CEPAT = ['ipconfig', 'ipconfig /all', 'ipconfig /renew', 'ipconfig /flushdns', 'ping 8.8.8.8', 'ping smkcendekia.sch.id', 'nslookup smkcendekia.sch.id'];
  var DOMAIN = { 'smkcendekia.sch.id': '103.21.10.5', 'google.com': '142.250.4.100', 'www.google.com': '142.250.4.100' };

  var panel, layar, masukan, judulEl, opsiEl, cfg, riwayat = [], posRiwayat = 0, aktif = false, sudahDaftar = false;

  function jarak(a, b) {
    var d = [];
    for (var i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (var j = 0; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function saran(cmd) {
    var kata = cmd.split(' ')[0], best = null, bd = 99;
    ['ipconfig', 'ping', 'nslookup', 'help', 'cls'].forEach(function (p) { var dd = jarak(kata, p); if (dd < bd) { bd = dd; best = p; } });
    if (bd <= 3) {
      var sisa = cmd.slice(kata.length).trim();
      sisa = sisa.replace(/^\/?(al+|ren?ew?|flush ?dns|rel(ease)?)$/, function (m) {
        if (/^\/?al/.test(m)) return '/all'; if (/^\/?re?n/.test(m)) return '/renew'; if (/flush/.test(m)) return '/flushdns'; return '/release';
      });
      return best + (sisa ? ' ' + sisa : '');
    }
    return 'help';
  }

  function adalahIP(s) { return /^\d{1,3}(\.\d{1,3}){3}$/.test(s); }

  function blokAdaptor(j, semua) {
    var L = ['', 'Windows IP Configuration', ''];
    if (semua) {
      L.push('   Host Name . . . . . . . . . . . . : ' + cfg.host);
      L.push('   Primary Dns Suffix  . . . . . . . : ', '');
    }
    L.push('Ethernet adapter Ethernet:', '');
    if (semua) {
      L.push('   Description . . . . . . . . . . . : Realtek PCIe GbE Family Controller');
      L.push('   Physical Address. . . . . . . . . : ' + j.mac);
      L.push('   DHCP Enabled. . . . . . . . . . . : Yes');
    }
    if (j.ip === '0.0.0.0') {
      L.push('   Media State . . . . . . . . . . . : no address');
      return L;
    }
    L.push('   ' + (j.apipa ? 'Autoconfiguration IPv4 Address. . : ' : 'IPv4 Address. . . . . . . . . . . : ') + j.ip);
    L.push('   Subnet Mask . . . . . . . . . . . : ' + (j.apipa ? '255.255.0.0' : j.mask));
    L.push('   Default Gateway . . . . . . . . . : ' + (j.apipa ? '' : j.gateway));
    if (semua) {
      if (!j.apipa) L.push('   DHCP Server . . . . . . . . . . . : ' + j.gateway);
      L.push('   DNS Servers . . . . . . . . . . . : ' + (j.apipa ? '' : j.dns));
    }
    return L;
  }

  function jalankan(asli) {
    var cmd = asli.trim().toLowerCase().replace(/\s+/g, ' '), j = cfg.jaringan, ev = null, L = [];
    var internet = !j.apipa && j.ip !== '0.0.0.0';
    if (!cmd) return { baris: [], ev: null };
    if (cmd === 'cls' || cmd === 'clear') { layar.innerHTML = ''; return { baris: [], ev: 'cls' }; }
    if (cmd === 'help') return { baris: ['Perintah yang tersedia:'].concat(PERINTAH.map(function (p) { return '  ' + p + (p === 'ping' || p === 'nslookup' ? ' <alamat atau nama>' : ''); })), ev: 'help' };
    if (cmd === 'ipconfig') return { baris: blokAdaptor(j, false), ev: 'ipconfig' };
    if (cmd === 'ipconfig /all') return { baris: blokAdaptor(j, true), ev: 'ipconfig-all' };
    if (cmd === 'ipconfig /release') { j.ip = '0.0.0.0'; return { baris: blokAdaptor(j, false), ev: 'release' }; }
    if (cmd === 'ipconfig /renew') {
      if (!j.dhcpAktif) {
        return { baris: ['', 'Windows IP Configuration', '', 'An error occurred while renewing interface Ethernet :', 'unable to contact your DHCP server. Request has timed out.'], ev: 'renew-gagal', kelas: 'gagal' };
      }
      j.ip = j.ipDhcp; j.apipa = false;
      return { baris: blokAdaptor(j, false), ev: 'renew-ok' };
    }
    if (cmd === 'ipconfig /flushdns') { j.cacheNegatif = false; return { baris: ['', 'Windows IP Configuration', '', 'Successfully flushed the DNS Resolver Cache.'], ev: 'flushdns' }; }
    if (cmd === 'ping' || cmd === 'nslookup') return { baris: ['Cara pakai: ' + cmd + ' <alamat IP atau nama>, contoh: ' + cmd + ' 8.8.8.8'], ev: null };

    var m = cmd.match(/^ping (\S+)$/);
    if (m) {
      var tujuan = m[1];
      if (adalahIP(tujuan)) {
        if (!internet) return { baris: ['', 'Pinging ' + tujuan + ' with 32 bytes of data:', 'PING: transmit failed. General failure.', 'PING: transmit failed. General failure.', '', 'Ping statistics for ' + tujuan + ':', '    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),'], ev: 'ping-ip-gagal', kelas: 'gagal' };
        return { baris: balasPing(tujuan, null), ev: 'ping-ip-ok' };
      }
      var ipNama = DOMAIN[tujuan];
      if (internet && ipNama && j.dnsBenar() && !j.cacheNegatif) return { baris: balasPing(ipNama, tujuan), ev: 'ping-domain-ok' };
      if (internet && !j.dnsBenar()) j.cacheNegatif = true;
      return { baris: ['Ping request could not find host ' + tujuan + '. Please check the name and try again.'], ev: 'ping-domain-gagal', kelas: 'gagal' };
    }
    m = cmd.match(/^nslookup (\S+)$/);
    if (m) {
      var nama = m[1], ipN = DOMAIN[nama];
      if (internet && j.dnsBenar() && ipN) return { baris: ['Server:  dns.google', 'Address:  ' + j.dns, '', 'Non-authoritative answer:', 'Name:    ' + nama, 'Address:  ' + ipN], ev: 'nslookup-ok' };
      return { baris: ['DNS request timed out.', '    timeout was 2 seconds.', 'Server:  UnKnown', 'Address:  ' + (j.dns || '-'), '', '*** Request to UnKnown timed-out'], ev: 'nslookup-gagal', kelas: 'gagal' };
    }
    var s = saran(cmd);
    return { baris: ["'" + asli.trim() + "' is not recognized as an internal or external command,", 'operable program or batch file.', '>> Mungkin maksudmu: ' + s], ev: 'salah-ketik', kelas: 'saran', saran: s };
  }

  function balasPing(ip, nama) {
    var L = ['', 'Pinging ' + (nama ? nama + ' [' + ip + ']' : ip) + ' with 32 bytes of data:'];
    for (var i = 0; i < 4; i++) L.push('Reply from ' + ip + ': bytes=32 time=' + (18 + Math.floor(Math.random() * 12)) + 'ms TTL=117');
    L.push('', 'Ping statistics for ' + ip + ':', '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),');
    return L;
  }

  function cetak(teks, kelas) {
    var d = document.createElement('div');
    d.className = 'bt ' + (kelas || '');
    d.textContent = teks === '' ? '\u00a0' : teks;
    layar.appendChild(d);
    layar.scrollTop = layar.scrollHeight;
  }

  function kirim() {
    var asli = masukan.value; masukan.value = '';
    cetak('C:\\> ' + asli, 'ketik');
    if (asli.trim()) { riwayat.push(asli); posRiwayat = riwayat.length; }
    NQ.audio.efek('ketik');
    var h = jalankan(asli);
    if (h.ev === 'cls') return;
    var baris = h.baris, i = 0;
    // tampilkan bertahap supaya terasa seperti terminal sungguhan
    (function lanjut() {
      if (i >= baris.length) {
        if (h.ev) {
          var sukses = /ok|ipconfig|flushdns/.test(h.ev);
          NQ.audio.efek(h.kelas === 'gagal' ? 'terminal-gagal' : (sukses ? 'terminal-ok' : 'menu-pilih'));
          if (cfg.saatPerintah) cfg.saatPerintah(h.ev, asli.trim().toLowerCase(), h);
        }
        return;
      }
      cetak(baris[i], h.kelas && i === baris.length - 1 ? h.kelas : (h.kelas === 'gagal' && /fail|could not|timed|error|unable/i.test(baris[i]) ? 'gagal' : ''));
      i++;
      setTimeout(lanjut, /^Reply|^PING|^DNS request/.test(baris[i - 1]) ? 180 : 18);
    })();
  }

  function buat() {
    panel = NQ.ui.el('div', 'panel terminal tersembunyi');
    judulEl = NQ.ui.el('h2', '', panel);
    var bingkai = NQ.ui.el('div', 'layar-bingkai', panel);
    layar = NQ.ui.el('div', 'layar-terminal', bingkai);
    var baris = NQ.ui.el('div', 'baris-masuk', bingkai);
    NQ.ui.el('span', 'prompt', baris, 'C:\\&gt;');
    masukan = NQ.ui.el('input', 'masukan', baris);
    masukan.setAttribute('autocomplete', 'off'); masukan.setAttribute('spellcheck', 'false');
    masukan.addEventListener('keydown', function (e) {
      if (NQ.kotakDialog.aktif()) { e.preventDefault(); return; }
      if (e.key === 'Enter') { e.preventDefault(); kirim(); }
      else if (e.key === 'Escape') { NQ.terminal.tutup(); }
      else if (e.key === 'ArrowUp') { if (posRiwayat > 0) { posRiwayat--; masukan.value = riwayat[posRiwayat]; } e.preventDefault(); }
      else if (e.key === 'ArrowDown') { if (posRiwayat < riwayat.length - 1) { posRiwayat++; masukan.value = riwayat[posRiwayat]; } else { posRiwayat = riwayat.length; masukan.value = ''; } e.preventDefault(); }
    });
    bingkai.addEventListener('click', function () { if (!NQ.kotakDialog.aktif()) masukan.focus(); });
    var cepat = NQ.ui.el('div', 'cepat', panel);
    NQ.ui.el('span', 'mini', cepat, 'Perintah cepat:');
    CEPAT.forEach(function (c) {
      var b = NQ.ui.el('button', 'tombol kecil', cepat, c);
      b.addEventListener('click', function () { if (NQ.kotakDialog.aktif()) return; masukan.value = c; masukan.focus(); });
    });
    opsiEl = NQ.ui.el('div', 'opsi', panel);
    if (!sudahDaftar) { NQ.ui.daftarModal(NQ.terminal); sudahDaftar = true; }
  }

  NQ.terminal = {
    jalankan: function (perintah) { masukan.value = perintah; kirim(); },   // dipakai untuk pengujian
    buka: function (c) {
      cfg = c;
      if (!panel) buat();
      judulEl.textContent = 'Terminal · ' + c.host;
      layar.innerHTML = '';
      cetak('Microsoft Windows [Version 10.0.19045]');
      cetak('Ketik perintah lalu tekan Enter. Ketik help untuk daftar perintah.', 'saran');
      cetak('');
      this.segarkanOpsi();
      aktif = true;
      panel.classList.remove('tersembunyi');
      NQ.input.reset();
      setTimeout(function () { masukan.focus(); }, 50);
    },
    segarkanOpsi: function () {
      if (!opsiEl) return;
      opsiEl.innerHTML = '';
      ((cfg && cfg.opsi && cfg.opsi()) || []).concat([{ label: 'Tutup', aksi: function () { NQ.terminal.tutup(); } }]).forEach(function (d) {
        var b = NQ.ui.el('button', 'tombol kecil', opsiEl, d.label);
        b.disabled = !!d.nonaktif;
        b.addEventListener('click', function () { if (b.disabled || NQ.kotakDialog.aktif()) return; NQ.audio.efek('menu-pilih'); d.aksi(); NQ.terminal.segarkanOpsi(); });
      });
    },
    tutup: function () {
      if (!aktif) return;
      aktif = false; panel.classList.add('tersembunyi'); masukan.blur(); NQ.input.reset();
      if (cfg && cfg.tutup) cfg.tutup();
    },
    aktif: function () { return aktif; },
    perbarui: function () {
      if (!aktif) return;
      // Saat Pingo bicara, lepaskan fokus supaya E/Enter melanjutkan dialog; lalu fokus kembali
      if (NQ.kotakDialog.aktif()) { if (document.activeElement === masukan) { masukan.blur(); this._fokusLagi = true; } return; }
      if (this._fokusLagi) { this._fokusLagi = false; masukan.focus(); return; }
      if (document.activeElement !== masukan && NQ.input.baruDitekan('batal')) this.tutup();
    }
  };
})(window.NQ = window.NQ || {});
