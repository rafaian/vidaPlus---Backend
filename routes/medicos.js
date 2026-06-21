const express = require("express")
const router = express.Router()

const conectarBanco = require("../database/database")
const verificarToken = require("../middlewares/auth")

// Cadastrar médicos
router.post("/medicos", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { nome, especialidade, crm, telefone } = req.body

    const usuario_id = req.usuario.id

    await db.run(
        `
        INSERT INTO medicos
        (nome, especialidade, crm, telefone, usuario_id)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            nome, 
            especialidade, 
            crm, 
            telefone, 
            usuario_id
        ]
    )

    res.status(201).json({
        mensagem: `Médico ${nome} cadastrado com sucesso!`
    })
})

// Listar médicos
router.get("/medicos", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const medicos = await db.all(
        "SELECT * FROM medicos WHERE usuario_id = ?",
        [req.usuario.id]
    )

    res.json(medicos)
})

// Buscar médico por ID
router.get("/medicos/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const medico = await db.get(
        "SELECT * FROM medicos WHERE id = ? AND usuario_id = ?",
        [id, req.usuario.id]
    )

    if (!medico) {
        return res.status(404).json({
            erro: "Médico não encontrado!"
        })
    }

    res.json(medico)
})

// Atualizar médico
router.put("/medicos/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const { nome, especialidade, crm, telefone } = req.body

    const resultado = await db.run(
        `
        UPDATE medicos
        SET
            nome = ?,
            especialidade = ?,
            crm = ?,
            telefone = ?
        WHERE id = ? AND usuario_id = ?
        `,
        [
            nome,
            especialidade,
            crm,
            telefone,
            id,
            req.usuario.id
        ]
    )

    if (resultado.changes === 0) {
        return res.status(404).json({
            erro: "Médico não encontrado!"
        })
    }

    res.json({
        mensagem: "Médico atualizado com sucesso!!!"
    })

})

// Deletar médico
router.delete("/medicos/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const resultado = await db.run(
        "DELETE FROM medicos WHERE id = ? AND usuario_id = ?",
        [id, req.usuario.id]
    )

    if (resultado.changes === 0) {
        return res.status(404).json({
            erro: "Médico não encontrado!"
        })
    }

    res.json({
        mensagem: `Médico ${id} removido com sucesso!!!`
    })

})

module.exports = router