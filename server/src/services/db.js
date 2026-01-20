const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const requiredEnvVars = ['POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const dbConfig = {
  host: process.env.POSTGRES_HOST || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  max: parseInt(process.env.DB_POOL_MAX, 10) || 20,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS, 10) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS, 10) || 5000,
};

const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 1000;

const connectWithRetry = async (retries = MAX_RETRIES, backoff = INITIAL_BACKOFF_MS) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      console.log('Successfully connected to PostgreSQL database');

      await client.query('SELECT NOW()');
      client.release();
      
      return pool;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      console.warn(isLastAttempt 
        ? `Final connection attempt (${attempt}/${retries}) failed: ${error.message}`
        : `Connection attempt ${attempt}/${retries} failed: ${error.message}. Retrying in ${backoff}ms...`);
      
      if (isLastAttempt) {
        throw new Error(`Failed to connect to PostgreSQL after ${retries} attempts: ${error.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, backoff));
      backoff = Math.min(backoff * 2, 30000);
    }
  }
};

const shutdown = async () => {
  console.log('Shutting down PostgreSQL connection pool...');
  try {
    await pool.end();
    console.log('PostgreSQL connection pool has been shut down');
  } catch (error) {
    console.error('Error while shutting down PostgreSQL connection pool:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('Error executing query:', error.message);
    console.error('Query:', text);
    console.error('Parameters:', params);
    throw error;
  }
};

module.exports = {
  query,
  connectWithRetry,
  pool,
  shutdown
};