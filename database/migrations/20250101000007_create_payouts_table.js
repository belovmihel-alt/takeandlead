/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('payouts', function(table) {
    table.increments('id').primary();
    table.integer('guide_id').unsigned().notNullable();
    table.foreign('guide_id').references('guides.id').onDelete('CASCADE');
    table.integer('booking_id').unsigned();
    table.foreign('booking_id').references('bookings.id');
    table.decimal('amount', 10, 2).notNullable();
    table.string('type', 50).notNullable();
    table.enum('status', ['pending', 'paid', 'cancelled']).defaultTo('pending');
    table.timestamp('period_from');
    table.timestamp('period_to');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('paid_at');
    table.index('guide_id');
    table.index('status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('payouts');
};
