const port = process.env.PORT || 3003;
const express = require('express')
var bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const pages = require('./pages.js')

const app = express()
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors());
const serverSession = require('express-session')
 
app.use(serverSession({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json()) // usar e formatar requisicoes em json
app.use(express.static('./')) // torna conteudo da pasta disponivel

app.set('views',path.join(__dirname,"app/pages"))
app.set('view engine','hbs')

app.listen(port, () => {
    console.log(`Servidor iniciado! Porta: ${port}`)
})

app.get("/",pages.index)
app.get("/esqueciSenha",pages.esqueciSenha)
app.get("/Cadastre", pages.cadastro)
app.post("/Cadastre", urlencodedParser,pages.cadastre)
app.post("/esqueciSenha",urlencodedParser,pages.recuperacaoSenha)
app.post('/login',urlencodedParser,pages.login)
app.get('/usuarioSeguranca',pages.usuarioSeguranca)
app.post('/update',urlencodedParser,pages.update)
app.get('/usuarioResultado',pages.usuarioResultado)
app.get('/usuarioQuiz',pages.meuQuiz)
app.post("/registraQuiz",urlencodedParser,pages.registraQuiz)
app.get('/sair',pages.sair)


