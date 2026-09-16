const express = require("express");
const router = express.Router();
const db = require("../bd");
//registrar
router.post("/registrar", (req, res) => {
    const {
        nombre,
        apellido,
        dni,
        fechaNacimiento,
        direccion,
        ciudad,
        usuario,
        contrasenia
    } = req.body;
    const sql = `
        INSERT INTO Paciente
        (
            nombre,
            apellido,
            dni,
            fecha_nacimiento,
            direccion,
            ciudad,
            usuario,
            contrasenia
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const valores = [
        nombre,
        apellido,
        dni,
        fechaNacimiento,
        direccion,
        ciudad,
        usuario,
        contrasenia
    ];
    db.query(sql, valores, (error, resultado) => {
        if (error) {
            console.error(error);
            // DNI o usuario repetido
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ mensaje: "El DNI o el usuario ya están registrados." });
            }
            return res.status(500).json({ mensaje: "Error al registrar el paciente." });
        }
        res.status(201).json({ mensaje: "Paciente registrado correctamente.", usuario: usuario, nombre: nombre });
    });
});
//obtener datos
router.get("/", (req, res) => {
    const sql = `
        SELECT
            id_paciente,
            nombre,
            apellido,
            dni,
            fecha_nacimiento,
            direccion,
            ciudad,
            usuario
        FROM Paciente
        ORDER BY id_paciente DESC
    `;
    db.query(sql, (error, resultados) => {
        if (error) {
            console.error("Error al obtener pacientes:", error);
            return res.status(500).json({ mensaje: "Error al obtener los pacientes." });
        }
        res.json(resultados);
    });
});
//cantidad
router.get("/cantidad", (req, res) => {
    const sql = `
        SELECT COUNT(*) AS cantidad
        FROM Paciente
    `;
    db.query(sql, (error, resultado) => {
        if (error) {
            console.error("Error al contar pacientes:", error);
            return res.status(500).json({ mensaje: "Error al contar pacientes." });
        }
        res.json({ cantidad: resultado[0].cantidad });
    });
});
// Pacientes que pertenecen a un doctor
router.get("/doctor/:id_doctor", (req, res) => {
    const id_doctor = req.params.id_doctor;
    const sql = `
        SELECT
            p.id_paciente,
            p.nombre,
            p.apellido,
            p.dni,
            MAX(c.fecha_consulta) AS ultima_consulta

        FROM Paciente p

        INNER JOIN Turno t
            ON p.id_paciente = t.id_paciente

        LEFT JOIN Consulta c
            ON c.id_turno = t.id_turno

        WHERE t.id_doctor = ?

        GROUP BY
            p.id_paciente,
            p.nombre,
            p.apellido,
            p.dni

        ORDER BY
            p.apellido,
            p.nombre
    `;
    db.query(sql, [id_doctor], (error, resultados) => {
        if (error) {
            console.error("Error al obtener pacientes del doctor:",error);
            return res.status(500).json({mensaje: "Error al obtener los pacientes."   });
        }
        res.json(resultados);
    });
});
router.get("/:id_paciente", (req, res) => {

    const id_paciente = req.params.id_paciente;

    const sql = `
        SELECT
            id_paciente,
            nombre,
            apellido,
            dni,
            fecha_nacimiento,
            direccion,
            ciudad,
            usuario
        FROM Paciente
        WHERE id_paciente = ?
    `;

    db.query(sql, [id_paciente], (error, resultados) => {
        if (error) {
            console.error("Error al obtener paciente:", error);
            return res.status(500).json({ mensaje: "Error al obtener el paciente." });
        }
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: "Paciente no encontrado." });
        }
        res.json(resultados[0]);
    });
});
module.exports = router;