const express = require("express");
const otherRequest = express.Router();
const cors = require("cors");
otherRequest.use(cors());

const otherLogger = require('log4js').getLogger('others');
const catchLogger = require('log4js').getLogger('catches');

const mainFn = require("../functions/other");

/* 
  method: createenquiries
  request type: POST
  request body: {name: 'string', email: 'string', phone: 'string', message: 'string'}
  auth token: no need
  response: message
*/
otherRequest.post("/createenquiries", async (req, res) => {
  await mainFn.createenquiries(req.body)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

/*
  method: fetchenquiries
  request type: GET
  request body: {}
  auth token: no need
  params: {}
  response: {enquiryId:'int', name:'string', email:'string', phone:'string', message:'string', status:'string', createdOn:'string'}
*/
otherRequest.get("/fetchenquiries", async (req, res) => {
  var data = req.query;
  await mainFn.fetchenquiries(data)
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
  method: createactivity
  request type: POST
  request body: {userid: int, agentid: int, activity: 'string'}
  auth token: no need
  response: message
*/
otherRequest.post("/createactivity", async (req, res) => {
  await mainFn.createactivity(req.body)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

/*
  method: fetchactivity
  request type: GET
  request body: {}
  auth token: no need
  params: {}
  response: {activityId:'int', userid:'int', agentid:'int', activity:'string', createdOn:'string'}
*/
otherRequest.get("/fetchactivity", async (req, res) => {
  var data = req.query;
  await mainFn.fetchactivity(data)
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
method: uploadimage
request type: POST
request body: formdata (image)
auth token: no need
response: {imageId:'int', imageName:'string'}
*/
otherRequest.post("/uploadimage", async (req, res) => {
  await mainFn.uploadimage(req, res)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

/*
  method: fetchimage
  request type: GET
  request body: {}
  auth token: no need
  params: {}
  response: {imageId:'int', imageName:'string'}
*/
otherRequest.get("/fetchimage", async (req, res) => {
  var data = req.query;
  await mainFn.fetchimage(data)
    .then(response => {
      return res.send(response);
      // return res.sendFile(response.imageName);
    }) 
    .catch(err => {
      console.log(err);
      return res.status(500).send(err);
    }
    );
}
);

module.exports = otherRequest;