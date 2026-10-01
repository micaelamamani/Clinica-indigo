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
            p.id_paciente, 
            p.nombre AS nombre_paciente, 
            p.apellido AS apellido_paciente, 
            p.dni 
        FROM Medicamento m 
        INNER JOIN Paciente p 
            ON m.id_paciente = p.id_paciente 
        ORDER BY m.fecha_inicio DESC
    `;

    db.query(sql, (error, resultados) => {

        if (error) {

            console.error(
                "Error al obtener todos los medicamentos:",
                error
            );

            return res.status(500).json({
                mensaje: "Error al obtener los medicamentos."
            });
        }

        res.json(resultados);

    });

});


// Obtener medicamentos de un paciente
router.get("/paciente/:id_paciente", (req, res) => {

    const id_paciente = req.params.id_paciente;

    const sql = `
        SELECT 
            c.id_consulta,
            c.fecha_consulta,
            c.motivo,
            c.diagnostico,
            c.observaciones,

            d.nombre AS nombre_doctor,
            d.apellido AS apellido_doctor,
            d.genero AS genero_doctor,
            d.especialidad,

            m.id_medicamento,
            m.medicamento,
            m.frecuencia,
            m.fecha_inicio,
            m.fecha_fin,
            m.motivo AS motivo_medicamento

        FROM Consulta c

        INNER JOIN Turno t
            ON c.id_turno = t.id_turno

        INNER JOIN Doctor d
            ON t.id_doctor = d.id_doctor

        INNER JOIN Medicamento m
            ON m.id_consulta = c.id_consulta

        WHERE t.id_paciente = ?

        ORDER BY c.fecha_consulta DESC
    `;

    db.query(
        sql,
        [id_paciente],
        (error, resultados) => {

            if (error) {

                console.error(
                    "Error al obtener historia clínica:",
                    error
                );

                return res.status(500).json({
                    mensaje: "Error al obtener la historia clínica."
                });
            }

            res.json(resultados);
        }
    );
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

            console.error(
                "Error al registrar medicamento:",
                error
            );

            return res.status(500).json({
                mensaje: "Error al registrar el medicamento."
            });
        }

        res.status(201).json({
            mensaje: "Medicamento registrado correctamente.",
            id_medicamento: resultado.insertId
        });

    });

});

module.exports = router;