exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.decimal('balance', 10, 2).defaultTo(0);
    })
    .createTable('items', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.decimal('tradable_price', 10, 2);
      table.decimal('non_tradable_price', 10, 2);
    })
    .createTable('purchases', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('users.id');
      table.integer('item_id').unsigned().references('items.id');
      table.timestamp('purchase_date').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('purchases')
    .dropTable('items')
    .dropTable('users');
};
