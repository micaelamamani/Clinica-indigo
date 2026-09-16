const express = require("express");
const router = express.Router();
const db = require("../bd");

router.post("/", (req, res) => {

    const { usuario, contrasenia } = req.body;

    // Primero buscamos en Administrador
    const sqlAdmin = `
        SELECT id_admin, nombre, apellido, usuario
        FROM Administrador
        WHERE usuario = ? AND contrasenia = ?
    `;

    db.query(sqlAdmin, [usuario, contrasenia], (error, resultadosAdmin) => {

        if (error) {
            console.error(error);
            return res.status(500).json({
                mensaje: "Error al iniciar sesión."
            });
        }

        if (resultadosAdmin.length > 0) {

            const admin = resultadosAdmin[0];

            return res.status(200).json({
                mensaje: "Inicio de sesión exitoso.",
                rol: "admin",
                usuario: admin.usuario,
                nombre: admin.nombre
            });
        }

        // Si no es administrador, buscamos en Doctor
        const sqlDoctor = `
            SELECT id_doctor, nombre, apellido, usuario
            FROM Doctor
            WHERE usuario = ? AND contrasenia = ?
        `;

        db.query(sqlDoctor, [usuario, contrasenia], (error, resultadosDoctor) => {

            if (error) {
                console.error(error);
                return res.status(500).json({
                    mensaje: "Error al iniciar sesión."
                });
            }

            if (resultadosDoctor.length > 0) {

                const doctor = resultadosDoctor[0];
                return res.status(200).json({
                    mensaje: "Inicio de sesión exitoso.",
                    rol: "doctor",
                    id_doctor: doctor.id_doctor,
                    usuario: doctor.usuario,
                    nombre: doctor.nombre
                });
            }

            // Si tampoco es doctor, buscamos en Paciente
            const sqlPaciente = `
                SELECT id_paciente, nombre, apellido, usuario
                FROM Paciente
                WHERE usuario = ? AND contrasenia = ?
            `;

            db.query(sqlPaciente, [usuario, contrasenia], (error, resultadosPaciente) => {

                if (error) {
                    console.error(error);
                    return res.status(500).json({
                        mensaje: "Error al iniciar sesión."
                    });
                }

                if (resultadosPaciente.length > 0) {
                    const paciente = resultadosPaciente[0];
                    
                    return res.status(200).json({
                        mensaje: "Inicio de sesión exitoso.",
                        rol: "paciente",
                        id_paciente: paciente.id_paciente,
                        usuario: paciente.usuario,
                        nombre: paciente.nombre
                    });
                }

                // No se encontró en ninguna tabla
                return res.status(401).json({
                    mensaje: "Usuario o contraseña incorrectos."
                });
            });
        });
    });
});

module.exports = router;