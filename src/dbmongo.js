const mongodb = require('mongodb');

const uri = "mongodb+srv://userLolHelper:1234@cluster0.qhb7q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const client2 = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const client3 = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const client4 = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function loadUser(){
    await client.connect();
    client.db('LOLHelper').collection('Usuario').createIndex({email: 1},{unique: true});
    return client.db('LOLHelper').collection('Usuario')
}

async function loadJogabilidade(){
    await client2.connect();
    return client2.db('LOLHelper').collection('Jogabilidade');
}

async function loadQuiz(){
    await client3.connect();
    return client3.db('LOLHelper').collection('Quiz');
}

async function loadCampeao(){
    await client4.connect();
    return client4.db('LOLHelper').collection('Campeoes');
}

async function selectUserLogin(dado){
    const posts = await loadUser();
    casa = await posts.find({email:dado.email,senha:dado.senha}).toArray();
    return casa;
}

async function selectUserFezQuiz(dado){
    const posts = await loadUser();
    casa = await posts.find({_id: new mongodb.ObjectID(dado.id)}).toArray();
    return casa;
}


/*verifica se email existe para a troca de senha */
async function selectEmail(dado){
    const posts = await loadUser();
    casa = await posts.find({email:dado.email}).toArray();
    return casa;
}

/*Seleciona tudo para verificar se alterou na hora de dar o update*/
async function selectUserUpdate(dado){
    const posts = await loadUser();
    casa = await posts.find({_id: new mongodb.ObjectID(dado.id)}).toArray();
    return casa;
}

/* Selciona rota e funcao*/
async function selectRota(dado){
    const posts =  await loadJogabilidade();
    casa = await posts.find({idJog: new mongodb.ObjectID(dado.idJog)}).toArray();
    return casa;
}

/*Seleciona campeao */
async function selectCampeao(dado){
    const posts = await loadCampeao();
    casa = await posts.find({idjog: dado.email, idcampeao: dado.idcampeao}).toArray();
    return casa;
}

/*Criação de usuario*/
async function  insertUser(dados){
    const posts = await loadUser()
     return await posts.insertOne({
        email: dados.email,
        nomeUsuario: dados.usuario,
        senha: dados.senha,
        imagem:'/public/images/banner.svg',
        fezQuiz:false
    })
}

/*Update usuario quando ele muda lá no usuario seguranca*/
async function updateUser(dados){
    const posts = await loadUser();
    return await posts.updateOne({_id: new mongodb.ObjectID(dados.id)},{$set:{ email:dados.email,nomeUsuario:dados.Usuario, senha:dados.senha,imagem:dados.imagem}})
}

/*Insere na 1 vez q faz o quiz */
async function insertQuiz(dados){
    const posts = await loadQuiz();
    return await posts.insertOne({respostas:dados.resposta,idUsuario:new mongodb.ObjectID(dados.idUsuario)})
}

/*Update usuario quando ele faz o quiz*/
async function updateUserQuiz(dados){
    const posts = await loadUser();
    return await posts.updateOne({_id: new mongodb.ObjectID(dados.id)},{$set:{fezQuiz: true}})
}

/*Insere na 1 vez q faz o quiz */
async function insertJogabilidade(dados){
    const posts = await loadJogabilidade();
    return await posts.insertOne({
        idJog:new mongodb.ObjectID(dados.idJog),
        rota:dados.rota,
        funcao:dados.funcao
    })
}

/*Insere na 1 vez q faz o quiz */
async function insertCampeoes(dados){
    const posts = await loadCampeao();
    return await posts.insertOne({
        nomeCampeao:dados.nomeCampeao,
        idjog:dados.email,
        idcampeao:dados.idcampeao
    })
}

/*Update quando refaz o quiz*/
async function updateQuiz(dados){
    const posts = await loadQuiz();
    return await posts.updateOne({idUsuario: new mongodb.ObjectID(dados.id)},{$set:{respostas:dados.respostas}})
}

/*Update quando refaz o quiz*/
async function updateCampeoes(dados){
    const posts =  await loadCampeao();
    return await posts.updateOne({
        idcampeao:dados.idcampeao,
        idjog:dados.email
    },{$set:{nomeCampeao:dados.nomeCampeao}})
}

/*Update quando refaz o quiz*/
async function updateJogabilidade(dados){
    const posts =  await loadJogabilidade();
    return await posts.updateOne({idJog:new mongodb.ObjectID(dados.idJog)},{$set:{rota:dados.rota,funcao:dados.funcao}}) 
}

/* update senha*/
async function updateSenha(dados){
    const posts = await loadUser();
    return await posts.updateOne({email:dados.email},{$set:{senha:dados.senha}})
}
    
module.exports = {
    selectUserLogin, 
    selectUserFezQuiz,
    selectEmail,
    selectUserUpdate,
    selectRota,
    selectCampeao,
    insertUser,
    updateUser,
    insertQuiz,
    updateUserQuiz,
    insertJogabilidade,
    insertCampeoes,
    updateQuiz,
    updateCampeoes,
    updateJogabilidade,
    updateSenha
}
