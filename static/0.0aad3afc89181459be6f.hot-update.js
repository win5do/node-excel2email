webpackHotUpdate(0,{

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


$(function () {
    window.um = UM.getEditor('editor', {
        UMEDITOR_HOME_URL: '/static/umeditor/',
        toolbar: ['undo redo | justifyleft justifycenter justifyright justifyjustify |', 'bold italic underline strikethrough | forecolor backcolor removeformat |', 'paragraph fontfamily fontsize | insertorderedlist insertunorderedlist |', 'image horizontal source fullscreen'],
        initialFrameWidth: '100%',
        initialFrameHeight: 300,
        imageUrl: "/upload-img",
        imagePath: '' });

    $('#excel').on('change', function () {
        var formData = new FormData();
        formData.append('excel', this.files[0]);

        $.ajax({
            url: '/post-excel',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function success(res) {
                console.log(res);
            }
        });
    });

    var getVal = function getVal(selector) {
        var val = $(selector).val() || null;
        return val && val.trim();
    };

    $('.preview-btn').click(function () {
        $.post('/preview-email', {
            title: getVal('#title'),
            content: um.getContent()
        }, function (res) {
            $('.preview-content').html(res.data);
            $('.hidden-div').slideDown();
        });
    });

    $('.send-email').click(function () {
        var email = getVal('#email');
        var pass = getVal('#pass');
        var host = getVal('#host');
        var port = getVal('#port');

        if (!(email && pass && host && port)) {
            alert('请完善发件邮箱信息');
            return;
        }

        $.post('/send-email', {
            email: email,
            pass: pass,
            host: host,
            port: port
        }, function (res) {
            if (res.code === 200) {
                socket.on('message', function (data) {
                    console.log(data);
                });
            }
        });
    });

    var socket = io();
    socket.on('message', function (data) {
        alert(data);
    });
});

/***/ })

})