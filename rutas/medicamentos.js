const express = require("express");
const router = express.Router();
const db = require("../bd");
router.get("/", (req, res) => {
    const sql = `
        SELECT
            m.id_medicamento,
            m.medicamento,
            m.frecuencia,
            m.fecha_inicio,
            m.fecha_fin,
            m.motivo,
            p.nombre AS nombre_paciente,
            p.apellido AS apellido_paciente
        FROM Medicamento m
        INNER JOIN Paciente p
            ON m.id_paciente = p.id_paciente
        ORDER BY m.fecha_inicio DESC
    `;
    db.query(sql, (error, resultados) => {
        if (error) {
            console.error("Error al obtener todos los medicamentos:",error);
            return res.status(500).json({mensaje:"Error al obtener los medicamentos."   });
        }
        res.json(resultados);
    });
});
// Obtener medicamentos de un paciente
router.get("/paciente/:id_paciente", (req, res) => {
    const id_paciente = req.params.id_paciente;
    const sql = `
        SELECT
            m.id_medicamento,
            m.medicamento,
            m.frecuencia,
            m.fecha_inicio,
            m.fecha_fin,
            m.motivo
        FROM Medicamento m
        WHERE m.id_paciente = ?
        ORDER BY m.fecha_inicio DESC
    `;
    db.query(sql, [id_paciente], (error, resultados) => {
        if (error) {
            console.error("Error al obtener medicamentos:", error);
            return res.status(500).json({mensaje: "Error al obtener los medicamentos."   });
        }
        res.json(resultados);
    });
});
router.post("/registrar", (req, res) => {
    const {
        id_consulta,
        id_paciente,
        medicamento,
        frecuencia,
        fechaInicio,
        fechaFin,
        motivo
    } = req.body;
    const sql = `
        INSERT INTO Medicamento
        (
            id_consulta,
            id_paciente,
            medicamento,
            frecuencia,
            fecha_inicio,
            fecha_fin,
            motivo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const valores = [
        id_consulta,
        id_paciente,
        medicamento,
        frecuencia,
        fechaInicio,
        fechaFin || null,
        motivo || null
    ];
    db.query(sql, valores, (error, resultado) => {
        if (error) {
            console.error("Error al registrar medicamento:",error);
            return res.status(500).json({mensaje: "Error al registrar el medicamento."});
        }
        res.status(201).json({
            mensaje: "Medicamento registrado correctamente.",
            id_medicamento: resultado.insertId
        });
    });
});

module.exports = router;