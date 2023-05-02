// criacao das tabela usuario
exports.up = function(knex) {
  return knex.schema.createTable('usuario', table => {
    // tipo do campo, (nome, caso seja necessario informar tbm o numero de caracteres), propriedades
    table.increments('id').primary();
    table.string('nome', 64).notNullable();
    table.string('senha', 80).notNullable().defaultTo('1234567890');
    table.string('email', 256).notNullable().unique();
    table.string('cpf', 11).notNullable().unique();
    table.string('telefone', 13).notNullable().unique();
    })
};

//destruicao da tabela usuario
exports.down = function(knex) {
    return knex.schema.dropTable('usuario')
};
