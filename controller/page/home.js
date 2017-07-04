let io = require('../../main');
let excel = require('../handler/read-excel');
let createRender = require('../handler/create-render');
let sendEmail = require('../handler/send-email');

module.exports = {
    /**
     * 渲染模板
     */
    renderHome (req, res) {
        res.render('index', {title: 'rua'});
    },

    /**
     * 上传excel文件
     */
    uploadExcel (req, res) {
        req.session.excel = new excel(req.file);
        res.json({code: 200, msg: '上传成功'});
    },

    /**
     * 预览邮件
     */
    previewEmail (req, res) {
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
    },

    /**
     * 发送邮件
     */
    sendEmail (req, res) {
        if (!req.session.excel) {
            res.json({code: 404, msg: '请重新上传excel文件'});
            return;
        }

        let socketid = req.session.socketid;
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


        sendEmail.login(host, port, email, pass);
        let dataArr = req.session.excel.data;
        dataArr.forEach(async (el, i) => {
            if (i === 0) {
                return;
            }
            el = [null, ...el];
            // let info = await sendEmail.test(el);

            let info = await sendEmail.send(email, el[2], render.title.apply(el), render.content.apply(el));

            io.to(socketid).send(info);

            if (i === dataArr.length - 1) {
                req.session = null;
                io.to(socketid).send('发送完毕，用户数据已销毁');
            }
        });

        res.json({code: 200, msg: 'socket启动'});
    },

    /**
     * 图片上传
     */
    uploadImg (req, res) {
        if (req.file.path) {
            let root = process.cwd();
            let imgPath = req.file.path.replace(root, '').replace(/\\/g, '/');
            res.send(JSON.stringify({state: 'SUCCESS', url: imgPath}));
        } else {
            res.send(JSON.stringify({state: 'ERROR'}));
        }
    },
};