const inputFecha = document.getElementById("fecha");
const inputHora = document.getElementById("hora");
const mensajeHorario = document.getElementById("mensajeHorario");

// Fecha mínima: hoy
const hoy = new Date();

const año = hoy.getFullYear();
const mes = String(hoy.getMonth() + 1).padStart(2, "0");
const dia = String(hoy.getDate()).padStart(2, "0");

inputFecha.min = `${año}-${mes}-${dia}`;
// Mostrar mensaje
function mostrarMensaje(mensaje) {
    mensajeHorario.textContent = mensaje;
    mensajeHorario.style.display = "block";
}

// Ocultar mensaje
function ocultarMensaje() {
    mensajeHorario.textContent = "";
    mensajeHorario.style.display = "none";
}

// Cambiar límites de horario según el día
function cambiarHorario() {

    if (!inputFecha.value) {
        inputHora.min = "08:00";
        inputHora.max = "17:59";
        return;
    }

    const fecha = new Date(inputFecha.value + "T00:00:00");
    const diaSemana = fecha.getDay();

    // Domingo
    if (diaSemana === 0) {
        inputHora.min = "";
        inputHora.max = "";
        return;
    }

    // Sábado
    if (diaSemana === 6) {
        inputHora.min = "08:00";
        inputHora.max = "12:59";
    }

    // Lunes a viernes
    else {
        inputHora.min = "08:00";
        inputHora.max = "17:59";
    }
}

// Cuando cambia la fecha
inputFecha.addEventListener("input", function () {
    ocultarMensaje();

    if (!this.value) {
        return;
    }
    const fechaSeleccionada =new Date(this.value + "T00:00:00");

    const diaSemana = fechaSeleccionada.getDay();

    // Domingo
    if (diaSemana === 0) {

        mostrarMensaje(
            "La clínica no atiende los domingos."
        );

        this.value = "";
        inputHora.value = "";

        cambiarHorario();
        return;
    }
    cambiarHorario();
    validarHora();
});
// Cuando cambia la hora
inputHora.addEventListener("input", function () {
    validarHora();
});

// Validar horario
function validarHora() {
    ocultarMensaje();
    if (!inputFecha.value || !inputHora.value) {
        return true;
    }
    const fecha = new Date(inputFecha.value + "T00:00:00");

    const diaSemana = fecha.getDay();
    const partesHora = inputHora.value.split(":");

    const horas = Number(partesHora[0]);
    const minutos = Number(partesHora[1]);

    const hora =  horas + minutos / 60;

    // Domingo
    if (diaSemana === 0) {
        mostrarMensaje(
            "La clínica no atiende los domingos."
        );

        return false;
    }


    // Sábado
    if (diaSemana === 6) {

        if (hora < 8 || hora >= 13) {

            mostrarMensaje(
                "Los sábados la clínica atiende de 08:00 a 13:00."
            );

            inputHora.value = "";
            return false;
        }
    }

    // Lunes a viernes
    else {

        if (hora < 8 || hora >= 18) {

            mostrarMensaje(
                "La clínica atiende de lunes a viernes de 08:00 a 18:00."
            );

            inputHora.value = "";

            return false;
        }
    }
    return true;
}
// Función que usa el formulario antes de enviar
function horarioValido() {
    if (!inputFecha.value || !inputHora.value) {
        return true;
    }
    return validarHora();
}