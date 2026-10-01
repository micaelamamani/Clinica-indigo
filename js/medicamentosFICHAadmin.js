const parametros =
    new URLSearchParams(window.location.search);

const idPaciente =
    parametros.get("id_paciente");


const contenedorMedicamentos =
    document.getElementById(
        "contenedorMedicamentos"
    );


// ================================
// VERIFICAR PACIENTE
// ================================

if (!idPaciente) {

    contenedorMedicamentos.innerHTML = `
        <p>
            No se indicó ningún paciente.
        </p>
    `;

} else {

    cargarPaciente();

    cargarMedicamentos();

}


// ================================
// CARGAR DATOS DEL PACIENTE
// ================================

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


        document.getElementById(
            "dniPaciente"
        ).textContent =
            `DNI: ${paciente.dni}`;


        document.getElementById(
            "nombreCompleto"
        ).textContent =
            nombreCompleto;


        document.getElementById(
            "dni"
        ).textContent =
            paciente.dni;


        if (paciente.fecha_nacimiento) {

            const fecha =
                paciente.fecha_nacimiento
                    .toString()
                    .split("T")[0]
                    .split("-");


            document.getElementById(
                "fechaNacimiento"
            ).textContent =
                `${fecha[2]}/${fecha[1]}/${fecha[0]}`;

        }


        document.getElementById(
            "ciudad"
        ).textContent =
            paciente.ciudad || "-";


    } catch (error) {

        console.error(
            "Error al cargar paciente:",
            error
        );

    }

}


// ================================
// CARGAR MEDICAMENTOS
// ================================

async function cargarMedicamentos() {

    try {

        const respuesta = await fetch(
            `http://localhost:3000/medicamentos/paciente/${idPaciente}`
        );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los medicamentos."
            );

        }


        const resultados =
            await respuesta.json();


        // QUEDARNOS SOLO CON LOS QUE
        // REALMENTE TIENEN MEDICAMENTO

        const medicamentos =
            resultados.filter(
                medicamento =>
                    medicamento.id_medicamento &&
                    medicamento.medicamento
            );


        mostrarMedicamentos(medicamentos);


    } catch (error) {

        console.error(
            "Error al cargar medicamentos:",
            error
        );


        contenedorMedicamentos.innerHTML = `
            <p>
                No se pudieron cargar los medicamentos.
            </p>
        `;

    }

}


// ================================
// MOSTRAR MEDICAMENTOS
// ================================

function mostrarMedicamentos(medicamentos) {

    contenedorMedicamentos.innerHTML = "";


    if (medicamentos.length === 0) {

        contenedorMedicamentos.innerHTML = `
            <p>
                Este paciente no tiene medicamentos registrados.
            </p>
        `;

        return;

    }


    medicamentos.forEach(medicamento => {

        const tarjeta =
            document.createElement("div");


        tarjeta.className =
            "medicamento-card";


        let fechaInicio = "-";
        let fechaFin =
            "Sin fecha de finalización";


        if (medicamento.fecha_inicio) {

            const fecha =
                medicamento.fecha_inicio
                    .toString()
                    .split("T")[0]
                    .split("-");


            fechaInicio =
                `${fecha[2]}/${fecha[1]}/${fecha[0]}`;

        }


        if (medicamento.fecha_fin) {

            const fecha =
                medicamento.fecha_fin
                    .toString()
                    .split("T")[0]
                    .split("-");


            fechaFin =
                `${fecha[2]}/${fecha[1]}/${fecha[0]}`;

        }


        tarjeta.innerHTML = `

            <div class="medicamento-header">

                <h2>
                    ${medicamento.medicamento}
                </h2>

                <span>
                    ${medicamento.especialidad || "-"}
                </span>

            </div>


            <div class="medicamento-datos">

                <div class="dato-medicamento">

                    <span>
                        Frecuencia
                    </span>

                    <strong>
                        ${medicamento.frecuencia}
                    </strong>

                </div>


                <div class="dato-medicamento">

                    <span>
                        Médico
                    </span>

                    <strong>
                        ${medicamento.nombre_doctor || "-"}
                        ${medicamento.apellido_doctor || ""}
                    </strong>

                </div>


                <div class="dato-medicamento">

                    <span>
                        Fecha de inicio
                    </span>

                    <strong>
                        ${fechaInicio}
                    </strong>

                </div>


                <div class="dato-medicamento">

                    <span>
                        Fecha de finalización
                    </span>

                    <strong>
                        ${fechaFin}
                    </strong>

                </div>

            </div>


            <div class="medicamento-motivo">

                <span>
                    Motivo
                </span>

                <p>
                    ${medicamento.motivo_medicamento || "Sin motivo registrado."}
                </p>

            </div>

        `;


        contenedorMedicamentos.appendChild(
            tarjeta
        );

    });

}


// ================================
// VOLVER
// ================================

document.getElementById(
    "btnVolver"
).addEventListener(
    "click",
    function () {

        window.location.href =
            "medicamentos.html";

    }
);