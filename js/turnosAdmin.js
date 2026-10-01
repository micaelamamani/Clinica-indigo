const tablaTurnos =
    document.getElementById("tablaTurnos");

const inputBuscar =
    document.getElementById("buscarTurno");

const botonBuscar =
    document.getElementById("btnBuscarTurno");

let turnosCargados = [];


// CARGAR TURNOS
async function cargarTurnos() {

    try {

        const respuesta =
            await fetch("http://localhost:3000/turnos");

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron obtener los turnos."
            );
        }

        const turnos =
            await respuesta.json();

        turnosCargados = turnos;

        mostrarTurnos(turnos);

    } catch (error) {

        console.error(
            "Error al cargar turnos:",
            error
        );

        tablaTurnos.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No se pudieron cargar los turnos.
                </td>
            </tr>
        `;
    }
}


// MOSTRAR TURNOS
function mostrarTurnos(turnos) {

    tablaTurnos.innerHTML = "";

    if (turnos.length === 0) {

        tablaTurnos.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No hay turnos programados en el sistema.
                </td>
            </tr>
        `;

        return;
    }


    turnos.forEach(turno => {

        const fila =
            document.createElement("tr");

        const fecha =
            new Date(turno.fecha)
                .toLocaleDateString("es-AR");

        const hora =
            turno.hora
                .toString()
                .substring(0, 5);


        let botonCancelar = "";

        if (
            turno.estado === "Pendiente" ||
            turno.estado === "Confirmado"
        ) {

            botonCancelar = `
        <button
            class="btn-tabla"
            onclick="cancelarTurno(${turno.id_turno})"
            type="button"
        >
            Cancelar
        </button>
    `;

        } else {

            botonCancelar = `
        <button
            class="btn-tabla btn-deshabilitado"
            type="button"
            disabled
        >
            Cancelar
        </button>
    `;
        }
        fila.innerHTML = `

            <td>
                ${fecha}
            </td>

            <td>
                ${hora}
            </td>

            <td>
                ${turno.nombre_paciente}
                ${turno.apellido_paciente}
            </td>

            <td>
                ${turno.usuario_doctor}
            </td>

            <td>
                ${turno.especialidad}
            </td>

            <td>
                <span class="estado ${obtenerClaseEstado(turno.estado)}">
                    ${turno.estado}
                </span>
            </td>

            <td>
                ${botonCancelar}
            </td>

        `;

        tablaTurnos.appendChild(fila);

    });
}


// BUSCAR TURNO
function buscarTurno() {

    const texto =
        inputBuscar.value
            .toLowerCase()
            .trim();


    if (texto === "") {

        mostrarTurnos(turnosCargados);

        return;
    }


    const resultados =
        turnosCargados.filter(turno => {

            const paciente =
                `${turno.nombre_paciente} ${turno.apellido_paciente}`
                    .toLowerCase();

            const doctor =
                `${turno.usuario_doctor}`
                    .toLowerCase();

            const especialidad =
                `${turno.especialidad}`
                    .toLowerCase();

            const estado =
                `${turno.estado}`
                    .toLowerCase();


            return (
                paciente.includes(texto) ||
                doctor.includes(texto) ||
                especialidad.includes(texto) ||
                estado.includes(texto)
            );

        });


    mostrarTurnos(resultados);
}
// CANCELAR TURNO
async function cancelarTurno(idTurno) {

    const mensaje =
        document.getElementById("mensajeTurno");

    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/turnos/cancelar/${idTurno}`,
                {
                    method: "PUT"
                }
            );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo cancelar el turno."
            );
        }

        const resultado =
            await respuesta.json();
        mensaje.textContent =
            resultado.mensaje;
        mensaje.className =
            "mensaje-exito";
        cargarTurnos();
    } catch (error) {
        console.error(
            "Error al cancelar turno:",
            error
        );

        mensaje.textContent =
            "No se pudo cancelar el turno.";

        mensaje.className =
            "mensaje-error";
    }
}
// CLASE VISUAL SEGÚN ESTADO
function obtenerClaseEstado(estado) {

    if (estado === "Confirmado") {
        return "confirmado";
    }

    if (estado === "Cancelado") {
        return "cancelado";
    }

    if (estado === "Atendido") {
        return "realizado";
    }

    return "pendiente";
}


cargarTurnos();
// BOTÓN BUSCAR
botonBuscar.addEventListener(
    "click",
    buscarTurno
);

// BUSCAR MIENTRAS ESCRIBE
inputBuscar.addEventListener(
    "input",
    buscarTurno
);