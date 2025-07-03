document.addEventListener('DOMContentLoaded', function () {
    const logoBtn = document.getElementById('logo-btn');
    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.getElementById('close-menu');
    const overlay = document.getElementById('side-menu-overlay');

    overlay.onclick = function () {
        closeNavMenu();
    };

    closeBtn.onclick = function () {
        closeNavMenu();
    };

    function closeNavMenu() {
        sideMenu.classList.remove('open');
        overlay.classList.remove('show');
    }
});

