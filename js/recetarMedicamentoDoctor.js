document.addEventListener("DOMContentLoaded", () => {

    const parametros = new URLSearchParams(
        window.location.search
    );

    const idConsulta = parametros.get("id_consulta");
    const idPaciente = parametros.get("id_paciente");
    const idTurno = parametros.get("id_turno");


    if (!idConsulta || !idPaciente || !idTurno) {

        alert("No se encontró la información necesaria.");

        window.location.href = "turnosDoctor.html";

        return;
    }


    const nombrePaciente =
        document.getElementById("nombrePaciente");

    const dniPaciente =
        document.getElementById("dniPaciente");

    const formulario =
        document.getElementById("medicamentoForm");


    // =========================================
    // CARGAR DATOS DEL PACIENTE
    // =========================================

    fetch(
        `http://localhost:3000/pacientes/${idPaciente}`
    )

        .then(respuesta => {

            if (!respuesta.ok) {
                throw new Error(
                    "No se pudo obtener el paciente."
                );
            }

            return respuesta.json();

        })

        .then(paciente => {

            nombrePaciente.textContent =
                `${paciente.nombre} ${paciente.apellido}`;

            dniPaciente.textContent =
                `DNI: ${paciente.dni}`;

        })

        .catch(error => {

            console.error(
                "Error al cargar paciente:",
                error
            );

        });


    // =========================================
    // REGISTRAR MEDICAMENTO
    // =========================================

    formulario.addEventListener("submit", async (evento) => {

        evento.preventDefault();


        const medicamento =
            document.getElementById("medicamento").value.trim();

        const frecuencia =
            document.getElementById("frecuencia").value.trim();

        const fechaInicio =
            document.getElementById("fechaInicio").value;

        const fechaFin =
            document.getElementById("fechaFin").value;

        const motivo =
            document.getElementById("motivo").value.trim();


        // =========================================
        // VALIDAR FECHAS
        // =========================================

        if (
            fechaFin &&
            fechaFin < fechaInicio
        ) {

            alert(
                "La fecha de finalización no puede ser anterior a la fecha de inicio."
            );

            return;
        }


        try {

            const respuesta = await fetch(
                "http://localhost:3000/medicamentos/registrar",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_consulta: idConsulta,
                        id_paciente: idPaciente,
                        medicamento: medicamento,
                        frecuencia: frecuencia,
                        fechaInicio: fechaInicio,
                        fechaFin: fechaFin || null, motivo: motivo || null
                    })
                }
            );
            const datos = await respuesta.json();
            if (!respuesta.ok) {
                alert(datos.mensaje || "No se pudo registrar el medicamento.");
                return;
            }
            alert("Medicamento recetado correctamente.");
            window.location.href = "turnosDoctor.html";

        }
        catch (error) {
            console.error("Error al registrar medicamento:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});