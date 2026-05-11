const express = require("express")

const router = express.Router()

router.get("/pacientes",(req, res) =>{
    res.send("Lista de pacientes")
})

module.exports = router