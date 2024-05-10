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
                    sql: 'SELECT * FROM users;',
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

fetchuserprofilebrief = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `id`, `displayName`, `isActive`, `imageId`, `address`, `phoneNumber`, `createdAt` FROM user_profile WHERE `userId` = ?;',
                    timeout: 40000,
                    values: [data.userId]
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
                let sql = 'SELECT COUNT(*) as totalCount FROM user_profile WHERE `userId` = ?';
                const values = [data.userId];
                if (data.isActive !== undefined) {
                    sql += ' AND `isActive` = ?';
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
                    sql: 'INSERT INTO `user_profile` (`userId`, `displayName`, `aadhar`, `registeredName`, `phoneNumber`, `imageId`, `address`, `notes`, `agentId`) VALUES (?,?,?,?,?,?,?,?,?);',
                    timeout: 40000,
                    values: [data.userId, data.displayName, data.aadhar, data.registeredName, data.phoneNumber, data.imageId, data.address, data.notes, data.agentId]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        console.log(results);
                        return resolve({ status: 'success', msg: 'user profile created', data: { userId: results.insertId, Result: true } });
                    }
                })
            }
        })
    }
    )
};

fetchuserprofbyname = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT * FROM user_profile WHERE `registeredName` = ?;',
                    timeout: 40000,
                    values: [data.registeredName]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'user profile fetched', data: { data: resultsHack, bResult: true } });
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

updateuserprofile = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'UPDATE `user_profile` SET `displayName` = ?, `registeredName` = ?, `phoneNumber` = ?, `address` = ?, `notes` = ?, `agentId` = ?, `due` = ? WHERE `id` = ?;',
                    timeout: 40000,
                    values: [data.displayName, data.registeredName, data.phoneNumber, data.address, data.notes, data.agentId, data.due, data.id]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        return resolve({ status: 'success', msg: 'user profile updated', data: { sqllog: results, Result: true } });
                    }
                })
            }
        })
    })
};

module.exports = {
    fetchusers,
    fetchuserprofilebrief,
    fetchuserprofilecount,
    fetchuserprofiledetail,
    createuserprofile,
    fetchuserprofbyname,
    createuser,
    updateuserprofile
};