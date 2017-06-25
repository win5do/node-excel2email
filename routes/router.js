let express = require('express');
let router = express.Router();
let multer = require('multer');
let upload = multer({storage: multer.memoryStorage()});

let excel = require('../controller/read-excel');
let createRender = require('../controller/create-render');
let sendEmail = require('../controller/send-email');

router.get('/', (req, res) => {
    res.render('index', {title: 'salary'});
});

router.post('/post-excel', upload.single('excel'), (req, res) => {
    req.session.excel = new excel(req.file);
    res.json({code: 200, msg: '上传成功'});
});

function test() {
    return 2 + 3;
}

router.post('/preview-email', (req, res) => {
    if (!req.session.excel) {
        res.json({code: 404, msg: '请重新上传excel文件'});
        return;
    }

    let template = req.session.template = {
        title: req.body.title,
        content: req.body.content,
    };

    let render = {
        title: createRender(template.title),
        content: createRender(template.content),
    };

    let allData = req.session.excel.data;
    let exampleData = [null, ...allData[1]];
    let exampleTitle = `<h1>${render.title.apply(exampleData)}</h1>`;
    let exampleContent = `<div>${render.content.apply(exampleData)}</div>`;

    res.json({code: 200, msg: '渲染成功', data: exampleTitle + exampleContent});
});

router.post('/send-email', (req, res) => {
    if (!req.session.excel) {
        res.json({code: 404, msg: '请重新上传excel文件'});
        return;
    }

    let email = req.body.email;
    let pass = req.body.pass;
    let host = req.body.host;
    let port = req.body.port;

    let title = req.session.template.title;
    let content = req.session.template.content;
    let render = {
        title: createRender(title),
        content: createRender(content)
    };

    console.log(host, port, email, pass);

    sendEmail.login(host, port, email, pass);

    req.session.excel.data.forEach((el, i) => {
        if (i === 0) {
            return;
        }

        el = [null, ...el];
        sendEmail.send(email, el[2], render.title.apply(el), render.content.apply(el));
    });

    req.session = null;
    res.send('邮件发送中，信息销毁成功');
});

module.exports = router;