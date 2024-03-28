const nodemailer = require('nodemailer');
const axios = require('axios').default;

var constants = require('../constants');

//mail send NodeMailer
sendMail = (data) => {
    return new Promise(async (resolve, reject) => {
        let transporter = nodemailer.createTransport({
            host: constants.MAIL_HOST,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: constants.EMAIL_USER,
                pass: constants.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        transporter.sendMail({
            from: constants.EMAIL_USER,
            to: data.to,
            subject: data.subject,
            html: data.html
        }, (err, response) => {
            if (response) {
                return resolve({ msg: response });
            } else {
                return resolve({ error: err });
            }
        });
    })
};

//sms send
sendSms = (data) => {
    return new Promise(async (resolve, reject) => {
        let dataToSend = {
            secret_key: '$2b$10$rmmCdzKGRMv6SwBM0IXCZO/gerswFCEfyuDg41Nk79jOa8hISw7mG',
            header: 'SHIVNW',
            numbers: data.numbers,
            message_id: data.message_id,
            variables_values: data.variables_values
        }
        await axios.post(`https://api.reecraft.com/smsgatewayrequest/sendbulksms`, dataToSend)
            .then(res => {
                if (res.data.status == 'success') {
                    return resolve({ msg: 'success' });
                } else {
                    return resolve({ error: 'failed' });
                }
            })
            .catch(err => {
                return resolve({ error: err });
            })
    })
};

getGeoLocation = (pincode) => {
    return new Promise(async (resolve, reject) => {
        await axios.get(`https://api.reecraft.com/gglrequest/${pincode}`)
            .then(res => {
                if (res.data.status == 'success') {
                    return resolve({ msg: res.data.data });
                } else {
                    return resolve({ error: 'failed' });
                }
            })
            .catch(err => {
                return resolve({ error: err });
            })
    })
};

module.exports = { sendMail, sendSms, getGeoLocation };