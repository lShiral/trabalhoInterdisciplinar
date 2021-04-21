const port = 3003
const express = require('express')
const app = express()
const banco = 0
const bancoLOL = 0

app.use(express.json()) // usar e formatar requisicoes em json
app.use(express.static('.')) // torna conteudo da pasta disponivel
app.listen(port, () => {
    console.log(`Servidor iniciado! Porta: ${port}`)
})
