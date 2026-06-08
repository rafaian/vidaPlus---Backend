const jwt = require("jsonwebtoken")

function verificarToken(req, res, next) {

    console.log("HEADERS:", req.headers)

    const authHeader = req.headers.authorization

    console.log("AUTH:", authHeader)

    if (!authHeader) {
        return res.status(401).json({
            erro: "Token não fornecido"
        })
    }

    const token = authHeader.split(" ")[1]

    console.log("TOKEN:", token)
    console.log("SECRET:", process.env.JWT_SECRET)

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        console.log("TOKEN DECODIFICADO:", decoded)

        req.usuario = decoded

        next()

    } catch (erro) {

        console.log("ERRO JWT:", erro.message)

        return res.status(401).json({
            erro: "Token inválido"
        })
    }
}

module.exports = verificarToken