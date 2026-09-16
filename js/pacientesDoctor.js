document.addEventListener("DOMContentLoaded", () => {
    const idDoctor = localStorage.getItem("idDoctor");
    const rol = localStorage.getItem("rol");
    const tabla = document.getElementById("tablaPacientes");
    const inputApellido = document.getElementById("buscarApellido");
    const inputDni = document.getElementById("buscarDni");
    const botonBuscar = document.getElementById("btnBuscar");
    let pacientes = [];
    if (!idDoctor || rol !== "doctor") {
        alert("Debés iniciar sesión como doctor.");
        window.location.href = "../Cliente/inicioSesion.html";
        return;
    }
    function cargarPacientes() {
        fetch(`http://localhost:3000/pacientes/doctor/${idDoctor}`)
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error("Error al obtener los pacientes.");
                }
                return respuesta.json();
            })
            .then(datos => {
                pacientes = datos;
                mostrarPacientes(pacientes);
            })
            .catch(error => {
                console.error(error);
                tabla.innerHTML = `
                    <tr>
                        <td colspan="5" class="sin-turnos">
                            No se pudieron cargar los pacientes.
                        </td>
                    </tr>
                `;
            });
    }
    function mostrarPacientes(lista) {
        tabla.innerHTML = "";
        if (lista.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="5" class="sin-turnos">
                        No se encontraron pacientes.
                    </td>
                </tr>
            `;
            return;
        }
        lista.forEach(paciente => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>
                    <strong>
                        ${paciente.apellido}, ${paciente.nombre}
                    </strong>
                </td>
                <td>
                    ${paciente.dni}
                </td>
                <td>
    ${paciente.ultima_consulta
                    ? new Date(paciente.ultima_consulta)
                        .toLocaleDateString("es-AR")
                    : "-"
                }
</td>
                <td>
                    <span class="estado activo">
                        Activo
                    </span>
                </td>
                <td>
                    <button class="btn-tabla" onclick="verPaciente(${paciente.id_paciente})">
                        <i data-lucide="eye"></i>
                        Ver paciente
                    </button>
                </td>
            `;
            tabla.appendChild(fila);
        });
        lucide.createIcons();
    }
    function buscarPacientes() {
        const apellido = inputApellido.value.trim().toLowerCase();
        const dni = inputDni.value.trim();
        const resultados = pacientes.filter(paciente => {
            const coincideApellido =
                apellido &&
                paciente.apellido.toLowerCase().includes(apellido);
            const coincideDni =
                dni &&
                paciente.dni.toString().includes(dni);
            return coincideApellido || coincideDni;
        });
        mostrarPacientes(resultados);
    }
    botonBuscar.addEventListener("click", buscarPacientes);
    window.verPaciente = function (idPaciente) {

        localStorage.setItem(
            "pacienteSeleccionado",
            idPaciente
        );
        window.location.href =
            `historialDoctor.html?id_paciente=${idPaciente}`;

    };
    cargarPacientes();
});