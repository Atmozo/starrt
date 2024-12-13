require('dotenv').config(); // Load env vars from .env file

// Access environment variables
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const secretKey = process.env.SECRET_KEY;
const port = process.env.PORT;

console.log(`Database URL: ${dbHost}:${dbPort}/${dbName}`);
console.log(`Secret Key: ${secretKey}`);
console.log(`App is running on port: ${port}`);
