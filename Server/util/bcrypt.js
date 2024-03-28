const bcrypt = require("bcryptjs");

//hashing password
hashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (hash) {
                return resolve({ msg: hash });
            } else {
                resolve({ error: err });
            }
        })
    })
};

//compare password
comparePassword = (passwords) => {
    return new Promise(async (resolve, reject) => {
        var arePasswordsMatching = bcrypt.compareSync(passwords.inputPassword, passwords.databasePassword)
        if (arePasswordsMatching) {
            return resolve({ msg: true });
        } else {
            return resolve({ error: false });
        }
    })
};

module.exports = { hashPassword, comparePassword };
