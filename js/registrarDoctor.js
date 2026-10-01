const formulario = document.getElementById("doctorForm");

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const nombre =
        document.getElementById("nombre").value.trim();

    const apellido =
        document.getElementById("apellido").value.trim();

    const genero =
        document.getElementById("genero").value;

    const especialidad =
        document.getElementById("especialidad").value.trim();

    const matricula =
        document.getElementById("matricula").value.trim();

    const usuario =
        document.getElementById("usuario").value.trim();

    const contrasenia =
        document.getElementById("password").value;

    const doctor = {
        nombre: nombre,
        apellido: apellido,
        genero: genero,
        especialidad: especialidad,
        matricula: matricula,
        usuario: usuario,
        contrasenia: contrasenia
    };

    try {

        const respuesta = await fetch(
            "http://localhost:3000/doctores",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(doctor)
            }
        );

        const datos =
            await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.mensaje);
            return;
        }

        alert(
            "Médico registrado correctamente"
        );

        formulario.reset();

    } catch (error) {
        console.error(
            "Error:",
            error
        );
        alert(
            "No se pudo conectar con el servidor"
        );
    }
});