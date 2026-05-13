const express = require("express")
const bcrypt = require("bcryptjs")

const router = express.Router()

const conectarBanco = require("../database/database")

// Cadastrar usuários:
router.post("/usuarios", async (req, res) => {
    const db = await conectarBanco()

    const { nome, email, senha } = req.body

    // Validações:
    if (!nome ||nome.trim() === "") {
        return res.status(400).json({
            erro: "Nome é campo obrigatório!"
        })
    }
    
    if (!email ||email.trim() ===""){
        return res.status(400).json({
            erro: "Email é campo obrigatório!"
        })
    }

    if (!senha || senha.length < 6 ){
        return res.status(400).json({
            erro: "Senha deverá ter no mínimo seis(6) caracteres!"
        })
    }

    // Verificar email:
    const usuarioExistente = await db.get(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
    )

    if (usuarioExistente) {
        return res.status(400).json({
            erro: `Email:${email} já cadastrado!`
        })
    }
    // Criptográfia de senha:
    const senhaCriptografada = await bcrypt.hash(senha, 10)

    // Salvar usuário:
    await db.run(
        `
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?)
        `,
        [nome, email, senhaCriptografada]
    )

    res.status(201).json({
        mensagem: `Usuário ${nome} cadastrado com sucesso!`
    })

})

module.exports = router