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
      return res.status(500).send(err);
    });
});

/* 
  method: fetchUserProfBrief
  request type: GET
  request body: {}
  params: {}
  response: {
    userId: 'int',
    displayName: 'string',
    isActive: 'boolean',
    imageId: 'int',
    phoneNumber: 'string'
  }
*/
userRequest.get("/fetchuserprofilebrief", async (req, res) => {
  await mainFn.fetchuserprofilebrief(req.query)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

/* 
  method: fetchUserProfCount
  request type: GET
  request body: {}
  auth token: not required
  params: {
    isActive: 'boolean'
  }
  response: {
    totalCount: 'int',
  }
*/
userRequest.get("/fetchuserprofilecount", async (req, res) => {
  await mainFn.fetchuserprofilecount(req.query)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.status(500).send(err);
    }
    );
}
);

/* 
  method: fetchUserProfDetail
  request type: GET
  request body: {}
  auth token: not required
  params: {
    userId: 'int'
  }
  response: {
    userId: 'int',
    displayName: 'string',
    registeredName: 'string',
    isActive: 'boolean',
    isCompleted: 'boolean',
    phoneNumber: 'string',
    address: 'string',
    notes: 'string',
    createdAt: 'timestamp',
    updatedAt: 'timestamp',
    agentId: 'int',
    due: 'int',
    enrollments: [{
      enrollmentId: 'int',
      type: 'string',
      subType: 'string',
      cost: 'int',
      totalTime: 'float',
      isRenewal: 'boolean'
    }],
    attendance: [{
      attendanceId: 'int',
      type: 'string',
      isPresent: 'boolean',
      isCompleted: 'boolean',
      inTime: 'timestamp',
      vehicleId: 'int'
    }],
    bills: [{
      billId: 'int',
      agentId: 'int',
      enrollmentId: 'int',
      date: 'date',
      amount: 'int',
      notes: 'string'
    }]
  }
*/
userRequest.get("/fetchuserprofiledetail", async (req, res) => {
  await mainFn.fetchuserprofiledetail(req.query)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.status(500).send(err);
    }
    );
}
);

/* 
  method: createUserProf
  request type: POST
  request body: {
    displayName: 'string',
    registeredName: 'string',
    phoneNumber: 'string',
    address: 'string',
    notes: 'string',
    agentId: 'int',
    due: 'int'
  }
  auth token: required
  response: {
    success: 'boolean',
    message: 'string',
    userId: 'int'
  }
*/
userRequest.post("/createuserprofile", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.createuserprofile(body)
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

/*
  method: fetchuserprofbyname
  request type: GET
  request body: {
  }
  auth token: not required
  params: {
    userId: 'int'
  }
  response: {
    userId: 'int',
  }
*/
userRequest.get("/fetchuserprofbyname", async (req, res) => {
  await mainFn.fetchuserprofbyname(req.query)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.status
    }
    );
}
);

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
