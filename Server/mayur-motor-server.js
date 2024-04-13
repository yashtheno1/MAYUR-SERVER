const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 5088;
global.__basedir = __dirname;

const log4js = require('log4js');
log4js.configure({
  appenders: {
    server: { type: 'dateFile', filename: 'logs/server/server.log', pattern: '.yyyy-MM-dd' },
    catches: { type: 'dateFile', filename: 'logs/catches/catches.log', pattern: '.yyyy-MM-dd' },
    user: { type: 'dateFile', filename: 'logs/user/user.log', pattern: '.yyyy-MM-dd' },
    agent: { type: 'dateFile', filename: 'logs/user/agent.log', pattern: '.yyyy-MM-dd' },
    attendance: { type: 'dateFile', filename: 'logs/user/attendance.log', pattern: '.yyyy-MM-dd' },
    enrollment: { type: 'dateFile', filename: 'logs/user/enrollment.log', pattern: '.yyyy-MM-dd' },
    payments: { type: 'dateFile', filename: 'logs/user/payments.log', pattern: '.yyyy-MM-dd' },
    others: { type: 'dateFile', filename: 'logs/user/others.log', pattern: '.yyyy-MM-dd' }
  },

  categories: {
    default: { appenders: ['server'], level: 'trace' },
    catches: { appenders: ['catches'], level: 'trace' },
    agent: { appenders: ['agent'], level: 'trace' },
    attendance: { appenders: ['attendance'], level: 'trace' },
    enrollment: { appenders: ['enrollment'], level: 'trace' },
    payments: { appenders: ['payments'], level: 'trace' },
    others: { appenders: ['others'], level: 'trace' }
  }
});
const serverLogger = log4js.getLogger('server');

try {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  var userRequest = require("./https/user");
  app.use('/userRequest', userRequest);
  var agentRequest = require("./https/agent");
  app.use('/agentRequest', agentRequest);
  var attendanceRequest = require("./https/attendance");
  app.use('/attendanceRequest', attendanceRequest);
  var enrollmentRequest = require("./https/enrollment");
  app.use('/enrollmentRequest', enrollmentRequest);
  var paymentsRequest = require("./https/payments");
  app.use('/paymentRequest', paymentsRequest);
  var other = require("./https/other");
  app.use('/other', other);

  app.listen(port, () => {
    console.log("Server is running on port: " + port)
    serverLogger.debug("Server is running on port: " + port)
  });

} catch (e) {
  serverLogger.error(e);
}