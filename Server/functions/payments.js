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

fetchbilldetailsagent = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                paymentsLogger.trace('payment-fetchbilldetails - error in db connection')
                paymentsLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT a.ID AS agentId, a.DisplayName, a.RegisteredName, a.isActive, a.PhoneNumber, a.Address, b.Notes, b.ID AS billId, b.Date, b.Amount FROM bills b JOIN agent_profile a ON b.Agent_Id = a.ID WHERE b.ID = ?;',
                    timeout: 40000,
                    values: [data.billId]
                }, (error, results) => {
                    if (error) {
                        paymentsLogger.trace('payment-fetchbilldetails - error in select query')
                        paymentsLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    }
                    else {
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
                        console.log(JSON.stringify(data.date))
                        conn.query({
                            sql: 'INSERT INTO `bills` (`User_profile_ID`, `Agent_Id`, `Enrollment_ID`, `Date`, `Amount`, `Notes`) VALUES (?,?,?,?,?,?);',
                            timeout: 40000,
                            values: [data.userId === 'null' ? null : data.userId, data.agentId === 'null' ? null : data.agentId, data.enrollmentId === 'null' ? null : data.enrollmentId, data.date === 'null' ? null : data.date, data.amount === 'null' ? null : data.amount, data.notes === 'null' ? null : data.notes]
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

fetchbillbrief = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                paymentsLogger.trace('payment-fetchbillbrief - error in db connection')
                paymentsLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                const id = data.userID ;
                const query = 'SELECT b.ID AS billId, b.Date, b.Amount, e.Type, e.SubType AS subtype FROM bills b JOIN enrollments e ON b.Enrollment_ID = e.ID WHERE b.User_profile_ID = ?;';
                // console.log(query)
                // console.log(id)
                conn.query({
                    sql: query,
                    timeout: 40000,
                    values: [id]
                }, (error, results) => {
                    if (error) {
                        paymentsLogger.trace('payment-fetchbillbrief - error in select query')
                        paymentsLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'bill brief fetched', data: resultsHack });
                    }
                })
            }
        })
    })
};

fetchbillbriefagent = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                paymentsLogger.trace('payment-fetchbillbrief - error in db connection')
                paymentsLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                const id = data.agentId ;
                const query = 'SELECT b.ID AS billId, b.Date, b.Amount FROM bills b WHERE b.agent_Id = ? AND `Enrollment_ID` IS NULL;';
                // console.log(query)
                // console.log(id)
                conn.query({
                    sql: query,
                    timeout: 40000,
                    values: [id]
                }, (error, results) => {
                    if (error) {
                        paymentsLogger.trace('payment-fetchbillbrief - error in select query')
                        paymentsLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'bill brief fetched', data: resultsHack });
                    }
                })
            }
        })
    })
};

addagentdue = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                paymentsLogger.trace('payment-addagentdue - error in db connection')
                paymentsLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.beginTransaction((err) => {
                    if (err) {
                        paymentsLogger.trace('payment-addagentdue - error in begin transaction')
                        paymentsLogger.error(err)
                        conn.release();
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        conn.query({
                            sql: 'SELECT `DUE` FROM `agent_profile` WHERE `ID` = ?;',
                            timeout: 40000,
                            values: [data.agentId]
                        }, (error, results) => {
                            if (error) {
                                paymentsLogger.trace('payment-addagentdue - error in select query')
                                paymentsLogger.error(error)
                                return conn.rollback(() => {
                                    conn.release();
                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                });
                            } else {
                                var resultsHack = JSON.parse(JSON.stringify(results))
                                // console.log(resultsHack)
                                var due = parseInt(resultsHack[0].DUE) + parseInt(data.amount);
                                conn.query({
                                    sql: 'UPDATE `agent_profile` SET `DUE` = ? WHERE `ID` = ?;',
                                    timeout: 40000,
                                    values: [due, data.agentId]
                                }, (error, results) => {
                                    if (error) {
                                        paymentsLogger.trace('payment-addagentdue - error in update query')
                                        paymentsLogger.error(error)
                                        return conn.rollback(() => {
                                            conn.release();
                                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                                        });
                                    } else {
                                        conn.commit((err) => {
                                            if (err) {
                                                paymentsLogger.trace('payment-addagentdue - error in commiting queries')
                                                paymentsLogger.error(err)
                                                return conn.rollback(() => {
                                                    conn.release();
                                                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                                                });
                                            } else {
                                                conn.release();
                                                return resolve({ status: 'success', msg: 'agent due added', data: { bResult: true } });
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
    })
};

fetchagentdue = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                paymentsLogger.trace('payment-fetchagentdue - error in db connection')
                paymentsLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `paid`, `DUE` FROM `agent_profile` WHERE `ID` = ?;',
                    timeout: 40000,
                    values: [data.agentId]
                }, (error, results) => {
                    if (error) {
                        paymentsLogger.trace('payment-fetchagentdue - error in select query')
                        paymentsLogger.error(error)
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'agent due fetched', data: resultsHack[0] });
                    }
                })
            }
        })
    })
};

