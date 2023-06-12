module.exports = app => { // sempre trabalharemos dentro de modulos
    const save = async (req,res) => { //funcao para criar os itens
        if(req.body.nome == null) { //se o campo nome for vazio
            return res.status(400).send('Campo nome nao informado') // retorna erro: campo nome nao informado
        }

        //se o campo categoria for diferente das categorias delimitadas
        if(!(req.body.categoria === "banheiro"
            ||req.body.categoria === "copa"
            ||req.body.categoria === "laboratorio"
            ||req.body.categoria === "manutencao"
            ||req.body.categoria === "escritorio"
        )) { 
            return res.status(400).send('Categoria invalida ou inexistente') //retorna erro: Categoria invalida ou inexistenteo
        }

        //pesquisa no banco de dados para verificar se o usuario que esta acessando e admin
        const admin = await app.db('admins').where({ usuario_id:req.user.id}).first()
        if(!admin){ //se nao for
            return res.status(401).send('Acesso nao autorizado')//retorna erro: acesso nao autorizado
        }
        req.body.admin_id = admin.id //acrescentando no body da requisicao uma variavel admin_id que e o id do admin pesquisado
        app.db('itens') //inserindo o body da requisicao no banco de dados
        .insert(req.body)
        .then(_ => res.status(201).send())
        .catch(err => res.status(400).json(err))
        
    }
    const getAll = (req,res) => { //funcao para listar os itens
        // verificando no banco de dados a disponibilidade do item
        app.db('itens').where({disponivel:true}).then(itens => res.status(200).json(itens))
    }
    const delet = (req,res) => { //funcao para deletar os itens
        app.db('itens') //pesquisando no banco de dados
            .where({ id: req.params.id})
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0){   //se a quantidade de linhas deletada for maior que 0
                    return res.status(204).send() //sucesso
                } else { //senao
                    const msg = `Item nao encontrado ${req.params.id}.` //retorna erro: item nao encontrado
                    return res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).send(msg))
    }

    const update = (req,res) => {//funcao para editar itens
        let querybuilder = {}; //o querybuilder serve para adicionar as variaveis que serao modificadas no banco de dados
        if(req.body.nome) querybuilder.nome = req.body.nome; //caso o usuario informe o nome, acrescentar no querybuilder
        if(req.body.descricao) querybuilder.descricao = req.body.descricao;//caso o usuario informe a descricao, acrescentar no querybuilder
        if(req.body.categoria) querybuilder.categoria = req.body.categoria;//caso o usuario informe a categoria, acrescentar no querybuilder
        
        // delimitando as categorias
        if( req.body.categoria != "copa" || // caso a categoria n seja copa, ou
            req.body.categoria != "banheiro" || // caso a categoria n seja banheiro, ou
            req.body.categoria != "manutencao" || // caso a categoria n seja manutencao, ou
            req.body.categoria != "laboratorio" || // caso a categoria n seja laboratorio, ou
            req.body.categoria != "escritorio"){ // caso a categoria n seja escritorio
                return res.status(400).send('Categoria invalida') // retorna erro: categoria invalida
            }

        app.db('itens')// pesquisando no banco de dados na tabela itens
            .where({ id: req.params.id})
            .update({
                // os tres pontos servem para adicionar um json  dentro de outro json
                ...querybuilder
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }


    const pesquisa = async (req, res) => {
             const pesqcat = req.query.cat
             const pesqnome = req.query.nome
             const pesqdisp = req.query.disp
             const pesqprio = req.query.prio
             const pesqdesc = req.query.desc
             const pesqordid = req.query.ordid
             const pesqitid = req.query.itid
             const pesqadid = req.query.adid
        
            var querybuilder = {}

             if (req.query.cat) {querybuilder.categoria = pesqcat}
             if (req.query.nome) {querybuilder.nome = pesqnome}
             if (req.query.disp) {querybuilder.disponivel = pesqdisp}
             if (req.query.prio) {querybuilder.prioridade = pesqprio}
             if (req.query.desc) {querybuilder.descricao = pesqdesc}
             if (req.query.ordid) {querybuilder.ordem_id = pesqordid}
             if (req.query.itid) {querybuilder.id = pesqitid}
             if (req.query.adid) {querybuilder.admin_id = pesqadid}

             const pesq = await app.db('itens').where(querybuilder)
                                            
            return res.status(200).json(pesq)
    }



    return { save,getAll,delet,update, pesquisa } // exportando as funcoes de criar, listar, deletar, editar e pesquisar
}