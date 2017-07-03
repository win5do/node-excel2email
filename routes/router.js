let express = require('express');
let router = express.Router();
let io = require('../main');
let multer = require('multer');
let uploadM = multer({storage: multer.memoryStorage()});
let uploadD = require('../controller/upload');

let excel = require('../controller/read-excel');
let createRender = require('../controller/create-render');
let sendEmail = require('../controller/send-email');

router.get('/', (req, res) => {
    res.render('index', {title: 'salary'});
});

router.post('/post-excel', uploadM.single('excel'), (req, res) => {
    req.session.excel = new excel(req.file);
    res.json({code: 200, msg: '上传成功'});
});

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
    // todo dek after test
    req.session.excel = {
        data: [1, 2, 3]
    };

    let socketid =  req.session.socketid;


    // if (!req.session.excel) {
    //     res.json({code: 404, msg: '请重新上传excel文件'});
    //     return;
    // }

    // let email = req.body.email;
    // let pass = req.body.pass;
    // let host = req.body.host;
    // let port = req.body.port;
    //
    // let title = req.session.template.title;
    // let content = req.session.template.content;
    // let render = {
    //     title: createRender(title),
    //     content: createRender(content)
    // };


    // sendEmail.login(host, port, email, pass);

    req.session.excel.data.forEach(async (el, i) => {
        if (i === 0) {
            return;
        }
        // el = [null, ...el];
        let r = await sendEmail.test(el);
        console.log(socketid);
        io.to(socketid).send(r);

        // sendEmail.send(email, el[2], render.title.apply(el), render.content.apply(el));
    });
    io.to(socketid).send('清空前');
    req.session = null;
    res.json({code: 200, msg: 'socket启动'});
});


// 图片上传
router.post('/upload-img', uploadD.single('upfile'), (req, res) => {
    if (req.file.path) {
        let root = process.cwd();
        let imgPath = req.file.path.replace(root, '').replace(/\\/g, '/');
        res.send(JSON.stringify({state: 'SUCCESS', url: imgPath}));
    } else {
        res.send(JSON.stringify({state: 'ERROR'}));
    }
});

module.exports = router;