document.addEventListener("DOMContentLoaded", () => {

    const idPaciente =
        localStorage.getItem("idPaciente");


    if (!idPaciente) {

        alert(
            "No se pudo identificar al paciente."
        );

        window.location.href =
            "inicioSesion.html";

        return;
    }


    const nombrePaciente =
        document.getElementById("nombrePaciente");

    const dniPaciente =
        document.getElementById("dniPaciente");

    const fechaNacimiento =
        document.getElementById("fechaNacimiento");

    const ciudadPaciente =
        document.getElementById("ciudadPaciente");

    const tablaConsultas =
        document.getElementById("tablaConsultas");
    let consultasActuales = [];

    // =========================================
    // CARGAR DATOS DEL PACIENTE
    // =========================================

    async function cargarPaciente() {

        try {

            const respuesta = await fetch(
                `http://localhost:3000/pacientes/${idPaciente}`
            );

            if (!respuesta.ok) {

                throw new Error(
                    "No se pudieron obtener los datos."
                );

            }

            const paciente =
                await respuesta.json();


            nombrePaciente.textContent =
                `${paciente.nombre} ${paciente.apellido}`;

            dniPaciente.textContent =
                paciente.dni;

            if (paciente.fecha_nacimiento) {
                const fecha = paciente.fecha_nacimiento
                    .toString()
                    .split("T")[0]
                    .split("-");

                fechaNacimiento.textContent =
                    `${fecha[2]}/${fecha[1]}/${fecha[0]}`;
            } else {
                fechaNacimiento.textContent = "-";
            }

            ciudadPaciente.textContent =
                paciente.ciudad || "-";


        } catch (error) {

            console.error(
                "Error al cargar paciente:",
                error
            );
        }
    }
    // =========================================
    // CARGAR CONSULTAS
    // =========================================

    async function cargarConsultas() {

        try {

            const respuesta = await fetch(
                `http://localhost:3000/consultas/paciente/${idPaciente}`
            );


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudieron obtener las consultas."
                );

            }
            const consultas =
                await respuesta.json();

            consultasActuales = consultas;

            mostrarConsultas(consultas);
        } catch (error) {

            console.error(
                "Error al cargar consultas:",
                error
            );
            tablaConsultas.innerHTML = `
                <tr>
                    <td colspan="5">
                        No se pudieron cargar las consultas.
                    </td>
                </tr>
            `;
        }
    }
    // =========================================
    // MOSTRAR CONSULTAS
    // =========================================

    function mostrarConsultas(consultas) {

        tablaConsultas.innerHTML = "";


        if (consultas.length === 0) {

            tablaConsultas.innerHTML = `
                <tr>
                    <td colspan="5">
                        Todavía no tenés consultas registradas.
                    </td>
                </tr>
            `;

            return;
        }


        consultas.forEach(consulta => {

            const fila =
                document.createElement("tr");


            const fecha =
                new Date(
                    consulta.fecha_consulta
                );


            const fechaFormateada =
                fecha.toLocaleDateString("es-AR");


            fila.innerHTML = `

                <td>
                    ${fechaFormateada}
                </td>

                <td>
                    ${consulta.especialidad}
                </td>

                <td>
                    Dr./Dra.
                    ${consulta.nombre_doctor}
                    ${consulta.apellido_doctor}
                </td>

                <td>
                    ${consulta.motivo}
                </td>

                <td>

                    <button
                        class="btn-tabla"
                        onclick="verConsulta(${consulta.id_consulta})"
                    >

                        <i data-lucide="eye"></i>

                        Ver

                    </button>

                </td>

            `;


            tablaConsultas.appendChild(fila);

        });


        lucide.createIcons();

    }


    // =========================================
    // VER DETALLE
    // =========================================

    window.verConsulta = function (idConsulta) {

        // Buscar la consulta
        // dentro de las consultas cargadas

        const consulta =
            consultasActuales.find(
                c => c.id_consulta === idConsulta
            );


        if (!consulta) {
            return;
        }


        mostrarDetalle(consulta);

    };


    // =========================================
    // MOSTRAR DETALLE
    // =========================================

    function mostrarDetalle(consulta) {

        const fecha =
            new Date(
                consulta.fecha_consulta
            );


        document.getElementById(
            "detalleFecha"
        ).textContent =
            `CONSULTA DEL ${fecha.toLocaleDateString("es-AR")}`;


        document.getElementById(
            "detalleTitulo"
        ).textContent =
            `${consulta.especialidad} · Dr./Dra. ${consulta.nombre_doctor} ${consulta.apellido_doctor}`;


        document.getElementById(
            "detalleMotivo"
        ).textContent =
            consulta.motivo;


        document.getElementById(
            "detalleDiagnostico"
        ).textContent =
            consulta.diagnostico;


        document.getElementById(
            "detalleObservaciones"
        ).textContent =
            consulta.observaciones ||
            "Sin observaciones.";

    }


    cargarPaciente();
    cargarConsultas();

});