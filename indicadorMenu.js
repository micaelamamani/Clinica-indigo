// ===== INDICADOR DEL MENÚ =====
const menuItems = document.querySelectorAll(".menu-item");
const indicator = document.querySelector(".menu-indicator");
const menu = document.querySelector(".menu");
function moverIndicador(elemento, animar = true) {
    if (!elemento || !indicator || !menu) return;
    const menuRect = menu.getBoundingClientRect();
    const itemRect = elemento.getBoundingClientRect();
    const izquierda = itemRect.left - menuRect.left;
    // Si la página acaba de cargar, no animamos
    if (!animar) {
        indicator.style.transition = "none";
    } else {
        indicator.style.transition = "all 0.3s ease";
    }
    indicator.style.left = `${izquierda}px`;
    indicator.style.width = `${itemRect.width}px`;
    // Volvemos a activar la transición después
    if (!animar) {
        requestAnimationFrame(() => {
            indicator.style.transition = "all 0.3s ease";
        });
    }
}
// ===== AL CARGAR LA PÁGINA =====
window.addEventListener("load", () => {
    const activo = document.querySelector(".menu-item.active");
    if (activo) {
        // 🚫 Sin animación al entrar a una página
        moverIndicador(activo, false);
    }
});
// ===== AL HACER CLICK =====
menuItems.forEach(item => {
    item.addEventListener("click", function () {
        menuItems.forEach(elemento => {
            elemento.classList.remove("active");
        });
        this.classList.add("active");
        // ✅ Animación solamente al hacer click
        moverIndicador(this, true);
    });
});
// ===== AL CAMBIAR EL TAMAÑO =====
window.addEventListener("resize", () => {
    const activo = document.querySelector(".menu-item.active");
    if (activo) {
        // Sin animación al recalcular posición
        moverIndicador(activo, false);
    }
});