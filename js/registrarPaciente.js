const formulario = document.getElementById("registroForm");
formulario.addEventListener("submit", async function (event) {
    event.preventDefault();
    const datosPaciente = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        dni: document.getElementById("dni").value,
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        direccion: document.getElementById("direccion").value,
        ciudad: document.getElementById("ciudad").value,
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
            //alert(resultado.mensaje);
            mensajeRegistro.textContent = resultado.mensaje;
            mensajeRegistro.style.color = "red";
            return;
        }
        // Guardamos los datos necesarios para mostrar el usuario
        localStorage.setItem("usuario", resultado.usuario);
        localStorage.setItem("nombrePaciente", resultado.nombre);

       // alert("¡Registro exitoso!");

        window.location.href = "index.html";

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
    }
});