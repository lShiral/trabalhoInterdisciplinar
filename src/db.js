
async function connect(){
    if(global.connection && global.connection.state !== 'disconnected'){
        return global.connection;
    }

    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection("mysql://root:Matheus&Marcos1@localhost:3306/LOLHelper");
    console.log("Conectou Mysql");
    global.connection = connection;
    return connection;
}

/*Verifica se email e senha existe para fazer o login*/
async function selectUserLogin(dado){
    const conn = await connect();
    const sql = 'SELECT email,senha,id,nomeUsuario,imagem FROM Usuario WHERE email =? AND senha = ?;';
    const value = [dado.email,dado.senha];
    const [rows] = await conn.query(sql,value);
    return rows
}

/*verifica se email existe para a troca de senha */
async function selectEmail(dado){
    const conn = await connect();
    const sql = 'SELECT email FROM Usuario WHERE email =?;';
    const value = [dado.email];
    const [rows] = await conn.query(sql,value);
    return rows
}

/*Seleciona tudo para verificar se alterou na hora de dar o update*/
async function selectUserUpdate(dado){
    const conn = await connect();
    const sql = 'SELECT * FROM Usuario WHERE id = ?;';
    const value = [dado.id];
    const [rows] = await conn.query(sql,value);
    return rows
}

/*Criação de usuario*/
async function  insertUser(dados){
    const conn = await connect();
    const sql = 'INSERT INTO Usuario(email,nomeUsuario,senha,imagem) VALUES (?,?,?,?);';
    const values = [dados.email,dados.usuario,dados.senha,dados.imagem]
    return await conn.query(sql,values);
}

/*Update usuario quando ele muda lá no usuario quiz*/
async function updateUser(dados){
    const conn = await connect();
    const sql = 'UPDATE Usuario SET email=?, nomeUsuario=?, senha=?, imagem=? WHERE id=?';
    const values = [dados.email,dados.Usuario,dados.senha,dados.imagem,dados.id];
    return await conn.query(sql, values);
}

/*Insere na 1 vez q faz o quiz */
async function insertQuiz(dados){
    const conn = await connect();
    const sql = 'INSERT INTO Quiz (respostas,idUsuario) VALUES (?,?);';
    const values = [dados.resposta,dados.idUsuario]
    return await conn.query(sql,values);
}

/*Insere na 1 vez q faz o quiz */
async function insertJogabilidade(dados){
    const conn = await connect();
    const sql = 'INSERT INTO Jogabilidade (idJog,rota,funcao) VALUES (?,?,?);';
    const values = [dados.idJog,dados.rota,dados.funcao]
    return await conn.query(sql,values);
}

/*Insere na 1 vez q faz o quiz */
async function insertCampeoes(dados){
    const conn = await connect();
    const sql = 'INSERT INTO Campeoes (id_jog,nomeCampeao,idcampeao,descricao) VALUES (?,?,?);';
    const values = [dados.id_jog,dados.nomeCampeao,dados.idcampeao,dados.descricao]
    return await conn.query(sql,values);
}

/*Update usuario quando ele faz o quiz*/
async function updateUserQuiz(dados){
    const conn = await connect();
    const sql = 'UPDATE Usuario SET fezQuiz = True WHERE id=?';
    const values = [dados.id];
    return await conn.query(sql, values);
}

/*Update quando refaz o quiz*/
async function updateQuiz(dados){
    const conn = await connect();
    const sql = 'UPDATE Quiz SET  respostas =? WHERE id=?';
    const values = [dados.respostas,dados.id];
    return await conn.query(sql, values);
}

/*Update quando refaz o quiz*/
async function updateCampeoes(dados){
    const conn = await connect();
    const sql = 'UPDATE Campeoes SET nomeCampeao =?, idcampeao=?, descricao =? WHERE id_jog=?';
    const values = [dados.nomeCampeao,dados.idcampeao,dados.descricao,dados.id_jog]
    return await conn.query(sql, values);
}

/*Update quando refaz o quiz*/
async function updateJogabilidade(dados){
    const conn = await connect();
    const sql = 'UPDATE Jogabilidade SET rota=?, funcao=? WHERE idJog=?';
    const values = [dados.rota,dados.funcao,dados.idJog];
    return await conn.query(sql, values);
}

module.exports = {selectUserLogin,selectUserUpdate,insertUser,updateUser,insertQuiz,insertJogabilidade,insertCampeoes,updateUserQuiz,updateQuiz,updateCampeoes,updateJogabilidade}
