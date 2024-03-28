const dbpool = require('../database');

const bcrypt = require('../util/bcrypt');
const jwt = require('../util/jwt');
const services = require('../util/services');

const attendanceLogger = require('log4js').getLogger('attendance');

fetchCustomerDetails = (token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var customerId = jwtResponse.msg.data.customerId;
            dbpool.getConnection(async (err, conn) => {
                if (err) {
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'SELECT `name`, `phone` FROM `customer_attendances` WHERE `customerId` = ?;',
                        timeout: 40000,
                        values: [customerId]
                    }, async (error, results) => {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        if (error) {
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            var resultsHack = JSON.parse(JSON.stringify(results))
                            if (resultsHack.length) {
                                conn.release();
                                return resolve({ status: 'success', msg: 'customer data fetched', data: { customerData: resultsHack[0], bResult: true } });
                            } else {
                                conn.release();
                                return reject({ status: 'failed', msg: 'customer does not exists', data: { bResult: false } });
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

updateattendance = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var customerId = jwtResponse.msg.data.customerId
            dbpool.getConnection((err, conn) => {
                if (err) {
                    attendanceLogger.trace('customer-attendance-updateattendance - ' + token + ' - error in db connection')
                    attendanceLogger.error(err)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'UPDATE `customer_attendances` SET `name` = ? WHERE `customerId` = ?;',
                        timeout: 40000,
                        values: [data.name, customerId]
                    }, (error, results) => {
                        if (error) {
                            attendanceLogger.trace('customer-attendance-updateattendance - ' + token + ' - update query failed')
                            attendanceLogger.error(error)
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'attendance updated', data: { bResult: true } });
                        }
                    })
                }
            })
        } else {
            attendanceLogger.trace('customer-attendance-updateattendance - ' + token + ' - jwt verification error')
            attendanceLogger.error(jwtResponse.error)
            return reject({ status: "failed", err: jwtResponse.error, data: { bResult: false } })
        }
    })
};

updatePhone = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var customerId = jwtResponse.msg.data.customerId
            dbpool.getConnection((err, conn) => {
                if (err) {
                    attendanceLogger.trace('customer-attendance-updatePhone - ' + token + ' - error in db connection')
                    attendanceLogger.error(err)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'UPDATE `customer_attendances` SET `phone` = ? WHERE `customerId` = ?;',
                        timeout: 40000,
                        values: [data.phone, customerId]
                    }, (error, results) => {
                        if (error) {
                            attendanceLogger.trace('customer-attendance-updatePhone - ' + token + ' - update query failed')
                            attendanceLogger.error(error)
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
            attendanceLogger.trace('customer-attendance-updatePhone - ' + token + ' - jwt verification error')
            attendanceLogger.error(jwtResponse.error)
            return reject({ status: "failed", err: jwtResponse.error, data: { bResult: false } })
        }
    })
};

