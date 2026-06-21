const express = require("express")
const router = express.Router()

const conectarBanco = require("../database/database")
const verificarToken = require("../middlewares/auth")

// Cadastrar consultas
router.post("/consultas", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const {
        data,
        hora,
        observacoes,
        paciente_id,
        medico_id
    } = req.body

    const usuario_id = req.usuario.id

    // Validações
    if (!data || data.trim() === "") {
        return res.status(400).json({
            erro: "Data é obrigatória!"
        })
    }

    if (!hora || hora.trim() === "") {
        return res.status(400).json({
            erro: "Hora é obrigatória!"
        })
    }

    if (!observacoes || observacoes.trim() === "") {
        return res.status(400).json({
            erro: "Observações são obrigatórias!"
        })
    }

    if (!paciente_id) {
        return res.status(400).json({
            erro: "Paciente é obrigatório!"
        })
    }

    if (!medico_id) {
        return res.status(400).json({
            erro: "Médico é obrigatório!"
        })
    }

    await db.run(
        `
        INSERT INTO consultas
        (data, hora, observacoes, paciente_id, medico_id, usuario_id)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            data,
            hora,
            observacoes,
            paciente_id,
            medico_id,
            usuario_id
        ]
    )

    res.status(201).json({
        mensagem: "Consulta cadastrada com sucesso!"
    })

})

// Listar consultas
router.get("/consultas", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const consultas = await db.all(
        "SELECT * FROM consultas WHERE usuario_id = ?",
        [req.usuario.id]
    )

    res.json(consultas)

})

// Buscar consulta por ID
router.get("/consultas/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const consulta = await db.get(
        "SELECT * FROM consultas WHERE id = ? AND usuario_id = ?",
        [id, req.usuario.id]
    )

    if (!consulta) {
        return res.status(404).json({
            erro: "Consulta não encontrada!"
        })
    }

    res.json(consulta)

})

// Atualizar consulta
router.put("/consultas/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const {
        data,
        hora,
        observacoes,
        paciente_id,
        medico_id
    } = req.body

    // Validações
    if (!data || data.trim() === "") {
        return res.status(400).json({
            erro: "Data é obrigatória!"
        })
    }

    if (!hora || hora.trim() === "") {
        return res.status(400).json({
            erro: "Hora é obrigatória!"
        })
    }

    if (!observacoes || observacoes.trim() === "") {
        return res.status(400).json({
            erro: "Observações são obrigatórias!"
        })
    }

    if (!paciente_id) {
        return res.status(400).json({
            erro: "Paciente é obrigatório!"
        })
    }

    if (!medico_id) {
        return res.status(400).json({
            erro: "Médico é obrigatório!"
        })
    }

    const resultado = await db.run(
        `
        UPDATE consultas
        SET
            data = ?,
            hora = ?,
            observacoes = ?,
            paciente_id = ?,
            medico_id = ?
        WHERE id = ? AND usuario_id = ?
        `,
        [
            data,
            hora,
            observacoes,
            paciente_id,
            medico_id,
            id,
            req.usuario.id
        ]
    )

    if (resultado.changes === 0) {
        return res.status(404).json({
            erro: "Consulta não encontrada!"
        })
    }

    res.json({
        mensagem: "Consulta atualizada com sucesso!"
    })

})

// Deletar consulta
router.delete("/consultas/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const resultado = await db.run(
        "DELETE FROM consultas WHERE id = ? AND usuario_id = ?",
        [id, req.usuario.id]
    )

    if (resultado.changes === 0) {
        return res.status(404).json({
            erro: "Consulta não encontrada!"
        })
    }

    res.json({
        mensagem: `Consulta ${id} removida com sucesso!`
    })

})

module.exports = router