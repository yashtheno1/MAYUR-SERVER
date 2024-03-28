const express = require("express");
const agentRequest = express.Router();
const cors = require("cors");
agentRequest.use(cors());

const agentLogger = require('log4js').getLogger('agent');
const catchLogger = require('log4js').getLogger('catches');

const mainFn = require("../functions/agent");

/* 
  method: sendRegistrationAndUpdatePhoneOTP
  request type: POST
  request body: { phone:'string', length:'int' }
  agent token: no need
  response: message
*/
agentRequest.post("/sendRegistrationAndUpdatePhoneOTP", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.sendRegistrationAndUpdatePhoneOTP(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('customer-agent-sendRegistrationAndUpdatePhoneOTP - ' + body.phone + ' - error thrown')
        agentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-agent-sendRegistrationAndUpdatePhoneOTP - ' + body.phone + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: verifyOTP
  request type: POST
  request body: { phone:'string', otp:'int' }
  agent token: no need
  response: message
*/
agentRequest.post("/verifyOTP", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.verifyOTP(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('customer-agent-verifyOTP - ' + body.phone + ' - error thrown')
        agentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-agent-verifyOTP - ' + body.phone + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: register
  request type: POST
  request body: {name:'string', phone:'string', password:'string'}
  agent token: no need
  response: message
*/
agentRequest.post("/register", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.register(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('customer-agent-register - ' + body.phone + ' - error thrown')
        agentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-agent-register - ' + body.phone + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: login
  request type: POST
  request body: {phone:'string', password:'string'}
  agent token: no need
  response: token
*/
agentRequest.post("/login", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.login(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('customer-agent-login - ' + body.phone + ' - error thrown')
        agentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-agent-login - ' + body.phone + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: sendForgetPasswordOTP
  request type: POST
  request body: {phone:'string', length:'int'}
  agent token: no need
  response: {customerId: int}
*/
agentRequest.post("/sendForgetPasswordOTP", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.sendForgetPasswordOTP(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('customer-agent-sendForgetPasswordOTP - ' + body.phone + ' - error thrown')
        agentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-agent-sendForgetPasswordOTP - ' + body.phone + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: updatePassword
  request type: POST
  request body: {customerId:'int', password:'string'}
  agent token: no need
  response: message
*/
agentRequest.post("/updatePassword", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.updatePassword(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('customer-agent-updatePassword - ' + body.customerId + ' - error thrown')
        agentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-agent-updatePassword - ' + body.customerId + ' - error thrown')
    catchLogger.error(e)
  }
});

module.exports = agentRequest;
