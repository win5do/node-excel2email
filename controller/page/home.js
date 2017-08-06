let io = require('../../main');
let excel = require('../handler/read-excel');
let createRender = require('../handler/create-render');
let sendEmail = require('../handler/send-email');

module.exports = {
    /**
     * 渲染模板
     */
    renderHome(req, res) {
        res.render('index', {title: 'rua'});
    },

    /**
     * 上传excel文件
     */
    uploadExcel(req, res) {
        req.session.excel = new excel(req.file);
        res.json({code: 200, msg: '上传成功'});
    },

    /**
     * 预览邮件
     */
    previewEmail(req, res) {
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
    sendEmail(req, res) {
        if (!req.session.excel) {
            res.json({code: 404, msg: '请重新上传excel文件'});
            return;
        }

        let socketid = req.session.socketid;
        let email = req.body.email;
        let pass = req.body.pass;
        let host = req.body.host;
        let port = req.body.port;
        let start = req.body.start;

        if (!(email && pass && host && port)) {
            res.json({code: 404, msg: '信息不全'});
            return;
        }

        if (!start || isNaN(start)) {
            start = 2;
        }

        let title = req.session.template.title;
        let content = req.session.template.content;
        let render = {
            title: createRender(title),
            content: createRender(content)
        };


        sendEmail.login(host, port, email, pass);

        let dataArr = req.session.excel.data;
        let total = 0;
        let sendDefeat = []; // 失败列表
        let promises = [];
        dataArr.every((el, i) => {
            if (i < start - 1 || !el[2]) {
                return true;
            }
            total++;
            el = [null, ...el];

            promises.push(
                sendEmail.send(email, el[2], render.title.apply(el), render.content.apply(el),
                    info => {
                        if (info.rejected.length) {
                            // 加入失败列表
                            sendDefeat = [...sendDefeat, ...info.rejected];
                        } else {
                            io.to(socketid).send(el[1] + '发送成功');
                        }
                    }
                )
            );
        });

        (async () => {
            await Promise.all(promises);

            let defeatCount = sendDefeat.length; // 失败数量
            let successCount = total - sendDefeat.length; // 成功数量

            io.to(socketid).send(`发送完毕，成功：${successCount}， 失败: ${defeatCount}`);

            if (defeatCount !== 0) {
                io.to(socketid).emit('defeat', sendDefeat);
            }

            io.sockets.connected[socketid].disconnect(true);
            req.session = null;
        })();


        res.json({code: 200, msg: '邮件发送中'});
    },

    /**
     * 图片上传
     */
    uploadImg(req, res) {
        if (req.file.path) {
            let root = process.cwd();
            let imgPath = req.file.path.replace(root, '').replace(/\\/g, '/');
            res.send(JSON.stringify({state: 'SUCCESS', url: imgPath}));
        } else {
            res.send(JSON.stringify({state: 'ERROR'}));
        }
    },
};