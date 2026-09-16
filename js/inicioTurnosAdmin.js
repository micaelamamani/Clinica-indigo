const tablaTurnosP = document.getElementById("tablaTurnosP");

async function cargarTurnosHoy() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/turnos/hoy/lista"
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron obtener los turnos de hoy."
            );
        }

        const turnos = await respuesta.json();

        tablaTurnosP.innerHTML = "";

        if (turnos.length === 0) {

            tablaTurnosP.innerHTML = `
                <tr>
                    <td colspan="5">
                        No hay turnos para hoy.
                    </td>
                </tr>
            `;

            return;
        }
        turnos.forEach(turno => {
            const fila = document.createElement("tr");
            const fecha =new Date(turno.fecha).toLocaleDateString("es-AR");
            const hora =turno.hora.toString().substring(0, 5);
            fila.innerHTML = `
                <td>${fecha}</td>
                <td>${hora}</td>
                <td>
                    ${turno.nombre_paciente}
                    ${turno.apellido_paciente}
                </td>
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
            tablaTurnosP.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar turnos de hoy:",error);
        tablaTurnosP.innerHTML = `
            <tr>
                <td colspan="5">
                    No se pudieron cargar los turnos.
                </td>
            </tr>
        `;
    }
}
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
cargarTurnosHoy();