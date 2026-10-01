const express = require("express");
const router = express.Router();
const db = require("../bd");
router.post("/registrar", (req, res) => {
    const {
        nombre,
        apellido,
        genero,
        dni,
        fechaNacimiento,
        direccion,
        ciudad,
        telefono,
        correo,
        usuario,
        contrasenia
    } = req.body;

    const sql = `
        INSERT INTO Paciente
        (
            nombre,
            apellido,
            genero,
            dni,
            fecha_nacimiento,
            direccion,
            ciudad,
            telefono,
            correo,
            usuario,
            contrasenia
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        nombre,
        apellido,
        genero,
        dni,
        fechaNacimiento,
        direccion,
        ciudad,
        telefono,
        correo,
        usuario,
        contrasenia
    ];
    db.query(sql, valores, (error, resultado) => {
        if (error) {
            console.error(error);
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                    mensaje: "El DNI o el usuario ya están registrados."
                });
            }
            return res.status(500).json({
                mensaje: "Error al registrar el paciente."
            });
        }
        res.status(201).json({
            mensaje: "Paciente registrado correctamente.",
            usuario: usuario,
            nombre: nombre
        });
    });
});
// OBTENER TODOS LOS PACIENTES
router.get("/", (req, res) => {
    const sql = `
        SELECT
            id_paciente,
            nombre,
            apellido,
            genero,
            dni,
            fecha_nacimiento,
            direccion,
            ciudad,
            telefono,
            correo,
            usuario
        FROM Paciente
        ORDER BY id_paciente DESC
    `;
    db.query(sql, (error, resultados) => {
        if (error) {
            console.error("Error al obtener pacientes:", error);
            return res.status(500).json({
                mensaje: "Error al obtener los pacientes."
            });
        }
        res.json(resultados);
    });
});
// CANTIDAD DE PACIENTES
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
// PACIENTES QUE PERTENECEN A UN DOCTOR
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
            console.error("Error al obtener pacientes del doctor:", error);
            return res.status(500).json({ mensaje: "Error al obtener los pacientes." });
        }
        res.json(resultados);
    });
});
// FICHA COMPLETA DEL PACIENTE
router.get("/ficha/:id_paciente", (req, res) => {

    const id_paciente =
        req.params.id_paciente;
    // DATOS DEL PACIENTE
    const sqlPaciente = `
    SELECT
        id_paciente,
        nombre,
        apellido,
        genero,
        dni,
        fecha_nacimiento,
        direccion,
        ciudad,
        telefono,
        correo,
        usuario
    FROM Paciente
    WHERE id_paciente = ?
`;


    db.query(
        sqlPaciente,
        [id_paciente],
        (error, paciente) => {

            if (error) {

                console.error(
                    "Error al obtener paciente:",
                    error
                );

                return res.status(500).json({
                    mensaje:
                        "Error al obtener el paciente."
                });
            }


            if (paciente.length === 0) {

                return res.status(404).json({
                    mensaje:
                        "Paciente no encontrado."
                });
            }


            // ÚLTIMA CONSULTA
            const sqlUltimaConsulta = `
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

                LIMIT 1
            `;


            db.query(
                sqlUltimaConsulta,
                [id_paciente],
                (error, ultimaConsulta) => {

                    if (error) {

                        console.error(
                            "Error al obtener última consulta:",
                            error
                        );

                        return res.status(500).json({
                            mensaje:
                                "Error al obtener la última consulta."
                        });
                    }


                    // MÉDICO FRECUENTE
                    const sqlMedicoFrecuente = `
                        SELECT
                            d.id_doctor,
                            d.nombre,
                            d.apellido,
                            d.especialidad,
                            COUNT(c.id_consulta) AS cantidad_consultas
                        FROM Consulta c

                        INNER JOIN Turno t
                            ON c.id_turno = t.id_turno

                        INNER JOIN Doctor d
                            ON t.id_doctor = d.id_doctor

                        WHERE t.id_paciente = ?

                        GROUP BY
                            d.id_doctor,
                            d.nombre,
                            d.apellido,
                            d.especialidad

                        ORDER BY cantidad_consultas DESC

                        LIMIT 1
                    `;


                    db.query(
                        sqlMedicoFrecuente,
                        [id_paciente],
                        (error, medicoFrecuente) => {

                            if (error) {

                                console.error(
                                    "Error al obtener médico frecuente:",
                                    error
                                );

                                return res.status(500).json({
                                    mensaje:
                                        "Error al obtener el médico frecuente."
                                });
                            }


                            // MEDICAMENTOS ACTUALES
                            const sqlMedicamentos = `
                                SELECT
                                    id_medicamento,
                                    medicamento,
                                    frecuencia,
                                    fecha_inicio,
                                    fecha_fin,
                                    motivo
                                FROM Medicamento
                                WHERE id_paciente = ?
                                AND (
                                    fecha_fin IS NULL
                                    OR fecha_fin >= CURDATE()
                                )
                                ORDER BY fecha_inicio DESC
                            `;


                            db.query(
                                sqlMedicamentos,
                                [id_paciente],
                                (error, medicamentos) => {

                                    if (error) {

                                        console.error(
                                            "Error al obtener medicamentos:",
                                            error
                                        );

                                        return res.status(500).json({
                                            mensaje:
                                                "Error al obtener los medicamentos."
                                        });
                                    }


                                    res.json({

                                        paciente:
                                            paciente[0],

                                        ultimaConsulta:
                                            ultimaConsulta.length > 0
                                                ? ultimaConsulta[0]
                                                : null,

                                        medicoFrecuente:
                                            medicoFrecuente.length > 0
                                                ? medicoFrecuente[0]
                                                : null,

                                        medicamentos:
                                            medicamentos

                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

// OBTENER UN PACIENTE POR ID
router.get("/:id_paciente", (req, res) => {

    const id_paciente = req.params.id_paciente;

    const sql = `
        SELECT
            id_paciente,
            nombre,
            apellido,
            genero,
            dni,
            fecha_nacimiento,
            direccion,
            ciudad,
            telefono,
            correo,
            usuario
        FROM Paciente
        WHERE id_paciente = ?
    `;

    db.query(sql, [id_paciente], (error, resultados) => {

        if (error) {
            console.error("Error al obtener paciente:", error);

            return res.status(500).json({
                mensaje: "Error al obtener el paciente."
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: "Paciente no encontrado."
            });
        }

        res.json(resultados[0]);
    });
});
module.exports = router;