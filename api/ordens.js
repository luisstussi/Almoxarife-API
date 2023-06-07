module.exports = app => { // sempre trabalharemos dentro de modulos
    const getAll = async (req,res) => { // funcao para listar todas as ordes
        //pesquisando se o usuario é admin
        const admins = await app.db('admins').where('usuario_id', req.user.id).first()
        if(!admins) { //se nao for
            //mostrar apenas ordens criadas pelo mesmo usuario
            app.db('ordens').where('usuario_id', req.user.id).then(ordens => res.status(200).json(ordens))
        } else { //caso seja admin
            app.db('ordens').then(ordens => res.status(200).json(ordens)) // mostrar todas as ordens
        }
    }

    const pesquisaord = async (req, res) => {
        const pesqjust = req.query.just
        const pesqex = req.query.ex
        const pesquser = req.query.usuario_id
        const pesqadm = req.query.adm
        const pesqid = req.query.id
   
       var querybuilder = {}
       console.log(req.query.id)
       console.log(pesqid)

        if (req.query.just) {querybuilder.justificativa = pesqjust}
        if (req.query.ex) {querybuilder.executada = pesqex}
        if (req.query.user) {querybuilder.usuario_id = pesquser}
        if (req.query.adm) {querybuilder.admins_id = pesqadm}
        if (req.query.id) {querybuilder.id = pesqid}

        console.log(querybuilder)
        console.log(querybuilder)
        const admin = await  app.db('admins').where({ usuario_id:req.user.id}).first();
        let pesq = {};
        if(admin) {
             pesq = await app.db('ordens').where(querybuilder)
        } else {
             pesq = await app.db('ordens').where({usuario_id:req.user.id}).where(querybuilder)
        }
                                    
        return res.status(200).json(pesq) 
    
}

    // o async serve para conseguirmos utilizar mais de uma funcao no banco de dados
    const save = async (req,res) => { // funcao para criar
        if(req.body.justificativa === null) { //caso o campo justificativa esteja vazio
            return res.status(400).send('Justificativa necessaria') // retorna erro: justificativa necessaria
        }
        if(req.body.itens === null){ // caso o campo itens esteja vazio
            return res.status(400).send('Nao existe itens solicitados') // retorna erro: nao existe itens solicitados
        }

        const itens = await app.db('itens').whereIn('id', req.body.itens) // esperar a requisicao do banco de dados
        var vetItens = []; //vetor de variaveis de itens disponiveis
        var vetErrados = []; //vetor de variaveis de itens nao disponiveis

        //ciclo for para verificar se o id da ordem de cada um dos itens pesquisados é nulo ou nao
        for (var i = 0;i < itens.length; i++){ // o ciclo vai de 0 ate o tamanho do numero do vetor de itens
            if(itens[i].ordem_id === null){ // se o id da ordem for nulo
                vetItens.push(itens[i].id) // o item esta disponivel, e sera adicionado no vetor vetItens
            }else{ //senao
                vetErrados.push(itens[i].id)// o item esta indisponive e sera adicionado no vetor vetErrados

            }
        }

        if(vetItens.length < 1){ //se nao tiver itens no vetItens
            return res.status(400).send('Itens nao disponiveis')// retorno erro: itens nao disponiveis
        }
        const ordem = await app.db('ordens').returning('id').insert( //criando uma ordem com a justificativa dada pelo usuario
            {
                justificativa: req.body.justificativa, //justificativa dada
                usuario_id: req.user.id // id do usuario que a criou
            })

        // a mesma coisa que a funcao abaixo dele, porem mais facil, porem maior
        //for(var i = 0; i < vetItens.length; i++) {
            //await app.db('itens').where({id:vetItens[i]}).update({ordem_id:ordem[0].id})
        //} 
        // atualizando os itens que foram alocados para indisponiveis
        await app.db('itens').whereIn('id',vetItens).update({ordem_id:ordem[0].id,disponivel:false})
        // Caso consiga alocar, retorna: foram alocados os itens (mostra os itens), caso nao consiga, retorna
        // mas nao foi possivel alocar os itens (mostra os itens)
        res.status(200).send(`Foram alocados os itens ${vetItens} mas nao foi possivel alocar os itens ${vetErrados}`)
    }

    const update = async (req,res) => { //funcao para editar as ordens
        let querybuilder = {}; //o querybuilder serve para adicionar as variaveis que serao modificadas no banco de dados
        // caso o usuario informe a justificativa, acrescentar a justificativa no querybuilder
        if(req.body.justificativa) querybuilder.justificativa = req.body.justificativa; 
        const ordem = await app.db('ordens').where({id:req.params.id}).first() // pesquisando a primeira ordem identificada pelo id
        if(!ordem){ // se nao encontrar a ordem pelo id
            return res.status(404).send('Ordem nao encontrada') // retorna erro: ordem nao encontrada
        }

        app.db('ordens') //pesquisando no banco de dados da tabela ordens
            .where({ id: req.params.id})
            .update({
                // os tres pontos servem para adicionar um json  dentro de outro json
                ...querybuilder
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
        
    }
    const delet = (req,res) => { // funcao para deletar ordens
        app.db('ordens') //pesquisando no banco de dados
            .where({ id: req.params.id})
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0){ //se o numero de linhas for maior que 0
                    return res.status(204).send() //sucesso
                } else { //senao
                    const msg = `Ordem nao encontrado ${req.params.id}` // retorna erro:ordem nao encontrada
                    return res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).send(err))
    }

    const validacao = async (req,res) => { //funcao de validacao
        console.log("estou aqui!!")
        const admins = await app.db('admins').where('usuario_id',req.user.id).first() // verificando na tabela admin se o usuario logado é admin
        console.log(admins)
        if(!admins) { // se nao for
            return res.status(401).send('Apenas admins podem validar') // retorna erro: apenas admins podem validar
        }
        const ordem = await app.db('ordens').where('id',req.params.id).first() // pesquisando ordem pelo id
        console.log(ordem)
        if(!ordem){ //se nao encontrar
            return res.status(404).send('Ordem nao encontrada') // retorna erro: ordem nao encontrada
        }
        if(ordem.admins_id !== null){ //se  o campo admin id do admin for diferente de nulo
            return res.status(406).send('Nao e permitido autorizar a mesma ordem') //retorna ordem: nao e permitido autorizar a mesma ordem
        }
        await app.db('ordens').where({ id:req.params.id}).update({ admins_id:admins.id, executada:true}) //atualizando o admin na ordens

        res.status(200).send()      
    }


        return { getAll,save,update,delet,validacao,pesquisaord} //exportando funcoes para: listar, criar, editar, deletar e validar
}