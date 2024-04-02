const mysql = require('mysql2')

const constants = require("../constants");

module.exports = dbpool = mysql.createPool({
  host: '192.168.1.110',
  user: constants.DATABASE_USER,
  password: constants.DATABASE_PASS,
  database: 'mayur_db',
  multipleStatements: true
});
