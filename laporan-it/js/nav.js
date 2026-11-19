// js/nav.js - Responsive Hamburger Menu Controller
function toggleNavMenu() {
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const navMenu = document.getElementById('nav-menu-links');
    if (toggleBtn && navMenu) {
        toggleBtn.classList.toggle('open');
        navMenu.classList.toggle('active');
    }
}

// Tutup menu otomatis jika user mengklik area luar menu pada layar mobile
document.addEventListener('click', function(e) {
    const nav = document.querySelector('.navbar');
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const navMenu = document.getElementById('nav-menu-links');
    if (nav && !nav.contains(e.target) && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (toggleBtn) toggleBtn.classList.remove('open');
    }
});
