let createRender = (tmp) => {
    // 给数组补一位
    let code = ['let $ = [null, ...this];', 'let r = [];'];
    let reg = /\{\{.*?\}\}/;
    let match;
    // 加一行
    let addLine = function (text) {
        code.push('r.push(\"' + text + '\");');
    };

    while (match = tmp.match(reg)) {
        addLine(tmp.substring(0, match.index));
        // 将模板转换为表达式
        let expression = match[0].replace(/(\{\{)(.*?)(\}\})/, '$2').replace(/\$(\d+)/g, '$$[$1]');
        code.push('r.push(' + expression + ');');
        tmp = tmp.substring(match.index + match[0].length);
    }

    code.push("return r.join('');");

    console.log(code.join(''));

    return new Function(code.join(''));
};

module.exports = createRender;