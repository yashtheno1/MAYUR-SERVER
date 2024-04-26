const dbpool = require('../database');

const constants = require('../constants');

const bcrypt = require('../util/bcrypt');
const jwt = require('../util/jwt');
const generators = require('../util/generators');
const services = require('../util/services');

const enrollmentLogger = require('log4js').getLogger('enrollment');

fetchusercertifications = (data) => {
    // console.log("hi")
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                enrollmentLogger.trace('vendor-enrollment-fetchusercertifications - ' + data.userId + ' - error in db connection')
                enrollmentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT * FROM `certifications` WHERE `userId` = ?;',
                    timeout: 40000,
                    values: [data.userId]
                }, (error, results) => {
                    if (error) {
                        enrollmentLogger.trace('vendor-enrollment-fetchusercertifications - ' + data.userId + ' - error in select query')
                        enrollmentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        console.log(resultsHack)
                        return resolve({ status: 'success', msg: 'certifications fetched', data: { Types: resultsHack, bResult: true } });
                    }
                })
            }
        })
    }
    )
};

createenrollment = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                enrollmentLogger.trace('vendor-enrollment-createenrollment - ' + data.userId + ' - error in db connection')
                enrollmentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'INSERT INTO `enrollments` (`subType`,`cost`,`totalTime`,`isRenewal`,`User_profile_ID`,`type`) VALUES (?,?,?,?,?,?);',
                    timeout: 40000,
                    values: [data.subType, data.cost, data.totalTime, data.isRenewal, data.userId, data.type]
                }, (error, results) => {
                    if (error) {
                        enrollmentLogger.trace('vendor-enrollment-createenrollment - ' + data.userId + ' - error in insert query')
                        enrollmentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        return resolve({ status: 'success', msg: 'enrollment created', data: { enrollmentId: results.insertId, bResult: true } });
                    }
                })
            }
        })
    }
    )
};

fetchenrollments = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                enrollmentLogger.trace('vendor-enrollment-fetchenrollments - ' + data.userId + ' - error in db connection')
                enrollmentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT * FROM `enrollments` WHERE `User_profile_ID` = ?;',
                    timeout: 40000,
                    values: [data.userId]
                }, (error, results) => {
                    if (error) {
                        enrollmentLogger.trace('vendor-enrollment-fetchenrollments - ' + data.userId + ' - error in select query')
                        enrollmentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'enrollments fetched', data: { Types: resultsHack, bResult: true } });
                    }
                })
            }
        })
    }
    )
};


