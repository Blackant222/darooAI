
const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const setupDatabase = async () => {
  const client = await pool.connect();
  try {
    const schema = fs.readFileSync('db/schema.sql', 'utf-8');
    await client.query(schema);
    console.log('Database schema created successfully.');
  } catch (error) {
    console.error('Error creating database schema:', error);
  } finally {
    client.release();
  }
};

setupDatabase();
