$('.excel').click(() => {
    let data = $('.input').val();
    $.post('/post-excel', {data}, (res) => {
        console.log(res);
    });
});

$('.tmp').click(() => {
    $.post('/post-tmp', null, (res) => {
        console.log(res);
    });
});

