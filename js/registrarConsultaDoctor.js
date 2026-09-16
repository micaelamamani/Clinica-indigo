document.addEventListener("DOMContentLoaded", () => {

    const formulario =
        document.getElementById("consultaForm");

    const nombrePaciente =
        document.getElementById("nombrePaciente");

    const dniPaciente =
        document.getElementById("dniPaciente");

    const btnRecetar =
        document.getElementById("btnRecetar");
const btnFinalizar =
    document.getElementById("btnFinalizar");

    // =========================================
    // OBTENER ID DEL TURNO
    // =========================================

    const parametros =
        new URLSearchParams(window.location.search);

    const idTurno =
        parametros.get("id_turno");


    if (!idTurno) {

        alert("No se encontró el turno.");

        window.location.href =
            "turnosDoctor.html";

        return;
    }


    // =========================================
    // CARGAR DATOS DEL PACIENTE
    // =========================================

    fetch(
        `http://localhost:3000/consultas/turno/${idTurno}`
    )

        .then(respuesta => {

            if (!respuesta.ok) {

                throw new Error(
                    "No se pudieron obtener los datos del turno."
                );

            }

            return respuesta.json();

        })

        .then(turno => {

            nombrePaciente.textContent =
                `${turno.nombre_paciente} ${turno.apellido_paciente}`;

            dniPaciente.textContent =
                `DNI: ${turno.dni}`;

        })

        .catch(error => {

            console.error(
                "Error al cargar paciente:",
                error
            );

            alert(
                "No se pudieron cargar los datos del paciente."
            );

        });


    // =========================================
    // RECETAR MEDICAMENTO
    // =========================================

    btnRecetar.addEventListener("click", () => {

        const idConsulta =
            localStorage.getItem("idConsulta");

        const idPaciente =
            localStorage.getItem("idPacienteConsulta");


        if (!idConsulta || !idPaciente) {

            alert(
                "Primero registrá la consulta."
            );

            return;
        }


        window.location.href =
            `recetarMedicamentoDoctor.html?id_consulta=${idConsulta}&id_paciente=${idPaciente}&id_turno=${idTurno}`;

    });


    // =========================================
    // REGISTRAR CONSULTA
    // =========================================

    formulario.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();


            const motivo =
                document.getElementById("motivo")
                    .value
                    .trim();

            const diagnostico =
                document.getElementById("diagnostico")
                    .value
                    .trim();

            const observaciones =
                document.getElementById("observaciones")
                    .value
                    .trim();


            if (!motivo || !diagnostico) {

                alert(
                    "Completá el motivo y el diagnóstico."
                );

                return;
            }
            btnFinalizar.addEventListener("click", async () => {

    try {

        const respuesta = await fetch(
            `http://localhost:3000/turnos/${idTurno}/estado`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    estado: "Atendido"
                })
            }
        );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo marcar el turno como atendido."
            );

        }


        localStorage.removeItem("idConsulta");
        localStorage.removeItem("idPacienteConsulta");


        window.location.href =
            "turnosDoctor.html";

    }
    catch (error) {

        console.error(error);

        alert(
            "No se pudo finalizar la consulta."
        );

    }

});
            try {

                const respuesta = await fetch(
                    "http://localhost:3000/consultas/registrar",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            id_turno: idTurno,

                            motivo: motivo,

                            diagnostico: diagnostico,

                            observaciones: observaciones

                        })
                    }
                );
                const datos =await respuesta.json();
                if (!respuesta.ok) {
                    alert(datos.mensaje ||"No se pudo registrar la consulta.");
                    return;
                }
                localStorage.setItem("idConsulta",datos.id_consulta);
                localStorage.setItem("idPacienteConsulta",datos.id_paciente);
                alert("Consulta registrada correctamente.");
            }
            catch (error) {
                console.error("Error al registrar consulta:",error);
                alert("No se pudo conectar con el servidor.");
            }
        }
    );
});