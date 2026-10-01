const tablaDoctores = document.getElementById("tablaDoctores");
const buscarDoctor = document.getElementById("buscarDoctor");
const btnBuscarDoctor = document.getElementById("btnBuscarDoctor");
const btnAgregarDoctor = document.getElementById("btnAgregarDoctor");

let doctores = [];


// CARGAR DOCTORES

async function cargarDoctores() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/doctores"
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los doctores.");
        }

        doctores = await respuesta.json();

        mostrarDoctores(doctores);

    } catch (error) {

        console.error("Error:", error);

        tablaDoctores.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No se pudieron cargar los doctores.
                </td>
            </tr>
        `;
    }
}


// MOSTRAR DOCTORES

function mostrarDoctores(lista) {

    tablaDoctores.innerHTML = "";

    if (lista.length === 0) {

        tablaDoctores.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No se encontraron doctores.
                </td>
            </tr>
        `;

        return;
    }


    lista.forEach(function (doctor) {

        let tratamiento = "Dr.";

        if (doctor.genero === "Femenino") {
            tratamiento = "Dra.";
        }


        const fila = document.createElement("tr");


        fila.innerHTML = `
            <td>${doctor.id_doctor}</td>

            <td>
                ${tratamiento}
                ${doctor.nombre}
                ${doctor.apellido}
            </td>

            <td>${doctor.especialidad}</td>

            <td>${doctor.matricula}</td>

            <td>${doctor.telefono || "-"}</td>

            <td>${doctor.correo || "-"}</td>

            <td>
                <button
                    class="btn-primary"
                    type="button"
                    onclick="verFicha(${doctor.id_doctor})"
                >
                    Ver ficha
                </button>
            </td>
        `;


        tablaDoctores.appendChild(fila);

    });
}


// BUSCAR

function buscarDoctores() {

    const texto =
        buscarDoctor.value.toLowerCase().trim();


    const resultados = doctores.filter(function (doctor) {

        const nombreCompleto =
            doctor.nombre + " " + doctor.apellido;


        return (
            nombreCompleto
                .toLowerCase()
                .includes(texto)
            ||

            doctor.especialidad
                .toLowerCase()
                .includes(texto)
            ||

            doctor.matricula
                .toLowerCase()
                .includes(texto)
        );

    });


    mostrarDoctores(resultados);
}


// BOTÓN BUSCAR

btnBuscarDoctor.addEventListener(
    "click",
    buscarDoctores
);


// BUSCAR AL ESCRIBIR

buscarDoctor.addEventListener(
    "input",
    buscarDoctores
);


// AGREGAR DOCTOR

btnAgregarDoctor.addEventListener(
    "click",
    function () {

        window.location.href =
            "../Cliente/registrarDoctor.html";

    }
);


// VER FICHA

function verFicha(idDoctor) {

    window.location.href =
        `fichaDoctor.html?id_doctor=${idDoctor}`;

}


// INICIAR

cargarDoctores();