sendRegistrationAndUpdatePhoneOTP = (data) => {
    return new Promise(async (resolve, reject) => {
        var OTP = await generators.genAllInOne(true, false, false, data.length);
        dbpool.getConnection(async (err, conn) => {
            if (err) {
                enrollmentLogger.trace('vendor-enrollment-sendRegistrationAndUpdatePhoneOTP - ' + data.phone + ' - error in db connection')
                enrollmentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `vendorId` FROM `vendor_profiles` WHERE `phone` = ?;',
                    timeout: 40000,
                    values: [data.phone]
                }, async (error, results) => {
                    if (error) {
                        enrollmentLogger.trace('vendor-enrollment-sendRegistrationAndUpdatePhoneOTP - ' + data.phone + ' - error in select query execution')
                        enrollmentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        if (resultsHack.length) {
                            conn.release();
                            return resolve({ status: 'success', msg: 'phone already exists', data: { bResult: false } });
                        } else {
                            conn.query({
                                sql: 'INSERT INTO `otps` (`phone`, `otp`) VALUES (?,?) ON DUPLICATE KEY UPDATE `otp` = ?;',
                                timeout: 40000,
                                values: [data.phone, OTP, OTP]
                            }, async (error, results) => {
                                if (error) {
                                    enrollmentLogger.trace('vendor-enrollment-sendRegistrationAndUpdatePhoneOTP - ' + data.phone + ' - error in insert query execution')
                                    enrollmentLogger.error(error)
                                    conn.release();
                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                } else {
                                    var dataForSms = {
                                        numbers: data.phone,
                                        message_id: constants.MSG_FOR_enrollment_SEND_OTP,
                                        variables_values: OTP
                                    }
                                    var sendSmsRes = await services.sendSms(dataForSms)
                                    if (sendSmsRes.error) {
                                        enrollmentLogger.trace('vendor-enrollment-sendRegistrationAndUpdatePhoneOTP - ' + data.phone + ' - send sms error')
                                        enrollmentLogger.error(sendSmsRes.error)
                                        conn.release();
                                        return reject({ status: 'failed', err: sendSmsRes.error, data: { bResult: false } });
                                    } else {
                                        conn.release();
                                        return resolve({ status: 'success', msg: 'otp created and stored', data: { bResult: true } });
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    })
};

verifyOTP = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection(async (err, conn) => {
            if (err) {
                enrollmentLogger.trace('vendor-enrollment-verifyOTP - ' + data.phone + ' - error in db connection')
                enrollmentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT * FROM `otps` WHERE `phone` = ? AND `otp`= ? AND `updatedAt` > DATE_SUB( NOW(), INTERVAL 15 MINUTE ) AND `updatedAt` < NOW();',
                    timeout: 40000,
                    values: [data.phone, data.otp]
                }, async (error, results) => {
                    if (error) {
                        enrollmentLogger.trace('vendor-enrollment-verifyOTP - ' + data.phone + ' - error in select query')
                        enrollmentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        if (resultsHack.length) {
                            conn.release();
                            return resolve({ status: 'success', msg: 'otp verified', data: { bResult: true } });
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'invalid otp', data: { bResult: false } });
                        }
                    }
                })
            }
        })
    })
};

register = (data) => {
    return new Promise(async (resolve, reject) => {
        var getGeoLocationRes = await services.getGeoLocation(data.pincode)
        if (getGeoLocationRes.error) {
            enrollmentLogger.trace('vendor-enrollment-register - ' + data.phone + ' - error in fetching geolocation data')
            enrollmentLogger.error(getGeoLocationRes.error)
            return reject({ status: 'failed', err: getGeoLocationRes.error, data: { bResult: false } });
        } else {
            var vendorProfileData = data
            vendorProfileData.country = getGeoLocationRes.msg.country
            vendorProfileData.state = getGeoLocationRes.msg.state
            vendorProfileData.district = getGeoLocationRes.msg.district
            vendorProfileData.block = getGeoLocationRes.msg.block
            var hashResponse = await bcrypt.hashPassword(vendorProfileData.password)
            if (hashResponse.error) {
                enrollmentLogger.trace('vendor-enrollment-register - ' + vendorProfileData.phone + ' - error in calling hash password')
                enrollmentLogger.error(hashResponse.error)
                return reject({ status: 'failed', err: hashResponse.error, data: { bResult: false } });
            } else {
                vendorProfileData.password = hashResponse.msg
                dbpool.getConnection((err, conn) => {
                    if (err) {
                        enrollmentLogger.trace('vendor-enrollment-register - ' + vendorProfileData.phone + ' - error in db connection')
                        enrollmentLogger.error(err)
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        conn.query({
                            sql: 'INSERT INTO `vendor_profiles` (`name`,`shopName`,`phone`,`password`,`country`,`state`,`district`,`block`,`pincode`) VALUES (?,?,?,?,?,?,?,?,?);',
                            timeout: 40000,
                            values: [vendorProfileData.name, vendorProfileData.shopName, vendorProfileData.phone, vendorProfileData.password, vendorProfileData.country, vendorProfileData.state, vendorProfileData.district, vendorProfileData.block, vendorProfileData.pincode]
                        }, (error, results) => {
                            if (error) {
                                enrollmentLogger.trace('vendor-enrollment-register - ' + vendorProfileData.phone + ' - error in insert query')
                                enrollmentLogger.error(error)
                                conn.release();
                                return reject({ status: 'failed', err: error, data: { bResult: false } });
                            } else {
                                conn.release();
                                return resolve({ status: 'success', msg: 'vendor registered', data: { bResult: true } });
                            }
                        })

                    }
                })

            }
        }
    })
};

login = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                enrollmentLogger.trace('vendor-enrollment-login - ' + data.phone + ' - error in db connection')
                enrollmentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `vendorId`, `password` FROM `vendor_profiles` WHERE `phone` = ?;',
                    timeout: 40000,
                    values: [data.phone]
                }, async (error, results) => {
                    if (error) {
                        enrollmentLogger.trace('vendor-enrollment-login - ' + data.phone + ' - error in select query')
                        enrollmentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        if (resultsHack.length) {
                            var passwords = {
                                inputPassword: data.password,
                                databasePassword: resultsHack[0].password
                            }
                            var comparePasswordsResponse = await bcrypt.comparePassword(passwords)
                            if (comparePasswordsResponse.msg) {
                                var jwtData = {
                                    vendorId: resultsHack[0].vendorId
                                }
                                var jwtResponse = await jwt.jwtCreate({ data: jwtData, expiry: 31536000 })
                                if (jwtResponse.msg) {
                                    conn.release();
                                    return resolve({ status: 'success', msg: 'ok to login', data: { token: jwtResponse.msg, bResult: true } });
                                } else {
                                    enrollmentLogger.error(jwtResponse.error)
                                    enrollmentLogger.trace('vendor-enrollment-login - ' + data.phone + ' - error in jwt token creation')
                                    conn.release();
                                    return reject({ status: 'failed', err: jwtResponse.error, data: { bResult: false } });
                                }
                            } else {
                                conn.release();
                                return resolve({ status: 'success', msg: 'wrong password', data: { bResult: false } });
                            }
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'phone does not exists', data: { bResult: false } });
                        }
                    }
                })

            }
        })
    })
};

