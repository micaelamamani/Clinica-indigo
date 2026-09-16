document.addEventListener("DOMContentLoaded", () => {
    const idDoctor = localStorage.getItem("idDoctor");
    if (!idDoctor) {
        alert("No se encontró la sesión del doctor.");
        window.location.href = "../inicioSesion.html";
        return;
    }
    const tabla = document.getElementById("tablaTurnos");
    let turnos = [];
    let filtroActual = "Todos";
    function cargarTurnos() {

        fetch(`http://localhost:3000/turnos/doctor/${idDoctor}`)
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error("Error al obtener los turnos");
                }
                return respuesta.json();
            })
            .then(datos => {
                turnos = datos;
                mostrarTurnos();
            })
            .catch(error => {
                console.error(error);

                tabla.innerHTML = `
                    <tr>
                        <td colspan="6">
                            No se pudieron cargar los turnos.
                        </td>
                    </tr>
                `;

            });
    }


    // =========================================
    // MOSTRAR TURNOS
    // =========================================

    function mostrarTurnos() {

        tabla.innerHTML = "";

        let turnosFiltrados = turnos;


        if (filtroActual !== "Todos") {

            turnosFiltrados = turnos.filter(
                turno => turno.estado === filtroActual
            );

        }


        if (turnosFiltrados.length === 0) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="6" class="sin-turnos">
                        No hay turnos en esta categoría.
                    </td>
                </tr>
            `;

            return;
        }


        turnosFiltrados.forEach(turno => {

            const fila = document.createElement("tr");

            const fecha = new Date(turno.fecha);

            const fechaFormateada =
                fecha.toLocaleDateString("es-AR");


            fila.innerHTML = `

                <td>
                    ${fechaFormateada}
                </td>

                <td>
                    ${turno.hora}
                </td>

                <td>
                    ${turno.nombre_paciente}
                    ${turno.apellido_paciente}
                </td>

                <td>
                    ${turno.dni}
                </td>

                <td>
                    <span class="estado ${obtenerClaseEstado(turno.estado)}">
                        ${turno.estado}
                    </span>
                </td>

                <td>
                    ${crearOpciones(turno)}
                </td>

            `;

            tabla.appendChild(fila);

        });


        lucide.createIcons();

        activarMenus();
    }


    // =========================================
    // COLOR DEL ESTADO
    // =========================================

    function obtenerClaseEstado(estado) {

        switch (estado) {

            case "Pendiente":
                return "pendiente";

            case "Confirmado":
                return "confirmado";

            case "Rechazado":
                return "cancelado";

            case "Atendido":
                return "realizado";

            default:
                return "";

        }
    }


    // =========================================
    // CREAR MENÚ DE OPCIONES
    function crearOpciones(turno) {

        let opciones = "";

        // PENDIENTE
        if (turno.estado === "Pendiente") {

            opciones = `

            <button
                class="confirmar"
                onclick="cambiarEstado(${turno.id_turno}, 'Confirmado')">

                <i data-lucide="check"></i>
                Confirmar turno

            </button>

            <button
                class="rechazar"
                onclick="cambiarEstado(${turno.id_turno}, 'Cancelado')">

                <i data-lucide="x"></i>
                Cancelar turno

            </button>

        `;
        }

        // CONFIRMADO
        else if (turno.estado === "Confirmado") {

            opciones = `

            <button
                class="atender"
                onclick="registrarConsulta(${turno.id_turno})">

                <i data-lucide="check-check"></i>
                Marcar atendido

            </button>

            <button
                class="cancelar"
                onclick="cambiarEstado(${turno.id_turno}, 'Cancelado')">

                <i data-lucide="x"></i>
                Cancelar turno

            </button>

        `;
        }

        // CANCELADO
        else if (turno.estado === "Cancelado") {

            opciones = `

            <button
                onclick="cambiarEstado(${turno.id_turno}, 'Pendiente')">

                <i data-lucide="rotate-ccw"></i>
                Reactivar turno

            </button>

        `;
        }

        // ATENDIDO
        else if (turno.estado === "Atendido") {

            opciones = `

            <button disabled>

                <i data-lucide="check-check"></i>
                Turno atendido

            </button>

        `;
        }

        return `

        <div class="opciones-turno">

            <button class="btn-opciones">

                <i data-lucide="more-vertical"></i>

            </button>

            <div class="menu-opciones">

                ${opciones}

            </div>

        </div>

    `;
    }
    window.registrarConsulta = function (idTurno) {
    window.location.href = `../Doctor/registrarConsultaDoctor.html?id_turno=${idTurno}`;
};
    // =========================================
    // ABRIR MENÚ DE LOS TRES PUNTITOS
    // =========================================

    function activarMenus() {

        const botones =
            document.querySelectorAll(".btn-opciones");


        botones.forEach(boton => {

            boton.addEventListener("click", evento => {

                evento.stopPropagation();

                const contenedor =
                    boton.closest(".opciones-turno");


                document
                    .querySelectorAll(".opciones-turno.abierto")
                    .forEach(menu => {

                        if (menu !== contenedor) {
                            menu.classList.remove("abierto");
                        }

                    });


                contenedor.classList.toggle("abierto");

            });

        });
    }


    // =========================================
    // CERRAR MENÚ AL HACER CLICK AFUERA
    // =========================================

    document.addEventListener("click", () => {

        document
            .querySelectorAll(".opciones-turno.abierto")
            .forEach(menu => {

                menu.classList.remove("abierto");

            });

    });


    // =========================================
    // FILTROS
    // =========================================

    document
        .querySelectorAll(".filtro")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                document
                    .querySelectorAll(".filtro")
                    .forEach(btn =>
                        btn.classList.remove("activo")
                    );


                boton.classList.add("activo");


                filtroActual =
                    boton.dataset.filtro;


                mostrarTurnos();

            });

        });


    // =========================================
    // CAMBIAR ESTADO
    // =========================================

    window.cambiarEstado = function (idTurno, nuevoEstado) {

        fetch(
            `http://localhost:3000/turnos/${idTurno}/estado`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    estado: nuevoEstado
                })
            }
        )

            .then(respuesta => {

                if (!respuesta.ok) {
                    throw new Error(
                        "No se pudo cambiar el estado"
                    );
                }

                return respuesta.json();

            })

            .then(() => {

                const turno =
                    turnos.find(
                        t => t.id_turno === idTurno
                    );


                if (turno) {
                    turno.estado = nuevoEstado;
                }
                mostrarTurnos();
            })
            .catch(error => {
                console.error(error);
                alert("No se pudo actualizar el estado del turno.");
            });
    };
    cargarTurnos();
});