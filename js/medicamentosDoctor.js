const buscarApellido = document.getElementById("buscarApellido");
const buscarDni = document.getElementById("buscarDni");
const btnBuscarMedicamentos = document.getElementById("btnBuscarMedicamentos");

const tablaMedicamentos = document.getElementById("tablaMedicamentos");
const nombrePaciente = document.getElementById("nombrePaciente");

let pacienteSeleccionado = null;

btnBuscarMedicamentos.addEventListener("click", buscarPaciente);


// =========================================
// BUSCAR PACIENTE
// =========================================

async function buscarPaciente() {

    const apellido = buscarApellido.value.trim();
    const dni = buscarDni.value.trim();

    if (!apellido && !dni) {
        alert("Ingresá un apellido o un DNI.");
        return;
    }

    try {

        const respuesta = await fetch(
            `http://localhost:3000/pacientes`
        );

        const pacientes = await respuesta.json();

        if (!respuesta.ok) {
            alert("No se pudieron obtener los pacientes.");
            return;
        }


        // Buscar coincidencia
        const paciente = pacientes.find(p => {

            const coincideApellido =
                apellido &&
                p.apellido.toLowerCase() === apellido.toLowerCase();

            const coincideDni =
                dni &&
                p.dni === dni;

            return coincideApellido || coincideDni;
        });


        if (!paciente) {

            alert("No se encontró ningún paciente.");

            nombrePaciente.textContent =
                "Ningún paciente seleccionado";

            tablaMedicamentos.innerHTML = `
                <tr>
                    <td colspan="5">
                        No se encontró el paciente.
                    </td>
                </tr>
            `;

            return;
        }


        pacienteSeleccionado = paciente;

        nombrePaciente.textContent =
            `${paciente.nombre} ${paciente.apellido}`;


        // Obtener medicamentos
        await cargarMedicamentos(paciente.id_paciente);


    } catch (error) {

        console.error("Error al buscar paciente:", error);

        alert("No se pudo conectar con el servidor.");
    }
}


// =========================================
// CARGAR MEDICAMENTOS
// =========================================

async function cargarMedicamentos(idPaciente) {

    try {

        const respuesta = await fetch(
            `http://localhost:3000/medicamentos/paciente/${idPaciente}`
        );

        const medicamentos = await respuesta.json();

        if (!respuesta.ok) {

            alert(
                medicamentos.mensaje ||
                "No se pudieron obtener los medicamentos."
            );

            return;
        }

        mostrarMedicamentos(medicamentos);

    } catch (error) {

        console.error("Error al cargar medicamentos:", error);

        alert("No se pudieron cargar los medicamentos.");
    }
}


// =========================================
// ESTADO DEL MEDICAMENTO
function obtenerEstado(fechaInicio, fechaFin) {

    if (!fechaInicio) {
        return "Pendiente";
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);

    if (isNaN(inicio.getTime())) {
        return "Pendiente";
    }

    if (hoy < inicio) {
        return "Pendiente";
    }

    if (!fechaFin) {
        return "Activo";
    }

    const fin = new Date(fechaFin);
    fin.setHours(0, 0, 0, 0);

    if (isNaN(fin.getTime())) {
        return "Activo";
    }

    if (hoy <= fin) {
        return "Activo";
    }

    return "Finalizado";
}
// CALCULAR DURACIÓN
function calcularDuracion(fechaInicio, fechaFin) {

    if (!fechaInicio || !fechaFin) {
        return "Sin fecha de finalización";
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        return "Fecha inválida";
    }

    const diferencia = fin.getTime() - inicio.getTime();

    const dias = Math.floor(
        diferencia / (1000 * 60 * 60 * 24)
    ) + 1;

    return `${dias} días`;
}
// MOSTRAR MEDICAMENTOS
// =========================================

function mostrarMedicamentos(medicamentos) {

    tablaMedicamentos.innerHTML = "";


    if (medicamentos.length === 0) {

        tablaMedicamentos.innerHTML = `
            <tr>
                <td colspan="5">
                    Este paciente no tiene medicamentos registrados.
                </td>
            </tr>
        `;

        return;
    }


    medicamentos.forEach(medicamento => {

        const estado = obtenerEstado(
            medicamento.fecha_inicio,
            medicamento.fecha_fin
        );


        const duracion = calcularDuracion(
            medicamento.fecha_inicio,
            medicamento.fecha_fin
        );


        let claseEstado = "";


        if (estado === "Activo") {

            claseEstado = "activo";

        } else if (estado === "Finalizado") {

            claseEstado = "finalizado";

        } else {

            claseEstado = "pendiente";
        }


        const fila =
            document.createElement("tr");


        fila.innerHTML = `

            <td>

                <div class="medicamento-nombre">

                    <div class="medicamento-icon">

                        <i data-lucide="pill"></i>

                    </div>

                    <strong>
                        ${medicamento.medicamento}
                    </strong>

                </div>

            </td>


            <td>
                ${medicamento.frecuencia}
            </td>


            <td>
                ${duracion}
            </td>


            <td>
                ${medicamento.motivo || "Sin indicación"}
            </td>


            <td>

                <span class="estado ${claseEstado}">
                    ${estado}
                </span>

            </td>

        `;


        tablaMedicamentos.appendChild(fila);

    });


    lucide.createIcons();
}