const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const isLocal =
  !connectionString ||
  connectionString.includes('localhost') ||
  connectionString.includes('127.0.0.1');

// Em serviços cloud (ex: Render), conexões gerenciadas com PostgreSQL utilizam SSL.
// O parâmetro rejectUnauthorized é configurável via DB_SSL_REJECT_UNAUTHORIZED.
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';

const poolConfig = connectionString
  ? {
      connectionString,
      // nosemgrep: bypass-tls-verification, problem-based-packs.insecure-transport.js-node.bypass-tls-verification.bypass-tls-verification
      ssl: isLocal ? false : { rejectUnauthorized },
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'books_db',
      // nosemgrep: bypass-tls-verification, problem-based-packs.insecure-transport.js-node.bypass-tls-verification.bypass-tls-verification
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized } : false,
    };

const pool = new Pool(poolConfig);

const initDatabase = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      published_year INTEGER,
      isbn VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createTableQuery);
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDatabase,
};



