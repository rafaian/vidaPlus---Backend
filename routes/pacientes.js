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

    const {nome, idade, telefone} = req.body
    await db.run(`
        INSERT INTO pacientes (nome, idade, telefone)
        VALUES (?, ?, ?)
        `,
    [nome, idade, telefone]

)

res.status(201).json({
    mensagem: "Paciente cadastrado com sucesso1!!"

    })
})


module.exports = router