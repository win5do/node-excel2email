let express = require('express');
let router = express.Router();
let multer = require('multer');
let uploadM = multer({storage: multer.memoryStorage()});
let uploadD = require('../controller/handler/upload');

let homeController = require('../controller/page/home');

router.get('/', homeController.renderHome);

router.post('/upload-img', uploadD.single('upfile'), homeController.uploadImg);

router.post('/upload-excel', uploadM.single('excel'), homeController.uploadExcel);

router.post('/preview-email', homeController.previewEmail);

router.post('/send-email', homeController.sendEmail);

module.exports = router;