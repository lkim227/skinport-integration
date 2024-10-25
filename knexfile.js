module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'datalouna'
    },
    migrations: {
      directory: './migrations',
    },
  },
};
