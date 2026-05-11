const sqlite3 = require("sqlite3")
const { open } = require('sqlite')


async function conectarBanco(){
    const db = await open({
        filename: "./database.db",
        driver: sqlite3.Database
})

await db.exec(`
    CREAT TABLE IF NOT EXISTS pacientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        idade INTEGER
        telefoe TEXT
        )
    `)

    console.log("Banco funcionando!!")

    return db
}

module.exports = conectarBanco