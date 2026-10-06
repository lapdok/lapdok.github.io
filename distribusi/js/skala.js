/**
 * skala.js — Modul Kalibrasi Skala & Koordinat Lapangan DIS-NRW
 * (Disguised Security & Authentication Layer)
 * 
 * Modul ini menyamarkan kredensial akses dengan format kalibrasi peta geografis
 * menggunakan enkripsi satu arah SHA-256 ber-garam (Salted Hashing).
 */

const _SCALE_CALIBRATION_SALT = "DIS_NRW_2026_AMERTA_TORAYA_CALIB_SALT";

// Node Kalibrasi Presisi (Terenkripsi SHA-256)
const _MAP_SCALE_CONFIG = {
  version: "2.4.2",
  projection: "EPSG:3857",
  tolerance: 0.00015,
  nodes: [
    {
      id: "node_01",
      u: "b9e9d67b2d5bbcb115e574676579f16d7a4cb2f57ef515949514749f7b0ce194",
      p: "3fbfe6a073f1d3c0e35768565b9b8b0e8b2b64d30ae8d003b573d9e83ecf090b",
      name: "Administrator"
    },
    {
      id: "node_02",
      u: "7f4809d79c7fc4114338454c2bebe9c688dbd13d2d3d6de20ca4ded6d42c216d",
      p: "d1eba85f8f7b35ac8845af88a3305d76e06175964dc30ae91d6841d2dee645f4",
      name: "David Paliwan, S.Kom"
    },
    {
      id: "node_03",
      u: "6c9dbe7b9a5e8c14c5c2d3345862b53114d7a8e7e17c0b968846c4f0288be08a",
      p: "d3eb217cb037a34614a873111b1518f8e02d4493393fcff5ee02fb4da233ae66",
      name: "Petugas Distribusi"
    },
    {
      id: "node_04",
      u: "a69ccc8aa8fc529fa63090f735fc5b6eae2bf9a686cb4de941cd38120cb0f796",
      p: "966f68ec5a262a7253c1e14e8966b0b9db19ccb65d8a90a29a1445e7fe06bb70",
      name: "Wandi Umar"
    },
    {
      id: "node_05",
      u: "35669d106df4a5c7ee12ac464dcd38188a47abbb06c6d470ad2dd6fbf334ea03",
      p: "966f68ec5a262a7253c1e14e8966b0b9db19ccb65d8a90a29a1445e7fe06bb70",
      name: "Russel"
    },
    {
      id: "node_06",
      u: "8710c46e3ba148ac043750401b7dab4e8079eb7ff4fc5763728b497e8da5f6c4",
      p: "966f68ec5a262a7253c1e14e8966b0b9db19ccb65d8a90a29a1445e7fe06bb70",
      name: "Yanto, SE"
    }
  ]
};

/**
 * SHA-256 Pure JavaScript fallback
 * Digunakan jika crypto.subtle tidak tersedia (misal: file://, HTTP biasa)
 * Output identik dengan Web Crypto API / SHA-256 standar (RFC 6234)
 */
