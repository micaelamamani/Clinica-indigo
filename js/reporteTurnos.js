const fechaDesde = document.getElementById("fechaDesde");
const fechaHasta = document.getElementById("fechaHasta");
const filtroDoctor = document.getElementById("filtroDoctor");
const btnGenerar = document.getElementById("btnGenerar");
const tablaReporte = document.getElementById("tablaReporte");
const mensajeReporte = document.getElementById("mensajeReporte");

let turnosCargados = [];


// ========================================
// CARGAR TURNOS
// ========================================

async function cargarTurnos() {

    try {

        const respuesta =
            await fetch("http://localhost:3000/turnos");

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron obtener los turnos."
            );
        }

        turnosCargados =
            await respuesta.json();

        cargarDoctores(turnosCargados);

    } catch (error) {

        console.error(
            "Error al cargar turnos:",
            error
        );

        mensajeReporte.textContent =
            "No se pudieron cargar los turnos.";

    }
}


// ========================================
// CARGAR MÉDICOS EN EL SELECT
// ========================================
function cargarDoctores(turnos) {

    const opciones =
        document.getElementById("opcionesDoctores");

    const doctores = [];

    turnos.forEach(function (turno) {

        const nombreDoctor =
            `${turno.nombre_doctor} ${turno.apellido_doctor}`;

        if (!doctores.includes(nombreDoctor)) {
            doctores.push(nombreDoctor);
        }

    });

    doctores.sort();

    doctores.forEach(function (doctor) {

        const opcion =
            document.createElement("option");

        opcion.value = doctor;

        opciones.appendChild(opcion);

    });
}
// ========================================
// GENERAR REPORTE
// ========================================

btnGenerar.addEventListener(
    "click",
    function () {

        const desde =
            fechaDesde.value;

        const hasta =
            fechaHasta.value;

        const doctorSeleccionado =
            filtroDoctor.value;

        mensajeReporte.textContent = "";

        if (!desde || !hasta) {

            mensajeReporte.textContent =
                "Seleccioná las dos fechas para generar el reporte.";

            return;
        }

        if (desde > hasta) {

            mensajeReporte.textContent =
                "La fecha inicial no puede ser posterior a la fecha final.";

            return;
        }

        const turnosFiltrados =
            turnosCargados.filter(
                function (turno) {

                    const fechaTurno =
                        turno.fecha
                            .toString()
                            .split("T")[0];

                    const mismoDoctor =
                        doctorSeleccionado === "" ||
                        doctorSeleccionado === "Todos los médicos" ||
                        `${turno.nombre_doctor} ${turno.apellido_doctor}` ===
                        doctorSeleccionado;
                    return (
                        fechaTurno >= desde &&
                        fechaTurno <= hasta &&
                        mismoDoctor
                    );

                }
            );

        mostrarResumen(
            turnosFiltrados
        );

        mostrarTabla(
            turnosFiltrados
        );

    }
);


// ========================================
// MOSTRAR RESUMEN
// ========================================

function mostrarResumen(turnos) {

    let pendientes = 0;
    let confirmados = 0;
    let atendidos = 0;
    let cancelados = 0;

    turnos.forEach(
        function (turno) {

            if (turno.estado === "Pendiente") {
                pendientes++;
            }

            if (turno.estado === "Confirmado") {
                confirmados++;
            }

            if (turno.estado === "Atendido") {
                atendidos++;
            }

            if (turno.estado === "Cancelado") {
                cancelados++;
            }

        }
    );

    document.getElementById(
        "totalTurnos"
    ).textContent =
        turnos.length;

    document.getElementById(
        "totalPendientes"
    ).textContent =
        pendientes;

    document.getElementById(
        "totalConfirmados"
    ).textContent =
        confirmados;

    document.getElementById(
        "totalAtendidos"
    ).textContent =
        atendidos;

    document.getElementById(
        "totalCancelados"
    ).textContent =
        cancelados;
}


// ========================================
// MOSTRAR TABLA
// ========================================

function mostrarTabla(turnos) {

    tablaReporte.innerHTML = "";

    if (turnos.length === 0) {

        tablaReporte.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No hay turnos registrados con estos filtros.
                </td>
            </tr>
        `;

        return;
    }

    turnos.forEach(
        function (turno) {

            const fila =
                document.createElement("tr");

            const partesFecha =
                turno.fecha
                    .toString()
                    .split("T")[0]
                    .split("-");

            const fechaFormateada =
                partesFecha[2] + "/" +
                partesFecha[1] + "/" +
                partesFecha[0];

            const hora =
                turno.hora
                    .toString()
                    .substring(0, 5);

            const claseEstado =
                obtenerClaseEstado(
                    turno.estado
                );

            fila.innerHTML = `
                <td>${fechaFormateada}</td>

                <td>${hora}</td>

                <td>
                    ${turno.nombre_paciente}
                    ${turno.apellido_paciente}
                </td>
                <td>
    ${obtenerTratamiento(turno.genero_doctor)}
    ${turno.apellido_doctor}
    </td>
                <td>
                    ${turno.especialidad}
                </td>

                <td>
                    <span class="estado ${claseEstado}">
                        ${turno.estado}
                    </span>
                </td>
            `;

            tablaReporte.appendChild(fila);

        }
    );
}


// ========================================
// CLASE DEL ESTADO
// ========================================

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
function obtenerTratamiento(genero) {

    if (genero === "Femenino") {
        return "Dra.";
    }

    return "Dr.";
}

// ========================================
// INICIAR
// ========================================

cargarTurnos();
