const express = require("express");
const enrollmentRequest = express.Router();
const cors = require("cors");
enrollmentRequest.use(cors());

const enrollmentLogger = require('log4js').getLogger('enrollment');
const catchLogger = require('log4js').getLogger('catches');

const mainFn = require("../functions/enrollment");

/* 
  method: sendRegistrationAndUpdatePhoneOTP
  request type: POST
  request body: { phone:'string', length:'int' }
  enrollment token: no need
  response: message
*/
enrollmentRequest.post("/sendRegistrationAndUpdatePhoneOTP", async (req, res) => {
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
        enrollmentLogger.trace('vendor-enrollment-sendRegistrationAndUpdatePhoneOTP - ' + body.phone + ' - error thrown')
        enrollmentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('vendor-enrollment-sendRegistrationAndUpdatePhoneOTP - ' + body.phone + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: verifyOTP
  request type: POST
  request body: { phone:'string', otp:'int' }
  enrollment token: no need
  response: message
*/
enrollmentRequest.post("/verifyOTP", async (req, res) => {
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
        enrollmentLogger.trace('vendor-enrollment-verifyOTP - ' + body.phone + ' - error thrown')
        enrollmentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('vendor-enrollment-verifyOTP - ' + body.phone + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: register
  request type: POST
  request body: {name:'string', shopName:'string', phone:'string', password:'string', pincode:'int'}
  enrollment token: no need
  response: message
*/
enrollmentRequest.post("/register", async (req, res) => {
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
        enrollmentLogger.trace('vendor-enrollment-register - ' + body.phone + ' - error thrown')
        enrollmentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('vendor-enrollment-register - ' + body.phone + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: login
  request type: POST
  request body: {phone:'string', password:'string'}
  enrollment token: no need
  response: token
*/
enrollmentRequest.post("/login", async (req, res) => {
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
        enrollmentLogger.trace('vendor-enrollment-login - ' + body.phone + ' - error thrown')
        enrollmentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('vendor-enrollment-login - ' + body.phone + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: sendForgetPasswordOTP
  request type: POST
  request body: {phone:'string', length:'int'}
  enrollment token: no need
  response: {vendorId: int}
*/
enrollmentRequest.post("/sendForgetPasswordOTP", async (req, res) => {
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
        enrollmentLogger.trace('vendor-enrollment-sendForgetPasswordOTP - ' + body.phone + ' - error thrown')
        enrollmentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('vendor-enrollment-sendForgetPasswordOTP - ' + body.phone + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: updatePassword
  request type: POST
  request body: {vendorId:'int', password:'string'}
  enrollment token: no need
  response: message
*/
enrollmentRequest.post("/updatePassword", async (req, res) => {
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
        enrollmentLogger.trace('vendor-enrollment-updatePassword - ' + body.vendorId + ' - error thrown')
        enrollmentLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('vendor-enrollment-updatePassword - ' + body.vendorId + ' - error thrown')
    catchLogger.error(e)
  }
});

module.exports = enrollmentRequest;
