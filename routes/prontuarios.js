const express = require("express")
const router = express.Router()

const conectarBanco = require("../database/database")
const verificarToken = require("../middlewares/auth")

// Cadastrando prontuarios:
router.post("/prontuarios", verificarToken, async(req, res) =>{

    const db = await conectarBanco()

    const {
        diagnostico,
        tratamento,
        medicamento,
        paciente_id

    } = req.body

    const usuarios_id = req.usuario.id
    
    await db.run(
        `
        INSERT INTO prontuarios
        (diagnostico, tratameto, medicamento, paciente_id, usuario_id)
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
    mensagem: "Prontuário cadastrado com sucesso!!!"
})

})






module.exports = router

