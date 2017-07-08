$(() => {
    // 配置emditor
    window.um = UM.getEditor('editor', {
        UMEDITOR_HOME_URL: '/static/umeditor/',
        toolbar: [
            'undo redo | justifyleft justifycenter justifyright justifyjustify |',
            'bold italic underline strikethrough | forecolor backcolor removeformat |',
            'paragraph fontfamily fontsize | insertorderedlist insertunorderedlist |',
            'image horizontal source fullscreen',
        ],
        initialFrameWidth: '100%',
        initialFrameHeight: 300,
        imageUrl: "/upload-img",
        imagePath: '', // 返回的就是正确地址
    });

    // 上传文件
    $('#excel').on('change', function () {
        let formData = new FormData();
        formData.append('excel', this.files[0]);

        $.ajax({
            url: '/upload-excel',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: (res) => {
                Materialize.toast(res.msg, 3000);
            }
        });
    });

    // 取input值
    let getVal = (selector) => {
        let val = $(selector).val() || null;
        return val && val.trim();
    };

    // 预览按钮
    $('.preview-btn').click(() => {
        $.post('/preview-email',
            {
                title: getVal('#title'),
                content: um.getContent(),
            },
            (res) => {
                if (res.code === 200) {
                    // 展开预览
                    $('.preview-content').html(res.data);
                    $('.hidden-div').slideDown();
                } else {
                    Materialize.toast(res.msg, 3000);
                }
            });
    });

    let sendFlag = false; // 发送flag 房子重复触发

    $('.send-email').click(() => {
        if (sendFlag) {
            return;
        }


        let email = getVal('#email');
        let pass = getVal('#pass');
        let host = getVal('#host');
        let port = getVal('#port');

        // if (!(email && pass && host && port)) {
        //     alert('请完善发件邮箱信息');
        //     return;
        // }

        let socket = io();

        socket.on('connect', () => {
            // 禁用按钮 修改颜色
            sendFlag = true;
            $('.send-email').css('background-color', '#ccc');

            $.post('/send-email',
                {
                    email,
                    pass,
                    host,
                    port,
                },
                (res) => {
                    if (res.code === 200) {
                        Materialize.toast('邮件发送中', 3000);
                    } else {
                        // 服务端404 隐藏发送部分
                        Materialize.toast(res.msg, 3000);
                        $('.hidden-div').slideUp();
                        sendFlag = false;
                        socket.close();
                    }
                });
        });

        socket.on('message', (data) => {
            Materialize.toast(data, 3000);
        });

        /**
         * 发送失败 插入html
         */
        socket.on('defeat', (data) => {
            $('.defeat').show();
            $('.defeat-list').html(data.join('<br>'));
        });
    });
});