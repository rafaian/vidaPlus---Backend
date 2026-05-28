const jwt = require("jsonwebtoken")

function verificarToken(req, res, next) {
    // pega token do header:
    const authHeader = req.headers.authorization

    // verificar se existe token:
    if (!authHeader) {
        return res.status(401).json({
            erro: "Token não fornecido"
        })

    }
    // Serparar Bearer do token:
    const token = authHeader.split(" ")[1]
    try{
        // Verificar token:
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        // Salvar dados usuário:
        req.usuario = decoded
        next()
    } catch (erros){
        return res.status(401).json({
            erro: "Token inválido"
        })
    }

}

module.exports = verificarToken
