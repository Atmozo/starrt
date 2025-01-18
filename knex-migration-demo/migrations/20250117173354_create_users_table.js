exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id'); // Primary key
    table.string('name').notNullable(); // User name
    table.string('email').notNullable().unique(); // User email
    table.timestamps(true, true); // created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};

