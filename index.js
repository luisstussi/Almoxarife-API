//importando as bibliotecas
const express = require ('express')
const app = express ()
const bodyParser = require ('body-parser')
app.use (bodyParser.json ())
const db = require ('./config/db')
const consign = require ('consign')
consign() //definindo os arquivos e pastas que farao parte do conjunto app
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.db = db //definindo app.db como banco de dados
app.listen(3000, () => {console.log('Executando')}) //definindo porta como 3000 e iniciando a aplicacao