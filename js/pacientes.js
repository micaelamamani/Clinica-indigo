const tablaPacientes = document.getElementById("tablaPacientes");
//cambiamos el formato de fecha
function formatearFecha(fecha) {
    if (!fecha) {
        return "-";
    }
    const fechaSolo = fecha.substring(0, 10);
    const partes = fechaSolo.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
//carga de pacientes en la tabla
async function cargarPacientes() {
    try {
        const respuesta = await fetch("http://localhost:3000/pacientes");
        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los pacientes");
        }
        const pacientes = await respuesta.json();
        tablaPacientes.innerHTML = "";
//y si no hay pacientes:
        if (pacientes.length === 0) {
            tablaPacientes.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        No hay pacientes registrados.
                    </td>
                </tr>
            `;
            return;
        }
//mostrar
        pacientes.forEach(paciente => {
            const fila = document.createElement("tr");
            const fechaNacimiento=formatearFecha(paciente.fecha_nacimiento);
            fila.innerHTML = `
                <td>
                    ${paciente.id_paciente}
                </td>
                <td>
                    ${paciente.nombre}
                    ${paciente.apellido}
                </td>
                <td>
                    ${paciente.dni}
                </td>
                <td>
                    ${fechaNacimiento}
                </td>
                <td>
                    <button class="btn-ver" data-id="${paciente.id_paciente}" type="button">
                        Ver ficha
                    </button>
                </td>
            `;
            tablaPacientes.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar pacientes:",error);
        tablaPacientes.innerHTML = `
            <tr>
            <td colspan="5" class="text-center">
                    No se pudieron cargar los pacientes.
                </td>
            </tr>
        `;
    }
}
cargarPacientes();