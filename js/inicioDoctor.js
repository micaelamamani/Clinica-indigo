//inicia sesion y guarda datos del doctor
const nombreDoctor = localStorage.getItem("nombreDoctor");
const idDoctor = localStorage.getItem("idDoctor");
const elementoNombre = document.getElementById("nombreDoctor");
const elementoUsuario = document.getElementById("user");
if (nombreDoctor && elementoNombre) {
    elementoNombre.textContent = nombreDoctor;
}
const usuario = localStorage.getItem("usuario");
if (usuario && elementoUsuario) {
    elementoUsuario.textContent = usuario;
}
const serviceCards = document.querySelectorAll(".service-card");
serviceCards.forEach(card => {
    card.addEventListener("click", function () {
        const estabaAbierta = this.classList.contains("active");
        serviceCards.forEach(otraCard => {otraCard.classList.remove("active");});
        if (!estabaAbierta) {
            this.classList.add("active");
        }
        lucide.createIcons();
    });
});