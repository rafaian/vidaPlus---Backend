const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = express.Router()

const conectarBanco = require("../database/database")

// Cadastrar usuários
router.post("/usuarios", async (req, res) => {

    const db = await conectarBanco()

    const { nome, email, senha } = req.body

    // Validações
    if (!nome || nome.trim() === "") {
        return res.status(400).json({
            erro: "Nome é campo obrigatório!"
        })
    }

    if (!email || email.trim() === "") {
        return res.status(400).json({
            erro: "Email é campo obrigatório!"
        })
    }

    if (!senha || senha.length < 6) {
        return res.status(400).json({
            erro: "Senha deverá ter no mínimo 6 caracteres!"
        })
    }

    // Verificar se o email já existe
    const usuarioExistente = await db.get(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
    )

    if (usuarioExistente) {
        return res.status(400).json({
            erro: `O email ${email} já está cadastrado!`
        })
    }

    // Criptografar senha
    const senhaCriptografada = await bcrypt.hash(senha, 10)

    // Salvar usuário
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

// Login
router.post("/login", async (req, res) => {

    const db = await conectarBanco()

    const { email, senha } = req.body

    // Buscar usuário
    const usuario = await db.get(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
    )

    if (!usuario) {
        return res.status(400).json({
            erro: "Email ou senha inválidos"
        })
    }

    // Comparar senha
    const senhaCorreta = await bcrypt.compare(
        senha,
        usuario.senha
    )

    if (!senhaCorreta) {
        return res.status(400).json({
            erro: "Email ou senha inválidos"
        })
    }

    // Gerar token
    const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )

    res.json({
        mensagem: "Login realizado com sucesso!",
        token
    })

})

module.exports = router