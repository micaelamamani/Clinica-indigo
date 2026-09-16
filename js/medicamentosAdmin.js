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

        mostrarMedicamentos(medicamentos);

    } catch (error) {

        console.error(
            "Error al cargar medicamentos:",
            error
        );

        tablaMedicamentos.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No se pudieron cargar los medicamentos.
                </td>
            </tr>
        `;
    }
}


// ================================
// MOSTRAR MEDICAMENTOS
// ================================

function mostrarMedicamentos(lista) {

    tablaMedicamentos.innerHTML = "";

    if (lista.length === 0) {

        tablaMedicamentos.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No se encontraron medicamentos.
                </td>
            </tr>
        `;

        return;
    }


    lista.forEach(medicamento => {

        const fila =
            document.createElement("tr");


        let fechaInicio = "-";
        let fechaFin = "-";


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


        fila.innerHTML = `

            <td>
                ${medicamento.nombre_paciente}
                ${medicamento.apellido_paciente}
            </td>

            <td>
                ${medicamento.medicamento}
            </td>

            <td>
                ${medicamento.frecuencia}
            </td>

            <td>
                ${fechaInicio}
            </td>

            <td>
                ${fechaFin}
            </td>

            <td>
                ${medicamento.motivo || "-"}
            </td>

        `;


        tablaMedicamentos.appendChild(fila);

    });

}


// ================================
// BUSCAR
// ================================

btnBuscar.addEventListener("click", function () {

    const paciente =
        buscarPaciente.value
            .toLowerCase()
            .trim();

    const medicamento =
        buscarMedicamento.value.toLowerCase().trim();
    const resultados =medicamentos.filter(item => {
            const nombrePaciente =`${item.nombre_paciente} ${item.apellido_paciente}`.toLowerCase();
            const nombreMedicamento =item.medicamento.toLowerCase();
            const coincidePaciente =nombrePaciente.includes(paciente);
            const coincideMedicamento =nombreMedicamento.includes(medicamento);
            return (coincidePaciente &&coincideMedicamento);
        });
    mostrarMedicamentos(resultados);
});
// ================================
// CARGAR AL ENTRAR
// ================================

cargarMedicamentos();