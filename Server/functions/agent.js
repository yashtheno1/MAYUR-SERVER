const dbpool = require('../database');

const constants = require('../constants');

const bcrypt = require('../util/bcrypt');
const jwt = require('../util/jwt');
const generators = require('../util/generators');
const services = require('../util/services');

const agentLogger = require('log4js').getLogger('agent');

createagent = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                agentLogger.trace('agent-agent-createAgent - ' + data.phoneNumber + ' - error in db connection')
                agentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'INSERT INTO `agent_profile` (`displayName`,`registeredName`,`phoneNumber`, `imageId`,`address`,`notes`,`userId`,`due`) VALUES (?,?,?,?,?,?,?,?);',
                    timeout: 40000,
                    values: [data.displayName, data.registeredName, data.phoneNumber, data.imageId, data.address, data.notes, data.userId, data.due]
                }, (error, results) => {
                    if (error) {
                        agentLogger.trace('agent-agent-createAgent - ' + data.phoneNumber + ' - error in insert query')
                        agentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        return resolve({ status: 'success', msg: 'agent created', data: { agentId: results.insertId, bResult: true } });
                    }
                })

            }
        })
    })
}

fetchAgentProfileBrief = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                agentLogger.trace('agent-agent-fetchAgentProfileBrief - error in db connection')
                agentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `id`, `displayName`, `phoneNumber`, `due`, `createdAt` FROM `agent_profile` WHERE `userId` = ?;',
                    timeout: 40000,
                    values: [data.userId]
                }, (error, results) => {
                    if (error) {
                        agentLogger.trace('agent-agent-fetchAgentProfileBrief - error in select query')
                        agentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'agent profile brief fetched', data: resultsHack });
                    }
                })

            }
        })
    })
}

fetchAgentLinkedUserCount = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                agentLogger.trace('agent-agent-fetchAgentLinkedUserCount - error in db connection')
                agentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT COUNT(*) AS count FROM `user_profile` WHERE `agentId` = ?;',
                    timeout: 40000,
                    values: [data.agentId]
                }, (error, results) => {
                    if (error) {
                        agentLogger.trace('agent-agent-fetchAgentLinkedUserCount - error in select query')
                        agentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'agent linked user count fetched', data: resultsHack[0] });
                    }
                })

            }
        })
    })
}

fetchAgentProfileDetails = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                agentLogger.trace('agent-agent-fetchAgentProfileDetails - error in db connection')
                agentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT * FROM `agent_profile` WHERE `id` = ?;',
                    timeout: 40000,
                    values: [data.agentId]
                }, (error, results) => {
                    if (error) {
                        agentLogger.trace('agent-agent-fetchAgentProfileDetails - error in select query')
                        agentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'agent profile details fetched', data: resultsHack[0] });
                    }
                })

            }
        })
    })
}

fetchAgentLinkedUserProfiles = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                agentLogger.trace('agent-agent-fetchAgentLinkedUserProfiles - ' + data.agentId + ' - error in db connection')
                agentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `id`, `displayName`, `isActive`, `imageId`, `phoneNumber`, `createdAt` FROM `user_profile` WHERE `agentId` = ?;',
                    timeout: 40000,
                    values: [data.agentId]
                }, (error, results) => {
                    if (error) {
                        agentLogger.trace('agent-agent-fetchAgentLinkedUserProfiles - ' + data.agentId + ' - error in select query')
                        agentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'agent linked user profiles fetched', data: resultsHack });
                    }
                })

            }
        })
    })
};

fetchUserLinkedAgentProfile = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                agentLogger.trace('agent-agent-fetchUserLinkedAgentProfile - ' + data.userId + ' - error in db connection')
                agentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `id`, `displayName`, `isActive`, `imageId`, `createdAt` FROM `agent_profile` WHERE `ID` = ?;',
                    timeout: 40000,
                    values: [data.agentId]
                }, (error, results) => {
                    if (error) {
                        agentLogger.trace('agent-agent-fetchUserLinkedAgentProfile - ' + data.userId + ' - error in select query')
                        agentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'user linked agent profile fetched', data: resultsHack[0] });
                    }
                })

            }
        })
    })
};

updateagentprofile = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                agentLogger.trace('agent-agent-updateAgentProfile - ' + data.agentId + ' - error in db connection')
                agentLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'UPDATE `agent_profile` SET `displayName` = ?, `registeredName` = ?, `phoneNumber` = ?, `imageId` = ?, `address` = ?, `notes` = ?, `due` = ? WHERE `id` = ?;',
                    timeout: 40000,
                    values: [data.displayName, data.registeredName, data.phoneNumber, data.imageId, data.address, data.notes, data.due, data.agentId]
                }, (error, results) => {
                    if (error) {
                        agentLogger.trace('agent-agent-updateAgentProfile - ' + data.agentId + ' - error in update query')
                        agentLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        return resolve({ status: 'success', msg: 'agent profile updated', data: { bResult: true } });
                    }
                })

            }
        })
    })
};

module.exports = {
    createagent,
    fetchAgentProfileBrief,
    fetchAgentLinkedUserCount,
    fetchAgentProfileDetails,
    fetchAgentLinkedUserProfiles,
    fetchUserLinkedAgentProfile,
    updateagentprofile
};