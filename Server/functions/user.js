const dbpool = require('../database');

const jwt = require('../util/jwt');
const services = require('../util/services');
const bcrypt = require('../util/bcrypt');
const multer = require('multer');

const userLogger = require('log4js').getLogger('user');

fetchusers = () => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT * FROM Users;',
                    timeout: 40000
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'user data fetched', data: { data: resultsHack, bResult: true } });
                    }
                })
            }
        })
    })
};

fetchuserprofilebrief = () => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `id`, `displayName`, `isActive`, `imageId`, `phoneNumber`, `createdAt` FROM user_profile;',
                    timeout: 40000
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'user profile brief fetched', data: { data: resultsHack, bResult: true } });
                    }
                })
            }
        })
    })
};

fetchuserprofilecount = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                let sql = 'SELECT COUNT(*) as totalCount FROM user_profile';
                const values = [];
                if (data.isActive !== undefined) {
                    sql += ' WHERE `isActive` = ?';
                    values.push(data.isActive);
                }
                conn.query({
                    sql: sql,
                    timeout: 40000,
                    values: values
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'user profile count fetched', data: { data: resultsHack[0], bResult: true } });
                    }
                })
            }
        })
    }
    )
};

fetchuserprofiledetail = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT * FROM user_profile WHERE `id` = ?;',
                    timeout: 40000,
                    values: [data.id]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'user profile detail fetched', data: { data: resultsHack[0], bResult: true } });
                    }
                })
            }
        })
    }
    )
};

createuserprofile = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'INSERT INTO `user_profile` (`displayName`, `registeredName`, `phoneNumber`, `imageId`, `address`, `notes`, `agentId`) VALUES (?,?,?,?,?,?,?);',
                    timeout: 40000,
                    values: [data.displayName, data.registeredName, data.phoneNumber,data.imageId, data.address, data.notes, data.agentId]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        return resolve({ status: 'success', msg: 'user profile created', data: { sqllog: results, Result: true } });
                    }
                })
            }
        })
    }
    )
};