sendForgetPasswordOTP = (data) => {
    return new Promise(async (resolve, reject) => {
        var OTP = await generators.genAllInOne(true, false, false, data.length);
        dbpool.getConnection(async (err, conn) => {
            if (err) {
                enrollmentLogger.trace('vendor-enrollment-sendForgetPasswordOTP - ' + data.phone + ' - error in db connection')
                enrollmentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `vendorId` FROM `vendor_profiles` WHERE `phone` = ?;',
                    timeout: 40000,
                    values: [data.phone]
                }, async (error, results) => {
                    if (error) {
                        enrollmentLogger.trace('vendor-enrollment-sendForgetPasswordOTP - ' + data.phone + ' - error in select query')
                        enrollmentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        if (resultsHack.length) {
                            conn.query({
                                sql: 'INSERT INTO `otps` (`phone`, `otp`) VALUES (?,?) ON DUPLICATE KEY UPDATE `otp` = ?;',
                                timeout: 40000,
                                values: [data.phone, OTP, OTP]
                            }, async (error, results) => {
                                if (error) {
                                    enrollmentLogger.trace('vendor-enrollment-sendForgetPasswordOTP - ' + data.phone + ' - error in insert query')
                                    enrollmentLogger.error(error)
                                    conn.release();
                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                } else {
                                    var dataForSms = {
                                        numbers: data.phone,
                                        message_id: constants.MSG_FOR_enrollment_SEND_OTP,
                                        variables_values: OTP
                                    }
                                    var sendSmsRes = await services.sendSms(dataForSms)
                                    if (sendSmsRes.error) {
                                        enrollmentLogger.trace('vendor-enrollment-sendForgetPasswordOTP - ' + data.phone + ' - send sms error')
                                        enrollmentLogger.error(sendSmsRes.error)
                                        conn.release();
                                        return reject({ status: 'failed', err: sendSmsRes.error, data: { bResult: false } });
                                    } else {
                                        conn.release();
                                        return resolve({ status: 'success', msg: 'otp created and stored', data: { vendorId: resultsHack[0].vendorId, bResult: true } });
                                    }
                                }
                            })
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'phone does not exists', data: { bResult: false } });
                        }
                    }
                })
            }
        })
    })
};

updatePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        var hashResponse = await bcrypt.hashPassword(data.password)
        if (hashResponse.error) {
            enrollmentLogger.trace('vendor-enrollment-updatePassword - ' + data.vendorId + ' - error in hashing password')
            enrollmentLogger.error(hashResponse.error)
            return reject({ status: 'failed', err: hashResponse.error, data: { bResult: false } });
        } else {
            dbpool.getConnection((err, conn) => {
                if (err) {
                    enrollmentLogger.trace('vendor-enrollment-updatePassword - ' + data.vendorId + ' - error in db connection')
                    enrollmentLogger.error(err)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'UPDATE `vendor_profiles` SET `password` = ? WHERE `vendorId` = ?;',
                        timeout: 40000,
                        values: [hashResponse.msg, data.vendorId]
                    }, (error, results) => {
                        if (error) {
                            enrollmentLogger.trace('vendor-enrollment-updatePassword - ' + data.vendorId + ' - error in update query')
                            enrollmentLogger.error(error)
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'password updated', data: { bResult: true } });
                        }
                    })

                }
            })
        }
    })
};

module.exports = {
    fetchusercertifications,
    createenrollment,
    fetchenrollments,
    sendRegistrationAndUpdatePhoneOTP,
    verifyOTP,
    register,
    login,
    sendForgetPasswordOTP,
    updatePassword
};