const express = require("express");
const router = express.Router();
const db = require("../bd");

// REGISTRAR DOCTOR
router.post("/", (req, res) => {

    const {
        nombre,
        apellido,
        genero,
        especialidad,
        matricula,
        telefono,
        correo,
        usuario,
        contrasenia
    } = req.body;

    if (
        !nombre ||
        !apellido ||
        !genero ||
        !especialidad ||
        !matricula ||
        !usuario ||
        !contrasenia
    ) {
        return res.status(400).json({
            mensaje: "Todos los campos obligatorios deben estar completos."
        });
    }

    const sql = `
        INSERT INTO Doctor
        (
            nombre,
            apellido,
            genero,
            especialidad,
            matricula,
            telefono,
            correo,
            usuario,
            contrasenia
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        nombre,
        apellido,
        genero,
        especialidad,
        matricula,
        telefono,
        correo,
        usuario,
        contrasenia
    ];

    db.query(sql, valores, (error, resultado) => {

        if (error) {

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    mensaje: "La matrícula o el usuario ya están registrados."
                });
            }

            console.error("Error al registrar médico:", error);

            return res.status(500).json({
                mensaje: "Error al registrar el médico."
            });
        }

        res.status(201).json({
            mensaje: "Médico registrado correctamente.",
            id_doctor: resultado.insertId
        });
    });
});


// OBTENER TODOS LOS DOCTORES
router.get("/", (req, res) => {

    const sql = `
        SELECT
            id_doctor,
            nombre,
            apellido,
            genero,
            especialidad,
            matricula,
            telefono,
            correo,
            usuario
        FROM Doctor
        ORDER BY apellido, nombre
    `;

    db.query(sql, (error, resultados) => {

        if (error) {
            console.error("Error al obtener doctores:", error);

            return res.status(500).json({
                mensaje: "Error al obtener los doctores."
            });
        }

        res.json(resultados);
    });
});


// FICHA COMPLETA DEL DOCTOR
router.get("/ficha/:id_doctor", (req, res) => {

    const id_doctor = req.params.id_doctor;

    const sql = `
        SELECT
            id_doctor,
            nombre,
            apellido,
            genero,
            especialidad,
            matricula,
            telefono,
            correo,
            usuario
        FROM Doctor
        WHERE id_doctor = ?
    `;

    db.query(sql, [id_doctor], (error, resultados) => {

        if (error) {
            console.error("Error al obtener la ficha del doctor:", error);

            return res.status(500).json({
                mensaje: "Error al obtener la ficha del doctor."
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: "Doctor no encontrado."
            });
        }

        res.json(resultados[0]);
    });
});


// OBTENER UN DOCTOR POR ID
router.get("/:id_doctor", (req, res) => {

    const id_doctor = req.params.id_doctor;

    const sql = `
        SELECT
            id_doctor,
            nombre,
            apellido,
            genero,
            especialidad,
            matricula,
            telefono,
            correo,
            usuario
        FROM Doctor
        WHERE id_doctor = ?
    `;

    db.query(sql, [id_doctor], (error, resultados) => {

        if (error) {
            console.error("Error al obtener doctor:", error);

            return res.status(500).json({
                mensaje: "Error al obtener el doctor."
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: "Doctor no encontrado."
            });
        }

        res.json(resultados[0]);
    });
});

module.exports = router;