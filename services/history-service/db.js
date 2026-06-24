const { Pool } = require('pg');

module.exports = new Pool({
  host:     process.env.POSTGRES_HOST     || 'localhost',
  port:     Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB       || 'che_rembiu',
  user:     process.env.POSTGRES_USER     || 'cheuser',
  password: process.env.POSTGRES_PASSWORD || 'chepass',
});
