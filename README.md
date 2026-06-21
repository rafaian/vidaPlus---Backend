# VidaPlus - Backend

## Sobre o Projeto

O VidaPlus é uma API REST desenvolvida para auxiliar no gerenciamento de clínicas e consultórios médicos. O sistema permite o cadastro e gerenciamento de pacientes, médicos, consultas e prontuários, além de contar com autenticação de usuários utilizando JWT.

## Tecnologias Utilizadas

* Node.js
* Express.js
* SQLite
* JWT (JSON Web Token)
* bcryptjs
* dotenv
* CORS
* Git e GitHub
* Postman

## Funcionalidades

### Usuários

* Cadastro de usuários
* Login com autenticação JWT

### Pacientes

* Cadastrar paciente
* Listar pacientes
* Buscar paciente por ID
* Atualizar paciente
* Excluir paciente

### Médicos

* Cadastrar médico
* Listar médicos
* Buscar médico por ID
* Atualizar médico
* Excluir médico

### Consultas

* Cadastrar consulta
* Listar consultas
* Buscar consulta por ID
* Atualizar consulta
* Excluir consulta

### Prontuários

* Cadastrar prontuário
* Listar prontuários
* Buscar prontuário por ID
* Atualizar prontuário
* Excluir prontuário

## Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env`:

```env
JWT_SECRET=sua_chave_secreta
```

Inicie o servidor:

```bash
npm run dev
```

## Rotas da API

### Usuários

POST /usuarios

### Login

POST /login

### Pacientes

GET /pacientes

GET /pacientes/:id

POST /pacientes

PUT /pacientes/:id

DELETE /pacientes/:id

### Médicos

GET /medicos

GET /medicos/:id

POST /medicos

PUT /medicos/:id

DELETE /medicos/:id

### Consultas

GET /consultas

GET /consultas/:id

POST /consultas

PUT /consultas/:id

DELETE /consultas/:id

### Prontuários

GET /prontuarios

GET /prontuarios/:id

POST /prontuarios

PUT /prontuarios/:id

DELETE /prontuarios/:id

## Autor

Rafael Serafim
