const db = require("./db");
const bancoLOL = 2

//verifica usuario e cria uma sessão
module.exports = {
    index(req, res, next) {
        return res.render('index')
    },

    /*Colocar todo codigo de vericacao de login*/
    async login(req, res, next) {
        const valores = await db.selectUserLogin({email: req.body.email, senha: req.body.senha})
        if(valores[0]){
            req.session.idusuario = valores[0].id;
            req.session.usuEmail = valores[0].email;
            req.session.usuario = valores[0].nomeUsuario;
            req.session.imagem = valores[0].imagem
            res.redirect("usuarioSeguranca")
        }else{
           res.status(424).send("Email ou senha incorretos!")
       }
        
    },

    esqueciSenha(req, res, next){
        res.render('esqueciSenha')
    },

    cadastro(req, res, next){
        res.render('Cadastre')
    },

    cadastre(req,res,next){
        console.log('cadastrou');
        res.redirect('/')
    },
    
    recuperacaoSenha(req,res,next){
        console.log('Recuperar senha');
        res.redirect('/')
    },
    
    usuarioSeguranca(req,res,next){
        if(!req.session.idusuario){
            res.redirect('/')
        }else{
            console.log(req.session.idusuario);
           let info = {
                email:req.session.usuEmail,
                usuario:req.session.usuario,
                imagem: req.session.imagem
            }
            res.render("usuarioSeguranca", {info})
        }
    }, 

    usuarioResultado(req,res,next){
        if(!req.session.idusuario){
            res.redirect('/')
        }else{
            let info = {
                email:req.session.usuEmail,
                usuario:req.session.usuario,
                imagem: req.session.imagem
            }
            let dados = [{
                campeao: "Braum - O coração de Freljord",
                descricao:"Abençoado com bíceps gigantescos e um coração maior ainda, Braum é um amado herói Glacinata de Freljord. Cada salão de hidromel ao norte de Frostheld brinda sua força lendária que, pelo que dizem, teria derrubado uma floresta de carvalhos em uma única noite e demolido uma montanha inteira com um soco. Carregando uma antiga porta de cofre encantada como seu escudo, Braum vaga pelo norte congelado como um protetor cheio de entusiasmo, ajudando os necessitados enquanto busca realizar seu sonho de pacificar Freljord.",
                imagem: "/public/images/Braum.jpg"
             },
            {
                campeao: "Rell - A Dama de Ferro",
                descricao:"Produto de um experimento brutal nas mãos da Rosa Negra, Rell é uma arma humana rebelde que está determinada a destruir Noxus. Sua infância foi repleta de sofrimento e horror; a jovem teve que suportar procedimentos indescritíveis para aperfeiçoar e fortalecer seu controle mágico do metal – até que, um dia, empreendeu uma fuga violenta, matando muitos de seus captores no processo. Agora, Rell é tida como criminosa e ataca qualquer soldado noxiano que apareça diante dela. Ao mesmo tempo, procura sobreviventes de sua antiga 'academia', defendendo os fracos enquanto despacha impiedosamente seus antigos instrutores para a morte.",
                imagem: "/public/images/Rell.jpg"
            },
            {
                campeao: "Alistar - O Minotauro",
                descricao:"Um poderoso guerreiro com uma temível reputação, Alistar busca vingança por seu clã, morto pelas mãos do império de Noxus. Apesar de ter sido escravizado e forçado a uma vida de gladiador, sua vontade indestrutível o impediu de se tornar uma fera de verdade. Agora, liberto das correntes dos seus antigos mestres, ele luta pelos oprimidos e desfavorecidos, sua fúria uma arma tão poderosa quanto seus chifres, cascos e punhos.",
                imagem: "/public/images/Alistar.jpg"
            }
        ]
            res.render("usuarioResultado", {info,dados})
        } 
    },

    /*
     * colocar codigo para verificacao de conponentes alterados e de upgrade
     * names dos campos:
     * usuario, telefone, email, celular, avatar, novaSenha
    */
    update(req,res,next){
        if(!req.session.idusuario){
            res.redirect('/')
        }else{
            console.log('deu upgrade');
            res.redirect("/usuarioSeguranca")
        } 
    },

    meuQuiz(req,res,next){
        if(!req.session.idusuario){
            res.redirect('/')
        }else{
            let info = {
                email:req.session.usuEmail,
                usuario:req.session.usuario,
                imagem: req.session.imagem
            }
            res.render("usuarioQuiz", {info})
        } 
    },

    /*
     * Colocar codigo do quiz e colocar isso no banco
     */
    registraQuiz(req,res,next){
        if(!req.session.idusuario){
            res.redirect('/')
        }else{
            console.log('fez quiz');
            res.redirect("usuarioResultado")
        } 
    },

    sair(req,res,next){
        console.log(req.session.idusuario+" saiu")
        req.session.destroy();
        res.redirect('/')
    } 
}
