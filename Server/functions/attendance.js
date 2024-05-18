const dbpool = require('../database');

const bcrypt = require('../util/bcrypt');
const jwt = require('../util/jwt');
const services = require('../util/services');

const attendanceLogger = require('log4js').getLogger('attendance');

fetchAttendance = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                attendanceLogger.trace('customer-attendance-fetchAttendance - ' + data.userId + ' - error in db connection')
                attendanceLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT * FROM `attendance` WHERE `Enrollment_ID` = ?;',
                    timeout: 40000,
                    values: [data.enrollmentId]
                }, (error, results) => {
                    if (error) {
                        attendanceLogger.trace('customer-attendance-fetchAttendance - ' + data.userId + ' - error in fetching attendance')
                        attendanceLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    }
                    else {
                        resultsHack = JSON.parse(JSON.stringify(results))
                        let totalTime = 0;
                        resultsHack.forEach((data) => {
                            totalTime += data.session;
                        });
                        conn.release();
                        return resolve({ status: 'success', msg: 'attendance fetched', data: { totalTime: totalTime, attendance: resultsHack, bResult: true } });
                    }
                })
            }
        })
    })
};

addAttendance = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                attendanceLogger.trace('customer-attendance-addAttendance - ' + data.userId + ' - error in db connection')
                attendanceLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'INSERT INTO `attendance` (`Enrollment_ID`, `Type`, `isPresent`, `inTime`, `outTime`, `session`, `Vehicle_ID`) VALUES (?,?,?,?,?,?,?);',
                    timeout: 40000,
                    values: [
                        data.enrollmentId,
                        data.type === 'null' ? null : data.type,
                        data.isPresent === 'null' ? null : data.isPresent,
                        data.inTime === 'null' ? null : data.inTime,
                        data.outTime === 'null' ? null : data.outTime,
                        data.session === 'null' ? null : data.session,
                        data.vehicleId === 'null' ? null : data.vehicleId
                    ]
                }, (error, results) => {
                    if (error) {
                        attendanceLogger.trace('customer-attendance-addAttendance - ' + data.userId + ' - error in inserting attendance')
                        attendanceLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        return resolve({ status: 'success', msg: 'attendance added', data: { bResult: true } });
                    }
                })
            }
        })
    })
};

updateAttendance = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                attendanceLogger.trace('customer-attendance-updateAttendance - ' + data.userId + ' - error in db connection')
                attendanceLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'UPDATE `attendance` SET `isPresent` = ?, `inTime` = ?, `outTime` = ?, `session` = ? WHERE `ID` = ?;',
                    timeout: 40000,
                    values: [
                        data.isPresent === 'null' ? null : data.isPresent,
                        data.inTime === 'null' ? null : data.inTime,
                        data.outTime === 'null' ? null : data.outTime,
                        data.session === 'null' ? null : data.session,
                        data.attendanceId
                    ]
                }, (error, results) => {
                    if (error) {
                        attendanceLogger.trace('customer-attendance-updateAttendance - ' + data.userId + ' - error in updating attendance')
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
    })
};

fetchalluserAttendance = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                attendanceLogger.trace('customer-attendance-fetchalluserAttendance - ' + data.userId + ' - error in db connection')
                attendanceLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT enrollments.*,enrollments.ID AS EID, user_profile.* FROM enrollments JOIN user_profile ON enrollments.User_profile_Id = user_profile.ID JOIN users ON user_profile.userId = users.id WHERE users.id = ?;',
                    timeout: 40000,
                    values: [data.userId]
                }, (error, results) => {
                    if (error) {
                        attendanceLogger.trace('customer-attendance-fetchalluserAttendance - ' + data.userId + ' - error in fetching enrollment')
                        attendanceLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        return resolve({ status: 'success', msg: 'enrollment fetched', data: { enrollment: results, bResult: true } });
                    }
                });
            }
        }
        )
    }
    )
};   

latestattendance = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                attendanceLogger.trace('customer-attendance-fetchalluserAttendance - ' + data.userId + ' - error in db connection')
                attendanceLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT attendance.*, user_profile.displayName FROM attendance JOIN enrollments ON attendance.Enrollment_ID = enrollments.ID JOIN user_profile ON enrollments.User_profile_ID = user_profile.ID ORDER BY attendance.ID DESC LIMIT 10;',
                    timeout: 40000
                }, (error, results) => {
                    if (error) {
                        // var resultsHack = JSON.parse(JSON.stringify(results))
                        // console.log(results)
                        attendanceLogger.trace('customer-attendance-fetchalluserAttendance - ' + data.userId + ' - error in fetching attendance')
                        attendanceLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        return resolve({ status: 'success', msg: 'attendance fetched', data: { attendance: results, bResult: true } });
                    }
                });
            }
        }
        )
    }
    )
}

fetchtotaltime = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                attendanceLogger.trace('customer-attendance-fetchtotaltime - ' + data.userId + ' - error in db connection')
                attendanceLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT SUM(session) as totalTime FROM `attendance` WHERE `Enrollment_ID` = ?;',
                    timeout: 40000,
                    values: [data.enrollmentId]
                }, (error, results) => {
                    if (error) {
                        attendanceLogger.trace('customer-attendance-fetchtotaltime - ' + data.userId + ' - error in fetching attendance')
                        attendanceLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    }
                    else {
                        resultsHack = JSON.parse(JSON.stringify(results))
                        let totalTime = 0;
                        resultsHack.forEach((data) => {
                            totalTime += data.session;
                        });
                        conn.release();
                        return resolve({ status: 'success', msg: 'attendance fetched', data: { totalTime: resultsHack[0].totalTime, bResult: true } });
                    }
                })
            }
        })
    })
};
module.exports = {
    fetchAttendance,
    addAttendance,
    updateAttendance,
    fetchalluserAttendance,
    latestattendance,
    fetchtotaltime
};