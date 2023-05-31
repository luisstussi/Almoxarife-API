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

    app.route('/itens/:id')
        .all(app.config.passport.authenticate())
        .delete(app.api.itens.delet)
        .put(app.api.itens.update)
    
    app.route('/ordens')
        .all(app.config.passport.authenticate())
        .get(app.api.ordens.getAll)
        .post(app.api.ordens.save) 

    app.route('/ordens/:id')
        .all(app.config.passport.authenticate())
        .delete(app.api.ordens.delet)
        .put(app.api.ordens.update)

    app.route('/ordem/search')
        .all(app.config.passport.authenticate())
        .get(app.api.ordens.pesquisaord)

    app.route('/validar/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.ordens.validacao)
        
    app.route('/usuario')
        .all(app.config.passport.authenticate())
        .get(app.api.usuario.getAll)

    app.route('/usuario/:id')
        .all(app.config.passport.authenticate())
        .delete(app.api.usuario.delet)

    app.route('/logtest')
        .all(app.config.passport.authenticate())
        .get(app.api.teste.logado)
}