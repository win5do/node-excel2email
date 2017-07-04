let fs = require('fs');
let path = require('path');
let moment = require('moment');
let multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let root = process.cwd();
        let t = moment().format('YYYY-M-D');
        let distPath = `${root}/static/uploads/${t}`;

        if (!fs.existsSync(`${root}/static/uploads`)) {
            fs.mkdirSync(`${root}/static/uploads`);
        }

        if (!fs.existsSync(distPath)) {
            fs.mkdirSync(distPath);
        }

        cb(null, distPath);
    },

    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

let upload = multer({storage: storage});

module.exports = upload;