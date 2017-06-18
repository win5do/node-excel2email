let xlsx = require('node-xlsx').default;

const excel = xlsx.parse(`${process.cwd()}/excel/test.xlsx`);

console.log(excel[0].data);

module.exports = excel[0].data;