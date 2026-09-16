const express = require("express");
const router = express.Router();

const conexion = require("../bd");

// REGISTRAR DOCTOR
router.post("/", (req, res) => {

    const {
        nombre,
        apellido,
        especialidad,
        matricula,
        usuario,
        contrasenia
    } = req.body;
    if (
        !nombre ||
        !apellido ||
        !especialidad ||
        !matricula ||
        !usuario ||
        !contrasenia
    ) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        });
    }
    const sql = `
        INSERT INTO Doctor
        (nombre, apellido, especialidad, matricula, usuario, contrasenia)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    conexion.query(
        sql,
        [
            nombre,
            apellido,
            especialidad,
            matricula,
            usuario,
            contrasenia
        ],
        (error, resultado) => {
            if (error) {

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        mensaje: "La matrícula o el usuario ya están registrados"
                    });
                }

                console.error("Error al registrar médico:", error);

                return res.status(500).json({
                    mensaje: "Error al registrar el médico"
                });
            }
            res.status(201).json({
                mensaje: "Médico registrado correctamente",
                id_doctor: resultado.insertId
            });
        }
    );
});
module.exports = router;