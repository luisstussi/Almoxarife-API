// criacao da tabela ordens
exports.up = function(knex) {
    return knex.schema.createTable('ordens', table => {
        // tipo do campo, (nome, caso seja necessario informar tbm o numero de caracteres), propriedades
        table.increments('id').primary();
        table.text('justificativa');
        table.text('itens')
        table.boolean('executada').notNullable().defaultTo(false);
        table.integer('usuario_id').notNullable();
        table.integer('admins_id')
        table.foreign('usuario_id').references('usuario.id').onUpdate('CASCADE').onDelete('CASCADE');
        table.foreign('admins_id').references('admins.id').onUpdate('CASCADE').onDelete('CASCADE');
})
};
//destruicao da tabela ordens
exports.down = function(knex) {
        return knex.schema.dropTable('ordens');
};
