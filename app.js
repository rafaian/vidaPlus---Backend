require("dotenv").config()

const express = require("express")
const cors = require("cors")


const conectarBanco = require("./database/database")

const pacientesRoutes = require("./routes/pacientes")
const usuariosRoutes = require("./routes/usuarios")
const medicosRoutes = require("./routes/medicos")


const app = express()

app.use(cors())
app.use(express.json())
app.use(pacientesRoutes)
app.use(usuariosRoutes)
app.use(medicosRoutes)


conectarBanco()

app.get("/", (req, res) => {
    res.send("API VidaPlus funcionando")
})

module.exports = app
