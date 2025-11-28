/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('guides', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().unique();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.string('full_name', 255).notNullable();
    table.string('photo_url', 500);
    table.string('inn', 20);
    table.text('bio');
    table.jsonb('languages').defaultTo('[]');
    table.jsonb('tags').defaultTo('[]');
    table.decimal('rating', 3, 2).defaultTo(0);
    table.string('status', 50).defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index('user_id');
    table.index('status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('guides');
};
