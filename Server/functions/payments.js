const dbpool = require('../database');
const path = require('path');
const fs = require('fs');

const constants = require('../constants');

const jwt = require('../util/jwt');
const multer = require('../util/multer');

const paymentsLogger = require('log4js').getLogger('payments');

fetchbilldetails = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                paymentsLogger.trace('payment-fetchbilldetails - error in db connection')
                paymentsLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT up.ID AS userprofileId, up.DisplayName, up.RegisteredName, up.isActive, up.isCompleted, up.PhoneNumber, up.Address, up.Notes, e.ID AS enrollmentId, e.Type, e.SubType AS subtype, b.ID AS billId, b.Date, b.Amount FROM bills b JOIN user_profile up ON b.User_profile_ID = up.ID JOIN enrollments e ON b.Enrollment_ID = e.ID WHERE b.ID = ?;',
                    timeout: 40000,
                    values: [data.billId]
                }, (error, results) => {
                    if (error) {
                        paymentsLogger.trace('payment-fetchbilldetails - error in select query')
                        paymentsLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'bill details fetched', data: resultsHack[0] });
                    }
                })

            }
        })
    })
}

createbill = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                paymentsLogger.trace('payment-createbill - error in db connection')
                paymentsLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.beginTransaction((err) => {
                    if (err) {
                        paymentsLogger.trace('payment-createbill - error in begin transaction')
                        paymentsLogger.error(err)
                        conn.release();
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        conn.query({
                            sql: 'INSERT INTO `bills` (`User_profile_ID`, `Enrollment_ID`, `Date`, `Amount`, `Notes`) VALUES (?,?,?,?,?);',
                            timeout: 40000,
                            values: [data.userId, data.enrollmentId, data.date, data.amount, data.notes]
                        }, (error, results) => {
                            if (error) {
                                paymentsLogger.trace('payment-createbill - error in insert query')
                                paymentsLogger.error(error)
                                return conn.rollback(() => {
                                    conn.release();
                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                });
                            } else {
                                conn.commit((err) => {
                                    if (err) {
                                        paymentsLogger.trace('payment-createbill - error in commiting queries')
                                        paymentsLogger.error(err)
                                        return conn.rollback(() => {
                                            conn.release();
                                            return reject({ status: 'failed', err: err, data: { bResult: false } });
                                        });
                                    } else {
                                        conn.release();
                                        return resolve({ status: 'success', msg: 'bill created', data: { billId: results.insertId, bResult: true } });
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
    })
};


fetchSizeTypes = () => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `sizeTypeId`, `sizeType`, `stockUnit` FROM `size_types`;',
                    timeout: 40000
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'size types fetched', data: { sizeTypes: resultsHack, bResult: true } });
                    }
                })

            }
        })
    })
};

fetchSizeVariants = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `sizeVariantId`, `sizeVariant` FROM `size_variants` WHERE `sizeTypeId` = ?;',
                    timeout: 40000,
                    values: [data.sizeTypeId]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'size variants fetched', data: { sizeVariants: resultsHack, bResult: true } });

                    }
                })

            }
        })
    })
};

fetchMainCategories = () => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `mainCategoryId`, `mainCategoryName` FROM `main_categories` WHERE `isActive` = TRUE ORDER BY `mainCategoryName`;',
                    timeout: 40000
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'main categories fetched', data: { mainCategories: resultsHack, bResult: true } });
                    }
                })

            }
        })
    })
};

fetchSubCategories = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `subCategoryId`, `subCategoryName` FROM `sub_categories` WHERE `mainCategoryId` = ? AND `isActive`= TRUE ORDER BY `subCategoryName`;',
                    timeout: 40000,
                    values: [data.mainCategoryId]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'sub categories fetched', data: { subCategories: resultsHack, bResult: true } });

                    }
                })

            }
        })
    })
};

fetchRootCategories = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `rootCategoryId`, `rootCategoryName` FROM `root_categories` WHERE `subCategoryId` = ? AND `isActive`= TRUE ORDER BY `rootCategoryName`;',
                    timeout: 40000,
                    values: [data.subCategoryId]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'root categories fetched', data: { rootCategories: resultsHack, bResult: true } });

                    }
                })

            }
        })
    })
};

