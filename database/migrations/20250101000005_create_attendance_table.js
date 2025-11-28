/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('attendance', function(table) {
    table.increments('id').primary();
    table.integer('booking_id').unsigned().notNullable();
    table.foreign('booking_id').references('bookings.id').onDelete('CASCADE');
    table.integer('scanner_id').unsigned().notNullable();
    table.foreign('scanner_id').references('users.id');
    table.timestamp('scanned_at').defaultTo(knex.fn.now());
    table.enum('status', ['arrived', 'left']).defaultTo('arrived');
    table.index('booking_id');
    table.index('scanned_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('attendance');
};
