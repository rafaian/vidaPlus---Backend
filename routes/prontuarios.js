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

    const usuario_id = req.usuario.id
    
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
    mensagem: "Prontuário cadastrado com sucesso!!!"
})

})
// Buscando todos prontuarios:
router.get("/prontuarios/", verificarToken, async(req, res) =>{

    const db = await conectarBanco()

    const prontuarios = await db.all (
        "SELECT * FROM prontuarios WHERE usuario_id = ?",
        [req.usuario.id]
    )
    res.json(prontuarios)

} )
// Buscando prontuario por id:
router.get("/prontuarios/:id", verificarToken, async(req, res) => {

    const db = await conectarBanco()

    const { id } = req.params
    
    const prontuario = await db.get(
        "SELECT * FROM prontuarios WHERE id = ? AND usuario_id = ?",
        [id, req.usuario.id]
    )
    if(!prontuario) {
        return res.status(404).json({
            erro: "Prontuário inexistente!!!"
        })
    }

    res.json(prontuario)
})

// Atualizando pronturario por id:
router.put("/prontuarios/:id", verificarToken, async(req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const {
        diagnostico,
        tratamento,
        medicamento,
        paciente_id,
        medico_id
    } = req.body

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

    if (resultado.changes === 0){
        return res.status(404).json({
            erro: "Prontuário não encontrada!!!"
        })
    }

    res.json({
        mensagem: "Prontuário atualizada com sucesso!!!"
    })


})
// Deletando prontuario:
router.delete("/prontuarios/:id", verificarToken, async(req, res) =>{

    const db = await conectarBanco()

    const { id } = req.params

    const resultado = await db.run(
        "DELETE FROM prontuarios WHERE id = ? AND usuario_id = ?",
        
        [id, req.usuario.id]
    )

    if (resultado.changes === 0){
        return res.status(404).json({
            erro:"Prontuário não encontrado!!!"
        })

    }
        res.json({
            mensagem:`Prontuário ${id} removido com sucesso!!!`
        })


})






module.exports = router