payagentdue = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                paymentsLogger.trace('payment-payagentdue - error in db connection')
                paymentsLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.beginTransaction((err) => {
                    if (err) {
                        paymentsLogger.trace('payment-payagentdue - error in begin transaction')
                        paymentsLogger.error(err)
                        conn.release();
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        conn.query({
                            sql: 'SELECT `DUE` FROM `agent_profile` WHERE `ID` = ?;',
                            timeout: 40000,
                            values: [data.agentId]
                        }, (error, results) => {
                            if (error) {
                                paymentsLogger.trace('payment-payagentdue - error in select query')
                                paymentsLogger.error(error)
                                return conn.rollback(() => {
                                    conn.release();
                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                });
                            } else {
                                var resultsHack = JSON.parse(JSON.stringify(results))
                                var due = parseInt(resultsHack[0].DUE) - parseInt(data.amount);
                                conn.query({
                                    sql: 'UPDATE `agent_profile` SET `DUE` = ? WHERE `ID` = ?;',
                                    timeout: 40000,
                                    values: [due, data.agentId]
                                }, (error, results) => {
                                    if (error) {
                                        paymentsLogger.trace('payment-payagentdue - error in update query')
                                        paymentsLogger.error(error)
                                        return conn.rollback(() => {
                                            conn.release();
                                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                                        });
                                    } else {
                                        conn.commit((err) => {
                                            if (err) {
                                                paymentsLogger.trace('payment-payagentdue - error in commiting queries')
                                                paymentsLogger.error(err)
                                                return conn.rollback(() => {
                                                    conn.release();
                                                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                                                });
                                            } else {
                                                conn.release();
                                                return resolve({ status: 'success', msg: 'agent due paid', data: { bResult: true } });
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
    })
};

payuserdue = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                paymentsLogger.trace('payment-payuserdue - error in db connection')
                paymentsLogger.error(err)
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.beginTransaction((err) => {
                    if (err) {
                        paymentsLogger.trace('payment-payuserdue - error in begin transaction')
                        paymentsLogger.error(err)
                        conn.release();
                        return reject({ status: 'failed', err: err, data: { bResult: false } });
                    } else {
                        conn.query({
                            sql: 'SELECT `paid` FROM `enrollments` WHERE `ID` = ?;',
                            timeout: 40000,
                            values: [data.enrollmentId]
                        }, (error, results) => {
                            if (error) {
                                paymentsLogger.trace('payment-payuserdue - error in select query')
                                paymentsLogger.error(error)
                                return conn.rollback(() => {
                                    conn.release();
                                    return reject({ status: 'failed', err: error, data: { bResult: false } });
                                });
                            } else {
                                var resultsHack = JSON.parse(JSON.stringify(results))
                                var paid = parseInt(resultsHack[0].paid) + parseInt(data.amount);
                                conn.query({
                                    sql: 'UPDATE `enrollments` SET `paid` = ? WHERE `ID` = ?;',
                                    timeout: 40000,
                                    values: [paid, data.enrollmentId]
                                }, (error, results) => {
                                    if (error) {
                                        paymentsLogger.trace('payment-payuserdue - error in update query')
                                        paymentsLogger.error(error)
                                        return conn.rollback(() => {
                                            conn.release();
                                            return reject({ status: 'failed', err: error, data: { bResult: false } });
                                        });
                                    } else {
                                        conn.commit((err) => {
                                            if (err) {
                                                paymentsLogger.trace('payment-payuserdue - error in commiting queries')
                                                paymentsLogger.error(err)
                                                return conn.rollback(() => {
                                                    conn.release();
                                                    return reject({ status: 'failed', err: err, data: { bResult: false } });
                                                });
                                            } else {
                                                conn.release();
                                                return resolve({ status: 'success', msg: 'user due paid', data: { bResult: true } });
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
    })
};

module.exports = {
    fetchbilldetails,
    fetchbilldetailsagent,
    createbill,
    fetchbillbrief,
    fetchbillbriefagent,
    addagentdue,
    fetchagentdue,
    payagentdue,
    payuserdue
};
