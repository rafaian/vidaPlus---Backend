require("dotenv").config()

const express = require("express")
const cors = require("cors")

const conectarBanco = require("./database/database")

// Importação das rotas
const pacientesRoutes = require("./routes/pacientes")
const usuariosRoutes = require("./routes/usuarios")
const medicosRoutes = require("./routes/medicos")
const consultasRoutes = require("./routes/consultas")
const prontuariosRoutes = require("./routes/prontuarios")

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Rotas
app.use(usuariosRoutes)
app.use(pacientesRoutes)
app.use(medicosRoutes)
app.use(consultasRoutes)
app.use(prontuariosRoutes)

// Conexão com banco
conectarBanco()

// Rota principal
app.get("/", (req, res) => {
    res.send("API VidaPlus funcionando 🚀")
})

module.exports = app