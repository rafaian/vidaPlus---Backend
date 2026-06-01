const express = require("express")
const router = express.Router()

const conectarBanco = require("../database/database")
const verificarToken = require("../middlewares/auth")

module.exports = router

// cadastrar medicos
router.post("/medicos", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const {nome, especialidade, crm, telefone} = req.body

    const usuario_id = req.usuario.usuario_id

    await db.run(
        `
        INSERT INTO medicos
        (nome, especialidade, crm, telefone, ususario_id)
        VALUES (?, ?, ?, ?, ?)
        `,
        [nome, especialidade, crm, telefone, usuario_id]
    )

    res.status(201).json({
        mensagem: `Médico ${nome} cadastrado com sucesso!`
    })
})

// Listar medicos:
router.get("/medicos", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const medicos = await db.all(
        "SELECT * FROM medicos WHERE usuario_id = ?",
        [req.usuario.id]
    )

    res.json(medicos)
})

// Buscar médico:
router.get("/medicos/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const medico = await db.get(
        "SELECT * FROM medicos WHERE id = ? AND usuario_id = ?",
        [id, req.usuario.id]
    )

    res.json(medico)

})

// Atualizar medico:

router.put("/medicos/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params
    const {nome, especialidade, crm, telefone} = req.body
    await db.run(
        `
        UPDATE medicos
        SET nome = ?, especialidade = ?, crm = ?, telefone = ?
        WHERE id = ? AND usuario_id = ?
        
        `,
        [nome, especialidade, crm, telefone, id, req.usuario.id]

    )

    res.json({
        mensagem: "Médico atualizado com sucesso!!!"
    })
})

// Deletando medico:
router.delete("/medicos/:id", verificarToken, async (req, res) => {
    
    const db = await conectarBanco()
    
    const { id } = req.params

    await db.run(
        "DELETE FROM medicos WHERE id = ? AND usuario_id = ?",
        [id, req.usuario.id]
    )

    res.json({
        mensagem: `Médico ${id} removido com sucesso!!!`
    })
})