createuser = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'INSERT INTO `Users` (`name`, `isAttendance`, `isDaily`) VALUES (?,?,?);',
                    timeout: 40000,
                    values: [data.name, data.isAttendance, data.isDaily]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        return resolve({ status: 'success', msg: 'user created', data: { sqllog: results, Result: true } });
                    }
                })
            }
        })
    })
};
fetchVendorDetails = (token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId;
            dbpool.getConnection((err, conn) => {
                if (err) {
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'SELECT `vendorId`, `name`, `shopName`, `phone`, `country`, `state`, `district`, `block`, `locality`, `address`, `pincode` FROM `vendor_users` WHERE `vendorId` = ?;',
                        timeout: 40000,
                        values: [vendorId]
                    }, (error, results) => {
                        if (error) {
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            var resultsHack = JSON.parse(JSON.stringify(results))
                            if (resultsHack.length) {
                                conn.release();
                                return resolve({ status: 'success', msg: 'vendor data fetched', data: { vendorData: resultsHack[0], bResult: true } });
                            } else {
                                conn.release();
                                return reject({ status: 'failed', msg: 'vendor does not exists', data: { bResult: false } });
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

updateuser = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            var getGeoLocationRes = await services.getGeoLocation(data.pincode)
            if (getGeoLocationRes.error) {
                userLogger.trace('vendor-user-updateuser - ' + token + ' - error in fetching geolocation data')
                userLogger.error(getGeoLocationRes.error)
                return reject({ status: 'failed', err: getGeoLocationRes.error, data: { bResult: false } });
            } else {
                var vendorDataObj = {
                    name: data.name,
                    shopName: data.shopName,
                    country: getGeoLocationRes.msg.country,
                    state: getGeoLocationRes.msg.state,
                    district: getGeoLocationRes.msg.district,
                    block: getGeoLocationRes.msg.block,
                    locality: data.locality,
                    address: data.address,
                    pincode: data.pincode,
                    vendorId: vendorId
                }
                var vendorKeysArr = Object.keys(vendorDataObj)
                var vendorValuesArr = Object.values(vendorDataObj)
                var vendorDataArr = []

                vendorKeysArr.map((key, index) => {
                    vendorDataArr.push(key, vendorValuesArr[index])
                })
                dbpool.getConnection(async (err, conn) => {
                    if (err) {
                        userLogger.trace('vendor-user-updateuser - ' + token + ' - error in db connection')
                        userLogger.error(err)
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        conn.query({
                            sql: 'UPDATE `vendor_users` SET ??=?,??=?,??=?,??=?,??=?,??=?,??=?,??=?,??=? WHERE ??=?',
                            timeout: 40000,
                            values: vendorDataArr
                        }, (error, results) => {
                            if (error) {
                                userLogger.trace('vendor-user-updateuser - ' + token + ' - update query failed')
                                userLogger.error(error)
                                conn.release();
                                return reject({ status: 'failed', err: error, data: { bResult: false } });
                            } else {
                                conn.release();
                                return resolve({ status: 'success', msg: 'user updated', data: { bResult: true } });
                            }
                        })

                    }
                })
            }
        } else {
            userLogger.trace('vendor-user-updateuser - ' + token + ' - jwt verification error')
            userLogger.error(jwtResponse.error)
            return reject({ status: "failed", err: jwtResponse.error, data: { bResult: false } })
        }
    })
};

updatePhone = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId
            dbpool.getConnection((err, conn) => {
                if (err) {
                    userLogger.trace('vendor-user-updatePhone - ' + token + ' - error in db connection')
                    userLogger.error(err)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'UPDATE `vendor_users` SET `phone` = ? WHERE `vendorId` = ?;',
                        timeout: 40000,
                        values: [data.phone, vendorId]
                    }, (error, results) => {
                        if (error) {
                            userLogger.trace('vendor-user-updatePhone - ' + token + ' - update query failed')
                            userLogger.error(error)
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'phone updated', data: { bResult: true } });
                        }
                    })
                }
            })
        } else {
            userLogger.trace('vendor-user-updatePhone - ' + token + ' - jwt verification error')
            userLogger.error(jwtResponse.error)
            return reject({ status: "failed", err: jwtResponse.error, data: { bResult: false } })
        }
    })
};

changePassword = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token)
        if (jwtResponse.msg) {
            var vendorId = jwtResponse.msg.data.vendorId;
            var hashResponse = await bcrypt.hashPassword(data.password)
            if (hashResponse.error) {
                userLogger.trace('vendor-user-changePassword - ' + token + ' - error in hashing password')
                userLogger.error(hashResponse.error)
                return reject({ status: 'failed', err: hashResponse.error, data: { bResult: false } });
            } else {
                dbpool.getConnection((err, conn) => {
                    if (err) {
                        userLogger.trace('vendor-user-changePassword - ' + token + ' - error in db connection')
                        userLogger.error(err)
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        conn.query({
                            sql: 'UPDATE `vendor_users` SET `password` = ? WHERE `vendorId` = ?;',
                            timeout: 40000,
                            values: [hashResponse.msg, vendorId]
                        }, (error, results) => {
                            if (error) {
                                userLogger.trace('vendor-user-changePassword - ' + token + ' - error in update Query')
                                userLogger.error(error)
                                conn.release();
                                return reject({ status: 'failed', err: error, data: { bResult: false } });
                            } else {
                                conn.release();
                                return resolve({ status: 'success', msg: 'password changed', data: { bResult: true } });
                            }
                        })

                    }
                })
            }
        } else {
            userLogger.trace('vendor-user-changePassword - ' + token + ' - jwt verification error')
            userLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

module.exports = {
    fetchusers,
    fetchuserprofilebrief,
    fetchuserprofilecount,
    fetchuserprofiledetail,
    createuserprofile,
    createuser,
    fetchVendorDetails,
    updateuser,
    updatePhone,
    changePassword
};