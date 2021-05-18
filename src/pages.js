//const db = require("./db");
const bd = require("./dbmongo")
const rotaSup = ". Quando você decide por jogar de suporte, precisa compreender que ele está no jogo com o intuito de ajudar o Atirador a adquirir seus recursos, conceder visão para o time e realizar a proteção de seus parceiros. Além disso, o suporte, na Fase de Rotas, é capaz de se movimentar pelo mapa para, além de garantir a visão, auxiliar seus parceiros de time com o que estiver ao seu alcance."
const rotaadc= ". O Atirador é aquele campeão que causa dano físico à distância, mais comumente atua na rota inferior, conta com a ajuda de um companheiro - o Suporte -, e que tem a meta de ser o maior causador de dano de seu time.",
rotaJg = ". O caçador (jungler) no League of Legends é um dos membros do time que mais possui o poder de influenciar diretamente no resultado do começo da partida. Com liberdade de se movimentar pelo mapa, o jungler pode adquirir recursos na selva, dar visão para seu time e, principalmente, ajudar cada rota executando seus ganks. Se executar suas ações com sucesso, o caçador pode ditar o ritmo da partida. Além de todas essas características, ele ainda tem a responsabilidade de carregar o feitiço “Golpear”, que, além de ajudar a eliminar os campos da selva com mais segurança e facilidade, é utilizado para garantir objetivos grandes pelo mapa, como os Dragões e o Barão Na’Shor. ATENÇÃO: esta rota exige bastante conhecimento e noção de jogo para não ficar para trás em experiência e ouro e não deixar seus companheiros na mão.", 
rotaMid = ". Além da proximidade de ambos os covis de monstros épicos, a Rota do Meio também é mais movimentada por conta da maior facilidade de se realizar alguma ação. Isso se deve ao fator de que a rota possui várias formas de ser gankada e também do jogador se movimentar pelo mapa.Dessa forma, como mid laner, você precisa ter atenção redobrada na rota, contribuir com dano em team fights e se movimentar no mapa para auxiliar a equipe.",
rotaTop = ". Os jogadores da rota superior costumam atuar na linha de frente, servindo como tanques (personagens com muita vida e resistência), lutadores (personagens de ataque corpo a corpo com boa quantidade de dano) e potenciais iniciadores de team fights. Dependendo da situação, os topos também podem funcionar como escudos para aliados mais frágeis.";

