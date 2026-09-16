const formulario = document.getElementById("doctorForm");

formulario.addEventListener("submit", async (event) => {

    // Evita que el formulario recargue la página
    event.preventDefault();

    // Obtener los datos del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const especialidad = document.getElementById("especialidad").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const contrasenia = document.getElementById("password").value;

    // Objeto que vamos a enviar al servidor
    const doctor = {
        nombre: nombre,
        apellido: apellido,
        especialidad: especialidad,
        matricula: matricula,
        usuario: usuario,
        contrasenia: contrasenia
    };

    try {

        const respuesta = await fetch("http://localhost:3000/doctores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(doctor)
        });

        const datos = await respuesta.json();

        // Si el servidor devuelve un error
        if (!respuesta.ok) {
            alert(datos.mensaje);
            return;
        }

        // Registro correcto
        alert("Médico registrado correctamente");

        // Limpiar formulario
        formulario.reset();

    } catch (error) {

        console.error("Error:", error);

        alert("No se pudo conectar con el servidor");
    }
});