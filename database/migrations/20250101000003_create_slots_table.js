/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('slots', function(table) {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description');
    table.timestamp('start_datetime').notNullable();
    table.timestamp('end_datetime').notNullable();
    table.integer('duration_min').notNullable();
    table.string('language', 10).defaultTo('ru');
    table.string('hall', 100);
    table.integer('capacity').defaultTo(1);
    table.decimal('base_fee', 10, 2).notNullable();
    table.jsonb('bonus_json');
    table.boolean('requires_approval').defaultTo(false);
    table.integer('created_by').unsigned().notNullable();
    table.foreign('created_by').references('users.id');
    table.enum('status', ['open', 'assigned', 'closed', 'cancelled']).defaultTo('open');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index('start_datetime');
    table.index('status');
    table.index('language');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('slots');
};
