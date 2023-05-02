//criacao da tabela admin
exports.up = function(knex) {
    return knex.schema.createTable('admins', table => {
        table.increments('id').primary();
        table.integer('usuario_id').notNullable(); //criando uma coluna chamada usuario id
        //dizendo que esta coluna é uma chave estrangeira
        table.foreign('usuario_id').references(`usuario.id`).onUpdate('CASCADE').onDelete('CASCADE'); 
    })
};

//destruicao da tabela admin
exports.down = function(knex) {
    return knex.schema.dropTable('admins')
};
