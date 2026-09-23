const parametros =
    new URLSearchParams(window.location.search);

const idPaciente =
    parametros.get("id_paciente");
const contenedorConsultas =
    document.getElementById("contenedorConsultas");
// VERIFICAR PACIENTE
if (!idPaciente) {
    contenedorConsultas.innerHTML = `
        <p>
            No se indicó ningún paciente.
        </p>
    `;
} else {
    cargarPaciente();
    cargarConsultas();
}

// CARGAR DATOS DEL PACIENTE
async function cargarPaciente() {
    try {
        const respuesta = await fetch(
            `http://localhost:3000/pacientes/${idPaciente}`
        );
        if (!respuesta.ok) {
            throw new Error(
                "No se pudo obtener el paciente."
            );
        }
        const paciente =
            await respuesta.json();
        const nombreCompleto =
            `${paciente.nombre} ${paciente.apellido}`;

        document.getElementById(
            "nombrePaciente"
        ).textContent =
            nombreCompleto;
        document.getElementById("dniPaciente").textContent =`DNI: ${paciente.dni}`;
        document.getElementById("nombreCompleto").textContent =nombreCompleto;
        document.getElementById("dni").textContent =paciente.dni;
        if (paciente.fecha_nacimiento) {
            const fecha =paciente.fecha_nacimiento.toString().split("T")[0].split("-");

            document.getElementById(
                "fechaNacimiento"
            ).textContent =
                `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
        }
        document.getElementById("ciudad").textContent =paciente.ciudad || "-";
    } catch (error) {
        console.error("Error al cargar paciente:",error);
    }
}
// CARGAR CONSULTAS
async function cargarConsultas() {
    try {
        const respuesta = await fetch(`http://localhost:3000/consultas/paciente/${idPaciente}`);
        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener las consultas.");
        }
        const consultas =await respuesta.json();
        mostrarConsultas(consultas);
    } catch (error) {
        console.error("Error al cargar consultas:",error);
        contenedorConsultas.innerHTML = `
            <p>
                No se pudieron cargar las consultas.
            </p>
        `;
    }
}
// MOSTRAR CONSULTAS
function mostrarConsultas(consultas) {
    contenedorConsultas.innerHTML = "";
    if (consultas.length === 0) {
        contenedorConsultas.innerHTML = `
            <p>
                Este paciente todavía no tiene consultas registradas.
            </p>
        `;
        return;
    }
    consultas.forEach(consulta => {
        const tarjeta =document.createElement("div");
        tarjeta.className = "consulta-card";
        const fecha =new Date(consulta.fecha_consulta);
        const fechaFormateada =fecha.toLocaleDateString("es-AR" );

        tarjeta.innerHTML = `
            <div class="consulta-header">
                <div>
                    <span class="consulta-fecha">
                        ${fechaFormateada}
                    </span>
                    <h3>
                        ${consulta.especialidad}
                    </h3>
                    <p>
                        Dr./Dra.
                        ${consulta.nombre_doctor}
                        ${consulta.apellido_doctor}
                    </p>
                </div>
            </div>
            <div class="consulta-contenido">

                <div>
                    <strong>
                        Motivo
                    </strong>

                    <p>
                        ${consulta.motivo}
                    </p>
                </div>
                <div>
                    <strong>
                        Diagnóstico
                    </strong>
                    <p>
                        ${consulta.diagnostico}
                    </p>
                </div>
                <div>
                    <strong>
                        Observaciones
                    </strong>
                    <p>
                        ${consulta.observaciones || "Sin observaciones."}
                    </p>
                </div>

            </div>
        `;
        contenedorConsultas.appendChild(tarjeta);
    });

}