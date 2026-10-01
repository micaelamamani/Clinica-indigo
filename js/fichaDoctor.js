const parametros = new URLSearchParams(window.location.search);
const idDoctor = parametros.get("id_doctor");

const nombreDoctor = document.getElementById("nombreDoctor");
const especialidadDoctor = document.getElementById("especialidadDoctor");

const nombreCompleto = document.getElementById("nombreCompleto");
const genero = document.getElementById("genero");
const especialidad = document.getElementById("especialidad");
const matricula = document.getElementById("matricula");
const telefono = document.getElementById("telefono");
const correo = document.getElementById("correo");
const usuario = document.getElementById("usuario");

const btnVolver = document.getElementById("btnVolver");

function obtenerTratamiento(genero) {
    if (genero === "Femenino") {
        return "Dra.";
    }

    return "Dr.";
}

async function cargarFichaDoctor() {
    try {
        const respuesta = await fetch(
            `http://localhost:3000/doctores/ficha/${idDoctor}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la ficha del doctor.");
        }

        const doctor = await respuesta.json();

        const tratamiento = obtenerTratamiento(doctor.genero);

        nombreDoctor.textContent =
            `${tratamiento} ${doctor.nombre} ${doctor.apellido}`;

        especialidadDoctor.textContent =
            `Especialidad: ${doctor.especialidad}`;

        nombreCompleto.textContent =
            `${tratamiento} ${doctor.nombre} ${doctor.apellido}`;

        genero.textContent =
            doctor.genero || "-";

        especialidad.textContent =
            doctor.especialidad || "-";

        matricula.textContent =
            doctor.matricula || "-";

        telefono.textContent =
            doctor.telefono || "-";

        correo.textContent =
            doctor.correo || "-";

        usuario.textContent =
            doctor.usuario || "-";

    } catch (error) {
        console.error("Error:", error);

        nombreDoctor.textContent =
            "No se pudo cargar la ficha";

        especialidadDoctor.textContent = "";
    }
}

btnVolver.addEventListener("click", function () {
    window.location.href = "doctores.html";
});

if (idDoctor) {
    cargarFichaDoctor();
} else {
    nombreDoctor.textContent = "Doctor no encontrado";
    especialidadDoctor.textContent = "";
}