module.exports = app => { // sempre trabalharemos dentro de modulos
    const server = async (req, res) => { //funcao para verificar se o sistema esta funcionando
        console.log(req.query.nathan)
         const nathan = req.query.nathan
         const pesq = await app.db('itens').where({categoria:nathan})
         console.log(pesq)
        return res.status(200).json(pesq)
    }
    return {server}
}