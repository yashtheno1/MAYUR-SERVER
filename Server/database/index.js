const mysql = require('mysql2')

const constants = require("../constants");

module.exports = dbpool = mysql.createPool({
  host: constants.DATABASE_HOST,
  user: constants.DATABASE_USER,
  password: constants.DATABASE_PASS,
  database: constants.DATABASE,
  multipleStatements: true
});
