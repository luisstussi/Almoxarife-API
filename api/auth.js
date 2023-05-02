//autentificacao do usuario

const { authSecret } = require ('../.env') //importando o ambiente da aplicacao
const jwt = require ('jwt-simple') //criar o token de acesso
const bcrypt = require ('bcrypt-nodejs') //criptografia

//sempre tranlharemos dentro do modulo
module.exports = app => { 
    const signin = async (req, res) => { //funcao de autentificacao do login
        if (!req.body.email || !req.body.senha) { //verificando se os parametros estao preenchidos
            return res.status(400).send('dados incompletos') //caso n estejam, retornam dados incompletos
        }
    
    const user = await app.db('usuario').whereRaw ("LOWER(email) = LOWER(?)", req.body.email).first() //pesquisando no banco de dados o primeiro email informado

        if (user) { //se o usuario + email existir
            bcrypt.compare(req.body.senha, user.senha, (err, isMatch) => { //ele compara a senha informada com a senha criptografada no banco de dados
                if (err || !isMatch) { //se nao forem iguais
                    return res.status(401).send('senha invalida') // retorna senha invalida
                }
                const payload = { //pacote que ira virar o token
                    id: user.id,
                    nome: user.nome,
                    email:user.email,
                }
                res.json({ //resposta que ira enviar para o usuario
                    nome:user.nome,
                    email:user.email,
                    token:jwt.encode(payload, authSecret), //token que sera usado para autentificacao
                })
            })
        } else {
            return res.status(404).send('usuario nao cadastrado')//caso nao encontre o usuario com o email informado, retorna usuario n cadastrado
        }

    }

    return {
        signin // exporta a funcao signin
    }
}