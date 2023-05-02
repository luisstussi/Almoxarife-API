// criacao da tabela itens
exports.up = function(knex) {
    return knex.schema.createTable('itens', table => {
        // tipo do campo, (nome, caso seja necessario informar tbm o numero de caracteres), propriedades
        table.increments('id').primary();
        table.enum('categoria',['escritorio', 'banheiro', 'manutencao', 'laboratorio', 'copa']).notNullable().defaultTo('escritorio');
        table.string('nome', 60).notNullable()
        table.boolean('disponivel').notNullable().defaultTo(true);
        table.text('descricao');
        table.boolean('prioridade').notNullable().defaultTo(false);
        table.integer('ordem_id');
        table.foreign('ordem_id').references('ordens.id').onUpdate('CASCADE').onDelete('CASCADE');
        table.integer('admin_id')
        table.foreign('admin_id').references('admins.id').onUpdate('CASCADE').onDelete('SET NULL')
})
};
// destruicao da tabela itens
exports.down = function(knex) {
    return knex.schema.dropTable('itens');
};
