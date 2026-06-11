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

// Consulta por ID:
router.get("/consultas/:id", verificarToken, async(req, res) => {

    const db = await conectarBanco()

    const { id } = req.params
    
    const consulta = await db.get(
        "SELECT * FROM consultas WHERE id = ? AND usuario_id = ?",
        [id, req.usuario.id]
    )

    if (!consulta) {
        return res.status(404).json({
            erro: "Consulta não encontrada"
        })
    }
    res.json(consulta)
})

module.exports = router