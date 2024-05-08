const dbpool = require('../database');
const path = require('path');
const fs = require('fs');

const constants = require('../constants');

const jwt = require('../util/jwt');
const multer = require("multer");

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

const { create } = require('domain');

const otherLogger = require('log4js').getLogger('other');

createenquiries = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'INSERT INTO `enquiries` (`name`, `phone`, `message`, `user_ID`) VALUES (?,?,?,?);',
                    timeout: 40000,
                    values: [data.name, data.phone, data.message, data.userId]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        return resolve({ status: 'success', msg: 'enquiry created', data: { bResult: true } });
                    }
                })
            }
        })
    })
};

fetchenquiries = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'SELECT `ID`, `name`, `phone`, `message` FROM `enquiries` WHERE `user_ID` = ?;',
                    timeout: 40000,
                    values: [data.userId]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'enquiries fetched', data: { enquiries: resultsHack, bResult: true } });
                    }
                })
            }
        })
    })
};

createactivity = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                conn.query({
                    sql: 'INSERT INTO `activity` (`User_profile_ID`, `Agent_ID`, `Note`, `Activity`) VALUES (?,?,?,?);',
                    timeout: 40000,
                    values: [data.userId, data.agentId, data.note, data.activity]
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        conn.release();
                        return resolve({ status: 'success', msg: 'activity created', data: { bResult: true } });
                    }
                })
            }
        })
    })
};

fetchactivity = (data) => {
    return new Promise(async (resolve, reject) => {
        dbpool.getConnection((err, conn) => {
            if (err) {
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                var query = 'SELECT `ID`, `User_profile_ID`, `Agent_ID`, `Note`, `Activity` FROM `activity` WHERE `User_profile_ID` = ?;';
                var values = [data.userId]
                if (data.agentId) {
                    query = 'SELECT `ID`, `User_profile_ID`, `Agent_ID`, `Note`, `Activity` FROM `activity` WHERE `Agent_ID` = ?;';
                    values = [data.agentId]
                }
                conn.query({
                    sql: query,
                    timeout: 40000,
                    values: values
                }, (error, results) => {
                    if (error) {
                        conn.release();
                        return reject({ status: 'failed', err: error, data: { bResult: false } });
                    } else {
                        var resultsHack = JSON.parse(JSON.stringify(results))
                        conn.release();
                        return resolve({ status: 'success', msg: 'activity fetched', data: { activity: resultsHack, bResult: true } });
                    }
                })
            }
        })
    })
};

uploadimage = (req, res) => {
    return new Promise(async (resolve, reject) => {
        if (!req.file) {
            console.log('req is empty');
            return reject({ status: 'failed', err: 'No file uploaded', data: { bResult: false } });
        }
        // console.log('uploading image');
        upload.single('image')(req, res, (err) => {
            if (err) {
                console.log('error uploading image');
                return reject({ status: 'failed', err: err, data: { bResult: false } });
            } else {
                return resolve({ status: 'success', msg: 'image uploaded', data: { imageId: req.file.filename, imageName: req.file.filename, bResult: true } });
            }
        });
    })
}

fetchimage = (data) => {
    return new Promise(async (resolve, reject) => {
        var imagePath = path.join(constants.GENERAL_PATH_FOR_IMAGES, 'uploads', data.imagename);
        return resolve({ status: 'success', msg: 'image path fetched', data: { imagePath: imagePath, bResult: true } });
    })
}

module.exports = {
    fetchenquiries,
    createenquiries,
    createactivity,
    fetchactivity,
    uploadimage,
    fetchimage
};
