const { Pool } = require("pg");

let options;

if (process.env.DATABASE_URL) {
    options = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    }
} 

const pool = new Pool(options);

module.exports = pool;