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
                        // console.log(resultsHack)
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
                    values: [
                        data.subType === 'null' ? null : data.subType,
                        data.cost === 'null' ? null : data.cost,
                        data.totalTime === 'null' ? null : data.totalTime,
                        data.isRenewal === 'null' ? null : data.isRenewal,
                        data.userId === 'null' ? null : data.userId,
                        data.type === 'null' ? null : data.type
                    ]
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

module.exports = {
    fetchusercertifications,
    createenrollment,
    fetchenrollments
};