const usuario = localStorage.getItem("usuario");
const nombreAdmin = localStorage.getItem("nombreUsuario");

const elementoUsuario = document.getElementById("user");
const elementoNombre = document.getElementById("nombreAdmin");

if (usuario && elementoUsuario) {
    elementoUsuario.textContent = usuario;
}

if (nombreAdmin && elementoNombre) {
    elementoNombre.textContent = nombreAdmin;
}


// CANTIDAD DE PACIENTES
async function cargarCantidadPacientes() {
    try {
        const respuesta = await fetch(
            "http://localhost:3000/pacientes/cantidad"
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo obtener la cantidad de pacientes."
            );
        }

        const datos = await respuesta.json();

        const cantidadPacientes =
            document.getElementById("cantidadPacientes");

        cantidadPacientes.textContent = datos.cantidad;

    } catch (error) {
        console.error(
            "Error al obtener cantidad de pacientes:",
            error
        );
    }
}


// CANTIDAD DE TURNOS PARA HOY
async function cargarCantidadTurnosHoy() {
    try {
        const respuesta = await fetch("http://localhost:3000/turnos/hoy");
        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la cantidad de turnos."   );
        }
        const datos = await respuesta.json();
        const cantidadTurnos =document.getElementById("cantidadTurnosHoy");
        cantidadTurnos.textContent = datos.cantidad;
    } catch (error) {
        console.error("Error al obtener cantidad de turnos:",error);
    }
}
// CANTIDAD DE CONSULTAS REALIZADAS HOY
async function cargarCantidadConsultasHoy() {
    try {
        const respuesta = await fetch("http://localhost:3000/consultas/hoy");
        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la cantidad de consultas.");
        }
        const datos = await respuesta.json();
        const cantidadConsultas=document.getElementById("cantidadConsultasHoy");
        cantidadConsultas.textContent = datos.cantidad;
    } catch (error) {
        console.error("Error al obtener cantidad de consultas:",error);
    }
}
// CARGAR DATOS
cargarCantidadPacientes();
cargarCantidadTurnosHoy();
cargarCantidadConsultasHoy();
// ========================================
// ÚLTIMAS CONSULTAS
// ========================================

const ultimasConsultas =
    document.getElementById("ultimasConsultas");

async function cargarUltimasConsultas() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/consultas/ultimas"
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron obtener las consultas."
            );
        }

        const consultas = await respuesta.json();

        ultimasConsultas.innerHTML = "";

        if (consultas.length === 0) {

            ultimasConsultas.innerHTML = `
                <p class="sin-consultas">
                    No hay consultas registradas.
                </p>
            `;

            return;
        }

        consultas.forEach(function (consulta) {

            const fila =
                document.createElement("div");

            fila.classList.add("consulta-reciente");

            const fecha =
                new Date(consulta.fecha_consulta);

            const hoy =
                new Date();

            const esHoy =
                fecha.toDateString() === hoy.toDateString();

            let fechaTexto;

            if (esHoy) {

                fechaTexto = "Hoy";

            } else {

                const dia =
                    String(fecha.getDate()).padStart(2, "0");

                const mes =
                    String(fecha.getMonth() + 1).padStart(2, "0");

                fechaTexto =
                    dia + "/" + mes;
            }

            const hora =
                String(fecha.getHours()).padStart(2, "0") +
                ":" +
                String(fecha.getMinutes()).padStart(2, "0");

            fila.innerHTML = `
                <span class="nombre-consulta">
                    ${consulta.nombre}
                    ${consulta.apellido}
                </span>

                <span class="fecha-consulta">
                    ${fechaTexto} ${hora}
                </span>
            `;

            ultimasConsultas.appendChild(fila);

        });

    } catch (error) {

        console.error(
            "Error al cargar últimas consultas:",
            error
        );

        ultimasConsultas.innerHTML = `
            <p class="sin-consultas">
                No se pudieron cargar las consultas.
            </p>
        `;
    }
}

cargarUltimasConsultas();