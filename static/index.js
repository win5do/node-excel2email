// 上传文件
$('#excel').on('change', function () {
    let formData = new FormData();
    formData.append('excel', this.files[0]);

    $.ajax({
        url: '/post-excel',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: (res) => {
            console.log(res);
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
            content: getVal('#content')
        },
        (res) => {
            // 展开预览
            $('.preview-content').html(res.data);
            $('.hidden-div').slideDown();
        });
});


$('.send-email').click(() => {
    let email = getVal('#email');
    let pass = getVal('#pass');
    let host = getVal('#host');
    let port = getVal('#port');

    if (!(email && pass && host && port)) {
        alert('请完善发件邮箱信息');
        return;
    }

    $.post('/send-email',
        {
            email,
            pass,
            host,
            port,
        },
        (res) => {
            console.log(res);
        });
});