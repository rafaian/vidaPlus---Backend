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

    await db.exec(`
        CREATE TABLE IF NOT EXISTS consultas(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT,
            hora TEXT,
            observacoes TEXT,
            paciente_id INTEGER,
            medico_id INTEGER,
            usuario_id INTEGER,

            FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
            FOREIGN KEY (medico_id) REFERENCES medicos(id)
        )
        `)

        await db.exec(`
            CREATE TABLE IF NOT EXISTS prontuarios(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            diagnostico TEXT,
            tratamento TEXT,
            medicamento TEXT,
            paciente_id INTEGER,
            usuario_id INTEGER,

            FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            )
        `)
        
        console.log("Banco funcionando!!")
    
        
        return db
    }
    module.exports = conectarBanco