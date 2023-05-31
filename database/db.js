const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'USER',
  password: 'PASSWORD',
  database: 'DATABASE',
  port: 5432,
});


module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(),
  };