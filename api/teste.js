module.exports = app => { // sempre trabalharemos dentro de modulos
    const server = async (req, res) => { //funcao para verificar se o sistema esta funcionando
        console.log(req.query.nathan)
         const nathan = req.query.nathan
         const pesq = await app.db('itens').where({categoria:nathan})
         console.log(pesq)
        return res.status(200).json(pesq)
    }
    const logado = async (req, res) => {
        const usuario = req.user;
        const admins = await app.db('admins').where('usuario_id', req.user.id).first()
        if (!usuario){
            return res.status(404)
        } else if(!admins) {
            return res.status(200).json({user: "admin"})
        } else {
            return res.status(200).json({user: "normal"})
        } 
    }
    return {server, logado}
}