addpayments = (req, res) => {
    return new Promise(async (resolve, reject) => {
        var token = req.headers.authorization;
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId;
            var multerUploadResponse = await multer.multerUpload(req, res, constants.PATH_FOR_payments_IMAGES)
            if (multerUploadResponse.msg) {
                dbpool.getConnection(async (err, conn) => {
                    if (err) {
                        paymentsLogger.trace('vendor-payments-addpayments - ' + token + ' - error in db connection')
                        paymentsLogger.error(err)
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        var paymentsDetails = multerUploadResponse.bodyObj.paymentsDetails
                        try {
                            paymentsDetails = JSON.parse(paymentsDetails)
                        } catch (e) { }
                        paymentsDetails.vendorId = vendorId
                        var paymentsDetailsKeysArr = Object.keys(paymentsDetails)
                        var paymentsDetailsValuesArr = Object.values(paymentsDetails)
                        var paymentsDetailsArr = paymentsDetailsKeysArr.concat(paymentsDetailsValuesArr)
                        conn.beginTransaction((err) => {
                            if (err) {
                                paymentsLogger.trace('vendor-payments-addpayments - ' + token + ' - error in begin transaction')
                                paymentsLogger.error(err)
                                conn.release();
                                return reject({ status: 'failed', err: err, data: { bResult: false } });
                            } else {
                                conn.query({
                                    sql: 'INSERT INTO `paymentss` (??,??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);',
                                    timeout: 40000,
                                    values: paymentsDetailsArr
                                }, async (error, results) => {
                                    if (error) {
                                        paymentsLogger.trace('vendor-payments-addpayments - ' + token + ' - error in insert query execution')
                                        paymentsLogger.error(error)
                                        return conn.rollback(() => {
                                            conn.release();
                                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                                        });
                                    } else {
                                        var paymentsId = JSON.parse(JSON.stringify(results)).insertId
                                        var stockData = multerUploadResponse.bodyObj.stockData
                                        try {
                                            stockData = JSON.parse(stockData)
                                        } catch (e) { }
                                        var stockDataArr = []
                                        for (var j = 0; j < stockData.length; j++) {
                                            stockDataArr.push([stockData[j].sizeVariantId, paymentsId, stockData[j].stock])
                                        }
                                        conn.query({
                                            sql: 'INSERT INTO `stock_data` (`sizeVariantId`,`paymentsId`,`stock`) VALUES ?;',
                                            timeout: 40000,
                                            values: [stockDataArr]
                                        }, async (error, results) => {
                                            if (error) {
                                                paymentsLogger.trace('vendor-payments-addpayments - ' + token + ' - error in insert query execution')
                                                paymentsLogger.error(error)
                                                return conn.rollback(() => {
                                                    conn.release();
                                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                                });
                                            } else {
                                                var filenameArray = multerUploadResponse.filenameArray
                                                if (filenameArray.length) {
                                                    var paymentsImageDataArr = []
                                                    for (var i = 0; i < filenameArray.length; i++) {
                                                        paymentsImageDataArr.push([filenameArray[i], paymentsId])
                                                    }
                                                    conn.query({
                                                        sql: 'INSERT INTO `payments_images` (`imageName`, `paymentsId`) VALUES ?;',
                                                        timeout: 40000,
                                                        values: [paymentsImageDataArr]
                                                    }, (error, results) => {
                                                        if (error) {
                                                            paymentsLogger.trace('vendor-payments-addpayments - ' + token + ' - error in insert query execution')
                                                            paymentsLogger.error(error)
                                                            return conn.rollback(() => {
                                                                conn.release();
                                                                return reject({ status: 'failed', err: error, data: { bResult: false } });
                                                            });
                                                        } else {
                                                            conn.commit((err) => {
                                                                if (err) {
                                                                    paymentsLogger.trace('vendor-payments-addpayments - ' + token + ' - error in commiting queries')
                                                                    paymentsLogger.error(err)
                                                                    return conn.rollback(() => {
                                                                        conn.release();
                                                                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                                                                    });
                                                                } else {
                                                                    conn.release();
                                                                    return resolve({ status: 'success', msg: 'payments Uploaded', data: { bResult: true } });
                                                                }
                                                            });
                                                        }
                                                    })
                                                } else {
                                                    conn.commit((err) => {
                                                        if (err) {
                                                            paymentsLogger.trace('vendor-payments-addpayments - ' + token + ' - error in commiting queries')
                                                            paymentsLogger.error(err)
                                                            return conn.rollback(() => {
                                                                conn.release();
                                                                return reject({ status: 'failed', err: err, data: { bResult: false } });
                                                            });
                                                        } else {
                                                            conn.release();
                                                            return resolve({ status: 'success', msg: 'payments Uploaded', data: { bResult: true } });
                                                        }
                                                    });
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                paymentsLogger.trace('vendor-payments-addpayments - ' + token + ' - image upload error')
                paymentsLogger.error(multerUploadResponse.error)
                return reject({ status: 'failed', err: multerUploadResponse.error, data: { bResult: false } });
            }
        } else {
            paymentsLogger.trace('vendor-payments-addpayments - ' + token + ' - jwt verification error')
            paymentsLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

updatepayments = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            dbpool.getConnection(async (err, conn) => {
                if (err) {
                    paymentsLogger.trace('vendor-payments-updatepayments - ' + token + ' - error in db connection')
                    paymentsLogger.error(err)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    var updatedProdData = data;
                    updatedProdData.vendorId = jwtResponse.msg.data.vendorId;
                    var paymentsDetailsKeysArr = Object.keys(updatedProdData);
                    var paymentsDetailsValuesArr = Object.values(updatedProdData);
                    var paymentsDataVals = [];
                    var qmStr = '';
                    for (var i = 0; i < paymentsDetailsKeysArr.length; i++) {
                        paymentsDataVals.push(paymentsDetailsKeysArr[i], paymentsDetailsValuesArr[i])
                        qmStr = qmStr + '??=?,'
                    }
                    qmStr = qmStr.substring(0, qmStr.length - 11)
                    conn.query({
                        sql: 'UPDATE `paymentss` SET ' + qmStr + ' WHERE ??=? AND ??=?;',
                        timeout: 40000,
                        values: paymentsDataVals
                    }, async (error, results) => {
                        if (error) {
                            paymentsLogger.trace('vendor-payments-updatepayments - ' + token + ' - error in update query execution')
                            paymentsLogger.error(error)
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'payments updated', data: { bResult: true } });
                        }
                    })
                }
            })
        } else {
            paymentsLogger.trace('vendor-payments-updatepayments - ' + token + ' - jwt verification error')
            paymentsLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

deletepaymentss = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            dbpool.getConnection(async (err, conn) => {
                if (err) {
                    paymentsLogger.trace('vendor-payments-deletepayments - ' + token + ' - error in db connection')
                    paymentsLogger.error(err)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    var paymentsIds = data.paymentsIds
                    try {
                        paymentsIds = JSON.parse(paymentsIds)
                    } catch (e) { }

                    conn.query({
                        sql: 'UPDATE `paymentss` SET `isActive` = FALSE WHERE `vendorId` = ? AND `paymentsId` IN (?);',
                        timeout: 40000,
                        values: [jwtResponse.msg.data.vendorId, paymentsIds]
                    }, async (error, results) => {
                        if (error) {
                            paymentsLogger.trace('vendor-payments-deletepayments - ' + token + ' - error in update query execution')
                            paymentsLogger.error(error)
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'payments deleted', data: { bResult: true } });
                        }
                    })
                }
            })
        } else {
            paymentsLogger.trace('vendor-payments-deletepayments - ' + token + ' - jwt verification error')
            paymentsLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

addpaymentsImages = (req, res) => {
    return new Promise(async (resolve, reject) => {
        var token = req.headers.authorization;
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            var multerUploadResponse = await multer.multerUpload(req, res, constants.PATH_FOR_payments_IMAGES)
            if (multerUploadResponse.msg) {
                var filenameArray = multerUploadResponse.filenameArray
                if (filenameArray.length) {

                    var paymentsId = multerUploadResponse.bodyObj.paymentsId
                    dbpool.getConnection((err, conn) => {
                        if (err) {
                            paymentsLogger.trace('vendor-payments-addpaymentsImages - ' + token + ' - error in db connection')
                            paymentsLogger.error(error)
                            return reject({ status: 'failed', err: err, data: { bResult: false } });
                        } else {
                            conn.query({
                                sql: 'SELECT `paymentsId` FROM `paymentss` WHERE `paymentsId` = ? AND `vendorId`= ?;',
                                timeout: 40000,
                                values: [paymentsId, vendorId]
                            }, (error, results) => {
                                if (error) {
                                    paymentsLogger.trace('vendor-payments-addpaymentsImages - ' + token + ' - error in select query execution')
                                    paymentsLogger.error(error)
                                    conn.release();
                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                } else {
                                    var resultsHack = JSON.parse(JSON.stringify(results))
                                    if (resultsHack.length) {

                                        var paymentsImageDataArr = []
                                        for (var i = 0; i < filenameArray.length; i++) {
                                            paymentsImageDataArr.push([filenameArray[i], paymentsId])
                                        }
                                        conn.query({
                                            sql: 'INSERT INTO `payments_images` (`imageName`, `paymentsId`) VALUES ?;',
                                            timeout: 40000,
                                            values: [paymentsImageDataArr]
                                        }, (error, results) => {
                                            if (error) {
                                                paymentsLogger.trace('vendor-payments-addpaymentsImages - ' + token + ' - error in insert query execution')
                                                paymentsLogger.error(error)
                                                conn.release();
                                                return reject({ status: 'failed', err: error, data: { bResult: false } });
                                            } else {
                                                conn.release();
                                                return resolve({ status: 'success', msg: 'payments images uploaded', data: { bResult: true } });
                                            }
                                        })
                                    } else {
                                        conn.release();
                                        return resolve({ status: 'failed', msg: 'invalid vendor for the payments', data: { bResult: false } });
                                    }
                                }
                            })
                        }
                    })
                } else {
                    conn.release();
                    return resolve({ status: 'success', msg: 'no image to upload', data: { bResult: true } });
                }
            } else {
                paymentsLogger.trace('vendor-payments-addpaymentsImages - ' + token + ' - image upload error')
                paymentsLogger.error(multerUploadResponse.error)
                return reject({ status: 'failed', err: multerUploadResponse.error, data: { bResult: false } });
            }
        } else {
            paymentsLogger.trace('vendor-payments-addpaymentsImages - ' + token + ' - jwt verification error')
            paymentsLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

deletepaymentsImages = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            var paymentsId = data.paymentsId
            dbpool.getConnection((err, conn) => {
                if (err) {
                    paymentsLogger.trace('vendor-payments-deletepaymentsImages - ' + token + ' - error in db connection')
                    paymentsLogger.error(error)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'SELECT `paymentsId` FROM `paymentss` WHERE `paymentsId` = ? AND `vendorId`= ?;',
                        timeout: 40000,
                        values: [paymentsId, vendorId]
                    }, (error, results) => {
                        if (error) {
                            paymentsLogger.trace('vendor-payments-deletepaymentsImages - ' + token + ' - error in select query execution')
                            paymentsLogger.error(error)
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            var resultsHack = JSON.parse(JSON.stringify(results))
                            if (resultsHack.length) {
                                var fileNameArr = data.fileNameArr
                                try {
                                    fileNameArr = JSON.parse(fileNameArr)
                                } catch (e) { }
                                if (fileNameArr.length) {
                                    conn.query({
                                        sql: 'DELETE FROM `payments_images` WHERE `paymentsId` = ? AND `imageName` IN (?)',
                                        timeout: 40000,
                                        values: [paymentsId, fileNameArr]
                                    }, (error, results) => {
                                        if (error) {
                                            paymentsLogger.trace('vendor-payments-deletepaymentsImages - ' + token + ' - error in insert query execution')
                                            paymentsLogger.error(error)
                                            conn.release();
                                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                                        } else {
                                            var filePath = "";
                                            for (i = 0; i < filenameArray.length; i++) {
                                                filePath = path.join(__basedir, constants.PATH_FOR_payments_IMAGES, filenameArray[i]);
                                                if (fs.existsSync(filePath)) {
                                                    fs.unlinkSync(filePath)
                                                }
                                            }
                                            conn.release();
                                            return resolve({ status: 'success', msg: 'payments images deleted', data: { bResult: true } });
                                        }
                                    })
                                } else {
                                    conn.release();
                                    return resolve({ status: 'success', msg: 'payments images deleted', data: { bResult: true } });
                                }
                            } else {
                                conn.release();
                                return resolve({ status: 'failed', msg: 'invalid vendor for the payments', data: { bResult: false } });
                            }
                        }
                    })
                }
            })
        } else {
            paymentsLogger.trace('vendor-payments-deletepaymentsImages - ' + token + ' - jwt verification error')
            paymentsLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

updateStockDetails = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            var paymentsId = data.paymentsId
            dbpool.getConnection((err, conn) => {
                if (err) {
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'SELECT `sizeTypeId` FROM `paymentss` WHERE `paymentsId` = ? AND `vendorId`= ?;',
                        timeout: 40000,
                        values: [paymentsId, vendorId]
                    }, (error, results) => {
                        if (error) {
                            paymentsLogger.trace('vendor-payments-updateStockDetails - ' + token + ' - error in select query execution')
                            paymentsLogger.error(error)
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            var resultsHack = JSON.parse(JSON.stringify(results))
                            if (resultsHack.length) {
                                var stockData = data.stockData
                                try {
                                    stockData = JSON.parse(stockData)
                                } catch (e) { }

                                var stockDataArr = []
                                for (var i = 0; i < stockData.length; i++) {
                                    stockDataArr.push([stockData[i].sizeVariantId, paymentsId, stockData[i].stock])
                                }

                                if (resultsHack[0].sizeTypeId.toString() === data.sizeTypeId.toString()) {
                                    conn.query({
                                        sql: 'INSERT INTO `stock_data` (`sizeVariantId`, `paymentsId`, `stock`) VALUES ? ON DUPLICATE KEY UPDATE `stock` = VALUES (`stock`);',
                                        timeout: 40000,
                                        values: [stockDataArr]
                                    }, async (error, results) => {
                                        if (error) {
                                            paymentsLogger.trace('vendor-payments-updatepayments - ' + token + ' - error in update query execution')
                                            paymentsLogger.error(error)
                                            conn.release();
                                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                                        } else {
                                            conn.release();
                                            return resolve({ status: 'success', msg: 'stock updated', data: { bResult: true } });
                                        }
                                    })
                                } else {
                                    conn.beginTransaction((err) => {
                                        if (err) {
                                            paymentsLogger.trace('vendor-payments-updatepayments - ' + token + ' - error in begin transaction')
                                            paymentsLogger.error(err)
                                            conn.release();
                                            return reject({ status: 'failed', err: err, data: { bResult: false } });
                                        } else {
                                            conn.query({
                                                sql: 'UPDATE `paymentss` SET `sizeTypeId` = ? WHERE `paymentsId` = ?;',
                                                timeout: 40000,
                                                values: [data.sizeTypeId, paymentsId]
                                            }, async (error, results) => {
                                                if (error) {
                                                    paymentsLogger.trace('vendor-payments-updatepayments - ' + token + ' - error in update query execution')
                                                    paymentsLogger.error(error)
                                                    return conn.rollback(() => {
                                                        conn.release();
                                                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                                                    });
                                                } else {
                                                    conn.query({
                                                        sql: 'DELETE FROM `stock_data` WHERE `paymentsId` = ?',
                                                        timeout: 40000,
                                                        values: [paymentsId]
                                                    }, async (error, results) => {
                                                        if (error) {
                                                            paymentsLogger.trace('vendor-payments-updatepayments - ' + token + ' - error in update query execution')
                                                            paymentsLogger.error(error)
                                                            return conn.rollback(() => {
                                                                conn.release();
                                                                return reject({ status: 'failed', err: error, data: { bResult: false } });
                                                            });
                                                        } else {
                                                            conn.query({
                                                                sql: 'INSERT INTO `stock_data` (`sizeVariantId`, `paymentsId`,`stock`) VALUES ?;',
                                                                timeout: 40000,
                                                                values: [stockDataArr]
                                                            }, async (error, results) => {
                                                                if (error) {
                                                                    paymentsLogger.trace('vendor-payments-updatepayments - ' + token + ' - error in update query execution')
                                                                    paymentsLogger.error(error)
                                                                    return conn.rollback(() => {
                                                                        conn.release();
                                                                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                                                                    });
                                                                } else {
                                                                    conn.commit((err) => {
                                                                        if (err) {
                                                                            paymentsLogger.trace('vendor-payments-updatepayments - ' + token + ' - error in commiting queries')
                                                                            paymentsLogger.error(err)
                                                                            return conn.rollback(() => {
                                                                                conn.release();
                                                                                return reject({ status: 'failed', err: err, data: { bResult: false } });
                                                                            });
                                                                        } else {
                                                                            conn.release();
                                                                            return resolve({ status: 'success', msg: 'stock updated', data: { bResult: true } });
                                                                        }
                                                                    });
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            } else {
                                conn.release();
                                return resolve({ status: 'success', msg: 'invalid vendor for the payments', data: { bResult: true } })
                            }
                        }
                    })
                }
            })
        } else {
            paymentsLogger.trace('vendor-payments-updateStockDetails - ' + token + ' - jwt verification error')
            paymentsLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

fetchAllpaymentss = (token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            dbpool.getConnection((err, conn) => {
                if (err) {
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'SELECT t1.paymentsId, t1.sku, t1.name, t1.filterColor, t1.price, t1.discount, t2.rootCategoryId, t2.rootCategoryName, t3.subCategoryId, t3.subCategoryName, t4.mainCategoryId, t4.mainCategoryName, t5.sizeTypeId, t5.sizeType, t5.sizeUnit, t5.stockUnit, GROUP_CONCAT(DISTINCT t6.sizeVariantId) AS `sizeVariantIds`, GROUP_CONCAT(DISTINCT t6.stock) AS `stocks`, GROUP_CONCAT(DISTINCT t7.sizeVariant) AS `sizeVariants`, t8.imageId, t8.imageName FROM `paymentss` t1 LEFT JOIN `root_categories` t2 ON t1.rootCategoryId = t2.rootCategoryId LEFT JOIN `sub_categories` t3 ON t2.subCategoryId = t3.subCategoryId LEFT JOIN `main_categories` t4 ON t3.mainCategoryId = t4.mainCategoryId LEFT JOIN `size_types` t5 ON t1.sizeTypeId = t5.sizeTypeId LEFT JOIN `stock_data` t6 ON t1.paymentsId = t6.paymentsId LEFT JOIN `size_variants` t7 ON t6.sizeVariantId = t7.sizeVariantId LEFT JOIN `payments_images` t8 ON t1.paymentsId = t8.paymentsId WHERE t1.vendorId = ? AND t1.isActive = TRUE GROUP BY t1.paymentsId;',
                        timeout: 40000,
                        values: [vendorId]
                    }, (error, results) => {
                        if (error) {
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            var resultsHack = JSON.parse(JSON.stringify(results))
                            var sizeVariantIdsArr = []
                            var stockArr = []
                            var sizeVariantNameArr = []
                            var stockData = []
                            for (var i = 0; i < resultsHack.length; i++) {
                                stockData = []
                                sizeVariantIdsArr = resultsHack[i].sizeVariantIds.split(",")
                                stockArr = resultsHack[i].stocks.split(",")
                                sizeVariantNameArr = resultsHack[i].sizeVariants.split(",")
                                for (var j = 0; j < sizeVariantIdsArr.length; j++) {
                                    stockData.push({ sizeVariantId: sizeVariantIdsArr[j], stock: stockArr[j], sizeVariant: sizeVariantNameArr[j] })
                                }
                                resultsHack[i].stockData = stockData
                                delete resultsHack[i].sizeVariantIds
                                delete resultsHack[i].sizeVariants
                                delete resultsHack[i].stocks
                            }
                            conn.release();
                            return resolve({ status: 'success', msg: 'all paymentss of vendor fetched', data: { paymentss: resultsHack, bResult: true } });
                        }
                    })
                }
            })
        } else {
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

fetchpaymentsDetails = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            dbpool.getConnection((err, conn) => {
                if (err) {
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'SELECT t1.paymentsId, t1.sku, t1.name, t1.shortDesc, t1.description, t1.color, t1.colorName, t1.filterColor, t1.additionalInfo, t1.price, t1.discount, t1.vendorId, t2.rootCategoryId, t2.rootCategoryName, t3.subCategoryId, t3.subCategoryName, t4.mainCategoryId, t4.mainCategoryName, t5.sizeTypeId, t5.sizeType, t5.sizeUnit, t5.stockUnit, GROUP_CONCAT(DISTINCT t6.sizeVariantId) AS `sizeVariantIds`, GROUP_CONCAT(DISTINCT t6.stock) AS `stocks`, GROUP_CONCAT( DISTINCT t7.sizeVariant) AS `sizeVariants`, GROUP_CONCAT( DISTINCT t8.imageId) AS imageIds, GROUP_CONCAT( DISTINCT t8.imageName) AS imageNames FROM `paymentss` t1 LEFT JOIN `root_categories` t2 ON t1.rootCategoryId = t2.rootCategoryId LEFT JOIN `sub_categories` t3 ON t2.subCategoryId = t3.subCategoryId LEFT JOIN `main_categories` t4 ON t3.mainCategoryId = t4.mainCategoryId LEFT JOIN `size_types` t5 ON t1.sizeTypeId = t5.sizeTypeId LEFT JOIN `stock_data` t6 ON t1.paymentsId = t6.paymentsId LEFT JOIN `size_variants` t7 ON t6.sizeVariantId = t7.sizeVariantId LEFT JOIN `payments_images` t8 ON t1.paymentsId = t8.paymentsId WHERE t1.paymentsId = ? AND t1.vendorId = ? AND t1.isActive = TRUE GROUP BY t1.vendorId;',
                        timeout: 40000,
                        values: [data.paymentsId, vendorId]
                    }, (error, results) => {
                        if (error) {
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            var resultsHack = JSON.parse(JSON.stringify(results))
                            if (resultsHack.length) {
                                var sizeVariantIdsArr = []
                                var stockArr = []
                                var sizeVariantNameArr = []
                                var stockData = []
                                var imageIdArr = []
                                var imageNameArr = []
                                var imageData = []
                                sizeVariantIdsArr = resultsHack[0].sizeVariantIds.split(",")
                                stockArr = resultsHack[0].stocks.split(",")
                                sizeVariantNameArr = resultsHack[0].sizeVariants.split(",")
                                if (resultsHack[0].imageIds != null) {
                                    imageIdArr = resultsHack[0].imageIds.split(",")
                                    imageNameArr = resultsHack[0].imageNames.split(",")
                                    for (var i = 0; i < imageIdArr.length; i++) {
                                        imageData.push({ imageId: imageIdArr[i], imageName: imageNameArr[i] })
                                    }
                                }
                                for (j = 0; j < sizeVariantIdsArr.length; j++) {
                                    stockData.push({ sizeVariantId: sizeVariantIdsArr[j], stock: stockArr[j], sizeVariant: sizeVariantNameArr[j] })
                                }
                                resultsHack[0].stockData = stockData
                                resultsHack[0].imageData = imageData
                                delete resultsHack[0].sizeVariantIds
                                delete resultsHack[0].sizeVariants
                                delete resultsHack[0].stocks
                                delete resultsHack[0].imageIds
                                delete resultsHack[0].imageNames
                                conn.release();
                                return resolve({ status: 'success', msg: 'all paymentss details of payments fetched', data: { paymentsDetails: resultsHack[0], bResult: true } });
                            } else {
                                conn.release();
                                return resolve({ status: 'success', msg: 'invalid payments for this vendor', data: { bResult: false } });
                            }
                        }
                    })
                }
            })
        } else {
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

module.exports = {
    fetchbilldetails,
    createbill,
    fetchSizeTypes,
    fetchSizeVariants,
    fetchMainCategories,
    fetchSubCategories,
    fetchRootCategories,
    addpayments,
    updatepayments,
    deletepaymentss,
    addpaymentsImages,
    deletepaymentsImages,
    updateStockDetails,
    fetchAllpaymentss,
    fetchpaymentsDetails
};
