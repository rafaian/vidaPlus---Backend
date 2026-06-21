const express = require("express")
const router = express.Router()

const conectarBanco = require("../database/database")
const verificarToken = require("../middlewares/auth")

// Cadastrar prontuário
router.post("/prontuarios", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const {
        diagnostico,
        tratamento,
        medicamento,
        paciente_id
    } = req.body

    const usuario_id = req.usuario.id

    if (!diagnostico || diagnostico.trim() === "") {
        return res.status(400).json({
            erro: "Diagnóstico é obrigatório!"
        })
    }

    if (!tratamento || tratamento.trim() === "") {
        return res.status(400).json({
            erro: "Tratamento é obrigatório!"
        })
    }

    if (!medicamento || medicamento.trim() === "") {
        return res.status(400).json({
            erro: "Medicamento é obrigatório!"
        })
    }

    if (!paciente_id) {
        return res.status(400).json({
            erro: "Paciente é obrigatório!"
        })
    }

    await db.run(
        `
        INSERT INTO prontuarios
        (diagnostico, tratamento, medicamento, paciente_id, usuario_id)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            diagnostico,
            tratamento,
            medicamento,
            paciente_id,
            usuario_id
        ]
    )

    res.status(201).json({
        mensagem: "Prontuário cadastrado com sucesso!"
    })

})

// Listar prontuários
router.get("/prontuarios", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const prontuarios = await db.all(
        "SELECT * FROM prontuarios WHERE usuario_id = ?",
        [req.usuario.id]
    )

    res.json(prontuarios)

})

// Buscar prontuário por ID
router.get("/prontuarios/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const prontuario = await db.get(
        "SELECT * FROM prontuarios WHERE id = ? AND usuario_id = ?",
        [id, req.usuario.id]
    )

    if (!prontuario) {
        return res.status(404).json({
            erro: "Prontuário não encontrado!"
        })
    }

    res.json(prontuario)

})

// Atualizar prontuário
router.put("/prontuarios/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const {
        diagnostico,
        tratamento,
        medicamento,
        paciente_id
    } = req.body

    if (!diagnostico || diagnostico.trim() === "") {
        return res.status(400).json({
            erro: "Diagnóstico é obrigatório!"
        })
    }

    if (!tratamento || tratamento.trim() === "") {
        return res.status(400).json({
            erro: "Tratamento é obrigatório!"
        })
    }

    if (!medicamento || medicamento.trim() === "") {
        return res.status(400).json({
            erro: "Medicamento é obrigatório!"
        })
    }

    if (!paciente_id) {
        return res.status(400).json({
            erro: "Paciente é obrigatório!"
        })
    }

    const resultado = await db.run(
        `
        UPDATE prontuarios
        SET
            diagnostico = ?,
            tratamento = ?,
            medicamento = ?,
            paciente_id = ?
        WHERE id = ? AND usuario_id = ?
        `,
        [
            diagnostico,
            tratamento,
            medicamento,
            paciente_id,
            id,
            req.usuario.id
        ]
    )

    if (resultado.changes === 0) {
        return res.status(404).json({
            erro: "Prontuário não encontrado!"
        })
    }

    res.json({
        mensagem: "Prontuário atualizado com sucesso!"
    })

})

// Deletar prontuário
router.delete("/prontuarios/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const resultado = await db.run(
        "DELETE FROM prontuarios WHERE id = ? AND usuario_id = ?",
        [id, req.usuario.id]
    )

    if (resultado.changes === 0) {
        return res.status(404).json({
            erro: "Prontuário não encontrado!"
        })
    }

    res.json({
        mensagem: `Prontuário ${id} removido com sucesso!`
    })

})

module.exports = router