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
            erro: "Consulta não encontrada!!!"
        })
    }
    res.json(consulta)
})

// Atualizar consulta por id:
router.put("/consultas/:id", verificarToken, async(req, res) => {
   
    const db = await conectarBanco()

    const { id } = req.params
    
    console.log(req.body)

    const {
        data,
        hora,
        observacoes,
        paciente_id,
        medico_id
    } = req.body

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
        erro: "Consulta não encontrada!!!"
    })
}

res.json({
    mensagem: "Consulta atualizada com sucesso!!!"
    })
})

// Deletando consultas:
router.delete("/consultas/:id", verificarToken, async(req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const resultado = await db.run(
        "DELETE FROM consultas WHERE id = ? AND usuario_id = ?",

        [id, req.usuario.id]
    )
    
    if (resultado.changes === 0) {
       return res.status(404).json({
        erro: "Consulta não encontrada!!!"
       })
       
    }
       res.json({
           mensagem:`Consulta ${id} removida com sucesso!!!`
        })
})

module.exports = router