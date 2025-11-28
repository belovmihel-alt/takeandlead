/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('qr_tokens', function(table) {
    table.increments('id').primary();
    table.integer('guide_id').unsigned().notNullable();
    table.foreign('guide_id').references('guides.id').onDelete('CASCADE');
    table.text('token').notNullable().unique();
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.boolean('revoked').defaultTo(false);
    table.index('guide_id');
    table.index('token');
    table.index('expires_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('qr_tokens');
};
