const tablaMedicamentos =
    document.getElementById("tablaMedicamentos");

const buscarPaciente =
    document.getElementById("buscarPaciente");

const buscarMedicamento =
    document.getElementById("buscarMedicamento");

const btnBuscar =
    document.getElementById("btnBuscar");

let medicamentos = [];


// ================================
// CARGAR MEDICAMENTOS
// ================================

async function cargarMedicamentos() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/medicamentos"
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron obtener los medicamentos."
            );
        }

        medicamentos = await respuesta.json();

        crearOpcionesPaciente();
        crearOpcionesMedicamento();

        mostrarMedicamentos(medicamentos);

    } catch (error) {

        console.error(
            "Error al cargar medicamentos:",
            error
        );

        tablaMedicamentos.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    No se pudieron cargar los medicamentos.
                </td>
            </tr>
        `;
    }
}


// ================================
// OPCIONES DE PACIENTES
// ================================

function crearOpcionesPaciente() {

    let datalist =
        document.getElementById("opcionesPacientes");


    if (!datalist) {

        datalist =
            document.createElement("datalist");

        datalist.id =
            "opcionesPacientes";

        document.body.appendChild(datalist);
    }


    datalist.innerHTML = "";


    const pacientes = [];


    medicamentos.forEach(item => {

        const nombre =
            `${item.nombre_paciente} ${item.apellido_paciente}`;


        if (!pacientes.includes(nombre)) {

            pacientes.push(nombre);

        }

    });


    pacientes.sort();


    pacientes.forEach(nombre => {

        const opcion =
            document.createElement("option");

        opcion.value = nombre;

        datalist.appendChild(opcion);

    });


    buscarPaciente.setAttribute(
        "list",
        "opcionesPacientes"
    );
}


// ================================
// OPCIONES DE MEDICAMENTOS
// ================================

function crearOpcionesMedicamento() {

    let datalist =
        document.getElementById("opcionesMedicamentos");


    if (!datalist) {

        datalist =
            document.createElement("datalist");

        datalist.id =
            "opcionesMedicamentos";

        document.body.appendChild(datalist);
    }


    datalist.innerHTML = "";


    const medicamentosDisponibles = [];


    medicamentos.forEach(item => {

        if (
            !medicamentosDisponibles.includes(
                item.medicamento
            )
        ) {

            medicamentosDisponibles.push(
                item.medicamento
            );

        }

    });


    medicamentosDisponibles.sort();


    medicamentosDisponibles.forEach(nombre => {

        const opcion =
            document.createElement("option");

        opcion.value = nombre;

        datalist.appendChild(opcion);

    });


    buscarMedicamento.setAttribute(
        "list",
        "opcionesMedicamentos"
    );
}


// ================================
// MOSTRAR PACIENTES
// ================================

function mostrarMedicamentos(lista) {

    tablaMedicamentos.innerHTML = "";


    if (lista.length === 0) {

        tablaMedicamentos.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    No se encontraron medicamentos.
                </td>
            </tr>
        `;

        return;
    }


    // AGRUPAR MEDICAMENTOS POR PACIENTE

    const pacientes = [];


    lista.forEach(medicamento => {

        const pacienteExistente =
            pacientes.find(
                paciente =>
                    paciente.id_paciente ===
                    medicamento.id_paciente
            );


        if (pacienteExistente) {

            pacienteExistente.cantidad++;

        } else {

            pacientes.push({

                id_paciente:
                    medicamento.id_paciente,

                nombre:
                    medicamento.nombre_paciente,

                apellido:
                    medicamento.apellido_paciente,

                dni:
                    medicamento.dni,

                cantidad: 1

            });

        }

    });


    // MOSTRAR UNA FILA POR PACIENTE

    pacientes.forEach(paciente => {

        const fila =
            document.createElement("tr");


        fila.innerHTML = `

            <td>
                ${paciente.nombre}
                ${paciente.apellido}
            </td>

            <td>
                ${paciente.dni || "-"}
            </td>

            <td>
                ${paciente.cantidad}
            </td>

            <td>

                <button
                    class="btn-tabla"
                    onclick="verMedicamentos(${paciente.id_paciente})"
                >
                    Ver medicamentos
                </button>

            </td>

        `;


        tablaMedicamentos.appendChild(fila);

    });

}


// ================================
// BUSCAR
// ================================

function buscarMedicamentos() {

    const paciente =
        buscarPaciente.value
            .toLowerCase()
            .trim();


    const medicamento =
        buscarMedicamento.value
            .toLowerCase()
            .trim();


    const resultados =
        medicamentos.filter(item => {

            const nombrePaciente =
                `${item.nombre_paciente} ${item.apellido_paciente}`
                    .toLowerCase();


            const nombreMedicamento =
                item.medicamento
                    .toLowerCase();


            const coincidePaciente =
                nombrePaciente.includes(
                    paciente
                );


            const coincideMedicamento =
                nombreMedicamento.includes(
                    medicamento
                );


            return (
                coincidePaciente &&
                coincideMedicamento
            );

        });


    mostrarMedicamentos(resultados);
}


// ================================
// BUSCAR MIENTRAS ESCRIBE
// ================================

buscarPaciente.addEventListener(
    "input",
    buscarMedicamentos
);


buscarMedicamento.addEventListener(
    "input",
    buscarMedicamentos
);


// ================================
// BOTÓN BUSCAR
// ================================

btnBuscar.addEventListener(
    "click",
    buscarMedicamentos
);


// ================================
// VER MEDICAMENTOS DEL PACIENTE
// ================================

function verMedicamentos(idPaciente) {

    window.location.href =
        `medicamentosPaciente.html?id_paciente=${idPaciente}`;

}


// ================================
// CARGAR AL ENTRAR
// ================================

cargarMedicamentos();