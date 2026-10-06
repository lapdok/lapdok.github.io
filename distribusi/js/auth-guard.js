/**
 * auth-guard.js — Modul Proteksi Sesi Pengguna DIS-NRW
 * Memastikan setiap halaman hanya dapat diakses setelah login terverifikasi.
 */

const SAPDI_AUTH_KEY = "DIS_NRW_AUTH_SESSION";

/**
 * Mengambil data sesi pengguna aktif
 * @returns {object|null}
 */
function getAuthUser() {
  try {
    const raw = sessionStorage.getItem(SAPDI_AUTH_KEY) || localStorage.getItem(SAPDI_AUTH_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.token) return null;
    return session;
  } catch (e) {
    return null;
  }
}

/**
 * Mengambil nama lengkap pengguna yang sedang login
 * @returns {string} Nama lengkap atau fallback 'Petugas Distribusi'
 */
function getLoggedInName() {
  const user = getAuthUser();
  return (user && user.name) ? user.name : 'Petugas Distribusi';
}

/**
 * Menyimpan sesi login
 * @param {object} userData 
 * @param {boolean} rememberMe 
 */
function setAuthSession(userData, rememberMe = false) {
  const session = {
    ...userData,
    loginAt: Date.now()
  };
  const str = JSON.stringify(session);
  if (rememberMe) {
    localStorage.setItem(SAPDI_AUTH_KEY, str);
  } else {
    sessionStorage.setItem(SAPDI_AUTH_KEY, str);
  }
}

/**
 * Melakukan logout dan menghapus semua sesi
 */
function logoutUser() {
  if (confirm("Apakah Anda yakin ingin keluar dari aplikasi DIS-NRW?")) {
    sessionStorage.removeItem(SAPDI_AUTH_KEY);
    localStorage.removeItem(SAPDI_AUTH_KEY);
    
    // Cek path apakah dari root atau dari subfolder pages/
    const isPagesSubdir = window.location.pathname.includes('/pages/');
    const loginUrl = isPagesSubdir ? '../login.html' : 'login.html';
    window.location.href = loginUrl;
  }
}

/**
 * Memeriksa status otentikasi halaman (Auth Guard)
 */
function checkAuthSession() {
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.endsWith('login.html');
  const user = getAuthUser();

  if (!user && !isLoginPage) {
    // Belum login, redirect ke halaman login
    const isPagesSubdir = currentPath.includes('/pages/');
    const loginUrl = isPagesSubdir ? '../login.html' : 'login.html';
    window.location.href = loginUrl;
  } else if (user && isLoginPage) {
    // Sudah login tapi membuka halaman login, redirect ke beranda
    window.location.href = 'index.html';
  }
}

// Jalankan pengecekan langsung saat skrip dimuat
checkAuthSession();
