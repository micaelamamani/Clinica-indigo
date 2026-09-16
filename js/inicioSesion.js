const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const contrasenia = document.getElementById("contrasenia").value;

    try {
        const respuesta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario,
                contrasenia: contrasenia
            })
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            alert(resultado.mensaje);
            return;
        }
        localStorage.setItem("usuario", resultado.usuario);
        localStorage.setItem("nombreUsuario", resultado.nombre);
        localStorage.setItem("rol", resultado.rol);

        if (resultado.rol === "admin") {
            window.location.href = "../Admin/inicioAdmin.html";
        } else if (resultado.rol === "doctor") {
            localStorage.setItem("idDoctor", resultado.id_doctor);
            localStorage.setItem("nombreDoctor", resultado.nombre);
            window.location.href = "../Doctor/inicioDoctor.html";
        } else if (resultado.rol === "paciente") {
            localStorage.setItem("idPaciente", resultado.id_paciente);
            localStorage.setItem("nombrePaciente", resultado.nombre);

            console.log("ID DEL PACIENTE GUARDADO:", resultado.id_paciente);

            window.location.href = "../Cliente/inicioPaciente.html";
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
    }
});