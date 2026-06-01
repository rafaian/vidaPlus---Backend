const express = require("express")
const router = express.Router()
const verificarToken = require ("../middlewares/auth")

const conectarBanco = require ("../database/database")


//Lista de pacientes:

router.get("/pacientes", verificarToken, async (req, res) => {
    const db = await conectarBanco()

    const pacientes = await db.all("SELECT * FROM pacientes")

    res.json(pacientes)

})

// Cadastrar pacientes:

router.post ("/pacientes", verificarToken, async (req, res) => {
    
    const db = await conectarBanco()

    const { nome, idade, telefone } = req.body

    const usuario_id = req.usuario.id

    // Validações:
    if (!nome || nome.trim() === "") {
        return res.status(400).json({
            erro: "Nome é campo obrigatório"
        })
    }

    if (!idade || idade <= 0 ){
        return res.status(400).json({
            erro: "Essa idade não é válida!"
        })
    }

    if (!telefone || telefone.trim() === "" ){
        return res.status(400).json({
            erro: "Telefone é obrigatório"
        })
    }

    await db.run(
        `
        INSERT INTO pacientes (nome, idade, telefone, usuario_id)
        VALUES (?, ?, ?, ?)
        `,
        [nome, idade, telefone, usuario_id]

)

res.status(201).json({
    mensagem: `Paciente ${nome} cadastrado com sucesso!`

    })
})

// Buscar paciente (ID)::

router.get("/pacientes/:id", async (req, res) => {
    
    const db = await conectarBanco()

    const {id} = req.params

    const paciente = await db.get(
        "SELECT * FROM pacientes WHERE usuario_id = ? ",
        [req.usuario.id]
    )

    res.json(paciente)


})

// Atualizar paciente:

router.put("/pacientes/:id", verificarToken, async (req, res) => {

    const db = await conectarBanco()

    const { id } = req.params

    const { nome, idade, telefone } = req.body

    await db.run(`
        
        UPDATE pacientes
        SET nome = ?, idade = ?, telefone = ?
        WHERE id = ?
        
        `,
        [nome, idade, telefone, id]
    )

    res.json({
        mensagem: "Paciente atualizado com sucesso!!!"
    })
})

//Deletar paciente
router.delete("/pacientes/:id", verificarToken, async (req, res) => {
    const db = await conectarBanco()

    const { id } = req.params

    await db.run(
        "DELETE FROM pacientes WHERE id= ?",
        [id]
    )
    
    console.log(id)

    res.json({
        mensagem: `Paciente ID: ${ id }, foi removido com sucesso!!!`
    })
})



module.exports = router