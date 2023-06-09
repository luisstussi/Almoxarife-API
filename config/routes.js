// criacao das rotas da api
module.exports = app => {
    app.get('/teste', app.api.teste.server)
    app.post('/signup', app.api.usuario.save)

    app.post('/signin', app.api.auth.signin)
    
    app.route('/itens')
        .all(app.config.passport.authenticate())
        .get(app.api.itens.getAll)
        .post(app.api.itens.save)
    
    app.route('/itens/search')
        .all(app.config.passport.authenticate())
        .get(app.api.itens.pesquisa)
        .put(app.api.itens.update)

    app.route('/itens/:id')
        .all(app.config.passport.authenticate())
        .delete(app.api.itens.delet)
        
    app.route('/ordens')
        .all(app.config.passport.authenticate())
        .get(app.api.ordens.getAll)
        .post(app.api.ordens.save) 

    app.route('/ordemz/:id')
    
        .all(app.config.passport.authenticate())
        .delete(app.api.ordens.delet)
        
    app.route('/ordem/search')
        .all(app.config.passport.authenticate())
        .get(app.api.ordens.pesquisaord)
        .put(app.api.ordens.update)

    app.route('/validaordem/:id')
        .all(app.config.passport.authenticate())
        .post(app.api.ordens.validacao)
        
    app.route('/usuario')
        .all(app.config.passport.authenticate())
        .get(app.api.usuario.getAll)

    app.route('/usuario/:id')
        .all(app.config.passport.authenticate())
        .delete(app.api.usuario.delet)
        .put(app.api.usuario.update)

    app.route('/logtest')
        .all(app.config.passport.authenticate())
        .get(app.api.teste.logado)
        
    app.route('/user/search')
        .all(app.config.passport.authenticate())
        .get(app.api.usuario.pesquisauser)

}
