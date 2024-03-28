const express = require("express");
const userRequest = express.Router();
const cors = require("cors");
userRequest.use(cors());

const userLogger = require('log4js').getLogger('user');
const catchLogger = require('log4js').getLogger('catches');

const mainFn = require("../functions/user");

/*
  method: fetchProfile
  request type: GET
  request body: {}
*/
userRequest.get("/fetchusers", async (req, res) => {
  console.log('fetchusers')
  await mainFn.fetchusers()
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

/* 
  method : createProfile
  request type: POST
*/
userRequest.post("/createuser", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.createuser(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        userLogger.trace('createuser - error thrown')
        userLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('createuser - error thrown')
    catchLogger.error(e)
  }
});
/* 
  method: updateProfile
  request type: POST
  request body: {name:'string', shopName:'string', locality:'string', address:'string', pincode:'int'}
  auth token: req.headers.authorization
  response: message
*/
userRequest.post("/updateProfile", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.updateProfile(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        userLogger.trace('vendor-profile-updateProfile - ' + req.headers.authorization + ' - error thrown')
        userLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('vendor-profile-updateProfile - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: updatePhone
  request type: POST
  request body: {phone:'string'}
  auth token: req.headers.authorization
  response: message
*/
userRequest.post("/updatePhone", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.updatePhone(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        userLogger.trace('vendor-profile-updatePhone - ' + req.headers.authorization + ' - error thrown')
        userLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('vendor-profile-updatePhone - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: changePassword
  request type: POST
  request body: {password:'string'}
  auth token: req.headers.authorization
  response: message
*/
userRequest.post("/changePassword", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.changePassword(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        userLogger.trace('vendor-profile-changePassword - ' + req.headers.authorization + ' - error thrown')
        userLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('vendor-profile-changePassword - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

module.exports = userRequest;
