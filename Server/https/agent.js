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
method: updateagentprofile
request type: POST
request body: {
  agentId: 'int',
  displayName: 'string',
  registeredName: 'string',
  phoneNumber: 'string',
  imageId: 'int',
  address: 'string',
  notes: 'string',
  due: 'int'
}
auth token: required
response: {
  success: 'boolean',
  message: 'string'
}
*/
agentRequest.post("/updateagentprofile", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.updateagentprofile(body)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  } catch (e) {
    return res.send(e);
  }
}
);

module.exports = agentRequest;
