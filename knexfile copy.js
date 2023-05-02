// padrao
//mudar as informacoes para a do projeto
module.exports = {

    client: 'postgresql',
    connection: {
      database: 'seuDatabase',
      user:     'seuUsuario',
      password: 'suaSenha'
    },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'seuDatabase',
      user:     'seuUsuario',
      password: 'suaSenha'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'seuDatabase',
      user:     'seuUsuario',
      password: 'suaSenha'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
