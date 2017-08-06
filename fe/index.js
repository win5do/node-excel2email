$(() => {
    /**
     * 配置emditor
     */
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

    $('select').material_select();

    /**
     * 上传excel
     */
    $('#excel').on('change', function () {
        let file = this.files[0];

        if (!file.name.match('.xlsx')) {
            Materialize.toast('请上传excel文件', 3000);
            return;
        }

        if (file > 10000000) {
            Materialize.toast('excel文件大小请不要超过10mb', 3000);
            return;
        }

        let formData = new FormData();

        formData.append('excel', file);

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

    /**
     * 取input value
     */
    let getVal = (selector) => {
        let val = $(selector).val() || null;
        return val && val.trim();
    };

    /**
     * 预览邮件
     */
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

    /**
     * 手动填写
     */
    $('.manual-input-btn').click(() => {
        $('.select-smtp').hide();
        $('.manual-input-smtp').show();
    });

    /**
     * 发送邮件
     */
    let sendFlag = false; // 发送flag 房子重复触发

    $('.send-email').click(() => {
        if (sendFlag) {
            return;
        }

        let email = getVal('#email');
        let pass = getVal('#pass');
        let select = $("#select-smtp").find("option:selected").val();
        let host = getVal('#host');
        let port = getVal('#port');
        let start = getVal('#start');
        host = host ? host : select;
        port = port ? port : 465;
        start = start ? start : 2;
        if (!(email && pass && host && port)) {
            Materialize.toast('请完善发件邮箱信息', 3000);
            return;
        }

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
                    start
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

    /**
     * icon-tips hover
     */
    let tipsW = $('.tips').width();
    $('.icon-tips').hover(
        function () {
            $(this).siblings().find('.tips').css({'transform': 'translateX(0)'});
        },
        function () {
            $(this).siblings().find('.tips').css({'transform': 'translateX(-100%)'});
        },
    )
});