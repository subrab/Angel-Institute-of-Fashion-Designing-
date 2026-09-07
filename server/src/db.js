const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  // A background/idle client failed -- log it but don't crash the whole process.
  console.error('Unexpected error on idle database client', err);
});

module.exports = { pool };
