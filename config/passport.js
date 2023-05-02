// estrategia de autentificacao do jwt

const { authSecret } = require ('../.env');
const passport = require ('passport');
const passportJwt = require ('passport-jwt');
const { Strategy, ExtractJwt } = passportJwt;

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }

    const strategy = new Strategy (params, (payload, done) => {
        app.db('usuario')
            .where({id: payload.id})
            .first()
            .then(user => {
                if (user) { // pedindo para informar o usuario e o email
                    done (null, {id:user.id, email: user.email})
                } else {
                    done (null, false)
                }
            })
            .catch(err => done (err, false))
    })

    passport.use(strategy)

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', {session:false })
    }
}