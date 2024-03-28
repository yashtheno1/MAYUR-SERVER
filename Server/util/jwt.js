const jwt = require("jsonwebtoken");

var constants = require("../constants");

//jwt creation
jwtCreate = (data) => {
    return new Promise(async (resolve, reject) => {
        jwt.sign({ data: data.data }, constants.SECRET_KEY, { expiresIn: data.expiry }, (err, token) => {
            if (token) {
                return resolve({ msg: token });
            } else {
                return resolve({ error: err });
            }
        })
    })
};

//jwt verify
jwtVerify = (data) => {
    return new Promise(async (resolve, reject) => {
        jwt.verify(data, constants.SECRET_KEY, (err, data) => {
            if (data) {
                return resolve({ msg: data });
            } else {
                return resolve({ error: err });
            }
        })
    })
};

module.exports = { jwtCreate, jwtVerify };