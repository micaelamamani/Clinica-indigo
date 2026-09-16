document.addEventListener("DOMContentLoaded", () => {
    const idPaciente = localStorage.getItem("idPaciente");
    if (!idPaciente) {
        alert("No se pudo identificar al paciente.");
        window.location.href = "inicioSesion.html";
        return;
    }
    const tablaMedicamentos =document.getElementById("tablaMedicamentos");
    const cantidadMedicamentos =document.getElementById("cantidadMedicamentos");
    const tratamientosActivos =document.getElementById("tratamientosActivos");
    const tratamientosFinalizados =document.getElementById("tratamientosFinalizados");
    async function cargarMedicamentos() {
        try {
            const respuesta = await fetch(`http://localhost:3000/medicamentos/paciente/${idPaciente}`);
            if (!respuesta.ok) {
                throw new Error("No se pudieron obtener los medicamentos.");
            }
            const medicamentos =await respuesta.json();
            mostrarMedicamentos(medicamentos);
        } catch (error) {
            console.error(  "Error al cargar medicamentos:",error);
            tablaMedicamentos.innerHTML = `
                <tr>
                    <td colspan="6">
                        No se pudieron cargar los medicamentos.
                    </td>
                </tr>
            `;
        }
    }
    function mostrarMedicamentos(medicamentos) {
        tablaMedicamentos.innerHTML = "";
        cantidadMedicamentos.textContent =medicamentos.length;
        let activos = 0;
        let finalizados = 0;
        medicamentos.forEach(medicamento => {
            // Si no tiene fecha de fin,
            // se considera activo
            let estado;
            if (!medicamento.fecha_fin) {
                estado = "Activo";
            } else {
                const fechaFin=new Date(medicamento.fecha_fin);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                fechaFin.setHours(0, 0, 0, 0);
                if (fechaFin >= hoy) {
                    estado = "Activo";
                } else {
                    estado = "Finalizado";
                }
            }
            if (estado === "Activo") {
                activos++;
            } else {
                finalizados++;
            }
            const fila=document.createElement("tr");
            fila.innerHTML = `
                <td>
                    <div class="medicamento-nombre">
                        <div class="medicamento-icon">
                            <i data-lucide="pill"></i>
                        </div>
                        <strong>
                            ${medicamento.medicamento}
                        </strong>
                    </div>
                </td>
                <td>
                    ${medicamento.frecuencia}
                </td>
                <td>
                    ${formatearFecha(medicamento.fecha_inicio)}
                </td>
                <td>
                    ${formatearFecha(medicamento.fecha_fin)}
                </td>
                <td>
                    ${medicamento.motivo || "-"}
                </td>
                <td>
                    <span class="estado ${estado === "Activo"
                        ? "activo"
                        : "finalizado"}">
                        ${estado}
                    </span>
                </td>
            `;
            tablaMedicamentos.appendChild(fila);
        });
        tratamientosActivos.textContent =
            activos;
        tratamientosFinalizados.textContent=finalizados;
        if (medicamentos.length === 0) {
            tablaMedicamentos.innerHTML = `
                <tr>
                    <td colspan="6">
                        No tenés medicamentos registrados.
                    </td>
                </tr>
            `;
        }
        lucide.createIcons();
    }
    function formatearFecha(fecha) {
        if (!fecha) {
            return "-";
        }
        const partes = fecha.toString().split("T")[0].split("-");
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    cargarMedicamentos();
});