changePassword = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token)
        if (jwtResponse.msg) {
            var customerId = jwtResponse.msg.data.customerId;
            var hashResponse = await bcrypt.hashPassword(data.password)
            if (hashResponse.error) {
                attendanceLogger.trace('customer-attendance-changePassword - ' + token + ' - error in hashing password')
                attendanceLogger.error(hashResponse.error)
                return reject({ status: 'failed', err: hashResponse.error, data: { bResult: false } });
            } else {
                dbpool.getConnection((err, conn) => {
                    if (err) {
                        attendanceLogger.trace('customer-attendance-changePassword - ' + token + ' - error in db connection')
                        attendanceLogger.error(err)
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        conn.query({
                            sql: 'UPDATE `customer_attendances` SET `password` = ? WHERE `customerId` = ?;',
                            timeout: 40000,
                            values: [hashResponse.msg, customerId]
                        }, (error, results) => {
                            if (error) {
                                attendanceLogger.trace('customer-attendance-changePassword - ' + token + ' - error in update Query')
                                attendanceLogger.error(error)
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
            attendanceLogger.trace('customer-attendance-changePassword - ' + token + ' - jwt verification error')
            attendanceLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

addAddress = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var customerId = jwtResponse.msg.data.customerId
            var getGeoLocationRes = await services.getGeoLocation(data.pincode)
            if (getGeoLocationRes.error) {
                attendanceLogger.trace('customer-attendance-addAddress - ' + token + ' - error in fetching geolocation data')
                attendanceLogger.error(getGeoLocationRes.error)
                return reject({ status: 'failed', err: getGeoLocationRes.error, data: { bResult: false } });
            } else {
                var addressDataObj = {
                    country: getGeoLocationRes.msg.country,
                    state: getGeoLocationRes.msg.state,
                    district: getGeoLocationRes.msg.district,
                    block: getGeoLocationRes.msg.block,
                    locality: data.locality,
                    address: data.address,
                    pincode: data.pincode,
                    customerId: customerId
                }
                dbpool.getConnection((err, conn) => {
                    if (err) {
                        attendanceLogger.trace('customer-attendance-addAddress - ' + token + ' - error in db connection')
                        attendanceLogger.error(err)
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        conn.query({
                            sql: 'INSERT INTO `customer_addresses` (`country`, `state`, `district`, `block`, `locality`, `address`, `pincode`, `customerId`) VALUES (?,?,?,?,?,?,?,?);',
                            timeout: 40000,
                            values: [addressDataObj.country, addressDataObj.state, addressDataObj.district, addressDataObj.block, addressDataObj.locality, addressDataObj.address, addressDataObj.pincode, addressDataObj.customerId]
                        }, (error, results) => {
                            if (error) {
                                attendanceLogger.trace('customer-attendance-addAddress - ' + token + ' - update query failed')
                                attendanceLogger.error(error)
                                conn.release();
                                return reject({ status: 'failed', err: error, data: { bResult: false } });
                            } else {
                                conn.release();
                                return resolve({ status: 'success', msg: 'address Added', data: { bResult: true } });
                            }
                        })
                    }
                })
            }
        } else {
            attendanceLogger.trace('customer-attendance-addAddress - ' + token + ' - jwt verification error')
            attendanceLogger.error(jwtResponse.error)
            return reject({ status: "failed", err: jwtResponse.error, data: { bResult: false } })
        }
    })
};

updateAddress = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token);
        if (jwtResponse.msg) {
            var getGeoLocationRes = await services.getGeoLocation(data.pincode)
            if (getGeoLocationRes.error) {
                attendanceLogger.trace('customer-attendance-updateAddress - ' + token + ' - error in fetching geolocation data')
                attendanceLogger.error(getGeoLocationRes.error)
                return reject({ status: 'failed', err: getGeoLocationRes.error, data: { bResult: false } });
            } else {
                var addressDataObj = {
                    country: getGeoLocationRes.msg.country,
                    state: getGeoLocationRes.msg.state,
                    district: getGeoLocationRes.msg.district,
                    block: getGeoLocationRes.msg.block,
                    locality: data.locality,
                    address: data.address,
                    pincode: data.pincode,
                    addressId: data.addressId
                }
                var addressKeysArr = Object.keys(addressDataObj)
                var addressValuesArr = Object.values(addressDataObj)
                var addressDataArr = []
                for (i = 0; i < addressKeysArr.length; i++) {
                    addressDataArr.push(addressKeysArr[i], addressValuesArr[i])
                }
                dbpool.getConnection((err, conn) => {
                    if (err) {
                        attendanceLogger.trace('customer-attendance-updateAddress - ' + token + ' - error in db connection')
                        attendanceLogger.error(err)
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        conn.query({
                            sql: 'UPDATE `customer_addresses` SET ??=?, ??=?, ??=?, ??=?, ??=?, ??=?, ??=? WHERE ??=?;',
                            timeout: 40000,
                            values: addressDataArr
                        }, (error, results) => {
                            if (error) {
                                attendanceLogger.trace('customer-attendance-updateAddress - ' + token + ' - update query failed')
                                attendanceLogger.error(error)
                                conn.release();
                                return reject({ status: 'failed', err: error, data: { bResult: false } });
                            } else {
                                conn.release();
                                return resolve({ status: 'success', msg: 'address updated', data: { bResult: true } });
                            }
                        })
                    }
                })
            }
        } else {
            attendanceLogger.trace('customer-attendance-updateAddress - ' + token + ' - jwt verification error')
            attendanceLogger.error(jwtResponse.error)
            return reject({ status: "failed", err: jwtResponse.error, data: { bResult: false } })
        }
    })
};

deleteAddress = (data, token) => {
    return new Promise(async (resolve, reject) => {
        var jwtResponse = await jwt.jwtVerify(token)
        if (jwtResponse.msg) {
            dbpool.getConnection((err, conn) => {
                if (err) {
                    attendanceLogger.trace('customer-attendance-deleteAddress - ' + token + ' - error in db connection')
                    attendanceLogger.error(err)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'DELETE FROM `customer_addresses` WHERE `addressId` = ?;',
                        timeout: 40000,
                        values: [data.addressId]
                    }, (error, results) => {
                        if (error) {
                            attendanceLogger.trace('customer-attendance-deleteAddress - ' + token + ' - error in update Query')
                            attendanceLogger.error(error)
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'address deleted', data: { bResult: true } });
                        }
                    })

                }
            })
        } else {
            attendanceLogger.trace('customer-attendance-deleteAddress - ' + token + ' - jwt verification error')
            attendanceLogger.error(jwtResponse.error)
            return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
        }
    })
};

module.exports = {
    fetchCustomerDetails,
    updateattendance,
    updatePhone,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress
};