function _sha256Fallback(message) {
  // Encode string ke bytes UTF-8
  const bytes = [];
  for (let i = 0; i < message.length; i++) {
    const code = message.charCodeAt(i);
    if (code < 0x80) { bytes.push(code); }
    else if (code < 0x800) { bytes.push(0xc0|(code>>6)); bytes.push(0x80|(code&0x3f)); }
    else { bytes.push(0xe0|(code>>12)); bytes.push(0x80|((code>>6)&0x3f)); bytes.push(0x80|(code&0x3f)); }
  }
  // Padding
  const len = bytes.length;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);
  const bitLen = len * 8;
  for (let i = 7; i >= 0; i--) bytes.push((bitLen / Math.pow(256, i)) & 0xff);

  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ];
  const RR = (x, n) => (x >>> n) | (x << (32 - n));
  let h0=0x6a09e667, h1=0xbb67ae85, h2=0x3c6ef372, h3=0xa54ff53a;
  let h4=0x510e527f, h5=0x9b05688c, h6=0x1f83d9ab, h7=0x5be0cd19;

  for (let i = 0; i < bytes.length; i += 64) {
    const w = new Array(64);
    for (let j = 0; j < 16; j++)
      w[j] = (bytes[i+j*4]<<24)|(bytes[i+j*4+1]<<16)|(bytes[i+j*4+2]<<8)|bytes[i+j*4+3];
    for (let j = 16; j < 64; j++) {
      const s0 = RR(w[j-15],7)^RR(w[j-15],18)^(w[j-15]>>>3);
      const s1 = RR(w[j-2],17)^RR(w[j-2],19)^(w[j-2]>>>10);
      w[j] = (w[j-16]+s0+w[j-7]+s1)|0;
    }
    let a=h0,b=h1,c=h2,d=h3,e=h4,f=h5,g=h6,h=h7;
    for (let j = 0; j < 64; j++) {
      const S1=(RR(e,6)^RR(e,11)^RR(e,25)), ch=((e&f)^(~e&g));
      const t1=(h+S1+ch+K[j]+w[j])|0;
      const S0=(RR(a,2)^RR(a,13)^RR(a,22)), maj=((a&b)^(a&c)^(b&c));
      const t2=(S0+maj)|0;
      h=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
    }
    h0=(h0+a)|0; h1=(h1+b)|0; h2=(h2+c)|0; h3=(h3+d)|0;
    h4=(h4+e)|0; h5=(h5+f)|0; h6=(h6+g)|0; h7=(h7+h)|0;
  }
  return [h0,h1,h2,h3,h4,h5,h6,h7]
    .map(n => ('00000000'+(n>>>0).toString(16)).slice(-8)).join('');
}

/**
 * Helper Fungsi Enkripsi Hash SHA-256
 * Menggunakan Web Crypto API jika tersedia (HTTPS/localhost),
 * atau fallback ke implementasi pure JS (file://, HTTP biasa).
 * @param {string} message 
 * @returns {Promise<string>} Hex string hash
 */
async function computeScaleHash(message) {
  const input = message + _SCALE_CALIBRATION_SALT;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (_) {}
  }
  return _sha256Fallback(input);
}

/**
 * Verifikasi kredensial pengguna terhadap node skala kalibrasi
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, user?: object, message?: string}>}
 */
async function verifyScaleCredentials(username, password) {
  if (!username || !password) {
    return { success: false, message: "Username dan password wajib diisi!" };
  }

  const uClean = username.trim().toLowerCase();
  const pClean = password.trim();

  const userHash = await computeScaleHash(uClean);
  const passHash = await computeScaleHash(pClean);

  // Cari apakah username cocok
  const matchedUser = _MAP_SCALE_CONFIG.nodes.find(n => n.u === userHash);

  if (!matchedUser) {
    return { success: false, message: "Username tidak terdaftar atau salah memasukkan password!" };
  }

  // Jika username cocok tapi password salah
  if (matchedUser.p !== passHash) {
    return { success: false, message: "Salah memasukkan password! Silakan periksa kembali kata sandi Anda." };
  }

  return {
    success: true,
    user: {
      id: matchedUser.id,
      username: uClean,
      name: matchedUser.name,
      token: 'AUTH_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    }
  };
}

/**
 * Utility untuk membuat Hash baru jika ingin menambahkan user lain di masa depan
 * Jalankan di console: createNewScaleNode('namauser', 'katasandi', 'Nama')
 */
async function createNewScaleNode(username, password, name = "Petugas") {
  const u = await computeScaleHash(username.trim().toLowerCase());
  const p = await computeScaleHash(password.trim());
  const node = {
    id: "node_" + Math.random().toString(36).substr(2, 6),
    u: u,
    p: p,
    name: name
  };
  console.log("Copy node baru ini ke dalam skala.js:", JSON.stringify(node, null, 2));
  return node;
}
