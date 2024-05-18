const express = require("express");
const paymentsRequest = express.Router();
const cors = require("cors");
paymentsRequest.use(cors());

const paymentsLogger = require('log4js').getLogger('payments');
const catchLogger = require('log4js').getLogger('catches');

const mainFn = require("../functions/payments");

/* 
  method: fetchbilldetails
  request type: GET
  request body: {}
  auth token: not required
  params: {
    billId: 'int'
  }
  response: {
    userprofileId: 'int',
    displayName: 'string',
    registeredName: 'string',
    isActive: 'boolean',
    isCompleted: 'boolean',
    phoneNumber: 'string',
    address: 'string',
    notes: 'string',
    enrollmentId: 'int',
    Type: 'string',
    subtype: 'string',
    billId: 'int'
    date: 'date',
    amount: 'int'
    }
  }
*/
paymentsRequest.get("/fetchbilldetails", async (req, res) => {
  var query = req.query;
  try {
    await mainFn.fetchbilldetails(query)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsRequest.trace('fetchbilldetails - ' + query.billId + ' - error thrown')
        paymentsRequest.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('fetchbilldetails - ' + query.billId + ' - error thrown')
    catchLogger.error(e)
  }
}
);

/*
  method: fetchbilldetailsagent
  request type: GET
  request body: {}
  auth token: not required
  params: {
    billId: 'int'
  }
  response: {
    agentId: 'int',
    displayName: 'string',
    registeredName: 'string',
    isActive: 'boolean',
    isCompleted: 'boolean',
    phoneNumber: 'string',
    address: 'string',
    notes: 'string',
    enrollmentId: 'int',
    Type: 'string',
    subtype: 'string',
    billId: 'int'
    date: 'date',
    amount: 'int'
    }
  }
*/
paymentsRequest.get("/fetchbilldetailsagent", async (req, res) => {
  var query = req.query;
  try {
    await mainFn.fetchbilldetailsagent(query)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsRequest.trace('fetchbilldetailsagent - ' + query.billId + ' - error thrown')
        paymentsRequest.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('fetchbilldetailsagent - ' + query.billId + ' - error thrown')
    catchLogger.error(e)
  }
}
);

/*
 method:createbill
  request type: POST
  request body: {
    userprofileId: 'int',
    notes: 'string',
    enrollmentId: 'int',
    amount: 'int'
  }
  auth token: not required
  response: {
    success: 'boolean',
    message: 'string',
    billId: 'int'
  }
*/
paymentsRequest.post("/createbill", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.createbill(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('createbill - ' + ' - error thrown')
        paymentsLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('createbill - ' + ' - error thrown')
    catchLogger.error(e)
  }
});

/*
 method: fetchbillbrief
  request type: GET
  request body: {
    userprofileId: 'int'
  }
  auth token: not required
  response: {
    billId: 'int',
    enrollmentId: 'int',
    date: 'date',
    amount: 'int'
    type: 'string',
    subtype: 'string'
  }
*/
paymentsRequest.get("/fetchbillbrief", async (req, res) => {
  var query = req.query;
  try {
    await mainFn.fetchbillbrief(query)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('fetchbillbrief - ' + query.userprofileId + ' - error thrown')
        paymentsLogger.error(err)
        return res.status(500).send
      }
      );
  } catch (e) {
    catchLogger.trace('fetchbillbrief - ' + query.userprofileId + ' - error thrown')
    catchLogger.error(e)
  }
});

/*
method: fetchbillbriefagent
  request type: GET
  request body: {
    agentId: 'int'
  }
  auth token: not required
  response: {
    billId: 'int',
    enrollmentId: 'int',
    date: 'date',
    amount: 'int'
    type: 'string',
    subtype: 'string'
  }
*/
paymentsRequest.get("/fetchbillbriefagent", async (req, res) => {
  var query = req.query;
  try {
    await mainFn.fetchbillbriefagent(query)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('fetchbill - ' + query.agentId + ' - error thrown')
        paymentsLogger.error(err)
        return res.status(500).send
      }
      );
  } catch (e) {
    catchLogger.trace('fetchbill - ' + query.agentId + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: addagentdue
  request type: POST
  request body: {
    agentId: 'int',
    amount: 'int'
  }
  auth token: not required
  response: {
    success: 'boolean',
    message: 'string'
  }
*/
paymentsRequest.post("/addagentdue", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.addagentdue(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('addagentdue - ' + ' - error thrown')
        paymentsLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('addagentdue - ' + ' - error thrown')
    catchLogger.error(e)
  }
}
);

/* 
  method: fetchagentdue
  request type: GET
  request body: {
    agentId: 'int'
  }
  auth token: not required
  response: {
    agentId: 'int',
    paid: 'int',
    due: 'int'
  }
*/
paymentsRequest.get("/fetchagentdue", async (req, res) => {
  var query = req.query;
  try {
    await mainFn.fetchagentdue(query)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('fetchagentdue - ' + query.agentId + ' - error thrown')
        paymentsLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('fetchagentdue - ' + query.agentId + ' - error thrown')
    catchLogger.error(e)
  }
}
);

/* 
 method: payagentdue
  request type: POST
  request body: {
    agentId: 'int',
    amount: 'int'
  }
  auth token: not required
  response: {
    success: 'boolean',
    message: 'string'
  }
*/
paymentsRequest.post("/payagentdue", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.payagentdue(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('payagentdue - ' + ' - error thrown')
        paymentsLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('payagentdue - ' + ' - error thrown')
    catchLogger.error(e)
  }
}
);

/* 
method: payuserdue
  request type: POST
  request body: {
    enrollmentId: 'int',
    amount: 'int'
  }
  auth token: not required
  response: {
    success: 'boolean',
    message: 'string'
  }
*/
paymentsRequest.post("/payuserdue", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.payuserdue(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('payuserdue - ' + ' - error thrown')
        paymentsLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('payuserdue - ' + ' - error thrown')
    catchLogger.error(e)
  }
}
);

module.exports = paymentsRequest;