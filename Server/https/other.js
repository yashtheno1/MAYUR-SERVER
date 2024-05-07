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
      return res.send(err);
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
      return
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
      return res.send(err);
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
      return
    }
    );
}
);


/* 
  method: fetchSizeTypes
  request type: GET
  request body: {}
  auth token: no need
  params: {}
  response: {sizeTypeId:'int', sizeType:'string', stockUnit: 'string'}
*/
otherRequest.get("/fetchSizeTypes", async (req, res) => {
  await mainFn.fetchSizeTypes()
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

/* 
  method: fetchSizeVariants
  request type: GET
  request body: {}
  auth token: no need
  params: {sizeTypeId: int}
  response: {sizeVariantId:'int', sizeVariant:'string'}
*/
otherRequest.get("/fetchSizeVariants", async (req, res) => {
  await mainFn.fetchSizeVariants(req.query)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

/* 
  method: fetchMainCategories
  request type: GET
  request body: {}
  auth token: no need
  params: {}
  response: {mainCategoryId:'int', mainCategoryName:'string'}
*/
otherRequest.get("/fetchMainCategories", async (req, res) => {
  await mainFn.fetchMainCategories()
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

/* 
  method: fetchSubCategories
  request type: GET
  request body: {}
  auth token: no need
  params: {mainCategoryId: int}
  response: {subCategoryId:'int', subCategoryName:'string'}
*/
otherRequest.get("/fetchSubCategories", async (req, res) => {
  await mainFn.fetchSubCategories(req.query)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

/* 
  method: fetchRootCategories
  request type: GET
  request body: {}
  auth token: no need
  params: {subCategoryId: int}
  response: {rootCategoryId:'int', rootCategoryName:'string'}
*/
otherRequest.get("/fetchRootCategories", async (req, res) => {
  await mainFn.fetchRootCategories(req.query)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

/* 
  method: addother
  request type: POST
  auth token: req.headers.authorization
  request body: formdata (images, JSON stringified otherDetails Object, JSON stringified stockData JSON array,)
                otherDetails: {"sku": "string", "name": "string", "shortDesc": "string", "description": "string", "color": "string", "colorName": "string", "filterColor": "string", "additionalInfo": "string", "price": "Int", "discount": "Int", "rootCategoryId": "Int", "sizeTypeId": "Int"  },
                stockData: [{sizeVariantId: int, stock: string}, ...]
  response: message
*/
otherRequest.post("/addother", async (req, res) => {
  try {
    await mainFn.addother(req, res)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        otherLogger.trace('vendor-other-addother - ' + ' - error thrown')
        otherLogger.error(err)
        return res.send(err);
      })
  } catch (e) {
    catchLogger.trace('vendor-other-addother - ' + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: updateother
  request type: POST
  request body: {sku: "string", name: "string", shortDesc: "string", description: "string", color: "string", colorName: "string", additionalInfo: "string", price: "Int", discount: "Int", otherId: "Int"}a
  auth token: req.headers.authorization
  response: message
*/
otherRequest.post("/updateother", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.updateother(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        otherLogger.trace('vendor-other-updateother - ' + req.headers.authorization + ' - error thrown')
        otherLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('vendor-other-updateother - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: deleteothers
  request type: POST
  request body:{otherIds: [otherId1 ,otherId2 , .........,otherIdn]}
  auth token: req.headers.authorization
  response: message
*/
otherRequest.post("/deleteothers", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.deleteothers(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        otherLogger.trace('deleteothers - ' + req.headers.authorization + ' - error thrown')
        otherLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('deleteothers - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: addotherImages
  request type: POST
  auth token: req.headers.authorization
  request body: formdata (images, otherId)
  response: message
*/
otherRequest.post("/addotherImages", async (req, res) => {
  try {
    await mainFn.addotherImages(req, res)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        otherLogger.trace('vendor-other-addotherImages - ' + ' - error thrown')
        otherLogger.error(err)
        return res.send(err);
      })
  } catch (e) {
    catchLogger.trace('vendor-other-addotherImages - ' + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: deleteotherImages
  request type: POST
  request body:{otherId: "Int" , fileNameArr: [fileName1 ,fileName2 , .........,fileNamen]}
  auth token: req.headers.authorization
  response: message
*/
otherRequest.post("/deleteotherImages", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.deleteotherImages(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        otherLogger.trace('vendor-other-deleteotherImages - ' + ' - error thrown')
        otherLogger.error(err)
        return res.send(err);
      })
  } catch (e) {
    catchLogger.trace('vendor-other-deleteotherImages - ' + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: updateStockDetails
  request type: POST
  request body:{other Id: "string", sizeTypeId: "int", stockData: [{sizeVariantId: int, stock: string}, ...]}
  auth token: req.headers.authorization
  response: message
*/
otherRequest.post("/updateStockDetails", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.updateStockDetails(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        otherLogger.trace('vendor-other-updateStockDetails - ' + ' - error thrown')
        otherLogger.error(err)
        return res.send(err);
      })
  } catch (e) {
    catchLogger.trace('vendor-other-updateStockDetails - ' + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: fetchAllothers
  request type: GET
  request body: {}
  auth token: req.headers.authorization
  params: {}
  response: [{otherId:"string", sku:"string", name:"string", filterColor:"string", price:"int", discount:"int", rootCategoryId:"int", rootCategoryName:"string", subCategoryId:"int", subCategoryName:"string", mainCategoryId:"int", mainCategoryName:"string", sizeTypeId:"int", sizeType:"string", sizeUnit:"string", stockUnit:"string", stockData: [{sizeVariantId: 'int', stock: 'string', sizeVariantName : 'string'}, ...] , imageId:"int", imageName:"string"} .....]
*/
otherRequest.get("/fetchAllothers", async (req, res) => {
  await mainFn.fetchAllothers(req.headers.authorization)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

/* 
  method: fetchotherDetails
  request type: GET
  request body: {}
  auth token: req.headers.authorization
  params: {otherId:"int"}
  response: {otherId:"string", sku:"string", name:"string", shortDesc:"string", description:"string", color:"string", colorName:"string", filterColor:"string", additiionalInfo:"string", price:"int", discount:"int", rootCategoryId:"int", rootCategoryName:"string", subCategoryId:"int", subCategoryName:"string", mainCategoryId:"int", mainCategoryName:"string", sizeTypeId:"int", sizeType:"string", sizeUnit:"string", stockUnit:"string", stockData: [{sizeVariantId: 'int', stock: 'string', sizeVariantName : 'string'}, ...], [{imageId:"string", imageName:"string"} ....] }
*/
otherRequest.get("/fetchotherDetails", async (req, res) => {
  await mainFn.fetchotherDetails(req.query, req.headers.authorization)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

module.exports = otherRequest;