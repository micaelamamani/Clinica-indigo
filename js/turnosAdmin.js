const tablaTurnos = document.getElementById("tablaTurnos");
async function cargarTurnos() {
    try {
        const respuesta = await fetch("http://localhost:3000/turnos");
        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los turnos.");
        }
        const turnos = await respuesta.json();
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
            const fila = document.createElement("tr");
            const fecha = new Date(turno.fecha).toLocaleDateString("es-AR");
            const hora = turno.hora.toString().substring(0, 5);
            fila.innerHTML = `
                <td>${fecha}</td>
                <td>${hora}</td>
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
                    <button class="btn-accion">
                        Ver
                    </button>
                </td>
            `;
            tablaTurnos.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar turnos:", error);
        tablaTurnos.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No se pudieron cargar los turnos.
                </td>
            </tr>
        `;
    }
}


// Clase visual según el estado
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