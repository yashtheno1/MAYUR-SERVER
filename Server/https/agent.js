const express = require("express");
const agentRequest = express.Router();
const cors = require("cors");
agentRequest.use(cors());

const agentLogger = require('log4js').getLogger('agent');
const catchLogger = require('log4js').getLogger('catches');

const mainFn = require("../functions/agent");

/* 
  method: createAgent
  request type: POST
  request body: {
    displayName: 'string',
    registeredName: 'string',
    phoneNumber: 'string',
    imageId: 'int',
    address: 'string',
    notes: 'string',
    userId: 'int',
    due: 'int'
  }
  auth token: required
  response: {
    success: 'boolean',
    message: 'string',
    agentId: 'int'
  }
*/
agentRequest.post("/createAgent", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  }
  catch (e) { }
  try {
    await mainFn.createagent(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('agent-agent-createAgent - ' + body.phoneNumber + ' - error thrown')
        agentLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('agent-agent-createAgent - ' + body.phoneNumber + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: fetchAgentProfileBrief
  request type: GET
  request body: {}
  auth token: required
  params: { userId: 'int'}
  response: [{
    agentId: 'int',
    displayName: 'string',
    phoneNumber: 'string',
    due: 'int',
    createdAt: 'string',
  }]
*/
agentRequest.get("/fetchAgentProfileBrief", async (req, res) => {
  var params = req.query;
  try {
    await mainFn.fetchAgentProfileBrief(params)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('agent-agent-fetchAgentProfileBrief - error thrown')
        agentLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('agent-agent-fetchAgentProfileBrief - error thrown')
    catchLogger.error(e)
  }
}
);

/* 
  method: fetchAgentLinkedUserCount
  request type: GET
  request body: {}
  auth token: required
  params: {
    agentId: 'int'
  }
  response: {
    success: 'boolean',
    message: 'string',
    linkedUserCount: 'int'
  }
*/
agentRequest.get("/fetchAgentLinkedUserCount", async (req, res) => {
  var params = req.query;
  try {
    await mainFn.fetchAgentLinkedUserCount(params)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('agent-agent-fetchAgentLinkedUserCount - ' + params.agentId + ' - error thrown')
        agentLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('agent-agent-fetchAgentLinkedUserCount - ' + params.agentId + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: fetchAgentProfileDetail
  request type: GET
  request body: {}
  auth token: required
  params: {
    agentId: 'int'
  }
  response: {
    agentId: 'int',
    displayName: 'string',
    registeredName: 'string',
    isActive: 'boolean',
    phoneNumber: 'string',
    imageId: 'int',
    address: 'string',
    notes: 'string',
    createdAt: 'timestamp',
    updatedAt: 'timestamp',
    due: 'int'
  }
*/
agentRequest.get("/fetchAgentProfileDetail", async (req, res) => {
  var params = req.query;
  try {
    await mainFn.fetchAgentProfileDetails(params)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('agent-agent-fetchAgentProfileDetail - ' + params.agentId + ' - error thrown')
        agentLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('agent-agent-fetchAgentProfileDetail - ' + params.agentId + ' - error thrown')
    catchLogger.error(e)
  }
}
);

/*
  method: fetchAgentLinkedUserProfiles
  request type: GET
  request body: {}
  auth token: required
  params: {
    agentId: 'int'
  }
  response: [{
    userId: 'int',
    displayName: 'string',
    isActive: 'boolean',
    imageId: 'int',
    phoneNumber: 'string'
  }]
*/
agentRequest.get("/fetchAgentLinkedUserProfiles", async (req, res) => {
  var params = req.query;
  try {
    await mainFn.fetchAgentLinkedUserProfiles(params)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('agent-agent-fetchAgentLinkedUserProfiles - ' + params.agentId + ' - error thrown')
        agentLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('agent-agent-fetchAgentLinkedUserProfiles - ' + params.agentId + ' - error thrown')
    catchLogger.error(e)
  }
}
);

/*
  method: fetchUserLinkedAgentProfile
  request type: GET
  request body: {}
  auth token: required
  params: {
    agentId: 'int'
  }
  response: [{
    agentId: 'int',
    displayName: 'string',
    isActive: 'boolean',
    imageId: 'int'
  }]
*/
agentRequest.get("/fetchUserLinkedAgentProfile", async (req, res) => {
  var params = req.query;
  try {
    await mainFn.fetchUserLinkedAgentProfile(params)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        agentLogger.trace('agent-agent-fetchUserLinkedAgentProfile - ' + params.userId + ' - error thrown')
        agentLogger.error(err)
        return res.status(500).send(err);
      });
  } catch (e) {
    catchLogger.trace('agent-agent-fetchUserLinkedAgentProfile - ' + params.userId + ' - error thrown')
    catchLogger.error(e)
  }
}
);

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
