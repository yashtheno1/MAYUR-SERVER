const dbpool = require('../database');
const path = require('path');
const fs = require('fs');

const constants = require('../constants');

const jwt = require('../util/jwt');
const multer = require('../util/multer');

const otherLogger = require('log4js').getLogger('other');

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

addother = (req, res) => {
    return new Promise(async (resolve, reject) => {
        var token = req.headers.authorization;
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId;
            var multerUploadResponse = await multer.multerUpload(req, res, constants.PATH_FOR_other_IMAGES)
            if (multerUploadResponse.msg) {
                dbpool.getConnection(async (err, conn) => {
                    if (err) {
                        otherLogger.trace('vendor-other-addother - ' + token + ' - error in db connection')
                        otherLogger.error(err)
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        var otherDetails = multerUploadResponse.bodyObj.otherDetails
                        try {
                            otherDetails = JSON.parse(otherDetails)
                        } catch (e) { }
                        otherDetails.vendorId = vendorId
                        var otherDetailsKeysArr = Object.keys(otherDetails)
                        var otherDetailsValuesArr = Object.values(otherDetails)
                        var otherDetailsArr = otherDetailsKeysArr.concat(otherDetailsValuesArr)
                        conn.beginTransaction((err) => {
                            if (err) {
                                otherLogger.trace('vendor-other-addother - ' + token + ' - error in begin transaction')
                                otherLogger.error(err)
                                conn.release();
                                return reject({ status: 'failed', err: err, data: { bResult: false } });
                            } else {
                                conn.query({
                                    sql: 'INSERT INTO `others` (??,??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);',
                                    timeout: 40000,
                                    values: otherDetailsArr
                                }, async (error, results) => {
                                    if (error) {
                                        otherLogger.trace('vendor-other-addother - ' + token + ' - error in insert query execution')
                                        otherLogger.error(error)
                                        return conn.rollback(() => {
                                            conn.release();
                                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                                        });
                                    } else {
                                        var otherId = JSON.parse(JSON.stringify(results)).insertId
                                        var stockData = multerUploadResponse.bodyObj.stockData
                                        try {
                                            stockData = JSON.parse(stockData)
                                        } catch (e) { }
                                        var stockDataArr = []
                                        for (var j = 0; j < stockData.length; j++) {
                                            stockDataArr.push([stockData[j].sizeVariantId, otherId, stockData[j].stock])
                                        }
                                        conn.query({
                                            sql: 'INSERT INTO `stock_data` (`sizeVariantId`,`otherId`,`stock`) VALUES ?;',
                                            timeout: 40000,
                                            values: [stockDataArr]
                                        }, async (error, results) => {
                                            if (error) {
                                                otherLogger.trace('vendor-other-addother - ' + token + ' - error in insert query execution')
                                                otherLogger.error(error)
                                                return conn.rollback(() => {
                                                    conn.release();
                                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                                });
                                            } else {
                                                var filenameArray = multerUploadResponse.filenameArray
                                                if (filenameArray.length) {
                                                    var otherImageDataArr = []
                                                    for (var i = 0; i < filenameArray.length; i++) {
                                                        otherImageDataArr.push([filenameArray[i], otherId])
                                                    }
                                                    conn.query({
                                                        sql: 'INSERT INTO `other_images` (`imageName`, `otherId`) VALUES ?;',
                                                        timeout: 40000,
                                                        values: [otherImageDataArr]
                                                    }, (error, results) => {
                                                        if (error) {
                                                            otherLogger.trace('vendor-other-addother - ' + token + ' - error in insert query execution')
                                                            otherLogger.error(error)
                                                            return conn.rollback(() => {
                                                                conn.release();
                                                                return reject({ status: 'failed', err: error, data: { bResult: false } });
                                                            });
                                                        } else {
                                                            conn.commit((err) => {
                                                                if (err) {
                                                                    otherLogger.trace('vendor-other-addother - ' + token + ' - error in commiting queries')
                                                                    otherLogger.error(err)
                                                                    return conn.rollback(() => {
                                                                        conn.release();
                                                                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                                                                    });
                                                                } else {
                                                                    conn.release();
                                                                    return resolve({ status: 'success', msg: 'other Uploaded', data: { bResult: true } });
                                                                }
                                                            });
                                                        }
                                                    })
                                                } else {
                                                    conn.commit((err) => {
                                                        if (err) {
                                                            otherLogger.trace('vendor-other-addother - ' + token + ' - error in commiting queries')
                                                            otherLogger.error(err)
                                                            return conn.rollback(() => {
                                                                conn.release();
                                                                return reject({ status: 'failed', err: err, data: { bResult: false } });
                                                            });
                                                        } else {
                                                            conn.release();
                                                            return resolve({ status: 'success', msg: 'other Uploaded', data: { bResult: true } });
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
                otherLogger.trace('vendor-other-addother - ' + token + ' - image upload error')
                otherLogger.error(multerUploadResponse.error)
                return reject({ status: 'failed', err: multerUploadResponse.error, data: { bResult: false } });
            }
        } else {
            otherLogger.trace('vendor-other-addother - ' + token + ' - jwt verification error')
            otherLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

updateother = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            dbpool.getConnection(async (err, conn) => {
                if (err) {
                    otherLogger.trace('vendor-other-updateother - ' + token + ' - error in db connection')
                    otherLogger.error(err)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    var updatedProdData = data;
                    updatedProdData.vendorId = jwtResponse.msg.data.vendorId;
                    var otherDetailsKeysArr = Object.keys(updatedProdData);
                    var otherDetailsValuesArr = Object.values(updatedProdData);
                    var otherDataVals = [];
                    var qmStr = '';
                    for (var i = 0; i < otherDetailsKeysArr.length; i++) {
                        otherDataVals.push(otherDetailsKeysArr[i], otherDetailsValuesArr[i])
                        qmStr = qmStr + '??=?,'
                    }
                    qmStr = qmStr.substring(0, qmStr.length - 11)
                    conn.query({
                        sql: 'UPDATE `others` SET ' + qmStr + ' WHERE ??=? AND ??=?;',
                        timeout: 40000,
                        values: otherDataVals
                    }, async (error, results) => {
                        if (error) {
                            otherLogger.trace('vendor-other-updateother - ' + token + ' - error in update query execution')
                            otherLogger.error(error)
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'other updated', data: { bResult: true } });
                        }
                    })
                }
            })
        } else {
            otherLogger.trace('vendor-other-updateother - ' + token + ' - jwt verification error')
            otherLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

deleteothers = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            dbpool.getConnection(async (err, conn) => {
                if (err) {
                    otherLogger.trace('vendor-other-deleteother - ' + token + ' - error in db connection')
                    otherLogger.error(err)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    var otherIds = data.otherIds
                    try {
                        otherIds = JSON.parse(otherIds)
                    } catch (e) { }

                    conn.query({
                        sql: 'UPDATE `others` SET `isActive` = FALSE WHERE `vendorId` = ? AND `otherId` IN (?);',
                        timeout: 40000,
                        values: [jwtResponse.msg.data.vendorId, otherIds]
                    }, async (error, results) => {
                        if (error) {
                            otherLogger.trace('vendor-other-deleteother - ' + token + ' - error in update query execution')
                            otherLogger.error(error)
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'other deleted', data: { bResult: true } });
                        }
                    })
                }
            })
        } else {
            otherLogger.trace('vendor-other-deleteother - ' + token + ' - jwt verification error')
            otherLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

addotherImages = (req, res) => {
    return new Promise(async (resolve, reject) => {
        var token = req.headers.authorization;
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            var multerUploadResponse = await multer.multerUpload(req, res, constants.PATH_FOR_other_IMAGES)
            if (multerUploadResponse.msg) {
                var filenameArray = multerUploadResponse.filenameArray
                if (filenameArray.length) {

                    var otherId = multerUploadResponse.bodyObj.otherId
                    dbpool.getConnection((err, conn) => {
                        if (err) {
                            otherLogger.trace('vendor-other-addotherImages - ' + token + ' - error in db connection')
                            otherLogger.error(error)
                            return reject({ status: 'failed', err: err, data: { bResult: false } });
                        } else {
                            conn.query({
                                sql: 'SELECT `otherId` FROM `others` WHERE `otherId` = ? AND `vendorId`= ?;',
                                timeout: 40000,
                                values: [otherId, vendorId]
                            }, (error, results) => {
                                if (error) {
                                    otherLogger.trace('vendor-other-addotherImages - ' + token + ' - error in select query execution')
                                    otherLogger.error(error)
                                    conn.release();
                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                } else {
                                    var resultsHack = JSON.parse(JSON.stringify(results))
                                    if (resultsHack.length) {

                                        var otherImageDataArr = []
                                        for (var i = 0; i < filenameArray.length; i++) {
                                            otherImageDataArr.push([filenameArray[i], otherId])
                                        }
                                        conn.query({
                                            sql: 'INSERT INTO `other_images` (`imageName`, `otherId`) VALUES ?;',
                                            timeout: 40000,
                                            values: [otherImageDataArr]
                                        }, (error, results) => {
                                            if (error) {
                                                otherLogger.trace('vendor-other-addotherImages - ' + token + ' - error in insert query execution')
                                                otherLogger.error(error)
                                                conn.release();
                                                return reject({ status: 'failed', err: error, data: { bResult: false } });
                                            } else {
                                                conn.release();
                                                return resolve({ status: 'success', msg: 'other images uploaded', data: { bResult: true } });
                                            }
                                        })
                                    } else {
                                        conn.release();
                                        return resolve({ status: 'failed', msg: 'invalid vendor for the other', data: { bResult: false } });
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
                otherLogger.trace('vendor-other-addotherImages - ' + token + ' - image upload error')
                otherLogger.error(multerUploadResponse.error)
                return reject({ status: 'failed', err: multerUploadResponse.error, data: { bResult: false } });
            }
        } else {
            otherLogger.trace('vendor-other-addotherImages - ' + token + ' - jwt verification error')
            otherLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

deleteotherImages = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            var otherId = data.otherId
            dbpool.getConnection((err, conn) => {
                if (err) {
                    otherLogger.trace('vendor-other-deleteotherImages - ' + token + ' - error in db connection')
                    otherLogger.error(error)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'SELECT `otherId` FROM `others` WHERE `otherId` = ? AND `vendorId`= ?;',
                        timeout: 40000,
                        values: [otherId, vendorId]
                    }, (error, results) => {
                        if (error) {
                            otherLogger.trace('vendor-other-deleteotherImages - ' + token + ' - error in select query execution')
                            otherLogger.error(error)
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
                                        sql: 'DELETE FROM `other_images` WHERE `otherId` = ? AND `imageName` IN (?)',
                                        timeout: 40000,
                                        values: [otherId, fileNameArr]
                                    }, (error, results) => {
                                        if (error) {
                                            otherLogger.trace('vendor-other-deleteotherImages - ' + token + ' - error in insert query execution')
                                            otherLogger.error(error)
                                            conn.release();
                                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                                        } else {
                                            var filePath = "";
                                            for (i = 0; i < filenameArray.length; i++) {
                                                filePath = path.join(__basedir, constants.PATH_FOR_other_IMAGES, filenameArray[i]);
                                                if (fs.existsSync(filePath)) {
                                                    fs.unlinkSync(filePath)
                                                }
                                            }
                                            conn.release();
                                            return resolve({ status: 'success', msg: 'other images deleted', data: { bResult: true } });
                                        }
                                    })
                                } else {
                                    conn.release();
                                    return resolve({ status: 'success', msg: 'other images deleted', data: { bResult: true } });
                                }
                            } else {
                                conn.release();
                                return resolve({ status: 'failed', msg: 'invalid vendor for the other', data: { bResult: false } });
                            }
                        }
                    })
                }
            })
        } else {
            otherLogger.trace('vendor-other-deleteotherImages - ' + token + ' - jwt verification error')
            otherLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

updateStockDetails = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            var otherId = data.otherId
            dbpool.getConnection((err, conn) => {
                if (err) {
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'SELECT `sizeTypeId` FROM `others` WHERE `otherId` = ? AND `vendorId`= ?;',
                        timeout: 40000,
                        values: [otherId, vendorId]
                    }, (error, results) => {
                        if (error) {
                            otherLogger.trace('vendor-other-updateStockDetails - ' + token + ' - error in select query execution')
                            otherLogger.error(error)
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
                                    stockDataArr.push([stockData[i].sizeVariantId, otherId, stockData[i].stock])
                                }

                                if (resultsHack[0].sizeTypeId.toString() === data.sizeTypeId.toString()) {
                                    conn.query({
                                        sql: 'INSERT INTO `stock_data` (`sizeVariantId`, `otherId`, `stock`) VALUES ? ON DUPLICATE KEY UPDATE `stock` = VALUES (`stock`);',
                                        timeout: 40000,
                                        values: [stockDataArr]
                                    }, async (error, results) => {
                                        if (error) {
                                            otherLogger.trace('vendor-other-updateother - ' + token + ' - error in update query execution')
                                            otherLogger.error(error)
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
                                            otherLogger.trace('vendor-other-updateother - ' + token + ' - error in begin transaction')
                                            otherLogger.error(err)
                                            conn.release();
                                            return reject({ status: 'failed', err: err, data: { bResult: false } });
                                        } else {
                                            conn.query({
                                                sql: 'UPDATE `others` SET `sizeTypeId` = ? WHERE `otherId` = ?;',
                                                timeout: 40000,
                                                values: [data.sizeTypeId, otherId]
                                            }, async (error, results) => {
                                                if (error) {
                                                    otherLogger.trace('vendor-other-updateother - ' + token + ' - error in update query execution')
                                                    otherLogger.error(error)
                                                    return conn.rollback(() => {
                                                        conn.release();
                                                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                                                    });
                                                } else {
                                                    conn.query({
                                                        sql: 'DELETE FROM `stock_data` WHERE `otherId` = ?',
                                                        timeout: 40000,
                                                        values: [otherId]
                                                    }, async (error, results) => {
                                                        if (error) {
                                                            otherLogger.trace('vendor-other-updateother - ' + token + ' - error in update query execution')
                                                            otherLogger.error(error)
                                                            return conn.rollback(() => {
                                                                conn.release();
                                                                return reject({ status: 'failed', err: error, data: { bResult: false } });
                                                            });
                                                        } else {
                                                            conn.query({
                                                                sql: 'INSERT INTO `stock_data` (`sizeVariantId`, `otherId`,`stock`) VALUES ?;',
                                                                timeout: 40000,
                                                                values: [stockDataArr]
                                                            }, async (error, results) => {
                                                                if (error) {
                                                                    otherLogger.trace('vendor-other-updateother - ' + token + ' - error in update query execution')
                                                                    otherLogger.error(error)
                                                                    return conn.rollback(() => {
                                                                        conn.release();
                                                                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                                                                    });
                                                                } else {
                                                                    conn.commit((err) => {
                                                                        if (err) {
                                                                            otherLogger.trace('vendor-other-updateother - ' + token + ' - error in commiting queries')
                                                                            otherLogger.error(err)
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
                                return resolve({ status: 'success', msg: 'invalid vendor for the other', data: { bResult: true } })
                            }
                        }
                    })
                }
            })
        } else {
            otherLogger.trace('vendor-other-updateStockDetails - ' + token + ' - jwt verification error')
            otherLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

fetchAllothers = (token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            dbpool.getConnection((err, conn) => {
                if (err) {
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'SELECT t1.otherId, t1.sku, t1.name, t1.filterColor, t1.price, t1.discount, t2.rootCategoryId, t2.rootCategoryName, t3.subCategoryId, t3.subCategoryName, t4.mainCategoryId, t4.mainCategoryName, t5.sizeTypeId, t5.sizeType, t5.sizeUnit, t5.stockUnit, GROUP_CONCAT(DISTINCT t6.sizeVariantId) AS `sizeVariantIds`, GROUP_CONCAT(DISTINCT t6.stock) AS `stocks`, GROUP_CONCAT(DISTINCT t7.sizeVariant) AS `sizeVariants`, t8.imageId, t8.imageName FROM `others` t1 LEFT JOIN `root_categories` t2 ON t1.rootCategoryId = t2.rootCategoryId LEFT JOIN `sub_categories` t3 ON t2.subCategoryId = t3.subCategoryId LEFT JOIN `main_categories` t4 ON t3.mainCategoryId = t4.mainCategoryId LEFT JOIN `size_types` t5 ON t1.sizeTypeId = t5.sizeTypeId LEFT JOIN `stock_data` t6 ON t1.otherId = t6.otherId LEFT JOIN `size_variants` t7 ON t6.sizeVariantId = t7.sizeVariantId LEFT JOIN `other_images` t8 ON t1.otherId = t8.otherId WHERE t1.vendorId = ? AND t1.isActive = TRUE GROUP BY t1.otherId;',
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
                            return resolve({ status: 'success', msg: 'all others of vendor fetched', data: { others: resultsHack, bResult: true } });
                        }
                    })
                }
            })
        } else {
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

fetchotherDetails = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            dbpool.getConnection((err, conn) => {
                if (err) {
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'SELECT t1.otherId, t1.sku, t1.name, t1.shortDesc, t1.description, t1.color, t1.colorName, t1.filterColor, t1.additionalInfo, t1.price, t1.discount, t1.vendorId, t2.rootCategoryId, t2.rootCategoryName, t3.subCategoryId, t3.subCategoryName, t4.mainCategoryId, t4.mainCategoryName, t5.sizeTypeId, t5.sizeType, t5.sizeUnit, t5.stockUnit, GROUP_CONCAT(DISTINCT t6.sizeVariantId) AS `sizeVariantIds`, GROUP_CONCAT(DISTINCT t6.stock) AS `stocks`, GROUP_CONCAT( DISTINCT t7.sizeVariant) AS `sizeVariants`, GROUP_CONCAT( DISTINCT t8.imageId) AS imageIds, GROUP_CONCAT( DISTINCT t8.imageName) AS imageNames FROM `others` t1 LEFT JOIN `root_categories` t2 ON t1.rootCategoryId = t2.rootCategoryId LEFT JOIN `sub_categories` t3 ON t2.subCategoryId = t3.subCategoryId LEFT JOIN `main_categories` t4 ON t3.mainCategoryId = t4.mainCategoryId LEFT JOIN `size_types` t5 ON t1.sizeTypeId = t5.sizeTypeId LEFT JOIN `stock_data` t6 ON t1.otherId = t6.otherId LEFT JOIN `size_variants` t7 ON t6.sizeVariantId = t7.sizeVariantId LEFT JOIN `other_images` t8 ON t1.otherId = t8.otherId WHERE t1.otherId = ? AND t1.vendorId = ? AND t1.isActive = TRUE GROUP BY t1.vendorId;',
                        timeout: 40000,
                        values: [data.otherId, vendorId]
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
                                return resolve({ status: 'success', msg: 'all others details of other fetched', data: { otherDetails: resultsHack[0], bResult: true } });
                            } else {
                                conn.release();
                                return resolve({ status: 'success', msg: 'invalid other for this vendor', data: { bResult: false } });
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
    fetchSizeTypes,
    fetchSizeVariants,
    fetchMainCategories,
    fetchSubCategories,
    fetchRootCategories,
    addother,
    updateother,
    deleteothers,
    addotherImages,
    deleteotherImages,
    updateStockDetails,
    fetchAllothers,
    fetchotherDetails
};
