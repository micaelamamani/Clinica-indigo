const formulario = document.getElementById("registroForm");
const mensajeRegistro = document.getElementById("mensajeRegistro");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Quitamos puntos, espacios y guiones del DNI
    const dni = document.getElementById("dni").value.replace(/[.\s-]/g, "");
    const telefono = document.getElementById("telefono").value.replace(/[\s-]/g, "");
    const datosPaciente = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        genero: document.getElementById("genero").value,
        dni: dni,
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        direccion: document.getElementById("direccion").value,
        ciudad: document.getElementById("ciudad").value,
        telefono: telefono,
        correo: document.getElementById("correo").value,
        usuario: document.getElementById("usuario").value,
        contrasenia: document.getElementById("contrasenia").value
    };

    try {
        const respuesta = await fetch("http://localhost:3000/pacientes/registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosPaciente)
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            mensajeRegistro.textContent = resultado.mensaje;
            mensajeRegistro.style.color = "red";
            return;
        }
        const parametros = new URLSearchParams(window.location.search);
        const vieneDelAdmin = parametros.get("admin");

        if (vieneDelAdmin === "true") {
            window.location.href = "pacientes.html";
        } else {
            localStorage.setItem("usuario", resultado.usuario);
            localStorage.setItem("nombrePaciente", resultado.nombre);

            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error:", error);
        mensajeRegistro.textContent = "No se pudo conectar con el servidor.";
        mensajeRegistro.style.color = "red";
    }
});
// Formato del DNI mientras se escribe
const campoDni = document.getElementById("dni");

campoDni.addEventListener("input", function () {
    let dni = campoDni.value.replace(/\D/g, "");

    if (dni.length > 8) {
        dni = dni.substring(0, 8);
    }

    if (dni.length > 5) {
        dni = dni.substring(0, 2) + "." + dni.substring(2, 5) + "." + dni.substring(5);
    } else if (dni.length > 2) {
        dni = dni.substring(0, 2) + "." + dni.substring(2);
    }
    campoDni.value = dni;
});
// Formato del teléfono mientras se escribe (espacio y guión "-")
const campoTelefono = document.getElementById("telefono");

campoTelefono.addEventListener("input", function () {
    let telefono = campoTelefono.value.replace(/\D/g, "");

    if (telefono.length > 10) {
        telefono = telefono.substring(0, 10);
    }

    if (telefono.length > 6) {
        telefono = telefono.substring(0, 2) + " " + telefono.substring(2, 6) + "-" + telefono.substring(6);
    } else if (telefono.length > 2) {
        telefono = telefono.substring(0, 2) + " " + telefono.substring(2);
    }
    campoTelefono.value = telefono;
});