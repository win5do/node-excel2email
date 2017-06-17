let tmp = '你好,{{ $1 }}！你本月的工资共{{ $2 }}';

let handleTmp = (tmp) => {
    let code = ['let $ = this;', 'let r = [];'];
    let reg = /\{\{.*?\}\}/;
    // 加一行
    let addLine = function (text) {
        code.push('r.push(\"' + text + '\");');
    };

    let match = '';
    while (match = tmp.match(reg)) {
        addLine(tmp.substring(0, match.index));
        code.push('r.push('+ match[0] + ');');
        tmp = tmp.substring(match.index + match[0].length);
    }

    let regg = /\{\{.*?\$(\d+).*?\}\}/g;
    code = code.join('').replace(regg, '$$[$1]');
    return new Function(code);
};

let func = handleTmp(tmp);

console.log(func.apply(['李二狗', 45465]));

