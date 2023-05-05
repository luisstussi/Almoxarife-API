const bcrypt = require ('bcrypt-nodejs') //importando biblioteca para criptografar as senhas

module.exports = app => { // sempre trabalharemos dentro de modulos

    // padrao para criptografar senhas
    const obterHash = (password, callback) => { //funcao para descriptografar a senha
        bcrypt.genSalt (10, (err, salt) => { 
            bcrypt.hash (password, salt, null, (err, hash) => callback(hash))
        })
    }

const save = async (req, res) => { // funcao de cricao de criptografia
        obterHash (req.body.senha, hash => {
        const senha = hash
         app.db('usuario')
        .insert ({
            nome: req.body.nome,
            email: req.body.email.toLowerCase(),
            cpf: req.body.cpf,
            telefone: req.body.telefone,
            senha: senha, // senha criptografada
        })
        .then(_ => res.status(204).send())
        .catch(err => res.status(400).json(err))
    })
}

const getAll = async (req, res) => {
    const admins = await app.db('admins').where('usuario_id', req.user.id).first()
        if(!admins) { 
            res.status(403).send('Acesso nao autorizado')
        } else {
            app.db('usuario').then(usuarios => res.status(200).json(usuarios))
        }
} 

    return {save, getAll} // exportando
}
