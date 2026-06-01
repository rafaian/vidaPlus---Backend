const sqlite3 = require("sqlite3")
const { open } = require('sqlite')


async function conectarBanco(){
    const db = await open({
        filename: "./database.db",
        driver: sqlite3.Database
})

await db.exec(`
    CREATE TABLE IF NOT EXISTS pacientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        idade INTEGER,
        telefone TEXT,
        usuario_id INTEGER
        )
    `)

await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT
        )
    
    `)
    
    await db.exec(`
        CREATE TABLE IF NOT EXISTS medicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        especialidade TEXT,
        crm TEXT UNIQUE,
        telefone TEXT,
        usuario_id INTEGER
        )
        
        `)



    console.log("Banco funcionando!!")

    return db
}

module.exports = conectarBanco