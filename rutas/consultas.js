const express = require("express");
const router = express.Router();
const db = require("../bd");

router.get("/hoy", (req, res) => {
    const sql = `
        SELECT COUNT(*) AS cantidad
        FROM Consulta
        WHERE DATE(fecha_consulta) = CURDATE()
    `;
    db.query(sql, (error, resultado) => {
        if (error) {
            console.error("Error al contar consultas:", error);
            return res.status(500).json({mensaje: "Error al obtener las consultas."});
        }
        res.json({cantidad: resultado[0].cantidad});
    });
});
router.get("/ultimas", (req, res) => {

    const sql = `
        SELECT
            p.nombre,
            p.apellido,
            c.fecha_consulta
        FROM Consulta c

        INNER JOIN Turno t
            ON c.id_turno = t.id_turno

        INNER JOIN Paciente p
            ON t.id_paciente = p.id_paciente

        ORDER BY c.fecha_consulta DESC

        LIMIT 4
    `;
    db.query(sql, (error, resultados) => {
        if (error) {
            console.error("Error al obtener últimas consultas:",error);
            return res.status(500).json({mensaje: "Error al obtener las últimas consultas."});
        }
        res.json(resultados);
    });
});
// Obtener historia clínica de un paciente
router.get("/historial/:id_doctor", (req, res) => {

    const id_doctor = req.params.id_doctor;
    const apellido = req.query.apellido || "";
    const dni = req.query.dni || "";

    let sql = `
        SELECT DISTINCT
            p.id_paciente,
            p.nombre,
            p.apellido,
            p.dni
        FROM Paciente p
        INNER JOIN Turno t
            ON p.id_paciente = t.id_paciente
        WHERE t.id_doctor = ?
    `;

    const valores = [id_doctor];

    if (apellido) {
        sql += ` AND p.apellido LIKE ?`;
        valores.push(`%${apellido}%`);
    }

    if (dni) {
        sql += ` AND p.dni LIKE ?`;
        valores.push(`%${dni}%`);
    }
    sql += ` ORDER BY p.apellido, p.nombre`;
    db.query(sql, valores, (error, pacientes) => {

        if (error) {
            console.error("Error al buscar paciente:", error);
            return res.status(500).json({
                mensaje: "Error al buscar el paciente."
            });
        }
        if (pacientes.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontró ningún paciente."
            });
        }
        const paciente = pacientes[0];
        const sqlConsultas = `
            SELECT
                c.id_consulta,
                c.fecha_consulta,
                c.motivo,
                c.diagnostico,
                c.observaciones
            FROM Consulta c
            INNER JOIN Turno t
                ON c.id_turno = t.id_turno
            WHERE t.id_paciente = ?
            AND t.id_doctor = ?
            ORDER BY c.fecha_consulta DESC
        `;
        db.query(
            sqlConsultas,
            [paciente.id_paciente, id_doctor],
            (error, consultas) => {
                if (error) {
                    console.error("Error al obtener historial:", error);
                    return res.status(500).json({mensaje: "Error al obtener la historia clínica."});
                }
                res.json({
                    paciente: paciente,
                    consultas: consultas
                });
            }
        );
    });
});
router.get("/historial", (req, res) => {

    const sql = `
        SELECT
            p.id_paciente,
            p.nombre,
            p.apellido,
            p.dni,

            MAX(c.fecha_consulta) AS ultima_actualizacion,

            d.nombre AS nombre_doctor,
            d.apellido AS apellido_doctor

        FROM Paciente p

        INNER JOIN Turno t
            ON p.id_paciente = t.id_paciente

        INNER JOIN Consulta c
            ON t.id_turno = c.id_turno

        INNER JOIN Doctor d
            ON t.id_doctor = d.id_doctor

        GROUP BY
            p.id_paciente,
            p.nombre,
            p.apellido,
            p.dni,
            d.nombre,
            d.apellido

        ORDER BY ultima_actualizacion DESC
    `;

    db.query(sql, (error, resultados) => {
        if (error) {

            console.error(
                "Error al obtener historias clínicas:",
                error
            );

            return res.status(500).json({
                mensaje:
                    "Error al obtener las historias clínicas."
            });
        }

        res.json(resultados);
    });
});
router.get("/turno/:id_turno", (req, res) => {
    const id_turno = req.params.id_turno;
    const sql = `
        SELECT
            t.id_turno,
            t.id_paciente,
            t.id_doctor,
            t.fecha,
            t.hora,
            p.nombre AS nombre_paciente,
            p.apellido AS apellido_paciente,
            p.dni
        FROM Turno t
        INNER JOIN Paciente p
            ON t.id_paciente = p.id_paciente
        WHERE t.id_turno = ?
    `;
    db.query(sql, [id_turno], (error, resultado) => {
        if (error) {
            console.error("Error al obtener datos del turno:",error);
            return res.status(500).json({mensaje: "Error al obtener los datos del turno."});
        }
        if (resultado.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontró el turno."
            });
        }
        res.json(resultado[0]);
    });
});
router.post("/registrar", (req, res) => {
    const {
        id_turno,
        motivo,
        diagnostico,
        observaciones
    } = req.body;
    if (!id_turno || !motivo || !diagnostico) {
        return res.status(400).json({
            mensaje: "Completá los campos obligatorios."
        });
    }


    const buscarTurno = `
        SELECT id_paciente
        FROM Turno
        WHERE id_turno = ?
    `;


    db.query(
        buscarTurno,
        [id_turno],
        (error, turno) => {

            if (error) {

                console.error(error);

                return res.status(500).json({
                    mensaje: "Error al obtener el turno."
                });
            }


            if (turno.length === 0) {

                return res.status(404).json({
                    mensaje: "No se encontró el turno."
                });
            }


            const idPaciente =
                turno[0].id_paciente;


            const sql = `
                INSERT INTO Consulta
                (
                    id_turno,
                    motivo,
                    diagnostico,
                    observaciones
                )
                VALUES (?, ?, ?, ?)
            `;


            const valores = [
                id_turno,
                motivo,
                diagnostico,
                observaciones || null
            ];


            db.query(
                sql,
                valores,
                (error, resultado) => {

                    if (error) {

                        console.error(error);

                        if (
                            error.code ===
                            "ER_DUP_ENTRY"
                        ) {

                            return res.status(400).json({
                                mensaje:
                                    "Este turno ya tiene una consulta registrada."
                            });
                        }


                        return res.status(500).json({
                            mensaje:
                                "Error al registrar la consulta."
                        });
                    }


                    const actualizarTurno = `
                        UPDATE Turno
                        SET estado = 'Atendido'
                        WHERE id_turno = ?
                    `;
                    db.query(
                        actualizarTurno,
                        [id_turno],
                        (errorTurno) => {
                            if (errorTurno) {
                                console.error(errorTurno);
                                return res.status(500).json({mensaje:"La consulta se registró, pero no se pudo actualizar el turno."   });
                            }
                            res.status(201).json({
                                mensaje:"Consulta registrada correctamente.",
                                id_consulta:resultado.insertId,
                                id_turno:id_turno,
                                id_paciente:idPaciente
                            });
                        }
                    );
                }
            );
        }
    );
});
router.get("/paciente/:id_paciente", (req, res)=>{
    const id_paciente =
        req.params.id_paciente;


    const sql = `
        SELECT
            c.id_consulta,
            c.fecha_consulta,
            c.motivo,
            c.diagnostico,
            c.observaciones,
            d.nombre AS nombre_doctor,
            d.apellido AS apellido_doctor,
            d.especialidad
        FROM Consulta c
        INNER JOIN Turno t
            ON c.id_turno = t.id_turno
        INNER JOIN Doctor d
            ON t.id_doctor = d.id_doctor
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
                    mensaje:
                        "Error al obtener la historia clínica."
                });

            }
            res.json(resultados);
        }
    );

})
module.exports = router;