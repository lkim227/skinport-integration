exports.up = function(knex) {
    return knex.schema
      .createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.decimal('balance', 10, 2).defaultTo(0);
      })
      .createTable('items', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.decimal('min_price', 10, 2);
        table.decimal('max_price', 10, 2);
        table.integer('quantity').unsigned();
      })
      .createTable('purchases', (table) => {
        table.increments('id').primary();
        // table.integer('user_id').unsigned().references('users.id');
        // table.integer('item_id').unsigned().references('items.id');
        table.integer('user_id').unsigned();
        table.integer('item_id').unsigned();
        table.timestamp('purchase_date').defaultTo(knex.fn.now());
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTable('purchases')
      .dropTable('items')
      .dropTable('users');
  };
  