//verifica usuario e cria uma sessão
module.exports = {
    index(req, res, next) {
        return res.render('index')
    },

    /*Colocar todo codigo de vericacao de login*/
    async login(req, res, next) {
        const valor = await bd.selectUserLogin({email: req.body.email, senha:req.body.senha})
        if(valor[0]){
            req.session.idusuario = valor[0]._id;
            req.session.usuEmail = valor[0].email;
            req.session.usuario = valor[0].nomeUsuario;
            req.session.imagem = valor[0].imagem
            res.redirect("usuarioSeguranca")
        }else{
            info = { error: "erro"}
            res.render("index", {info})
        }
    },

    esqueciSenha(req, res, next){
        res.render('esqueciSenha')
    },

    async esqueciSenha2(req, res, next){ 
        const valor = await bd.selectEmail({
            email: req.body.email
        })
        if(valor[0] != null) {
            info = {recuperar: 'valor' , email: req.body.email}
            res.render('esqueciSenha', {info})
        }
        else {
            info = {error: 'fail'}
            res.render('esqueciSenha', {info})
            
        }  
    },

    cadastro(req, res, next){
        res.render('Cadastre')
    },

    async cadastre(req,res,next){
        try {
            const valores = await bd.insertUser({
            email:req.body.email,
            usuario:req.body.usuario,
            senha: req.body.senha
        })
        res.redirect('/');
    } catch(err) {
        console.log(err);
    }
    },
    
    async recuperacaoSenha(req,res,next){
        try {
            const valor = await bd.updateSenha({
            email: req.body.email, 
            senha: req.body.senha
        })
        console.log('oi')
        res.redirect('/')
    } catch (err) {
        console.log(err);
        }
        
    },
    usuarioSeguranca(req, res, next) {
        if (!req.session.idusuario) {
            res.redirect('/')
        } else {
            let info = {
                email: req.session.usuEmail,
                usuario: req.session.usuario,
                imagem: req.session.imagem
            }
            res.render("usuarioSeguranca", {
                info
            })
        }
    },

    async usuarioResultado(req, res, next) {
        if (!req.session.idusuario) {
            res.redirect('/')
        } else {
            const valores1 = await bd.selectUserFezQuiz({
                id: req.session.idusuario
            })
            if (valores1[0].fezQuiz) {
                try {
                    var valores = await bd.selectCampeao({
                        email: req.session.usuEmail,
                        idcampeao: 1
                    })
                    let dados1 = {
                        nome: valores[0].nomeCampeao
                    }

                     valores = await bd.selectCampeao({
                        email: req.session.usuEmail,
                        idcampeao: 2
                    })
                    let dados2 = {
                        nome: valores[0].nomeCampeao
                    }

                     valores = await bd.selectCampeao({
                        email: req.session.usuEmail,
                        idcampeao: 3
                    })
                    let dados3 = {
                        nome: valores[0].nomeCampeao
                    }

                    var valores2 = await bd.selectRota({
                        idJog: req.session.idusuario
                    })
                    let rota = {
                        funcao: valores2[0].rota,
                        descricaoFuncao: "Lá você atuará como " + valores2[0].funcao
                    }

                    let info = {
                        email: req.session.usuEmail,
                        usuario: req.session.usuario,
                        imagem: req.session.imagem
                    }
                    res.render("usuarioResultado", {
                        info,
                        dados1,
                        dados2,
                        dados3,
                        rota
                    })
                } catch (err) {
                    console.log(err)
                }
            } else {
                let info = {
                    email: req.session.usuEmail,
                    usuario: req.session.usuario,
                    imagem: req.session.imagem,
                    fezQuiz: 1
                }
                res.render("usuarioResultado", {
                    info
                })
            }


        }
    },

    /*
     * colocar codigo para verificacao de conponentes alterados e de upgrade
     * names dos campos:
     * usuario, telefone, email, celular, avatar, novaSenha
     */
    async update(req, res) {
        if (!req.session.idusuario) {
            res.redirect('/')
        } else {
            const valores = await bd.selectUserUpdate({
                id: req.session.idusuario
            })
            var email = valores[0].email;
            var nomeUsuario = valores[0].nomeUsuario;
            var senha = valores[0].senha;
            var imagem = valores[0].imagem;
            if (req.body.email != valores[0].email && req.body.email != "") {
                email = req.body.email;
                req.session.usuEmail = req.body.email;
            }
            if (req.body.usuario != valores[0].nomeUsuario && req.body.usuario != "") {
                nomeUsuario = req.body.usuario;
                req.session.usuario = req.body.usuario;
            }
            if (req.body.novaSenha != valores[0].senha && req.body.novaSenha != "" && req.body.senhaAtual == valores[0].senha) {
                senha = req.body.novaSenha;
            } else if (req.body.senhaAtual != valores[0].senha && req.body.novaSenha != "") {
                res.status(424).send("Senha atual diferente da cadastrada!!")
                return;
            }
            if (req.body.avatar != valores[0].imagem && req.body.avatar != "") {
                imagem = req.body.avatar;
                req.session.imagem = req.body.avatar;
            }

            try {
                var valores2 = await bd.updateUser({
                    email: email,
                    senha: senha,
                    imagem: imagem,
                    Usuario: nomeUsuario,
                    id: req.session.idusuario
                })
                res.redirect("/usuarioSeguranca")
            } catch (err) {
                req.session.usuEmail = valores[0].email;
                req.session.usuario = valores[0].nomeUsuario;
                req.session.imagem = valores[0].imagem;
                res.status(424).send("Não foi possivel atualizar o cadastro tente novamente!")
            }

            
                

        }
    },

    async meuQuiz(req, res, next) {
        if (!req.session.idusuario) {
            res.redirect('/')
        } else {
            const valores = await bd.selectUserFezQuiz({
                id: req.session.idusuario
            })
            let info = {
                email: req.session.usuEmail,
                usuario: req.session.usuario,
                imagem: req.session.imagem,
                fezQuiz: valores[0].fezQuiz
            }
            res.render("usuarioQuiz", {
                info
            })
        }
    },

    /*
     * Regisra quiz
     */
    async registraQuiz(req, res, next) {
        if (!req.session.idusuario) {
            res.redirect('/')
        } else {
            var adc= 0,
                jg = 0,
                sup = 0,
                top = 0,
                mid = 0;

            //verificar .funcaoluta
            if (req.body.funcaoLuta == "adc") {
                adc++;
            } else if (req.body.funcaoLuta == 'sup') {
                sup++;
            } else if (req.body.funcaoLuta == 'jg') {
                jg++;
            } else if (req.body.funcaoLuta == 'top') {
                top++;
            } else if (req.body.funcaoLuta == 'mid') {
                mid++;
            }

            //verificar .funcaoJogo
            if (req.body.funcaoJogo == "adc") {
                adc++;
            } else if (req.body.funcaoJogo == 'sup') {
                sup++;
            } else if (req.body.funcaoJogo == 'jg') {
                jg++;
            } else if (req.body.funcaoJogo == 'top') {
                top++;
            } else if (req.body.funcaoJogo == 'mid') {
                mid++;
            }

            //verificar .personagem
            if (req.body.personagem == "adc") {
                adc++;
            } else if (req.body.personagem == 'sup') {
                sup++;
            } else if (req.body.personagem == 'jg') {
                jg++;
            } else if (req.body.personagem == 'top') {
                top++;
            } else if (req.body.personagem == 'mid') {
                mid++;
            }

            //verificar .frase
            if (req.body.frase == "adc") {
                adc++;
            } else if (req.body.frase == 'sup') {
                sup++;
            } else if (req.body.frase == 'jg') {
                jg++;
            } else if (req.body.frase == 'top') {
                top++;
            } else if (req.body.frase == 'mid') {
                mid++;
            }

            //verificar .dano
            if (req.body.dano == "adc") {
                adc++;
            } else if (req.body.dano == 'sup') {
                sup++;
            } else if (req.body.dano == 'jg') {
                jg++;
            } else if (req.body.dano == 'top') {
                top++;
            } else if (req.body.dano == 'mid') {
                mid++;
            }

            //verificar .comentario
            if (req.body.comentario == "adc") {
                adc++;
            } else if (req.body.comentario == 'sup') {
                sup++;
            } else if (req.body.comentario == 'jg') {
                jg++;
            } else if (req.body.comentario == 'top') {
                top++;
            } else if (req.body.comentario == 'mid') {
                mid++;
            }

            let maior = -4
            let qualMaior = ""

            if (adc > maior) {
                maior = adc;
                qualMaior = "adc" + rotaadc
            }
            if (sup > maior) {
                maior = sup
                qualMaior = 'suporte' + rotaSup
            }
            if (jg > maior) {
                maior = jg
                qualMaior = 'jungle'+ rotaJg
            }
            if (top > maior) {
                maior = top
                qualMaior = 'top'+ rotaTop
            }
            if (mid > maior) {
                maior = mid
                qualMaior = 'mid'+ rotaMid
            }

            //update no fez quiz
            try {
                const valores = await bd.updateUserQuiz({
                    id: req.session.idusuario
                })
            } catch (err) {
                res.status(424).send("Não foi possivel atualizar o cadastro tente novamente!")
            }


            //inserindo resultados do quiz
            resposta = req.body.nome + " " + req.body.email + " " + req.body.funcaoLuta + " " + req.body.funcaoJogo + " " + req.body.personagem + " " + req.body.frase + " " + req.body.dano + " " + req.body.comentario
            dados = {
                resposta: resposta,
                idUsuario: req.session.idusuario
            }
            try {
                var valores2 = await bd.insertQuiz(dados)
            } catch (err) {
                res.status(424).send("Não foi possivel atualizar o cadastro tente novamente!")
            }


            //inserindo na jogabilidade
            var rota = ""
            if (qualMaior == ('suporte'+rotaSup) || qualMaior == ("adc"+rotaadc)) {
                rota = "Bot Lane"
            } else if (qualMaior == ('jungle'+rotaJg)) {
                rota = "Selva"
            } else if (qualMaior == ('mid'+rotaMid)) {
                rota = "Meio"
            } else if (qualMaior == ('top'+rotaTop)) {
                rota = 'Topo'
            }

            dados = {
                idJog: req.session.idusuario,
                rota: rota,
                funcao: qualMaior
            }

            try {
                const valores3 = await bd.insertJogabilidade(dados)
            } catch (err) {
                res.status(424).send("Não foi possivel atualizar o cadastro tente novamente! 1")
            }


            //inserindo no campeoes

            var champadc= ["Tristana", "Ashe", "Ezreal", "Sivir", "Caitlyn","MissFortune"],
                champSup = ["Leona", "Thresh", "Nami", "Morgana", "Soraka","Yuumi","Lulu","Lux"],
                champJg = ["Ekko", "Graves", "Kayn", "Fiddlesticks", "Rengar","MasterYi"],
                champTop = ["Illaoi", "Garen", "Riven","Mordekaiser","Malphite","Volibear"],
                champMid = ["Annie","Lux","TwistedFate","MasterYi","Talon","Fizz"]

            let numeros = []
            let campeoes = [];
            if (qualMaior == ('suporte'+rotaSup)) {
                numeros = getRandom(champSup.length, numeros)
                for (i = 0; i < 3; i++) {
                    campeoes[i] = champSup[numeros[i]]
                }
            } else if (qualMaior == ("adc"+rotaadc)) {
                numeros = getRandom(champadc.length, numeros)
                for (i = 0; i < 3; i++) {
                    campeoes[i] = champadc[numeros[i]]
                }
            } else if (qualMaior == ('jungle'+rotaJg)) {
                numeros = getRandom(champJg.length, numeros)
                for (i = 0; i < 3; i++) {
                    campeoes[i] = champJg[numeros[i]]
                }
            } else if (qualMaior == ('mid'+rotaMid)) {
                numeros = getRandom(champMid.length, numeros)
                for (i = 0; i < 3; i++) {
                    campeoes[i] = champMid[numeros[i]]
                }
            } else {
                numeros = getRandom(champTop.length, numeros)
                for (i = 0; i < 3; i++) {
                    campeoes[i] = champTop[numeros[i]]
                }
            }
            dados = {
                email: req.session.usuEmail,
                nomeCampeao: campeoes[0],
                idcampeao: 1
            }

            try {
                var valores4 = await bd.insertCampeoes(dados)
            } catch (err) {
                res.status(424).send("Não foi possivel atualizar o cadastro tente novamente! 2")
            }

            dados = {
                email: req.session.usuEmail,
                nomeCampeao: campeoes[1],
                idcampeao: 2
            }
            try {
                var valores4 = await bd.insertCampeoes(dados)
            } catch (err) {
                res.status(424).send("Não foi possivel atualizar o cadastro tente novamente! 3")
            }


            dados = {
                email: req.session.usuEmail,
                nomeCampeao: campeoes[2],
                idcampeao: 3
            }
            try {
                var valores4 = await bd.insertCampeoes(dados)
            } catch (err) {
                res.status(424).send("Não foi possivel atualizar o cadastro tente novamente! 4")
            }
            console.log('fez quiz ');
            res.redirect("usuarioResultado")
        }
    },

    async updateQuiz(req, res, next) {
        if (!req.session.idusuario) {
            res.redirect('/')
        } else {
            try{
                var adc= 0,
                jg = 0,
                sup = 0,
                top = 0,
                mid = 0;

            //verificar .funcaoluta
            if (req.body.funcaoLuta == "adc") {
                adc++;
            } else if (req.body.funcaoLuta == 'sup') {
                sup++;
            } else if (req.body.funcaoLuta == 'jg') {
                jg++;
            } else if (req.body.funcaoLuta == 'top') {
                top++;
            } else if (req.body.funcaoLuta == 'mid') {
                mid++;
            }

            //verificar .funcaoJogo
            if (req.body.funcaoJogo == "adc") {
                adc++;
            } else if (req.body.funcaoJogo == 'sup') {
                sup++;
            } else if (req.body.funcaoJogo == 'jg') {
                jg++;
            } else if (req.body.funcaoJogo == 'top') {
                top++;
            } else if (req.body.funcaoJogo == 'mid') {
                mid++;
            }

            //verificar .personagem
            if (req.body.personagem == "adc") {
                adc++;
            } else if (req.body.personagem == 'sup') {
                sup++;
            } else if (req.body.personagem == 'jg') {
                jg++;
            } else if (req.body.personagem == 'top') {
                top++;
            } else if (req.body.personagem == 'mid') {
                mid++;
            }

            //verificar .frase
            if (req.body.frase == "adc") {
                adc++;
            } else if (req.body.frase == 'sup') {
                sup++;
            } else if (req.body.frase == 'jg') {
                jg++;
            } else if (req.body.frase == 'top') {
                top++;
            } else if (req.body.frase == 'mid') {
                mid++;
            }

            //verificar .dano
            if (req.body.dano == "adc") {
                adc++;
            } else if (req.body.dano == 'sup') {
                sup++;
            } else if (req.body.dano == 'jg') {
                jg++;
            } else if (req.body.dano == 'top') {
                top++;
            } else if (req.body.dano == 'mid') {
                mid++;
            }

            //verificar .comentario
            if (req.body.comentario == "adc") {
                adc++;
            } else if (req.body.comentario == 'sup') {
                sup++;
            } else if (req.body.comentario == 'jg') {
                jg++;
            } else if (req.body.comentario == 'top') {
                top++;
            } else if (req.body.comentario == 'mid') {
                mid++;
            }

            let maior = -4
            let qualMaior = ""

            if (adc> maior) {
                maior = adc;
                qualMaior = "adc" + rotaadc
            }
            if (sup > maior) {
                maior = sup
                qualMaior = 'suporte' + rotaSup
            }
            if (jg > maior) {
                maior = jg
                qualMaior = 'jungle'+ rotaJg
            }
            if (top > maior) {
                maior = top
                qualMaior = 'top'+ rotaTop
            }
            if (mid > maior) {
                maior = mid
                qualMaior = 'mid'+ rotaMid
            }

            //inserindo resultados do quiz
            resposta = req.body.nome + " " + req.body.email + " " + req.body.funcaoLuta + " " + req.body.funcaoJogo + " " + req.body.personagem + " " + req.body.frase + " " + req.body.dano + " " + req.body.comentario
            dados = {
                respostas: resposta,
                id: req.session.idusuario
            }

            var valores2 = await bd.updateQuiz(dados)
            arr = "quiz"

            //update na jogabilidade
            var rota = ""
            if (qualMaior == ('suporte'+rotaSup) || qualMaior == ("adc"+rotaadc)) {
                rota = "Bot Lane"
            } else if (qualMaior == ('jungle'+rotaJg)) {
                rota = "Selva"
            } else if (qualMaior == ('mid'+rotaMid)) {
                rota = "Meio"
            } else if (qualMaior == ('top'+rotaTop)) {
                rota = 'Topo'
            }

            dados = {
                idJog: req.session.idusuario,
                rota: rota,
                funcao: qualMaior
            }
            const valores3 = await bd.updateJogabilidade(dados)
            arr = "jogab"

            //inserindo no campeoes

            var champadc= ["Tristana", "Ashe", "Ezreal", "Sivir", "Caitlyn","MissFortune"],
            champSup = ["Leona", "Thresh", "Nami", "Morgana", "Soraka","Yuumi","Lulu","Lux"],
            champJg = ["Ekko", "Graves", "Kayn", "Fiddlesticks", "Rengar","MasterYi"],
            champTop = ["Illaoi", "Garen", "Riven","Mordekaiser","Malphite","Volibear"],
            champMid = ["Annie","Lux","TwistedFate","MasterYi","Talon","Fizz"]

            let numeros = []
            let campeoes = [];
            if (qualMaior == ('suporte'+rotaSup)) {
                numeros = getRandom(champSup.length, numeros)
                for (i = 0; i < 3; i++) {
                    campeoes[i] = champSup[numeros[i]]
                }
            } else if (qualMaior == ("adc"+rotaadc)) {
                numeros = getRandom(champadc.length, numeros)
                for (i = 0; i < 3; i++) {
                    campeoes[i] = champadc[numeros[i]]
                }
            } else if (qualMaior == ('jungle'+rotaJg)) {
                numeros = getRandom(champJg.length, numeros)
                for (i = 0; i < 3; i++) {
                    campeoes[i] = champJg[numeros[i]]
                }
            } else if (qualMaior == ('mid'+rotaMid)) {
                numeros = getRandom(champMid.length, numeros)
                for (i = 0; i < 3; i++) {
                    campeoes[i] = champMid[numeros[i]]
                }
            } else {
                numeros = getRandom(champTop.length, numeros)
                for (i = 0; i < 3; i++) {
                    campeoes[i] = champTop[numeros[i]]
                }
            }
            dados = {
                email: req.session.usuEmail,
                nomeCampeao: campeoes[0],
                idcampeao: 1
            }
            var valores4 = await bd.updateCampeoes(dados)
            arr = "idcamp 1"

            dados = {
                email: req.session.usuEmail,
                nomeCampeao: campeoes[1],
                idcampeao: 2
            }

            var valores4 = await bd.updateCampeoes(dados)
            arr = "idcamp 2"
            dados = {
                email: req.session.usuEmail,
                nomeCampeao: campeoes[2],
                idcampeao: 3
            }
            var valores4 = await bd.updateCampeoes(dados)
            arr = "idcamp 3"
            //console.log('update quiz');
            res.redirect("usuarioResultado")
            
        }catch(err){
            console.log(arr)
            res.status(424).send("Não foi possivel atualizar o cadastro tente novamente!")
        }
            }
    },

    sair(req, res, next) {
        req.session.destroy();
        res.redirect('/')
    }
}

function getRandom(max, numeros) {
    
    while (numeros.length < 3) {
        var aleatorio = Math.floor(Math.random() * max);
        if (numeros.indexOf(aleatorio) == -1)
            numeros.push(aleatorio);
    }
    return numeros; 
}