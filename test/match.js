// let tmp = '你好,{{ $1 }}！你本月的工资共{{ $2 }}';
// let reg = /\{\{.*?\}\}/;
// console.log(tmp.match(reg));

let codeStr = function () {
    let $ = arguments[0];
    let str = [];
    str.push('你好,');
    str.push($[0]);
    str.push('！你本月的工资共');
    str.push($[1]);
    return str.join('');
};

let r = codeStr([1, 2]);

console.log(r);