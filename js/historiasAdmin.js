const tablaHistorias =
    document.getElementById("tablaHistorias");

const buscarApellido =
    document.getElementById("buscarApellido");

const buscarDni =
    document.getElementById("buscarDni");

const btnBuscar =
    document.getElementById("btnBuscar");

let historias = [];


// CARGAR TODAS LAS HISTORIAS
async function cargarHistorias() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/consultas/historial"
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron obtener las historias clínicas."
            );
        }

        historias = await respuesta.json();

        mostrarHistorias(historias);

    } catch (error) {

        console.error(
            "Error al cargar historias clínicas:",
            error
        );

        tablaHistorias.innerHTML = `
            <tr>
                <td colspan="5">
                    No se pudieron cargar las historias clínicas.
                </td>
            </tr>
        `;
    }
}


// MOSTRAR HISTORIAS
function mostrarHistorias(lista) {

    tablaHistorias.innerHTML = "";

    if (lista.length === 0) {

        tablaHistorias.innerHTML = `
            <tr>
                <td colspan="5">
                    No se encontraron historias clínicas.
                </td>
            </tr>
        `;

        return;
    }

    lista.forEach(historia => {

        const fila =
            document.createElement("tr");

        let ultimaActualizacion = "-";

        if (historia.ultima_actualizacion) {

            ultimaActualizacion =
                new Date(
                    historia.ultima_actualizacion
                ).toLocaleDateString("es-AR");
        }

        fila.innerHTML = `
            <td>
                ${historia.id_paciente}
            </td>

            <td>
                ${historia.nombre}
                ${historia.apellido}
            </td>

            <td>
                ${ultimaActualizacion}
            </td>

            <td>
                Dr./Dra.
                ${historia.nombre_doctor}
                ${historia.apellido_doctor}
            </td>

            <td>
                <button
                    class="btn-tabla"
                    onclick="verHistoria(${historia.id_paciente})"
                >
                    <i data-lucide="eye"></i>
                    Ver más
                </button>
            </td>
        `;

        tablaHistorias.appendChild(fila);
    });

    lucide.createIcons();
}


// BUSCAR
btnBuscar.addEventListener("click", function () {

    const apellido =
        buscarApellido.value
            .toLowerCase()
            .trim();

    const dni =
        buscarDni.value
            .toLowerCase()
            .trim();

    const resultados =
        historias.filter(historia => {

            const coincideApellido =
                historia.apellido
                    .toLowerCase()
                    .includes(apellido);

            const coincideDni =
                String(historia.dni)
                    .toLowerCase()
                    .includes(dni);

            return coincideApellido && coincideDni;
        });

    mostrarHistorias(resultados);
});


// VER HISTORIA COMPLETA
function verHistoria(idPaciente) {

    window.location.href =
        `historialClinico.html?id_paciente=${idPaciente}`;
}


// CARGAR AL ENTRAR
cargarHistorias();