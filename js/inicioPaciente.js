/* =======TARJETAS DESPLEGABLES========= */
const serviceCards = document.querySelectorAll(".service-card");
serviceCards.forEach(card => {
    card.addEventListener("click", function () {
        const estabaAbierta = this.classList.contains("active");
        serviceCards.forEach(otraCard => {
            otraCard.classList.remove("active");
        });
        if (!estabaAbierta) {
            this.classList.add("active");
        }
        lucide.createIcons();
    });
});
/// USUARIO DEL PACIENTE
const usuario = localStorage.getItem("usuario");
const nombrePaciente = localStorage.getItem("nombrePaciente");

const elementoUsuario = document.getElementById("user");
const elementoNombre = document.getElementById("nombrePaciente");

if (usuario && elementoUsuario) {
    elementoUsuario.textContent = usuario;
}

if (nombrePaciente && elementoNombre) {
    elementoNombre.textContent = nombrePaciente;
}
// INDICADOR DEL MENÚ
/* /* const menuItems = document.querySelectorAll(".menu-item");
const indicator = document.querySelector(".menu-indicator");
const menu = document.querySelector(".menu");
function moverIndicador(elemento) {
    const menuRect = menu.getBoundingClientRect();
    const itemRect = elemento.getBoundingClientRect();
    const izquierda = itemRect.left - menuRect.left;
    indicator.style.left = `${izquierda}px`;
    indicator.style.width = `${itemRect.width}px`;
} 
// Al cargar la página
window.addEventListener("load", () => {
    const activo = document.querySelector(".menu-item.active");
    if (activo) {
        moverIndicador(activo);
    }
});
// Al hacer click
menuItems.forEach(item => {
    item.addEventListener("click", function(event) {
        event.preventDefault();
        menuItems.forEach(elemento => {
            elemento.classList.remove("active");
        });
        this.classList.add("active");
        moverIndicador(this);
    });
});
// Si cambia el tamaño de la ventana
window.addEventListener("resize", () => {
    const activo = document.querySelector(".menu-item.active");
    if (activo) {
        moverIndicador(activo);
    }
}); */