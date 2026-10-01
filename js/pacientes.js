const tablaPacientes = document.getElementById("tablaPacientes");

let pacientes = [];


// CAMBIAMOS EL FORMATO DE FECHA
function formatearFecha(fecha) {

    if (!fecha) {
        return "-";
    }

    const fechaSolo = fecha.substring(0, 10);
    const partes = fechaSolo.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
// FORMATO DEL DNI
function formatearDni(dni) {

    if (!dni) {
        return "-";
    }

    dni = String(dni).replace(/\D/g, "");

    if (dni.length === 8) {
        return `${dni.substring(0, 2)}.${dni.substring(2, 5)}.${dni.substring(5)}`;
    }

    return dni;
}

// CARGA DE PACIENTES EN LA TABLA
async function cargarPacientes() {

    try {

        const respuesta =
            await fetch("http://localhost:3000/pacientes");

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron obtener los pacientes"
            );
        }

        pacientes = await respuesta.json();

        mostrarPacientes(pacientes);

    } catch (error) {

        console.error(
            "Error al cargar pacientes:",
            error
        );

        tablaPacientes.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    No se pudieron cargar los pacientes.
                </td>
            </tr>
        `;
    }
}


// MOSTRAR PACIENTES
function mostrarPacientes(lista) {

    tablaPacientes.innerHTML = "";

    if (lista.length === 0) {

        tablaPacientes.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    No se encontraron pacientes.
                </td>
            </tr>
        `;

        return;
    }

    lista.forEach(paciente => {

        const fila =
            document.createElement("tr");

        const fechaNacimiento =
            formatearFecha(
                paciente.fecha_nacimiento
            );

        const dni = formatearDni(paciente.dni);

        fila.innerHTML = `
            <td>
                ${paciente.id_paciente}
            </td>

            <td>
                ${paciente.nombre}
                ${paciente.apellido}
            </td>
            <td>${dni}</td>
            <td>
                ${fechaNacimiento}
            </td>

            <td>
                <button
                    class="btn-tabla"
                    data-id="${paciente.id_paciente}"
                    type="button"
                >
                    Ver ficha
                </button>
            </td>
        `;

        tablaPacientes.appendChild(fila);
    });
}


// BUSCAR PACIENTES
const inputBuscar =
    document.getElementById("buscarPaciente");

const botonBuscar =
    document.getElementById("btnBuscarPaciente");


inputBuscar.addEventListener(
    "input",
    buscarPaciente
);

botonBuscar.addEventListener(
    "click",
    buscarPaciente
);


function buscarPaciente() {

    const texto =
        inputBuscar.value
            .toLowerCase()
            .trim();

    const resultados =
        pacientes.filter(paciente => {

            const nombreCompleto =
                `${paciente.nombre} ${paciente.apellido}`
                    .toLowerCase();

            const dni =
                String(paciente.dni)
                    .toLowerCase();

            return (
                nombreCompleto.includes(texto) ||
                dni.includes(texto)
            );
        });

    mostrarPacientes(resultados);
}
// CARGAR AL ENTRAR
cargarPacientes();
const btnAgregarPaciente =
    document.getElementById("btnAgregarPaciente");

btnAgregarPaciente.addEventListener(
    "click",
    function () {

        window.location.href =
            "../Cliente/registrarsePaciente.html?admin=true";
    }
);
// VER FICHA
tablaPacientes.addEventListener("click", function (event) {

    if (event.target.classList.contains("btn-tabla")) {

        const idPaciente =
            event.target.dataset.id;

        window.location.href =
            `fichaPaciente.html?id_paciente=${idPaciente}`;
    }
});