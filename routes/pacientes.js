const express = require("express")
const router = express.Router()

const conectarBanco = require ("../database/database")


//Lista de pacientes:

router.get("/pacientes", async (req, res) => {
    const db = await conectarBanco()

    const pacientes = await db.all("SELECT * FROM pacientes")

    res.json(pacientes)

})

// Cadastrar pacientes:

router.post ("/pacientes", async (req, res) => {
    
    const db = await conectarBanco()

    const { nome, idade, telefone } = req.body

    // Validações:

    if (!nome || nome.trim() === "") {
        return res.status(400).json({
            erro: "Nome é obrigatório"
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
        INSERT INTO pacientes (nome, idade, telefone)
        VALUES (?, ?, ?)
        `,
        [nome, idade, telefone]

)

res.status(201).json({
    mensagem: `Paciente ${nome} cadastrado com sucesso!`

    })
})

// Buscar paciente (ID)::

router.get("/pacientes/:id" , async (req, res) => {
    
    const db = await conectarBanco()

    const {id} = req.params

    const paciente = await db.get(
        "SELECT * FROM pacientes WHERE id = ? ",
        [id]
    )

    res.json(paciente)


})

// Atualizar paciente:

router.put("/pacientes/:id", async (req, res) => {

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
router.delete("/pacientes/:id", async (req, res) => {
    const db = await conectarBanco()

    const { id } = req.params

    await db.run(
        "DELETE FROM pacientes WHERE id= ?",
        [id]
    )
    res.json({
        mensagem: "Paciente removido com sucesso!!!"
    })
})



module.exports = router