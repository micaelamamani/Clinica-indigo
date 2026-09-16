const buscarApellido = document.getElementById("buscarApellido");
const buscarDni = document.getElementById("buscarDni");
const btnBuscarHistoria = document.getElementById("btnBuscarHistoria");

const nombrePaciente = document.getElementById("nombrePaciente");
const dniPaciente = document.getElementById("dniPaciente");

const ultimaConsulta = document.getElementById("ultimaConsulta");
const cantidadConsultas = document.getElementById("cantidadConsultas");
const tablaHistorial = document.getElementById("tablaHistorial");


btnBuscarHistoria.addEventListener("click", buscarHistoria);


async function buscarHistoria() {

    const apellido = buscarApellido.value.trim();
    const dni = buscarDni.value.trim();

    if (!apellido && !dni) {

        alert("Ingresá un apellido o un DNI.");

        return;
    }


    const idDoctor = localStorage.getItem("idDoctor");

    if (!idDoctor) {

        alert("No se encontró el doctor.");

        return;
    }


    try {

        const url =
            `http://localhost:3000/consultas/historial/${idDoctor}` +
            `?apellido=${encodeURIComponent(apellido)}` +
            `&dni=${encodeURIComponent(dni)}`;


        console.log("Buscando:", url);


        const respuesta = await fetch(url);


        const datos = await respuesta.json();


        console.log("Respuesta del servidor:", datos);


        if (!respuesta.ok) {

            alert(datos.mensaje || "No se encontró el paciente.");

            return;
        }


        mostrarPaciente(datos.paciente);

        mostrarConsultas(datos.consultas);

    } catch (error) {

        console.error("Error:", error);

        alert("No se pudo conectar con el servidor.");
    }
}



function mostrarPaciente(paciente) {

    nombrePaciente.textContent =
        `${paciente.nombre} ${paciente.apellido}`;

    dniPaciente.textContent =
        `DNI: ${paciente.dni}`;
}



function mostrarConsultas(consultas) {

    cantidadConsultas.textContent = consultas.length;


    if (consultas.length === 0) {

        ultimaConsulta.textContent = "-";

        tablaHistorial.innerHTML = `
            <tr>
                <td colspan="4">
                    Este paciente todavía no tiene consultas registradas.
                </td>
            </tr>
        `;

        return;
    }


    const fecha = new Date(
        consultas[0].fecha_consulta
    );


    ultimaConsulta.textContent =
        fecha.toLocaleDateString("es-AR");


    tablaHistorial.innerHTML = "";


    consultas.forEach(consulta => {

        const fechaConsulta = new Date(
            consulta.fecha_consulta
        );


        const fila = document.createElement("tr");


        fila.innerHTML = `
            <td>
                ${fechaConsulta.toLocaleDateString("es-AR")}
            </td>

            <td>
                ${consulta.motivo}
            </td>

            <td>
                ${consulta.diagnostico}
            </td>

            <td>
                ${consulta.observaciones || "Sin observaciones"}
            </td>
        `;


        tablaHistorial.appendChild(fila);

    });
}