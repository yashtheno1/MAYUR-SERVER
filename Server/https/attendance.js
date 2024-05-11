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
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-attendance-fetchAttendance - ' + query.userId + ' - error thrown')
    catchLogger.error(e)
  }
});

/*
  method: addAttendance
  request type: POST
  request body: {
    enrollmentId: 'int',
    type: 'string'
  }
  auth token: not required
  response: {
    success: 'boolean',
    message: 'string'
  }
*/
attendanceRequest.get("/addAttendance", async (req, res) => {
  var body = req.query;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.addAttendance(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        attendanceLogger.trace('customer-attendance-addAttendance - ' + body.enrollmentId + ' - error thrown')
        attendanceLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-attendance-addAttendance - ' + body.enrollmentId + ' - error thrown')
    catchLogger.error(e)
  }
});

/*
  method: updateAttendance
  request type: POST
  request body: {
    attendanceId: 'int'
  }
  auth token: not required
  response: {
    success: 'boolean',
    message: 'string'
  }
*/
attendanceRequest.post("/updateAttendance", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.updateAttendance(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        attendanceLogger.trace('customer-attendance-updateAttendance - ' + body.attendanceId + ' - error thrown')
        attendanceLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-attendance-updateAttendance - ' + body.attendanceId + ' - error thrown')
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
      return res.status(500).send(err);
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
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('customer-attendance-updateattendance - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});
/*
method: fetchalluserAttendance
request type: Get
request body: {}
auth token: req.headers.authorization
response: message
*/
attendanceRequest.get("/fetchalluserAttendance", async (req, res) => {
  await mainFn.fetchalluserAttendance(req.query)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

/* 
method: latestattendance
request type: Get
request body: {}
auth token: req.headers.authorization
response: message
*/
attendanceRequest.get("/latestattendance", async (req, res) => {
  await mainFn.latestattendance(req.query)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

/*
method: fetchtotaltime
request type: Get
request body: {}
auth token: req.headers.authorization
response: message
*/
attendanceRequest.get("/fetchtotaltime", async (req, res) => {
  await mainFn.fetchtotaltime(req.query)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

module.exports = attendanceRequest;
