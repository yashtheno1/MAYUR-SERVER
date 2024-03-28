const multer = require('multer');
const path = require('path');

const generators = require('./generators');

//uploading multiple files with multer
multerUpload = async (req, res, pathToUpload) => {
    return new Promise(async (resolve, reject) => {
        var filenameArray = [];
        var filename = '';

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.join(__basedir, pathToUpload));
            },
            filename: async (req, file, cb) => {
                var randomNumber = await generators.genAllInOne(true, true, true, 10);
                filename = Date.now().toString() + randomNumber.toString() + '.' + file.mimetype.slice(6)
                filenameArray.push(filename)
                cb(null, filename);
            }
        });

        const upload = multer({ storage: storage }).array('files', 20);

        upload(req, res, (err) => {
            if (err instanceof multer.MulterError || err) {
                return resolve({ error: err });
            } else {
                return resolve({ msg: 'Images Uploaded', bodyObj: req.body, filenameArray: filenameArray });
            }
        })
    })
};

module.exports = { multerUpload };
