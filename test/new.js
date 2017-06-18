let reg = /(\{\{).*?\$(\d+).*?(\}\})/g;

// let  r=  '{{ $1 + $2 }}'.match(reg);
let  r=  '{{ $1 + $2 }}'.replace(/(\{\{)(.*?)(\}\})/, '$2').replace(/\$(\d+)/g, '$$[$1]');

console.log(r);