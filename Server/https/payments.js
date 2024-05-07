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

/* 
  method: fetchSizeTypes
  request type: GET
  request body: {}
  auth token: no need
  params: {}
  response: {sizeTypeId:'int', sizeType:'string', stockUnit: 'string'}
*/
paymentsRequest.get("/fetchSizeTypes", async (req, res) => {
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
paymentsRequest.get("/fetchSizeVariants", async (req, res) => {
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
paymentsRequest.get("/fetchMainCategories", async (req, res) => {
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
paymentsRequest.get("/fetchSubCategories", async (req, res) => {
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
paymentsRequest.get("/fetchRootCategories", async (req, res) => {
  await mainFn.fetchRootCategories(req.query)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

/* 
  method: addpayments
  request type: POST
  auth token: req.headers.authorization
  request body: formdata (images, JSON stringified paymentsDetails Object, JSON stringified stockData JSON array,)
                paymentsDetails: {"sku": "string", "name": "string", "shortDesc": "string", "description": "string", "color": "string", "colorName": "string", "filterColor": "string", "additionalInfo": "string", "price": "Int", "discount": "Int", "rootCategoryId": "Int", "sizeTypeId": "Int"  },
                stockData: [{sizeVariantId: int, stock: string}, ...]
  response: message
*/
paymentsRequest.post("/addpayments", async (req, res) => {
  try {
    await mainFn.addpayments(req, res)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('vendor-payments-addpayments - ' + ' - error thrown')
        paymentsLogger.error(err)
        return res.send(err);
      })
  } catch (e) {
    catchLogger.trace('vendor-payments-addpayments - ' + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: updatepayments
  request type: POST
  request body: {sku: "string", name: "string", shortDesc: "string", description: "string", color: "string", colorName: "string", additionalInfo: "string", price: "Int", discount: "Int", paymentsId: "Int"}a
  auth token: req.headers.authorization
  response: message
*/
paymentsRequest.post("/updatepayments", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.updatepayments(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('vendor-payments-updatepayments - ' + req.headers.authorization + ' - error thrown')
        paymentsLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('vendor-payments-updatepayments - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: deletepaymentss
  request type: POST
  request body:{paymentsIds: [paymentsId1 ,paymentsId2 , .........,paymentsIdn]}
  auth token: req.headers.authorization
  response: message
*/
paymentsRequest.post("/deletepaymentss", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.deletepaymentss(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('deletepaymentss - ' + req.headers.authorization + ' - error thrown')
        paymentsLogger.error(err)
        return res.send(err);
      });
  } catch (e) {
    catchLogger.trace('deletepaymentss - ' + req.headers.authorization + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: addpaymentsImages
  request type: POST
  auth token: req.headers.authorization
  request body: formdata (images, paymentsId)
  response: message
*/
paymentsRequest.post("/addpaymentsImages", async (req, res) => {
  try {
    await mainFn.addpaymentsImages(req, res)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('vendor-payments-addpaymentsImages - ' + ' - error thrown')
        paymentsLogger.error(err)
        return res.send(err);
      })
  } catch (e) {
    catchLogger.trace('vendor-payments-addpaymentsImages - ' + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: deletepaymentsImages
  request type: POST
  request body:{paymentsId: "Int" , fileNameArr: [fileName1 ,fileName2 , .........,fileNamen]}
  auth token: req.headers.authorization
  response: message
*/
paymentsRequest.post("/deletepaymentsImages", async (req, res) => {
  var body = req.body;
  try {
    body = JSON.parse(body);
  } catch (e) { }
  try {
    await mainFn.deletepaymentsImages(body, req.headers.authorization)
      .then(response => {
        return res.send(response);
      })
      .catch(err => {
        paymentsLogger.trace('vendor-payments-deletepaymentsImages - ' + ' - error thrown')
        paymentsLogger.error(err)
        return res.send(err);
      })
  } catch (e) {
    catchLogger.trace('vendor-payments-deletepaymentsImages - ' + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: updateStockDetails
  request type: POST
  request body:{payments Id: "string", sizeTypeId: "int", stockData: [{sizeVariantId: int, stock: string}, ...]}
  auth token: req.headers.authorization
  response: message
*/
paymentsRequest.post("/updateStockDetails", async (req, res) => {
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
        paymentsLogger.trace('vendor-payments-updateStockDetails - ' + ' - error thrown')
        paymentsLogger.error(err)
        return res.send(err);
      })
  } catch (e) {
    catchLogger.trace('vendor-payments-updateStockDetails - ' + ' - error thrown')
    catchLogger.error(e)
  }
});

/* 
  method: fetchAllpaymentss
  request type: GET
  request body: {}
  auth token: req.headers.authorization
  params: {}
  response: [{paymentsId:"string", sku:"string", name:"string", filterColor:"string", price:"int", discount:"int", rootCategoryId:"int", rootCategoryName:"string", subCategoryId:"int", subCategoryName:"string", mainCategoryId:"int", mainCategoryName:"string", sizeTypeId:"int", sizeType:"string", sizeUnit:"string", stockUnit:"string", stockData: [{sizeVariantId: 'int', stock: 'string', sizeVariantName : 'string'}, ...] , imageId:"int", imageName:"string"} .....]
*/
paymentsRequest.get("/fetchAllpaymentss", async (req, res) => {
  await mainFn.fetchAllpaymentss(req.headers.authorization)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

/* 
  method: fetchpaymentsDetails
  request type: GET
  request body: {}
  auth token: req.headers.authorization
  params: {paymentsId:"int"}
  response: {paymentsId:"string", sku:"string", name:"string", shortDesc:"string", description:"string", color:"string", colorName:"string", filterColor:"string", additiionalInfo:"string", price:"int", discount:"int", rootCategoryId:"int", rootCategoryName:"string", subCategoryId:"int", subCategoryName:"string", mainCategoryId:"int", mainCategoryName:"string", sizeTypeId:"int", sizeType:"string", sizeUnit:"string", stockUnit:"string", stockData: [{sizeVariantId: 'int', stock: 'string', sizeVariantName : 'string'}, ...], [{imageId:"string", imageName:"string"} ....] }
*/
paymentsRequest.get("/fetchpaymentsDetails", async (req, res) => {
  await mainFn.fetchpaymentsDetails(req.query, req.headers.authorization)
    .then(response => {
      return res.send(response);
    })
    .catch(err => {
      return res.send(err);
    });
});

module.exports = paymentsRequest;