/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('bookings', function(table) {
    table.increments('id').primary();
    table.integer('slot_id').unsigned().notNullable();
    table.foreign('slot_id').references('slots.id').onDelete('CASCADE');
    table.integer('guide_id').unsigned().notNullable();
    table.foreign('guide_id').references('guides.id').onDelete('CASCADE');
    table.enum('status', ['requested', 'confirmed', 'cancelled', 'completed', 'no_show']).defaultTo('requested');
    table.timestamp('booked_at').defaultTo(knex.fn.now());
    table.timestamp('confirmed_at');
    table.timestamp('cancelled_at');
    table.text('cancellation_reason');
    table.index('slot_id');
    table.index('guide_id');
    table.index('status');
    table.unique(['slot_id', 'guide_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('bookings');
};
