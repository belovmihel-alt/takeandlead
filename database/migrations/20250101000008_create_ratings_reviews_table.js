/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('ratings_reviews', function(table) {
    table.increments('id').primary();
    table.integer('booking_id').unsigned().notNullable();
    table.foreign('booking_id').references('bookings.id').onDelete('CASCADE');
    table.integer('guide_id').unsigned().notNullable();
    table.foreign('guide_id').references('guides.id').onDelete('CASCADE');
    table.integer('rating').notNullable();
    table.text('review');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index('guide_id');
    table.index('rating');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('ratings_reviews');
};
