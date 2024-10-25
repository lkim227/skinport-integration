import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres({
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
});
  
export default sql;
