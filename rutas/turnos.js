const express = require("express");
const router = express.Router();

const db = require("../bd");
//todos los turnos
router.get("/", (req, res) => {

    const sql = `
        SELECT
            t.id_turno,
            t.fecha,
            t.hora,
            t.estado,

            p.nombre AS nombre_paciente,
            p.apellido AS apellido_paciente,
            d.usuario AS usuario_doctor,
            d.nombre AS nombre_doctor,
            d.apellido AS apellido_doctor,
            d.especialidad

        FROM Turno t

        INNER JOIN Paciente p
            ON t.id_paciente = p.id_paciente

        INNER JOIN Doctor d
            ON t.id_doctor = d.id_doctor

        ORDER BY t.fecha ASC, t.hora ASC
    `;

    db.query(sql, (error, resultados) => {

        if (error) {
            console.error("Error al obtener todos los turnos:", error);

            return res.status(500).json({
                mensaje: "Error al obtener los turnos."
            });
        }

        res.json(resultados);
    });
});
// Obtener los turnos de un doctor
router.get("/doctor/:id_doctor", (req, res) => {
    const id_doctor = req.params.id_doctor;
    const sql = `
        SELECT 
            t.id_turno,
            t.fecha,
            t.hora,
            t.estado,
            p.id_paciente,
            p.nombre AS nombre_paciente,
            p.apellido AS apellido_paciente,
            p.dni
        FROM turno t
        INNER JOIN paciente p
            ON t.id_paciente = p.id_paciente
        WHERE t.id_doctor = ?
        ORDER BY t.fecha, t.hora
    `;
    db.query(sql, [id_doctor], (error, resultados) => {

        if (error) {
            console.error("Error al obtener los turnos:", error);
            return res.status(500).json({
                error: "Error al obtener los turnos"
            });
        }
        res.json(resultados);
    });
});
router.get("/doctores", (req, res) => {

    const sql = `
        SELECT
            id_doctor,
            nombre,
            apellido,
            especialidad
        FROM Doctor
        ORDER BY apellido, nombre
    `;
    db.query(sql, (error, resultados) => {
        if (error) {
            console.error("Error al obtener los doctores:", error);
            return res.status(500).json({mensaje: "Error al obtener los doctores."});
        }
        res.json(resultados);
    });
});
//solicitar turno
router.post("/solicitar", (req, res) => {
    const {id_paciente,id_doctor,fecha,hora} = req.body;
    // Verificar que lleguen todos los datos
    if (!id_paciente || !id_doctor || !fecha || !hora) {
        return res.status(400).json({mensaje: "Todos los campos son obligatorios." });
    }
    const sql = `
        INSERT INTO Turno
        (
            id_paciente,
            id_doctor,
            fecha,
            hora,
            estado
        )
        VALUES (?, ?, ?, ?, 'Pendiente')
    `;
    const valores = [
        id_paciente,
        id_doctor,
        fecha,
        hora
    ];
    db.query(sql, valores, (error, resultado) => {
        if (error) {
            console.error("Error al solicitar turno:", error);
            return res.status(500).json({mensaje: "No se pudo solicitar el turno."   });
        }
        res.status(201).json({mensaje: "Turno solicitado correctamente.", id_turno: resultado.insertId});
    });
});
//turnos del paciente
router.get("/paciente/:id_paciente", (req, res) => {
    const id_paciente = req.params.id_paciente;
    const sql = `
        SELECT
            t.id_turno,
            t.fecha,
            t.hora,
            t.estado,

            d.id_doctor,
            d.nombre AS nombre_doctor,
            d.apellido AS apellido_doctor,
            d.especialidad
        FROM Turno t
        INNER JOIN Doctor d
            ON t.id_doctor = d.id_doctor
        WHERE t.id_paciente = ?
        ORDER BY t.fecha DESC, t.hora DESC
    `;
    db.query(sql, [id_paciente], (error, resultados) => {
        if (error) {
            console.error("Error al obtener los turnos del paciente:", error);
            return res.status(500).json({mensaje: "Error al obtener los turnos."});
        }
        res.json(resultados);
    });
});
router.get("/hoy", (req, res) => {

    const sql = `
        SELECT COUNT(*) AS cantidad
        FROM Turno
        WHERE fecha = CURDATE()
    `;

    db.query(sql, (error, resultado) => {

        if (error) {
            console.error("Error al contar turnos de hoy:", error);

            return res.status(500).json({
                mensaje: "Error al obtener los turnos de hoy."
            });
        }

        res.json({
            cantidad: resultado[0].cantidad
        });
    });
});
router.get("/hoy/lista", (req, res) => {
    const sql = `
        SELECT
            t.id_turno,
            t.fecha,
            t.hora,
            t.estado,
            p.nombre AS nombre_paciente,
            p.apellido AS apellido_paciente,
            d.usuario AS usuario_doctor,
            d.nombre AS nombre_doctor,
            d.apellido AS apellido_doctor,
            d.especialidad
        FROM Turno t
        INNER JOIN Paciente p
            ON t.id_paciente = p.id_paciente
        INNER JOIN Doctor d
            ON t.id_doctor = d.id_doctor
        WHERE t.fecha = CURDATE()
        ORDER BY t.hora ASC
    `;
    db.query(sql, (error, resultados) => {
        if (error) {
            console.error("Error al obtener los turnos de hoy:", error);
            return res.status(500).json({mensaje: "Error al obtener los turnos de hoy."});
        }
        res.json(resultados);
    });
});
// cambio de estado

router.put("/:id_turno/estado", (req, res) => {
    const { id_turno } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = [
        "Pendiente",
        "Confirmado",
        "Cancelado",
        "Atendido"
    ];

    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({mensaje: "Estado no válido."});
    }
    const sql = `
        UPDATE Turno
        SET estado = ?
        WHERE id_turno = ?
    `;
    db.query(sql,[estado, id_turno],(error, resultado) => {
            if (error) {
                console.error("Error al actualizar estado del turno:",error);
                return res.status(500).json({mensaje: "No se pudo actualizar el estado."});
            }
            if (resultado.affectedRows === 0) {
                return res.status(404).json({mensaje: "Turno no encontrado."});
            }
            res.json({mensaje: "Estado actualizado correctamente."});
        }
    );
});
module.exports = router;