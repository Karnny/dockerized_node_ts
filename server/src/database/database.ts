require("dotenv").config();

var mysql = require("mysql");
var util = require("util");

const DB_HOST: string =
  process.env.DB_HOST === undefined
    ? process.env.MYSQL_HOST_LOCAL || process.env.MYSQL_HOST_DOCKER
    : process.env.DB_HOST;

var pool = mysql.createPool({
  host: DB_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
  connectionLimit: 10,
  waitForConnections: true
});

console.log(`DB HOST: ${DB_HOST}`);
console.log(`DB PORT: ${process.env.MYSQL_PORT}`);

const maxRetries = 10; // Maximum number of retries

function getConnection(retryCount = 0) {
  pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.error("Database connection was closed.");
      } else if (err.code === "ER_CON_COUNT_ERROR") {
        console.error("Database has too many connections.");
      } else if (err.code === "ECONNREFUSED") {
        console.error("Database connection was refused.");
      }

      if (retryCount < maxRetries) {
        console.log(`Attempt ${retryCount + 1}: Retrying...`);
        setTimeout(() => getConnection(retryCount + 1), 3000); // Retry after 2 seconds
      } else {
        console.log("Max retries reached, failed to connect to database.");
      }
    } else if (connection) {
      console.log("Successfully connected to the database.");
      connection.release();
    }
  });
}

// Initial call to the function
getConnection();

pool.query = util.promisify(pool.query);

module.exports = pool;
