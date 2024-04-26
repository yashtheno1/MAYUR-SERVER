const express = require("express");
const attendanceRequest = express.Router();
const cors = require("cors");
attendanceRequest.use(cors());

const attendanceLogger = require('log4js').getLogger('attendance');
const catchLogger = require('log4js').getLogger('catches');

const mainFn = require("../functions/attendance");

/*
  method: fetchAttendance
  request type: Get
  request body: {
    userId: 'int'
  }
  auth token: not required
  response: {
    success: 'boolean',
    message: 'string',
    attendance: [{
      ID: 'int',
      Date: 'string',
      Time: 'string',
      Type: 'string'
    }, ...]
  }
*/
attendanceRequest.get("/fetchAttendance", async (req, res) => {
  var query = req.query;
  try {
    await mainFn.fetchAttendance(query)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        attendanceLogger.trace('customer-attendance-fetchAttendance - ' + query.userId + ' - error thrown')
        attendanceLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-attendance-fetchAttendance - ' + query.userId + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: fetchCustomerDetails
  request type: Get
  request body: {}
  auth token: req.headers.authorization
  response: message
*/
attendanceRequest.get("/fetchCustomerDetails", async (req, res) => {
  await mainFn.fetchCustomerDetails(req.headers.authorization)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

/* 
  method: updateattendance
  request type: POST
  request body: {name:'string'}
  auth token: req.headers.authorization
  response: message
*/
attendanceRequest.post("/updateattendance", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.updateattendance(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        attendanceLogger.trace('customer-attendance-updateattendance - ' + req.headers.authorization + ' - error thrown')
        attendanceLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-attendance-updateattendance - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: updatePhone
  request type: POST
  request body: {phone:'int'}
  auth token: req.headers.authorization
  response: message
*/
attendanceRequest.post("/updatePhone", async (req, res) => {
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
        attendanceLogger.trace('customer-attendance-updateattendance - ' + req.headers.authorization + ' - error thrown')
        attendanceLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-attendance-updateattendance - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: changePassword
  request type: POST
  request body: {phone:'int',password:'string'}
  auth token: req.headers.authorization
  response: message
*/
attendanceRequest.post("/changePassword", async (req, res) => {
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
        attendanceLogger.trace('customer-attendance-changePassword - ' + req.headers.authorization + ' - error thrown')
        attendanceLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-attendance-changePassword - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: addAddress
  request type: POST
  request body: {address:"string",locality:"string",pincode:'int'}
  auth token: req.headers.authorization
  response: message
*/
attendanceRequest.post("/addAddress", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.addAddress(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        attendanceLogger.trace('customer-attendance-addAddress - ' + req.headers.authorization + ' - error thrown')
        attendanceLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-attendance-addAddress - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: updateAddress
  request type: POST
  request body: {address:"string",locality:"string",pincode:'int',addressId:"int"}
  auth token: req.headers.authorization
  response: message
*/
attendanceRequest.post("/updateAddress", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.updateAddress(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        attendanceLogger.trace('customer-attendance-updateAddress - ' + req.headers.authorization + ' - error thrown')
        attendanceLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-attendance-updateAddress - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: deleteAddress
  request type: POST
  request body: {addressId:"int"}
  auth token: req.headers.authorization
  response: message
*/
attendanceRequest.post("/deleteAddress", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.deleteAddress(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        attendanceLogger.trace('customer-attendance-deleteAddress - ' + req.headers.authorization + ' - error thrown')
        attendanceLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-attendance-deleteAddress - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

module.exports = attendanceRequest;
