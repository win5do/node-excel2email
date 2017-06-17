let xlsx = require('node-xlsx').default;

const excel = xlsx.parse(`${process.cwd()}/excel/test.xlsx`);

excel[0].data.forEach(el => {
    console.log(el);
});

module.exports = excel[0].data;