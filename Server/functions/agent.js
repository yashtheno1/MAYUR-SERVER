const dbpool = require('../database');

const constants = require('../constants');

const bcrypt = require('../util/bcrypt');
const jwt = require('../util/jwt');
const generators = require('../util/generators');
const services = require('../util/services');

const agentLogger = require('log4js').getLogger('agent');

sendRegistrationAndUpdatePhoneOTP = (data) => {
    return new Promise(async (resolve, reject) => {
        var OTP = await generators.genAllInOne(true, false, false, data.length);
        dbpool.getConnection(async (err, conn) => {
            if (err) {
                agentLogger.trace('customer-agent-sendRegistrationAndUpdatePhoneOTP - ' + data.phone + ' - error in db connection')
                agentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `customerId` FROM `customer_profiles` WHERE `phone` = ?;',
                    timeout: 40000,
                    values: [data.phone]
                }, async (error, results) => {
                    if (error) {
                        agentLogger.trace('customer-agent-sendRegistrationAndUpdatePhoneOTP - ' + data.phone + ' - error in select query execution')
                        agentLogger.error(error)
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
                                    agentLogger.trace('customer-agent-sendRegistrationAndUpdatePhoneOTP - ' + data.phone + ' - error in insert query execution')
                                    agentLogger.error(error)
                                    conn.release();
                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                } else {
                                    var dataForSms = {
                                        numbers: data.phone,
                                        message_id: constants.MSG_FOR_agent_SEND_OTP,
                                        variables_values: OTP
                                    }
                                    var sendSmsRes = await services.sendSms(dataForSms)
                                    if (sendSmsRes.error) {
                                        agentLogger.trace('customer-agent-sendRegistrationAndUpdatePhoneOTP - ' + data.phone + ' - send sms error')
                                        agentLogger.error(sendSmsRes.error)
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
                agentLogger.trace('customer-agent-verifyOTP - ' + data.phone + ' - error in db connection')
                agentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT * FROM `otps` WHERE `phone` = ? AND `otp`= ? AND `updatedAt` > DATE_SUB( NOW(), INTERVAL 15 MINUTE ) AND `updatedAt` < NOW();',
                    timeout: 40000,
                    values: [data.phone, data.otp]
                }, async (error, results) => {
                    if (error) {
                        agentLogger.trace('customer-agent-verifyOTP - ' + data.phone + ' - error in select query')
                        agentLogger.error(error)
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
        var hashResponse = await bcrypt.hashPassword(data.password)
        if (hashResponse.error) {
            agentLogger.trace('customer-agent-register - ' + data.phone + ' - error in calling hash password')
            agentLogger.error(hashResponse.error)
            return reject({ status: 'failed', err: hashResponse.error, data: { bResult: false } });
        } else {
            dbpool.getConnection((err, conn) => {
                if (err) {
                    agentLogger.trace('customer-agent-register - ' + data.phone + ' - error in db connection')
                    agentLogger.error(err)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'INSERT INTO `customer_profiles` (`name`,`phone`,`password`) VALUES (?,?,?);',
                        timeout: 40000,
                        values: [data.name, data.phone, hashResponse.msg]
                    }, (error, results) => {
                        if (error) {
                            agentLogger.trace('customer-agent-register - ' + data.phone + ' - error in insert query')
                            agentLogger.error(error)
                            conn.release();
                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                        } else {
                            conn.release();
                            return resolve({ status: 'success', msg: 'customer registered', data: { bResult: true } });
                        }
                    })

                }
            })

        }
    })
};

login = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                agentLogger.trace('customer-agent-login - ' + data.phone + ' - error in db connection')
                agentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `customerId`, `password` FROM `customer_profiles` WHERE `phone` = ?;',
                    timeout: 40000,
                    values: [data.phone]
                }, async (error, results) => {
                    if (error) {
                        agentLogger.trace('customer-agent-login - ' + data.phone + ' - error in select query')
                        agentLogger.error(error)
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
                                    customerId: resultsHack[0].customerId
                                }
                                var jwtResponse = await jwt.jwtCreate({ data: jwtData, expiry: 31536000 })
                                if (jwtResponse.msg) {
                                    conn.release();
                                    return resolve({ status: 'success', msg: 'ok to login', data: { token: jwtResponse.msg, bResult: true } });
                                } else {
                                    agentLogger.error(jwtResponse.error)
                                    agentLogger.trace('customer-agent-login - ' + data.phone + ' - error in jwt token creation')
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
                agentLogger.trace('customer-agent-sendForgetPasswordOTP - ' + data.phone + ' - error in db connection')
                agentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `customerId` FROM `customer_profiles` WHERE `phone` = ?;',
                    timeout: 40000,
                    values: [data.phone]
                }, async (error, results) => {
                    if (error) {
                        agentLogger.trace('customer-agent-sendForgetPasswordOTP - ' + data.phone + ' - error in select query')
                        agentLogger.error(error)
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
                                    agentLogger.trace('customer-agent-sendForgetPasswordOTP - ' + data.phone + ' - error in insert query')
                                    agentLogger.error(error)
                                    conn.release();
                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                } else {
                                    var dataForSms = {
                                        numbers: data.phone,
                                        message_id: constants.MSG_FOR_agent_SEND_OTP,
                                        variables_values: OTP
                                    }
                                    var sendSmsRes = await services.sendSms(dataForSms)
                                    if (sendSmsRes.error) {
                                        agentLogger.trace('customer-agent-sendForgetPasswordOTP - ' + data.phone + ' - send sms error')
                                        agentLogger.error(sendSmsRes.error)
                                        conn.release();
                                        return reject({ status: 'failed', err: sendSmsRes.error, data: { bResult: false } });
                                    } else {
                                        conn.release();
                                        return resolve({ status: 'success', msg: 'otp created and stored', data: { customerId: resultsHack[0].customerId, bResult: true } });
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
            agentLogger.trace('customer-agent-updatePassword - ' + data.customerId + ' - error in hashing password')
            agentLogger.error(hashResponse.error)
            return reject({ status: 'failed', err: hashResponse.error, data: { bResult: false } });
        } else {
            dbpool.getConnection((err, conn) => {
                if (err) {
                    agentLogger.trace('customer-agent-updatePassword - ' + data.customerId + ' - error in db connection')
                    agentLogger.error(err)
                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                } else {
                    conn.query({
                        sql: 'UPDATE `customer_profiles` SET `password` = ? WHERE `customerId` = ?;',
                        timeout: 40000,
                        values: [hashResponse.msg, data.customerId]
                    }, (error, results) => {
                        if (error) {
                            agentLogger.trace('customer-agent-updatePassword - ' + data.customerId + ' - error in update query')
                            agentLogger.error(error)
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
    sendRegistrationAndUpdatePhoneOTP,
    verifyOTP,
    register,
    login,
    sendForgetPasswordOTP,
    updatePassword
};