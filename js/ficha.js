const parametros =
    new URLSearchParams(window.location.search);

const idPaciente =
    parametros.get("id_paciente");


// FORMATO DE FECHA
function formatearFecha(fecha) {

    if (!fecha) {
        return "-";
    }

    const fechaSolo =
        fecha.toString()
            .split("T")[0];

    const partes =
        fechaSolo.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// FORMATO DEL DNI
function formatearDni(dni) {

    if (!dni) {
        return "-";
    }

    dni =
        String(dni).replace(/\D/g, "");

    if (dni.length === 8) {

        return `${dni.substring(0, 2)}.${dni.substring(2, 5)}.${dni.substring(5)}`;
    }

    return dni;
}


// CARGAR FICHA
async function cargarFicha() {

    try {

        const respuesta =
            await fetch(
                `http://localhost:3000/pacientes/ficha/${idPaciente}`
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar la ficha."
            );
        }


        const datos =
            await respuesta.json();


        const paciente =
            datos.paciente;


        // DATOS PERSONALES

        const nombreCompleto =
            `${paciente.nombre} ${paciente.apellido}`;


        document.getElementById(
            "nombrePaciente"
        ).textContent =
            nombreCompleto;


        document.getElementById(
            "dniPaciente"
        ).textContent =
            `DNI: ${formatearDni(paciente.dni)}`;


        document.getElementById(
            "nombreCompleto"
        ).textContent =
            nombreCompleto;


        document.getElementById(
            "dni"
        ).textContent =
            formatearDni(paciente.dni);


        document.getElementById(
            "fechaNacimiento"
        ).textContent =
            formatearFecha(
                paciente.fecha_nacimiento
            );


        document.getElementById(
            "telefono"
        ).textContent =
            paciente.telefono || "-";


        document.getElementById(
            "correo"
        ).textContent =
            paciente.correo || "-";


        document.getElementById(
            "direccion"
        ).textContent =
            paciente.direccion || "-";


        document.getElementById(
            "ciudad"
        ).textContent =
            paciente.ciudad || "-";


        document.getElementById(
            "usuario"
        ).textContent =
            paciente.usuario || "-";



        // ÚLTIMA CONSULTA

        mostrarUltimaConsulta(
            datos.ultimaConsulta
        );



        // MÉDICO FRECUENTE

        mostrarMedicoFrecuente(
            datos.medicoFrecuente
        );



        // MEDICAMENTOS

        mostrarMedicamentos(
            datos.medicamentos
        );


    } catch (error) {

        console.error(
            "Error al cargar la ficha:",
            error
        );

        document.getElementById(
            "nombrePaciente"
        ).textContent =
            "No se pudo cargar la ficha.";
    }
}



// MOSTRAR ÚLTIMA CONSULTA
function mostrarUltimaConsulta(consulta) {

    const contenedor =
        document.getElementById(
            "ultimaConsulta"
        );


    if (!consulta) {

        contenedor.innerHTML = `
            <p>
                Este paciente todavía no tiene consultas registradas.
            </p>
        `;

        return;
    }


    const fecha =
        formatearFecha(
            consulta.fecha_consulta
        );


    contenedor.innerHTML = `

        <div class="resumen-dato">

            <strong>Fecha</strong>

            <span>
                ${fecha}
            </span>

        </div>


        <div class="resumen-dato">

            <strong>Especialidad</strong>

            <span>
                ${consulta.especialidad}
            </span>

        </div>


        <div class="resumen-dato">

            <strong>Médico</strong>

            <span>
                ${consulta.nombre_doctor}
                ${consulta.apellido_doctor}
            </span>

        </div>


        <div class="resumen-dato">

            <strong>Motivo</strong>

            <span>
                ${consulta.motivo}
            </span>

        </div>


        <div class="resumen-dato">

            <strong>Diagnóstico</strong>

            <span>
                ${consulta.diagnostico}
            </span>

        </div>

    `;
}

function mostrarMedicoFrecuente(medico) {

    const contenedor =
        document.getElementById(
            "medicoFrecuente"
        );


    if (!medico) {

        contenedor.innerHTML = `
            <p>
                Este paciente todavía no tiene consultas registradas.
            </p>
        `;

        return;
    }


    contenedor.innerHTML = `

        <div class="medico-frecuente">

            <div class="resumen-dato">

                <strong>
                    Nombre
                </strong>

                <span>
                    ${medico.nombre}
                    ${medico.apellido}
                </span>

            </div>


            <div class="resumen-dato">

                <strong>
                    Especialidad
                </strong>

                <span>
                    ${medico.especialidad}
                </span>

            </div>


            <div class="resumen-dato">

                <strong>
                    Consultas realizadas
                </strong>

                <span>
                    ${medico.cantidad_consultas}
                    consultas
                </span>

            </div>

        </div>

    `;
}

// MOSTRAR MEDICAMENTOS
function mostrarMedicamentos(medicamentos) {

    const contenedor =
        document.getElementById(
            "medicamentosActuales"
        );


    if (medicamentos.length === 0) {

        contenedor.innerHTML = `
            <p>
                Actualmente no tiene medicamentos registrados.
            </p>
        `;

        return;
    }


    contenedor.innerHTML = "";


    medicamentos.forEach(medicamento => {

        const elemento =
            document.createElement("div");

        elemento.className =
            "medicamento-ficha";


        let fechaFin = "Sin fecha de finalización";


        if (medicamento.fecha_fin) {

            fechaFin =
                `Hasta: ${formatearFecha(
                    medicamento.fecha_fin
                )}`;
        }


        elemento.innerHTML = `

            <div>

                <h3>
                    ${medicamento.medicamento}
                </h3>

                <p>
                    Frecuencia:
                    ${medicamento.frecuencia}
                </p>

            </div>


            <div>

                <span>
                    Desde:
                    ${formatearFecha(
                        medicamento.fecha_inicio
                    )}
                </span>

                <span>
                    ${fechaFin}
                </span>

            </div>

        `;


        contenedor.appendChild(
            elemento
        );
    });
}



// BOTÓN VOLVER
document.getElementById(
    "btnVolver"
).addEventListener(
    "click",
    function () {

        window.location.href =
            "pacientes.html";
    }
);



// BOTÓN HISTORIA CLÍNICA
document.getElementById(
    "btnHistoria"
).addEventListener(
    "click",
    function () {

        window.location.href =
            `historialClinico.html?id_paciente=${idPaciente}`;
    }
);



// CARGAR FICHA
if (idPaciente) {

    cargarFicha();

} else {

    document.getElementById(
        "nombrePaciente"
    ).textContent =
        "Paciente no indicado";
}