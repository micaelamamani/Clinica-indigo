const formularioTurno = document.getElementById("turnoForm");
const selectDoctor = document.getElementById("doctor");
const tablaTurnos = document.getElementById("tablaTurnos");
function mostrarProximoTurno(turnos) {
    const fechaElemento =
        document.getElementById("fechaProximoTurno");
    const horaElemento =
        document.getElementById("horaProximoTurno");
    const doctorElemento =
        document.getElementById("doctorProximoTurno");

    const especialidadElemento =
        document.getElementById("especialidadProximoTurno");

    const estadoElemento =
        document.getElementById("estadoProximoTurno");
    // =========================================
    // OBTENER FECHA Y HORA DEL TURNO
    // =========================================
    function obtenerFechaTurno(turno) {

        const fecha = new Date(turno.fecha);

        const partesHora =
            turno.hora.toString().substring(0, 8).split(":");

        const horas = parseInt(partesHora[0]) || 0;
        const minutos = parseInt(partesHora[1]) || 0;
        const segundos = parseInt(partesHora[2]) || 0;

        fecha.setHours(horas, minutos, segundos, 0);

        return fecha;
    }
    // =========================================
    // FILTRAR TURNOS FUTUROS
    // =========================================
    const ahora = new Date();
    const turnosFuturos = turnos.filter(turno => {
        const fechaTurno =
            obtenerFechaTurno(turno);
        return fechaTurno >= ahora &&
            turno.estado !== "Cancelado" &&
            turno.estado !== "Atendido";

    });
    // =========================================
    // NO HAY PRÓXIMOS TURNOS
    // =========================================
    if (turnosFuturos.length === 0) {
        fechaElemento.textContent =
            "No tenés próximos turnos";
        horaElemento.textContent =
            "";
        doctorElemento.textContent =
            "-";

        especialidadElemento.textContent =
            "-";

        estadoElemento.textContent =
            "";

        estadoElemento.className =
            "estado";

        return;
    }
    // =========================================
    // ORDENAR POR FECHA
    // =========================================
    turnosFuturos.sort((a, b) => {
        return obtenerFechaTurno(a) -
            obtenerFechaTurno(b);
    });
    // =========================================
    // TOMAR EL PRÓXIMO
    // =========================================
    const turno = turnosFuturos[0];
    // =========================================
    // FECHA
    // =========================================
    const fecha =
        new Date(turno.fecha);

    const fechaFormateada =
        fecha.toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });
    fechaElemento.textContent =
        fechaFormateada;
    // =========================================
    // HORA
    // =========================================

    const hora =
        turno.hora.toString().substring(0, 5);

    horaElemento.textContent =
        `${hora} hs`;


    // =========================================
    // DOCTOR
    // =========================================

    doctorElemento.textContent =
        `Dr./Dra. ${turno.nombre_doctor} ${turno.apellido_doctor}`;

    // =========================================
    // ESPECIALIDAD
    // =========================================
    especialidadElemento.textContent =
        turno.especialidad;
    // =========================================
    // ESTADO
    // =========================================

    estadoElemento.textContent =
        turno.estado;

    estadoElemento.className =
        `estado ${obtenerClaseEstado(turno.estado)}`;

}


async function cargarDoctores() {

    try {

        const respuesta =
            await fetch("http://localhost:3000/turnos/doctores");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los médicos."
            );

        }

        const doctores =
            await respuesta.json();

        doctores.forEach(doctor => {

            const opcion =
                document.createElement("option");

            opcion.value =
                doctor.id_doctor;

            opcion.textContent =
                `Dr./Dra. ${doctor.nombre} ${doctor.apellido} - ${doctor.especialidad}`;

            selectDoctor.appendChild(opcion);

        });

    } catch (error) {

        console.error(
            "Error al cargar médicos:",
            error
        );

    }

}


// =========================================
// SOLICITAR TURNO
// =========================================

formularioTurno.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const idPaciente =
            localStorage.getItem("idPaciente");

        const idDoctor =
            selectDoctor.value;

        const fecha =
            document.getElementById("fecha").value;

        const hora =
            document.getElementById("hora").value;


        // =========================================
        // VERIFICAR PACIENTE
        // =========================================

        if (!idPaciente) {

            alert(
                "No se pudo identificar al paciente. Iniciá sesión nuevamente."
            );

            return;
        }


        // =========================================
        // VERIFICAR DATOS
        // =========================================

        if (!idDoctor || !fecha || !hora) {

            alert(
                "Completá todos los campos."
            );

            return;
        }


        // =========================================
        // VERIFICAR HORARIO
        // =========================================

        if (
            typeof horarioValido === "function" &&
            !horarioValido()
        ) {

            return;
        }


        // =========================================
        // ENVIAR TURNO
        // =========================================

        try {

            const respuesta =
                await fetch(
                    "http://localhost:3000/turnos/solicitar",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            id_paciente: idPaciente,
                            id_doctor: idDoctor,
                            fecha: fecha,
                            hora: hora
                        })
                    }
                );


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {
                alert(resultado.mensaje);
                return;
            }
           // alert("Turno solicitado correctamente.");
            formularioTurno.reset();
            cargarTurnosPaciente();
        } catch (error) {
            console.error("Error al solicitar turno:",error);
            alert("No se pudo conectar con el servidor.");
        }
    }
);
// =========================================
// HISTORIAL DE TURNOS
// =========================================
async function cargarTurnosPaciente() {

    const idPaciente =
        localStorage.getItem("idPaciente");
    if (!idPaciente) {
        return;
    }
    try {
        const respuesta =
            await fetch(
                `http://localhost:3000/turnos/paciente/${idPaciente}`
            );
        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los turnos."
            );

        }
        const turnos =
            await respuesta.json();
        mostrarProximoTurno(turnos);
        if (!tablaTurnos) {
            return;
        }
        tablaTurnos.innerHTML = "";
        // =========================================
        // NO HAY TURNOS
        // =========================================
        if (turnos.length === 0) {

            tablaTurnos.innerHTML = `
                <tr>
                    <td colspan="5">
                        Todavía no tenés turnos registrados.
                    </td>
                </tr>
            `;
            return;
        }
        // =========================================
        // MOSTRAR TURNOS
        // =========================================
        turnos.forEach(turno => {
            const fila =
                document.createElement("tr");
            const fecha =
                new Date(turno.fecha)
                    .toLocaleDateString("es-AR");
            const hora =turno.hora.toString().substring(0, 5);
            fila.innerHTML = `
                <td>${fecha}</td>

                <td>${hora}</td>

                <td>${turno.especialidad}</td>

                <td>
                    Dr./Dra.
                    ${turno.nombre_doctor}
                    ${turno.apellido_doctor}
                </td>

                <td>
                    <span class="estado ${obtenerClaseEstado(turno.estado)}">
                        ${turno.estado}
                    </span>
                </td>
            `;
            tablaTurnos.appendChild(fila);
        });
    } catch (error) {
        console.error(
            "Error al cargar turnos:",
            error
        );
    }
}
// =========================================
// ESTADO DEL TURNO
// =========================================
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
cargarDoctores();
cargarTurnosPaciente();