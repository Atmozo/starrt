module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1', // Database host
      user: 'my_user', // Replace with your PostgreSQL user
      password: 'password', // Replace with your PostgreSQL password
      database: 'test', // Replace with your database name
    },
    migrations: {
      directory: './migrations', // Directory for migration files
    },
  },
};
